import { Suspense, lazy, useEffect, useMemo } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from "@tanstack/router";
import {
  MoreVerticalIcon,
  PencilIcon,
  ChevronRightIcon,
  PowerOffIcon,
  PowerIcon,
} from "lucide-react";

import ProtectorShield from "@/components/protector-shield";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  editCustomerByIdRoute,
  viewCustomerByIdRoute,
} from "@/routes/customers/customer-id-route";

import { useGetCustomerData } from "@/hooks/network/customer/useGetCustomerData";
import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";
import { LoadingPlaceholder } from "@/components/loading-placeholder";

import { titleMaker } from "@/utils/title-maker";
import { cn } from "@/utils";

const SummaryTab = lazy(
  () => import("../components/primary-module/tabs/customer/summary-content")
);
const ModuleNotesTabContent = lazy(
  () => import("../components/primary-module/tabs/notes-content")
);

function CustomerViewPage() {
  const router = useRouter();
  const params = useParams();

  const { tab: tabName = "summary" } = useSearch({
    from: viewCustomerByIdRoute.id,
  });

  const navigate = useNavigate();

  const customerId = params.customerId || "";

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
        <ModuleNotesTabContent module="customers" referenceId={customerId} />
      ),
    });
    tabs.push({
      id: "documents",
      label: "Documents",
      component: "Documents Tab",
    });

    return tabs;
  }, [customerId]);

  const onTabClick = (newTabId: string) => {
    navigate({
      to: viewCustomerByIdRoute.to,
      search: (others) => ({ ...others, tab: newTabId }),
      params: { customerId },
      replace: true,
    });
  };

  const customerQuery = useGetCustomerData({
    customerId,
  });
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
            <Link
              className="text-2xl font-semibold leading-6"
              onClick={() => {
                router.history.go(-1);
              }}
            >
              Customers
            </Link>
            <ChevronRightIcon
              className="h-4 w-4 flex-shrink-0"
              aria-hidden="true"
            />
            <Link
              to={viewCustomerByIdRoute.to}
              search={(current) => ({ tab: current?.tab || "summary" })}
              params={{ customerId }}
              className="max-w-[230px] truncate text-2xl font-semibold leading-6 text-foreground/80 md:max-w-full"
            >
              {customer?.firstName}&nbsp;
              {customer?.lastName}
            </Link>
          </div>
          <div className="flex w-full gap-2 sm:w-max">
            <Link
              to={editCustomerByIdRoute.to}
              search={() => ({})}
              params={{ customerId: String(customerId) }}
              className={cn(
                buttonVariants({ size: "sm", variant: "secondary" })
              )}
            >
              <PencilIcon className="h-4 w-4 sm:mr-2" />
              <span className="inline-block">Edit</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  type="button"
                  className="flex items-center justify-center gap-2"
                  variant="secondary"
                >
                  <MoreVerticalIcon className="mr-0.5 h-4 w-4" />
                  <span className="inline-block">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>More actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {customer?.active ? (
                    <DropdownMenuItem>
                      <PowerOffIcon className="mr-2 h-4 w-4 sm:mr-4" />
                      <span>Deactivate</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <PowerIcon className="mr-2 h-4 w-4 sm:mr-4" />
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
