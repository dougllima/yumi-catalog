import { Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { contactUrl } from "@/config/contact";

type SiteHeaderProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

const navItems = ["Início", "Produtos", "Decoração", "Geek", "Presentes"];

export function SiteHeader({ theme, onToggleTheme }: SiteHeaderProps) {
  return (
    <header className="relative z-20 mx-auto w-full max-w-[1560px] px-4 pt-4 sm:px-7">
      <div className="yumi-header-surface flex items-center justify-between gap-4 rounded-[1.75rem] border px-4 py-3 shadow-lg shadow-primary/5 backdrop-blur-xl sm:px-6">
        <BrandLogo />

        <nav
          className="hidden items-center gap-7 text-sm font-bold text-foreground/85 lg:flex"
          aria-label="Navegação principal"
        >
          {navItems.map((item) => (
            <Link
              key={item}
              to={item === "Produtos" ? "/#produtos" : "/"}
              className="transition hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden rounded-full px-5 shadow-md shadow-primary/10 sm:inline-flex"
          >
            <a
              href={contactUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              Instagram & Contato
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="icon"
            className="rounded-full bg-card/70 backdrop-blur"
          >
            <a
              href={contactUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Abrir contato da Yumi Studio"
            >
              <Heart aria-hidden="true" />
            </a>
          </Button>
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}
