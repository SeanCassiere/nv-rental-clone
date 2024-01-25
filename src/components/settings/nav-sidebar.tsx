import React from "react";
import { Link, type LinkOptions } from "@tanstack/react-router";

import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/utils";

interface SidebarSettingsNavigationProps {
  items: {
    id: string;
    title: string;
    linkProps: LinkOptions;
  }[];
  currentId: string;
}

export const SidebarSettingsNavigation = ({
  items,
  currentId,
}: SidebarSettingsNavigationProps) => {
  return (
    <nav className="hidden space-x-2 lg:flex lg:flex-col lg:space-x-0 lg:space-y-1">
      {items.map((item, idx) => {
        const isSelected =
          String(item.id).toLowerCase() === String(currentId).toLowerCase();
        return (
          <Link
            key={`settings_sidebar_${idx}_${item.title}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              isSelected
                ? "border bg-card text-foreground hover:bg-card/90"
                : "border border-transparent bg-background text-muted-foreground hover:bg-background hover:text-foreground hover:underline",
              "justify-start"
            )}
            {...item.linkProps}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};
