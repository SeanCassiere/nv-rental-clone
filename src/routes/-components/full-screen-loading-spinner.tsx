import { icons } from "@/components/ui/icons";

export function FullPageLoadingSpinner() {
  return (
    <div className="grid min-h-full w-full place-items-center">
      <icons.Loading className="h-24 w-24 animate-spin text-foreground" />
    </div>
  );
}
