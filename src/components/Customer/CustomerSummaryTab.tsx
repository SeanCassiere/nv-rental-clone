import { CustomerSummary } from "../PrimaryModule/ModuleSummary/CustomerSummary";
import { useGetClientProfile } from "../../hooks/network/client/useGetClientProfile";
import { useGetCustomerData } from "../../hooks/network/customer/useGetCustomerData";
import { useGetCustomerSummary } from "../../hooks/network/customer/useGetCustomerSummary";

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
    <div className="grid max-w-full grid-cols-1 gap-4 focus:ring-0 md:grid-cols-12">
      <div className="flex flex-col gap-4 md:col-span-7">
        <div className="overflow-x-scroll bg-slate-50">
          <h2>Customer data</h2>
          <code className="text-xs">
            <pre>{JSON.stringify(customerData.data, null, 2)}</pre>
          </code>
        </div>
        <div className="bg-slate-50">Customer block 1</div>
        <div className="bg-slate-50">Customer block 2</div>
      </div>
      {/*  */}
      <div className="flex flex-col gap-4 md:col-span-5">
        <CustomerSummary
          summaryData={customerSummary.data}
          currency={clientProfile.data?.currency || undefined}
        />
      </div>
    </div>
  );
};

export default CustomerSummaryTab;
