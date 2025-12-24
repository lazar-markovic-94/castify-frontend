/**
 * Loading fallback component for lazy-loaded routes
 * Shows a centered spinner while the route component is being loaded
 */
export function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent shadow-lg"></div>
        <p className="text-slate-600 mt-6 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Inline loading spinner for smaller components
 */
export function InlineLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
    </div>
  );
}
