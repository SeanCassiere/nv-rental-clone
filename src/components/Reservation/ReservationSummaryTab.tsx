import { useGetClientProfile } from "../../hooks/network/client/useGetClientProfile";
import { useGetModuleRentalRatesSummary } from "../../hooks/network/module/useGetModuleRentalRatesSummary";
import { useGetReservationData } from "../../hooks/network/reservation/useGetReservationData";
import { RentalRatesSummary } from "../PrimaryModule/ModuleSummary/RentalRatesSummary";

type ReservationSummaryTabProps = {
  reservationId: string;
};

const ReservationSummaryTab = (props: ReservationSummaryTabProps) => {
  const reservationData = useGetReservationData({
    reservationId: props.reservationId,
  });

  const rentalRatesSummary = useGetModuleRentalRatesSummary({
    module: "reservations",
    referenceId: props.reservationId,
  });

  const clientProfile = useGetClientProfile();

  return (
    <div className="grid max-w-full grid-cols-1 gap-4 md:grid-cols-12">
      <div className="flex flex-col gap-4 md:col-span-7">
        <div className="overflow-x-scroll bg-white">
          <h2>Reservation data</h2>
          <code className="text-xs">
            <pre>{JSON.stringify(reservationData.data, null, 2)}</pre>
          </code>
        </div>
        <div className="bg-white">Reservation block 1</div>
        <div className="bg-white">Reservation block 2</div>
      </div>
      {/*  */}
      <div className="flex flex-col gap-4 md:col-span-5">
        <RentalRatesSummary
          module="reservations"
          summaryData={rentalRatesSummary.data}
          currency={clientProfile.data?.currency || undefined}
        />
      </div>
    </div>
  );
};

export default ReservationSummaryTab;
