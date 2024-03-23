/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from "@tanstack/react-router"

// Import Routes

import { Route as rootRoute } from "./routes/__root"
import { Route as PublicImport } from "./routes/_public"
import { Route as AuthImport } from "./routes/_auth"
import { Route as PublicOidcCallbackImport } from "./routes/_public/oidc-callback"
import { Route as PublicLogoutImport } from "./routes/_public/logout"
import { Route as AuthdashboardIndexImport } from "./routes/_auth/(dashboard)/index"
import { Route as AuthsettingsSettingsRouteImport } from "./routes/_auth/(settings)/settings.route"
import { Route as AuthreservationsReservationsRouteImport } from "./routes/_auth/(reservations)/reservations.route"
import { Route as AuthreportsReportsRouteImport } from "./routes/_auth/(reports)/reports.route"
import { Route as AuthfleetFleetRouteImport } from "./routes/_auth/(fleet)/fleet.route"
import { Route as AuthcustomersCustomersRouteImport } from "./routes/_auth/(customers)/customers.route"
import { Route as AuthagreementsAgreementsRouteImport } from "./routes/_auth/(agreements)/agreements.route"
import { Route as AuthsettingsSettingsIndexImport } from "./routes/_auth/(settings)/settings.index"
import { Route as AuthreservationsReservationsIndexImport } from "./routes/_auth/(reservations)/reservations.index"
import { Route as AuthreportsReportsIndexImport } from "./routes/_auth/(reports)/reports.index"
import { Route as AuthfleetFleetIndexImport } from "./routes/_auth/(fleet)/fleet.index"
import { Route as AuthcustomersCustomersIndexImport } from "./routes/_auth/(customers)/customers.index"
import { Route as AuthagreementsAgreementsIndexImport } from "./routes/_auth/(agreements)/agreements.index"
import { Route as AuthsettingsSettingsProfileImport } from "./routes/_auth/(settings)/settings.profile"
import { Route as AuthreservationsReservationsNewImport } from "./routes/_auth/(reservations)/reservations.new"
import { Route as AuthfleetFleetNewImport } from "./routes/_auth/(fleet)/fleet.new"
import { Route as AuthcustomersCustomersNewImport } from "./routes/_auth/(customers)/customers.new"
import { Route as AuthagreementsAgreementsNewImport } from "./routes/_auth/(agreements)/agreements.new"
import { Route as AuthsettingsSettingsVehiclesAndCategoriesRouteImport } from "./routes/_auth/(settings)/settings.vehicles-and-categories.route"
import { Route as AuthsettingsSettingsRuntimeConfigurationRouteImport } from "./routes/_auth/(settings)/settings.runtime-configuration.route"
import { Route as AuthsettingsSettingsRatesAndChargesRouteImport } from "./routes/_auth/(settings)/settings.rates-and-charges.route"
import { Route as AuthsettingsSettingsApplicationRouteImport } from "./routes/_auth/(settings)/settings.application.route"
import { Route as AuthreservationsReservationsReservationIdRouteImport } from "./routes/_auth/(reservations)/reservations.$reservationId.route"
import { Route as AuthreportsReportsReportIdRouteImport } from "./routes/_auth/(reports)/reports.$reportId.route"
import { Route as AuthfleetFleetVehicleIdRouteImport } from "./routes/_auth/(fleet)/fleet.$vehicleId.route"
import { Route as AuthcustomersCustomersCustomerIdRouteImport } from "./routes/_auth/(customers)/customers.$customerId.route"
import { Route as AuthagreementsAgreementsAgreementIdRouteImport } from "./routes/_auth/(agreements)/agreements.$agreementId.route"
import { Route as AuthreservationsReservationsReservationIdIndexImport } from "./routes/_auth/(reservations)/reservations.$reservationId.index"
import { Route as AuthreportsReportsReportIdIndexImport } from "./routes/_auth/(reports)/reports.$reportId.index"
import { Route as AuthfleetFleetVehicleIdIndexImport } from "./routes/_auth/(fleet)/fleet.$vehicleId.index"
import { Route as AuthcustomersCustomersCustomerIdIndexImport } from "./routes/_auth/(customers)/customers.$customerId.index"
import { Route as AuthagreementsAgreementsAgreementIdIndexImport } from "./routes/_auth/(agreements)/agreements.$agreementId.index"
import { Route as AuthsettingsSettingsApplicationUsersImport } from "./routes/_auth/(settings)/settings.application.users"
import { Route as AuthsettingsSettingsApplicationStoreHoursAndHolidaysImport } from "./routes/_auth/(settings)/settings.application.store-hours-and-holidays"
import { Route as AuthsettingsSettingsApplicationPermissionsAndRolesImport } from "./routes/_auth/(settings)/settings.application.permissions-and-roles"
import { Route as AuthsettingsSettingsApplicationLocationsImport } from "./routes/_auth/(settings)/settings.application.locations"
import { Route as AuthreservationsReservationsReservationIdEditImport } from "./routes/_auth/(reservations)/reservations.$reservationId.edit"
import { Route as AuthfleetFleetVehicleIdEditImport } from "./routes/_auth/(fleet)/fleet.$vehicleId.edit"
import { Route as AuthcustomersCustomersCustomerIdEditImport } from "./routes/_auth/(customers)/customers.$customerId.edit"
import { Route as AuthagreementsAgreementsAgreementIdEditImport } from "./routes/_auth/(agreements)/agreements.$agreementId.edit"
import { Route as AuthagreementsAgreementsAgreementIdCheckInImport } from "./routes/_auth/(agreements)/agreements.$agreementId.check-in"

// Create Virtual Routes

const PublicLoggedOutLazyImport = createFileRoute("/_public/logged-out")()
const PublicDevLazyImport = createFileRoute("/_public/dev")()
const AuthsettingsSettingsApplicationIndexLazyImport = createFileRoute(
  "/_auth/(settings)/settings/application/",
)()

// Create/Update Routes

const PublicRoute = PublicImport.update({
  id: "/_public",
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: "/_auth",
  getParentRoute: () => rootRoute,
} as any)

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

const AuthdashboardIndexRoute = AuthdashboardIndexImport.update({
  path: "/",
  getParentRoute: () => AuthRoute,
} as any).lazy(() =>
  import("./routes/_auth/(dashboard)/index.lazy").then((d) => d.Route),
)

const AuthsettingsSettingsRouteRoute = AuthsettingsSettingsRouteImport.update({
  path: "/settings",
  getParentRoute: () => AuthRoute,
} as any).lazy(() =>
  import("./routes/_auth/(settings)/settings.route.lazy").then((d) => d.Route),
)

const AuthreservationsReservationsRouteRoute =
  AuthreservationsReservationsRouteImport.update({
    path: "/reservations",
    getParentRoute: () => AuthRoute,
  } as any)

const AuthreportsReportsRouteRoute = AuthreportsReportsRouteImport.update({
  path: "/reports",
  getParentRoute: () => AuthRoute,
} as any)

const AuthfleetFleetRouteRoute = AuthfleetFleetRouteImport.update({
  path: "/fleet",
  getParentRoute: () => AuthRoute,
} as any)

const AuthcustomersCustomersRouteRoute =
  AuthcustomersCustomersRouteImport.update({
    path: "/customers",
    getParentRoute: () => AuthRoute,
  } as any)

const AuthagreementsAgreementsRouteRoute =
  AuthagreementsAgreementsRouteImport.update({
    path: "/agreements",
    getParentRoute: () => AuthRoute,
  } as any)

const AuthsettingsSettingsIndexRoute = AuthsettingsSettingsIndexImport.update({
  path: "/",
  getParentRoute: () => AuthsettingsSettingsRouteRoute,
} as any)

const AuthreservationsReservationsIndexRoute =
  AuthreservationsReservationsIndexImport.update({
    path: "/",
    getParentRoute: () => AuthreservationsReservationsRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/(reservations)/reservations.index.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthreportsReportsIndexRoute = AuthreportsReportsIndexImport.update({
  path: "/",
  getParentRoute: () => AuthreportsReportsRouteRoute,
} as any).lazy(() =>
  import("./routes/_auth/(reports)/reports.index.lazy").then((d) => d.Route),
)

const AuthfleetFleetIndexRoute = AuthfleetFleetIndexImport.update({
  path: "/",
  getParentRoute: () => AuthfleetFleetRouteRoute,
} as any).lazy(() =>
  import("./routes/_auth/(fleet)/fleet.index.lazy").then((d) => d.Route),
)

const AuthcustomersCustomersIndexRoute =
  AuthcustomersCustomersIndexImport.update({
    path: "/",
    getParentRoute: () => AuthcustomersCustomersRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/(customers)/customers.index.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthagreementsAgreementsIndexRoute =
  AuthagreementsAgreementsIndexImport.update({
    path: "/",
    getParentRoute: () => AuthagreementsAgreementsRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/(agreements)/agreements.index.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthsettingsSettingsProfileRoute =
  AuthsettingsSettingsProfileImport.update({
    path: "/profile",
    getParentRoute: () => AuthsettingsSettingsRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/(settings)/settings.profile.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthreservationsReservationsNewRoute =
  AuthreservationsReservationsNewImport.update({
    path: "/new",
    getParentRoute: () => AuthreservationsReservationsRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/(reservations)/reservations.new.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthfleetFleetNewRoute = AuthfleetFleetNewImport.update({
  path: "/new",
  getParentRoute: () => AuthfleetFleetRouteRoute,
} as any).lazy(() =>
  import("./routes/_auth/(fleet)/fleet.new.lazy").then((d) => d.Route),
)

const AuthcustomersCustomersNewRoute = AuthcustomersCustomersNewImport.update({
  path: "/new",
  getParentRoute: () => AuthcustomersCustomersRouteRoute,
} as any).lazy(() =>
  import("./routes/_auth/(customers)/customers.new.lazy").then((d) => d.Route),
)

const AuthagreementsAgreementsNewRoute =
  AuthagreementsAgreementsNewImport.update({
    path: "/new",
    getParentRoute: () => AuthagreementsAgreementsRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/(agreements)/agreements.new.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthsettingsSettingsVehiclesAndCategoriesRouteRoute =
  AuthsettingsSettingsVehiclesAndCategoriesRouteImport.update({
    path: "/vehicles-and-categories",
    getParentRoute: () => AuthsettingsSettingsRouteRoute,
  } as any).lazy(() =>
    import(
      "./routes/_auth/(settings)/settings.vehicles-and-categories.route.lazy"
    ).then((d) => d.Route),
  )

const AuthsettingsSettingsRuntimeConfigurationRouteRoute =
  AuthsettingsSettingsRuntimeConfigurationRouteImport.update({
    path: "/runtime-configuration",
    getParentRoute: () => AuthsettingsSettingsRouteRoute,
  } as any).lazy(() =>
    import(
      "./routes/_auth/(settings)/settings.runtime-configuration.route.lazy"
    ).then((d) => d.Route),
  )

const AuthsettingsSettingsRatesAndChargesRouteRoute =
  AuthsettingsSettingsRatesAndChargesRouteImport.update({
    path: "/rates-and-charges",
    getParentRoute: () => AuthsettingsSettingsRouteRoute,
  } as any).lazy(() =>
    import(
      "./routes/_auth/(settings)/settings.rates-and-charges.route.lazy"
    ).then((d) => d.Route),
  )

const AuthsettingsSettingsApplicationRouteRoute =
  AuthsettingsSettingsApplicationRouteImport.update({
    path: "/application",
    getParentRoute: () => AuthsettingsSettingsRouteRoute,
  } as any)

const AuthreservationsReservationsReservationIdRouteRoute =
  AuthreservationsReservationsReservationIdRouteImport.update({
    path: "/$reservationId",
    getParentRoute: () => AuthreservationsReservationsRouteRoute,
  } as any)

const AuthreportsReportsReportIdRouteRoute =
  AuthreportsReportsReportIdRouteImport.update({
    path: "/$reportId",
    getParentRoute: () => AuthreportsReportsRouteRoute,
  } as any)

const AuthfleetFleetVehicleIdRouteRoute =
  AuthfleetFleetVehicleIdRouteImport.update({
    path: "/$vehicleId",
    getParentRoute: () => AuthfleetFleetRouteRoute,
  } as any)

const AuthcustomersCustomersCustomerIdRouteRoute =
  AuthcustomersCustomersCustomerIdRouteImport.update({
    path: "/$customerId",
    getParentRoute: () => AuthcustomersCustomersRouteRoute,
  } as any)

const AuthagreementsAgreementsAgreementIdRouteRoute =
  AuthagreementsAgreementsAgreementIdRouteImport.update({
    path: "/$agreementId",
    getParentRoute: () => AuthagreementsAgreementsRouteRoute,
  } as any)

const AuthsettingsSettingsApplicationIndexLazyRoute =
  AuthsettingsSettingsApplicationIndexLazyImport.update({
    path: "/",
    getParentRoute: () => AuthsettingsSettingsApplicationRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/(settings)/settings.application.index.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthreservationsReservationsReservationIdIndexRoute =
  AuthreservationsReservationsReservationIdIndexImport.update({
    path: "/",
    getParentRoute: () => AuthreservationsReservationsReservationIdRouteRoute,
  } as any).lazy(() =>
    import(
      "./routes/_auth/(reservations)/reservations.$reservationId.index.lazy"
    ).then((d) => d.Route),
  )

const AuthreportsReportsReportIdIndexRoute =
  AuthreportsReportsReportIdIndexImport.update({
    path: "/",
    getParentRoute: () => AuthreportsReportsReportIdRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/(reports)/reports.$reportId.index.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthfleetFleetVehicleIdIndexRoute =
  AuthfleetFleetVehicleIdIndexImport.update({
    path: "/",
    getParentRoute: () => AuthfleetFleetVehicleIdRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/(fleet)/fleet.$vehicleId.index.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthcustomersCustomersCustomerIdIndexRoute =
  AuthcustomersCustomersCustomerIdIndexImport.update({
    path: "/",
    getParentRoute: () => AuthcustomersCustomersCustomerIdRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/(customers)/customers.$customerId.index.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthagreementsAgreementsAgreementIdIndexRoute =
  AuthagreementsAgreementsAgreementIdIndexImport.update({
    path: "/",
    getParentRoute: () => AuthagreementsAgreementsAgreementIdRouteRoute,
  } as any).lazy(() =>
    import(
      "./routes/_auth/(agreements)/agreements.$agreementId.index.lazy"
    ).then((d) => d.Route),
  )

const AuthsettingsSettingsApplicationUsersRoute =
  AuthsettingsSettingsApplicationUsersImport.update({
    path: "/users",
    getParentRoute: () => AuthsettingsSettingsApplicationRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/(settings)/settings.application.users.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthsettingsSettingsApplicationStoreHoursAndHolidaysRoute =
  AuthsettingsSettingsApplicationStoreHoursAndHolidaysImport.update({
    path: "/store-hours-and-holidays",
    getParentRoute: () => AuthsettingsSettingsApplicationRouteRoute,
  } as any).lazy(() =>
    import(
      "./routes/_auth/(settings)/settings.application.store-hours-and-holidays.lazy"
    ).then((d) => d.Route),
  )

const AuthsettingsSettingsApplicationPermissionsAndRolesRoute =
  AuthsettingsSettingsApplicationPermissionsAndRolesImport.update({
    path: "/permissions-and-roles",
    getParentRoute: () => AuthsettingsSettingsApplicationRouteRoute,
  } as any).lazy(() =>
    import(
      "./routes/_auth/(settings)/settings.application.permissions-and-roles.lazy"
    ).then((d) => d.Route),
  )

const AuthsettingsSettingsApplicationLocationsRoute =
  AuthsettingsSettingsApplicationLocationsImport.update({
    path: "/locations",
    getParentRoute: () => AuthsettingsSettingsApplicationRouteRoute,
  } as any).lazy(() =>
    import(
      "./routes/_auth/(settings)/settings.application.locations.lazy"
    ).then((d) => d.Route),
  )

const AuthreservationsReservationsReservationIdEditRoute =
  AuthreservationsReservationsReservationIdEditImport.update({
    path: "/edit",
    getParentRoute: () => AuthreservationsReservationsReservationIdRouteRoute,
  } as any).lazy(() =>
    import(
      "./routes/_auth/(reservations)/reservations.$reservationId.edit.lazy"
    ).then((d) => d.Route),
  )

const AuthfleetFleetVehicleIdEditRoute =
  AuthfleetFleetVehicleIdEditImport.update({
    path: "/edit",
    getParentRoute: () => AuthfleetFleetVehicleIdRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/(fleet)/fleet.$vehicleId.edit.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthcustomersCustomersCustomerIdEditRoute =
  AuthcustomersCustomersCustomerIdEditImport.update({
    path: "/edit",
    getParentRoute: () => AuthcustomersCustomersCustomerIdRouteRoute,
  } as any).lazy(() =>
    import("./routes/_auth/(customers)/customers.$customerId.edit.lazy").then(
      (d) => d.Route,
    ),
  )

const AuthagreementsAgreementsAgreementIdEditRoute =
  AuthagreementsAgreementsAgreementIdEditImport.update({
    path: "/edit",
    getParentRoute: () => AuthagreementsAgreementsAgreementIdRouteRoute,
  } as any).lazy(() =>
    import(
      "./routes/_auth/(agreements)/agreements.$agreementId.edit.lazy"
    ).then((d) => d.Route),
  )

const AuthagreementsAgreementsAgreementIdCheckInRoute =
  AuthagreementsAgreementsAgreementIdCheckInImport.update({
    path: "/check-in",
    getParentRoute: () => AuthagreementsAgreementsAgreementIdRouteRoute,
  } as any).lazy(() =>
    import(
      "./routes/_auth/(agreements)/agreements.$agreementId.check-in.lazy"
    ).then((d) => d.Route),
  )

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
    "/_auth/(agreements)/agreements": {
      preLoaderRoute: typeof AuthagreementsAgreementsRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/(customers)/customers": {
      preLoaderRoute: typeof AuthcustomersCustomersRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/(fleet)/fleet": {
      preLoaderRoute: typeof AuthfleetFleetRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/(reports)/reports": {
      preLoaderRoute: typeof AuthreportsReportsRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/(reservations)/reservations": {
      preLoaderRoute: typeof AuthreservationsReservationsRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/(settings)/settings": {
      preLoaderRoute: typeof AuthsettingsSettingsRouteImport
      parentRoute: typeof AuthImport
    }
    "/_auth/(dashboard)/": {
      preLoaderRoute: typeof AuthdashboardIndexImport
      parentRoute: typeof AuthImport
    }
    "/_auth/(agreements)/agreements/$agreementId": {
      preLoaderRoute: typeof AuthagreementsAgreementsAgreementIdRouteImport
      parentRoute: typeof AuthagreementsAgreementsRouteImport
    }
    "/_auth/(customers)/customers/$customerId": {
      preLoaderRoute: typeof AuthcustomersCustomersCustomerIdRouteImport
      parentRoute: typeof AuthcustomersCustomersRouteImport
    }
    "/_auth/(fleet)/fleet/$vehicleId": {
      preLoaderRoute: typeof AuthfleetFleetVehicleIdRouteImport
      parentRoute: typeof AuthfleetFleetRouteImport
    }
    "/_auth/(reports)/reports/$reportId": {
      preLoaderRoute: typeof AuthreportsReportsReportIdRouteImport
      parentRoute: typeof AuthreportsReportsRouteImport
    }
    "/_auth/(reservations)/reservations/$reservationId": {
      preLoaderRoute: typeof AuthreservationsReservationsReservationIdRouteImport
      parentRoute: typeof AuthreservationsReservationsRouteImport
    }
    "/_auth/(settings)/settings/application": {
      preLoaderRoute: typeof AuthsettingsSettingsApplicationRouteImport
      parentRoute: typeof AuthsettingsSettingsRouteImport
    }
    "/_auth/(settings)/settings/rates-and-charges": {
      preLoaderRoute: typeof AuthsettingsSettingsRatesAndChargesRouteImport
      parentRoute: typeof AuthsettingsSettingsRouteImport
    }
    "/_auth/(settings)/settings/runtime-configuration": {
      preLoaderRoute: typeof AuthsettingsSettingsRuntimeConfigurationRouteImport
      parentRoute: typeof AuthsettingsSettingsRouteImport
    }
    "/_auth/(settings)/settings/vehicles-and-categories": {
      preLoaderRoute: typeof AuthsettingsSettingsVehiclesAndCategoriesRouteImport
      parentRoute: typeof AuthsettingsSettingsRouteImport
    }
    "/_auth/(agreements)/agreements/new": {
      preLoaderRoute: typeof AuthagreementsAgreementsNewImport
      parentRoute: typeof AuthagreementsAgreementsRouteImport
    }
    "/_auth/(customers)/customers/new": {
      preLoaderRoute: typeof AuthcustomersCustomersNewImport
      parentRoute: typeof AuthcustomersCustomersRouteImport
    }
    "/_auth/(fleet)/fleet/new": {
      preLoaderRoute: typeof AuthfleetFleetNewImport
      parentRoute: typeof AuthfleetFleetRouteImport
    }
    "/_auth/(reservations)/reservations/new": {
      preLoaderRoute: typeof AuthreservationsReservationsNewImport
      parentRoute: typeof AuthreservationsReservationsRouteImport
    }
    "/_auth/(settings)/settings/profile": {
      preLoaderRoute: typeof AuthsettingsSettingsProfileImport
      parentRoute: typeof AuthsettingsSettingsRouteImport
    }
    "/_auth/(agreements)/agreements/": {
      preLoaderRoute: typeof AuthagreementsAgreementsIndexImport
      parentRoute: typeof AuthagreementsAgreementsRouteImport
    }
    "/_auth/(customers)/customers/": {
      preLoaderRoute: typeof AuthcustomersCustomersIndexImport
      parentRoute: typeof AuthcustomersCustomersRouteImport
    }
    "/_auth/(fleet)/fleet/": {
      preLoaderRoute: typeof AuthfleetFleetIndexImport
      parentRoute: typeof AuthfleetFleetRouteImport
    }
    "/_auth/(reports)/reports/": {
      preLoaderRoute: typeof AuthreportsReportsIndexImport
      parentRoute: typeof AuthreportsReportsRouteImport
    }
    "/_auth/(reservations)/reservations/": {
      preLoaderRoute: typeof AuthreservationsReservationsIndexImport
      parentRoute: typeof AuthreservationsReservationsRouteImport
    }
    "/_auth/(settings)/settings/": {
      preLoaderRoute: typeof AuthsettingsSettingsIndexImport
      parentRoute: typeof AuthsettingsSettingsRouteImport
    }
    "/_auth/(agreements)/agreements/$agreementId/check-in": {
      preLoaderRoute: typeof AuthagreementsAgreementsAgreementIdCheckInImport
      parentRoute: typeof AuthagreementsAgreementsAgreementIdRouteImport
    }
    "/_auth/(agreements)/agreements/$agreementId/edit": {
      preLoaderRoute: typeof AuthagreementsAgreementsAgreementIdEditImport
      parentRoute: typeof AuthagreementsAgreementsAgreementIdRouteImport
    }
    "/_auth/(customers)/customers/$customerId/edit": {
      preLoaderRoute: typeof AuthcustomersCustomersCustomerIdEditImport
      parentRoute: typeof AuthcustomersCustomersCustomerIdRouteImport
    }
    "/_auth/(fleet)/fleet/$vehicleId/edit": {
      preLoaderRoute: typeof AuthfleetFleetVehicleIdEditImport
      parentRoute: typeof AuthfleetFleetVehicleIdRouteImport
    }
    "/_auth/(reservations)/reservations/$reservationId/edit": {
      preLoaderRoute: typeof AuthreservationsReservationsReservationIdEditImport
      parentRoute: typeof AuthreservationsReservationsReservationIdRouteImport
    }
    "/_auth/(settings)/settings/application/locations": {
      preLoaderRoute: typeof AuthsettingsSettingsApplicationLocationsImport
      parentRoute: typeof AuthsettingsSettingsApplicationRouteImport
    }
    "/_auth/(settings)/settings/application/permissions-and-roles": {
      preLoaderRoute: typeof AuthsettingsSettingsApplicationPermissionsAndRolesImport
      parentRoute: typeof AuthsettingsSettingsApplicationRouteImport
    }
    "/_auth/(settings)/settings/application/store-hours-and-holidays": {
      preLoaderRoute: typeof AuthsettingsSettingsApplicationStoreHoursAndHolidaysImport
      parentRoute: typeof AuthsettingsSettingsApplicationRouteImport
    }
    "/_auth/(settings)/settings/application/users": {
      preLoaderRoute: typeof AuthsettingsSettingsApplicationUsersImport
      parentRoute: typeof AuthsettingsSettingsApplicationRouteImport
    }
    "/_auth/(agreements)/agreements/$agreementId/": {
      preLoaderRoute: typeof AuthagreementsAgreementsAgreementIdIndexImport
      parentRoute: typeof AuthagreementsAgreementsAgreementIdRouteImport
    }
    "/_auth/(customers)/customers/$customerId/": {
      preLoaderRoute: typeof AuthcustomersCustomersCustomerIdIndexImport
      parentRoute: typeof AuthcustomersCustomersCustomerIdRouteImport
    }
    "/_auth/(fleet)/fleet/$vehicleId/": {
      preLoaderRoute: typeof AuthfleetFleetVehicleIdIndexImport
      parentRoute: typeof AuthfleetFleetVehicleIdRouteImport
    }
    "/_auth/(reports)/reports/$reportId/": {
      preLoaderRoute: typeof AuthreportsReportsReportIdIndexImport
      parentRoute: typeof AuthreportsReportsReportIdRouteImport
    }
    "/_auth/(reservations)/reservations/$reservationId/": {
      preLoaderRoute: typeof AuthreservationsReservationsReservationIdIndexImport
      parentRoute: typeof AuthreservationsReservationsReservationIdRouteImport
    }
    "/_auth/(settings)/settings/application/": {
      preLoaderRoute: typeof AuthsettingsSettingsApplicationIndexLazyImport
      parentRoute: typeof AuthsettingsSettingsApplicationRouteImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  AuthRoute.addChildren([
    AuthagreementsAgreementsRouteRoute.addChildren([
      AuthagreementsAgreementsAgreementIdRouteRoute.addChildren([
        AuthagreementsAgreementsAgreementIdCheckInRoute,
        AuthagreementsAgreementsAgreementIdEditRoute,
        AuthagreementsAgreementsAgreementIdIndexRoute,
      ]),
      AuthagreementsAgreementsNewRoute,
      AuthagreementsAgreementsIndexRoute,
    ]),
    AuthcustomersCustomersRouteRoute.addChildren([
      AuthcustomersCustomersCustomerIdRouteRoute.addChildren([
        AuthcustomersCustomersCustomerIdEditRoute,
        AuthcustomersCustomersCustomerIdIndexRoute,
      ]),
      AuthcustomersCustomersNewRoute,
      AuthcustomersCustomersIndexRoute,
    ]),
    AuthfleetFleetRouteRoute.addChildren([
      AuthfleetFleetVehicleIdRouteRoute.addChildren([
        AuthfleetFleetVehicleIdEditRoute,
        AuthfleetFleetVehicleIdIndexRoute,
      ]),
      AuthfleetFleetNewRoute,
      AuthfleetFleetIndexRoute,
    ]),
    AuthreportsReportsRouteRoute.addChildren([
      AuthreportsReportsReportIdRouteRoute.addChildren([
        AuthreportsReportsReportIdIndexRoute,
      ]),
      AuthreportsReportsIndexRoute,
    ]),
    AuthreservationsReservationsRouteRoute.addChildren([
      AuthreservationsReservationsReservationIdRouteRoute.addChildren([
        AuthreservationsReservationsReservationIdEditRoute,
        AuthreservationsReservationsReservationIdIndexRoute,
      ]),
      AuthreservationsReservationsNewRoute,
      AuthreservationsReservationsIndexRoute,
    ]),
    AuthsettingsSettingsRouteRoute.addChildren([
      AuthsettingsSettingsApplicationRouteRoute.addChildren([
        AuthsettingsSettingsApplicationLocationsRoute,
        AuthsettingsSettingsApplicationPermissionsAndRolesRoute,
        AuthsettingsSettingsApplicationStoreHoursAndHolidaysRoute,
        AuthsettingsSettingsApplicationUsersRoute,
        AuthsettingsSettingsApplicationIndexLazyRoute,
      ]),
      AuthsettingsSettingsRatesAndChargesRouteRoute,
      AuthsettingsSettingsRuntimeConfigurationRouteRoute,
      AuthsettingsSettingsVehiclesAndCategoriesRouteRoute,
      AuthsettingsSettingsProfileRoute,
      AuthsettingsSettingsIndexRoute,
    ]),
    AuthdashboardIndexRoute,
  ]),
  PublicRoute.addChildren([
    PublicLogoutRoute,
    PublicOidcCallbackRoute,
    PublicDevLazyRoute,
    PublicLoggedOutLazyRoute,
  ]),
])

/* prettier-ignore-end */
