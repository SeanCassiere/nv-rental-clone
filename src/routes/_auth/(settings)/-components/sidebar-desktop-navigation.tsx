import React from "react";
import {
  Link,
  type LinkProps,
  type RegisteredRouter,
} from "@tanstack/react-router";

import { cn } from "@/lib/utils";

interface SidebarDesktopNavigationProps {
  items: {
    id: string;
    title: string;
    linkProps: LinkProps<RegisteredRouter["routeTree"]>;
  }[];
}

export function SidebarDesktopNavigation({
  items,
}: SidebarDesktopNavigationProps) {
  return (
    <nav className="hidden lg:flex lg:flex-col lg:space-y-1.5">
      {items.map((item, idx) => {
        return (
          <Link
            key={`settings_sidebar_${idx}_${item.title}`}
            className={cn(
              "inline-flex h-10 items-center justify-start rounded-md border px-3 text-sm font-medium underline-offset-2"
            )}
            activeProps={{
              className: cn("border-border bg-muted text-foreground underline"),
            }}
            inactiveProps={{
              className: cn(
                "border-transparent text-muted-foreground hover:bg-muted/90 hover:text-foreground hover:underline"
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
