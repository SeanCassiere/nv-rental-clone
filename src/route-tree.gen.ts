// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from "./routes/__root"
import { Route as CustomersRouteImport } from "./routes/customers/route"
import { Route as AgreementsRouteImport } from "./routes/agreements/route"
import { Route as IndexRouteImport } from "./routes/index.route"
import { Route as CustomersNewRouteImport } from "./routes/customers_.new/route"
import { Route as CustomersCustomerIdRouteImport } from "./routes/customers_.$customerId/route"
import { Route as AgreementsNewRouteImport } from "./routes/agreements_.new/route"
import { Route as AgreementsAgreementIdRouteImport } from "./routes/agreements_.$agreementId/route"
import { Route as CustomersCustomerIdEditRouteImport } from "./routes/customers_.$customerId.edit/route"
import { Route as AgreementsAgreementIdEditRouteImport } from "./routes/agreements_.$agreementId.edit/route"
import { Route as AgreementsAgreementIdCheckInRouteImport } from "./routes/agreements_.$agreementId.check-in/route"

// Create/Update Routes

const CustomersRouteRoute = CustomersRouteImport.update({
  path: "/customers",
  getParentRoute: () => rootRoute,
} as any)

const AgreementsRouteRoute = AgreementsRouteImport.update({
  path: "/agreements",
  getParentRoute: () => rootRoute,
} as any)

const IndexRouteRoute = IndexRouteImport.update({
  path: "/",
  getParentRoute: () => rootRoute,
} as any)

const CustomersNewRouteRoute = CustomersNewRouteImport.update({
  path: "/customers/new",
  getParentRoute: () => rootRoute,
} as any)

const CustomersCustomerIdRouteRoute = CustomersCustomerIdRouteImport.update({
  path: "/customers/$customerId",
  getParentRoute: () => rootRoute,
} as any)

const AgreementsNewRouteRoute = AgreementsNewRouteImport.update({
  path: "/agreements/new",
  getParentRoute: () => rootRoute,
} as any)

const AgreementsAgreementIdRouteRoute = AgreementsAgreementIdRouteImport.update(
  {
    path: "/agreements/$agreementId",
    getParentRoute: () => rootRoute,
  } as any,
)

const CustomersCustomerIdEditRouteRoute =
  CustomersCustomerIdEditRouteImport.update({
    path: "/edit",
    getParentRoute: () => CustomersCustomerIdRouteRoute,
  } as any)

const AgreementsAgreementIdEditRouteRoute =
  AgreementsAgreementIdEditRouteImport.update({
    path: "/edit",
    getParentRoute: () => AgreementsAgreementIdRouteRoute,
  } as any)

const AgreementsAgreementIdCheckInRouteRoute =
  AgreementsAgreementIdCheckInRouteImport.update({
    path: "/check-in",
    getParentRoute: () => AgreementsAgreementIdRouteRoute,
  } as any)

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
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRouteRoute,
  AgreementsRouteRoute,
  CustomersRouteRoute,
  AgreementsAgreementIdRouteRoute.addChildren([
    AgreementsAgreementIdCheckInRouteRoute,
    AgreementsAgreementIdEditRouteRoute,
  ]),
  AgreementsNewRouteRoute,
  CustomersCustomerIdRouteRoute.addChildren([
    CustomersCustomerIdEditRouteRoute,
  ]),
  CustomersNewRouteRoute,
])
