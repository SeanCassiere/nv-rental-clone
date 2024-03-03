import React from "react";
import { Link, type LinkOptions } from "@tanstack/react-router";

import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface SidebarDesktopNavigationProps {
  items: {
    id: string;
    title: string;
    linkProps: LinkOptions;
  }[];
}

export function SidebarDesktopNavigation({
  items,
}: SidebarDesktopNavigationProps) {
  return (
    <nav className="hidden space-x-2 lg:flex lg:flex-col lg:space-x-0 lg:space-y-1">
      {items.map((item, idx) => {
        return (
          <Link
            key={`settings_sidebar_${idx}_${item.title}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "justify-start"
            )}
            activeProps={{
              className: cn("border bg-card text-foreground hover:bg-card/90"),
            }}
            inactiveProps={{
              className: cn(
                "border border-transparent bg-background text-muted-foreground hover:bg-background hover:text-foreground hover:underline"
              ),
            }}
            params={true}
            {...item.linkProps}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
