import { useEffect } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigationType,
} from "react-router-dom";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useTheme } from "@/hooks/useTheme";
import { AdminCategoriesPage } from "@/pages/admin/AdminCategoriesPage";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { AdminProductsPage } from "@/pages/admin/AdminProductsPage";
import { AdminRoute } from "@/pages/admin/AdminRoute";
import { HomePage } from "@/pages/HomePage";
import { ProductPage } from "@/pages/ProductPage";
import { ProductsPage } from "@/pages/ProductsPage";

const savedScroll = new Map<string, number>();

function ScrollToAnchor() {
  const { hash, key, pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (hash) {
      window.document.querySelector(hash)?.scrollIntoView();
      return;
    }

    const target = navigationType === "POP" ? savedScroll.get(key) : undefined;

    if (!target) {
      window.scrollTo({ top: 0 });
      return;
    }

    // Ao voltar, o conteúdo pode ainda estar carregando: tenta até a página
    // ter altura suficiente (ou ~1,5s).
    let frame = 0;
    let attempts = 0;
    const restore = () => {
      window.scrollTo({ top: target });
      attempts += 1;

      if (
        Math.abs(window.scrollY - target) > 2 &&
        attempts < 90 &&
        document.documentElement.scrollHeight < target + window.innerHeight
      ) {
        frame = requestAnimationFrame(restore);
      }
    };
    restore();

    return () => cancelAnimationFrame(frame);
  }, [hash, key, navigationType, pathname]);

  useEffect(() => {
    const save = () => savedScroll.set(key, window.scrollY);

    window.addEventListener("scroll", save, { passive: true });

    return () => window.removeEventListener("scroll", save);
  }, [key]);

  return null;
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="yumi-page min-h-screen">
      <ScrollToAnchor />
      <SiteHeader theme={theme} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/produtos" element={<ProductsPage />} />
        <Route path="/produto/:id" element={<ProductPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminProductsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <AdminRoute>
              <AdminCategoriesPage />
            </AdminRoute>
          }
        />
      </Routes>
      {!isAdminRoute && <SiteFooter />}
    </div>
  );
}

export default App;
