import Sidebar from "@/components/shared/DashboardSidebar/Sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <Sidebar></Sidebar>
        <main>{children}</main>
      </div>
    </section>
  );
}