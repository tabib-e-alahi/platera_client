import "./cuisine-categories.css";
import CategoryCarousel from "./CuisineCategoriesClient";
export type TCategory = {
  id: string;
  name: string;
  slug: string;
  imageURL: string;
  displayOrder: number;
  isActive: boolean;
};


async function getCategories(): Promise<TCategory[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/public/categories`,
      {
        next: { revalidate: 400 },
      }
    );

    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

export default async function CategoriesCarousel() {
  const categories = await getCategories();

  if (categories.length === 0) return null;

  return (
    <section className="cat-section">
      <div className="cat-section__inner">
        <h2 className="cat-section__title">Cuisines</h2>
        <CategoryCarousel categories={categories} />
      </div>
    </section>
  );
}