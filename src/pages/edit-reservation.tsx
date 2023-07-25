import { useCallback, useEffect } from "react";
import { useNavigate, useParams, useRouter, useSearch } from "@tanstack/router";

import AddRentalParentForm from "@/components/add-rental";
import ProtectorShield from "@/components/protector-shield";

import {
  editReservationByIdRoute,
  viewReservationByIdRoute,
} from "@/routes/reservations/reservation-id-route";

import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";
import { useGetReservationData } from "@/hooks/network/reservation/useGetReservationData";
import { useGetModuleRentalRatesSummary } from "@/hooks/network/module/useGetModuleRentalRatesSummary";

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

  const summaryData = useGetModuleRentalRatesSummary({
    module: "reservations",
    referenceId: reservationId,
  });

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
      `Edit - ${reservationData.data?.reservationview.reservationNumber} - Agreement`
    )
  );

  useEffect(() => {
    if (summaryData.status !== "error") return;

    router.history.go(-1);
  }, [router.history, summaryData.status]);

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
          reservationData.data?.reservationview.reservationNumber || undefined
        }
        reservationData={reservationData.data || undefined}
        summaryData={summaryData.data}
      />
    </ProtectorShield>
  );
};

export default EditReservationPage;