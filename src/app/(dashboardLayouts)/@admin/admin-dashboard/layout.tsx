import Sidebar from "@/components/shared/DashboardSidebar/Sidebar";
import "./admin-layout.css"
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="">
        <Sidebar></Sidebar>
        <main>{children}</main>
    </section>
  );
}