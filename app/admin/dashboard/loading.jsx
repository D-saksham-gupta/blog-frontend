export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-64 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border-2 border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-4">
                {[...Array(2)].map((_, j) => (
                  <div
                    key={j}
                    className="p-4 bg-gray-100 rounded-lg flex justify-between"
                  >
                    <div>
                      <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                      <div className="h-6 w-12 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Sections Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="p-3 bg-gray-100 rounded-lg flex justify-between"
                  >
                    <div className="space-y-2 w-full">
                      <div className="h-4 w-3/5 bg-gray-200 rounded"></div>
                      <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-4 border-2 border-gray-200 rounded-lg text-center"
              >
                <div className="h-10 w-10 bg-gray-200 rounded-full mx-auto mb-3"></div>
                <div className="h-4 w-20 bg-gray-200 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
