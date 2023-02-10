import {
  // lazy,
  Route,
} from "@tanstack/react-router";
// import { z } from "zod";

import { fleetRoute } from ".";
// import { queryClient as qc } from "../../App";

// import { getAuthToken } from "../../utils/authLocal";

export const addFleetRoute = new Route({
  getParentRoute: () => fleetRoute,
  path: "new",
  component: () => "Add Fleet Route",
});
