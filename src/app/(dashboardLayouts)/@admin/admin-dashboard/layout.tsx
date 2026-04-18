import Link from "next/link";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border bg-card p-4">
          <h2 className="mb-4 text-lg font-semibold">Admin Panel</h2>
          <nav className="space-y-2 text-sm">
            <Link href="/admin-dashboard" className="block rounded-lg px-3 py-2 hover:bg-muted">Dashboard</Link>
            <Link href="/admin-dashboard/providers" className="block rounded-lg px-3 py-2 hover:bg-muted">Providers</Link>
            <Link href="/admin-dashboard/users" className="block rounded-lg px-3 py-2 hover:bg-muted">Users</Link>
            <Link href="/admin-dashboard/orders" className="block rounded-lg px-3 py-2 hover:bg-muted">Orders</Link>
            <Link href="/admin-dashboard/payments" className="block rounded-lg px-3 py-2 hover:bg-muted">Payments</Link>
            <Link href="/admin-dashboard/payables" className="block rounded-lg px-3 py-2 hover:bg-muted">Payables</Link>
            <Link href="/admin-dashboard/admins" className="block rounded-lg px-3 py-2 hover:bg-muted">Admins</Link>
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </section>
  );
}