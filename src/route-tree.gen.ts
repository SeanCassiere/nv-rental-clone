// This file is auto-generated by TanStack Router

import {
  createFileRoute,
  lazyFn,
  lazyRouteComponent,
} from "@tanstack/react-router"

// Import Routes

import { Route as rootRoute } from "./routes/__root"
import { Route as PublicImport } from "./routes/_public"
import { Route as AuthImport } from "./routes/_auth"
import { Route as AuthIndexImport } from "./routes/_auth/index"
import { Route as PublicOidcCallbackImport } from "./routes/_public/oidc-callback"
import { Route as PublicLogoutImport } from "./routes/_public/logout"
import { Route as AuthReservationsRouteImport } from "./routes/_auth/reservations/route"
import { Route as AuthReportsRouteImport } from "./routes/_auth/reports/route"
import { Route as AuthFleetRouteImport } from "./routes/_auth/fleet/route"
import { Route as AuthCustomersRouteImport } from "./routes/_auth/customers/route"
import { Route as AuthAgreementsRouteImport } from "./routes/_auth/agreements/route"
import { Route as AuthSettingsDestinationRouteImport } from "./routes/_auth/settings_.$destination/route"
import { Route as AuthReservationsNewRouteImport } from "./routes/_auth/reservations_.new/route"
import { Route as AuthReservationsReservationIdRouteImport } from "./routes/_auth/reservations_.$reservationId/route"
import { Route as AuthReportsReportIdRouteImport } from "./routes/_auth/reports_.$reportId/route"
import { Route as AuthFleetVehicleIdRouteImport } from "./routes/_auth/fleet_.$vehicleId/route"
import { Route as AuthFleetNewRouteImport } from "./routes/_auth/fleet.new/route"
import { Route as AuthCustomersNewRouteImport } from "./routes/_auth/customers_.new/route"
import { Route as AuthCustomersCustomerIdRouteImport } from "./routes/_auth/customers_.$customerId/route"
import { Route as AuthAgreementsNewRouteImport } from "./routes/_auth/agreements_.new/route"
import { Route as AuthAgreementsAgreementIdRouteImport } from "./routes/_auth/agreements_.$agreementId/route"
import { Route as AuthReservationsReservationIdEditRouteImport } from "./routes/_auth/reservations_.$reservationId.edit/route"
import { Route as AuthFleetVehicleIdEditRouteImport } from "./routes/_auth/fleet_.$vehicleId.edit/route"
import { Route as AuthCustomersCustomerIdEditRouteImport } from "./routes/_auth/customers_.$customerId.edit/route"
import { Route as AuthAgreementsAgreementIdEditRouteImport } from "./routes/_auth/agreements_.$agreementId.edit/route"
import { Route as AuthAgreementsAgreementIdCheckInRouteImport } from "./routes/_auth/agreements_.$agreementId.check-in/route"

// Create Virtual Routes

const PublicLoggedOutLazyImport = createFileRoute("/_public/logged-out")()
const PublicDevLazyImport = createFileRoute("/_public/dev")()
const AuthSettingsIndexLazyImport = createFileRoute("/_auth/settings/")()

// Create/Update Routes

const PublicRoute = PublicImport.update({
  id: "/_public",
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: "/_auth",
  getParentRoute: () => rootRoute,
} as any)

const AuthIndexRoute = AuthIndexImport.update({
  path: "/",
  getParentRoute: () => AuthRoute,
} as any).lazy(() => import("./routes/_auth/index.lazy").then((d) => d.Route))

const PublicLoggedOutLazyRoute = PublicLoggedOutLazyImport.update({
  path: "/logged-out",
  getParentRoute: () => PublicRoute,
} as any).lazy(() =>
  import("./routes/_public/logged-out.lazy").then((d) => d.Route),
)

const PublicDevLazyRoute = PublicDevLazyImport.update({
  path: "/dev",
  getParentRoute: () => PublicRoute,
} as any).lazy(() => import("./routes/_public/dev.lazy").then((d) => d.Route))

const PublicOidcCallbackRoute = PublicOidcCallbackImport.update({
  path: "/oidc-callback",
  getParentRoute: () => PublicRoute,
} as any)

const PublicLogoutRoute = PublicLogoutImport.update({
  path: "/logout",
  getParentRoute: () => PublicRoute,
} as any)

const AuthReservationsRouteRoute = AuthReservationsRouteImport.update({
  path: "/reservations",
  getParentRoute: () => AuthRoute,
} as any)
  .updateLoader({
    loader: lazyFn(
      () => import("./routes/_auth/reservations/loader"),
      "loader",
    ),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/_auth/reservations/component"),
      "component",
    ),
  })

const AuthReportsRouteRoute = AuthReportsRouteImport.update({
  path: "/reports",
  getParentRoute: () => AuthRoute,
} as any)
  .updateLoader({
    loader: lazyFn(() => import("./routes/_auth/reports/loader"), "loader"),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/_auth/reports/component"),
      "component",
    ),
  })

const AuthFleetRouteRoute = AuthFleetRouteImport.update({
  path: "/fleet",
  getParentRoute: () => AuthRoute,
} as any)
  .updateLoader({
    loader: lazyFn(() => import("./routes/_auth/fleet/loader"), "loader"),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/_auth/fleet/component"),
      "component",
    ),
  })

const AuthCustomersRouteRoute = AuthCustomersRouteImport.update({
  path: "/customers",
  getParentRoute: () => AuthRoute,
} as any)
  .updateLoader({
    loader: lazyFn(() => import("./routes/_auth/customers/loader"), "loader"),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/_auth/customers/component"),
      "component",
    ),
  })

const AuthAgreementsRouteRoute = AuthAgreementsRouteImport.update({
  path: "/agreements",
  getParentRoute: () => AuthRoute,
} as any)
  .updateLoader({
    loader: lazyFn(() => import("./routes/_auth/agreements/loader"), "loader"),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/_auth/agreements/component"),
      "component",
    ),
  })

const AuthSettingsIndexLazyRoute = AuthSettingsIndexLazyImport.update({
  path: "/settings/",
  getParentRoute: () => AuthRoute,
} as any).lazy(() =>
  import("./routes/_auth/settings/index.lazy").then((d) => d.Route),
)

const AuthSettingsDestinationRouteRoute =
  AuthSettingsDestinationRouteImport.update({
    path: "/settings/$destination",
    getParentRoute: () => AuthRoute,
  } as any).lazy(() =>
    import("./routes/_auth/settings_.$destination/route.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthReservationsNewRouteRoute = AuthReservationsNewRouteImport.update({
  path: "/reservations/new",
  getParentRoute: () => AuthRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import("./routes/_auth/reservations_.new/component"),
    "component",
  ),
})

const AuthReservationsReservationIdRouteRoute =
  AuthReservationsReservationIdRouteImport.update({
    path: "/reservations/$reservationId",
    getParentRoute: () => AuthRoute,
  } as any)
    .updateLoader({
      loader: lazyFn(
        () => import("./routes/_auth/reservations_.$reservationId/loader"),
        "loader",
      ),
    })
    .update({
      component: lazyRouteComponent(
        () => import("./routes/_auth/reservations_.$reservationId/component"),
        "component",
      ),
    })

const AuthReportsReportIdRouteRoute = AuthReportsReportIdRouteImport.update({
  path: "/reports/$reportId",
  getParentRoute: () => AuthRoute,
} as any)
  .updateLoader({
    loader: lazyFn(
      () => import("./routes/_auth/reports_.$reportId/loader"),
      "loader",
    ),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/_auth/reports_.$reportId/component"),
      "component",
    ),
  })

const AuthFleetVehicleIdRouteRoute = AuthFleetVehicleIdRouteImport.update({
  path: "/fleet/$vehicleId",
  getParentRoute: () => AuthRoute,
} as any)
  .updateLoader({
    loader: lazyFn(
      () => import("./routes/_auth/fleet_.$vehicleId/loader"),
      "loader",
    ),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/_auth/fleet_.$vehicleId/component"),
      "component",
    ),
  })

const AuthFleetNewRouteRoute = AuthFleetNewRouteImport.update({
  path: "/new",
  getParentRoute: () => AuthFleetRouteRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import("./routes/_auth/fleet.new/component"),
    "component",
  ),
})

const AuthCustomersNewRouteRoute = AuthCustomersNewRouteImport.update({
  path: "/customers/new",
  getParentRoute: () => AuthRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import("./routes/_auth/customers_.new/component"),
    "component",
  ),
})

const AuthCustomersCustomerIdRouteRoute =
  AuthCustomersCustomerIdRouteImport.update({
    path: "/customers/$customerId",
    getParentRoute: () => AuthRoute,
  } as any)
    .updateLoader({
      loader: lazyFn(
        () => import("./routes/_auth/customers_.$customerId/loader"),
        "loader",
      ),
    })
    .update({
      component: lazyRouteComponent(
        () => import("./routes/_auth/customers_.$customerId/component"),
        "component",
      ),
    })

const AuthAgreementsNewRouteRoute = AuthAgreementsNewRouteImport.update({
  path: "/agreements/new",
  getParentRoute: () => AuthRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import("./routes/_auth/agreements_.new/component"),
    "component",
  ),
})

const AuthAgreementsAgreementIdRouteRoute =
  AuthAgreementsAgreementIdRouteImport.update({
    path: "/agreements/$agreementId",
    getParentRoute: () => AuthRoute,
  } as any)
    .updateLoader({
      loader: lazyFn(
        () => import("./routes/_auth/agreements_.$agreementId/loader"),
        "loader",
      ),
    })
    .update({
      component: lazyRouteComponent(
        () => import("./routes/_auth/agreements_.$agreementId/component"),
        "component",
      ),
    })

const AuthReservationsReservationIdEditRouteRoute =
  AuthReservationsReservationIdEditRouteImport.update({
    path: "/edit",
    getParentRoute: () => AuthReservationsReservationIdRouteRoute,
  } as any)
    .updateLoader({
      loader: lazyFn(
        () => import("./routes/_auth/reservations_.$reservationId.edit/loader"),
        "loader",
      ),
    })
    .update({
      component: lazyRouteComponent(
        () =>
          import("./routes/_auth/reservations_.$reservationId.edit/component"),
        "component",
      ),
    })

const AuthFleetVehicleIdEditRouteRoute =
  AuthFleetVehicleIdEditRouteImport.update({
    path: "/edit",
    getParentRoute: () => AuthFleetVehicleIdRouteRoute,
  } as any).update({
    component: lazyRouteComponent(
      () => import("./routes/_auth/fleet_.$vehicleId.edit/component"),
      "component",
    ),
  })

const AuthCustomersCustomerIdEditRouteRoute =
  AuthCustomersCustomerIdEditRouteImport.update({
    path: "/edit",
    getParentRoute: () => AuthCustomersCustomerIdRouteRoute,
  } as any)
    .updateLoader({
      loader: lazyFn(
        () => import("./routes/_auth/customers_.$customerId.edit/loader"),
        "loader",
      ),
    })
    .update({
      component: lazyRouteComponent(
        () => import("./routes/_auth/customers_.$customerId.edit/component"),
        "component",
      ),
    })

const AuthAgreementsAgreementIdEditRouteRoute =
  AuthAgreementsAgreementIdEditRouteImport.update({
    path: "/edit",
    getParentRoute: () => AuthAgreementsAgreementIdRouteRoute,
  } as any)
    .updateLoader({
      loader: lazyFn(
        () => import("./routes/_auth/agreements_.$agreementId.edit/loader"),
        "loader",
      ),
    })
    .update({
      component: lazyRouteComponent(
        () => import("./routes/_auth/agreements_.$agreementId.edit/component"),
        "component",
      ),
    })

const AuthAgreementsAgreementIdCheckInRouteRoute =
  AuthAgreementsAgreementIdCheckInRouteImport.update({
    path: "/check-in",
    getParentRoute: () => AuthAgreementsAgreementIdRouteRoute,
  } as any)
    .updateLoader({
      loader: lazyFn(
        () => import("./routes/_auth/agreements_.$agreementId.check-in/loader"),
        "loader",
      ),
    })
    .update({
      component: lazyRouteComponent(
        () =>
          import("./routes/_auth/agreements_.$agreementId.check-in/component"),
        "component",
      ),
    })

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/_auth": {
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    "/_public": {
      preLoaderRoute: typeof PublicImport
      parentRoute: typeof rootRoute
    }
    "/_auth/agreements": {
      preLoaderRoute: typeof AuthAgreementsRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/customers": {
      preLoaderRoute: typeof AuthCustomersRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/fleet": {
      preLoaderRoute: typeof AuthFleetRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/reports": {
      preLoaderRoute: typeof AuthReportsRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/reservations": {
      preLoaderRoute: typeof AuthReservationsRouteImport
      parentRoute: typeof AuthImport
    }
    "/_public/logout": {
      preLoaderRoute: typeof PublicLogoutImport
      parentRoute: typeof PublicImport
    }
    "/_public/oidc-callback": {
      preLoaderRoute: typeof PublicOidcCallbackImport
      parentRoute: typeof PublicImport
    }
    "/_public/dev": {
      preLoaderRoute: typeof PublicDevLazyImport
      parentRoute: typeof PublicImport
    }
    "/_public/logged-out": {
      preLoaderRoute: typeof PublicLoggedOutLazyImport
      parentRoute: typeof PublicImport
    }
    "/_auth/": {
      preLoaderRoute: typeof AuthIndexImport
      parentRoute: typeof AuthImport
    }
    "/_auth/agreements/$agreementId": {
      preLoaderRoute: typeof AuthAgreementsAgreementIdRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/agreements/new": {
      preLoaderRoute: typeof AuthAgreementsNewRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/customers/$customerId": {
      preLoaderRoute: typeof AuthCustomersCustomerIdRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/customers/new": {
      preLoaderRoute: typeof AuthCustomersNewRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/fleet/new": {
      preLoaderRoute: typeof AuthFleetNewRouteImport
      parentRoute: typeof AuthFleetRouteImport
    }
    "/_auth/fleet/$vehicleId": {
      preLoaderRoute: typeof AuthFleetVehicleIdRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/reports/$reportId": {
      preLoaderRoute: typeof AuthReportsReportIdRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/reservations/$reservationId": {
      preLoaderRoute: typeof AuthReservationsReservationIdRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/reservations/new": {
      preLoaderRoute: typeof AuthReservationsNewRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/settings/$destination": {
      preLoaderRoute: typeof AuthSettingsDestinationRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/settings/": {
      preLoaderRoute: typeof AuthSettingsIndexLazyImport
      parentRoute: typeof AuthImport
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
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  AuthRoute.addChildren([
    AuthAgreementsRouteRoute,
    AuthCustomersRouteRoute,
    AuthFleetRouteRoute.addChildren([AuthFleetNewRouteRoute]),
    AuthReportsRouteRoute,
    AuthReservationsRouteRoute,
    AuthIndexRoute,
    AuthAgreementsAgreementIdRouteRoute.addChildren([
      AuthAgreementsAgreementIdCheckInRouteRoute,
      AuthAgreementsAgreementIdEditRouteRoute,
    ]),
    AuthAgreementsNewRouteRoute,
    AuthCustomersCustomerIdRouteRoute.addChildren([
      AuthCustomersCustomerIdEditRouteRoute,
    ]),
    AuthCustomersNewRouteRoute,
    AuthFleetVehicleIdRouteRoute.addChildren([
      AuthFleetVehicleIdEditRouteRoute,
    ]),
    AuthReportsReportIdRouteRoute,
    AuthReservationsReservationIdRouteRoute.addChildren([
      AuthReservationsReservationIdEditRouteRoute,
    ]),
    AuthReservationsNewRouteRoute,
    AuthSettingsDestinationRouteRoute,
    AuthSettingsIndexLazyRoute,
  ]),
  PublicRoute.addChildren([
    PublicLogoutRoute,
    PublicOidcCallbackRoute,
    PublicDevLazyRoute,
    PublicLoggedOutLazyRoute,
  ]),
])
