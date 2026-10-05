"""
API Routes - Analysis Endpoints
"""
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import Annotated
import logging

from services.analyzer import get_analyzer, AdAnalyzer
from config import get_settings, Settings

router = APIRouter(prefix="/api/v1", tags=["analysis"])
logger = logging.getLogger(__name__)

VALID_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
VALID_VIDEO_TYPES = {"video/mp4", "video/quicktime", "video/webm", "video/x-msvideo", "video/avi"}


@router.post("/analyze")
async def analyze_ad(
    category: Annotated[str, Form()],
    is_influencer: Annotated[bool, Form()] = False,
    caption: Annotated[str | None, Form()] = None,
    photo: Annotated[UploadFile | None, File()] = None,
    video: Annotated[UploadFile | None, File()] = None,
    analyzer: AdAnalyzer = Depends(get_analyzer),
    settings: Settings = Depends(get_settings),
):
    """
    Analyze an advertisement for compliance violations.

    - Upload a **photo** OR a **video** (not both required)
    - Caption is optional — content is auto-extracted from the image/video
    - For videos: frames are sampled every 3s (max 8 frames), each analyzed separately
    - Returns a compliance report with issues, timestamps (for video), and rewrites
    """

    if not photo and not video:
        raise HTTPException(
            status_code=422,
            detail="Provide at least one of: photo or video."
        )

    # ── IMAGE FLOW ────────────────────────────────────────────────────────
    if photo:
        if photo.content_type not in VALID_IMAGE_TYPES:
            raise HTTPException(
                status_code=422,
                detail=f"Invalid image type '{photo.content_type}'. Accepted: JPEG, PNG, WebP, GIF."
            )
        image_bytes = await photo.read()
        size_mb = len(image_bytes) / (1024 * 1024)
        if size_mb > settings.max_file_size_mb:
            raise HTTPException(
                status_code=413,
                detail=f"Image too large ({size_mb:.1f}MB). Max: {settings.max_file_size_mb}MB."
            )

        logger.info(
            f"[IMAGE] category={category}, influencer={is_influencer}, "
            f"size={size_mb:.2f}MB, caption={'yes' if caption else 'no'}"
        )

        try:
            report = await analyzer.analyze_image(
                image_bytes=image_bytes,
                category=category,
                is_influencer=is_influencer,
                caption=caption,
            )
            return JSONResponse(content=report)
        except RuntimeError as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ── VIDEO FLOW ────────────────────────────────────────────────────────
    if video:
        # Accept any video content-type (some browsers send application/octet-stream)
        if video.content_type not in VALID_VIDEO_TYPES and not video.content_type.startswith("video/"):
            raise HTTPException(
                status_code=422,
                detail=f"Invalid video type '{video.content_type}'. Accepted: MP4, MOV, WebM."
            )

        video_bytes = await video.read()
        size_mb = len(video_bytes) / (1024 * 1024)
        max_video_mb = 100  # Allow larger videos for video
        if size_mb > max_video_mb:
            raise HTTPException(
                status_code=413,
                detail=f"Video too large ({size_mb:.1f}MB). Max: {max_video_mb}MB."
            )

        logger.info(
            f"[VIDEO] category={category}, influencer={is_influencer}, "
            f"size={size_mb:.2f}MB, caption={'yes' if caption else 'no'}"
        )

        try:
            report = await analyzer.analyze_video(
                video_bytes=video_bytes,
                category=category,
                is_influencer=is_influencer,
                caption=caption,
            )
            return JSONResponse(content=report)
        except RuntimeError as e:
            raise HTTPException(status_code=500, detail=str(e))
        except Exception as e:
            logger.error(f"Unexpected video error: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Video analysis failed unexpectedly.")
