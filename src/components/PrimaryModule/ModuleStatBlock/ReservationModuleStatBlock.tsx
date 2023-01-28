import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";

import { ModuleStatBlock, ModuleStatBlockContainer } from "./common";
import { type ReservationDataParsed } from "../../../utils/schemas/reservation";
import { viewAgreementRoute } from "../../../routes/agreements/viewAgreement";

const ReservationModuleStatBlock = ({
  reservation,
}: {
  reservation?: ReservationDataParsed | null;
}) => {
  const { t } = useTranslation();

  return (
    <ModuleStatBlockContainer
      title="Overview"
      subtitle="See what's going on with this reservation."
    >
      <ModuleStatBlock
        header="Status"
        stat={
          <span className="select-none text-2xl font-bold text-slate-600">
            {reservation?.reservationview.reservationStatusName ?? "-"}
          </span>
        }
      />
      {reservation?.reservationview.canceledDate && (
        <ModuleStatBlock
          header="Cancellation date"
          stat={
            <span className="select-none text-2xl font-bold text-slate-600">
              {reservation?.reservationview.canceledDate
                ? t("intlDateTime", {
                    value: reservation?.reservationview.canceledDate,
                  })
                : "-"}
            </span>
          }
        />
      )}
      <ModuleStatBlock
        header="Reservation type"
        stat={
          <span className="select-none text-2xl font-bold text-slate-600">
            {reservation?.reservationview.reservationType ?? "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="Vehicle type"
        stat={
          <span className="select-none text-2xl font-bold text-slate-600">
            {reservation?.reservationview.vehicleType ?? "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="Checkout date"
        stat={
          <span className="select-none text-2xl font-bold text-slate-600">
            {reservation?.reservationview.startDate
              ? t("intlDateTime", {
                  value: reservation?.reservationview.startDate,
                })
              : "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="Checkout location"
        stat={
          <span className="select-none text-2xl font-bold text-slate-600">
            {reservation?.reservationview.startLocationName ?? "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="Checkin date"
        stat={
          <span className="select-none text-2xl font-bold text-slate-600">
            {reservation?.reservationview.endDate
              ? t("intlDateTime", {
                  value: reservation?.reservationview.endDate,
                })
              : "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="Checkout location"
        stat={
          <span className="select-none text-2xl font-bold text-slate-600">
            {reservation?.reservationview.endLocationName ?? "-"}
          </span>
        }
      />
      {reservation &&
        !reservation?.reservationview.canceledDate &&
        reservation.reservationview.agreementId &&
        reservation.reservationview.agreementNumber && (
          <ModuleStatBlock
            header="Agreement no."
            stat={
              <Link
                to={viewAgreementRoute.id}
                params={{
                  agreementId: String(reservation.reservationview.agreementId),
                }}
                search={() => ({ tab: "summary" })}
                className="text-2xl font-bold text-slate-600 hover:text-slate-900"
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

export default ReservationModuleStatBlock;
