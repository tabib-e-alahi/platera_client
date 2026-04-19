import CustomerSidebar from "../_components/Sidebar/CustomerSidebar";
import "./_components/customer-sidebar.css";
import "./customer-layout.css";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="cd-layout">
      <CustomerSidebar />
      <main className="cd-main">{children}</main>
    </div>
  );
}