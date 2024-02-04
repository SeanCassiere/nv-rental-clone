import React from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { usePermission } from "@/hooks/usePermission";

import type { TLocationById } from "@/schemas/location";

import type { Auth } from "@/utils/query/helpers";
import {
  fetchLocationByIdOptions,
  fetchLocationCountriesListOptions,
  fetchLocationStatesByCountryIdListOptions,
} from "@/utils/query/location";

interface LocationEditDialogProps {
  mode: "new" | "edit";
  open: boolean;
  setOpen: (open: boolean) => void;
  clientId: string;
  userId: string;
  locationId: string;
  countryId: string;
  countryName: string;
  stateId: string;
  stateName: string;
}

export function LocationEditDialog(props: LocationEditDialogProps) {
  const { open, setOpen } = props;
  const auth = { clientId: props.clientId, userId: props.userId };
  const { t } = useTranslation();

  const canCreateLocations = usePermission("VIEW_ADMIN_TAB");

  const locationQuery = useQuery({
    ...fetchLocationByIdOptions({
      auth: { clientId: props.clientId, userId: props.userId },
      locationId: props.locationId,
    }),
    enabled: open && props.mode === "edit" && props.locationId !== "0",
  });

  const locationData: TLocationById = React.useMemo(
    function makeInitialLocationData() {
      if (
        (props.mode === "edit" && props.locationId && props.locationId !== "0",
        locationQuery.data?.status === 200)
      ) {
        return locationQuery.data.body;
      }

      return {
        locationId: "",
        stateName: "",
        locationName: "",
        address1: "",
        address2: "",
        city: "",
        countryName: props.countryName,
        countryId: props.countryId,
        stateID: props.stateId,
        stateCode: props.stateName,
        postal: "",
        latitude: 0,
        longitude: 0,
        contactName: "",
        phone: "",
        email: "",
        emailName: "",
        active: true,
        isReservation: false,
      };
    },
    [
      locationQuery.data?.body,
      locationQuery.data?.status,
      props.countryId,
      props.countryName,
      props.locationId,
      props.mode,
      props.stateId,
      props.stateName,
    ]
  );

  const formId = React.useId();

  const handleSubmitCreate = (data: TLocationById) => {
    console.log("🚀 ~ handleSubmitCreate ~ data:", data);
  };

  const handleSubmitEdit = (data: TLocationById) => {
    console.log("🚀 ~ handleSubmitEdit ~ data:", data);
  };

  const createModeDisabled = !canCreateLocations;
  const editModeDisabled = !canCreateLocations;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {props.mode === "edit"
              ? t("titles.editLocation", {
                  ns: "settings",
                })
              : t("titles.newLocation", {
                  ns: "settings",
                })}
          </DialogTitle>
          <DialogDescription>
            {props.mode === "edit"
              ? t("descriptions.editLocation", {
                  ns: "settings",
                })
              : t("descriptions.newLocation", {
                  ns: "settings",
                })}
          </DialogDescription>
        </DialogHeader>
        <React.Suspense fallback={<Skeleton className="h-[400px]" />}>
          <LocationForm
            formId={formId}
            auth={auth}
            location={locationData}
            onSubmit={
              props.mode === "edit" ? handleSubmitEdit : handleSubmitCreate
            }
          />
        </React.Suspense>
        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            type="button"
            onClick={() => setOpen(false)}
            disabled={
              props.mode === "edit" ? editModeDisabled : createModeDisabled
            }
            aria-disabled={
              props.mode === "edit" ? editModeDisabled : createModeDisabled
            }
          >
            {t("buttons.cancel", { ns: "labels" })}
          </Button>
          <Button
            type="submit"
            form={formId}
            aria-disabled={
              props.mode === "edit" ? editModeDisabled : createModeDisabled
            }
          >
            {/* {isUpdateMutationActive && (
              <icons.Loading className="mr-2 h-4 w-4 animate-spin" />
            )} */}
            {props.mode === "edit"
              ? t("buttons.saveChanges", { ns: "labels" })
              : t("buttons.save", { ns: "labels" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface LocationFormProps extends Auth {
  formId: string;
  location: TLocationById;
  onSubmit: (data: TLocationById) => void;
}

function LocationForm(props: LocationFormProps) {
  const countryId = props.location.countryId;

  const countriesQuery = useSuspenseQuery({
    ...fetchLocationCountriesListOptions({ auth: props.auth }),
  });
  const statesQuery = useSuspenseQuery({
    ...fetchLocationStatesByCountryIdListOptions({
      auth: props.auth,
      countryId: countryId,
    }),
  });

  const countriesList =
    countriesQuery.data?.status === 200 ? countriesQuery.data.body : [];
  const statesList =
    statesQuery.data?.status === 200 ? statesQuery.data.body : [];

  return (
    <form className="max-w-full overflow-x-hidden">
      <code>
        <p>Location</p>
        <pre>{JSON.stringify(props.location, null, 2)}</pre>
      </code>
      <code className="text-xs">
        <p>Countries</p>
        <pre>{JSON.stringify(countriesList, null, 2)}</pre>
      </code>
      <code className="text-xs">
        <p>States</p>
        <pre>{JSON.stringify(statesList, null, 2)}</pre>
      </code>
    </form>
  );
}
