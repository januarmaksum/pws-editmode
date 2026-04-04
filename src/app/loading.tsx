export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-zinc-900" />
        <p className="text-sm font-medium text-zinc-500 italic">
          Loading Page Content...
        </p>
      </div>
    </div>
  );
}
