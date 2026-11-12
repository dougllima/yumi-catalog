import type { ComponentProps, ElementType } from "react";

import { panelClass } from "@/components/panelStyles";
import { cn } from "@/lib/utils";

type PanelProps = ComponentProps<"div"> & {
  as?: ElementType;
  /** `card` para blocos de página; `item` para cards menores dentro de listas. */
  variant?: Parameters<typeof panelClass>[0];
};

/** Superfície padrão (borda, fundo translúcido e sombra) do catálogo e do admin. */
export function Panel({
  as: Component = "div",
  variant = "card",
  className,
  ...props
}: PanelProps) {
  return (
    <Component className={cn(panelClass(variant), className)} {...props} />
  );
}
