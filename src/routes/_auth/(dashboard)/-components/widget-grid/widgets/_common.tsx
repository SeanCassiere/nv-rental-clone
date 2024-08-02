import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";

import { Skeleton } from "@/components/ui/skeleton";

import type { Auth } from "@/lib/query/helpers";

import { cn } from "@/lib/utils/styles";

export interface CommonWidgetProps {
  selectedLocationIds: string[];
  auth: Auth["auth"];
  draggableAttributes: DraggableAttributes;
  draggableListeners: DraggableSyntheticListeners;
  widgetId: string;
}

export function WidgetSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn("h-full min-h-[250px] w-full rounded-md", className)}
    />
  );
}
