import type { ElementType, ReactNode } from "react";

import { Panel } from "@/components/Panel";
import { cn } from "@/lib/utils";

type StatePanelProps = {
  icon: ElementType;
  title: ReactNode;
  description?: ReactNode;
  /** Ação opcional (botão) exibida abaixo do texto. */
  children?: ReactNode;
  as?: ElementType;
  headingAs?: "h1" | "h2";
  className?: string;
};

/** Estado de carregando, vazio ou erro: ícone, título, texto e ação opcional. */
export function StatePanel({
  icon: Icon,
  title,
  description,
  children,
  as,
  headingAs: Heading = "h2",
  className,
}: StatePanelProps) {
  return (
    <Panel
      as={as}
      className={cn(
        "grid w-full max-w-md gap-4 p-6 text-center sm:p-7",
        className,
      )}
    >
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-primary">
        <Icon aria-hidden="true" />
      </div>
      <div className="grid gap-2">
        <Heading className="font-display text-2xl font-semibold">
          {title}
        </Heading>
        {description && (
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </Panel>
  );
}
