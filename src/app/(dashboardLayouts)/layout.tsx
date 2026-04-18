// import "./dashboard.css"
// import { redirect } from "next/navigation"
export default async function DashboardRootLayout({
  customer,
  provider,
  admin
}: {
  customer: React.ReactNode
  provider: React.ReactNode
  admin: React.ReactNode
}) {

  return (
    <div className="">
      {/* <DashboardSideBar user={user}></DashboardSideBar> */}
      <main className="">
        {customer}
        {provider}
        {admin}
      </main>
    </div>
  );
}
