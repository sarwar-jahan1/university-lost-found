export const Skeleton = ({ className = "" }) => (
  <div className={`skeleton ${className}`} aria-hidden="true" />
);

export const ItemCardSkeleton = () => (
  <div
    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    aria-hidden="true"
  >
    <Skeleton className="h-6 w-16 !rounded-full" />
    <Skeleton className="mt-4 h-5 w-3/4" />
    <Skeleton className="mt-3 h-4 w-full" />
    <Skeleton className="mt-2 h-4 w-2/3" />
    <Skeleton className="mt-5 h-4 w-1/2" />
    <Skeleton className="mt-2 h-4 w-1/3" />
    <Skeleton className="mt-6 h-10 w-full" />
  </div>
);

export const ListRowSkeleton = () => (
  <div
    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    aria-hidden="true"
  >
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-6 w-20 !rounded-full" />
    </div>
    <Skeleton className="mt-4 h-4 w-full" />
    <Skeleton className="mt-2 h-4 w-3/4" />
  </div>
);
