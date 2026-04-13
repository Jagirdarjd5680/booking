export default function Skeleton({ className }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
  );
}

export function HomeSkeleton() {
  return (
    <div className="w-full">
      {/* Tabs Skeleton */}
      <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar">
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-w-[120px] h-12 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-100 rounded-[32px] animate-pulse flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
            <div className="w-12 h-2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
