import { useCallback, useMemo, useState } from "react";
import classNames from "classnames";
import { useNavigate, useSearch } from "@tanstack/react-router";

import Protector from "../../components/Protector";
import DashboardStatsBlock from "../../components/Dashboard/DashboardStatsBlock";
import DashboardBannerNotices from "../../components/Dashboard/DashboardBannerNotices";
import DashboardDndWidgetGrid from "../../components/Dashboard/DashboardDndWidgetGrid";
import ScrollToTop from "../../components/ScrollToTop";
import CommonHeader from "../../components/Layout/CommonHeader";
import {
  LockClosedOutline,
  LockOpenOutline,
  SettingsCogOutline,
} from "../../components/icons";
import DashboardWidgetPickerModal from "../../components/Dialogs/DashboardWidgetPickerModal";

import { indexRoute } from "../../routes";
import { useGetDashboardStats } from "../../hooks/network/dashboard/useGetDashboardStats";
import { useGetDashboardNoticeList } from "../../hooks/network/dashboard/useGetDashboardNoticeList";
import { useGetDashboardWidgetList } from "../../hooks/network/dashboard/useGetDashboardWidgetList";
import { useSaveDashboardWidgetList } from "../../hooks/network/dashboard/useSaveDashboardWidgetList";
import { useDocumentTitle } from "../../hooks/internal/useDocumentTitle";
import { titleMaker } from "../../utils/title-maker";
import type { DashboardWidgetItemParsed } from "../../utils/schemas/dashboard";
import type { StringNumberIdType } from "../../utils/query-key";

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

  const noticeList = useGetDashboardNoticeList();

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
      <ScrollToTop />
      <DashboardWidgetPickerModal
        show={showWidgetPickerModal}
        onModalStateChange={handleSetShowWidgetPickerModal}
        onWidgetSave={handleWidgetSortingEnd}
      />
      {noticeList.data.length > 0 && (
        <div className="grid gap-1">
          {noticeList.data.map((notice) => (
            <DashboardBannerNotices notice={notice} key={notice.id} />
          ))}
        </div>
      )}
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <CommonHeader
            titleContent={
              <h1 className="select-none text-2xl font-semibold leading-6 text-gray-700">
                Dashboard
              </h1>
            }
          />
        </div>

        <div className="mx-auto max-w-full px-4 pt-4 sm:px-6 md:px-8">
          <div className="pb-4">
            <CommonHeader
              titleContent={
                <h2 className="select-none text-xl font-semibold leading-6 text-gray-700">
                  Overview
                </h2>
              }
              subtitleText="Jump into what's going on with your fleet."
              includeBottomBorder
            />
          </div>
          <DashboardStatsBlock statistics={statistics.data} />

          <div className="pt-8">
            <CommonHeader
              titleContent={
                <h2 className="select-none text-xl font-semibold leading-6 text-gray-700">
                  Widgets
                  <span className="ml-4 inline-block sm:ml-5">
                    <button
                      className="pt-2 text-slate-500 sm:pt-0"
                      onClick={() => {
                        handleSetShowWidgetPickerModal(true);
                      }}
                    >
                      <SettingsCogOutline className="h-5 w-5 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      className={classNames(
                        "ml-2 text-slate-500 sm:pt-0",
                        isWidgetsLocked ? "" : "pl-0.5"
                      )}
                      onClick={() => setIsWidgetsLocked((prev) => !prev)}
                    >
                      {isWidgetsLocked ? (
                        <LockClosedOutline className="h-5 w-5 sm:h-4 sm:w-4" />
                      ) : (
                        <LockOpenOutline className="h-5 w-5 sm:h-4 sm:w-4" />
                      )}
                    </button>
                  </span>
                </h2>
              }
              subtitleText="My list of personalized widgets."
              includeBottomBorder
            />
          </div>

          <div className="mt-4">
            <DashboardDndWidgetGrid
              key={widgetIds.join(",")}
              widgets={widgets}
              selectedLocationIds={currentLocationIds}
              onWidgetSortingEnd={handleWidgetSortingEnd}
              isLocked={isWidgetsLocked}
            />
          </div>
        </div>
      </div>
    </Protector>
  );
}

export default IndexPage;
