import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-12">
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-48 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
