import { useEffect } from "react";
import { useParams, useRouter } from "@tanstack/react-router";

import AppShell from "../../components/app-shell";
import Protector from "../../routes/Protector";
import {
  ChevronLeftOutline,
  HamburgerMenuOutline,
} from "../../components/icons";
import { useGetModuleRentalRatesSummary } from "../../hooks/network/module/useGetModuleRentalRatesSummary";
import RentalRatesSummary from "../../components/PrimaryModule/ModuleSummary/RentalRatesSummary";
import { useGetClientProfile } from "../../hooks/network/client/useGetClientProfile";

function AgreementViewPage() {
  const router = useRouter();
  const params = useParams();

  const agreementId = params.agreementId || "";

  const rentalRatesSummary = useGetModuleRentalRatesSummary({
    module: "agreements",
    referenceId: agreementId,
  });

  const clientProfile = useGetClientProfile();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Protector>
      <AppShell>
        <div className="py-6">
          <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
            <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center md:gap-8">
              <div className="flex flex-row items-center gap-4 md:gap-8">
                <button
                  onClick={() => {
                    router.history.go(-1);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 font-semibold shadow"
                >
                  <ChevronLeftOutline className="h-7 w-7" />
                  <span className="sr-only">Go back</span>
                </button>
                <h1 className="truncate text-2xl font-semibold text-gray-900">
                  No.&nbsp;
                  <span className="text-gray-600">{agreementId}</span>
                </h1>
              </div>
              {/*  */}
              <div className="flex flex-row items-center justify-end gap-4 md:gap-8">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 font-semibold shadow"
                >
                  <HamburgerMenuOutline className="h-7 w-7" />
                  <span className="sr-only">Options</span>
                </button>
              </div>
            </div>
            <div className="mt-6 bg-white p-4">Agreement information modes</div>
          </div>

          <div className="mx-auto mt-6 grid max-w-full grid-cols-1 gap-4 px-4 sm:px-6 md:grid-cols-12 md:px-8">
            <div className="flex flex-col gap-4 md:col-span-7">
              <div className="bg-white">Agreement block 1</div>
              <div className="bg-white">Agreement block 2</div>
            </div>
            {/*  */}
            <div className="flex flex-col gap-4 md:col-span-5">
              <RentalRatesSummary
                module="agreements"
                summaryData={rentalRatesSummary.data}
                currency={clientProfile.data?.currency || undefined}
              />
            </div>
          </div>
        </div>
      </AppShell>
    </Protector>
  );
}

export default AgreementViewPage;
