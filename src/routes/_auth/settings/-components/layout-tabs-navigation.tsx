import { Link, LinkOptions } from "@tanstack/react-router";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type LayoutTabsNavigationTabListItem = {
  pathname: string;
  title: string;
  linkProps: LinkOptions;
};

interface LayoutTabsNavigationProps {
  items: LayoutTabsNavigationTabListItem[];
  currentPathname: string;
  className?: string;
}

export function LayoutTabsNavigation(props: LayoutTabsNavigationProps) {
  return (
    <Tabs value={props.currentPathname} className={props.className}>
      <TabsList className="w-full lg:max-w-max">
        {props.items.map((item, idx) => {
          return (
            <TabsTrigger
              key={`settings_tabs_nav_${item.pathname}_${idx}`}
              value={item.pathname}
              asChild
            >
              <Link params={true} {...item.linkProps}>
                {item.title}
              </Link>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
