"""
AdCheck India — Groq-powered Analysis Service

Pipeline for IMAGES (3 steps):
  1 → Vision extraction: llama-3.2-vision reads image, extracts all text/claims
  2 → ChromaDB search: find most relevant ASCI/CCPA rules
  3 → Compliance analysis: llama-3.3-70b flags issues with rule citations

Pipeline for VIDEOS (4 steps):
  1 → Frame extraction: OpenCV samples a frame every 3 seconds (max 8 frames)
  2 → Per-frame vision: llama-3.2-vision reads each frame, extracts claims + timestamp
  3 → Aggregation: Merge all frame results, deduplicate, build timeline
  4 → ChromaDB + Compliance: Same as image pipeline on aggregated content
"""
import json
import uuid
import base64
import logging
import asyncio
from datetime import datetime

from groq import AsyncGroq

from config import get_settings
from services.vector_db import get_vector_db
from services.video_processor import VideoProcessor, VideoFrame, get_video_processor

logger = logging.getLogger(__name__)
settings = get_settings()


# ─────────────────────────────────────────────────────────────────────────────
# Prompts
# ─────────────────────────────────────────────────────────────────────────────

IMAGE_EXTRACTION_PROMPT = """You are an expert at reading advertisements.

Look at this image carefully and extract ALL of the following:

1. **All visible text** — every word, slogan, tagline, headline
2. **Product claims** — anything the product claims to do ("cures acne", "guaranteed results")
3. **Visual claims** — before/after comparisons, skin transformations, body changes shown visually
4. **Disclosures** — any #ad, #sponsored, #paid, disclaimer text visible
5. **Brand name and product type**
6. **Endorsements** — any celebrity, doctor, or influencer present

Return a JSON object (no markdown):
{
  "brand_name": "...",
  "product_type": "...",
  "all_visible_text": ["text 1", "text 2"],
  "product_claims": ["claim 1", "claim 2"],
  "visual_claims": ["visual element 1"],
  "disclosures_found": ["#ad"],
  "endorsers": ["name"],
  "combined_summary": "A single paragraph summarizing everything in the ad."
}"""

VIDEO_FRAME_PROMPT = """You are analyzing a frame from a video advertisement.
This frame is at timestamp {timestamp}s.

Extract everything visible in this frame:
1. All on-screen text, overlays, captions
2. Product claims or benefit statements
3. Visual demonstrations (before/after, product in use)
4. Any #ad / #sponsored disclosures
5. Brand name, product shown
6. Any celebrity or influencer visible

Return JSON only (no markdown):
{
  "timestamp_sec": {timestamp},
  "on_screen_text": ["..."],
  "claims": ["..."],
  "visual_demonstrations": ["..."],
  "disclosures": ["..."],
  "brand_name": "...",
  "product_visible": "...",
  "key_scene_description": "One sentence describing what is happening in this frame."
}"""

COMPLIANCE_PROMPT = """You are AdCheck India — a strict compliance officer for Indian advertising regulations.

Advertisement category: **{category}**
Influencer content: **{is_influencer}**
Media type: **{media_type}**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT EXTRACTED FROM THE AD:
{extracted_content}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RELEVANT COMPLIANCE RULES:
{rules_context}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TASK:
Review every claim and visual element. For each issue, assign:
- verdict: "violation" | "risky" | "needs_review" | "pass"
- severity: "high" | "medium" | "low"
- For VIDEO issues, include timestampSeconds if it was detected at a specific frame.

Scoring:
- 70-100 = High risk (violations present)
- 40-69  = Medium risk (risky/grey area claims)
- 0-39   = Low risk (mostly compliant)

Return ONLY valid JSON (no markdown, no extra text):
{{
  "overall_risk": "high" | "medium" | "low",
  "score": <0-100>,
  "issues": [
    {{
      "id": "i1",
      "claimText": "<exact claim or visual element>",
      "source": "photo" | "video" | "caption",
      "timestampSeconds": <number or null>,
      "verdict": "violation" | "risky" | "needs_review" | "pass",
      "severity": "high" | "medium" | "low",
      "ruleId": "<e.g. ASCI-H-1>",
      "ruleName": "<rule title>",
      "ruleText": "<short relevant excerpt from the rule>",
      "explanation": "<1-2 sentences on why this is an issue>",
      "suggestedRewrite": "<compliant alternative, or null for pass>"
    }}
  ]
}}"""


# ─────────────────────────────────────────────────────────────────────────────
# Main Analyzer
# ─────────────────────────────────────────────────────────────────────────────

class AdAnalyzer:
    def __init__(self):
        self.client = AsyncGroq(api_key=settings.groq_api_key)
        self.db = get_vector_db()
        self.video_processor = get_video_processor()

    # ─── Public Entry Points ───────────────────────────────────────────────

    async def analyze_image(
        self,
        image_bytes: bytes,
        category: str,
        is_influencer: bool,
        caption: str | None = None,
    ) -> dict:
        """Full pipeline for a single image."""
        logger.info("=== IMAGE ANALYSIS PIPELINE ===")

        # Step 1: Extract content from image
        extracted = await self._extract_from_image(image_bytes, caption)
        logger.info(f"Extracted summary: {extracted.get('combined_summary', '')[:150]}")

        # Step 2 & 3: RAG + Compliance
        report = await self._rag_and_analyze(
            extracted_summary=extracted,
            category=category,
            is_influencer=is_influencer,
            media_type="image",
        )

        return self._build_report(report, extracted, category, is_influencer, caption, "image")

    async def analyze_video(
        self,
        video_bytes: bytes,
        category: str,
        is_influencer: bool,
        caption: str | None = None,
    ) -> dict:
        """Full pipeline for a video — extracts frames, analyzes each, aggregates."""
        logger.info("=== VIDEO ANALYSIS PIPELINE ===")

        # Step 1: Extract frames from video
        try:
            frames = self.video_processor.extract_frames(video_bytes)
        except ValueError as e:
            raise RuntimeError(str(e))

        if not frames:
            raise RuntimeError("No frames could be extracted from the video.")

        logger.info(f"Analyzing {len(frames)} frames...")

        # Step 2: Run vision extraction on each frame (concurrently, max 3 at once)
        frame_results = await self._extract_all_frames(frames)

        # Step 3: Aggregate all frame results into unified extracted content
        aggregated = self._aggregate_frame_results(frame_results, caption)
        logger.info(f"Aggregated from {len(frame_results)} frames.")

        # Step 4 & 5: RAG + Compliance
        report = await self._rag_and_analyze(
            extracted_summary=aggregated,
            category=category,
            is_influencer=is_influencer,
            media_type="video",
        )

        return self._build_report(report, aggregated, category, is_influencer, caption, "video", frame_results)

    # ─── Frame Processing ──────────────────────────────────────────────────

    async def _extract_all_frames(self, frames: list[VideoFrame]) -> list[dict]:
        """
        Run vision extraction on each frame.
        Uses a semaphore to limit concurrency (avoid Groq rate limits).
        """
        semaphore = asyncio.Semaphore(2)  # Max 2 concurrent Groq calls

        async def extract_one(frame: VideoFrame) -> dict:
            async with semaphore:
                logger.info(f"Extracting frame at {frame.timestamp_sec}s...")
                result = await self._extract_from_video_frame(frame)
                return result

        results = await asyncio.gather(*[extract_one(f) for f in frames])
        return [r for r in results if r is not None]

    async def _extract_from_video_frame(self, frame: VideoFrame) -> dict | None:
        """Run llama-3.2-vision on a single video frame."""
        b64 = base64.b64encode(frame.jpeg_bytes).decode("utf-8")
        prompt = VIDEO_FRAME_PROMPT.replace("{timestamp}", str(frame.timestamp_sec))

        try:
            response = await self.client.chat.completions.create(
                model=settings.vision_model,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image_url",
                                "image_url": {"url": f"data:image/jpeg;base64,{b64}"},
                            },
                            {"type": "text", "text": prompt},
                        ],
                    }
                ],
                temperature=0.1,
                max_tokens=800,
                response_format={"type": "json_object"},
            )
            data = json.loads(response.choices[0].message.content)
            data["timestamp_sec"] = frame.timestamp_sec  # ensure timestamp is set
            return data

        except Exception as e:
            logger.warning(f"Frame {frame.timestamp_sec}s extraction failed: {e}")
            return {"timestamp_sec": frame.timestamp_sec, "claims": [], "on_screen_text": [], "error": str(e)}

    def _aggregate_frame_results(
        self, frame_results: list[dict], caption: str | None
    ) -> dict:
        """Merge all per-frame extractions into one unified content dict."""
        all_text: list[str] = []
        all_claims: list[str] = []
        all_visuals: list[str] = []
        all_disclosures: list[str] = []
        all_endorsers: list[str] = []
        brand_name = ""
        product_type = ""
        frame_summaries: list[str] = []

        for frame in frame_results:
            ts = frame.get("timestamp_sec", 0)

            for text in frame.get("on_screen_text", []):
                if text and text not in all_text:
                    all_text.append(text)

            for claim in frame.get("claims", []):
                if claim and claim not in all_claims:
                    # Tag each claim with its timestamp
                    all_claims.append(f"[{ts}s] {claim}")

            for visual in frame.get("visual_demonstrations", []):
                if visual and visual not in all_visuals:
                    all_visuals.append(f"[{ts}s] {visual}")

            for disc in frame.get("disclosures", []):
                if disc and disc not in all_disclosures:
                    all_disclosures.append(disc)

            if not brand_name and frame.get("brand_name"):
                brand_name = frame["brand_name"]

            if not product_type and frame.get("product_visible"):
                product_type = frame["product_visible"]

            desc = frame.get("key_scene_description", "")
            if desc:
                frame_summaries.append(f"[{ts}s] {desc}")

        if caption:
            all_text.append(f"Caption: {caption}")

        combined_summary = (
            f"Video ad for '{brand_name}' ({product_type}). "
            f"Frames analyzed: {', '.join(frame_summaries[:5])}. "
            f"Claims found: {', '.join(all_claims[:8])}. "
            f"Disclosures: {all_disclosures or 'None found'}."
        )

        return {
            "brand_name": brand_name,
            "product_type": product_type,
            "all_visible_text": all_text,
            "product_claims": all_claims,
            "visual_claims": all_visuals,
            "disclosures_found": all_disclosures,
            "endorsers": all_endorsers,
            "combined_summary": combined_summary,
            "frame_count": len(frame_results),
            "frames_detail": frame_results,
        }

    # ─── Image Extraction ─────────────────────────────────────────────────

    async def _extract_from_image(
        self, image_bytes: bytes, caption: str | None
    ) -> dict:
        """Use llama-3.2-vision to extract all content from an image."""
        b64 = base64.b64encode(image_bytes).decode("utf-8")
        mime = self._detect_image_mime(image_bytes)

        prompt = IMAGE_EXTRACTION_PROMPT
        if caption:
            prompt += f"\n\nUSER-PROVIDED CAPTION:\n{caption}"

        try:
            response = await self.client.chat.completions.create(
                model=settings.vision_model,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image_url",
                                "image_url": {"url": f"data:{mime};base64,{b64}"},
                            },
                            {"type": "text", "text": prompt},
                        ],
                    }
                ],
                temperature=0.1,
                max_tokens=1500,
                response_format={"type": "json_object"},
            )
            return json.loads(response.choices[0].message.content)

        except json.JSONDecodeError:
            raw = response.choices[0].message.content
            return {
                "brand_name": "", "product_type": "",
                "all_visible_text": [raw], "product_claims": [raw],
                "visual_claims": [], "disclosures_found": [], "endorsers": [],
                "combined_summary": raw,
            }
        except Exception as e:
            logger.error(f"Image extraction failed: {e}")
            raise RuntimeError(f"Image extraction failed: {str(e)}")

    # ─── RAG + Compliance ─────────────────────────────────────────────────

    async def _rag_and_analyze(
        self,
        extracted_summary: dict,
        category: str,
        is_influencer: bool,
        media_type: str,
    ) -> dict:
        """Search ChromaDB for rules, then run compliance analysis."""
        # Build ChromaDB search query
        search_query = self._build_search_query(extracted_summary, category, is_influencer)

        # Retrieve relevant rules
        relevant_rules = self.db.search_relevant_rules(
            query=search_query, category=category, n_results=10
        )
        logger.info(f"ChromaDB returned {len(relevant_rules)} relevant rules.")

        # Run compliance analysis
        return await self._run_compliance_analysis(
            extracted=extracted_summary,
            relevant_rules=relevant_rules,
            category=category,
            is_influencer=is_influencer,
            media_type=media_type,
        )

    async def _run_compliance_analysis(
        self,
        extracted: dict,
        relevant_rules: list[dict],
        category: str,
        is_influencer: bool,
        media_type: str,
    ) -> dict:
        """Run llama-3.3-70b compliance analysis."""
        # Remove large frame detail before sending (keep summary only)
        extracted_for_prompt = {k: v for k, v in extracted.items() if k != "frames_detail"}

        prompt = COMPLIANCE_PROMPT.format(
            category=category,
            is_influencer="Yes" if is_influencer else "No",
            media_type=media_type,
            extracted_content=json.dumps(extracted_for_prompt, indent=2),
            rules_context=self._format_rules(relevant_rules),
        )

        try:
            response = await self.client.chat.completions.create(
                model=settings.text_model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a strict Indian advertising compliance officer. "
                            "Return valid JSON only — no markdown, no preamble."
                        ),
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.2,
                max_tokens=3000,
                response_format={"type": "json_object"},
            )
            return json.loads(response.choices[0].message.content)

        except json.JSONDecodeError as e:
            logger.error(f"Compliance JSON parse error: {e}")
            return self._fallback_analysis()
        except Exception as e:
            logger.error(f"Compliance analysis error: {e}")
            raise RuntimeError(f"Compliance analysis failed: {str(e)}")

    # ─── Helpers ──────────────────────────────────────────────────────────

    def _build_search_query(
        self, extracted: dict, category: str, is_influencer: bool
    ) -> str:
        parts = [f"{category} advertising compliance India"]
        claims = extracted.get("product_claims", [])
        if claims:
            parts.append("claims: " + ". ".join(str(c) for c in claims[:6]))
        visuals = extracted.get("visual_claims", [])
        if visuals:
            parts.append("visuals: " + ". ".join(str(v) for v in visuals[:3]))
        if is_influencer:
            discs = extracted.get("disclosures_found", [])
            parts.append(
                "influencer sponsored " + (" ".join(discs) if discs else "missing #ad disclosure")
            )
        summary = extracted.get("combined_summary", "")
        if summary:
            parts.append(summary[:400])
        return " ".join(parts)

    def _format_rules(self, rules: list[dict]) -> str:
        if not rules:
            return "No specific rules found. Apply general ASCI guidelines."
        return "\n".join(
            f"[{r['rule_id']}] {r['title']} (Severity: {r['severity']}, "
            f"Relevance: {r['relevance_score']})\n{r['body']}\n"
            for r in rules
        )

    def _build_report(
        self,
        analysis: dict,
        extracted: dict,
        category: str,
        is_influencer: bool,
        caption: str | None,
        media_type: str,
        frame_results: list[dict] | None = None,
    ) -> dict:
        issues = analysis.get("issues", [])
        violations = sum(1 for i in issues if i.get("verdict") == "violation")
        risky = sum(1 for i in issues if i.get("verdict") == "risky")
        passed = sum(1 for i in issues if i.get("verdict") == "pass")

        report = {
            "id":          str(uuid.uuid4()),
            "createdAt":   datetime.utcnow().isoformat() + "Z",
            "category":    category,
            "isInfluencer": is_influencer,
            "mediaType":   media_type,
            "caption":     caption,
            "extractedContent": {
                "brandName":        extracted.get("brand_name", ""),
                "productType":      extracted.get("product_type", ""),
                "allVisibleText":   extracted.get("all_visible_text", []),
                "productClaims":    extracted.get("product_claims", []),
                "visualClaims":     extracted.get("visual_claims", []),
                "disclosuresFound": extracted.get("disclosures_found", []),
                "endorsers":        extracted.get("endorsers", []),
                "summary":          extracted.get("combined_summary", ""),
            },
            "overallRisk": analysis.get("overall_risk", "medium"),
            "score":       analysis.get("score", 50),
            "summary": {
                "violations": violations,
                "risky":      risky,
                "passed":     passed,
            },
            "issues": issues,
        }

        # Add video-specific timeline
        if media_type == "video" and frame_results:
            report["videoTimeline"] = [
                {
                    "timestampSec":      f.get("timestamp_sec", 0),
                    "sceneDescription":  f.get("key_scene_description", ""),
                    "claimsInFrame":     f.get("claims", []),
                    "textInFrame":       f.get("on_screen_text", []),
                    "disclosuresInFrame": f.get("disclosures", []),
                }
                for f in frame_results
            ]

        return report

    def _detect_image_mime(self, image_bytes: bytes) -> str:
        if image_bytes[:3] == b"\xff\xd8\xff":
            return "image/jpeg"
        if image_bytes[:8] == b"\x89PNG\r\n\x1a\n":
            return "image/png"
        if image_bytes[:4] == b"RIFF":
            return "image/webp"
        return "image/jpeg"

    def _fallback_analysis(self) -> dict:
        return {
            "overall_risk": "medium",
            "score": 50,
            "issues": [{
                "id": "fallback-1",
                "claimText": "Analysis could not be completed automatically",
                "source": "photo",
                "timestampSeconds": None,
                "verdict": "needs_review",
                "severity": "medium",
                "ruleId": "ASCI-G-1",
                "ruleName": "Manual Review Required",
                "ruleText": "Please review this ad manually.",
                "explanation": "Automated analysis failed. Manual review recommended.",
                "suggestedRewrite": None,
            }],
        }


def get_analyzer() -> AdAnalyzer:
    return AdAnalyzer()
