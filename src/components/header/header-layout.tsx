import React from "react";
import { Link } from "@tanstack/router";
import { useAuth } from "react-oidc-context";

import LoadingPlaceholder from "@/components/loading-placeholder";
import { indexRoute } from "@/routes";

import { useGetDashboardMessages } from "@/hooks/network/dashboard/useGetDashboardMessages";
import { UI_APPLICATION_NAME } from "@/utils/constants";

import { AppNavigation } from "./app-navigation";
import { BannerNotice } from "./banner-notice";
import { CommandMenu } from "./command-menu";
import { UserNavigationDropdown } from "./user-navigation-dropdown";

export const HeaderLayout = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  const messagesList = useGetDashboardMessages();
  const messages = [...(messagesList.data ? messagesList.data : [])];
  // this will be the loading placeholder that'll take up the entire page height
  if (auth.isLoading) {
    return <LoadingPlaceholder />;
  }

  if (!auth.isLoading && !auth.isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="relative border-b">
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
              <Link to={indexRoute.to}>
                <img
                  className="h-10 w-10 rounded-full p-1"
                  src="/android-chrome-192x192.png"
                  alt={UI_APPLICATION_NAME}
                  style={{ imageRendering: "crisp-edges" }}
                />
              </Link>
            </div>
            <div className="flex flex-grow items-center">
              <Link
                to={indexRoute.to}
                className="hidden items-center rounded p-1 text-lg font-medium leading-3 text-primary transition sm:flex"
              >
                {UI_APPLICATION_NAME}
              </Link>
            </div>
            <div className="flex flex-none items-center gap-x-2">
              <CommandMenu />
              <UserNavigationDropdown />
            </div>
          </div>
          <AppNavigation />
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1700px] flex-1 px-1 md:px-10">
        {children}
      </main>
    </>
  );
};
