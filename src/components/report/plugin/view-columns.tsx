import * as React from "react";
import { Columns as MixerHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ReportTablePlugin } from "@/types/report";

export const ViewColumns: ReportTablePlugin = (props) => {
  const { table } = props;

  return (
    <Button variant="outline" size="sm" className="flex h-8 w-full sm:w-fit">
      <MixerHorizontalIcon className="mr-2 h-4 w-4" />
      Columns
    </Button>
  );
};
