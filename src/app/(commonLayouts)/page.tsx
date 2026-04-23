// src/app/(root)/page.tsx
import type { Metadata } from "next";
import HeroSection from "./_components/Home/HeroSection";
import HowItWorks from "./_components/Home/HowItWorks";
import FeaturedRestaurants from "./_components/Home/FeaturedRestaurant/FeaturesRestaurant";
import AboutSection from "./_components/Home/AboutSection/AboutSection";
import TestimonialsSection from "./_components/Home/Testimonials/TestimonialsSection";
import TopDishes from './_components/Home/TopDishes/TopDishes';


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
      <TopDishes />
      <TestimonialsSection></TestimonialsSection>
      <AboutSection></AboutSection>
      <HowItWorks />
    </>
  );
}