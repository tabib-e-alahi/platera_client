import Sidebar from "@/components/shared/DashboardSidebar/Sidebar";
import "./admin-layout.css"
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="ad-layout">
        <Sidebar></Sidebar>
        <main className="ad-main">{children}</main>
    </section>
  );
}