import { z } from "zod";

const CustomerListItemSchema = z
  .object({
    CustomerId: z.number(),
    FirstName: z.string().nullable(),
    MiddleName: z.string().nullable(),
    LastName: z.string().nullable(),
    CustomerNumber: z.string().nullable(),
    CompanyName: z.string().nullable(),
    DateOfbirth: z.string().nullable(),
    Address1: z.string().nullable(),
    Address2: z.string().nullable(),
    ZipCode: z.string().nullable(),
    City: z.string().nullable(),
    StateId: z.number().nullable(),
    CountryId: z.number().nullable(),
    hPhone: z.string().nullable(),
    bPhone: z.string().nullable(),
    cPhone: z.string().nullable(),
    Fax: z.string().nullable(),
    LicenseNumber: z.string().nullable(),
    LicenseCategory: z.string().nullable(),
    Email: z.string().nullable(),
    HSTNumber: z.string().nullable(),
    Active: z.boolean(),
    CountryName: z.string().nullable(),
    StateName: z.string().nullable(),
    StateCode: z.coerce.string().nullable(),
    InsuranceCompany: z.string().nullable(),
    PolicyNumber: z.string().nullable(),
    InsuranceExpiryDate: z.string().nullable(),
    InsuranceCountry: z.string().nullable(),
    InsuranceProvince: z.string().nullable(),
    CreditCardType: z.string().nullable(),
    CreditCardNo: z.string().nullable(),
    CreditCardExpiryDate: z.string().nullable(),
    CreditCardCVSNo: z.string().nullable(),
    InsuranceState: z.string().nullable(),
    BillingAddress1: z.string().nullable(),
    BillingCity: z.string().nullable(),
    BillingZipCord: z.string().nullable(),
    InsuranceClaim: z.string().nullable(),
    BillStateName: z.string().nullable(),
    BillingStateId: z.string().nullable(),
    BillingCountyId: z.string().nullable(),
    CustomerType: z.string().nullable(),
    BillCountryName: z.string().nullable(),
    Password: z.string().nullable(),
    LicenseIssueDate: z.string().nullable(),
    LicenseExpiryDate: z.string().nullable(),
    LicenseIssueState: z.string().nullable(),
    PassportNo: z.string().nullable(),
    PassportIssueDate: z.string().nullable(),
    PassportExpairyDate: z.string().nullable(),
    LocationId: z.number().nullable(),
    LocationName: z.string().nullable(),
    CreditCardBillingZipCode: z.string().nullable(),
    RateName: z.string().nullable(),
    ProductionName: z.string().nullable(),
    NameOnCard: z.string().nullable(),
    CustomerImage: z.string().nullable(),
    DrivingExperience: z.string().nullable(),
    IsBlackListed: z.boolean().nullable(),
    BlackListId: z.coerce.string().nullable(),
    BlackListDescription: z.string().nullable(),
    BlackListDate: z.string().nullable(),
    BlackListReason: z.number().nullable(),
    LicenseCountryId: z.number().nullable(),
    AccoutNameInBank: z.string().nullable(),
    AccountNumber: z.string().nullable(),
    BSB: z.string().nullable(),
    EmergencyContactNo: z.string().nullable(),
    CompanyRegNo: z.string().nullable(),
    IsSMSOpted: z.boolean().nullable(),
    IsEmailOpted: z.boolean().nullable(),
    QboReferenceId: z.string().nullable(),
    TicketFlag: z.number().nullable(),
    ClientId: z.number().nullable(),
    CreatedBy: z.number().nullable(),
    UserName: z.string().nullable(),
    PaymentTerms: z.coerce.string().nullable(),
    IsTaxExempt: z.boolean().nullable(),
    LicenseCountryName: z.string().nullable(),
    BankName: z.string().nullable(),
    BankSwiftCode: z.string().nullable(),
    CreatedByName: z.string().nullable(),
    LastUpdatedBy: z.string().nullable(),
    InsuranceCountryName: z.string().nullable(),
    DMSID: z.string().nullable(),
    InsuranceCompanyName: z.string().nullable(),
    InsuranceCompanyAddress: z.string().nullable(),
    InsuranceContactPhone: z.string().nullable(),
    InsuranceContactEmail: z.string().nullable(),
    InsuranceProvinceName: z.string().nullable(),
    CustomerImageList: z.array(z.string()).nullable(),
    EmploymentType: z.string().nullable(),
    BrokerName: z.string().nullable(),
    BrokerAddress: z.string().nullable(),
    BrokerPhone: z.string().nullable(),
    BrokerEmail: z.string().nullable(),
  })
  .transform((val) => {
    return {
      ...val,
      id: val.CustomerId,
      FullName: `${val.FirstName}${
        val.MiddleName !== null ? " " + val.MiddleName : ""
      } ${val.LastName}`,
    };
  });

export type TCustomerListItemParsed = z.infer<typeof CustomerListItemSchema>;
export const CustomerListItemListSchema = z.array(CustomerListItemSchema);
