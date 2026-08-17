import { PublicShell } from "@/components/layout/PublicShell";
import { Skeleton } from "@/components/ui/Spinner";

export default function BookingLoading() {
  return (
    <PublicShell>
      <div className="container-page section-y">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-6 h-[420px] w-full" />
      </div>
    </PublicShell>
  );
}
