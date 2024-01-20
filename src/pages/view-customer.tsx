import { lazy, Suspense, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Link,
  RouteApi,
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

import { LoadingPlaceholder } from "@/components/loading-placeholder";
import ProtectorShield from "@/components/protector-shield";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import { getAuthFromAuthHook } from "@/utils/auth";
import { titleMaker } from "@/utils/title-maker";

import { cn } from "@/utils";

const SummaryTab = lazy(
  () => import("../components/primary-module/tabs/customer/summary-content")
);
const ModuleNotesTabContent = lazy(
  () => import("../components/primary-module/tabs/notes-content")
);

const routeApi = new RouteApi({ id: "/customers/$customerId" });

function CustomerViewPage() {
  const router = useRouter();
  const auth = useAuth();

  const authParams = getAuthFromAuthHook(auth);

  const routeContext = routeApi.useRouteContext();
  const { customerId } = routeApi.useParams();
  const { tab: tabName = "summary" } = routeApi.useSearch();

  const navigate = useNavigate();

  const tabsConfig = useMemo(() => {
    const tabs: { id: string; label: string; component: React.ReactNode }[] =
      [];

    tabs.push({
      id: "summary",
      label: "Summary",
      component: <SummaryTab customerId={customerId} />,
    });
    tabs.push({
      id: "notes",
      label: "Notes",
      component: (
        <ModuleNotesTabContent
          module="customers"
          referenceId={customerId}
          clientId={authParams.clientId}
          userId={authParams.userId}
        />
      ),
    });
    tabs.push({
      id: "documents",
      label: "Documents",
      component: "Documents Tab",
    });

    return tabs;
  }, [customerId, authParams]);

  const onTabClick = (newTabId: string) => {
    navigate({
      to: "/customers/$customerId",
      search: (others) => ({ ...others, tab: newTabId }),
      params: { customerId },
      replace: true,
    });
  };

  const customerQuery = useQuery(routeContext.viewCustomerOptions);
  const customer =
    customerQuery.data?.status === 200 ? customerQuery.data.body : null;

  useDocumentTitle(
    titleMaker(
      (customer?.firstName && customer?.lastName
        ? customer?.firstName + " " + customer?.lastName
        : "Loading") + " - Customers"
    )
  );

  useEffect(() => {
    if (customerQuery.status !== "error") return;

    router.history.go(-1);
  }, [customerQuery.status, router.history]);

  return (
    <ProtectorShield>
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mx-4 sm:px-1"
        )}
      >
        <div
          className={cn(
            "flex min-h-[2.5rem] flex-col items-center justify-between gap-4 sm:flex-row"
          )}
        >
          <div className="flex w-full items-center justify-start gap-2">
            <Link to=".." className="text-2xl font-semibold leading-6">
              Customers
            </Link>
            <icons.ChevronRight
              className="h-4 w-4 flex-shrink-0"
              aria-hidden="true"
            />
            <Link
              to="/customers/$customerId"
              search={(current) => ({
                tab:
                  "tab" in current && typeof current.tab === "string"
                    ? current.tab
                    : "summary",
              })}
              params={{ customerId }}
              className="max-w-[230px] truncate text-2xl font-semibold leading-6 text-foreground/80 md:max-w-full"
            >
              {customer?.firstName}&nbsp;
              {customer?.lastName}
            </Link>
          </div>
          <div className="flex w-full gap-2 sm:w-max">
            <Link
              to="/customers/$customerId/edit"
              search={() => ({})}
              params={{ customerId: String(customerId) }}
              className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
            >
              <icons.Edit className="h-4 w-4 sm:mr-2" />
              <span className="inline-block">Edit</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  type="button"
                  className="flex items-center justify-center gap-2"
                  variant="outline"
                >
                  <icons.More className="h-4 w-4" />
                  <span className="sr-only inline-block">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>More actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {customer?.active ? (
                    <DropdownMenuItem>
                      <icons.Deactivate className="mr-2 h-4 w-4 sm:mr-4" />
                      <span>Deactivate</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <icons.Activate className="mr-2 h-4 w-4 sm:mr-4" />
                      <span>Activate</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className={cn("text-base text-foreground/80")}>
          View the details related to this customer.
        </p>
        <Separator className="mt-3.5" />
      </section>

      <section
        className={cn(
          "mx-auto mb-4 mt-4 flex max-w-full flex-col gap-2 px-2 sm:mx-4 sm:mb-6 sm:px-1"
        )}
      >
        <Tabs value={tabName} onValueChange={onTabClick}>
          <TabsList className="w-full sm:max-w-max">
            {tabsConfig.map((tab, idx) => (
              <TabsTrigger key={`tab-trigger-${idx}`} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabsConfig.map((tab, idx) => (
            <TabsContent
              key={`tab-content-${idx}`}
              value={tab.id}
              className="min-h-[250px]"
            >
              <Suspense fallback={<LoadingPlaceholder />}>
                {tab.component}
              </Suspense>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </ProtectorShield>
  );
}

export default CustomerViewPage;
