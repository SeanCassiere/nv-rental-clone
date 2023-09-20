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

const EmailTemplatesSettings = () => {
  const { t } = useTranslation();

  return (
    <Card className="shadow-none">
      <CardHeader className="p-4 lg:p-6">
        <CardTitle className="text-lg">
          {t("titles.emailTemplates", { ns: "settings" })}
        </CardTitle>
        <CardDescription className="text-base">
          {t("descriptions.emailTemplates", { ns: "settings" })}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 lg:px-6 lg:pb-5">
        <Skeleton className="h-72" />
      </CardContent>
    </Card>
  );
};

export default EmailTemplatesSettings;
