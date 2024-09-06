import * as React from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { buttonVariants } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";

import { cn } from "@/lib/utils";

export function SubPageNavItem(props: {
  title: string;
  description: string;
  link: LinkProps;
}) {
  const { title, description, link } = props;
  const { t } = useTranslation();
  return (
    <li className="flex justify-between gap-x-6 py-4 lg:py-5">
      <div className="flex min-w-0 gap-x-4">
        <div className="grid min-w-0 max-w-xl items-center text-base lg:text-sm">
          <p className="items-baseline truncate font-semibold leading-6">
            {title}
          </p>
          <p className="mt-1 truncate text-sm leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Link
          {...link}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "bg-transparent"
          )}
        >
          <span className="hidden lg:inline-block">
            {t("buttons.edit", { ns: "labels" })}
          </span>
          <icons.ChevronRight className="h-4 w-4 lg:ml-2" />
        </Link>
      </div>
    </li>
  );
}
