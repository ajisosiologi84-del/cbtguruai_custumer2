import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, RotateCcw, Move, RefreshCw } from 'lucide-react';

interface ImageZoomModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  title?: string;
  onClose: () => void;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  isOpen,
  imageUrl,
  title = 'Pratinjau Gambar Soal',
  onClose,
}) => {
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset transform when new image is opened or modal opens
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
    }
  }, [isOpen, imageUrl]);

  // Handle ESC key to close modal without leaving fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  const handleZoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale((prev) => Math.min(prev + 0.25, 3.5));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale((prev) => {
      const next = Math.max(prev - 0.25, 0.5);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleReset = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleRotate = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setRotation((prev) => (prev + 90) % 360);
  };

  // Pan / Drag handlers (touch & mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStartRef.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || scale <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStartRef.current.x,
      y: touch.clientY - dragStartRef.current.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/85 backdrop-blur-md select-none animate-fade-in"
      onClick={onClose}
    >
      {/* Top Floating Control Bar */}
      <div
        className="w-full flex items-center justify-between px-3 sm:px-6 py-3 bg-slate-900/90 border-b border-slate-800 text-white shrink-0 z-10 gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="p-1.5 bg-blue-600/30 text-blue-400 rounded-lg">
            <ZoomIn className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <h3 className="font-bold text-xs sm:text-sm truncate text-slate-100">{title}</h3>
            <p className="text-[10px] text-slate-400 hidden xs:block">
              Gunakan tombol pembesar atau geser untuk memeriksa detail gambar
            </p>
          </div>
        </div>

        {/* Action Buttons: Zoom, Rotate, Reset, Close */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center bg-slate-800 p-0.5 sm:p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-slate-700 active:bg-slate-600 text-slate-200 disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title="Perkecil Gambar (Zoom Out)"
            >
              <ZoomOut className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline font-bold">Zoom -</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-2 py-1 text-[11px] sm:text-xs font-mono font-bold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
              title="Kembalikan ke Ukuran Normal (100%)"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={scale >= 3.5}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-slate-700 active:bg-slate-600 text-slate-200 disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title="Perbesar Gambar (Zoom In)"
            >
              <ZoomIn className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline font-bold">Zoom +</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleRotate}
            className="p-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-xs"
            title="Putar Gambar 90° (Rotate)"
          >
            <RotateCw className="w-4 h-4" />
            <span className="hidden md:inline font-bold">Putar</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-xs"
            title="Reset Posisi & Zoom"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline font-bold">Reset</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md"
            title="Tutup Pratinjau (ESC)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Tutup</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Image Viewport */}
      <div
        className={`flex-1 overflow-hidden flex items-center justify-center p-4 relative ${
          scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          // If clicked directly on canvas background, close
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          className="transition-transform duration-100 ease-out inline-block max-w-full max-h-full"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[82vh] max-w-[92vw] w-auto h-auto object-contain rounded-xl shadow-2xl pointer-events-none border border-slate-700/60 bg-white"
            draggable={false}
          />
        </div>

        {/* Floating Hint for Pan */}
        {scale > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 text-slate-300 px-3 py-1 rounded-full text-[11px] font-bold border border-slate-700 flex items-center gap-1.5 shadow-lg pointer-events-none">
            <Move className="w-3.5 h-3.5 text-sky-400" /> Geser untuk melihat sudut lain
          </div>
        )}
      </div>
    </div>
  );
};
