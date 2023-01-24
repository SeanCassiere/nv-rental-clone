import {
  CustomerDataSchema,
  CustomerTypeArraySchema,
} from "../utils/schemas/customer";
import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

export const fetchCustomersList = async (
  opts: {
    page: number;
    pageSize: number;
    filters: any;
  } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/customers`, {
      ...opts.filters,
      clientId: opts.clientId,
      userId: opts.userId,
      page: opts.page,
      pageSize: opts.pageSize,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  );
};

export const fetchCustomerData = async (
  opts: { customerId: string | number } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/customers/${opts.customerId}`, {
      clientId: opts.clientId,
      userId: opts.userId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => CustomerDataSchema.parse(res.data));
};

export const fetchCustomerTypesList = async (opts: CommonAuthParams) => {
  return await callV3Api(
    makeUrl(`/v3/customers/types`, {
      clientId: opts.clientId,
      userId: opts.userId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => CustomerTypeArraySchema.parse(res.data));
};
