import Footer from "./_components/shared/Footer";
import Navbar from "./_components/shared/Navbar";


export default function CommonRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}