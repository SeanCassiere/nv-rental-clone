import type { IdTokenClaims as ModuleIdTokenClaims } from "oidc-client-ts";

declare module "oidc-client-ts" {
  export interface IdTokenClaims extends ModuleIdTokenClaims {
    navotar_clientid: string;
    navotar_userid: string;
  }
}
