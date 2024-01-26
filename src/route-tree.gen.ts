// This file is auto-generated by TanStack Router

import { createFileRoute } from "@tanstack/react-router"

// Import Routes

import { Route as rootRoute } from "./routes/__root"
import { Route as PublicRouteImport } from "./routes/_public.route"
import { Route as AuthRouteImport } from "./routes/_auth.route"
import { Route as AuthIndexImport } from "./routes/_auth/index"
import { Route as PublicOidcCallbackImport } from "./routes/_public/oidc-callback"
import { Route as PublicLogoutImport } from "./routes/_public/logout"
import { Route as AuthSettingsRouteImport } from "./routes/_auth/settings/route"
import { Route as AuthReservationsRouteImport } from "./routes/_auth/reservations/route"
import { Route as AuthReportsRouteImport } from "./routes/_auth/reports/route"
import { Route as AuthFleetRouteImport } from "./routes/_auth/fleet/route"
import { Route as AuthCustomersRouteImport } from "./routes/_auth/customers/route"
import { Route as AuthAgreementsRouteImport } from "./routes/_auth/agreements/route"
import { Route as AuthReservationsIndexRouteImport } from "./routes/_auth/reservations/index.route"
import { Route as AuthReportsIndexRouteImport } from "./routes/_auth/reports/index.route"
import { Route as AuthFleetIndexRouteImport } from "./routes/_auth/fleet/index.route"
import { Route as AuthCustomersIndexRouteImport } from "./routes/_auth/customers/index.route"
import { Route as AuthAgreementsIndexRouteImport } from "./routes/_auth/agreements/index.route"
import { Route as AuthReservationsNewRouteImport } from "./routes/_auth/reservations/new.route"
import { Route as AuthReservationsReservationIdRouteImport } from "./routes/_auth/reservations/$reservationId/route"
import { Route as AuthReportsReportIdRouteImport } from "./routes/_auth/reports/$reportId/route"
import { Route as AuthFleetNewRouteImport } from "./routes/_auth/fleet/new.route"
import { Route as AuthFleetVehicleIdRouteImport } from "./routes/_auth/fleet/$vehicleId/route"
import { Route as AuthCustomersNewRouteImport } from "./routes/_auth/customers/new.route"
import { Route as AuthCustomersCustomerIdRouteImport } from "./routes/_auth/customers/$customerId/route"
import { Route as AuthAgreementsNewRouteImport } from "./routes/_auth/agreements/new.route"
import { Route as AuthAgreementsAgreementIdRouteImport } from "./routes/_auth/agreements/$agreementId/route"
import { Route as AuthSettingsDestinationIndexRouteImport } from "./routes/_auth/settings/$destination/index.route"
import { Route as AuthReservationsReservationIdIndexRouteImport } from "./routes/_auth/reservations/$reservationId/index.route"
import { Route as AuthReportsReportIdIndexRouteImport } from "./routes/_auth/reports/$reportId/index.route"
import { Route as AuthFleetVehicleIdIndexRouteImport } from "./routes/_auth/fleet/$vehicleId/index.route"
import { Route as AuthCustomersCustomerIdIndexRouteImport } from "./routes/_auth/customers/$customerId/index.route"
import { Route as AuthAgreementsAgreementIdIndexRouteImport } from "./routes/_auth/agreements/$agreementId/index.route"
import { Route as AuthReservationsReservationIdEditRouteImport } from "./routes/_auth/reservations/$reservationId/edit.route"
import { Route as AuthFleetVehicleIdEditRouteImport } from "./routes/_auth/fleet/$vehicleId/edit.route"
import { Route as AuthCustomersCustomerIdEditRouteImport } from "./routes/_auth/customers/$customerId/edit.route"
import { Route as AuthAgreementsAgreementIdEditRouteImport } from "./routes/_auth/agreements/$agreementId/edit.route"
import { Route as AuthAgreementsAgreementIdCheckInRouteImport } from "./routes/_auth/agreements/$agreementId/check-in.route"

// Create Virtual Routes

const PublicLoggedOutLazyImport = createFileRoute("/_public/logged-out")()
const PublicDevLazyImport = createFileRoute("/_public/dev")()
const AuthSettingsIndexLazyImport = createFileRoute("/_auth/settings/")()

// Create/Update Routes

const PublicRouteRoute = PublicRouteImport.update({
  id: "/_public",
  getParentRoute: () => rootRoute,
} as any)

const AuthRouteRoute = AuthRouteImport.update({
  id: "/_auth",
  getParentRoute: () => rootRoute,
} as any)

const AuthIndexRoute = AuthIndexImport.update({
  path: "/",
  getParentRoute: () => AuthRouteRoute,
} as any).lazy(() => import("./routes/_auth/index.lazy").then((d) => d.Route))

const PublicLoggedOutLazyRoute = PublicLoggedOutLazyImport.update({
  path: "/logged-out",
  getParentRoute: () => PublicRouteRoute,
} as any).lazy(() =>
  import("./routes/_public/logged-out.lazy").then((d) => d.Route),
)

const PublicDevLazyRoute = PublicDevLazyImport.update({
  path: "/dev",
  getParentRoute: () => PublicRouteRoute,
} as any).lazy(() => import("./routes/_public/dev.lazy").then((d) => d.Route))

const PublicOidcCallbackRoute = PublicOidcCallbackImport.update({
  path: "/oidc-callback",
  getParentRoute: () => PublicRouteRoute,
} as any)

const PublicLogoutRoute = PublicLogoutImport.update({
  path: "/logout",
  getParentRoute: () => PublicRouteRoute,
} as any)

const AuthSettingsRouteRoute = AuthSettingsRouteImport.update({
  path: "/settings",
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthReservationsRouteRoute = AuthReservationsRouteImport.update({
  path: "/reservations",
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthReportsRouteRoute = AuthReportsRouteImport.update({
  path: "/reports",
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthFleetRouteRoute = AuthFleetRouteImport.update({
  path: "/fleet",
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthCustomersRouteRoute = AuthCustomersRouteImport.update({
  path: "/customers",
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthAgreementsRouteRoute = AuthAgreementsRouteImport.update({
  path: "/agreements",
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthSettingsIndexLazyRoute = AuthSettingsIndexLazyImport.update({
  path: "/",
  getParentRoute: () => AuthSettingsRouteRoute,
} as any).lazy(() =>
  import("./routes/_auth/settings/index.lazy").then((d) => d.Route),
)

const AuthReservationsIndexRouteRoute = AuthReservationsIndexRouteImport.update(
  {
    path: "/",
    getParentRoute: () => AuthReservationsRouteRoute,
  } as any,
).lazy(() =>
  import("./routes/_auth/reservations/index.route.lazy").then((d) => d.Route),
)

const AuthReportsIndexRouteRoute = AuthReportsIndexRouteImport.update({
  path: "/",
  getParentRoute: () => AuthReportsRouteRoute,
} as any).lazy(() =>
  import("./routes/_auth/reports/index.route.lazy").then((d) => d.Route),
)

const AuthFleetIndexRouteRoute = AuthFleetIndexRouteImport.update({
  path: "/",
  getParentRoute: () => AuthFleetRouteRoute,
} as any).lazy(() =>
  import("./routes/_auth/fleet/index.route.lazy").then((d) => d.Route),
)

const AuthCustomersIndexRouteRoute = AuthCustomersIndexRouteImport.update({
  path: "/",
  getParentRoute: () => AuthCustomersRouteRoute,
} as any).lazy(() =>
  import("./routes/_auth/customers/index.route.lazy").then((d) => d.Route),
)

const AuthAgreementsIndexRouteRoute = AuthAgreementsIndexRouteImport.update({
  path: "/",
  getParentRoute: () => AuthAgreementsRouteRoute,
} as any).lazy(() =>
  import("./routes/_auth/agreements/index.route.lazy").then((d) => d.Route),
)

const AuthReservationsNewRouteRoute = AuthReservationsNewRouteImport.update({
  path: "/new",
  getParentRoute: () => AuthReservationsRouteRoute,
} as any).lazy(() =>
  import("./routes/_auth/reservations/new.route.lazy").then((d) => d.Route),
)

const AuthReservationsReservationIdRouteRoute =
  AuthReservationsReservationIdRouteImport.update({
    path: "/$reservationId",
    getParentRoute: () => AuthReservationsRouteRoute,
  } as any)

const AuthReportsReportIdRouteRoute = AuthReportsReportIdRouteImport.update({
  path: "/$reportId",
  getParentRoute: () => AuthReportsRouteRoute,
} as any)

const AuthFleetNewRouteRoute = AuthFleetNewRouteImport.update({
  path: "/new",
  getParentRoute: () => AuthFleetRouteRoute,
} as any).lazy(() =>
  import("./routes/_auth/fleet/new.route.lazy").then((d) => d.Route),
)

const AuthFleetVehicleIdRouteRoute = AuthFleetVehicleIdRouteImport.update({
  path: "/$vehicleId",
  getParentRoute: () => AuthFleetRouteRoute,
} as any)

const AuthCustomersNewRouteRoute = AuthCustomersNewRouteImport.update({
  path: "/new",
  getParentRoute: () => AuthCustomersRouteRoute,
} as any).lazy(() =>
  import("./routes/_auth/customers/new.route.lazy").then((d) => d.Route),
)

const AuthCustomersCustomerIdRouteRoute =
  AuthCustomersCustomerIdRouteImport.update({
    path: "/$customerId",
    getParentRoute: () => AuthCustomersRouteRoute,
  } as any)

const AuthAgreementsNewRouteRoute = AuthAgreementsNewRouteImport.update({
  path: "/new",
  getParentRoute: () => AuthAgreementsRouteRoute,
} as any).lazy(() =>
  import("./routes/_auth/agreements/new.route.lazy").then((d) => d.Route),
)

const AuthAgreementsAgreementIdRouteRoute =
  AuthAgreementsAgreementIdRouteImport.update({
    path: "/$agreementId",
    getParentRoute: () => AuthAgreementsRouteRoute,
  } as any)

const AuthSettingsDestinationIndexRouteRoute =
  AuthSettingsDestinationIndexRouteImport.update({
    path: "/$destination/",
    getParentRoute: () => AuthSettingsRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/settings/$destination/index.route.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthReservationsReservationIdIndexRouteRoute =
  AuthReservationsReservationIdIndexRouteImport.update({
    path: "/",
    getParentRoute: () => AuthReservationsReservationIdRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/reservations/$reservationId/index.route.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthReportsReportIdIndexRouteRoute =
  AuthReportsReportIdIndexRouteImport.update({
    path: "/",
    getParentRoute: () => AuthReportsReportIdRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/reports/$reportId/index.route.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthFleetVehicleIdIndexRouteRoute =
  AuthFleetVehicleIdIndexRouteImport.update({
    path: "/",
    getParentRoute: () => AuthFleetVehicleIdRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/fleet/$vehicleId/index.route.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthCustomersCustomerIdIndexRouteRoute =
  AuthCustomersCustomerIdIndexRouteImport.update({
    path: "/",
    getParentRoute: () => AuthCustomersCustomerIdRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/customers/$customerId/index.route.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthAgreementsAgreementIdIndexRouteRoute =
  AuthAgreementsAgreementIdIndexRouteImport.update({
    path: "/",
    getParentRoute: () => AuthAgreementsAgreementIdRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/agreements/$agreementId/index.route.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthReservationsReservationIdEditRouteRoute =
  AuthReservationsReservationIdEditRouteImport.update({
    path: "/edit",
    getParentRoute: () => AuthReservationsReservationIdRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/reservations/$reservationId/edit.route.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthFleetVehicleIdEditRouteRoute =
  AuthFleetVehicleIdEditRouteImport.update({
    path: "/edit",
    getParentRoute: () => AuthFleetVehicleIdRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/fleet/$vehicleId/edit.route.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthCustomersCustomerIdEditRouteRoute =
  AuthCustomersCustomerIdEditRouteImport.update({
    path: "/edit",
    getParentRoute: () => AuthCustomersCustomerIdRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/customers/$customerId/edit.route.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthAgreementsAgreementIdEditRouteRoute =
  AuthAgreementsAgreementIdEditRouteImport.update({
    path: "/edit",
    getParentRoute: () => AuthAgreementsAgreementIdRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/agreements/$agreementId/edit.route.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthAgreementsAgreementIdCheckInRouteRoute =
  AuthAgreementsAgreementIdCheckInRouteImport.update({
    path: "/check-in",
    getParentRoute: () => AuthAgreementsAgreementIdRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/agreements/$agreementId/check-in.route.lazy").then(
      (d) => d.Route,
    ),
  )

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/_auth": {
      preLoaderRoute: typeof AuthRouteImport
      parentRoute: typeof rootRoute
    }
    "/_public": {
      preLoaderRoute: typeof PublicRouteImport
      parentRoute: typeof rootRoute
    }
    "/_auth/agreements": {
      preLoaderRoute: typeof AuthAgreementsRouteImport
      parentRoute: typeof AuthRouteImport
    }
    "/_auth/customers": {
      preLoaderRoute: typeof AuthCustomersRouteImport
      parentRoute: typeof AuthRouteImport
    }
    "/_auth/fleet": {
      preLoaderRoute: typeof AuthFleetRouteImport
      parentRoute: typeof AuthRouteImport
    }
    "/_auth/reports": {
      preLoaderRoute: typeof AuthReportsRouteImport
      parentRoute: typeof AuthRouteImport
    }
    "/_auth/reservations": {
      preLoaderRoute: typeof AuthReservationsRouteImport
      parentRoute: typeof AuthRouteImport
    }
    "/_auth/settings": {
      preLoaderRoute: typeof AuthSettingsRouteImport
      parentRoute: typeof AuthRouteImport
    }
    "/_public/logout": {
      preLoaderRoute: typeof PublicLogoutImport
      parentRoute: typeof PublicRouteImport
    }
    "/_public/oidc-callback": {
      preLoaderRoute: typeof PublicOidcCallbackImport
      parentRoute: typeof PublicRouteImport
    }
    "/_public/dev": {
      preLoaderRoute: typeof PublicDevLazyImport
      parentRoute: typeof PublicRouteImport
    }
    "/_public/logged-out": {
      preLoaderRoute: typeof PublicLoggedOutLazyImport
      parentRoute: typeof PublicRouteImport
    }
    "/_auth/": {
      preLoaderRoute: typeof AuthIndexImport
      parentRoute: typeof AuthRouteImport
    }
    "/_auth/agreements/$agreementId": {
      preLoaderRoute: typeof AuthAgreementsAgreementIdRouteImport
      parentRoute: typeof AuthAgreementsRouteImport
    }
    "/_auth/agreements/new": {
      preLoaderRoute: typeof AuthAgreementsNewRouteImport
      parentRoute: typeof AuthAgreementsRouteImport
    }
    "/_auth/customers/$customerId": {
      preLoaderRoute: typeof AuthCustomersCustomerIdRouteImport
      parentRoute: typeof AuthCustomersRouteImport
    }
    "/_auth/customers/new": {
      preLoaderRoute: typeof AuthCustomersNewRouteImport
      parentRoute: typeof AuthCustomersRouteImport
    }
    "/_auth/fleet/$vehicleId": {
      preLoaderRoute: typeof AuthFleetVehicleIdRouteImport
      parentRoute: typeof AuthFleetRouteImport
    }
    "/_auth/fleet/new": {
      preLoaderRoute: typeof AuthFleetNewRouteImport
      parentRoute: typeof AuthFleetRouteImport
    }
    "/_auth/reports/$reportId": {
      preLoaderRoute: typeof AuthReportsReportIdRouteImport
      parentRoute: typeof AuthReportsRouteImport
    }
    "/_auth/reservations/$reservationId": {
      preLoaderRoute: typeof AuthReservationsReservationIdRouteImport
      parentRoute: typeof AuthReservationsRouteImport
    }
    "/_auth/reservations/new": {
      preLoaderRoute: typeof AuthReservationsNewRouteImport
      parentRoute: typeof AuthReservationsRouteImport
    }
    "/_auth/agreements/": {
      preLoaderRoute: typeof AuthAgreementsIndexRouteImport
      parentRoute: typeof AuthAgreementsRouteImport
    }
    "/_auth/customers/": {
      preLoaderRoute: typeof AuthCustomersIndexRouteImport
      parentRoute: typeof AuthCustomersRouteImport
    }
    "/_auth/fleet/": {
      preLoaderRoute: typeof AuthFleetIndexRouteImport
      parentRoute: typeof AuthFleetRouteImport
    }
    "/_auth/reports/": {
      preLoaderRoute: typeof AuthReportsIndexRouteImport
      parentRoute: typeof AuthReportsRouteImport
    }
    "/_auth/reservations/": {
      preLoaderRoute: typeof AuthReservationsIndexRouteImport
      parentRoute: typeof AuthReservationsRouteImport
    }
    "/_auth/settings/": {
      preLoaderRoute: typeof AuthSettingsIndexLazyImport
      parentRoute: typeof AuthSettingsRouteImport
    }
    "/_auth/agreements/$agreementId/check-in": {
      preLoaderRoute: typeof AuthAgreementsAgreementIdCheckInRouteImport
      parentRoute: typeof AuthAgreementsAgreementIdRouteImport
    }
    "/_auth/agreements/$agreementId/edit": {
      preLoaderRoute: typeof AuthAgreementsAgreementIdEditRouteImport
      parentRoute: typeof AuthAgreementsAgreementIdRouteImport
    }
    "/_auth/customers/$customerId/edit": {
      preLoaderRoute: typeof AuthCustomersCustomerIdEditRouteImport
      parentRoute: typeof AuthCustomersCustomerIdRouteImport
    }
    "/_auth/fleet/$vehicleId/edit": {
      preLoaderRoute: typeof AuthFleetVehicleIdEditRouteImport
      parentRoute: typeof AuthFleetVehicleIdRouteImport
    }
    "/_auth/reservations/$reservationId/edit": {
      preLoaderRoute: typeof AuthReservationsReservationIdEditRouteImport
      parentRoute: typeof AuthReservationsReservationIdRouteImport
    }
    "/_auth/agreements/$agreementId/": {
      preLoaderRoute: typeof AuthAgreementsAgreementIdIndexRouteImport
      parentRoute: typeof AuthAgreementsAgreementIdRouteImport
    }
    "/_auth/customers/$customerId/": {
      preLoaderRoute: typeof AuthCustomersCustomerIdIndexRouteImport
      parentRoute: typeof AuthCustomersCustomerIdRouteImport
    }
    "/_auth/fleet/$vehicleId/": {
      preLoaderRoute: typeof AuthFleetVehicleIdIndexRouteImport
      parentRoute: typeof AuthFleetVehicleIdRouteImport
    }
    "/_auth/reports/$reportId/": {
      preLoaderRoute: typeof AuthReportsReportIdIndexRouteImport
      parentRoute: typeof AuthReportsReportIdRouteImport
    }
    "/_auth/reservations/$reservationId/": {
      preLoaderRoute: typeof AuthReservationsReservationIdIndexRouteImport
      parentRoute: typeof AuthReservationsReservationIdRouteImport
    }
    "/_auth/settings/$destination/": {
      preLoaderRoute: typeof AuthSettingsDestinationIndexRouteImport
      parentRoute: typeof AuthSettingsRouteImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  AuthRouteRoute.addChildren([
    AuthAgreementsRouteRoute.addChildren([
      AuthAgreementsAgreementIdRouteRoute.addChildren([
        AuthAgreementsAgreementIdCheckInRouteRoute,
        AuthAgreementsAgreementIdEditRouteRoute,
        AuthAgreementsAgreementIdIndexRouteRoute,
      ]),
      AuthAgreementsNewRouteRoute,
      AuthAgreementsIndexRouteRoute,
    ]),
    AuthCustomersRouteRoute.addChildren([
      AuthCustomersCustomerIdRouteRoute.addChildren([
        AuthCustomersCustomerIdEditRouteRoute,
        AuthCustomersCustomerIdIndexRouteRoute,
      ]),
      AuthCustomersNewRouteRoute,
      AuthCustomersIndexRouteRoute,
    ]),
    AuthFleetRouteRoute.addChildren([
      AuthFleetVehicleIdRouteRoute.addChildren([
        AuthFleetVehicleIdEditRouteRoute,
        AuthFleetVehicleIdIndexRouteRoute,
      ]),
      AuthFleetNewRouteRoute,
      AuthFleetIndexRouteRoute,
    ]),
    AuthReportsRouteRoute.addChildren([
      AuthReportsReportIdRouteRoute.addChildren([
        AuthReportsReportIdIndexRouteRoute,
      ]),
      AuthReportsIndexRouteRoute,
    ]),
    AuthReservationsRouteRoute.addChildren([
      AuthReservationsReservationIdRouteRoute.addChildren([
        AuthReservationsReservationIdEditRouteRoute,
        AuthReservationsReservationIdIndexRouteRoute,
      ]),
      AuthReservationsNewRouteRoute,
      AuthReservationsIndexRouteRoute,
    ]),
    AuthSettingsRouteRoute.addChildren([
      AuthSettingsIndexLazyRoute,
      AuthSettingsDestinationIndexRouteRoute,
    ]),
    AuthIndexRoute,
  ]),
  PublicRouteRoute.addChildren([
    PublicLogoutRoute,
    PublicOidcCallbackRoute,
    PublicDevLazyRoute,
    PublicLoggedOutLazyRoute,
  ]),
])
