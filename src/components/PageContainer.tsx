import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type PageContainerProps = ComponentProps<"main"> & {
  /** Centraliza o conteúdo na área útil (estados de carregando, erro, login). */
  centered?: boolean;
};

/** Container padrão das páginas: mesma largura e recuo do header. */
export function PageContainer({
  centered = false,
  className,
  ...props
}: PageContainerProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-[1560px] px-4 pb-8 pt-6 sm:px-7 sm:pt-8",
        centered && "grid min-h-[48vh] place-items-center py-10 sm:py-10",
        className,
      )}
      {...props}
    />
  );
}
