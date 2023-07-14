import {
  AgreementDataSchema,
  AgreementStatusListSchema,
  AgreementTypeArraySchema,
  GenerateAgreementNumberSchema,
} from "@/schemas/agreement";
import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

export const fetchAgreementsList = async (
  opts: {
    page?: number;
    pageSize?: number;
    currentDate: Date;
    filters: any;
  } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/agreements`, {
      ...opts.filters,
      currentDate: opts.currentDate.toISOString(),
      clientId: opts.clientId,
      userId: opts.userId,
      page: opts?.page,
      pageSize: opts?.pageSize,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  );
};

export const fetchAgreementData = async (
  opts: { agreementId: string | number } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/agreements/${opts.agreementId}`, {
      clientId: opts.clientId,
      userId: opts.userId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => AgreementDataSchema.parse(res.data));
};

export const fetchAgreementStatusesList = async (opts: CommonAuthParams) => {
  return await callV3Api(
    makeUrl(`/v3/agreements/statuses`, {
      clientId: opts.clientId,
      userId: opts.userId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => AgreementStatusListSchema.parse(res.data));
};

export const fetchAgreementTypesList = async (opts: CommonAuthParams) => {
  return await callV3Api(
    makeUrl(`/v3/agreements/types`, {
      clientId: opts.clientId,
      userId: opts.userId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => AgreementTypeArraySchema.parse(res.data));
};

export const fetchNewAgreementNo = async (
  opts: CommonAuthParams & { agreementType: string }
) => {
  return await callV3Api(
    makeUrl(`/v3/agreements/generateagreementno`, {
      clientId: opts.clientId,
      userId: opts.userId,
      agreementType: opts.agreementType,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => GenerateAgreementNumberSchema.parse(res.data));
};
