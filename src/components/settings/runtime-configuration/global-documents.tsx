import React from "react";
import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const GlobalDocumentsSettings = () => {
  const { t } = useTranslation();

  return (
    <Card className="shadow-none">
      <CardHeader className="p-4 lg:p-6">
        <CardTitle className="text-lg">
          {t("titles.globalDocuments", { ns: "settings" })}
        </CardTitle>
        <CardDescription className="text-base">
          {t("descriptions.globalDocuments", { ns: "settings" })}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 lg:px-6 lg:pb-5">
        <Skeleton className="h-72" />
      </CardContent>
    </Card>
  );
};

export default GlobalDocumentsSettings;
