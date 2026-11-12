import { MessageCircle, PackageCheck, Truck } from "lucide-react";

import { Panel } from "@/components/Panel";

const features = [
  {
    icon: Truck,
    title: "Envio para todo o Brasil",
    text: "Com carinho e segurança",
  },
  {
    icon: MessageCircle,
    title: "Atendimento direto",
    text: "Combine tudo pelo Instagram",
  },
  {
    icon: PackageCheck,
    title: "Feito em 3D",
    text: "Produção sob encomenda",
  },
];

export function FeatureStrip() {
  return (
    <section aria-label="Diferenciais">
      {/* Mesma grade de 3 colunas e mesmo recuo (px-4) dos cards de
          "Como encomendar", para os ícones ficarem alinhados. */}
      <Panel
        as="ul"
        variant="item"
        className="grid gap-3 px-0 py-3 sm:grid-cols-3"
      >
        {features.map(({ icon: Icon, title, text }) => (
          <li
            key={title}
            className="flex items-center justify-center gap-3 px-4 py-1"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="grid">
              <strong className="text-sm font-extrabold leading-tight">
                {title}
              </strong>
              <span className="text-xs text-muted-foreground">{text}</span>
            </span>
          </li>
        ))}
      </Panel>
    </section>
  );
}
