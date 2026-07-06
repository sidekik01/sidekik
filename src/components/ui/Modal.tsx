import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export function Modal({
  children,
  isOpen,
  onClose,
  title,
}: Readonly<{
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}>) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur">
      <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-zinc-950 p-5 shadow-2xl shadow-black/60">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <Button aria-label="Close modal" onClick={onClose} size="sm" variant="ghost">
            <X className="size-4" />
          </Button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
