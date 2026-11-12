import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: ReactNode;
  titleId?: string;
  /** Use "h1" no título principal da página. */
  as?: "h1" | "h2";
  eyebrow?: ReactNode;
  description?: ReactNode;
  /** Conteúdo alinhado à direita (botão, controles). */
  action?: ReactNode;
  className?: string;
};

/** Cabeçalho padrão de seção: eyebrow, título e descrição, com ação opcional. */
export function SectionHeader({
  title,
  titleId,
  as: Heading = "h2",
  eyebrow,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="grid gap-1.5">
        {eyebrow && (
          <p className="flex items-center gap-2 text-sm font-extrabold text-primary [&>svg]:size-4">
            {eyebrow}
          </p>
        )}
        <Heading
          id={titleId}
          className="font-display text-3xl font-semibold leading-tight tracking-normal sm:text-4xl"
        >
          {title}
        </Heading>
        {description && (
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
