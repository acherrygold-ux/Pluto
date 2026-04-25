import "@/styles/globals.css";
import { useRouter } from "next/router";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const hideSidebar = router.pathname === "/" || router.pathname === "/history";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <div className="mx-auto flex max-w-7xl">
        <main className="min-w-0 flex-1">
          <Component {...pageProps} />
        </main>
        {hideSidebar ? null : <Sidebar />}
      </div>
    </div>
  );
}