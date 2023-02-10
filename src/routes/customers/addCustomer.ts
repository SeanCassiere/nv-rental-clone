import {
  // lazy,
  Route,
} from "@tanstack/react-router";
// import { z } from "zod";

import { customersRoute } from ".";
// import { queryClient as qc } from "../../App";

// import { getAuthToken } from "../../utils/authLocal";

export const addCustomerRoute = new Route({
  getParentRoute: () => customersRoute,
  path: "new",
  component: () => "Add Customer Route",
});
