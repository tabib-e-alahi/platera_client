"use client";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TCategory } from "./CuisineCategories";

interface Props {
  categories: TCategory[];
}

export default function CategoriesCarouselClient({ categories }: Props) {
  return (
    <div className="cat-carousel-wrap">
      <Carousel
        opts={{
          align: "start",
          dragFree: true,   // smooth free-scroll drag on mobile
          loop: false,
        }}
        className="cat-carousel"
      >
        <CarouselContent className="cat-carousel__content">
          {categories.map((cat) => (
            <CarouselItem key={cat.id} className="cat-carousel__item">
              <Link
                href={`/restaurants?categoryId=${cat.id}`}
                className="cat-card"
                prefetch={false}
              >
                <div className="cat-card__img-wrap">
                  {cat.imageURL ? (
                    <img
                      src={cat.imageURL}
                      alt={cat.name}
                      className="cat-card__img"
                      loading="eager"
                      decoding="async"
                    />
                  ) : (
                    <div className="cat-card__img-placeholder">🍽️</div>
                  )}
                </div>
                <span className="cat-card__name">{cat.name}</span>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* shadcn carousel nav — styled via .cat-carousel__prev / __next */}
        <CarouselPrevious className="cat-carousel__prev" />
        <CarouselNext className="cat-carousel__next" />
      </Carousel>
    </div>
  );
}