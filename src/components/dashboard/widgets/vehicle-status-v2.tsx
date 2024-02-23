import { EmptyState } from "@/components/layouts/empty-state";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Auth } from "@/lib/query/helpers";

import { cn } from "@/lib/utils";

const data: { name: string; id: number }[] = [];

interface VehicleStatusWidgetProps extends Auth {
  locations: string[];
}

export default function VehicleStatusWidget(props: VehicleStatusWidgetProps) {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Fleet status</CardTitle>
      </CardHeader>
      <CardContent className="h-full pt-0">
        <VehicleStatusWidgetContent {...props} />
      </CardContent>
    </>
  );
}

export function VehicleStatusWidgetContent(props: VehicleStatusWidgetProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No vehicles"
        subtitle="You've got no vehicles in your fleet"
        styles={{
          containerClassName: cn("h-auto pt-4 sm:h-[270px] sm:pt-0"),
        }}
      />
    );
  }

  return <div></div>;
}
