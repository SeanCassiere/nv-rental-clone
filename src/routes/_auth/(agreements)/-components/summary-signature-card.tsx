import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { icons } from "@/components/ui/icons";

import type { AgreementDataParsed } from "@/lib/schemas/agreement";

import { cn } from "@/lib/utils";

// https://testapi.appnavotar.com/api/v3/DigitalSignature/AdditionalDriverList?agreementID=167886

export default function SummarySignatureCard(props: {
  agreement: AgreementDataParsed;
}) {
  const agreementId = props.agreement.agreementId.toString();
  const drivers = props.agreement.driverList;
  console.log(props.agreement);
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
          {drivers.map((d) => (
            <Driver
              key={`${agreementId}_${d.driverId || "no-driver-id"}`}
              driver={d}
              agreementId={agreementId}
              isPrimary={d.customerId === props.agreement.customerId}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function Driver(props: {
  driver: AgreementDataParsed["driverList"][number];
  agreementId: string;
  isPrimary: boolean;
}) {
  // const isSigned = !!props.driver.signatureDate;
  const isSigned = !!props.driver.signatureDate;
  return (
    <li className="flex items-center justify-between gap-2 p-4">
      <div className="flex justify-start gap-4">
        <div className="flex items-center justify-center px-1">
          {isSigned ? (
            <icons.Check className="size-4" />
          ) : (
            <icons.X className="size-4" />
          )}
        </div>
        <div className="min-w-0 flex-auto text-sm">
          <p className="font-semibold leading-6 text-foreground">
            {props.driver.driverName}
          </p>
          <p className="mt-1 truncate leading-5 text-muted-foreground">
            <icons.Signature
              className={cn(
                "mr-1 inline size-3",
                isSigned ? "text-green-500" : "text-destructive"
              )}
            />
            {isSigned ? (
              <>
                <span className="hidden md:inline">Signed on:</span>
                <span>&nbsp;{props.driver.signatureDate}</span>
              </>
            ) : (
              <span>Not signed</span>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="bg-transparent">
          {isSigned ? "Resign" : "Sign"}
        </Button>
        {isSigned ? (
          <Button variant="ghost" size="icon">
            :
          </Button>
        ) : null}
      </div>
    </li>
  );
}
