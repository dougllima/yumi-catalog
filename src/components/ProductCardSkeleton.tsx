import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder de `ProductCard` com a altura do conteúdo sem descrição. */
export function ProductCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden py-0 shadow-lg shadow-primary/5">
      <Skeleton className="aspect-square w-full rounded-none" />
      <CardContent className="flex flex-1 flex-col gap-2 p-3 sm:p-3.5">
        <div className="grid min-h-[2.5rem] content-start gap-1.5 sm:min-h-[2.65rem]">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/5" />
        </div>
        <div className="flex h-5 gap-1">
          <Skeleton className="h-full w-14 rounded-full" />
        </div>
        <Skeleton className="mt-auto ml-auto h-[1.375rem] w-20" />
      </CardContent>
    </Card>
  );
}
