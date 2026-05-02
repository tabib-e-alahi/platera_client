import type { Metadata } from "next";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";


export const metadata: Metadata = {
  title: {
    default: "Platera — Discover the Best Food Near You",
    template: "%s | Platera",
  },
  description:
    "Fresh ingredients, local restaurants, delivered fast. Order from the best home kitchens and restaurants near you.",
  keywords: [
    "food delivery",
    "restaurants",
    "home kitchen",
    "order food online",
    "Platera",
  ],
  openGraph: {
    title: "Platera — Discover the Best Food Near You",
    description:
      "Fresh ingredients, local restaurants, delivered fast.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="">
        <ThemeProvider 
          attribute="data-theme"   // sets data-theme="dark" on <html>
          defaultTheme="system"    // respects OS preference by default
          enableSystem
        >
          <QueryProvider>
            <AuthProvider>
              <TooltipProvider>{children}</TooltipProvider>
              <Toaster position="top-right" richColors />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}