import * as React from "react";

import { UI_APPLICATION_NAME } from "@/lib/utils/constants";

export default function AuthFooter() {
  return (
    <footer className="border-t bg-card px-1 md:px-5">
      <div className="mx-auto flex max-w-[1700px] items-center justify-between px-4 pb-6 pt-5 md:px-10">
        <div>
          <p className="text-sm text-foreground/80">
            © {new Date().getFullYear()} {UI_APPLICATION_NAME}. All rights
            reserved.
          </p>
        </div>
        <div>Right</div>
      </div>
    </footer>
  );
}
