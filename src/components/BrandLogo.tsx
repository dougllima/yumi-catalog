import { Link } from "react-router-dom";

export function BrandLogo() {
  return (
    <Link
      to="/"
      className="block shrink-0 rounded-2xl focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      aria-label="Yumi Studio"
    >
      <span className="block h-16 overflow-hidden rounded-2xl sm:h-[4.5rem]">
        <img
          src="/brand/yumi-logo.png"
          alt="Yumi Studio Impressão 3D"
          className="size-full object-contain"
        />
      </span>
    </Link>
  );
}
