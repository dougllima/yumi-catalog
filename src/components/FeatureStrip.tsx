import { HeartHandshake, PackageCheck, ShieldCheck, Truck } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Envio para todo o Brasil",
    text: "Com carinho e segurança",
  },
  {
    icon: ShieldCheck,
    title: "Compra segura",
    text: "Atendimento sem complicação",
  },
  {
    icon: HeartHandshake,
    title: "Atendimento humano",
    text: "Fale com a gente",
  },
  {
    icon: PackageCheck,
    title: "Feito em 3D",
    text: "Produção sob encomenda",
  },
];

export function FeatureStrip() {
  return (
    <section className="pt-5" aria-label="Diferenciais">
      <div className="grid gap-2 rounded-[1.5rem] border bg-card/68 p-3 shadow-lg shadow-primary/5 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex min-h-14 items-center gap-3 rounded-2xl px-3 py-1.5"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="grid">
              <strong className="text-sm font-extrabold leading-tight">
                {title}
              </strong>
              <span className="text-xs text-muted-foreground">{text}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
