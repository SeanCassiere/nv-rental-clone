import { FileRouteLoader } from "@tanstack/react-router";

export const loader = FileRouteLoader("/agreements/$agreementId")(async ({
  context,
}) => {
  const {
    queryClient,
    viewAgreementExchangesOptions,
    viewAgreementNotesOptions,
    viewAgreementSummaryOptions,
    viewAgreementOptions,
    viewTab,
  } = context;
  const promises = [];

  promises.push(queryClient.ensureQueryData(viewAgreementOptions));

  switch (viewTab.trim().toLowerCase()) {
    case "exchanges":
      promises.push(queryClient.ensureQueryData(viewAgreementExchangesOptions));
      break;
    case "notes":
      promises.push(queryClient.ensureQueryData(viewAgreementNotesOptions));
      break;
    case "summary":
    default:
      promises.push(queryClient.ensureQueryData(viewAgreementSummaryOptions));
      break;
  }

  await Promise.all(promises);

  return;
});
