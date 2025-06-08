import { Loader2 } from "lucide-react"

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <Loader2 className="h-16 w-16 animate-spin text-sky-600" />
      <p className="mt-4 text-lg text-slate-700 dark:text-slate-300">Loading your experience...</p>
    </div>
  )
}
