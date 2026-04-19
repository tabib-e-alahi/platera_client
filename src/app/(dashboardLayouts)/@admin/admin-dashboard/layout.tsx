import Sidebar from "@/components/shared/DashboardSidebar/Sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-background">
        <Sidebar></Sidebar>
        <main>{children}</main>
    </section>
  );
}