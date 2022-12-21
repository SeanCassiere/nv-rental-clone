import classNames from "classnames";
import { useState } from "react";
import { useAuth } from "react-oidc-context";
import type { DashboardNoticeType } from "../../types/Dashboard";
import { MegaPhoneOutline, XMarkOutline } from "../icons";

const DashboardBannerNotices = ({
  notice,
}: {
  notice: DashboardNoticeType;
}) => {
  const auth = useAuth();
  const [show, setShow] = useState(true);

  const onDismiss = () => {
    setShow(false);
    const localStorageKey = `${auth.user?.profile.navotar_clientid}:${auth.user?.profile.navotar_userid}:dismissed-notices`;
    const local = localStorage.getItem(localStorageKey);
    const data: string[] = local ? JSON.parse(local) : [];
    data.push(notice.id);
    localStorage.setItem(localStorageKey, JSON.stringify(data));
  };

  if (!show) return null;

  return (
    <div className="bg-teal-500">
      <div className="mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex w-0 flex-1 items-center">
            <span className="flex rounded-lg bg-teal-600 p-2">
              <MegaPhoneOutline
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            </span>
            <p className="ml-3 truncate font-medium text-white">
              <span className="md:hidden">{notice.titleTextShort}</span>
              <span className="hidden md:inline">{notice.titleText}</span>
            </p>
          </div>
          <div className="order-3 mt-2 w-full flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
            <a
              href={notice.link || "#"}
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-teal-600 shadow-sm hover:bg-indigo-50"
            >
              {notice.actionText}
            </a>
          </div>
          <div
            className={classNames(
              notice.ignoreDismiss
                ? "sm:hidden"
                : "order-2 flex-shrink-0 sm:order-3 sm:ml-3"
            )}
          >
            <button
              type="button"
              className={classNames(
                "-mr-1 flex rounded-md p-2 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2",
                notice.ignoreDismiss ? "opacity-0" : ""
              )}
              onClick={notice.ignoreDismiss ? undefined : onDismiss}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkOutline className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBannerNotices;
