import React from "react";

import { viewReportByIdRoute } from "@/routes/reports/report-id-route";

const ViewReportPage: (typeof viewReportByIdRoute)["options"]["component"] = ({
  useParams,
}) => {
  const { reportId } = useParams();
  return <div>view-report {reportId}</div>;
};

export default ViewReportPage;
