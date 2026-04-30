import { TCategory } from "../../_components/typesAndContstants/typesAndContants";
import AdminManageCategories from "./ManageCategories";

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
export default async function AdminManageCategoriesPage() {
   const res = await getCategories();
  return <AdminManageCategories data={res}></AdminManageCategories>
}