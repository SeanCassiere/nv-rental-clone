import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  getRouteApi,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";

import AddRentalParentForm from "@/components/add-rental";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { Container } from "@/routes/-components/container";

import { titleMaker } from "@/lib/utils/title-maker";

export const Route = createLazyFileRoute(
  "/_auth/(agreements)/agreements/$agreementId/check-in"
)({
  component: CheckinAgreementPage,
});

const routeApi = getRouteApi("/_auth/agreements/$agreementId/check-in");

function CheckinAgreementPage() {
  const navigate = useNavigate({ from: "/agreements/$agreementId/check-in" });
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
    navigate({
      to: "..",
    });
  }, [navigate]);

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
    <Container>
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
    </Container>
  );
}
