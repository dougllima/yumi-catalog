import { Droplets, Hand, Sun } from "lucide-react";

import { PageContainer } from "@/components/PageContainer";
import { Panel } from "@/components/Panel";
import { SectionHeader } from "@/components/SectionHeader";

const careTips = [
  {
    icon: Droplets,
    title: "Limpeza",
    text: "Utilize água e sabão neutro para a limpeza das peças. No caso de peças pintadas à mão, utilize somente um pano seco, evitando o contato com água para preservar a pintura.",
  },
  {
    icon: Sun,
    title: "Calor e exposição ao sol",
    text: "Evite deixar as peças expostas ao sol intenso ou a altas temperaturas. Por serem produzidas em PLA, um material termoplástico, podem amolecer e sofrer deformações quando expostas ao calor.",
  },
  {
    icon: Hand,
    title: "Manuseio",
    text: "Apesar de serem leves e resistentes para o uso cotidiano, as peças não são inquebráveis. Quedas, especialmente em superfícies rígidas ou sobre as quinas, podem causar danos. Manuseie com cuidado para evitar impactos.",
  },
];

export function CarePage() {
  return (
    <PageContainer className="grid gap-8">
      <SectionHeader
        as="h1"
        eyebrow="Yumi Studio"
        title="Cuidados com as peças"
        description="Pequenos cuidados em cada etapa fazem diferença."
      />

      <Panel className="grid gap-4 text-base leading-7 text-muted-foreground">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Nossas peças e o PLA
        </h2>
        <p>
          Todas as peças da Yumi Studio são produzidas em PLA (ácido
          polilático), um bioplástico de origem renovável, geralmente fabricado
          a partir de matérias-primas vegetais, como o amido de milho.
        </p>
        <p>
          Diferentemente dos plásticos convencionais derivados do petróleo, o
          PLA tem origem em fontes vegetais e é o material utilizado na
          fabricação das nossas peças por meio da impressão 3D.
        </p>
      </Panel>

      <section className="grid gap-4" aria-labelledby="care-tips-title">
        <h2
          id="care-tips-title"
          className="font-display text-2xl font-semibold text-foreground"
        >
          Para conservar suas peças
        </h2>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          Para conservar suas peças e mantê-las bonitas por mais tempo,
          recomendamos alguns cuidados:
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {careTips.map(({ icon: Icon, title, text }) => (
            <Panel
              key={title}
              variant="item"
              className="grid content-start gap-3"
            >
              <Icon className="size-6 text-primary" aria-hidden="true" />
              <h3 className="font-extrabold text-foreground">{title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{text}</p>
            </Panel>
          ))}
        </div>
        <p className="text-base leading-7 text-muted-foreground">
          Com carinho e os cuidados certos, suas peças podem acompanhar você por
          muito tempo!
        </p>
      </section>
    </PageContainer>
  );
}
