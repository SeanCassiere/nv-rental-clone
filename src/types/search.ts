import { AppModule } from "./app-module";

export type GlobalSearchReturnType = {
  module: AppModule;
  referenceId: string;
  displayText: string;
  fullDisplayText: string;
}[];
