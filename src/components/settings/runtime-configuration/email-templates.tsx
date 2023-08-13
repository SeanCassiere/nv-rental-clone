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
    <Card className="[&>div]:p-4 [&>div]:lg:p-6">
      <CardHeader>
        <CardTitle className="text-lg">Email templates</CardTitle>
        <CardDescription className="text-base">
          Configure the email templates that are used by the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-72" />
      </CardContent>
    </Card>
  );
};

export default EmailTemplatesSettings;
