import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputSelect,
  InputSelectContent,
  InputSelectTrigger,
} from "@/components/ui/input-select";
import { Switch } from "@/components/ui/switch";

import { usePermission } from "@/hooks/usePermission";

import {
  buildUpdateLocationSchema,
  type TLocationById,
  type UpdateLocationInput,
} from "@/schemas/location";

import type { Auth } from "@/utils/query/helpers";
import {
  fetchLocationByIdOptions,
  fetchLocationCountriesListOptions,
  fetchLocationsListOptions,
  fetchLocationStatesByCountryIdListOptions,
} from "@/utils/query/location";

type FormMode = "new" | "edit";

interface LocationEditDialogProps {
  mode: FormMode;
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

  const handleSubmitCreate = (data: UpdateLocationInput) => {
    console.log("🚀 ~ handleSubmitCreate ~ data:", data);
  };

  const handleSubmitEdit = (data: UpdateLocationInput) => {
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
            <br />
            Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>
        <LocationForm
          auth={auth}
          mode={props.mode}
          formId={formId}
          location={locationData}
          onSubmit={
            props.mode === "edit" ? handleSubmitEdit : handleSubmitCreate
          }
        />
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
  mode: FormMode;
  location: TLocationById;
  onSubmit: (data: UpdateLocationInput) => void;
}

function LocationForm(props: LocationFormProps) {
  const { location } = props;
  const { t } = useTranslation();

  const formSchema = React.useMemo(
    () =>
      buildUpdateLocationSchema({
        REQUIRED: t("display.required", { ns: "labels" }),
      }),
    [t]
  );
  const form = useForm<UpdateLocationInput>({
    resolver: zodResolver(formSchema),
    values: {
      clientId: props.auth.clientId,
      locationName: location.locationName || "",
      address1: location.address1 || "",
      address2: location.address2 || "",
      city: location.city || "",
      postal: location.postal || "",
      stateId: location.stateID || "0",
      countryId: location.countryId || "0",
      active: typeof location.active === "boolean" ? location.active : true,
      isReservation:
        typeof location.isReservation === "boolean"
          ? location.isReservation
          : false,
      contactName: location.contactName || "",
      phone: location.phone || "",
      email: location.email || "",
      emailName: location.emailName || "",
      longitude: location.longitude || 0,
      latitude: location.latitude || 0,
      parentLocationId: "0",
      bankDetails: {
        accountName: "",
        accountNumber: "",
        bankName: "",
        bankAddress: "",
        swiftCode: "",
      },
    },
  });

  const countryId = form.watch("countryId");

  const locationsQuery = useQuery(
    fetchLocationsListOptions({
      auth: props.auth,
      filters: { withActive: true },
    })
  );
  const countriesQuery = useQuery({
    ...fetchLocationCountriesListOptions({ auth: props.auth }),
  });
  const statesQuery = useQuery({
    ...fetchLocationStatesByCountryIdListOptions({
      auth: props.auth,
      countryId: countryId,
    }),
  });

  const locationsList = React.useMemo(() => {
    const list = [{ id: `location_0`, value: "0", label: "None" }];
    const items = (
      locationsQuery.data?.status === 200 ? locationsQuery.data?.body : []
    ).map((item) => ({
      id: `location_${item.locationId}`,
      value: item.locationId,
      label: item.locationName ?? item.locationId,
    }));
    return list.concat(items);
  }, [locationsQuery.data?.body, locationsQuery.data?.status]);
  const countriesList = React.useMemo(() => {
    const list = [{ id: `country_0`, value: "0", label: "Select a country" }];
    const items = (
      countriesQuery.data?.status === 200 ? countriesQuery.data.body : []
    ).map((item) => ({
      id: `country_${item.countryID}`,
      value: item.countryID,
      label: item.countryName,
    }));
    return list.concat(items);
  }, [countriesQuery.data?.body, countriesQuery.data?.status]);

  const statesList = React.useMemo(() => {
    const list = [{ id: `state_0`, value: "0", label: "Select a state" }];
    const items = (
      statesQuery.data?.status === 200 ? statesQuery.data.body : []
    ).map((item) => ({
      id: `state_${item.stateID}`,
      value: item.stateID,
      label: item.stateName,
    }));
    return list.concat(items);
  }, [statesQuery.data?.body, statesQuery.data?.status]);

  return (
    <Form {...form}>
      <form
        id={props.formId}
        className="flex grow-0 flex-col gap-4 px-1 pb-2"
        onSubmit={form.handleSubmit(
          (data) => {
            props.onSubmit(data);
          },
          (errors) => {
            console.log(
              "🚀 ~ location-edit-dialog.tsx onSubmit={form.handleSubmit ~ errors:",
              errors
            );
          }
        )}
      >
        <FormField
          control={form.control}
          name="locationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location name *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={"Location name"}
                  autoComplete="none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="address1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address 1 *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={"Address 1"}
                    autoComplete="none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address 2</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={"Address 2"}
                    autoComplete="none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={"City"} autoComplete="none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post code *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={"Post code"}
                    autoComplete="none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="countryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Country *{/* {t("display.role", { ns: "labels" })} */}
                </FormLabel>
                <InputSelect
                  placeholder={"Select a country"}
                  defaultValue={String(field.value)}
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue("stateId", "0");
                  }}
                  items={countriesList}
                >
                  <FormControl>
                    <InputSelectTrigger />
                  </FormControl>
                  <InputSelectContent />
                </InputSelect>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stateId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  State *{/* {t("display.role", { ns: "labels" })} */}
                </FormLabel>
                <InputSelect
                  placeholder={"Select a state"}
                  defaultValue={String(field.value)}
                  onValueChange={field.onChange}
                  items={statesList}
                >
                  <FormControl>
                    <InputSelectTrigger />
                  </FormControl>
                  <InputSelectContent />
                </InputSelect>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {props.mode === "new" ? (
          <FormField
            control={form.control}
            name="parentLocationId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Copy from previous location?
                  {/* {t("display.role", { ns: "labels" })} */}
                </FormLabel>
                <InputSelect
                  placeholder={"Select a location"}
                  defaultValue={String(field.value)}
                  onValueChange={field.onChange}
                  items={locationsList}
                >
                  <FormControl>
                    <InputSelectTrigger />
                  </FormControl>
                  <InputSelectContent />
                </InputSelect>
                <FormDescription>
                  You have the option to select a location and effortlessly
                  replicate the current rental rates, miscellaneous charges, and
                  taxes to the desired new location.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="mt-2 flex flex-row items-center justify-between gap-1 rounded-lg border bg-background p-4">
              <div className="space-y-0.5">
                <FormLabel>Available for use?</FormLabel>
                <FormDescription>
                  Indicate if the location is active and available for use.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isReservation"
          render={({ field }) => (
            <FormItem className="mt-2 flex flex-row items-center justify-between gap-1 rounded-lg border bg-background p-4">
              <div className="space-y-0.5">
                <FormLabel>Available for online reservations?</FormLabel>
                <FormDescription>
                  Indicate if the fleet from this location will be available for
                  online bookings.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder={"Email address"}
                    autoComplete="none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emailName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email name *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={"Email name"}
                    autoComplete="none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={"Contact name"}
                    autoComplete="none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone no.</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={"Phone no."}
                    autoComplete="none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
