import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { RouteApi, useNavigate, useRouter } from "@tanstack/react-router";

import AddRentalParentForm from "@/components/add-rental";
import ProtectorShield from "@/components/protector-shield";

import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import { editReservationByIdRoute } from "@/routes/reservations/reservation-id-route";

import { titleMaker } from "@/utils/title-maker";

const routeApi = new RouteApi({ id: "/reservations/$reservationId/edit" });

const EditReservationPage = () => {
  const navigate = useNavigate({ from: editReservationByIdRoute.id });
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
    router.navigate({
      to: "..",
    });
  }, [router]);

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
    <ProtectorShield>
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
    </ProtectorShield>
  );
};

export default EditReservationPage;
