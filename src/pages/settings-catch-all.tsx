import React from "react";

import ProtectorShield from "@/components/protector-shield";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/utils";
import { UI_APPLICATION_NAME } from "@/utils/constants";

export default function SettingsCatchAllPage() {
  return (
    <ProtectorShield>
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mx-4 sm:px-1"
        )}
      >
        <div className={cn("flex min-h-[2.5rem] items-center justify-between")}>
          <h1 className="text-2xl font-semibold leading-6 text-primary">
            Settings
          </h1>
        </div>
        <p className={cn("text-base text-primary/80")}>
          Manage and configure your&nbsp;<strong>{UI_APPLICATION_NAME}</strong>
          &nbsp;account.
        </p>
        <Separator className="mt-3.5" />
      </section>
    </ProtectorShield>
  );
}
