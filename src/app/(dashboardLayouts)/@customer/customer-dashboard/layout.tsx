import Sidebar from "@/components/shared/DashboardSidebar/Sidebar";
import "./customer-layout.css";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="cd-layout">
      <Sidebar></Sidebar>
      <main className="cd-main">{children}</main>
    </div>
  );
}