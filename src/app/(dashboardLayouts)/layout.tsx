import Sidebar from "@/components/shared/DashboardSidebar/Sidebar";
import { redirect } from "next/navigation";
import "./dashboard-layout.css";
import { cookies } from "next/headers";

export default async function DashboardRootLayout({
  customer,
  provider,
  admin,
}: {
  customer: React.ReactNode;
  provider: React.ReactNode;
  admin: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  let user: any = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      {
        headers: { cookie: cookieHeader },
<<<<<<< HEAD
        cache: "no-store",
=======
        // cache for 30 seconds — revalidates on navigation but not on every
        // sub-component render within the same request
        next: { revalidate: 30 },
>>>>>>> dc5656236feee959b1e0e891718009336b905842
      }
    );

    if (res.ok) {
      const data = await res.json();
      user = data?.data ?? null;
    }
  } catch {
    // network error — treat as unauthenticated
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="cd-layout">
      <Sidebar user={user} />
      <main className="cd-main">
        {customer}
        {provider}
        {admin}
      </main>
    </div>
  );
}