import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns/format";

import {
  PrimaryModulePreviewSheet,
  PrimaryModulePreviewSheetProps,
} from "@/components/primary-module/preview-sheet";
import { buttonVariants } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

import { useDatePreference } from "@/hooks/useDatePreferences";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import { fetchAgreementByIdOptions } from "@/utils/query/agreement";
import type { Auth } from "@/utils/query/helpers";
import { titleMaker } from "@/utils/title-maker";

import { cn } from "@/utils";

interface PreviewAgreementSheetProps extends Auth {
  agreementId: string | undefined;
  open: PrimaryModulePreviewSheetProps["open"];
  onOpenChange: PrimaryModulePreviewSheetProps["onOpenChange"];
}

function PreviewAgreementSheet(props: PreviewAgreementSheetProps) {
  const { open, onOpenChange } = props;

  return (
    <PrimaryModulePreviewSheet open={open} onOpenChange={onOpenChange}>
      {/* <AgreementSheetSkeleton agreementId={props.agreementId} /> */}
      <AgreementSheetContent {...props} />
    </PrimaryModulePreviewSheet>
  );
}
export default PreviewAgreementSheet;

function AgreementLinks(props: {
  agreementId: string | undefined;
  isCheckedIn?: boolean;
}) {
  const { agreementId = "0", isCheckedIn = false } = props;
  return (
    <div className="absolute left-4 top-4 flex gap-4 pl-2">
      <Link
        to="/agreements/$agreementId"
        params={{ agreementId: String(agreementId) }}
        className={cn(
          buttonVariants({ variant: "link", size: "sm" }),
          "h-4 gap-1 p-0 text-sm opacity-75 hover:opacity-100"
        )}
      >
        <icons.AltMaximize className="h-3.5 w-3.5" />
        <span>Expand</span>
      </Link>
      {!isCheckedIn && (
        <Link
          to="/agreements/$agreementId/check-in"
          search={() => ({ stage: "rental-information" })}
          params={{ agreementId: String(agreementId) }}
          className={cn(
            buttonVariants({ variant: "link", size: "sm" }),
            "h-4 gap-1 p-0 text-sm opacity-75 hover:opacity-100"
          )}
        >
          <icons.Checkin className="h-3.5 w-3.5" />
          <span className="inline-block">Checkin</span>
        </Link>
      )}
      {isCheckedIn ? (
        <Link
          to="/agreements/$agreementId/check-in"
          search={() => ({ stage: "rental-information" })}
          params={{ agreementId: String(agreementId) }}
          className={cn(
            buttonVariants({ variant: "link", size: "sm" }),
            "h-4 gap-1 p-0 text-sm opacity-75 hover:opacity-100"
          )}
        >
          <icons.Edit className="h-3.5 w-3.5" />
          <span className="inline-block">Edit</span>
        </Link>
      ) : (
        <Link
          to="/agreements/$agreementId/edit"
          search={() => ({ stage: "rental-information" })}
          params={{ agreementId: String(agreementId) }}
          className={cn(
            buttonVariants({ variant: "link", size: "sm" }),
            "h-4 gap-1 p-0 text-sm opacity-75 hover:opacity-100"
          )}
        >
          <icons.Edit className="h-3.5 w-3.5" />
          <span className="inline-block">Edit</span>
        </Link>
      )}
    </div>
  );
}

function AgreementSheetSkeleton(props: { agreementId: string | undefined }) {
  return (
    <>
      <AgreementLinks agreementId={props.agreementId} isCheckedIn />
      <SheetHeader className="mt-8 text-start">
        <SheetTitle className="">
          <Skeleton className="h-9 w-60" />
          <span className="sr-only">Loading....</span>
        </SheetTitle>
        <SheetDescription asChild>
          <Skeleton className="h-6 w-3/4" />
        </SheetDescription>
      </SheetHeader>
      <div className="mt-4 flex flex-col space-y-2">
        <Separator />
      </div>
    </>
  );
}

interface AgreementSheetContentProps extends PreviewAgreementSheetProps {}

function AgreementSheetContent(props: AgreementSheetContentProps) {
  const { agreementId, auth } = props;

  const agreementOptions = React.useMemo(
    () => fetchAgreementByIdOptions({ auth, agreementId: agreementId ?? "0" }),
    [agreementId, auth]
  );

  const { dateTimeFormat } = useDatePreference();

  const query = useQuery(agreementOptions);

  const data =
    query.status === "success" && query.data.status === 200
      ? query.data.body
      : null;

  useDocumentTitle(
    titleMaker((data?.agreementNumber || "Loading") + " - Agreements"),
    { preserveTitleOnUnmount: false }
  );

  if (!data) {
    return <AgreementSheetSkeleton agreementId={agreementId} />;
  }

  const isCheckedIn = data?.returnDate ? true : false;

  return (
    <>
      <AgreementLinks agreementId={agreementId} isCheckedIn={isCheckedIn} />
      <SheetHeader className="mt-8 text-start">
        <SheetTitle className="h-9 text-3xl">{data.agreementNumber}</SheetTitle>
        <SheetDescription className="h-6">
          <span>
            {data.createdDate &&
              `Created on ${format(data.createdDate, dateTimeFormat)}`}
          </span>
          <span className="hidden sm:inline-block">
            {data.createdDate && data.createdByName && <>&nbsp;</>}
            {data.createdByName && `by ${data.createdByName}`}
          </span>
        </SheetDescription>
      </SheetHeader>
      <div className="mt-4 flex flex-col space-y-2">
        <Separator />
      </div>
    </>
  );
}
