import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { icons } from "@/components/ui/icons";

import type { AgreementDataParsed } from "@/lib/schemas/agreement";

import { cn } from "@/lib/utils";

export default function SummarySignatureCard(props: {
  agreement: AgreementDataParsed;
}) {
  const agreementId = props.agreement.agreementId.toString();
  const drivers = props.agreement.driverList;

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
  const isSigned = !!props.driver.signatureDate;

  return (
    <li className="flex flex-row items-center justify-between gap-4 p-5 xl:gap-2">
      <div className="grid min-w-0 justify-start text-sm">
        <p className="inline-flex items-center gap-1 truncate font-semibold leading-6 text-foreground">
          {props.isPrimary ? (
            <icons.User className="size-3" />
          ) : (
            <icons.Users className="size-3" />
          )}
          <span>{props.driver.driverName}</span>
        </p>
        <p className="mt-1 leading-5 text-muted-foreground">
          <icons.Signature
            className={cn(
              "mr-1 inline size-3",
              isSigned ? "text-green-500" : "text-destructive"
            )}
          />
          {isSigned ? (
            <>
              <span className="hidden 2xl:inline">Signed on:</span>
              <span>&nbsp;{props.driver.signatureDate ?? "..."}</span>
            </>
          ) : (
            <span>Not signed</span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1 bg-transparent">
          <icons.Signature className="size-3" />
          <span className="hidden text-xs xl:inline">
            {isSigned ? "Redo" : "Sign"}
          </span>
        </Button>
        {isSigned ? (
          <Button variant="ghost" size="icon" className="h-9">
            <icons.More className="size-3" />
          </Button>
        ) : null}
      </div>
    </li>
  );
}
