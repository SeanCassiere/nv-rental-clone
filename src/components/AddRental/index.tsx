import { useMemo } from "react";
import { Link } from "@tanstack/react-router";

import { ChevronRightOutline } from "../icons";
import CommonHeader from "../Layout/CommonHeader";
import { RentalRatesSummary } from "../PrimaryModule/ModuleSummary/RentalRatesSummary";
import {
  ModuleTabs,
  type ModuleTabConfigItem,
} from "../PrimaryModule/ModuleTabs";

import { useGetClientProfile } from "../../hooks/network/client/useGetClientProfile";

import { addAgreementRoute } from "../../routes/agreements/addAgreement";
import { searchAgreementsRoute } from "../../routes/agreements/searchAgreements";
import {
  editAgreementByIdRoute,
  viewAgreementByIdRoute,
} from "../../routes/agreements/agreementIdPath";
import { getStartingIndexFromTabName } from "../../utils/moduleTabs";
import { searchReservationsRoute } from "../../routes/reservations/searchReservations";
import { addReservationRoute } from "../../routes/reservations/addReservation";
import {
  editReservationByIdRoute,
  viewReservationByIdRoute,
} from "../../routes/reservations/reservationIdPath";

const AddRentalParentForm = ({
  referenceId,
  currentStage: stage,
  module,
  onStageTabClick: handleStageTabClick,
  referenceNumber,
}: {
  referenceId: number | string;
  currentStage: string;
  module: "agreement" | "reservation";
  onStageTabClick: (destinationTab: ModuleTabConfigItem) => void;
  onAgreementSaveComplete: (agreementId: number) => void;
  referenceNumber?: string;
}) => {
  const clientProfile = useGetClientProfile();
  const isEdit = Boolean(referenceId);

  const tabsConfig = useMemo(() => {
    const tabs: ModuleTabConfigItem[] = [];
    if (module === "agreement") {
      tabs.push({
        id: "rental-information",
        label: "Rental information",
        component: "Rental information",
      });
      tabs.push({
        id: "vehicle-information",
        label: "Vehicle information",
        component: "Vehicle information",
      });
      tabs.push({
        id: "customer-information",
        label: "Customer information",
        component: "Customer information",
      });
      tabs.push({
        id: "rates-and-taxes",
        label: "Rates and taxes",
        component: "Rates and taxes",
      });
      tabs.push({
        id: "others",
        label: "Other information",
        component: "Other information",
      });
    }
    if (module === "reservation") {
      tabs.push({
        id: "rental-information",
        label: "Rental information",
        component: "Rental information",
      });
      tabs.push({
        id: "vehicle-information",
        label: "Vehicle information",
        component: "Vehicle information",
      });
      tabs.push({
        id: "customer-information",
        label: "Customer information",
        component: "Customer information",
      });
      tabs.push({
        id: "rates-and-taxes",
        label: "Rates and taxes",
        component: "Rates and taxes",
      });
      tabs.push({
        id: "others",
        label: "Other information",
        component: "Other information",
      });
    }

    return tabs;
  }, [module]);

  return (
    <>
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <CommonHeader
            titleContent={
              <div className="flex flex-col items-center justify-start gap-2 align-top md:flex-row">
                {!isEdit && module === "agreement" && (
                  <>
                    <Link
                      to={searchAgreementsRoute.fullPath}
                      className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                    >
                      Agreements
                    </Link>
                    <ChevronRightOutline
                      className="h-4 w-4 flex-shrink-0 text-gray-500"
                      aria-hidden="true"
                    />
                    <Link
                      to={addAgreementRoute.fullPath}
                      className="max-w-[230px] truncate text-xl leading-6 text-gray-800 md:max-w-full"
                      search={() => ({ stage })}
                    >
                      Add Agreement
                    </Link>
                  </>
                )}
                {isEdit && module === "agreement" && (
                  <>
                    <Link
                      to={searchAgreementsRoute.fullPath}
                      className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                    >
                      Agreements
                    </Link>
                    <ChevronRightOutline
                      className="h-4 w-4 flex-shrink-0 text-gray-500"
                      aria-hidden="true"
                    />
                    <Link
                      to={viewAgreementByIdRoute.fullPath}
                      params={{ agreementId: String(referenceId) }}
                      className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                    >
                      {referenceNumber ?? "-"}
                    </Link>
                    <ChevronRightOutline
                      className="h-4 w-4 flex-shrink-0 text-gray-500"
                      aria-hidden="true"
                    />
                    <Link
                      to={editAgreementByIdRoute.fullPath}
                      className="max-w-[230px] truncate text-xl leading-6 text-gray-800 md:max-w-full"
                      search={() => ({ stage })}
                      params={{ agreementId: String(referenceId) }}
                    >
                      Edit Agreement
                    </Link>
                  </>
                )}
                {!isEdit && module === "reservation" && (
                  <>
                    <Link
                      to={searchReservationsRoute.fullPath}
                      className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                    >
                      Reservations
                    </Link>
                    <ChevronRightOutline
                      className="h-4 w-4 flex-shrink-0 text-gray-500"
                      aria-hidden="true"
                    />
                    <Link
                      to={addReservationRoute.fullPath}
                      className="max-w-[230px] truncate text-xl leading-6 text-gray-800 md:max-w-full"
                      search={() => ({ stage })}
                    >
                      Add Reservation
                    </Link>
                  </>
                )}
                {isEdit && module === "reservation" && (
                  <>
                    <Link
                      to={searchReservationsRoute.fullPath}
                      className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                    >
                      Reservations
                    </Link>
                    <ChevronRightOutline
                      className="h-4 w-4 flex-shrink-0 text-gray-500"
                      aria-hidden="true"
                    />
                    <Link
                      to={viewReservationByIdRoute.fullPath}
                      params={{ reservationId: String(referenceId) }}
                      className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                    >
                      {referenceNumber ?? "-"}
                    </Link>
                    <ChevronRightOutline
                      className="h-4 w-4 flex-shrink-0 text-gray-500"
                      aria-hidden="true"
                    />
                    <Link
                      to={editReservationByIdRoute.fullPath}
                      className="max-w-[230px] truncate text-xl leading-6 text-gray-800 md:max-w-full"
                      search={() => ({ stage })}
                      params={{ reservationId: String(referenceId) }}
                    >
                      Edit Reservation
                    </Link>
                  </>
                )}
              </div>
            }
            subtitleText={
              module === "agreement" && isEdit
                ? "Edit the rental contract."
                : module === "agreement" && !isEdit
                ? "Create a new rental contract."
                : module === "reservation" && isEdit
                ? "Edit the reservation."
                : module === "reservation" && !isEdit
                ? "Create a new reservation."
                : ""
            }
            headerActionContent
            includeBottomBorder
          />
        </div>

        <div className="mx-auto px-4 sm:px-6 md:grid-cols-12 md:px-8">
          <div className="grid max-w-full grid-cols-1 gap-4 focus:ring-0 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-8">
              <ModuleTabs
                tabConfig={tabsConfig}
                startingIndex={getStartingIndexFromTabName(stage, tabsConfig)}
                onTabClick={handleStageTabClick}
              />
            </div>
            <div className="flex flex-col gap-4 py-4 lg:col-span-4">
              <RentalRatesSummary
                module={
                  module === "agreement"
                    ? "add-edit-agreement"
                    : "add-edit-reservation"
                }
                currency={clientProfile.data?.currency || undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRentalParentForm;
