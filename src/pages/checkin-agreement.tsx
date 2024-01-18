import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { RouteApi, useNavigate, useRouter } from "@tanstack/react-router";

import AddRentalParentForm from "@/components/add-rental";
import ProtectorShield from "@/components/protector-shield";

import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import { checkinAgreementByIdRoute } from "@/routes/agreements/agreement-id-route";

import { titleMaker } from "@/utils/title-maker";

const routeApi = new RouteApi({ id: "/agreements/$agreementId/check-in" });

const CheckinAgreementPage = () => {
  const navigate = useNavigate({ from: checkinAgreementByIdRoute.id });
  const router = useRouter();

  const routeContext = routeApi.useRouteContext();
  const { stage = "rental-information" } = routeApi.useSearch();
  const { agreementId } = routeApi.useParams();

  const agreementData = useQuery(routeContext.viewAgreementOptions);

  const rentalRatesSummary = useQuery(routeContext.viewAgreementSummaryOptions);
  const summaryData =
    rentalRatesSummary.data?.status === 200
      ? rentalRatesSummary.data?.body
      : undefined;

  const handleStageTabClick = useCallback(
    (destination: string) => {
      navigate({
        search: () => ({ stage: destination }),
        params: { agreementId },
      });
    },
    [agreementId, navigate]
  );

  const handleAgreementSaveComplete = useCallback(() => {
    navigate({
      to: "/agreements/$agreementId",
      params: { agreementId },
      search: () => ({ tab: "summary" }),
    });
  }, [agreementId, navigate]);

  const handleCancelEditAgreement = useCallback(() => {
    router.navigate({
      to: "..",
    });
  }, [router]);

  const agreement =
    agreementData.data?.status === 200 ? agreementData.data.body : null;

  useDocumentTitle(
    titleMaker(
      `Check-in - ${agreement?.agreementNumber || "Loading"} - Agreement`
    )
  );

  useEffect(() => {
    if (agreementData.status !== "error") return;

    router.history.go(-1);
  }, [router.history, agreementData.status]);

  return (
    <ProtectorShield>
      <AddRentalParentForm
        referenceId={parseInt(agreementId)}
        currentStage={stage}
        module="agreement"
        onStageTabClick={handleStageTabClick}
        onRentalSaveClick={handleAgreementSaveComplete}
        onRentalCancelClick={handleCancelEditAgreement}
        referenceNumber={agreement?.agreementNumber || undefined}
        summaryData={summaryData}
        isCheckin
      />
    </ProtectorShield>
  );
};

export default CheckinAgreementPage;
