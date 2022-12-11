import type { router } from "./routes/Router";
declare module "@tanstack/react-router" {
  interface RegisterRouter {
    router: typeof router;
  }
}
