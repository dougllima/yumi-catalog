import { Link } from "react-router-dom";

export function BrandLogo() {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="Yumi Studio">
      <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-secondary bg-secondary shadow-sm sm:size-16">
        <img
          src="/brand/yumi-cat.png"
          alt=""
          className="size-full object-cover"
          aria-hidden="true"
        />
      </span>
      <span className="grid leading-none">
        <span className="font-display text-3xl font-bold tracking-normal text-primary sm:text-4xl">
          YUMI
        </span>
        <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.34em] text-foreground">
          Studio
        </span>
        <span className="text-[0.5rem] font-bold uppercase tracking-[0.28em] text-muted-foreground">
          Impressão 3D
        </span>
      </span>
    </Link>
  );
}
