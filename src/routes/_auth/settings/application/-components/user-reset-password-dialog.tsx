import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { icons } from "@/components/ui/icons";

import type { TUserConfigurations } from "@/lib/schemas/user";

import { localDateTimeToQueryYearMonthDay } from "@/lib/utils/date";

import { apiClient } from "@/lib/api";

interface UserResetPasswordDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  clientId: string;
  userId: string;
  user: TUserConfigurations[number];
}

export function UserResetPasswordDialog({
  open,
  setOpen,
  user,
  ...props
}: UserResetPasswordDialogProps) {
  const { t } = useTranslation();

  const resetPassword = useMutation({
    mutationFn: apiClient.user.sendResetPasswordLink,
    onSuccess: () => {
      toast.success(t("titles.sentResetPassword", { ns: "settings" }));

      setOpen(false);
    },
    onError: (err) => {
      toast.error(t("somethingWentWrong", { ns: "messages" }), {
        description:
          err instanceof Error && "message" in err
            ? err?.message
            : t("pleaseTryAgain", { ns: "messages" }),
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("titles.resetPasswordConfirmation", { ns: "settings" })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("descriptions.resetPasswordConfirmation", { ns: "settings" })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            aria-disabled={resetPassword.isPending}
            disabled={resetPassword.isPending}
          >
            {t("buttons.cancel", { ns: "labels" })}
          </AlertDialogCancel>
          <AlertDialogAction
            aria-disabled={resetPassword.isPending}
            onClick={(evt) => {
              evt.preventDefault();

              if (!user.email) {
                setOpen(false);
                return;
              }

              if (resetPassword.isPending) return;

              resetPassword.mutate({
                body: {
                  clientId: props.clientId,
                  updatedBy: props.userId,
                  clientTime: localDateTimeToQueryYearMonthDay(new Date()),
                  userId: String(user.userID),
                  email: user.email,
                  userName: user.userName,
                },
              });
            }}
          >
            {resetPassword.isPending && (
              <icons.Loading className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>{t("labels.sendResetLink", { ns: "settings" })}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
