export default function Loading() {
  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="relative mb-8 flex items-center justify-between">
        <div className="w-fit absolute -left-10 -top-[120%]">
          <div className="h-9 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-9 w-48 bg-muted rounded animate-pulse" />
        <div className="h-9 w-32 bg-muted rounded animate-pulse" />
      </div>

      <div className="space-y-8">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <div className="h-9 w-36 bg-background rounded animate-pulse" />
          <div className="h-9 w-24 bg-transparent rounded" />
        </div>

        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
            <div className="h-10 w-full bg-muted rounded animate-pulse" />
          </div>
          <div className="grid gap-4">
            <div className="h-6 w-28 bg-muted rounded animate-pulse" />
            <div className="h-10 w-full bg-muted rounded animate-pulse" />
          </div>
          <div className="grid gap-4">
            <div className="h-6 w-36 bg-muted rounded animate-pulse" />
            <div className="h-24 w-full bg-muted rounded animate-pulse" />
          </div>
          <div className="flex justify-end">
            <div className="h-10 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}