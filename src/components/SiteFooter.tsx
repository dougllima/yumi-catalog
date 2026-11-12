import { Camera, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { BrandLogo } from "@/components/BrandLogo";
import { contactUrl, instagramUrl } from "@/config/contact";

const linkClass =
  "inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-[1560px] px-4 pb-8 pt-4 sm:px-7">
      <div className="border-t pt-8">
        {/* Três colunas, as mesmas de "Como encomendar". */}
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="grid content-start justify-items-start gap-3">
            <BrandLogo />
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Peças únicas impressas em 3D, feitas sob encomenda com muito
              carinho.
            </p>
          </div>

          <nav className="grid content-start gap-3" aria-label="Rodapé">
            <h2 className="text-sm font-extrabold text-foreground">Navegar</h2>
            <Link to="/" className={linkClass}>
              Início
            </Link>
            <Link to="/produtos" className={linkClass}>
              Produtos
            </Link>
          </nav>

          <div className="grid content-start gap-3">
            <h2 className="text-sm font-extrabold text-foreground">Contato</h2>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              <Camera className="size-4 text-primary" aria-hidden="true" />
              Instagram
            </a>
            <a
              href={contactUrl}
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              <MessageCircle
                className="size-4 text-primary"
                aria-hidden="true"
              />
              Combinar uma encomenda
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-1 border-t pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Yumi Studio. Todos os direitos
            reservados.
          </p>
          <p>Impressão 3D sob encomenda · Envio para todo o Brasil</p>
        </div>
      </div>
    </footer>
  );
}
