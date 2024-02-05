import React from "react";
import {
  useMatches,
  useNavigate,
  type LinkOptions,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { icons } from "@/components/ui/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

interface SidebarMobileNavigationProps {
  items: {
    id: string;
    title: string;
    linkProps: LinkOptions;
  }[];
}

export function SidebarMobileNavigation({
  items,
}: SidebarMobileNavigationProps) {
  const { t } = useTranslation();

  const routeMatches = useMatches();
  const pathnames = routeMatches.map((r) => r.pathname);

  const currentTitle = React.useMemo(() => {
    let titleValue = "unknown";
    items.map((item) => {
      pathnames.map((path) => {
        if (item.id === path) {
          titleValue = item.title;
        }
      });
    });
    return titleValue;
  }, [items, pathnames]);

  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="lg:hidden">
        <PopoverTrigger asChild>
          <Button
            size="lg"
            variant="outline"
            className="w-full justify-start whitespace-nowrap border bg-card px-4 hover:bg-background hover:text-foreground"
            onClick={() => setOpen(true)}
          >
            <span className="flex">
              <icons.ChevronRight className="mr-2 h-5 w-5 text-primary" />
              <Separator orientation="vertical" className="mx-2 h-5" />
            </span>
            <span>
              <Badge
                variant="outline"
                className="ml-2 rounded-sm text-sm font-normal"
              >
                {currentTitle}
              </Badge>
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[calc(100vw-10%)] p-0">
          <Command>
            <CommandList>
              <CommandEmpty>{t("notFound", { ns: "messages" })}</CommandEmpty>
              <CommandGroup>
                {items.map((item, idx) => {
                  const isSelected = pathnames.includes(item.id);
                  return (
                    <CommandItem
                      key={`settings_selector_${idx}_${item.title}`}
                      onSelect={() => {
                        navigate(item.linkProps);
                        setOpen(false);
                      }}
                      className="text-base font-normal"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center",
                          isSelected
                            ? "text-primary"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <icons.ChevronRight className="h-4 w-4" />
                      </div>
                      <span>{item.title}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </div>
    </Popover>
  );
}
