import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRef } from "react";
import { CoverImage } from "./primitives";

export function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: { src: string; alt: string; caption?: string }[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const startX = useRef(0);
  const item = images[index];
  if (!item) return null;
  const prev = () => onIndex((index - 1 + images.length) % images.length);
  const next = () => onIndex((index + 1) % images.length);

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black" role="dialog" aria-modal="true" aria-label="Photo viewer">
      <div
        className="relative flex h-full w-full max-w-[430px] flex-col"
        onTouchStart={(event) => {
          startX.current = event.changedTouches[0]?.clientX ?? 0;
        }}
        onTouchEnd={(event) => {
          const delta = (event.changedTouches[0]?.clientX ?? 0) - startX.current;
          if (delta > 48) prev();
          if (delta < -48) next();
        }}
      >
        <div className="flex items-center justify-between px-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
          <button type="button" className="flex size-11 items-center justify-center" aria-label="Close viewer" onClick={onClose}>
            <X strokeWidth={1.75} />
          </button>
          <p className="text-sm text-muted">
            {index + 1} / {images.length}
          </p>
          <span className="size-11" />
        </div>
        <div className="relative flex flex-1 items-center">
          <CoverImage src={item.src} alt={item.alt} priority className="max-h-[70dvh] object-contain" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#00121C] via-transparent to-transparent" />
        </div>
        <div className="flex items-center justify-between px-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button type="button" className="flex size-11 items-center justify-center rounded-full bg-surface" aria-label="Previous photo" onClick={prev}>
            <ChevronLeft strokeWidth={1.75} />
          </button>
          <p className="px-3 text-center text-sm text-white">{item.caption}</p>
          <button type="button" className="flex size-11 items-center justify-center rounded-full bg-surface" aria-label="Next photo" onClick={next}>
            <ChevronRight strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
