import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";

export const ModuleStatBlockContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
        className
      )}
    >
      {children}
    </div>
  );
};

export const ModuleStatBlock = ({
  header,
  stat,
}: {
  header: string;
  stat?: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <CardTitle className="text-sm font-medium sm:text-base">
          {header}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="block text-xl font-medium tabular-nums underline-offset-4">
          {stat}
        </p>
      </CardContent>
    </Card>
  );
};
