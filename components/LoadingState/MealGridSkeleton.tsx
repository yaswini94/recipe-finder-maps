import { MealCardSkeleton } from "./MealCardSkeleton";

interface MealGridSkeletonProps {
  count?: number;
}

export function MealGridSkeleton({ count = 6 }: MealGridSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-label="Loading meals"
      role="status"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <MealCardSkeleton key={i} />
      ))}
      <span className="sr-only">Loading meals...</span>
    </div>
  );
}
