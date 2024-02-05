import { createFileRoute } from "@tanstack/react-router";

import {
  fetchLanguagesForUsersOptions,
  fetchUserByIdOptions,
} from "@/lib/query/user";

export const Route = createFileRoute("/_auth/settings/profile")({
  beforeLoad: ({ context }) => ({
    currentUserProfileOptions: fetchUserByIdOptions({
      auth: context.authParams,
      userId: context.authParams.userId,
    }),
    availableLanguagesOptions: fetchLanguagesForUsersOptions({
      auth: context.authParams,
    }),
  }),
  loader: async ({ context }) => {
    const {
      queryClient,
      currentUserProfileOptions,
      availableLanguagesOptions,
    } = context;

    const promises = [
      queryClient.ensureQueryData(currentUserProfileOptions),
      queryClient.ensureQueryData(availableLanguagesOptions),
    ];

    await Promise.allSettled(promises);
  },
});
