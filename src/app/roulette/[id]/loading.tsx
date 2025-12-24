import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Skeleton className="h-[520px] rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-10 rounded-full" />
          <Skeleton className="h-72 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
