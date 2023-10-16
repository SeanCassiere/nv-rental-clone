import * as React from "react";
import { AlertCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/utils";

type ButtonOnClick = NonNullable<Parameters<typeof Button>[0]["onClick"]>;
type ButtonClassName = Parameters<typeof Button>[0]["className"];

export const EmptyState = ({
  title,
  subtitle,
  icon: Icon,
  extraContent,
  buttonOptions,
}: {
  title: string;
  subtitle: string;
  icon?: React.FC<{ className?: string }>;
  extraContent?: React.ReactNode;
  buttonOptions?: {
    content: React.ReactNode;
    onClick: ButtonOnClick;
    className?: ButtonClassName;
  };
}) => {
  const RenderedIcon = Icon ?? AlertCircleIcon;

  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <RenderedIcon className="h-10 w-10 text-muted-foreground" />

        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">{subtitle}</p>

        {buttonOptions ? (
          <Button
            size="sm"
            className={cn("relative", buttonOptions?.className)}
            onClick={buttonOptions.onClick}
          >
            {buttonOptions.content}
          </Button>
        ) : null}

        {extraContent ? <>{extraContent}</> : null}
      </div>
    </div>
  );
};
