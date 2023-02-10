import { lazy, Route } from "@tanstack/react-router";
// import { z } from "zod";

import { reservationsRoute } from ".";
// import { queryClient as qc } from "../../App";

// import { getAuthToken } from "../../utils/authLocal";

export const addReservationRoute = new Route({
  getParentRoute: () => reservationsRoute,
  path: "add",
  component: lazy(
    () => import("../../pages/AddReservation/AddReservationPage")
  ),
});
