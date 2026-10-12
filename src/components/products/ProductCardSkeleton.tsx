export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-ink/10 p-4 animate-pulse">
      <div className="aspect-square rounded-xl bg-ink/8 mb-4" />
      <div className="h-3 w-16 bg-ink/8 rounded-full mb-2" />
      <div className="h-4 w-32 bg-ink/10 rounded-full mb-2" />
      <div className="h-3 w-20 bg-ink/8 rounded-full" />
    </div>
  );
}