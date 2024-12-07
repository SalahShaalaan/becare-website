import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Header />
      <main className="flex-grow bg-[#efefef]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
