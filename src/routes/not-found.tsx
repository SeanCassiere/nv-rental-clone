import { Link, Route } from "@tanstack/react-router";

import { cn } from "@/utils";

import { rootRoute } from "./__root";

const NotFoundPage = () => {
  return (
    <section
      className={cn(
        "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:px-4 sm:pb-2"
      )}
    >
      <div className="my-auto flex-shrink-0 sm:py-32">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          404 error
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-2 text-base text-foreground/80">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="text-base font-medium text-primary hover:text-primary/80"
          >
            <span aria-hidden="true">&larr; </span>Go back to dashboard
          </Link>
        </div>
      </div>
    </section>
  );
};

export const notFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "*",
  component: NotFoundPage,
});
