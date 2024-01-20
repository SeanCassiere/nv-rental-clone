// This file is auto-generated by TanStack Router

import { FileRoute, lazyFn, lazyRouteComponent } from "@tanstack/react-router"

// Import Routes

import { Route as rootRoute } from "./routes/__root"
import { Route as ReservationsRouteImport } from "./routes/reservations/route"
import { Route as ReportsRouteImport } from "./routes/reports/route"
import { Route as OidcCallbackRouteImport } from "./routes/oidc-callback.route"
import { Route as LogoutRouteImport } from "./routes/logout.route"
import { Route as FleetRouteImport } from "./routes/fleet/route"
import { Route as CustomersRouteImport } from "./routes/customers/route"
import { Route as AgreementsRouteImport } from "./routes/agreements/route"
import { Route as IndexRouteImport } from "./routes/index.route"
import { Route as SettingsDestinationRouteImport } from "./routes/settings_.$destination/route"
import { Route as ReservationsNewRouteImport } from "./routes/reservations_.new/route"
import { Route as ReservationsReservationIdRouteImport } from "./routes/reservations_.$reservationId/route"
import { Route as ReportsReportIdRouteImport } from "./routes/reports_.$reportId/route"
import { Route as FleetVehicleIdRouteImport } from "./routes/fleet_.$vehicleId/route"
import { Route as FleetNewRouteImport } from "./routes/fleet.new/route"
import { Route as CustomersNewRouteImport } from "./routes/customers_.new/route"
import { Route as CustomersCustomerIdRouteImport } from "./routes/customers_.$customerId/route"
import { Route as AgreementsNewRouteImport } from "./routes/agreements_.new/route"
import { Route as AgreementsAgreementIdRouteImport } from "./routes/agreements_.$agreementId/route"
import { Route as ReservationsReservationIdEditRouteImport } from "./routes/reservations_.$reservationId.edit/route"
import { Route as FleetVehicleIdEditRouteImport } from "./routes/fleet_.$vehicleId.edit/route"
import { Route as CustomersCustomerIdEditRouteImport } from "./routes/customers_.$customerId.edit/route"
import { Route as AgreementsAgreementIdEditRouteImport } from "./routes/agreements_.$agreementId.edit/route"
import { Route as AgreementsAgreementIdCheckInRouteImport } from "./routes/agreements_.$agreementId.check-in/route"

// Create Virtual Routes

const SettingsComponentImport = new FileRoute("/settings").createRoute()
const LoggedOutComponentImport = new FileRoute("/logged-out").createRoute()
const DevComponentImport = new FileRoute("/dev").createRoute()

// Create/Update Routes

const SettingsComponentRoute = SettingsComponentImport.update({
  path: "/settings",
  getParentRoute: () => rootRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import("./routes/settings/component"),
    "component",
  ),
})

const LoggedOutComponentRoute = LoggedOutComponentImport.update({
  path: "/logged-out",
  getParentRoute: () => rootRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import("./routes/logged-out.component"),
    "component",
  ),
})

const DevComponentRoute = DevComponentImport.update({
  path: "/dev",
  getParentRoute: () => rootRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import("./routes/dev.component"),
    "component",
  ),
})

const ReservationsRouteRoute = ReservationsRouteImport.update({
  path: "/reservations",
  getParentRoute: () => rootRoute,
} as any)
  .updateLoader({
    loader: lazyFn(() => import("./routes/reservations/loader"), "loader"),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/reservations/component"),
      "component",
    ),
  })

const ReportsRouteRoute = ReportsRouteImport.update({
  path: "/reports",
  getParentRoute: () => rootRoute,
} as any)
  .updateLoader({
    loader: lazyFn(() => import("./routes/reports/loader"), "loader"),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/reports/component"),
      "component",
    ),
  })

const OidcCallbackRouteRoute = OidcCallbackRouteImport.update({
  path: "/oidc-callback",
  getParentRoute: () => rootRoute,
} as any)

const LogoutRouteRoute = LogoutRouteImport.update({
  path: "/logout",
  getParentRoute: () => rootRoute,
} as any)

const FleetRouteRoute = FleetRouteImport.update({
  path: "/fleet",
  getParentRoute: () => rootRoute,
} as any)
  .updateLoader({
    loader: lazyFn(() => import("./routes/fleet/loader"), "loader"),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/fleet/component"),
      "component",
    ),
  })

const CustomersRouteRoute = CustomersRouteImport.update({
  path: "/customers",
  getParentRoute: () => rootRoute,
} as any)
  .updateLoader({
    loader: lazyFn(() => import("./routes/customers/loader"), "loader"),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/customers/component"),
      "component",
    ),
  })

const AgreementsRouteRoute = AgreementsRouteImport.update({
  path: "/agreements",
  getParentRoute: () => rootRoute,
} as any)
  .updateLoader({
    loader: lazyFn(() => import("./routes/agreements/loader"), "loader"),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/agreements/component"),
      "component",
    ),
  })

const IndexRouteRoute = IndexRouteImport.update({
  path: "/",
  getParentRoute: () => rootRoute,
} as any)
  .updateLoader({
    loader: lazyFn(() => import("./routes/index.loader"), "loader"),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/index.component"),
      "component",
    ),
  })

const SettingsDestinationRouteRoute = SettingsDestinationRouteImport.update({
  path: "/settings/$destination",
  getParentRoute: () => rootRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import("./routes/settings_.$destination/component"),
    "component",
  ),
})

const ReservationsNewRouteRoute = ReservationsNewRouteImport.update({
  path: "/reservations/new",
  getParentRoute: () => rootRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import("./routes/reservations_.new/component"),
    "component",
  ),
})

const ReservationsReservationIdRouteRoute =
  ReservationsReservationIdRouteImport.update({
    path: "/reservations/$reservationId",
    getParentRoute: () => rootRoute,
  } as any)
    .updateLoader({
      loader: lazyFn(
        () => import("./routes/reservations_.$reservationId/loader"),
        "loader",
      ),
    })
    .update({
      component: lazyRouteComponent(
        () => import("./routes/reservations_.$reservationId/component"),
        "component",
      ),
    })

const ReportsReportIdRouteRoute = ReportsReportIdRouteImport.update({
  path: "/reports/$reportId",
  getParentRoute: () => rootRoute,
} as any)
  .updateLoader({
    loader: lazyFn(
      () => import("./routes/reports_.$reportId/loader"),
      "loader",
    ),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/reports_.$reportId/component"),
      "component",
    ),
  })

const FleetVehicleIdRouteRoute = FleetVehicleIdRouteImport.update({
  path: "/fleet/$vehicleId",
  getParentRoute: () => rootRoute,
} as any)
  .updateLoader({
    loader: lazyFn(() => import("./routes/fleet_.$vehicleId/loader"), "loader"),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/fleet_.$vehicleId/component"),
      "component",
    ),
  })

const FleetNewRouteRoute = FleetNewRouteImport.update({
  path: "/new",
  getParentRoute: () => FleetRouteRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import("./routes/fleet.new/component"),
    "component",
  ),
})

const CustomersNewRouteRoute = CustomersNewRouteImport.update({
  path: "/customers/new",
  getParentRoute: () => rootRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import("./routes/customers_.new/component"),
    "component",
  ),
})

const CustomersCustomerIdRouteRoute = CustomersCustomerIdRouteImport.update({
  path: "/customers/$customerId",
  getParentRoute: () => rootRoute,
} as any)
  .updateLoader({
    loader: lazyFn(
      () => import("./routes/customers_.$customerId/loader"),
      "loader",
    ),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/customers_.$customerId/component"),
      "component",
    ),
  })

const AgreementsNewRouteRoute = AgreementsNewRouteImport.update({
  path: "/agreements/new",
  getParentRoute: () => rootRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import("./routes/agreements_.new/component"),
    "component",
  ),
})

const AgreementsAgreementIdRouteRoute = AgreementsAgreementIdRouteImport.update(
  {
    path: "/agreements/$agreementId",
    getParentRoute: () => rootRoute,
  } as any,
)
  .updateLoader({
    loader: lazyFn(
      () => import("./routes/agreements_.$agreementId/loader"),
      "loader",
    ),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/agreements_.$agreementId/component"),
      "component",
    ),
  })

const ReservationsReservationIdEditRouteRoute =
  ReservationsReservationIdEditRouteImport.update({
    path: "/edit",
    getParentRoute: () => ReservationsReservationIdRouteRoute,
  } as any)
    .updateLoader({
      loader: lazyFn(
        () => import("./routes/reservations_.$reservationId.edit/loader"),
        "loader",
      ),
    })
    .update({
      component: lazyRouteComponent(
        () => import("./routes/reservations_.$reservationId.edit/component"),
        "component",
      ),
    })

const FleetVehicleIdEditRouteRoute = FleetVehicleIdEditRouteImport.update({
  path: "/edit",
  getParentRoute: () => FleetVehicleIdRouteRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import("./routes/fleet_.$vehicleId.edit/component"),
    "component",
  ),
})

const CustomersCustomerIdEditRouteRoute =
  CustomersCustomerIdEditRouteImport.update({
    path: "/edit",
    getParentRoute: () => CustomersCustomerIdRouteRoute,
  } as any)
    .updateLoader({
      loader: lazyFn(
        () => import("./routes/customers_.$customerId.edit/loader"),
        "loader",
      ),
    })
    .update({
      component: lazyRouteComponent(
        () => import("./routes/customers_.$customerId.edit/component"),
        "component",
      ),
    })

const AgreementsAgreementIdEditRouteRoute =
  AgreementsAgreementIdEditRouteImport.update({
    path: "/edit",
    getParentRoute: () => AgreementsAgreementIdRouteRoute,
  } as any)
    .updateLoader({
      loader: lazyFn(
        () => import("./routes/agreements_.$agreementId.edit/loader"),
        "loader",
      ),
    })
    .update({
      component: lazyRouteComponent(
        () => import("./routes/agreements_.$agreementId.edit/component"),
        "component",
      ),
    })

const AgreementsAgreementIdCheckInRouteRoute =
  AgreementsAgreementIdCheckInRouteImport.update({
    path: "/check-in",
    getParentRoute: () => AgreementsAgreementIdRouteRoute,
  } as any)
    .updateLoader({
      loader: lazyFn(
        () => import("./routes/agreements_.$agreementId.check-in/loader"),
        "loader",
      ),
    })
    .update({
      component: lazyRouteComponent(
        () => import("./routes/agreements_.$agreementId.check-in/component"),
        "component",
      ),
    })

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRoute
    }
    "/agreements": {
      preLoaderRoute: typeof AgreementsRouteImport
      parentRoute: typeof rootRoute
    }
    "/customers": {
      preLoaderRoute: typeof CustomersRouteImport
      parentRoute: typeof rootRoute
    }
    "/fleet": {
      preLoaderRoute: typeof FleetRouteImport
      parentRoute: typeof rootRoute
    }
    "/logout": {
      preLoaderRoute: typeof LogoutRouteImport
      parentRoute: typeof rootRoute
    }
    "/oidc-callback": {
      preLoaderRoute: typeof OidcCallbackRouteImport
      parentRoute: typeof rootRoute
    }
    "/reports": {
      preLoaderRoute: typeof ReportsRouteImport
      parentRoute: typeof rootRoute
    }
    "/reservations": {
      preLoaderRoute: typeof ReservationsRouteImport
      parentRoute: typeof rootRoute
    }
    "/dev": {
      preLoaderRoute: typeof DevComponentImport
      parentRoute: typeof rootRoute
    }
    "/logged-out": {
      preLoaderRoute: typeof LoggedOutComponentImport
      parentRoute: typeof rootRoute
    }
    "/settings": {
      preLoaderRoute: typeof SettingsComponentImport
      parentRoute: typeof rootRoute
    }
    "/agreements/$agreementId": {
      preLoaderRoute: typeof AgreementsAgreementIdRouteImport
      parentRoute: typeof rootRoute
    }
    "/agreements/new": {
      preLoaderRoute: typeof AgreementsNewRouteImport
      parentRoute: typeof rootRoute
    }
    "/customers/$customerId": {
      preLoaderRoute: typeof CustomersCustomerIdRouteImport
      parentRoute: typeof rootRoute
    }
    "/customers/new": {
      preLoaderRoute: typeof CustomersNewRouteImport
      parentRoute: typeof rootRoute
    }
    "/fleet/new": {
      preLoaderRoute: typeof FleetNewRouteImport
      parentRoute: typeof FleetRouteImport
    }
    "/fleet/$vehicleId": {
      preLoaderRoute: typeof FleetVehicleIdRouteImport
      parentRoute: typeof rootRoute
    }
    "/reports/$reportId": {
      preLoaderRoute: typeof ReportsReportIdRouteImport
      parentRoute: typeof rootRoute
    }
    "/reservations/$reservationId": {
      preLoaderRoute: typeof ReservationsReservationIdRouteImport
      parentRoute: typeof rootRoute
    }
    "/reservations/new": {
      preLoaderRoute: typeof ReservationsNewRouteImport
      parentRoute: typeof rootRoute
    }
    "/settings/$destination": {
      preLoaderRoute: typeof SettingsDestinationRouteImport
      parentRoute: typeof rootRoute
    }
    "/agreements/$agreementId/check-in": {
      preLoaderRoute: typeof AgreementsAgreementIdCheckInRouteImport
      parentRoute: typeof AgreementsAgreementIdRouteImport
    }
    "/agreements/$agreementId/edit": {
      preLoaderRoute: typeof AgreementsAgreementIdEditRouteImport
      parentRoute: typeof AgreementsAgreementIdRouteImport
    }
    "/customers/$customerId/edit": {
      preLoaderRoute: typeof CustomersCustomerIdEditRouteImport
      parentRoute: typeof CustomersCustomerIdRouteImport
    }
    "/fleet/$vehicleId/edit": {
      preLoaderRoute: typeof FleetVehicleIdEditRouteImport
      parentRoute: typeof FleetVehicleIdRouteImport
    }
    "/reservations/$reservationId/edit": {
      preLoaderRoute: typeof ReservationsReservationIdEditRouteImport
      parentRoute: typeof ReservationsReservationIdRouteImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRouteRoute,
  AgreementsRouteRoute,
  CustomersRouteRoute,
  FleetRouteRoute.addChildren([FleetNewRouteRoute]),
  LogoutRouteRoute,
  OidcCallbackRouteRoute,
  ReportsRouteRoute,
  ReservationsRouteRoute,
  DevComponentRoute,
  LoggedOutComponentRoute,
  SettingsComponentRoute,
  AgreementsAgreementIdRouteRoute.addChildren([
    AgreementsAgreementIdCheckInRouteRoute,
    AgreementsAgreementIdEditRouteRoute,
  ]),
  AgreementsNewRouteRoute,
  CustomersCustomerIdRouteRoute.addChildren([
    CustomersCustomerIdEditRouteRoute,
  ]),
  CustomersNewRouteRoute,
  FleetVehicleIdRouteRoute.addChildren([FleetVehicleIdEditRouteRoute]),
  ReportsReportIdRouteRoute,
  ReservationsReservationIdRouteRoute.addChildren([
    ReservationsReservationIdEditRouteRoute,
  ]),
  ReservationsNewRouteRoute,
  SettingsDestinationRouteRoute,
])
