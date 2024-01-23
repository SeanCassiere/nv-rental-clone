import React from "react";
import { FileRoute, Outlet } from "@tanstack/react-router";

import { Container } from "./-components/container";

export const Route = new FileRoute("/_public").createRoute({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <React.Fragment>
      <Container>
        <Outlet />
      </Container>
    </React.Fragment>
  );
}
