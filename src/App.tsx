import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { SiteHeader } from "@/components/SiteHeader";
import { useTheme } from "@/hooks/useTheme";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { AdminProductsPage } from "@/pages/admin/AdminProductsPage";
import { AdminRoute } from "@/pages/admin/AdminRoute";
import { HomePage } from "@/pages/HomePage";
import { ProductPage } from "@/pages/ProductPage";
import { ProductsPage } from "@/pages/ProductsPage";

function ScrollToAnchor() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      window.document.querySelector(hash)?.scrollIntoView();
      return;
    }

    window.scrollTo({ top: 0 });
  }, [hash, pathname]);

  return null;
}

function App() {
  const { theme, toggleTheme } = useTheme();

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
      </Routes>
    </div>
  );
}

export default App;
