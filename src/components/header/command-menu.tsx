import React, { Fragment } from "react";
import { useRouter } from "@tanstack/router";
import { useAuth } from "react-oidc-context";
import {
  LogOutIcon,
  SettingsIcon,
  Users2Icon,
  CarIcon,
  BarChart4Icon,
  CalendarIcon,
  FileSignatureIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import { searchCustomersRoute } from "@/routes/customers/searchCustomers";
import { searchFleetRoute } from "@/routes/fleet/searchFleet";
import { searchReservationsRoute } from "@/routes/reservations/searchReservations";
import { searchAgreementsRoute } from "@/routes/agreements/searchAgreements";

import { useDebounce } from "@/hooks/internal/useDebounce";
import { IsMacLike, cn } from "@/utils";

export const CommandMenu = () => {
  const router = useRouter();
  const navigate = router.navigate;

  const auth = useAuth();

  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");

  const debouncedText = useDebounce(text);

  const run = React.useCallback((command: () => unknown) => {
    command();
    setText("");
    setOpen(false);
  }, []);

  React.useEffect(() => {
    const keyDownFn = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", keyDownFn);
    return () => document.removeEventListener("keydown", keyDownFn);
  }, []);

  return (
    <Fragment>
      <Button
        variant="outline"
        className={cn(
          "relative w-52 items-center justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search application...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-[0.55rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">{IsMacLike ? "⌘" : "Ctrl"}</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search..."
          value={text}
          onValueChange={setText}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => {
                run(() =>
                  navigate({
                    to: searchCustomersRoute.to,
                    search: () => ({ page: 1, size: 10 }),
                  })
                );
              }}
            >
              <Users2Icon className="mr-2 h-4 w-4 text-primary/70" />
              Customers
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(() =>
                  navigate({
                    to: searchFleetRoute.to,
                    search: () => ({ page: 1, size: 10 }),
                  })
                );
              }}
            >
              <CarIcon className="mr-2 h-4 w-4 text-primary/70" />
              Fleet
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(() =>
                  navigate({
                    to: searchReservationsRoute.to,
                    search: () => ({ page: 1, size: 10 }),
                  })
                );
              }}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-primary/70" />
              Reservations
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(() =>
                  navigate({
                    to: searchAgreementsRoute.to,
                    search: () => ({ page: 1, size: 10 }),
                  })
                );
              }}
            >
              <FileSignatureIcon className="mr-2 h-4 w-4 text-primary/70" />
              Agreements
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(() =>
                  navigate({
                    to: searchAgreementsRoute.to,
                    search: () => ({ page: 1, size: 10 }),
                  })
                );
              }}
            >
              <BarChart4Icon className="mr-2 h-4 w-4 text-primary/70" />
              Reports
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="System">
            <CommandItem
              onSelect={() => {
                run(() =>
                  navigate({
                    to: searchAgreementsRoute.to,
                    search: () => ({ page: 1, size: 10 }),
                  })
                );
              }}
            >
              <SettingsIcon className="mr-2 h-4 w-4 text-primary/70" />
              Settings
            </CommandItem>
            <CommandItem
              onSelect={() => {
                run(auth.signoutRedirect);
              }}
            >
              <LogOutIcon className="mr-2 h-4 w-4 text-primary/70" />
              Logout
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </Fragment>
  );
};
