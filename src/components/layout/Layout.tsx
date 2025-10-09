import { Outlet } from "react-router-dom";
import { Header } from "./Header/Header";

export function Layout() {
  return (
    <div className="min-h-screen ">
      <Header />
      <main className="container mx-auto px-4 py-3">
        <Outlet />
      </main>
    </div>
  );
}
