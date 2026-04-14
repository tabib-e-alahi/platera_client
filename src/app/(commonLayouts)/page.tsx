// src/app/(root)/page.tsx
import type { Metadata } from "next";
import HeroSection from "./_components/Home/HeroSection";
import FilterChips from "./_components/Home/FilterChips";
import FeaturedProviders from "./_components/Home/FeaturedProviders";
import CuratedCollections from "./_components/Home/CuratedCollections";
import HowItWorks from "./_components/Home/HowItWorks";
import AppDownload from "./_components/Home/AppDownload";
import FeaturedRestaurants from "./_components/Home/FeaturedRestaurant/FeaturesRestaurant";
import AboutSection from "./_components/Home/AboutSection/AboutSection";
import TopDishes from "./_components/Home/TopDishes/TopDishes";
import TestimonialsSection from "./_components/Home/Testimonials/TestimonialsSection";


export const metadata: Metadata = {
  title: "Platera — Discover the Best Food Near You",
  description:
    "Order from the best home kitchens, restaurants and street food near you. Fast delivery, fresh ingredients.",
};

// ISR — revalidate every 5 minutes
export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedRestaurants></FeaturedRestaurants>
      <FilterChips />
      <FeaturedProviders />
      <CuratedCollections />
      <TopDishes />
      <TestimonialsSection></TestimonialsSection>
      <AboutSection></AboutSection>
      <HowItWorks />
      <AppDownload />
    </>
  );
}