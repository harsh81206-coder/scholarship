import { Skeleton } from "@/components/states/Skeleton";

export default function Loading() {
  return <main className="mx-auto max-w-5xl space-y-4 p-6"><Skeleton rows={1} className="h-10 w-1/3" /><Skeleton rows={6} /></main>;
}
