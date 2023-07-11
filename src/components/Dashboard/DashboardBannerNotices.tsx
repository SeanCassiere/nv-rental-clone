import { useState } from "react";
import { useAuth } from "react-oidc-context";

import { MegaPhoneOutline, XMarkOutline } from "../icons";
import type { TDashboardNotice } from "../../utils/schemas/dashboard";
import {
  getLocalStorageForUser,
  setLocalStorageForUser,
} from "../../utils/user-local-storage";
import { USER_STORAGE_KEYS } from "../../utils/constants";
import { cn } from "@/utils";

const DashboardBannerNotices = ({ notice }: { notice: TDashboardNotice }) => {
  const auth = useAuth();
  const [show, setShow] = useState(true);

  const onDismiss = () => {
    setShow(false);
    if (
      !auth.user?.profile.navotar_clientid ||
      !auth.user?.profile.navotar_userid
    )
      return;

    const local = getLocalStorageForUser(
      auth.user?.profile.navotar_clientid,
      auth.user?.profile.navotar_userid,
      USER_STORAGE_KEYS.dismissedNotices,
    );
    const data: string[] = local ? JSON.parse(local) : [];

    data.push(notice.id);

    setLocalStorageForUser(
      auth.user?.profile.navotar_clientid,
      auth.user?.profile.navotar_userid,
      "dismissed-notices",
      JSON.stringify(data),
    );
  };

  if (!show) return null;

  return (
    <div className="bg-teal-500">
      <div className="mx-auto max-w-[1620px] px-4 py-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex w-0 flex-1 items-center">
            <span className="flex rounded-lg bg-teal-600 p-2">
              <MegaPhoneOutline
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            </span>
            <p className="ml-3 truncate font-semibold text-white">
              <span className="md:hidden">{notice.titleTextShort}</span>
              <span className="hidden md:inline">{notice.titleText}</span>
            </p>
          </div>
          <div className="order-3 mt-2 w-full flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
            <a
              href={notice.link || "#"}
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-semibold text-teal-600 shadow-sm hover:bg-teal-50"
              target={notice.link?.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
            >
              {notice.actionText}
            </a>
          </div>
          <div
            className={cn(
              notice.ignoreDismiss
                ? "sm:hidden"
                : "order-2 flex-shrink-0 sm:order-3 sm:ml-3",
            )}
          >
            <button
              type="button"
              className={cn(
                "-mr-1 flex rounded-md p-2 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2",
                notice.ignoreDismiss ? "opacity-0" : "",
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
