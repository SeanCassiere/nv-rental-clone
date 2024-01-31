import React from "react";
import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { icons } from "@/components/ui/icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createLazyFileRoute(
  "/_auth/settings/application/locations"
)({
  component: LocationsPage,
});

const routeApi = getRouteApi("/_auth/settings/application/locations");

function LocationsPage() {
  const { t } = useTranslation();

  return (
    <>
      <Card className="shadow-none">
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="text-lg">
            {t("titles.locations", { ns: "settings" })}
          </CardTitle>
          <CardDescription className="text-base">
            {t("descriptions.locations", { ns: "settings" })}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0 lg:px-6 lg:pb-5">
          <div className="flex items-center justify-start gap-x-2 pb-2">
            <Button
              size="sm"
              // onClick={() => setShowNew(true)}
            >
              <icons.Plus className="h-4 w-4 sm:mr-2" />
              <span>{t("labels.addLocation", { ns: "settings" })}</span>
            </Button>
          </div>
          <div className="flex items-center gap-x-2 pb-4">
            <Select
              defaultValue="active"
              // value={filterMode}
              // onValueChange={setFilterMode}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="active">
                    {t("display.active", { ns: "labels" })}
                  </SelectItem>
                  <SelectItem value="inactive">
                    {t("display.inactive", { ns: "labels" })}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* <Suspense fallback={<Skeleton className="h-72" />}>
            <SystemRolesList filterMode={filterMode} />
          </Suspense> */}
        </CardContent>
      </Card>
    </>
  );
}
