import { useQuery } from "@tanstack/react-query";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import { useAuth } from "react-oidc-context";

import { USER_STORAGE_KEYS } from "@/utils/constants";
import { tryParseJson } from "@/utils/parse";
import { dashboardQKeys } from "@/utils/query-key";
import { getLocalStorageForUser } from "@/utils/user-local-storage";

import { apiClient } from "@/api";

export function useGetDashboardMessages() {
  const auth = useAuth();

  const query = useQuery({
    queryKey: dashboardQKeys.messages(),
    queryFn: async () => {
      return await fetchDashboardMessagesListModded(
        {
          query: {
            clientId: auth.user?.profile.navotar_clientid || "",
          },
        },
        {
          userId: auth.user?.profile.navotar_userid || "",
        }
      );
    },
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
  return query;
}

export async function fetchDashboardMessagesListModded(
  opts: Parameters<(typeof apiClient)["dashboard"]["getAdminMessages"]>[0],
  extra: { userId: string }
) {
  return await apiClient.dashboard
    .getAdminMessages(opts)
    .then((res) => {
      if (res.status === 200) {
        const allMessages = res.body;

        const currentDate = new Date();
        const sortedMessages = allMessages.filter((message) => {
          if (!message.active) return false;

          const startDate = message.sentDate
            ? new Date(message.sentDate)
            : new Date("1970-01-01");
          const endDate = message.expiryDate
            ? new Date(message.expiryDate)
            : null;

          // if start date is in the future, don't show
          if (isAfter(startDate, currentDate)) return false;

          // if end date is in the past, don't show
          if (endDate && isBefore(endDate, currentDate)) return false;

          // if start date is in the past and end date is in the future, show
          if (
            isBefore(startDate, currentDate) &&
            endDate &&
            isAfter(endDate, currentDate)
          ) {
            return true;
          }

          // if start date is in the past and no end date, show
          if (isBefore(startDate, currentDate) && !endDate) return true;

          return false;
        });

        return sortedMessages;
      }
      return [];
    })
    .then((res) => {
      const local = getLocalStorageForUser(
        opts.query.clientId,
        extra.userId,
        USER_STORAGE_KEYS.dismissedMessages
      );
      const dismissedMessageIds = tryParseJson<string[]>(local, []);

      const messages = res.filter((msg) => {
        if (!dismissedMessageIds.includes(msg.messageId)) {
          return msg;
        }
        return false;
      });

      return messages;
    })
    .catch((e) => {
      console.error(e);
      throw e;
    });
}
