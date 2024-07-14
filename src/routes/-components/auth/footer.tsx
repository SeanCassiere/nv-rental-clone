import * as React from "react";
import { Link } from "@tanstack/react-router";

import { UI_APPLICATION_NAME } from "@/lib/utils/constants";

export default function AuthFooter() {
  return (
    <footer className="border-t bg-card px-1 md:px-5">
      <div className="mx-auto grid max-w-[1700px] gap-4 px-4 pb-6 pt-5 md:px-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/">
              <img
                // logo url is set in the global css under the name --logo-url
                className="h-8 w-8 rounded-full p-1 [content:var(--logo-url)]"
                alt={UI_APPLICATION_NAME}
                style={{ imageRendering: "crisp-edges" }}
              />
            </Link>
            <p className="text-sm font-medium text-foreground/80">
              © {new Date().getFullYear()}
              <span className="sr-only md:not-sr-only">
                {" "}
                {UI_APPLICATION_NAME}. All rights reserved.
              </span>
            </p>
          </div>
          <div>Right</div>
        </div>
        <div>github twitter</div>
      </div>
    </footer>
  );
}
