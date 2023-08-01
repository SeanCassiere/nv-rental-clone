import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/router";

import { ModuleStatBlock, ModuleStatBlockContainer } from "./common";
import { type ReservationDataParsed } from "../../../schemas/reservation";
import { viewAgreementByIdRoute } from "../../../routes/agreements/agreement-id-route";

const ReservationStatBlock = ({
  reservation,
}: {
  reservation?: ReservationDataParsed | null;
}) => {
  const { t } = useTranslation();

  return (
    <ModuleStatBlockContainer>
      <ModuleStatBlock
        header="Status"
        stat={
          reservation?.reservationview.reservationStatusName
            ? String(reservation?.reservationview.reservationStatusName)
            : "-"
        }
      />
      {reservation?.reservationview.canceledDate && (
        <ModuleStatBlock
          header="Cancellation date"
          stat={
            reservation?.reservationview.canceledDate
              ? t("intlDateTime", {
                  value: reservation?.reservationview.canceledDate,
                  ns: "format",
                })
              : "-"
          }
        />
      )}
      <ModuleStatBlock
        header="Reservation type"
        stat={reservation?.reservationview.reservationType ?? "-"}
      />
      <ModuleStatBlock
        header="Vehicle type"
        stat={reservation?.reservationview.vehicleType ?? "-"}
      />
      <ModuleStatBlock
        header="Checkout date"
        stat={
          reservation?.reservationview.startDate
            ? t("intlDateTime", {
                value: reservation?.reservationview.startDate,
                ns: "format",
              })
            : "-"
        }
      />
      <ModuleStatBlock
        header="Checkout location"
        stat={reservation?.reservationview.startLocationName ?? "-"}
      />
      <ModuleStatBlock
        header="Checkin date"
        stat={
          reservation?.reservationview.endDate
            ? t("intlDateTime", {
                value: reservation?.reservationview.endDate,
                ns: "format",
              })
            : "-"
        }
      />
      <ModuleStatBlock
        header="Checkout location"
        stat={reservation?.reservationview.endLocationName ?? "-"}
      />
      {reservation &&
        !reservation?.reservationview.canceledDate &&
        reservation.reservationview.agreementId &&
        reservation.reservationview.agreementNumber && (
          <ModuleStatBlock
            header="Agreement no."
            stat={
              <Link
                to={viewAgreementByIdRoute.to}
                params={{
                  agreementId: String(reservation.reservationview.agreementId),
                }}
                search={() => ({ tab: "summary" })}
                className="focus-within:underline focus-within:underline-offset-4 hover:underline hover:underline-offset-4"
                preload="intent"
              >
                {reservation?.reservationview.agreementNumber ?? "-"}
              </Link>
            }
          />
        )}
    </ModuleStatBlockContainer>
  );
};

export default ReservationStatBlock;
