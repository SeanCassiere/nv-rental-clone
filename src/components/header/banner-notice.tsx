import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { DotIcon, XIcon } from "lucide-react";

import type { ServerMessage } from "@/schemas/dashboard";
import {
  getLocalStorageForUser,
  setLocalStorageForUser,
} from "@/utils/user-local-storage";
import { USER_STORAGE_KEYS } from "@/utils/constants";
import { tryParseJson } from "@/utils/parse";

const MessageText = ({ message }: { message: ServerMessage }) => (
  <>
    <strong className="font-semibold text-white">
      {message.title}
      {message.description && (
        <DotIcon className="mb-1 hidden h-3 w-3 sm:mx-0.5 sm:inline sm:h-5 sm:w-5" />
      )}
    </strong>
    {message.description && (
      <span className="group-hover:underline group-hover:underline-offset-4">
        {message.description}
      </span>
    )}
  </>
);

export const BannerNotice = ({ message }: { message: ServerMessage }) => {
  const auth = useAuth();
  const [show, setShow] = useState(true);

  const onDismiss = () => {
    setShow(false);
    if (
      !auth.user?.profile.navotar_clientid ||
      !auth.user?.profile.navotar_userid
    )
      return;

    const local = getLocalStorageForUser(
      auth.user?.profile.navotar_clientid,
      auth.user?.profile.navotar_userid,
      USER_STORAGE_KEYS.dismissedMessages
    );
    const data = tryParseJson<string[]>(local, []);

    data.push(message.messageId);

    setLocalStorageForUser(
      auth.user?.profile.navotar_clientid,
      auth.user?.profile.navotar_userid,
      USER_STORAGE_KEYS.dismissedMessages,
      JSON.stringify(data)
    );
  };

  if (!show) return null;

  return (
    <article className="mx-auto flex w-full max-w-[1700px] flex-1 items-center gap-6 pb-2.5 pl-3.5 pr-1 pt-3 md:px-16">
      {message.link ? (
        <a
          href={message.link}
          className="[text-wrap=balance] group flex flex-1 flex-col flex-wrap items-start text-base leading-normal  text-white/95 sm:flex-row sm:items-center"
          target={message.link.startsWith("http") ? "_blank" : "_self"}
          rel="noopener noreferrer"
        >
          <MessageText message={message} />
        </a>
      ) : (
        <p className="flex flex-1 flex-col flex-wrap items-start text-base leading-normal text-white/95 sm:flex-row sm:items-center">
          <MessageText message={message} />
        </p>
      )}
      <div className="flex justify-end">
        <button
          className="p-3 text-white hover:text-white/70"
          onClick={onDismiss}
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
};
