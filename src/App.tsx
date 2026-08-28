import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { SiteHeader } from "@/components/SiteHeader";
import { useTheme } from "@/hooks/useTheme";
import { HomePage } from "@/pages/HomePage";
import { ProductPage } from "@/pages/ProductPage";

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
        <Route path="/produto/:id" element={<ProductPage />} />
      </Routes>
    </div>
  );
}

export default App;
