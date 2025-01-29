import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

import { fetchDashboardMessagesOptions } from "@/lib/query/dashboard";

import { getAuthFromAuthHook } from "@/lib/utils/auth";
import { UI_APPLICATION_NAME } from "@/lib/utils/constants";

import { cn } from "@/lib/utils";

import { AppNavigation } from "./app-navigation";
import { BannerNotice } from "./banner-notice";
import { CommandMenu } from "./command-menu";
import { UserNavigationDropdown } from "./user-navigation-dropdown";

export default function AuthHeader() {
  const auth = useAuth();
  const authParams = getAuthFromAuthHook(auth);

  const messagesList = useQuery(
    fetchDashboardMessagesOptions({ auth: authParams })
  );
  const messages = messagesList.data ? messagesList.data.data : [];

  return (
    <>
      <header className="bg-card">
        {messages.length > 0 && (
          <section className="divide-bannerPromo-foreground/80 bg-bannerPromo grid w-full divide-y">
            {messages.map((notice) => (
              <BannerNotice
                message={notice}
                key={`banner_notice_${notice.messageId}`}
              />
            ))}
          </section>
        )}
        <div className={cn("mx-auto max-w-[1700px] px-1 md:px-5")}>
          <div className="flex items-center px-4 pt-6 pb-4 md:px-10 md:pt-8">
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
            <div className="flex grow items-center">
              <Link
                to="/"
                className="hidden items-center rounded p-1 text-lg leading-3 font-medium transition sm:flex"
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
      <AppNavigation
        className={cn("bg-card sticky top-0 z-20 w-full border-b md:shadow-xs")}
      />
    </>
  );
}
