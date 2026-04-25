import { getCategories } from "@/services/provider.service"
import AdminManageCategories from "./ManageCategories";

export default async function AdminManageCategoriesPage() {
  const res = await getCategories();
  return <AdminManageCategories data={res.data}></AdminManageCategories>
}