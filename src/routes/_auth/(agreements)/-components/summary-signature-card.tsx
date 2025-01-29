import * as React from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import ReactSignatureCanvas from "react-signature-canvas";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { icons } from "@/components/ui/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

import { useDatePreference } from "@/lib/hooks/useDatePreferences";

import type { AgreementDataParsed } from "@/lib/schemas/agreement";
import type { DigitalSignatureDriver } from "@/lib/schemas/digital-signature/driverList";
import {
  getAgreementAdditionalDriverDigSigUrlOptions,
  getAgreementCustomerDigSigUrlOptions,
  getDigSigDriversListOptions,
} from "@/lib/query/digitalSignature";
import type { Auth } from "@/lib/query/helpers";

import { format } from "@/lib/config/date-fns";

import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function SummarySignatureCard(
  props: {
    agreement: AgreementDataParsed;
    drivers: DigitalSignatureDriver[];
    isCheckin: boolean;
  } & Auth
) {
  const agreementId = props.agreement.agreementId.toString();
  const drivers = props.drivers.sort((a, b) => a.driverType - b.driverType);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-4">
        <CardTitle className="text-base font-medium sm:text-lg">
          Driver {drivers.length > 1 ? "signatures" : "signature"}
        </CardTitle>
        <span>
          <icons.Signature className="h-5 w-5" />
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {drivers.map((driver, index) => (
            <React.Fragment
              key={`${agreementId}_${driver.driverId || "no-driver-id"}`}
            >
              {index === 0 ? (
                <React.Suspense
                  fallback={
                    <li className="h-24 w-full p-2">
                      <Skeleton className="h-full w-full" />
                    </li>
                  }
                >
                  <PrimaryDriverSignatureImage
                    driver={driver}
                    auth={props.auth}
                    agreementId={agreementId}
                    stage={props.isCheckin ? "checkin" : "checkout"}
                  />
                </React.Suspense>
              ) : null}
              <React.Suspense
                fallback={
                  <li className="h-24 w-full p-2">
                    <Skeleton className="h-full w-full" />
                  </li>
                }
              >
                {driver.customerId === props.agreement.customerId ? (
                  <DriverController
                    driver={driver}
                    auth={props.auth}
                    agreementId={agreementId}
                    stage={props.isCheckin ? "checkin" : "checkout"}
                  />
                ) : (
                  <AdditionalDriverController
                    driver={driver}
                    auth={props.auth}
                    agreementId={agreementId}
                    stage={props.isCheckin ? "checkin" : "checkout"}
                  />
                )}
              </React.Suspense>
            </React.Fragment>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function PrimaryDriverSignatureImage(props: BaseDriverProps) {
  const [signatureDialogOpen, setSignatureDialogOpen] = React.useState(false);

  const signatureQuery = useSuspenseQuery(
    getAgreementCustomerDigSigUrlOptions({
      agreementId: props.agreementId,
      driverId: props.driver.driverId.toString(),
      isCheckin: props.stage === "checkin",
      signatureImageUrl: "",
      auth: props.auth,
    })
  );

  const data =
    signatureQuery.data.status === 200 ? signatureQuery.data.body : null;

  const dataUrl = React.useMemo(
    () => (data ? `data:image/png;base64,${data}` : null),
    [data]
  );

  if (!data || !dataUrl) return null;

  return (
    <React.Fragment>
      <SignatureDialog
        open={signatureDialogOpen}
        mode="resigning"
        onOpenChange={setSignatureDialogOpen}
        submitMode="primary"
        {...props}
      />
      <li
        className="group relative overflow-hidden px-1.5 py-2"
        style={{
          backgroundColor: "hsl(var(--canvas-light-background))",
        }}
      >
        <motion.img
          src={dataUrl}
          alt="Signature Image"
          className="aspect-video w-full object-cover"
          initial={{ height: "0rem" }}
          whileInView={{ height: "16rem" }}
          viewport={{ once: true }}
        />
        <Button
          size="sm"
          variant="secondary"
          className="absolute right-1 top-1 h-8 gap-1 text-xs shadow"
          onClick={() => setSignatureDialogOpen(true)}
        >
          <icons.RotateBackwards className="size-2.5" aria-hidden />
          <span>Redo</span>
        </Button>
      </li>
    </React.Fragment>
  );
}

interface BaseDriverProps extends Auth {
  stage: "checkout" | "checkin";
  agreementId: string;
  driver: DigitalSignatureDriver;
}

function DriverController(props: BaseDriverProps) {
  const signatureQuery = useSuspenseQuery(
    getAgreementCustomerDigSigUrlOptions({
      agreementId: props.agreementId,
      driverId: props.driver.driverId.toString(),
      isCheckin: props.stage === "checkin",
      signatureImageUrl: "",
      auth: props.auth,
    })
  );

  const signatureImageContent =
    signatureQuery.data.status === 200 ? signatureQuery.data.body : null;

  const isSigned = !!signatureImageContent;

  return <Driver {...props} isSigned={isSigned} isPrimary />;
}

function AdditionalDriverController(props: BaseDriverProps) {
  return (
    <Driver
      {...props}
      isSigned={
        !!props.driver.signatureImageUrlString || !!props.driver.signatureDate
      }
    />
  );
}

function Driver(
  props: BaseDriverProps & {
    isSigned: boolean;
    isPrimary?: boolean;
  }
) {
  const [signatureDialogOpen, setSignatureDialogOpen] = React.useState(false);
  const { dateTimeFormat } = useDatePreference();

  const signedDate = props.driver.signatureDate
    ? ` ${format(props.driver.signatureDate, dateTimeFormat)}.`
    : "";

  return (
    <React.Fragment>
      <SignatureDialog
        open={signatureDialogOpen}
        mode="signing"
        onOpenChange={setSignatureDialogOpen}
        submitMode={props.isPrimary ? "primary" : "additional"}
        {...props}
      />
      <li className="flex flex-row items-start justify-between gap-4 p-5 xl:gap-2">
        <div className="grid min-w-0 justify-start text-sm">
          <Link
            to="/customers/$customerId/summary"
            params={{ customerId: `${props.driver.customerId}` }}
            className="inline-flex items-center gap-1 truncate font-semibold leading-6 text-foreground underline-offset-2 ring-0 hover:underline focus:underline focus:outline-none focus:ring-0"
            disabled={!props.driver.customerId}
          >
            {props.isPrimary ? (
              <icons.User className="size-3.5" aria-hidden />
            ) : (
              <icons.Users className="size-3.5" aria-hidden />
            )}
            <span>{props.driver.driverName}</span>
          </Link>
          <p className="mt-2 leading-5 text-muted-foreground">
            <icons.Signature
              className={cn(
                "mr-2 inline size-3",
                props.isSigned ? "text-green-500" : "text-destructive"
              )}
            />
            {props.isSigned ? (
              <React.Fragment>
                {signedDate ? (
                  <React.Fragment>
                    <span className="hidden 2xl:inline">Signed at</span>
                    <span>{signedDate}</span>
                  </React.Fragment>
                ) : (
                  <span>Driver has signed.</span>
                )}
              </React.Fragment>
            ) : (
              <span>
                {props.stage === "checkin"
                  ? "Did not sign at checkin."
                  : "Did not sign at checkout."}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!props.isPrimary ? (
            <AdditionalDriverSignaturePopover {...props} />
          ) : null}
          {
            // if not a primary driver and they haven't yet signed the agreement
            (!props.isPrimary && !props.isSigned) ||
            // if primary driver and they haven't yet signed the agreement
            (props.isPrimary && !props.isSigned) ? (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 bg-transparent"
                onClick={() => setSignatureDialogOpen(true)}
              >
                <icons.Signature className="size-3" aria-hidden />
                <span className="hidden text-xs xl:inline">Sign</span>
              </Button>
            ) : null
          }
        </div>
      </li>
    </React.Fragment>
  );
}

function AdditionalDriverSignaturePopover(props: BaseDriverProps) {
  const [open, onOpenChange] = React.useState(false);
  const [signatureDialogOpen, setSignatureDialogOpen] = React.useState(false);

  const signatureQuery = useSuspenseQuery(
    getAgreementAdditionalDriverDigSigUrlOptions({
      agreementId: props.agreementId,
      additionalDriverId: props.driver.driverId.toString(),
      isCheckin: props.stage === "checkin",
      signatureImageUrl: "",
      auth: props.auth,
    })
  );

  const data =
    signatureQuery.data.status === 200 ? signatureQuery.data.body : null;

  const dataUrl = React.useMemo(
    () => (data ? `data:image/png;base64,${data}` : null),
    [data]
  );

  if (!data || !dataUrl) return null;

  return (
    <React.Fragment>
      <SignatureDialog
        open={signatureDialogOpen}
        mode="resigning"
        onOpenChange={setSignatureDialogOpen}
        submitMode="additional"
        {...props}
      />
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="size-8 bg-transparent"
          >
            <icons.EyeOn className="size-3" aria-hidden />
            <span className="sr-only">
              View {props.driver.driverName} signature
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="top"
          className="w-full max-w-80 overflow-hidden p-0 lg:max-w-96"
        >
          <div className="flex flex-col items-center divide-y">
            <div
              className="px-1.5 py-2"
              style={{
                backgroundColor: "hsl(var(--canvas-light-background))",
              }}
            >
              <img
                src={dataUrl}
                alt="Signature Image"
                className="aspect-video w-full object-cover"
              />
            </div>
            <div className="flex w-full items-center justify-between gap-2 p-2 text-sm font-semibold text-foreground">
              <div className="flex items-center justify-start gap-2">
                <icons.Users className="size-3.5" aria-hidden />
                {props.driver.driverName}
              </div>
              <div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1 bg-transparent"
                  onClick={() => {
                    onOpenChange(false);
                    setSignatureDialogOpen(true);
                  }}
                >
                  <icons.RotateBackwards className="size-3" aria-hidden />
                  <span>Redo</span>
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </React.Fragment>
  );
}

function SignatureDialog(
  props: {
    mode: "signing" | "resigning";
    open: boolean;
    submitMode: "primary" | "additional";
    onOpenChange: (bool: boolean) => void;
  } & BaseDriverProps
) {
  const qc = useQueryClient();

  const uploadSignature = useMutation({
    mutationFn: apiClient.digitalSignature.uploadDigitalSignature,
    onSuccess: () => {
      signaturePadRef.current?.on();

      const imageKey =
        props.submitMode === "primary"
          ? getAgreementCustomerDigSigUrlOptions({
              agreementId: props.agreementId,
              driverId: props.driver.driverId.toString(),
              isCheckin: props.stage === "checkin",
              signatureImageUrl: "",
              auth: props.auth,
            }).queryKey
          : getAgreementAdditionalDriverDigSigUrlOptions({
              agreementId: props.agreementId,
              additionalDriverId: props.driver.driverId.toString(),
              isCheckin: props.stage === "checkin",
              signatureImageUrl: "",
              auth: props.auth,
            }).queryKey;

      const listKey = getDigSigDriversListOptions({
        agreementId: props.agreementId,
        auth: props.auth,
      }).queryKey;

      qc.invalidateQueries({ queryKey: listKey });
      qc.invalidateQueries({ queryKey: imageKey });

      toast.success("Signature saved successfully.");

      signaturePadRef.current?.clear();
      props.onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const signaturePadRef = React.useRef<ReactSignatureCanvas | null>(null);

  const handleAcceptSignature = () => {
    if (uploadSignature.isPending) {
      toast.info("Please wait for the previous signature to be saved.");
      return;
    }

    const isEmpty = signaturePadRef.current?.isEmpty();

    if (isEmpty) {
      toast.info("Please sign before submitting.");
      return;
    }

    const dataUrl = signaturePadRef.current?.toDataURL();

    if (!dataUrl) {
      toast.error("An error occurred while processing the signature.");
      return;
    }

    signaturePadRef.current?.off();

    let fallbackName = "Driver";

    if (props.submitMode === "primary") {
      uploadSignature.mutate({
        body: {
          agreementId: props.agreementId,
          base64String: dataUrl,
          imageName: props.driver.driverId.toString(),
          imageType: ".jpg",
          isDamageView: false,
          reservationId: 0,
          signatureDate: new Date().toISOString(),
          signatureImage: null,
          signatureName: props.driver.driverName || fallbackName,

          isCheckIn: props.stage === "checkin",
          driverId: props.driver.driverId.toString(),
        },
      });
      return;
    }

    fallbackName = "Additional driver";

    uploadSignature.mutate({
      body: {
        agreementId: props.agreementId,
        base64String: dataUrl,
        imageName: props.driver.driverId.toString(),
        imageType: ".jpg",
        isDamageView: false,
        reservationId: 0,
        signatureDate: new Date().toISOString(),
        signatureImage: null,
        signatureName: props.driver.driverName || fallbackName,

        // checkin needs to always be false for additional drivers
        isCheckIn: false,
        additionalDriverId: props.driver.driverId.toString(),
      },
    });
  };

  const handleClose = () => {
    signaturePadRef.current?.clear();
    props.onOpenChange(false);
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogHeader>
        <div
          className="relative aspect-video w-full overflow-hidden rounded-md border border-border"
          style={{
            backgroundColor: "hsl(var(--canvas-light-background))",
          }}
        >
          <ReactSignatureCanvas
            ref={signaturePadRef}
            canvasProps={{ className: "w-full h-full" }}
          />
          <Button
            size="sm"
            variant="outline"
            className="absolute right-1 top-1 h-8 gap-1 shadow"
            onClick={() => signaturePadRef.current?.clear()}
          >
            <icons.Clear className="size-3" aria-hidden />
            <span className="sr-only">Clear</span>
          </Button>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={uploadSignature.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleAcceptSignature}>
            {uploadSignature.isPending ? (
              <icons.Loading className="mr-2 h-3 w-3 animate-spin" />
            ) : null}
            <span>{props.mode === "resigning" ? "Resign" : "Sign"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
