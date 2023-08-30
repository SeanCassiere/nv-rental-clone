import { useCallback, useEffect } from "react";
import {
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from "@tanstack/react-router";

import AddRentalParentForm from "@/components/add-rental";
import ProtectorShield from "@/components/protector-shield";

import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";
import { useGetModuleRentalRatesSummary } from "@/hooks/network/module/useGetModuleRentalRatesSummary";
import { useGetReservationData } from "@/hooks/network/reservation/useGetReservationData";

import {
  editReservationByIdRoute,
  viewReservationByIdRoute,
} from "@/routes/reservations/reservation-id-route";

import { titleMaker } from "@/utils/title-maker";

const EditReservationPage = () => {
  const navigate = useNavigate({ from: editReservationByIdRoute.id });
  const router = useRouter();

  const { stage = "rental-information" } = useSearch({
    from: editReservationByIdRoute.id,
  });
  const { reservationId } = useParams({ from: editReservationByIdRoute.id });

  const reservationData = useGetReservationData({
    reservationId,
  });
  const reservation =
    reservationData.data?.status === 200 ? reservationData.data?.body : null;

  const rentalRatesSummary = useGetModuleRentalRatesSummary({
    module: "reservations",
    referenceId: reservationId,
  });
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

  const handleAgreementSaveComplete = useCallback(() => {
    navigate({
      to: viewReservationByIdRoute.to,
      params: { reservationId },
      search: () => ({ tab: "summary" }),
    });
  }, [reservationId, navigate]);

  const handleCancelEditReservation = useCallback(() => {
    router.navigate({
      to: "../",
    });
  }, [router]);

  useDocumentTitle(
    titleMaker(
      `Edit - ${reservation?.reservationview.reservationNumber} - Agreement`
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
        onRentalSaveClick={handleAgreementSaveComplete}
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
