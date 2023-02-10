import { useCallback } from "react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";

import AddRentalParentForm from "../../components/AddRental";
import Protector from "../../components/Protector";
import { type ModuleTabConfigItem } from "../../components/PrimaryModule/ModuleTabs";

import { useDocumentTitle } from "../../hooks/internal/useDocumentTitle";
import { useGetReservationData } from "../../hooks/network/reservation/useGetReservationData";

import { titleMaker } from "../../utils/title-maker";

import {
  editReservationByIdRoute,
  viewReservationByIdRoute,
} from "../../routes/reservations/reservationIdPath";

const EditReservationPage = () => {
  const navigate = useNavigate({ from: editReservationByIdRoute.id });

  const { stage = "rental-information" } = useSearch({
    from: editReservationByIdRoute.id,
  });
  const { reservationId } = useParams({ from: editReservationByIdRoute.id });

  const reservationData = useGetReservationData({ reservationId });

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
      to: viewReservationByIdRoute.fullPath,
      params: { reservationId },
      search: () => ({ tab: "summary" }),
    });
  }, [reservationId, navigate]);

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
        onAgreementSaveComplete={handleAgreementSaveComplete}
        referenceNumber={
          reservationData.data?.reservationview.reservationNumber || undefined
        }
      />
    </Protector>
  );
};

export default EditReservationPage;
