import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  getRouteApi,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";

import AddRentalParentForm from "@/components/add-rental";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { Container } from "@/routes/-components/container";

import { titleMaker } from "@/lib/utils/title-maker";

export const Route = createLazyFileRoute(
  "/_auth/(reservations)/reservations/$reservationId/edit"
)({
  component: EditReservationPage,
});

const routeApi = getRouteApi("/_auth/reservations/$reservationId/edit");

function EditReservationPage() {
  const navigate = useNavigate({ from: "/reservations/$reservationId/edit" });
  const router = useRouter();

  const routeContext = routeApi.useRouteContext();
  const { stage = "rental-information" } = routeApi.useSearch();
  const { reservationId } = routeApi.useParams();

  const reservationData = useQuery(routeContext.viewReservationOptions);
  const reservation =
    reservationData.data?.status === 200 ? reservationData.data?.body : null;

  const rentalRatesSummary = useQuery(
    routeContext.viewReservationSummaryOptions
  );
  const summaryData =
    rentalRatesSummary.data?.status === 200
      ? rentalRatesSummary.data?.body
      : undefined;

  const handleStageTabClick = useCallback(
    (destination: string) => {
      navigate({
        search: () => ({ stage: destination }),
        params: { reservationId },
      });
    },
    [reservationId, navigate]
  );

  const handleReservationSaveComplete = useCallback(() => {
    navigate({
      to: "/reservations/$reservationId",
      params: { reservationId },
      search: () => ({ tab: "summary" }),
    });
  }, [reservationId, navigate]);

  const handleCancelEditReservation = useCallback(() => {
    navigate({
      to: "..",
    });
  }, [navigate]);

  useDocumentTitle(
    titleMaker(
      `Edit - ${
        reservation?.reservationview?.reservationNumber || "Loading"
      } - Reservation`
    )
  );

  useEffect(() => {
    if (rentalRatesSummary.status !== "error") return;

    router.history.go(-1);
  }, [router.history, rentalRatesSummary.status]);

  return (
    <Container>
      <AddRentalParentForm
        referenceId={parseInt(reservationId)}
        currentStage={stage}
        module="reservation"
        onStageTabClick={handleStageTabClick}
        onRentalSaveClick={handleReservationSaveComplete}
        onRentalCancelClick={handleCancelEditReservation}
        referenceNumber={
          reservation?.reservationview.reservationNumber || undefined
        }
        reservationData={reservation || undefined}
        summaryData={summaryData}
      />
    </Container>
  );
}
