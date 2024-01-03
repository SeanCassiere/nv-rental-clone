import React from "react";
import { Link } from "@tanstack/react-router";

import { useGetDashboardMessages } from "@/hooks/network/dashboard/useGetDashboardMessages";

import { UI_APPLICATION_NAME } from "@/utils/constants";

import { AppNavigation } from "./app-navigation";
import { BannerNotice } from "./banner-notice";
import { CommandMenu } from "./command-menu";
import { UserNavigationDropdown } from "./user-navigation-dropdown";

export const HeaderLayout = () => {
  const messagesList = useGetDashboardMessages();
  const messages = [...(messagesList.data ? messagesList.data : [])];

  return (
    <>
      <header>
        {messages.length > 0 && (
          <section className="grid w-full divide-y divide-bannerPromo-foreground/80 bg-bannerPromo">
            {messages.map((notice) => (
              <BannerNotice
                message={notice}
                key={`banner_notice_${notice.messageId}`}
              />
            ))}
          </section>
        )}
        <div className="mx-auto max-w-[1700px] px-1 md:px-5">
          <div className="flex items-center px-4 pb-4 pt-6 md:px-10 md:pt-8">
            <div className="mr-2 md:ml-2">
              <Link to="/">
                <img
                  // logo url is set in the global css under the name --logo-url
                  className="h-10 w-10 rounded-full p-1 [content:var(--logo-url)]"
                  alt={UI_APPLICATION_NAME}
                  style={{ imageRendering: "crisp-edges" }}
                />
              </Link>
            </div>
            <div className="flex flex-grow items-center">
              <Link
                to="/"
                className="hidden items-center rounded p-1 text-lg font-medium leading-3 transition sm:flex"
              >
                {UI_APPLICATION_NAME}
              </Link>
            </div>
            <div className="flex flex-none items-center gap-x-2">
              <CommandMenu />
              <UserNavigationDropdown />
            </div>
          </div>
        </div>
      </header>
      <AppNavigation className="w-full border-b bg-background shadow-sm md:sticky md:top-0 md:z-20" />
    </>
  );
};
