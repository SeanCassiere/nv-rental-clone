import React from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { Container } from "@/routes/-components/container";
import { LoadingPlaceholder } from "@/routes/-components/loading-placeholder";

import { titleMaker } from "@/lib/utils/title-maker";

export const Route = createFileRoute("/_public/logged-out")({
  loader: () => {
    throw redirect({
      to: "/",
    });
  },
  component: function PageComponent() {
    useDocumentTitle(titleMaker("Logged out"));
    return (
      <Container>
        <LoadingPlaceholder />
      </Container>
    );
  },
});
