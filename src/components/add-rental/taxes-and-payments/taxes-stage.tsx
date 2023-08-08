import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { TaxesAndPaymentsTabProps } from ".";

import { useGetTaxes } from "@/hooks/network/taxes/useGetTaxes";

import { cn } from "@/utils";

interface TaxesStageProps {
  isEdit: boolean;
  durationStageData: TaxesAndPaymentsTabProps["durationStageData"];

  taxes: TaxesAndPaymentsTabProps["selectedTaxes"];
  onSelectedTaxes: TaxesAndPaymentsTabProps["onSelectedTaxes"];

  onCompleted: () => void;
}

export const TaxesStage = (props: TaxesStageProps) => {
  const { durationStageData, taxes, onSelectedTaxes, onCompleted } = props;

  const isSupportingInfoAvailable = Boolean(durationStageData);

  const [selectedTaxes, setSelectedTaxes] =
    useState<TaxesStageProps["taxes"]>(taxes);

  const taxesData = useGetTaxes({
    filters: {
      LocationId: Number(durationStageData?.checkoutLocation ?? 0).toString(),
    },
    enabled: isSupportingInfoAvailable,
  });

  const loadedTaxes = taxesData.data?.status === 200 ? taxesData.data.body : [];

  const mandatoryTaxes = loadedTaxes
    .filter((tax) => tax.isOptional === false)
    .map((tax) => tax.id);

  return (
    <>
      <div>
        {!isSupportingInfoAvailable && (
          <div className="text-destructive">
            Checkout location is required to be able to add taxes.
          </div>
        )}
        <div className="grid grid-cols-1 items-center md:grid-cols-3">
          {loadedTaxes
            .sort((tax1, tax2) => tax1.id - tax2.id)
            .map((tax, idx) => (
              <div
                key={`${tax.id}-${idx}`}
                className="flex items-center justify-start gap-2"
              >
                <input
                  type="checkbox"
                  checked={selectedTaxes.includes(tax.id)}
                  onChange={(evt) => {
                    const checked = evt.target.checked;
                    setSelectedTaxes((prev) => {
                      const withoutId = prev.filter((id) => id !== tax.id);
                      if (checked) {
                        return withoutId.concat(tax.id);
                      }
                      return withoutId;
                    });
                  }}
                  id={`${tax.id}-${idx}-${tax.name}`}
                  disabled={mandatoryTaxes.includes(tax.id)}
                  className="rounded text-teal-500 focus:outline-teal-500 disabled:cursor-not-allowed disabled:text-slate-400"
                />
                <label
                  htmlFor={`${tax.id}-${idx}-${tax.name}`}
                  className={cn(
                    "",
                    mandatoryTaxes.includes(tax.id)
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  )}
                >
                  {tax.name}
                </label>
              </div>
            ))}
        </div>
        <div className="mt-4">
          <Button
            color="teal"
            onClick={() => {
              onSelectedTaxes(selectedTaxes);
              onCompleted();
            }}
          >
            Save & Continue
          </Button>
        </div>
      </div>
    </>
  );
};
