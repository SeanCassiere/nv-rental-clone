import { useMemo } from "react";
import { Link } from "@tanstack/router";
import { useTranslation } from "react-i18next";
import { UserIcon } from "lucide-react";

import {
  InformationBlockCard,
  type TAnyCustomerValueType,
  type TInformationBlockCardProps,
  EMPTY_KEY,
} from "./common";
import { buttonVariants } from "@/components/ui/button";

import { viewCustomerByIdRoute } from "@/routes/customers/customer-id-route";

import { cn } from "@/utils";

interface TCustomerInformationProps {
  data: {
    customerId?: TAnyCustomerValueType;
    firstName?: TAnyCustomerValueType;
    middleName?: TAnyCustomerValueType;
    lastName?: TAnyCustomerValueType;
    mobileNumber?: TAnyCustomerValueType;
    homeNumber?: TAnyCustomerValueType;
    email?: TAnyCustomerValueType;
    driverLicenseNumber?: TAnyCustomerValueType;
    creditCardType?: TAnyCustomerValueType;
    creditCardNumber?: TAnyCustomerValueType;
    creditCardExpirationDate?: TAnyCustomerValueType;
    creditCardSecurityCode?: TAnyCustomerValueType;
    dateOfBirth?: TAnyCustomerValueType;
    checkoutDate?: TAnyCustomerValueType;
    checkinDate?: TAnyCustomerValueType;
  };
  isLoading: boolean;
  mode: "agreement" | "reservation" | "vehicle";
}

const CustomerInformation = (props: TCustomerInformationProps) => {
  const { data, isLoading, mode } = props;
  const { t } = useTranslation();

  const title = useMemo(() => {
    let currentTitle = "Customer information";
    if (mode === "vehicle") {
      currentTitle = "Current customer";
    }

    return currentTitle;
  }, [mode]);

  const infoBlocks = useMemo(() => {
    const fullName = data?.firstName
      ? String(data?.firstName) +
        (data?.middleName ? data.middleName + " " : " ") +
        String(data.lastName)
      : EMPTY_KEY;

    const blocks: TInformationBlockCardProps["blocks"] = [];

    const pushFullName = () => {
      if (data.customerId) {
        blocks.push({
          heading: "Full name",
          value: (
            <Link
              to={viewCustomerByIdRoute.to}
              params={{ customerId: String(data.customerId) }}
              search={() => ({ tab: "summary" })}
              className={cn(
                buttonVariants({ variant: "link" }),
                "h-auto p-0 text-base underline"
              )}
            >
              {fullName}
            </Link>
          ),
        });
      } else {
        blocks.push({
          heading: "Full name",
          value: fullName,
        });
      }
    };
    const pushMobileNumber = () => {
      blocks.push({
        heading: "Mobile no.",
        value: data?.mobileNumber || EMPTY_KEY,
      });
    };
    const pushHomeNumber = () => {
      blocks.push({
        heading: "Home no.",
        value: data?.homeNumber || EMPTY_KEY,
      });
    };
    const pushEmail = () => {
      blocks.push({
        heading: "Email",
        value: data?.email || EMPTY_KEY,
      });
    };
    const pushLicenseNumber = () => {
      blocks.push({
        heading: "License no.",
        value: data?.driverLicenseNumber || EMPTY_KEY,
      });
    };
    const pushCardInfo = () => {
      blocks.push({
        heading: "Card number",
        value: data?.creditCardNumber || EMPTY_KEY,
      });
      blocks.push({
        heading: "Card type",
        value: data?.creditCardType || EMPTY_KEY,
      });
      blocks.push({
        heading: "Card expiration",
        value: data?.creditCardExpirationDate
          ? t("intlMonthYear", { value: data.creditCardExpirationDate })
          : EMPTY_KEY,
      });
      blocks.push({
        heading: "Card CVC",
        value: data?.creditCardSecurityCode || EMPTY_KEY,
      });
    };
    const pushDateOfBirth = () => {
      blocks.push({
        heading: "Date of birth",
        value: data?.dateOfBirth
          ? t("intlDate", { value: data.dateOfBirth })
          : EMPTY_KEY,
      });
    };
    const pushCheckoutDate = () => {
      blocks.push({
        heading: "Checkout date",
        value: data?.checkoutDate
          ? t("intlDateTime", { value: data.checkoutDate })
          : EMPTY_KEY,
      });
    };
    const pushCheckinDate = () => {
      blocks.push({
        heading: "Checkin date",
        value: data?.checkoutDate
          ? t("intlDateTime", { value: data.checkinDate })
          : EMPTY_KEY,
      });
    };

    if (mode === "agreement") {
      pushFullName();
      pushMobileNumber();
      pushHomeNumber();
      pushEmail();
      pushDateOfBirth();
      pushLicenseNumber();
      pushCardInfo();
    }
    if (mode === "reservation") {
      pushFullName();
      pushMobileNumber();
      pushEmail();
      pushDateOfBirth();
      pushLicenseNumber();
    }
    if (mode === "vehicle") {
      pushFullName();
      pushMobileNumber();
      pushLicenseNumber();
      pushCheckoutDate();
      pushCheckinDate();
    }
    return blocks;
  }, [t, data, mode]);

  return (
    <InformationBlockCard
      identifier="customer-information"
      icon={<UserIcon className="h-5 w-5" />}
      title={title}
      blocks={infoBlocks}
      numberPerBlock={3}
      isLoading={isLoading}
    />
  );
};

export default CustomerInformation;
