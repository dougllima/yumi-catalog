import { Gift, Heart, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { publicAssetUrl } from "@/utils/publicAssetUrl";

const highlights = [
  {
    icon: Heart,
    title: "Feito com amor",
    text: "Cada peça é única",
  },
  {
    icon: Sparkles,
    title: "Impressão 3D",
    text: "Acabamento de qualidade",
  },
  {
    icon: Gift,
    title: "Perfeito para presentear",
    text: "Ideias que encantam",
  },
];

export function Hero() {
  return (
    <section
      className="yumi-hero relative overflow-hidden border-b"
      aria-labelledby="hero-title"
    >
      <div className="relative mx-auto grid max-w-[1400px] gap-6 px-4 pb-14 pt-8 sm:px-7 lg:h-[330px] lg:grid-cols-[55fr_45fr] lg:items-center lg:py-0">
        <div className="relative z-10 grid gap-4">
          <Badge
            variant="outline"
            className="h-7 w-fit rounded-full bg-card/55 px-3 text-[0.7rem] font-extrabold uppercase shadow-sm backdrop-blur"
          >
            <Heart className="size-3.5 fill-primary/20" aria-hidden="true" />
            Impressão 3D com amor
          </Badge>

          <div className="grid max-w-[740px] gap-3">
            <h1
              id="hero-title"
              className="font-display text-balance text-[2.55rem] font-bold leading-[1.04] tracking-normal text-foreground sm:text-[3rem]"
            >
              Peças únicas para decorar,
              <br className="hidden lg:block" />
              <span className="lg:hidden"> </span>
              organizar e{" "}
              <span className="text-primary">encantar!</span>
            </h1>
            <p className="max-w-[560px] text-pretty text-base leading-7 text-muted-foreground sm:text-[1.05rem]">
              Criações autorais impressas em 3D com muito carinho para
              transformar seu espaço e celebrar o universo geek.
            </p>
          </div>

          <div className="grid max-w-[690px] gap-2.5 sm:grid-cols-3">
            {highlights.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex min-h-13 items-center gap-2.5 rounded-2xl border bg-card/48 px-3 py-2 shadow-sm shadow-primary/5 backdrop-blur-md"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="grid gap-0.5">
                  <strong className="text-[0.82rem] font-extrabold leading-tight">
                    {title}
                  </strong>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {text}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto grid w-full max-w-sm place-items-center lg:max-w-[30rem]">
          <Sparkles className="absolute left-2 top-12 size-7 text-primary/60" aria-hidden="true" />
          <Heart className="absolute right-7 top-6 size-6 text-primary/70" aria-hidden="true" />
          <Sparkles className="absolute bottom-24 right-1 size-9 text-accent-foreground/40" aria-hidden="true" />
          <Heart className="absolute bottom-16 left-6 size-6 text-primary/65" aria-hidden="true" />

          <div className="yumi-logo-orbit relative grid aspect-square w-[min(76vw,21rem)] place-items-center rounded-full border-4 border-secondary/80 bg-secondary/70 shadow-2xl shadow-primary/20">
            <div className="absolute inset-5 rounded-full border border-primary/25" />
            <div className="absolute -inset-9 rounded-full border border-primary/10" />
            <img
              src={publicAssetUrl("/brand/yumi-logo.png")}
              alt="Logo da Yumi Studio com mascote gatinho"
              className="relative z-10 size-[88%] rounded-full object-contain shadow-lg"
            />
          </div>
        </div>
      </div>
      <div className="yumi-wave absolute inset-x-0 bottom-0 h-9" aria-hidden="true" />
    </section>
  );
}
