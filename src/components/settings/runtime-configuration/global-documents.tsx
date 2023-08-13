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
    <Card className="[&>div]:p-4 [&>div]:lg:p-6">
      <CardHeader>
        <CardTitle className="text-lg">Global documents</CardTitle>
        <CardDescription className="text-base">
          Configure the global documents available for use throughout the
          system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-72" />
      </CardContent>
    </Card>
  );
};

export default GlobalDocumentsSettings;
