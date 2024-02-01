import React from "react";

import { Sheet, SheetContent } from "@/components/ui/sheet";

import { cn } from "@/utils";

export interface PrimaryModulePreviewSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
  headerComponent?: () => JSX.Element;
}

export function PrimaryModulePreviewSheet(
  props: PrimaryModulePreviewSheetProps
) {
  const {
    open,
    onOpenChange,
    children,
    className,
    headerComponent: Header,
  } = props;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "bottom-2 right-2 top-2 h-auto w-5/6 rounded-lg border bg-card shadow-xl sm:bottom-2.5 sm:right-2.5 sm:top-2.5 sm:max-w-lg",
          className
        )}
        noBackdrop
      >
        {Header && <Header />}
        {children}
      </SheetContent>
    </Sheet>
  );
}
