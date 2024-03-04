import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

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
import { icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
  InputSelect,
  InputSelectContent,
  InputSelectTrigger,
} from "@/components/ui/input-select";
import { Switch } from "@/components/ui/switch";

import { usePermission } from "@/lib/hooks/usePermission";

import {
  buildUpdateLocationSchema,
  type TLocationById,
  type UpdateLocationInput,
} from "@/lib/schemas/location";
import type { Auth } from "@/lib/query/helpers";
import {
  createLocationMutationOptions,
  fetchLocationByIdOptions,
  fetchLocationCountriesListOptions,
  fetchLocationsListOptions,
  fetchLocationStatesByCountryIdListOptions,
  updateLocationMutationOptions,
} from "@/lib/query/location";

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

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const canCreateLocations = usePermission("VIEW_ADMIN_TAB");

  const locationsQueryOptions = React.useMemo(
    () =>
      fetchLocationByIdOptions({
        auth: { clientId: props.clientId, userId: props.userId },
        locationId: props.locationId,
      }),
    [props.clientId, props.locationId, props.userId]
  );

  const locationsQueryKey: string[] = [
    locationsQueryOptions.queryKey[0],
    locationsQueryOptions.queryKey[1],
  ];

  const locationQuery = useQuery({
    ...locationsQueryOptions,
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

  const update = useMutation({
    ...updateLocationMutationOptions({ locationId: props.locationId }),
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: locationsQueryKey });
    },
    onError: (error, variables, context) => {
      const message =
        "message" in error
          ? error.message
          : t("somethingWentWrong", { ns: "messages" });
      console.error("🚀 ~ updateLocationMutationOptions ~ error:", message, {
        error,
        variables,
        context,
      });
      toast.error(message);
    },
    onSuccess: (response, variables) => {
      if (response.status === 200) {
        toast.success(
          t("labelUpdated", {
            ns: "messages",
            label: variables.body.locationName,
          })
        );
        setOpen(false);
        return;
      }
      toast.error(t("somethingWentWrong", { ns: "messages" }));
      console.error("🚀 ~ updateLocationMutationOptions ~ error:", response);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: locationsQueryKey });
    },
  });
  const handleSubmitEdit = (data: UpdateLocationInput) => {
    if (update.isPending) return;
    update.mutate({
      params: { locationId: props.locationId },
      body: { ...data, lastUpdatedBy: auth.userId },
    });
  };

  const create = useMutation({
    ...createLocationMutationOptions(),
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: locationsQueryKey });
    },
    onError: (error, variables, context) => {
      const message =
        "message" in error
          ? error.message
          : t("somethingWentWrong", { ns: "messages" });
      console.error("🚀 ~ createLocationMutationOptions ~ error:", message, {
        error,
        variables,
        context,
      });
      toast.error(message);
    },
    onSuccess: (response, variables) => {
      if (response.status === 200) {
        toast.success(
          t("labelCreated", {
            ns: "messages",
            label: variables.body.locationName,
          })
        );
        setOpen(false);
        return;
      }
      toast.error(t("somethingWentWrong", { ns: "messages" }));
      console.error("🚀 ~ createLocationMutationOptions ~ error:", response);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: locationsQueryKey });
    },
  });
  const handleSubmitCreate = (data: UpdateLocationInput) => {
    if (create.isPending) return;
    create.mutate({ body: { ...data, lastUpdatedBy: auth.userId } });
  };

  const createModeDisabled = !canCreateLocations;
  const editModeDisabled = !canCreateLocations;

  const isSubmitting = update.isPending || create.isPending;

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
            {t("requiredFieldsAreMarkedByAnAsterisk", { ns: "messages" })}
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
            {isSubmitting && (
              <icons.Loading className="mr-2 h-4 w-4 animate-spin" />
            )}
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
        NOT_VALID_EMAIL: t("invalidEmailAddress", { ns: "messages" }),
      }),
    [t]
  );
  const form = useForm<UpdateLocationInput>({
    resolver: zodResolver(formSchema),
    values: {
      clientId: props.auth.clientId,
      lastUpdatedBy: "0",
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
    const list = [
      {
        id: `location_0`,
        value: "0",
        label: t("display.selectLocation", { ns: "labels" }),
      },
    ];
    const items = (
      locationsQuery.data?.status === 200 ? locationsQuery.data?.body : []
    ).map((item) => ({
      id: `location_${item.locationId}`,
      value: item.locationId,
      label: item.locationName ?? item.locationId,
    }));
    return list.concat(items);
  }, [locationsQuery.data?.body, locationsQuery.data?.status, t]);
  const countriesList = React.useMemo(() => {
    const list = [
      {
        id: `country_0`,
        value: "0",
        label: t("display.selectCountry", { ns: "labels" }),
      },
    ];
    const items = (
      countriesQuery.data?.status === 200 ? countriesQuery.data.body : []
    ).map((item) => ({
      id: `country_${item.countryID}`,
      value: item.countryID,
      label: item.countryName,
    }));
    return list.concat(items);
  }, [countriesQuery.data?.body, countriesQuery.data?.status, t]);

  const statesList = React.useMemo(() => {
    const list = [
      {
        id: `state_0`,
        value: "0",
        label: t("display.selectState", { ns: "labels" }),
      },
    ];
    const items = (
      statesQuery.data?.status === 200 ? statesQuery.data.body : []
    ).map((item) => ({
      id: `state_${item.stateID}`,
      value: item.stateID,
      label: item.stateName,
    }));
    return list.concat(items);
  }, [statesQuery.data?.body, statesQuery.data?.status, t]);

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
              <FormLabel>
                {t("display.locationName", { ns: "labels" })} *
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("display.locationName", { ns: "labels" })}
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
                <FormLabel>
                  {t("display.address1", { ns: "labels" })} *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("display.address1", { ns: "labels" })}
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
                <FormLabel>{t("display.address2", { ns: "labels" })}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("display.address2", { ns: "labels" })}
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
                <FormLabel>{t("display.city", { ns: "labels" })} *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("display.city", { ns: "labels" })}
                    autoComplete="none"
                  />
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
                <FormLabel>
                  {t("display.zipCode", { ns: "labels" })} *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("display.zipCode", { ns: "labels" })}
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
                  {t("display.country", { ns: "labels" })} *
                </FormLabel>
                <InputSelect
                  placeholder={t("display.selectCountry", { ns: "labels" })}
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
                <FormLabel>{t("display.state", { ns: "labels" })} *</FormLabel>
                <InputSelect
                  placeholder={t("display.selectState", { ns: "labels" })}
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
                  {t("labels.copyFromPreviousLocation", { ns: "settings" })}
                </FormLabel>
                <InputSelect
                  placeholder={t("display.selectLocation", { ns: "labels" })}
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
                  {t("descriptions.locationCopyConfigurations", {
                    ns: "settings",
                  })}
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
                <FormLabel>
                  {t("labels.availableForUse", { ns: "settings" })}
                </FormLabel>
                <FormDescription>
                  {t("descriptions.locationIndicateAvailableForUse", {
                    ns: "settings",
                  })}
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
                <FormLabel>
                  {t("labels.availableForOnlineReservations", {
                    ns: "settings",
                  })}
                </FormLabel>
                <FormDescription>
                  {t(
                    "descriptions.locationIndicateAvailableForOnlineReservations",
                    {
                      ns: "settings",
                    }
                  )}
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
                <FormLabel>
                  {t("labels.emailAddress", { ns: "settings" })} *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder={t("labels.emailAddress", { ns: "settings" })}
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
                <FormLabel>
                  {t("labels.emailName", { ns: "settings" })} *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("labels.emailName", { ns: "settings" })}
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
                <FormLabel>
                  {t("display.contactName", { ns: "labels" })}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("display.contactName", { ns: "labels" })}
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
                <FormLabel>{t("display.phoneNo", { ns: "labels" })}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("display.phoneNo", { ns: "labels" })}
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
