import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { icons } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";

import { useDatePreference } from "@/lib/hooks/useDatePreferences";

import type { AgreementDataParsed } from "@/lib/schemas/agreement";
import type { DigitalSignatureDriver } from "@/lib/schemas/digital-signature/driverList";
import { fetchAgreementDigitalSignatureUrl } from "@/lib/query/digitalSignature";
import type { Auth } from "@/lib/query/helpers";

import { format } from "@/lib/config/date-fns";

import { cn } from "@/lib/utils";

export default function SummarySignatureCard(
  props: {
    agreement: AgreementDataParsed;
    drivers: DigitalSignatureDriver[];
    isCheckin: boolean;
  } & Auth
) {
  const agreementId = props.agreement.agreementId.toString();
  const drivers = props.drivers;

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
                  <SignatureImage
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

function SignatureImage(props: BaseDriverProps) {
  const signatureQuery = useSuspenseQuery(
    fetchAgreementDigitalSignatureUrl({
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
    <li
      className="overflow-hidden px-1.5 py-2"
      style={{
        backgroundColor: "hsl(var(--light-card))",
      }}
    >
      <motion.img
        src={dataUrl}
        alt="Signature Image"
        className="w-full object-cover"
        initial={{ height: "0rem" }}
        whileInView={{ height: "14rem" }}
        viewport={{ once: true }}
      />
    </li>
  );
}

interface BaseDriverProps extends Auth {
  stage: "checkout" | "checkin";
  agreementId: string;
  driver: DigitalSignatureDriver;
}

function DriverController(props: BaseDriverProps) {
  return (
    <Driver
      {...props}
      isSigned={
        !!props.driver.signatureImageUrlString || !!props.driver.signatureDate
      }
      isPrimary
    />
  );
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
  const { dateTimeFormat } = useDatePreference();

  const signedDate = props.driver.signatureDate
    ? ` ${format(props.driver.signatureDate, dateTimeFormat)}.`
    : " ...";

  return (
    <li className="flex flex-row items-start justify-between gap-4 p-5 xl:gap-2">
      <div className="grid min-w-0 justify-start text-sm">
        <p className="inline-flex items-center gap-1 truncate font-semibold leading-6 text-foreground">
          {props.isPrimary ? (
            <icons.User className="size-3.5" aria-hidden />
          ) : (
            <icons.Users className="size-3.5" aria-hidden />
          )}
          <span>{props.driver.driverName}</span>
        </p>
        <p className="mt-2 leading-5 text-muted-foreground">
          <icons.Signature
            className={cn(
              "mr-2 inline size-3",
              props.isSigned ? "text-green-500" : "text-destructive"
            )}
          />
          {props.isSigned ? (
            <React.Fragment>
              <span className="hidden 2xl:inline">Signed at</span>
              <span>{signedDate}</span>
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
        <Button variant="outline" size="sm" className="gap-1 bg-transparent">
          <icons.Signature className="size-3" aria-hidden />
          <span className="hidden text-xs xl:inline">
            {props.isSigned ? "Redo" : "Sign"}
          </span>
        </Button>
      </div>
    </li>
  );
}
