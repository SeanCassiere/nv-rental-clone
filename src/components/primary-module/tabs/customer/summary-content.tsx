import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { CustomerSummary } from "@/components/primary-module/summary/customer";

import { getAuthFromAuthHook } from "@/utils/auth";
import {
  fetchCustomerByIdOptions,
  fetchSummaryForCustomerByIdOptions,
} from "@/utils/query/customer";
import { sortObjectKeys } from "@/utils/sort";

interface CustomerSummaryTabProps {
  customerId: string;
}

const CustomerSummaryTab = (props: CustomerSummaryTabProps) => {
  const auth = useAuth();
  const authParams = getAuthFromAuthHook(auth);

  const customerData = useQuery(
    fetchCustomerByIdOptions({ auth: authParams, customerId: props.customerId })
  );

  const customerSummary = useQuery(
    fetchSummaryForCustomerByIdOptions({
      auth: authParams,
      customerId: props.customerId,
    })
  );
  const summaryData =
    customerSummary.data?.status === 200
      ? customerSummary.data?.body
      : undefined;

  return (
    <div className="grid max-w-full grid-cols-1 gap-4 focus:ring-0 lg:grid-cols-12">
      <div className="flex flex-col gap-4 lg:col-span-8">
        <div className="max-h-[500px] overflow-x-scroll bg-card p-4">
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
