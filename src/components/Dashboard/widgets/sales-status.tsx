import React from "react";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSalesStatus } from "@/hooks/network/dashboard/useGetSalesStatus";

import { WidgetSkeleton } from "../DashboardDndWidgetGrid";

const SalesStatus = ({ locations }: { locations: string[] }) => {
  const sales = useGetSalesStatus({ locations, clientDate: new Date() });

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Sales status</CardTitle>
      </CardHeader>
      <CardContent>
        {sales.isLoading ? (
          <WidgetSkeleton />
        ) : (
          <p>{JSON.stringify(sales.data)}</p>
        )}
      </CardContent>
    </>
  );
};

export default SalesStatus;
