'use client';

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        <div className="h-8 w-24 bg-muted animate-pulse rounded" />
      </div>
      <div className="flex-1 p-4 bg-muted rounded-lg">
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted-foreground/20 animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-muted-foreground/20 animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-muted-foreground/20 animate-pulse rounded" />
          <div className="h-4 w-1/2 bg-muted-foreground/20 animate-pulse rounded" />
        </div>
      </div>
      <div className="text-center text-muted-foreground animate-pulse">
        Generating SQL...
      </div>
    </div>
  );
}