import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const GlobalDocumentsSettings = () => {
  return (
    <Card className="shadow-none">
      <CardHeader className="p-4 lg:p-6">
        <CardTitle className="text-lg">Global documents</CardTitle>
        <CardDescription className="text-base">
          Configure the global documents available for use throughout the
          system.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 lg:p-6">
        <Skeleton className="h-72" />
      </CardContent>
    </Card>
  );
};

export default GlobalDocumentsSettings;
