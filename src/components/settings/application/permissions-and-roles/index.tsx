import React, { Suspense } from "react";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PermissionsAndRoles = () => {
  const { t } = useTranslation();

  const auth = useAuth();

  const clientId = auth.user?.profile?.navotar_clientid;
  const userId = auth.user?.profile?.navotar_userid;

  return (
    <Card className="shadow-none">
      <CardHeader className="p-4 lg:p-6">
        <CardTitle className="text-lg">
          {t("titles.permissionsAndRoles", { ns: "settings" })}
        </CardTitle>
        <CardDescription className="text-base">
          {t("descriptions.permissionsAndRoles", { ns: "settings" })}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 lg:px-6 lg:pb-5">
        <div className="flex items-center justify-start pb-4">
          <Button size="sm">
            <PlusIcon className="h-4 w-4 sm:mr-2" />
            <span>{t("buttons.addUser", { ns: "labels" })}</span>
          </Button>
        </div>
        <Suspense fallback={<Skeleton className="h-72" />}>
          {clientId && userId ? <div>Hello world</div> : null}
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default PermissionsAndRoles;
