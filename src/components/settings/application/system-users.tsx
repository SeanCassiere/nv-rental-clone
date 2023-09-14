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

const SystemUsersSettings = () => {
  const { t } = useTranslation("settings");

  return (
    <Card className="shadow-none">
      <CardHeader className="p-4 lg:p-6">
        <CardTitle className="text-lg">{t("titles.systemUsers")}</CardTitle>
        <CardDescription className="text-base">
          {t("descriptions.systemUsers")}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 lg:p-6">
        <Skeleton className="h-72" />
      </CardContent>
    </Card>
  );
};

export default SystemUsersSettings;
