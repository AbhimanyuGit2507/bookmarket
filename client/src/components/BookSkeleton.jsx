import React from 'react';

export default function BookSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden animate-pulse">
      {/* Cover Skeleton */}
      <div className="aspect-[3/4] w-full bg-stone-200" />

      {/* Content Skeleton */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-stone-200 rounded" />
          <div className="h-4 w-14 bg-stone-200 rounded" />
        </div>
        <div className="h-5 w-4/5 bg-stone-200 rounded" />
        <div className="h-3 w-1/2 bg-stone-200 rounded" />

        <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="h-6 w-14 bg-stone-200 rounded" />
          <div className="h-4 w-20 bg-stone-200 rounded" />
        </div>
      </div>
    </div>
  );
}
