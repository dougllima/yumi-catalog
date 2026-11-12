import { cn } from "@/lib/utils";

const variants = {
  card: "rounded-[1.75rem] bg-card/62 p-4 shadow-xl shadow-primary/8 backdrop-blur sm:p-6",
  item: "rounded-[1.25rem] bg-card/68 p-4 shadow-lg shadow-primary/5",
};

export function panelClass(variant: keyof typeof variants = "card") {
  return cn("border", variants[variant]);
}
