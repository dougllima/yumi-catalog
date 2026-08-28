import { Heart, PawPrint } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t">
      <div className="yumi-wave h-8 rotate-180" aria-hidden="true" />
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <p className="flex items-center gap-2">
          <Heart className="size-4 text-primary" aria-hidden="true" />
          Feito em 3D. Feito com amor.
        </p>
        <p className="flex items-center gap-2 rounded-full border bg-card px-5 py-2.5 text-foreground shadow-sm">
          Obrigada por apoiar o trabalho autoral!
          <PawPrint className="size-5 text-primary" aria-hidden="true" />
        </p>
      </div>
    </footer>
  );
}
