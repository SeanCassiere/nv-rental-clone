import { z } from "zod";

const CountrySchema = z.object({
  countryID: z.coerce.string(),
  countryName: z.string().catch("Unknown"),
  countryCode: z.string().catch("Unknown"),
});
export type TCountry = z.infer<typeof CountrySchema>;
export const CountriesListSchema = z.array(CountrySchema);

const StateSchema = z.object({
  stateID: z.coerce.string(),
  stateName: z.string().catch("Unknown"),
  stateCode: z.string().catch("Unknown"),
});
export type TState = z.infer<typeof StateSchema>;
export const StatesListSchema = z.array(StateSchema);
