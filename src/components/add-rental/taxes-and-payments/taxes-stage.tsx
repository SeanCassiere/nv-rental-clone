import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

import { Button } from "@/components/ui/button";
import { InputCheckbox } from "@/components/ui/input-checkbox";

import { getAuthFromAuthHook } from "@/utils/auth";
import { fetchTaxesListOptions } from "@/utils/query/tax";

import type { TaxesAndPaymentsTabProps } from ".";

interface TaxesStageProps {
  isEdit: boolean;
  durationStageData: TaxesAndPaymentsTabProps["durationStageData"];

  taxes: TaxesAndPaymentsTabProps["selectedTaxes"];
  onSelectedTaxes: TaxesAndPaymentsTabProps["onSelectedTaxes"];

  onCompleted: () => void;
}

export const TaxesStage = (props: TaxesStageProps) => {
  const { durationStageData, taxes, onSelectedTaxes, onCompleted } = props;
  const { t } = useTranslation();
  const auth = useAuth();
  const authParams = getAuthFromAuthHook(auth);

  const isSupportingInfoAvailable = Boolean(durationStageData);

  const [selectedTaxes, setSelectedTaxes] =
    useState<TaxesStageProps["taxes"]>(taxes);

  const taxesData = useQuery(
    fetchTaxesListOptions({
      auth: authParams,
      enabled: isSupportingInfoAvailable,
      filters: {
        LocationId: Number(durationStageData?.checkoutLocation ?? 0).toString(),
      },
    })
  );

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
              <InputCheckbox
                key={`${tax.id}-${idx}`}
                checked={selectedTaxes.includes(tax.id)}
                onCheckedChange={(checked) => {
                  setSelectedTaxes((prev) => {
                    const withoutId = prev.filter((id) => id !== tax.id);
                    if (checked) {
                      return withoutId.concat(tax.id);
                    }
                    return withoutId;
                  });
                }}
                label={tax.name}
                disabled={mandatoryTaxes.includes(tax.id)}
              />
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
            {t("buttons.saveAndContinue", { ns: "labels" })}
          </Button>
        </div>
      </div>
    </>
  );
};
