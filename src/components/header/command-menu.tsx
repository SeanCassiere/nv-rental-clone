import React, { Fragment } from "react";
import { useRouter } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
import { icons } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";

import { useGlobalDialogContext } from "@/hooks/context/modals";
import { useAuthValues } from "@/hooks/internal/useAuthValues";
import { useDebounce } from "@/hooks/internal/useDebounce";
import { useTernaryDarkMode } from "@/hooks/internal/useTernaryDarkMode";
import { useGetAgreementsList } from "@/hooks/network/agreement/useGetAgreementsList";
import { useGetCustomersList } from "@/hooks/network/customer/useGetCustomersList";
import { useGetReservationsList } from "@/hooks/network/reservation/useGetReservationsList";
import { useGetVehiclesList } from "@/hooks/network/vehicle/useGetVehiclesList";

import { APP_DEFAULTS, USER_STORAGE_KEYS } from "@/utils/constants";
import { getLocalStorageForUser } from "@/utils/user-local-storage";
import type { GlobalSearchReturnType } from "@/types/search";

import { cn, IsMacLike } from "@/utils";

export const CommandMenu = () => {
  const router = useRouter();
  const navigate = router.navigate;

  const [text, setText] = React.useState("");

  const authValues = useAuthValues();

  const rowCountStr =
    getLocalStorageForUser(
      authValues.clientId,
      authValues.userId,
      USER_STORAGE_KEYS.tableRowCount
    ) || APP_DEFAULTS.tableRowCount;
  const defaultRowCount = parseInt(rowCountStr, 10);

  const { ternaryDarkMode, toggleTernaryDarkMode, nextToggleTernaryDarkMode } =
    useTernaryDarkMode();
  const { showCommandMenu, setShowCommandMenu, setShowLogout } =
    useGlobalDialogContext();

  const searchTerm = useDebounce(text, 350);

  // customers
  const customersQuery = useGetCustomersList({
    page: 1,
    pageSize: 50,
    filters: {
      Keyword: searchTerm,
    },
    enabled: Boolean(searchTerm),
  });
  const customersList =
    customersQuery.data?.status === 200 ? customersQuery.data?.body : [];
  const customers: GlobalSearchReturnType = customersList.map((customer) => {
    const displayText = `${customer.FullName}`;
    return {
      module: "customers",
      referenceId: `${customer.id}`,
      displayText,
      fullDisplayText: `Customers > ${displayText}`,
    };
  });

  // vehicles
  const vehiclesQuery = useGetVehiclesList({
    page: 1,
    pageSize: 50,
    filters: {
      LicenseNo: searchTerm,
    },
    enabled: Boolean(searchTerm),
  });
  const vehiclesList =
    vehiclesQuery.data?.status === 200 ? vehiclesQuery.data?.body : [];
  const vehicles: GlobalSearchReturnType = vehiclesList.map((vehicle) => {
    const displayText = `${vehicle.LicenseNo} ${vehicle.Year} ${vehicle.VehicleMakeName} ${vehicle.ModelName}`;
    return {
      module: "vehicles",
      referenceId: `${vehicle.id}`,
      displayText,
      fullDisplayText: `Vehicles > ${displayText}`,
    };
  });

  // reservations
  const reservationsQuery = useGetReservationsList({
    page: 1,
    pageSize: 50,
    filters: {
      Keyword: searchTerm,
      Statuses: ["2", "6", "7"],
    },
    enabled: Boolean(searchTerm),
  });
  const reservationsList =
    reservationsQuery.data?.status === 200 ? reservationsQuery.data?.body : [];
  const reservations: GlobalSearchReturnType = reservationsList.map((res) => {
    const displayText = String(
      res.ReservationNumber +
        " | " +
        String(res.FirstName + " " + res.LastName).trim() +
        " - " +
        String(res.VehicleType) +
        (res.LicenseNo ? " - " + String(res.LicenseNo) : "")
    ).trim();
    return {
      module: "reservations",
      referenceId: `${res.id}`,
      displayText,
      fullDisplayText: `Reservations > ${displayText}`,
    };
  });

  // agreements
  const agreementsQuery = useGetAgreementsList({
    page: 1,
    pageSize: 50,
    filters: {
      Keyword: searchTerm,
      Statuses: ["2", "5", "7"],
    },
    enabled: Boolean(searchTerm),
  });
  const agreementsList =
    agreementsQuery.data?.status === 200 ? agreementsQuery.data?.body : [];
  const agreements: GlobalSearchReturnType = agreementsList.map((agreement) => {
    const displayText = String(
      agreement.AgreementNumber +
        " | " +
        String(agreement.FullName).trim() +
        " - " +
        String(agreement.VehicleType) +
        " - " +
        String(agreement.LicenseNo)
    ).trim();
    return {
      module: "agreements",
      referenceId: `${agreement.id}`,
      displayText,
      fullDisplayText: `Agreements > ${displayText}`,
    };
  });

  const run = React.useCallback(
    (command: () => unknown, close = true) => {
      command();
      setText("");
      if (close) {
        setShowCommandMenu(false);
      }
    },
    [setShowCommandMenu]
  );

  React.useEffect(() => {
    const keyDownFn = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowCommandMenu((open) => !open);
      }
    };

    document.addEventListener("keydown", keyDownFn);
    return () => document.removeEventListener("keydown", keyDownFn);
  }, [setShowCommandMenu]);

  return (
    <Fragment>
      <Button
        variant="outline"
        className={cn(
          "relative w-52 items-center justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setShowCommandMenu(true)}
      >
        <span className="hidden lg:inline-flex">Search application...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-[0.55rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">{IsMacLike ? "⌘" : "Ctrl"}</span>+ K
        </kbd>
      </Button>
      <CommandDialog
        open={showCommandMenu}
        onOpenChange={setShowCommandMenu}
        loop
      >
        <CommandInput
          placeholder="Search..."
          value={text}
          onValueChange={setText}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup
            heading={vehicles.length > 0 ? "Fleet results" : undefined}
          >
            {searchTerm.length > 0 && vehiclesQuery.isLoading && (
              <CommandLoading>
                <Skeleton className="mx-2 mt-1 h-4 rounded-sm" />
              </CommandLoading>
            )}
            {vehicles.map((item, idx) => (
              <CommandItem
                key={`${item.fullDisplayText}_${idx}`}
                value={item.fullDisplayText}
                onSelect={() => {
                  run(() =>
                    navigate({
                      to: "/fleet/$vehicleId",
                      params: { vehicleId: item.referenceId },
                      search: () => ({ tab: "summary" }),
                    })
                  );
                }}
              >
                <icons.Car className="mr-2 h-4 w-4 text-primary/70" />
                {item.displayText}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup
            heading={customers.length > 0 ? "Customer results" : undefined}
          >
            {searchTerm.length > 0 && customersQuery.isLoading && (
              <CommandLoading>
                <Skeleton className="mx-2 mt-1 h-4 rounded-sm" />
              </CommandLoading>
            )}
            {customers.map((item, idx) => (
              <CommandItem
                key={`${item.fullDisplayText}_${idx}`}
                value={item.fullDisplayText}
                onSelect={() => {
                  run(() =>
                    navigate({
                      to: "/customers/$customerId",
                      params: { customerId: item.referenceId },
                      search: () => ({ tab: "summary" }),
                    })
                  );
                }}
              >
                <icons.Users className="mr-2 h-4 w-4 text-primary/70" />
                {item.displayText}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup
            heading={
              reservations.length > 0 ? "Reservation results" : undefined
            }
          >
            {searchTerm.length > 0 && reservationsQuery.isLoading && (
              <CommandLoading>
                <Skeleton className="mx-2 mt-1 h-4 rounded-sm" />
              </CommandLoading>
            )}
            {reservations.map((item, idx) => (
              <CommandItem
                key={`${item.fullDisplayText}_${idx}`}
                value={item.fullDisplayText}
                onSelect={() => {
                  run(() =>
                    navigate({
                      to: "/reservations/$reservationId",
                      params: { reservationId: item.referenceId },
                      search: () => ({ tab: "summary" }),
                    })
                  );
                }}
              >
                <icons.Calendar className="mr-2 h-4 w-4 text-primary/70" />
                {item.displayText}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup
            heading={agreements.length > 0 ? "Agreement results" : undefined}
          >
            {searchTerm.length > 0 && agreementsQuery.isLoading && (
              <CommandLoading>
                <Skeleton className="mx-2 mt-1 h-4 rounded-sm" />
              </CommandLoading>
            )}
            {agreements.map((item, idx) => (
              <CommandItem
                key={`${item.fullDisplayText}_${idx}`}
                value={item.fullDisplayText}
                onSelect={() => {
                  run(() =>
                    navigate({
                      to: "/agreements/$agreementId",
                      params: { agreementId: item.referenceId },
                      search: () => ({ tab: "summary" }),
                    })
                  );
                }}
              >
                <icons.FileSignature className="mr-2 h-4 w-4 text-primary/70" />
                {item.displayText}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Go to">
            <CommandItem
              onSelect={() => {
                run(() =>
                  navigate({
                    to: "/fleet",
                    search: () => ({ page: 1, size: defaultRowCount }),
                  })
                );
              }}
            >
              <icons.Car className="mr-2 h-4 w-4 text-primary/70" />
              Fleet
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(() =>
                  navigate({
                    to: "/customers",
                    search: () => ({ page: 1, size: defaultRowCount }),
                  })
                );
              }}
            >
              <icons.Users className="mr-2 h-4 w-4 text-primary/70" />
              Customers
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(() =>
                  navigate({
                    to: "/reservations",
                    search: () => ({ page: 1, size: defaultRowCount }),
                  })
                );
              }}
            >
              <icons.Calendar className="mr-2 h-4 w-4 text-primary/70" />
              Reservations
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(() =>
                  navigate({
                    to: "/agreements",
                    search: () => ({ page: 1, size: defaultRowCount }),
                  })
                );
              }}
            >
              <icons.FileSignature className="mr-2 h-4 w-4 text-primary/70" />
              Agreements
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(() =>
                  navigate({
                    to: "/",
                  })
                );
              }}
            >
              <icons.DashboardLayout className="mr-2 h-4 w-4 text-primary/70" />
              Dashboard
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(() =>
                  navigate({
                    to: "/agreements",
                    search: () => ({ page: 1, size: defaultRowCount }),
                  })
                );
              }}
            >
              <icons.BarChart className="mr-2 h-4 w-4 text-primary/70" />
              Reports
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="System">
            <CommandItem
              onSelect={() => {
                run(() => toggleTernaryDarkMode());
              }}
            >
              {ternaryDarkMode === "system" && (
                <icons.System className="mr-2 h-4 w-4 text-primary/70" />
              )}
              {ternaryDarkMode === "light" && (
                <icons.Sun className="mr-2 h-4 w-4 text-primary/70" />
              )}
              {ternaryDarkMode === "dark" && (
                <icons.Moon className="mr-2 h-4 w-4 text-primary/70" />
              )}
              Toggle theme (to {nextToggleTernaryDarkMode})
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(() =>
                  navigate({
                    to: "/settings/$destination",
                    params: () => ({ destination: "profile" }),
                  })
                );
              }}
            >
              <icons.User className="mr-2 h-4 w-4 text-primary/70" />
              Profile
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(() =>
                  navigate({
                    to: "/settings",
                  })
                );
              }}
            >
              <icons.Settings className="mr-2 h-4 w-4 text-primary/70" />
              Settings
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(() => setShowLogout(true), false);
              }}
            >
              <icons.Logout className="mr-2 h-4 w-4 text-primary/70" />
              Logout
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </Fragment>
  );
};
