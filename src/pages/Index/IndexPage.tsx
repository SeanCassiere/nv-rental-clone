import { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/router";
import { LockIcon, UnlockIcon, SettingsIcon } from "lucide-react";

import Protector from "@/components/Protector";
import DashboardStatsBlock from "@/components/Dashboard/DashboardStatsBlock";
import DashboardDndWidgetGrid from "@/components/Dashboard/DashboardDndWidgetGrid";
import DashboardWidgetPickerModal from "@/components/Dialogs/DashboardWidgetPickerModal";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { indexRoute } from "@/routes";

import { useGetDashboardStats } from "@/hooks/network/dashboard/useGetDashboardStats";
import { useGetDashboardWidgetList } from "@/hooks/network/dashboard/useGetDashboardWidgetList";
import { useSaveDashboardWidgetList } from "@/hooks/network/dashboard/useSaveDashboardWidgetList";
import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import type { DashboardWidgetItemParsed } from "@/schemas/dashboard";

import { cn } from "@/utils";
import type { StringNumberIdType } from "@/utils/query-key";
import { titleMaker } from "@/utils/title-maker";

function IndexPage() {
  const navigate = useNavigate({ from: indexRoute.id });
  const [isWidgetsLocked, setIsWidgetsLocked] = useState(true);

  const [currentLocationIds] = useState<StringNumberIdType[]>(["0"]);

  const { "show-widget-picker": showWidgetPickerModal = false } = useSearch({
    from: indexRoute.id,
  });

  const handleSetShowWidgetPickerModal = useCallback(
    (show: boolean) => {
      navigate({
        search: () => ({ ...(show ? { "show-widget-picker": show } : {}) }),
        replace: true,
      });
    },
    [navigate]
  );

  const widgetList = useGetDashboardWidgetList();
  const widgetIds = useMemo(() => {
    if (widgetList.data && Array.isArray(widgetList.data)) {
      return widgetList.data

        .filter((widget) => widget.isDeleted === false)
        .map((widget) => widget.widgetID);
    }
    return [];
  }, [widgetList.data]);
  const widgets = useMemo(() => {
    if (widgetList.data && Array.isArray(widgetList.data)) {
      return widgetList.data;
    }
    return [];
  }, [widgetList.data]);

  const statistics = useGetDashboardStats({
    locationId: currentLocationIds,
    clientDate: new Date(),
  });

  const saveDashboardWidgetsMutation = useSaveDashboardWidgetList();

  const handleWidgetSortingEnd = useCallback(
    (widgets: DashboardWidgetItemParsed[]) => {
      saveDashboardWidgetsMutation.mutate({ widgets });
    },
    [saveDashboardWidgetsMutation]
  );

  useDocumentTitle(titleMaker("Dashboard"));

  return (
    <Protector>
      <DashboardWidgetPickerModal
        show={showWidgetPickerModal}
        onModalStateChange={handleSetShowWidgetPickerModal}
        onWidgetSave={handleWidgetSortingEnd}
      />
      <section
        className={cn(
          "mx-auto my-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mx-4 sm:px-1"
        )}
      >
        <div className={cn("flex min-h-[2.5rem] items-center justify-between")}>
          <h1 className="text-2xl font-semibold leading-6 text-primary">
            Dashboard
          </h1>
        </div>
        <p className={cn("text-base text-primary/80")}>
          Jump into what's going on with your fleet.
        </p>
        <Separator className="mb-4 mt-3.5" />
        <DashboardStatsBlock statistics={statistics.data} />
        <div className="mb-2 mt-3.5 flex space-x-2">
          <Button
            size="sm"
            variant={isWidgetsLocked ? "outline" : "secondary"}
            onClick={() => setIsWidgetsLocked((prev) => !prev)}
          >
            {isWidgetsLocked ? (
              <LockIcon className="h-5 w-5 sm:h-4 sm:w-4" />
            ) : (
              <UnlockIcon className="h-5 w-5 sm:h-4 sm:w-4" />
            )}
            <span className="sr-only">
              {isWidgetsLocked ? "Locked widgets" : "Unlocked widgets"}
            </span>
          </Button>

          <Button
            size="sm"
            variant={!showWidgetPickerModal ? "outline" : "secondary"}
            onClick={() => {
              handleSetShowWidgetPickerModal(true);
            }}
          >
            <SettingsIcon className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
        </div>
        <DashboardDndWidgetGrid
          key={widgetIds.join(",")}
          widgets={widgets}
          selectedLocationIds={currentLocationIds}
          onWidgetSortingEnd={handleWidgetSortingEnd}
          isLocked={isWidgetsLocked}
        />
      </section>
    </Protector>
  );
}

export default IndexPage;
