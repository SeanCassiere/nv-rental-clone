import { lazy, useMemo } from "react";
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

import Protector from "@/components/Protector";
import {
  ModuleTabs,
  type ModuleTabConfigItem,
} from "@/components/primary-module/ModuleTabs";
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

import {
  editCustomerByIdRoute,
  viewCustomerByIdRoute,
} from "@/routes/customers/customerIdPath";

import { useGetCustomerData } from "@/hooks/network/customer/useGetCustomerData";
import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import { getStartingIndexFromTabName } from "@/utils/moduleTabs";
import { titleMaker } from "@/utils/title-maker";
import { cn } from "@/utils";

const SummaryTab = lazy(
  () => import("../../components/Customer/CustomerSummaryTab")
);
const ModuleNotesTabContent = lazy(
  () => import("../../components/primary-module/ModuleNotesTabContent")
);

function CustomerViewPage() {
  const router = useRouter();
  const params = useParams();

  const { tab: tabName = "summary" } = useSearch({
    from: viewCustomerByIdRoute.id,
  });

  const navigate = useNavigate({ from: viewCustomerByIdRoute.id });

  const customerId = params.customerId || "";

  const tabsConfig = useMemo(() => {
    const tabs: ModuleTabConfigItem[] = [];

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

  const handleFindError = () => {
    router.history.go(-1);
  };

  const onTabClick = (newTab: ModuleTabConfigItem) => {
    navigate({
      to: viewCustomerByIdRoute.to,
      search: (others) => ({ ...others, tab: newTab.id }),
      params: { customerId },
      replace: true,
    });
  };

  const customer = useGetCustomerData({
    customerId,
    onError: handleFindError,
  });

  useDocumentTitle(
    titleMaker(
      (customer.data?.firstName && customer.data?.lastName
        ? customer.data?.firstName + " " + customer.data?.lastName
        : "Loading") + " - Customers"
    )
  );

  return (
    <Protector>
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
              className="text-2xl font-semibold leading-6 text-primary"
              onClick={() => {
                router.history.go(-1);
              }}
            >
              Customers
            </Link>
            <ChevronRightIcon
              className="h-4 w-4 flex-shrink-0 text-primary"
              aria-hidden="true"
            />
            <Link
              to={viewCustomerByIdRoute.to}
              search={(current) => ({ tab: current?.tab || "summary" })}
              params={{ customerId }}
              className="max-w-[230px] truncate text-2xl font-semibold leading-6 text-primary/80 md:max-w-full"
            >
              {customer?.data?.firstName}&nbsp;
              {customer?.data?.lastName}
            </Link>
          </div>
          <div className="flex w-full gap-2 sm:w-max">
            <Link
              to={editCustomerByIdRoute.to}
              search={() => ({})}
              params={{ customerId: String(customerId) }}
              className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
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
                  variant="ghost"
                >
                  <MoreVerticalIcon className="mr-0.5 h-4 w-4" />
                  <span className="inline-block">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>More actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {customer.data?.active ? (
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
        <p className={cn("text-base text-primary/80")}>
          View the details related to this customer.
        </p>
        <Separator className="mt-3.5" />
      </section>

      <section
        className={cn(
          "mx-auto my-4 flex max-w-full flex-col gap-2 px-2 sm:mx-4 sm:my-6 sm:px-1"
        )}
      >
        <ModuleTabs
          tabConfig={tabsConfig}
          startingIndex={getStartingIndexFromTabName(tabName, tabsConfig)}
          onTabClick={onTabClick}
        />
      </section>
    </Protector>
  );
}

export default CustomerViewPage;
