import React from "react";

import { icons } from "@/components/ui/icons";

import { useLocalStorage } from "@/hooks/useLocalStorage";

import type { ServerMessage } from "@/schemas/dashboard";

import { STORAGE_KEYS } from "@/utils/constants";

const MessageText = ({ message }: { message: ServerMessage }) => (
  <>
    <strong className="font-semibold text-foreground">
      {message.title}
      {message.description && (
        <icons.Dot className="mb-1 hidden h-3 w-3 sm:mx-0.5 sm:inline sm:h-5 sm:w-5" />
      )}
    </strong>
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

    const show = !dismissedMessages.includes(message.messageId);

    const onDismiss = () => {
      setDismissedMessages((data) => [...data, message.messageId]);
    };

    if (!show) return null;

    return (
      <article className="mx-auto flex w-full max-w-[1700px] flex-1 items-center gap-6 pb-2.5 pl-3.5 pr-1 pt-3 md:px-16">
        {message.link ? (
          <a
            href={message.link}
            className="[text-wrap=balance] group flex flex-1 flex-col flex-wrap items-start text-base leading-normal text-bannerPromo-foreground sm:flex-row sm:items-center"
            target={message.link.startsWith("http") ? "_blank" : "_self"}
            rel="noopener noreferrer"
          >
            <MessageText message={message} />
          </a>
        ) : (
          <p className="flex flex-1 flex-col flex-wrap items-start text-base leading-normal text-bannerPromo-foreground sm:flex-row sm:items-center">
            <MessageText message={message} />
          </p>
        )}
        <div className="flex justify-end">
          <button
            className="p-3 text-foreground hover:text-foreground/70"
            onClick={onDismiss}
          >
            <icons.X className="h-4 w-4" />
          </button>
        </div>
      </article>
    );
  }
);
