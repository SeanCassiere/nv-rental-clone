import * as React from "react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { useTernaryDarkMode } from "@/lib/hooks/useTernaryDarkMode";
import { useGlobalDialogContext } from "@/lib/context/modals";

import { UI_APPLICATION_NAME } from "@/lib/utils/constants";

import { IsMacLike } from "@/lib/utils";

export default function AuthFooter() {
  const { ternaryDarkMode, setTernaryDarkMode } = useTernaryDarkMode();
  const { setShowCommandMenu } = useGlobalDialogContext();

  return (
    <footer className="border-t bg-card px-1 text-foreground/65 md:px-5">
      <div className="mx-auto grid max-w-[1700px] gap-4 px-4 pb-6 pt-5 md:px-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="rounded ring-offset-background transition-colors focus-within:text-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <img
                // logo url is set in the global css under the name --logo-url
                className="h-8 w-8 rounded-full p-1 opacity-65 [content:var(--logo-url)] focus-within:opacity-100 hover:opacity-100"
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
                <div className="inline-flex items-center gap-1">
                  <span
                    className="rounded border bg-background px-1 py-0.5"
                    aria-hidden
                  >
                    {IsMacLike ? "⌘" : "Ctrl"}
                  </span>
                  <span aria-hidden>+</span>
                  <span
                    className="rounded border bg-background px-1.5 py-0.5"
                    aria-hidden
                  >
                    K
                  </span>
                  <span className="sr-only">
                    {IsMacLike ? "⌘" : "Ctrl"} + K
                  </span>
                </div>
              </Button>
            </div>
            <div>
              <ToggleGroup
                type="single"
                size="sm"
                className="gap-0.5 rounded-2xl border p-0.5"
                value={ternaryDarkMode}
                onValueChange={(value) => {
                  switch (value) {
                    case "system":
                      setTernaryDarkMode("system");
                      break;
                    case "light":
                      setTernaryDarkMode("light");
                      break;
                    case "dark":
                      setTernaryDarkMode("dark");
                      break;
                    default:
                      console.warn(
                        "Unhandled theme value in the footer switcher:",
                        value
                      );
                      break;
                  }
                }}
              >
                <ToggleGroupItem
                  className="h-8 rounded-2xl"
                  aria-label="Set theme to system"
                  value="system"
                >
                  <icons.System className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="h-8 rounded-2xl"
                  aria-label="Set theme to light"
                  value="light"
                >
                  <icons.Sun className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="h-8 rounded-2xl"
                  aria-label="Set theme to dark"
                  value="dark"
                >
                  <icons.Moon className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <a
              className="inline-flex h-8 items-center rounded p-2 ring-offset-background transition-colors focus-within:text-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              href="https://github.com/seancassiere/nv-rental-clone"
              target="_blank"
            >
              <icons.GitHub className="h-4 w-4" />
            </a>
            <a
              className="inline-flex h-8 items-center rounded p-2 ring-offset-background transition-colors focus-within:text-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              href="https://x.com/seancassiere"
              target="_blank"
            >
              <icons.Twitter className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
