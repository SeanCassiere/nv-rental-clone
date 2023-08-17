import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const EmailTemplatesSettings = () => {
  return (
    <Card className="shadow-none">
      <CardHeader className="p-4 lg:p-6">
        <CardTitle className="text-lg">Email templates</CardTitle>
        <CardDescription className="text-base">
          Configure the email templates that are used by the system.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 lg:p-6">
        <Skeleton className="h-72" />
      </CardContent>
    </Card>
  );
};

export default EmailTemplatesSettings;
