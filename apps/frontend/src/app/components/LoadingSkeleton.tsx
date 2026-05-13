export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#080C10] px-6 py-12">
      <div className="mx-auto max-w-2xl rounded-xl border border-[#1E2730] bg-[#0D1117] overflow-hidden animate-pulse">
        <div className="h-24 bg-[#161B22]" />
        <div className="px-8 py-6 space-y-4">
          <div className="flex gap-4 -mt-6">
            <div className="h-20 w-20 rounded-full bg-[#1E2730]" />
            <div className="space-y-2 pt-6">
              <div className="h-4 w-36 rounded bg-[#1E2730]" />
              <div className="h-3 w-24 rounded bg-[#1E2730]" />
            </div>
          </div>
          <div className="h-3 w-3/4 rounded bg-[#1E2730]" />
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-[#1E2730]" />
            ))}
          </div>
          <div className="space-y-3 pt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-3 w-1/2 rounded bg-[#1E2730]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}