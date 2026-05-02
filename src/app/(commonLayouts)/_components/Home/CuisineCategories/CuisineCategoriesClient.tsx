"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import "./carousel.css";
import { TCategory } from "./CuisineCategories";

interface CategoryCarouselProps {
  categories: TCategory[];
  isLoading?: boolean;
  skeletonCount?: number;
}

function CardSkeleton() {
  return (
    <div className="rc-card rc-card--skeleton" aria-hidden="true">
      <Skeleton className="rc-card__img-skeleton" />
      <Skeleton className="rc-card__name-skeleton" />
    </div>
  );
}

function CategoryCard({ category }: { category: TCategory }) {
  return (
    <Link
      href={`/restaurants?categoryId=${category.id}`}
      className="rc-card"
      draggable={false}
    >
      {/* image */}
      <div className="rc-card__img-wrap">
        {category.imageURL ? (
          <img
            src={category.imageURL}
            alt={category.name}
            className="rc-card__img"
            loading="lazy"
            draggable={false}
          />
        ) : (
          <div className="rc-card__no-img">
            <UtensilsCrossed size={32} />
          </div>
        )}

        {/* gradient so name is always readable */}
        <div className="rc-card__gradient" />

        {/* name sits inside the image at the bottom */}
        <p className="rc-card__name">{category.name}</p>
      </div>
    </Link>
  );
}

export default function CategoryCarousel({
  categories,
  isLoading = false,
  skeletonCount = 10,
}: CategoryCarouselProps) {
  const trackRef   = useRef<HTMLDivElement>(null);
  const dragging   = useRef(false);
  const startX     = useRef(0);
  const startScroll = useRef(0);

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [progress, setProgress] = useState(0);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
    setProgress(max > 0 ? (el.scrollLeft / max) * 100 : 0);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync, categories, isLoading]);

  const scrollBy = (dir: "prev" | "next") =>
    trackRef.current?.scrollBy({
      left: dir === "next" ? 280 : -280,
      behavior: "smooth",
    });


  const onMouseDown = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el) return;
    dragging.current  = true;
    startX.current    = e.pageX - el.offsetLeft;
    startScroll.current = el.scrollLeft;
    el.style.cursor   = "grabbing";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!dragging.current || !el) return;
    e.preventDefault();
    el.scrollLeft = startScroll.current - (e.pageX - el.offsetLeft - startX.current) * 1.2;
  };

  const stopDrag = () => {
    dragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft")  scrollBy("prev");
    if (e.key === "ArrowRight") scrollBy("next");
  };

  if (!isLoading && categories.length === 0) return null;

  return (
    <div className="rc-root">

      {/* arrows */}
      <div className="rc-arrows">
        <Button
          variant="outline"
          size="icon"
          className="rc-arrow"
          onClick={() => scrollBy("prev")}
          disabled={!canPrev}
          aria-label="Previous"
        >
          <ChevronLeft className="size-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rc-arrow"
          onClick={() => scrollBy("next")}
          disabled={!canNext}
          aria-label="Next"
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>

      {/* track */}
      <div
        className="rc-track"
        ref={trackRef}
        role="region"
        aria-label="Featured categories"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <CardSkeleton key={i} />
            ))
          : categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
      </div>

      {/* progress bar */}
      <div className="rc-progress" aria-hidden="true">
        <div className="rc-progress__fill" style={{ width: `${progress}%` }} />
      </div>

    </div>
  );
}