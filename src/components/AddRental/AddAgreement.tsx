import { Link } from "@tanstack/react-router";

import { ChevronRightOutline } from "../icons";
import CommonHeader from "../Layout/CommonHeader";
import { RentalRatesSummary } from "../PrimaryModule/ModuleSummary/RentalRatesSummary";

import { useGetClientProfile } from "../../hooks/network/client/useGetClientProfile";
import { initialRentalSummaryData } from "../../hooks/network/module/useGetModuleRentalRatesSummary";
import { addAgreementRoute } from "../../routes/agreements/addAgreement";
import { searchAgreementsRoute } from "../../routes/agreements/searchAgreements";

const AddAgreement = ({ agreementId }: { agreementId: number | string }) => {
  const clientProfile = useGetClientProfile();

  const isEdit = Boolean(agreementId);

  return (
    <>
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <CommonHeader
            titleContent={
              <div className="flex items-center gap-2">
                {!isEdit && (
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
                    >
                      Add Agreement
                    </Link>
                  </>
                )}
                {isEdit && (
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
                      className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                    >
                      RT-999
                    </Link>
                    <ChevronRightOutline
                      className="h-4 w-4 flex-shrink-0 text-gray-500"
                      aria-hidden="true"
                    />
                    <Link
                      to={addAgreementRoute.fullPath}
                      className="max-w-[230px] truncate text-xl leading-6 text-gray-800 md:max-w-full"
                    >
                      Edit Agreement
                    </Link>
                  </>
                )}
              </div>
            }
            subtitleText={
              isEdit
                ? "Edit the rental contract"
                : "Create a new rental contract."
            }
            headerActionContent
            includeBottomBorder
          />
        </div>

        <div className="mx-auto py-4 px-4 sm:px-6 md:grid-cols-12 md:px-8">
          <div className="grid max-w-full grid-cols-1 gap-4 focus:ring-0 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-8">
              <div>Hello</div>
            </div>
            <div className="flex flex-col gap-4 lg:col-span-4">
              <RentalRatesSummary
                module="add-edit-agreement"
                summaryData={initialRentalSummaryData()}
                currency={clientProfile.data?.currency || undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAgreement;
