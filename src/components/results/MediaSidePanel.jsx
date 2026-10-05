import { useEffect, useRef } from 'react';
import { useFileStore } from '../../context/FileStoreContext';
import { Image as ImageIcon } from 'lucide-react';

export default function MediaSidePanel({ seekToTime }) {
  const { files } = useFileStore();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && seekToTime !== null) {
      videoRef.current.currentTime = seekToTime;
      videoRef.current.play().catch(() => {});
    }
  }, [seekToTime]);

  if (!files.video && !files.photo) {
    return (
      <div className="sticky top-24 glass rounded-3xl p-6 flex flex-col items-center justify-center text-center h-64">
        <ImageIcon className="w-12 h-12 text-[var(--color-text-muted)] mb-4 opacity-50" />
        <p className="text-[var(--color-text-muted)] text-sm">Media preview unavailable.<br/>(Files are not stored permanently)</p>
      </div>
    );
  }

  return (
    <div className="sticky top-24 space-y-4 no-print">
      {files.video && files.video.previewUrl && (
        <div className="glass rounded-2xl overflow-hidden border border-[var(--color-border)]">
          <div className="bg-[var(--color-base)] px-4 py-2 border-b border-[var(--color-border)] text-xs font-medium text-[var(--color-text-muted)]">
            Video Analysis
          </div>
          <video 
            ref={videoRef}
            src={files.video.previewUrl} 
            controls 
            className="w-full bg-black max-h-[400px] object-contain"
          />
        </div>
      )}
      
      {files.photo && files.photo.previewUrl && (
        <div className="glass rounded-2xl overflow-hidden border border-[var(--color-border)]">
          <div className="bg-[var(--color-base)] px-4 py-2 border-b border-[var(--color-border)] text-xs font-medium text-[var(--color-text-muted)]">
            Image Analysis
          </div>
          <img 
            src={files.photo.previewUrl} 
            alt="Uploaded media" 
            className="w-full bg-black max-h-[400px] object-contain"
          />
        </div>
      )}
    </div>
  );
}
