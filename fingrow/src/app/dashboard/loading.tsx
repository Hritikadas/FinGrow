import Card from '@/components/ui/Card';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-700 rounded-lg w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-600 rounded w-48 animate-pulse"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gray-600 rounded w-24 animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-600 rounded animate-pulse"></div>
              </div>
              <div className="h-8 bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-600 rounded w-20 animate-pulse"></div>
            </Card>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="h-6 bg-gray-700 rounded w-48 mb-6 animate-pulse"></div>
            <div className="h-64 bg-gray-600 rounded animate-pulse"></div>
          </Card>
          
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="h-6 bg-gray-700 rounded w-40 mb-6 animate-pulse"></div>
            <div className="h-64 bg-gray-600 rounded animate-pulse"></div>
          </Card>
        </div>
      </div>
    </div>
  );
}