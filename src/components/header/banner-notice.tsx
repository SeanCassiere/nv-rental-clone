import React from "react";

import { icons } from "@/components/ui/icons";

import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

import type { ServerMessage } from "@/lib/schemas/dashboard";

import { STORAGE_KEYS } from "@/lib/utils/constants";

const MessageText = ({ message }: { message: ServerMessage }) => (
  <>
    <span className="flex items-center font-semibold">
      {message.title}
      {message.description && (
        <icons.Dot className="mx-0.5 mb-1 mt-1 hidden h-3 w-3 sm:inline sm:h-5 sm:w-5" />
      )}
    </span>
    {message.description && (
      <span className="group-hover:underline group-hover:underline-offset-4">
        {message.description}
      </span>
    )}
  </>
);

export const BannerNotice = React.memo(
  ({ message }: { message: ServerMessage }) => {
    const [dismissedMessages, setDismissedMessages] = useLocalStorage(
      STORAGE_KEYS.dismissedMessages,
      [] as string[]
    );

    const hidden = dismissedMessages.includes(message.messageId);

    const onDismiss = () => {
      setDismissedMessages((data) => [...data, message.messageId]);
    };

    if (hidden) return null;

    return (
      <article className="mx-auto flex w-full max-w-[1700px] flex-1 items-center gap-6 pb-2 pl-3.5 pr-1 pt-2.5 text-bannerPromo-foreground md:px-16 md:pb-1 md:pt-1.5">
        {message.link ? (
          <a
            href={message.link}
            className="[text-wrap=balance] group flex flex-1 flex-col flex-wrap items-start gap-1 text-sm leading-tight sm:flex-row sm:items-center md:items-center md:gap-0"
            target={message.link.startsWith("http") ? "_blank" : "_self"}
            rel="noopener noreferrer"
          >
            <MessageText message={message} />
          </a>
        ) : (
          <p className="flex flex-1 flex-col flex-wrap items-start gap-1 text-sm leading-tight sm:flex-row sm:items-center md:items-center md:gap-0">
            <MessageText message={message} />
          </p>
        )}
        <div className="flex justify-end">
          <button
            className="p-3 text-bannerPromo-foreground hover:text-bannerPromo-foreground/70"
            onClick={onDismiss}
          >
            <icons.X className="h-4 w-4" />
          </button>
        </div>
      </article>
    );
  }
);
