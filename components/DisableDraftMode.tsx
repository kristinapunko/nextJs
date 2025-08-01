"use client";
import { useDraftModeEnvironment } from "next-sanity/hooks";
import { useRouter } from "next/navigation";
export function DisableDraftMode() {
  const environment = useDraftModeEnvironment();
  const router = useRouter();
  // Only show the disable draft mode button when outside of Presentation Tool
  if (environment !== "live" && environment !== "unknown") {
    return null;
  }
  const handleClick = async () => {
    await fetch("/draft-mode/disable");
    router.refresh();
  };
  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4bg-gray-50 px-4 py-2 z-50"
    >
      Disable Draft Mode
    </button>
  );
}
