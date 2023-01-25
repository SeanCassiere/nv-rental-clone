import { CustomerSummary } from "../PrimaryModule/ModuleSummary/CustomerSummary";
import { useGetClientProfile } from "../../hooks/network/client/useGetClientProfile";
import { useGetCustomerData } from "../../hooks/network/customer/useGetCustomerData";
import { useGetCustomerSummary } from "../../hooks/network/customer/useGetCustomerSummary";
import { sortObject } from "../../utils/sortObject";

type CustomerSummaryTabProps = {
  customerId: string;
};

const CustomerSummaryTab = (props: CustomerSummaryTabProps) => {
  const customerData = useGetCustomerData({
    customerId: props.customerId,
  });

  const customerSummary = useGetCustomerSummary({
    customerId: props.customerId,
  });

  const clientProfile = useGetClientProfile();

  return (
    <div className="grid max-w-full grid-cols-1 gap-4 focus:ring-0 lg:grid-cols-12">
      <div className="flex flex-col gap-4 lg:col-span-7">
        <div className="max-h-[500px] overflow-x-scroll bg-slate-50">
          <h2>Customer data</h2>
          <code className="text-xs">
            <pre>{JSON.stringify(sortObject(customerData.data), null, 2)}</pre>
          </code>
        </div>
      </div>
      {/*  */}
      <div className="flex flex-col gap-4 lg:col-span-5">
        <CustomerSummary
          summaryData={customerSummary.data}
          currency={clientProfile.data?.currency || undefined}
        />
      </div>
    </div>
  );
};

export default CustomerSummaryTab;
