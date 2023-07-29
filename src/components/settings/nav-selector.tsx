import React from "react";
import { useNavigate, type LinkPropsOptions } from "@tanstack/router";
import { ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { cn } from "@/utils";

interface SelectorSettingsNavigationProps {
  items: {
    id: string;
    title: string;
    linkProps: LinkPropsOptions;
  }[];
  currentId: string;
  currentTitle: string;
}

export const SelectorSettingsNavigation = ({
  items,
  currentId,
  currentTitle,
}: SelectorSettingsNavigationProps) => {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="lg:hidden">
        <PopoverTrigger asChild>
          <Button
            size="lg"
            variant="outline"
            className="w-full justify-start whitespace-nowrap border-dashed px-4"
            onClick={() => setOpen(true)}
          >
            <span className="flex">
              <ChevronRightIcon className="mr-2 h-5 w-5 text-primary/60" />
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
              <CommandEmpty>No results found</CommandEmpty>
              <CommandGroup>
                {items.map((item, idx) => {
                  const isSelected =
                    String(item.id).toLowerCase() ===
                    String(currentId).toLowerCase();
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
                        <ChevronRightIcon className="h-4 w-4" />
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
};
