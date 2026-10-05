"""
Video Processor Service
Extracts representative key frames from a video using OpenCV.

Strategy:
  - Sample a frame every SAMPLE_INTERVAL seconds
  - Cap at MAX_FRAMES to avoid Groq rate limits
  - Return frames as JPEG bytes with their timestamps
"""
import io
import cv2
import tempfile
import logging
import numpy as np
from pathlib import Path

logger = logging.getLogger(__name__)

# ─── Config ────────────────────────────────────────────────────────────────
SAMPLE_INTERVAL_SECONDS = 3   # Extract one frame every N seconds
MAX_FRAMES = 8                 # Maximum frames to analyze (Groq rate limit safe)
JPEG_QUALITY = 85              # JPEG compression quality (lower = smaller file)
MAX_FRAME_WIDTH = 1280         # Resize wide frames to save tokens


# ─── Types ─────────────────────────────────────────────────────────────────
class VideoFrame:
    def __init__(self, timestamp_sec: float, jpeg_bytes: bytes, frame_index: int):
        self.timestamp_sec = round(timestamp_sec, 1)
        self.jpeg_bytes = jpeg_bytes
        self.frame_index = frame_index
        self.size_kb = round(len(jpeg_bytes) / 1024, 1)


# ─── Processor ─────────────────────────────────────────────────────────────

class VideoProcessor:
    """Extracts key frames from a video file using OpenCV."""

    def extract_frames(self, video_bytes: bytes) -> list[VideoFrame]:
        """
        Given raw video bytes, save to a temp file, extract frames,
        and return a list of VideoFrame objects.
        """
        # Write to temp file (OpenCV needs a file path)
        suffix = self._detect_extension(video_bytes)
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            tmp.write(video_bytes)
            tmp_path = tmp.name

        try:
            return self._extract_from_path(tmp_path)
        finally:
            # Always clean up the temp file
            Path(tmp_path).unlink(missing_ok=True)

    def _extract_from_path(self, path: str) -> list[VideoFrame]:
        cap = cv2.VideoCapture(path)

        if not cap.isOpened():
            raise ValueError("Could not open video file. Ensure it is a valid MP4/MOV/WebM.")

        fps = cap.get(cv2.CAP_PROP_FPS) or 25
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration_sec = total_frames / fps
        frame_step = int(fps * SAMPLE_INTERVAL_SECONDS)

        logger.info(
            f"Video: {duration_sec:.1f}s, {fps:.0f}fps, {total_frames} frames. "
            f"Sampling every {SAMPLE_INTERVAL_SECONDS}s → step={frame_step}"
        )

        frames: list[VideoFrame] = []
        frame_idx = 0

        # Always capture the first frame
        timestamps_to_capture = []
        t = 0.0
        while t < duration_sec and len(timestamps_to_capture) < MAX_FRAMES:
            timestamps_to_capture.append(t)
            t += SAMPLE_INTERVAL_SECONDS

        for ts in timestamps_to_capture:
            target_frame = int(ts * fps)
            cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame)
            ret, frame = cap.read()

            if not ret:
                logger.warning(f"Could not read frame at {ts:.1f}s")
                continue

            jpeg_bytes = self._frame_to_jpeg(frame)
            frames.append(VideoFrame(
                timestamp_sec=ts,
                jpeg_bytes=jpeg_bytes,
                frame_index=frame_idx,
            ))
            frame_idx += 1
            logger.debug(f"  Frame at {ts:.1f}s → {len(jpeg_bytes)//1024}KB")

        cap.release()

        logger.info(f"Extracted {len(frames)} frames from video.")
        return frames

    def _frame_to_jpeg(self, frame: np.ndarray) -> bytes:
        """Resize if too wide, then encode as JPEG bytes."""
        h, w = frame.shape[:2]
        if w > MAX_FRAME_WIDTH:
            scale = MAX_FRAME_WIDTH / w
            new_w, new_h = int(w * scale), int(h * scale)
            frame = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_AREA)

        encode_params = [cv2.IMWRITE_JPEG_QUALITY, JPEG_QUALITY]
        success, buffer = cv2.imencode(".jpg", frame, encode_params)
        if not success:
            raise RuntimeError("Failed to encode video frame as JPEG.")
        return buffer.tobytes()

    def _detect_extension(self, video_bytes: bytes) -> str:
        """Detect video format from magic bytes."""
        if video_bytes[4:8] in (b"ftyp", b"moov"):
            return ".mp4"
        if video_bytes[:4] == b"RIFF":
            return ".avi"
        if video_bytes[:4] == b"\x1aE\xdf\xa3":
            return ".webm"
        return ".mp4"  # safe default


def get_video_processor() -> VideoProcessor:
    return VideoProcessor()
