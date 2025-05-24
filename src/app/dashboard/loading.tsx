export default function DashboardLoading() {
  return (
    <div className="flex h-screen">
      {/* Sidebar skeleton */}
      <div className="w-64 bg-card border-r p-4 space-y-4">
        {/* Logo/brand skeleton */}
        <div className="h-8 w-32 bg-muted rounded animate-pulse mb-6"></div>
        
        {/* Navigation items */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-2">
            <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
          </div>
        ))}
        
        {/* Collapsible section */}
        <div className="space-y-2 mt-6">
          <div className="flex items-center space-x-3 p-2">
            <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-muted rounded animate-pulse ml-auto"></div>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-2 pl-8">
              <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
          <div className="h-10 w-40 bg-muted rounded animate-pulse"></div>
        </div>

        {/* Table skeleton */}
        <div className="bg-card rounded-lg border overflow-hidden">
          {/* Table header */}
          <div className="bg-muted/50 px-6 py-3 border-b">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
            </div>
          </div>

          {/* Table rows */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="px-6 py-4 border-b last:border-b-0">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="h-4 w-12 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                <div className="flex justify-end">
                  <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}