import React from "react";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import { titleMaker } from "@/utils/title-maker";

import JsURLDecoder from "./JsURLDecoder";

const StylingAreaPage: React.FC = () => {
  useDocumentTitle(titleMaker("Styling Area"));

  return (
    <div className="overflow-y-auto bg-background px-2 text-foreground">
      <section className="py-10 md:mx-28">
        <h2 className="text-2xl">JSURL Utils</h2>
        <JsURLDecoder />
      </section>
    </div>
  );
};

export default StylingAreaPage;
