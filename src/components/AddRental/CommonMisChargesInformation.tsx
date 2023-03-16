import { useCallback, useState } from "react";
import classNames from "classnames";

import { type StepRatesAndChargesInformationProps } from "./StepRatesAndChargesInformation";
import { Button } from "../Form";
import { useGetMiscCharges } from "../../hooks/network/misc-charges/useGetMiscCharges";
import { type MiscChargeListItem } from "../../utils/schemas/misCharges";

interface CommonMiscChargesInformationProps {
  module: StepRatesAndChargesInformationProps["module"];
  isEdit: StepRatesAndChargesInformationProps["isEdit"];
  rentalInformation: StepRatesAndChargesInformationProps["rentalInformation"];
  vehicleInformation: StepRatesAndChargesInformationProps["vehicleInformation"];

  selectedMisCharges: StepRatesAndChargesInformationProps["misCharges"];
  onSaveMisCharges: StepRatesAndChargesInformationProps["onSelectedMiscCharges"];

  isSupportingInfoAvailable: boolean;

  onNavigateNext: () => void;
}

const CommonMiscChargesInformation = (
  props: CommonMiscChargesInformationProps
) => {
  const {
    onNavigateNext,
    onSaveMisCharges,
    selectedMisCharges,
    rentalInformation,
    vehicleInformation,
    isSupportingInfoAvailable,
  } = props;
  const [charges, setCharges] =
    useState<StepRatesAndChargesInformationProps["misCharges"]>(
      selectedMisCharges
    );

  const selectedChargeIds = charges.map((charge) => `${charge.id}`);

  const miscCharges = useGetMiscCharges({
    filters: {
      VehicleTypeId: vehicleInformation?.vehicleTypeId ?? 0,
      LocationId: rentalInformation?.checkoutLocation ?? 0,
      CheckoutDate: rentalInformation?.checkoutDate ?? new Date(),
      CheckinDate: rentalInformation?.checkinDate ?? new Date(),
    },
    enabled:
      Boolean(rentalInformation?.checkinDate) &&
      Boolean(rentalInformation?.checkoutDate) &&
      Boolean(rentalInformation?.checkoutLocation) &&
      Boolean(vehicleInformation?.vehicleTypeId),
  });

  const handleAddMiscCharge = (
    charge: StepRatesAndChargesInformationProps["misCharges"][number]
  ) => {
    setCharges((previousCharges) => {
      const chargesWithoutSameId = previousCharges.filter(
        (prevCharge) => prevCharge.id !== charge.id
      );
      return [...chargesWithoutSameId, charge];
    });
  };
  const handleRemoveMiscCharge = (chargeId: number) => {
    setCharges((previousCharges) => {
      return previousCharges.filter((prevCharge) => prevCharge.id !== chargeId);
    });
  };

  return (
    <div className="mx-4 my-4">
      {miscCharges.isLoading && <span>Loading...</span>}
      {!isSupportingInfoAvailable && (
        <span>Please fill out the previous steps</span>
      )}
      <div className="grid gap-2">
        {(miscCharges.data || []).map((charge, idx) => (
          <MiscChargeItem
            key={`${charge.Id}-${idx}-${charge.Name}`}
            charge={charge}
            isSelected={selectedChargeIds.includes(`${charge.Id}`)}
            selectedCharge={charges.find((chg) => chg.id === charge.Id)}
            onSave={handleAddMiscCharge}
            onRemove={handleRemoveMiscCharge}
            dates={{
              startDate: rentalInformation?.checkoutDate ?? new Date(),
              endDate: rentalInformation?.checkinDate ?? new Date(),
            }}
          />
        ))}
      </div>
      <div className="mt-4">
        <Button
          type="button"
          color="teal"
          onClick={() => {
            onSaveMisCharges(charges);
            onNavigateNext();
          }}
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
};

export default CommonMiscChargesInformation;

function MiscChargeItem(props: {
  charge: MiscChargeListItem;
  isSelected: boolean;
  selectedCharge?: StepRatesAndChargesInformationProps["misCharges"][number];
  onSave: (
    charge: StepRatesAndChargesInformationProps["misCharges"][number]
  ) => void;
  onRemove: (chargeId: number) => void;
  dates: { startDate: Date; endDate: Date };
}) {
  const { charge, isSelected, selectedCharge, onSave, dates, onRemove } = props;
  const [qty, setQty] = useState(
    isSelected && selectedCharge ? selectedCharge.quantity : 1
  );
  const [price, setPrice] = useState(
    isSelected && selectedCharge ? selectedCharge.value : charge.Total ?? 0
  );
  const [optionId, setOptionId] = useState(
    isSelected && selectedCharge ? selectedCharge.optionId : 0
  );

  const save = useCallback(
    ({
      optionIdToSave,
      priceToSave,
      qtyToSave,
    }: {
      optionIdToSave: number;
      priceToSave: number;
      qtyToSave: number;
    }) => {
      let saveOptionId = optionIdToSave;
      let savePrice = priceToSave;

      if (
        saveOptionId === 0 &&
        charge.IsDeductible &&
        charge.Options &&
        charge.Options?.length > 0
      ) {
        const firstOption = charge.Options[0];
        if (firstOption) {
          saveOptionId = firstOption.miscChargeOptionId;
          setOptionId(saveOptionId);

          savePrice = firstOption.value ?? 0;
          setPrice(savePrice);
        }
      }

      onSave({
        id: charge.Id,
        locationMiscChargeId: charge.LocationMiscChargeID ?? 0,
        quantity: qtyToSave,
        startDate: dates.startDate.toISOString(),
        endDate: dates.endDate.toISOString(),
        optionId: saveOptionId,
        isSelected: true,
        value: savePrice,
        unit: 0,
        isTaxable: charge.IsTaxable ?? false,
      });
    },
    [charge, dates, onSave]
  );

  const handleRemove = () => {
    onRemove(charge.Id);
    setPrice(charge.Total ?? 0);
    setOptionId(0);
    setQty(1);
  };

  return (
    <div className="grid grid-cols-4 items-center md:w-11/12 md:grid-cols-12">
      <div className="col-span-1 md:col-span-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(evt) => {
            evt.target.checked
              ? save({
                  optionIdToSave: optionId,
                  priceToSave: price,
                  qtyToSave: qty,
                })
              : handleRemove();
          }}
        />
      </div>
      <div className="col-span-3 md:col-span-8">{charge.Name}</div>
      <div
        className={classNames(
          "col-span-4 flex items-center px-4 md:col-span-3",
          charge.IsQuantity ? "justify-between" : "justify-end"
        )}
      >
        {charge.IsQuantity && (
          <>
            <input
              type="number"
              value={qty}
              onChange={(evt) => {
                setQty(Number(evt.target.value));
                if (isSelected) {
                  save({
                    optionIdToSave: optionId,
                    priceToSave: price,
                    qtyToSave: Number(evt.target.value),
                  });
                }
              }}
              className="w-20"
            />
            <span className="block">X</span>
          </>
        )}
        <input
          type="number"
          value={price}
          onChange={(evt) => {
            setPrice(Number(evt.target.value));
            if (isSelected) {
              save({
                optionIdToSave: optionId,
                priceToSave: Number(evt.target.value),
                qtyToSave: qty,
              });
            }
          }}
          className="w-20"
        />
      </div>
      {charge.IsDeductible && charge.Options?.length && (
        <>
          <span className="hidden md:block" />
          <div className="col-span-4 grid md:col-span-11">
            {charge.Options.map((option, idx) => (
              <div
                key={`${option.miscChargeOptionId}-${idx}`}
                className={classNames(
                  "flex items-center gap-2",
                  option.miscChargeOptionId === optionId ? "text-red-500" : ""
                )}
              >
                <input
                  type="radio"
                  id={`${charge.Id}-${option.miscChargeOptionId}`}
                  name={`${charge.Id}-${charge.Name}`}
                  value={option.miscChargeOptionId}
                  checked={optionId === option.miscChargeOptionId}
                  onChange={() => {
                    setOptionId(option.miscChargeOptionId);
                    setPrice(option.value ?? 0);
                    save({
                      optionIdToSave: option.miscChargeOptionId,
                      priceToSave: option.value ?? 0,
                      qtyToSave: qty,
                    });
                  }}
                  disabled={!isSelected}
                />
                <div>
                  <label htmlFor={`${charge.Id}-${option.miscChargeOptionId}`}>
                    {option.name}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
