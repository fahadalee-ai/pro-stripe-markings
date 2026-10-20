import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ScreenFrame, TopAppBar } from "@/components/chrome";
import { Lightbox } from "@/components/lightbox";
import { Chip, CoverImage, EmptyState } from "@/components/primitives";
import { gallery } from "@/data/content";
import { useRequireUser } from "@/hooks/useRequireUser";

export function GalleryScreen() {
  useRequireUser();
  const navigate = useNavigate();
  const categories = ["All", ...Array.from(new Set(gallery.map((item) => item.category)))];
  const [filter, setFilter] = useState("All");
  const [index, setIndex] = useState<number | null>(null);
  const items = useMemo(() => gallery.filter((item) => filter === "All" || item.category === filter), [filter]);

  return (
    <ScreenFrame>
      <TopAppBar title="Gallery" onBack={() => navigate({ to: "/home" })} />
      <div className="px-4 pb-8">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Chip key={category} active={filter === category} onClick={() => setFilter(category)}>
              {category}
            </Chip>
          ))}
        </div>
        {items.length ? (
          <div className="mt-4 columns-2 gap-2">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="mb-2 block w-full break-inside-avoid overflow-hidden rounded-2xl"
                onClick={() => setIndex(gallery.findIndex((photo) => photo.id === item.id))}
              >
                <CoverImage src={item.src} alt={item.alt} className={item.id === "g2" || item.id === "g5" ? "aspect-[3/4]" : "aspect-[4/3]"} />
                <span className="mt-1 block text-left text-xs text-muted">{item.caption}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState icon={<span />} title="No photos" body="Nothing in this category yet." />
          </div>
        )}
      </div>
      {index !== null ? (
        <Lightbox
          images={gallery.map((item) => ({ src: item.src, alt: item.alt, caption: item.caption }))}
          index={index}
          onIndex={setIndex}
          onClose={() => setIndex(null)}
        />
      ) : null}
    </ScreenFrame>
  );
}
