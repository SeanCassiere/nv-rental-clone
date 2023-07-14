import { useCallback } from "react";
import { useNavigate, useParams, useRouter, useSearch } from "@tanstack/router";

import AddRentalParentForm from "@/components/AddRental";
import Protector from "@/components/Protector";
import { type ModuleTabConfigItem } from "@/components/primary-module/ModuleTabs";

import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";
import { useGetReservationData } from "@/hooks/network/reservation/useGetReservationData";
import { useGetModuleRentalRatesSummary } from "@/hooks/network/module/useGetModuleRentalRatesSummary";

import { titleMaker } from "@/utils/title-maker";

import {
  editReservationByIdRoute,
  viewReservationByIdRoute,
} from "@/routes/reservations/reservationIdPath";

const EditReservationPage = () => {
  const navigate = useNavigate({ from: editReservationByIdRoute.id });
  const router = useRouter();

  const { stage = "rental-information" } = useSearch({
    from: editReservationByIdRoute.id,
  });
  const { reservationId } = useParams({ from: editReservationByIdRoute.id });

  const handleFindError = () => router.history.go(-1);

  const reservationData = useGetReservationData({
    reservationId,
    onError: handleFindError,
  });

  const summaryData = useGetModuleRentalRatesSummary({
    module: "reservations",
    referenceId: reservationId,
  });

  const handleStageTabClick = useCallback(
    (destination: ModuleTabConfigItem) => {
      navigate({
        search: () => ({ stage: destination.id }),
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
  return (
    <Protector>
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
    </Protector>
  );
};

export default EditReservationPage;
