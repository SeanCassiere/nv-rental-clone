import React from "react";
import { createLazyFileRoute, Link } from "@tanstack/react-router";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { titleMaker } from "@/lib/utils/title-maker";

export const Route = createLazyFileRoute("/_public/logged-out")({
  component: LoggedOutPage,
});

function LoggedOutPage() {
  useDocumentTitle(titleMaker("Logged out"));

  return (
    <>
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-foreground">Logged Out</h1>
        </div>
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <div className="my-2 py-4">
            Please&nbsp;
            <Link to="/" preload={false} className="font-medium text-primary">
              login
            </Link>
            &nbsp;to use the application.
          </div>
        </div>
      </div>
    </>
  );
}
