import type { ServerMessage } from "@/lib/schemas/dashboard";
import type { Auth } from "@/lib/query/helpers";

import { STORAGE_KEYS } from "@/lib/utils/constants";

import { isAfter, isBefore } from "@/lib/config/date-fns";

import { apiClient } from "@/lib/api";

function tryParseJson<TData>(json: string | null, defaultData: TData): TData {
  if (!json) return defaultData;
  try {
    return JSON.parse(json);
  } catch (e) {
    return defaultData;
  }
}

/**
 * Retrieves dashboard messages and filters them based on their active status, sent date, and expiry date.
 * Dismissed messages are excluded from the result.
 *
 * @param options - The authentication options.
 * @returns A promise that resolves to an array of sorted and filtered dashboard messages.
 */
export async function getDashboardMessagesAndFilter(options: Auth) {
  return await apiClient.dashboard
    .getAdminMessages({ query: { clientId: options.auth.clientId } })
    .then((res) => {
      if (res.status === 200) {
        const allMessages = res.body;

        const currentDate = new Date();
        const sortedMessages = allMessages.filter(
          getFilterMessagesFn(currentDate)
        );

        return sortedMessages;
      }
      return [];
    })
    .then((res) => {
      const local = window.localStorage.getItem(STORAGE_KEYS.dismissedMessages);
      const dismissedMessageIds = tryParseJson<string[]>(local, []);

      const messages = res.filter((msg) => {
        if (!dismissedMessageIds.includes(msg.messageId)) {
          return true;
        }
        return false;
      });

      return messages;
    });
}

function getFilterMessagesFn(currentDate: Date) {
  return (message: ServerMessage) => {
    if (!message.active) return false;

    const startDate = message.sentDate
      ? new Date(message.sentDate)
      : new Date("1970-01-01");
    const endDate = message.expiryDate ? new Date(message.expiryDate) : null;

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
  };
}
