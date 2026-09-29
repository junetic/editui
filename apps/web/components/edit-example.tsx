import { EditQueue, type QueueItem } from "@/components/edit-queue";

export function EditExample({ edits, action }: { edits: QueueItem[]; action?: string }) {
  return (
    <div className="not-prose my-8">
      <EditQueue items={edits} action={action} />
    </div>
  );
}

export function DemoVideo({ src }: { src: string }) {
  return (
    <video className="my-8 w-full rounded-2xl border border-line bg-black" controls playsInline preload="metadata">
      <source src={src} type="video/mp4" />
    </video>
  );
}
