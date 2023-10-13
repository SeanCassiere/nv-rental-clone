import React from "react";

import { useReportContext } from "@/hooks/context/view-report";

const JsonView = () => {
  const { resultState } = useReportContext();

  return (
    <section className="mx-2 mb-4 mt-4 max-w-full sm:mx-5">
      <p className="mb-4">JsonPresentationView</p>
      <pre className="max-w-xs overflow-x-scroll text-sm sm:max-w-lg">
        {JSON.stringify(resultState.rows, null, 2)}
      </pre>
    </section>
  );
};

export default JsonView;
