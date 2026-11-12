import { MessageCircle, PackageCheck, Search } from "lucide-react";

import { Panel } from "@/components/Panel";
import { SectionHeader } from "@/components/SectionHeader";

const steps = [
  {
    icon: Search,
    title: "Escolha ou crie",
    text: "Escolha uma peça do catálogo ou conte a ideia de um modelo sob medida, feito do seu jeito.",
  },
  {
    icon: MessageCircle,
    title: "Fale com a gente",
    text: "Chame no Instagram para combinar detalhes, cores, tamanho e prazo.",
  },
  {
    icon: PackageCheck,
    title: "Receba",
    text: "Sua peça é impressa sob encomenda e enviada com carinho.",
  },
];

export function HowToOrder() {
  return (
    <section className="grid gap-4 pt-8" aria-labelledby="how-to-order-title">
      <SectionHeader
        titleId="how-to-order-title"
        title="Como encomendar"
        description="Sem carrinho e sem burocracia: é só conversar com a gente."
      />

      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }, index) => (
          <Panel as="li" variant="item" key={title} className="flex gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="grid gap-1">
              <strong className="font-display text-lg font-semibold leading-tight">
                {index + 1}. {title}
              </strong>
              <span className="text-sm text-muted-foreground">{text}</span>
            </span>
          </Panel>
        ))}
      </ol>
    </section>
  );
}
