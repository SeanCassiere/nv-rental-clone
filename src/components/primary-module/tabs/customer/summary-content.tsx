import { CustomerSummary } from "@/components/primary-module/summary/customer";

import { useGetCustomerData } from "@/hooks/network/customer/useGetCustomerData";
import { useGetCustomerSummary } from "@/hooks/network/customer/useGetCustomerSummary";

import { sortObjectKeys } from "@/utils/sort";

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
  const summaryData =
    customerSummary.data?.status === 200
      ? customerSummary.data?.body
      : undefined;

  return (
    <div className="grid max-w-full grid-cols-1 gap-4 focus:ring-0 lg:grid-cols-12">
      <div className="flex flex-col gap-4 lg:col-span-8">
        <div className="max-h-[500px] overflow-x-scroll bg-slate-50">
          <h2>Customer data</h2>
          <code className="text-xs">
            <pre>
              {JSON.stringify(sortObjectKeys(customerData.data), null, 2)}
            </pre>
          </code>
        </div>
      </div>
      {/*  */}
      <div className="flex flex-col gap-4 lg:col-span-4">
        <CustomerSummary summaryData={summaryData} />
      </div>
    </div>
  );
};

export default CustomerSummaryTab;
