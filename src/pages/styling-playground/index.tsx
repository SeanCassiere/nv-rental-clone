import React from "react";

import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";
import { titleMaker } from "@/utils/title-maker";
import JsURLDecoder from "./JsURLDecoder";

const StylingAreaPage: React.FC = () => {
  useDocumentTitle(titleMaker("Styling Area"));

  return (
    <div className="h-full divide-y-2 divide-slate-200 overflow-y-auto bg-slate-50 px-2">
      <section className="py-10 md:mx-28">
        <h2 className="text-2xl">JSURL Utils</h2>
        <JsURLDecoder />
      </section>
    </div>
  );
};

export default StylingAreaPage;
