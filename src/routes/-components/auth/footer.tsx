import * as React from "react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import { useGlobalDialogContext } from "@/lib/context/modals";

import { UI_APPLICATION_NAME } from "@/lib/utils/constants";

import { IsMacLike } from "@/lib/utils";

export default function AuthFooter() {
  const { setShowCommandMenu } = useGlobalDialogContext();

  return (
    <footer className="border-t bg-card px-1 text-foreground/65 md:px-5">
      <div className="mx-auto grid max-w-[1700px] gap-4 px-4 pb-6 pt-5 md:px-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/">
              <img
                // logo url is set in the global css under the name --logo-url
                className="h-8 w-8 rounded-full p-1 opacity-65 [content:var(--logo-url)]"
                alt={UI_APPLICATION_NAME}
                style={{ imageRendering: "crisp-edges" }}
              />
              <span className="sr-only">Go to the home page</span>
            </Link>
            <p className="text-sm font-medium">
              © {new Date().getFullYear()}
              <span className="sr-only md:not-sr-only">
                {" "}
                {UI_APPLICATION_NAME}. All rights reserved.
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 tracking-tight"
                onClick={() => {
                  setShowCommandMenu(true);
                }}
              >
                <span>Command menu</span>
                <span>{IsMacLike ? "⌘" : "Ctrl"} + K</span>
              </Button>
            </div>
          </div>
        </div>
        <div>github twitter</div>
      </div>
    </footer>
  );
}
