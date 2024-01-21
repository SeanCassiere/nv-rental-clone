import { FileRouteLoader } from "@tanstack/react-router";

export const loader = FileRouteLoader("/reports/$reportId")(async ({
  context,
}) => {
  const { queryClient, searchReportByIdOptions } = context;

  if (!context.auth.isAuthenticated) return;

  await queryClient.ensureQueryData(searchReportByIdOptions);

  return;
});
