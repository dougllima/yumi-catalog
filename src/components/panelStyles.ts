import { cn } from "@/lib/utils";

const variants = {
  card: "rounded-panel bg-card/60 p-4 shadow-xl shadow-primary/10 backdrop-blur sm:p-6",
  item: "rounded-item bg-card/70 p-4 shadow-lg shadow-primary/5",
};

export function panelClass(variant: keyof typeof variants = "card") {
  return cn("border", variants[variant]);
}
