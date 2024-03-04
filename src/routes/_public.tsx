import React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Container } from "./-components/container";

export const Route = createFileRoute("/_public")({
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
