import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Bloco base de carregamento: pulsa sobre `bg-muted`, com o tamanho do conteúdo final. */
function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
