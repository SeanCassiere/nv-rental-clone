import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

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

import { useDebounce } from "@/lib/hooks/useDebounce";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useTernaryDarkMode } from "@/lib/hooks/useTernaryDarkMode";
import { useGlobalDialogContext } from "@/lib/context/modals";

import { fetchAgreementsSearchListOptions } from "@/lib/query/agreement";
import { fetchCustomersSearchListOptions } from "@/lib/query/customer";
import { fetchReservationsSearchListOptions } from "@/lib/query/reservation";
import { fetchVehiclesSearchListOptions } from "@/lib/query/vehicle";

import { getAuthFromAuthHook } from "@/lib/utils/auth";
import { STORAGE_DEFAULTS, STORAGE_KEYS } from "@/lib/utils/constants";

import type { GlobalSearchReturnType } from "@/lib/types/search";

import { cn, IsMacLike } from "@/lib/utils";

export const CommandMenu = () => {
  const router = useRouter();
  const navigate = router.navigate;
  const auth = useAuth();
  const authParams = getAuthFromAuthHook(auth);

  const [text, setText] = React.useState("");

  const [rowCountStr] = useLocalStorage(
    STORAGE_KEYS.tableRowCount,
    STORAGE_DEFAULTS.tableRowCount
  );
  const defaultRowCount = parseInt(rowCountStr, 10);

  const { setTernaryDarkMode } = useTernaryDarkMode();
  const { showCommandMenu, setShowCommandMenu, setShowLogout } =
    useGlobalDialogContext();

  const searchTerm = useDebounce(text, 350);

  // customers
  const customersQuery = useQuery(
    fetchCustomersSearchListOptions({
      auth: authParams,
      pagination: {
        page: 1,
        pageSize: 50,
      },
      filters: {
        Keyword: searchTerm,
      },
      enabled: showCommandMenu && Boolean(searchTerm),
    })
  );
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
  const vehiclesQuery = useQuery(
    fetchVehiclesSearchListOptions({
      auth: authParams,
      pagination: {
        page: 1,
        pageSize: 50,
      },
      filters: {
        LicenseNo: searchTerm,
      },
      enabled: showCommandMenu && Boolean(searchTerm),
    })
  );
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
  const reservationsQuery = useQuery(
    fetchReservationsSearchListOptions({
      auth: authParams,
      pagination: {
        page: 1,
        pageSize: 50,
      },
      filters: {
        clientDate: new Date(),
        Keyword: searchTerm,
        Statuses: ["2", "6", "7"],
      },
      enabled: showCommandMenu,
    })
  );
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
  const agreementsQuery = useQuery(
    fetchAgreementsSearchListOptions({
      auth: authParams,
      pagination: {
        page: 1,
        pageSize: 50,
      },
      filters: {
        currentDate: new Date(),
        Keyword: searchTerm,
        Statuses: ["2", "5", "7"],
      },
      enabled: showCommandMenu,
    })
  );
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
    <React.Fragment>
      <Button
        variant="outline"
        className={cn(
          "relative w-52 items-center justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setShowCommandMenu(true)}
      >
        <span className="hidden lg:inline-flex">Search application...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-[0.55rem] hidden h-5 select-none items-center gap-1 rounded-md border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
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
            heading={
              text.length > 0 && vehicles.length > 0
                ? "Fleet results"
                : undefined
            }
            className={
              text.length === 0 || vehicles.length === 0
                ? "p-0 [&_[cmdk-group-heading]]:py-0"
                : undefined
            }
          >
            {text.length > 0 && vehiclesQuery.isLoading ? (
              <CommandLoading>
                <Skeleton className="mx-2 mt-1 h-4 rounded-sm" />
              </CommandLoading>
            ) : null}
            {Boolean(text) &&
              vehicles.map((item, idx) => (
                <CommandItem
                  key={`${item.fullDisplayText}_${idx}`}
                  value={item.fullDisplayText}
                  onSelect={() => {
                    run(() =>
                      navigate({
                        to: "/fleet/$vehicleId/summary",
                        params: { vehicleId: item.referenceId },
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
            heading={
              text.length > 0 && customers.length > 0
                ? "Customer results"
                : undefined
            }
            className={
              text.length === 0 || customers.length === 0
                ? "p-0 [&_[cmdk-group-heading]]:py-0"
                : undefined
            }
          >
            {text.length > 0 && customersQuery.isLoading ? (
              <CommandLoading>
                <Skeleton className="mx-2 mt-1 h-4 rounded-sm" />
              </CommandLoading>
            ) : null}
            {Boolean(text) &&
              customers.map((item, idx) => (
                <CommandItem
                  key={`${item.fullDisplayText}_${idx}`}
                  value={item.fullDisplayText}
                  onSelect={() => {
                    run(() =>
                      navigate({
                        to: "/customers/$customerId/summary",
                        params: { customerId: item.referenceId },
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
              text.length > 0 && reservations.length > 0
                ? "Reservation results"
                : undefined
            }
            className={
              text.length === 0 || reservations.length === 0
                ? "p-0 [&_[cmdk-group-heading]]:py-0"
                : undefined
            }
          >
            {text.length > 0 && reservationsQuery.isLoading ? (
              <CommandLoading>
                <Skeleton className="mx-2 mt-1 h-4 rounded-sm" />
              </CommandLoading>
            ) : null}
            {Boolean(text) &&
              reservations.map((item, idx) => (
                <CommandItem
                  key={`${item.fullDisplayText}_${idx}`}
                  value={item.fullDisplayText}
                  onSelect={() => {
                    run(() =>
                      navigate({
                        to: "/reservations/$reservationId/summary",
                        params: { reservationId: item.referenceId },
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
            heading={
              text.length > 0 && agreements.length > 0
                ? "Agreement results"
                : undefined
            }
            className={
              text.length === 0 || agreements.length === 0
                ? "p-0 [&_[cmdk-group-heading]]:py-0"
                : undefined
            }
          >
            {text.length > 0 && agreementsQuery.isLoading ? (
              <CommandLoading>
                <Skeleton className="mx-2 mt-1 h-4 rounded-sm" />
              </CommandLoading>
            ) : null}
            {Boolean(text) &&
              agreements.map((item, idx) => (
                <CommandItem
                  key={`${item.fullDisplayText}_${idx}`}
                  value={item.fullDisplayText}
                  onSelect={() => {
                    run(() =>
                      navigate({
                        to: "/agreements/$agreementId/summary",
                        params: { agreementId: item.referenceId },
                      })
                    );
                  }}
                >
                  <icons.FileSignature className="mr-4 h-4 w-4 text-primary/70" />
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
              <icons.Car className="mr-4 h-4 w-4 text-primary/70" />
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
              <icons.Users className="mr-4 h-4 w-4 text-primary/70" />
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
              <icons.Calendar className="mr-4 h-4 w-4 text-primary/70" />
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
              <icons.FileSignature className="mr-4 h-4 w-4 text-primary/70" />
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
              <icons.DashboardLayout className="mr-4 h-4 w-4 text-primary/70" />
              Dashboard
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(() =>
                  navigate({
                    to: "/reports",
                  })
                );
              }}
            >
              <icons.BarChart className="mr-4 h-4 w-4 text-primary/70" />
              Reports
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="System">
            <CommandItem
              onSelect={() => {
                run(() => setTernaryDarkMode("dark"));
              }}
            >
              <icons.Moon className="mr-4 h-4 w-4 text-primary/70" />
              Set theme to dark
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(() => setTernaryDarkMode("light"));
              }}
            >
              <icons.Sun className="mr-4 h-4 w-4 text-primary/70" />
              Set theme to light
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(() => setTernaryDarkMode("system"));
              }}
            >
              <icons.System className="mr-4 h-4 w-4 text-primary/70" />
              Set theme to system
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(() =>
                  navigate({
                    to: "/settings/profile",
                    params: () => ({ destination: "profile" }),
                  })
                );
              }}
            >
              <icons.User className="mr-4 h-4 w-4 text-primary/70" />
              Profile
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(() =>
                  navigate({
                    to: "/settings/profile",
                  })
                );
              }}
            >
              <icons.Settings className="mr-4 h-4 w-4 text-primary/70" />
              Settings
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(() => setShowLogout(true), false);
              }}
            >
              <icons.Logout className="mr-4 h-4 w-4 text-primary/70" />
              Logout
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </React.Fragment>
  );
};
