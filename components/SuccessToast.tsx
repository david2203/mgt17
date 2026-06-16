"use client";

import { useEffect, useState } from "react";

// Grön success-toast nere till höger som försvinner efter 5 sekunder.
export default function SuccessToast({
  show,
  message,
}: {
  show: boolean;
  message: string;
}) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (!show) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, [show]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex max-w-xs items-start gap-3 rounded-lg border border-forest-500 bg-forest-600 px-4 py-3 text-sm text-white shadow-lg"
    >
      <span aria-hidden="true" className="mt-0.5 text-base">
        ✓
      </span>
      <span>{message}</span>
    </div>
  );
}
