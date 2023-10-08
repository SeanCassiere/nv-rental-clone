import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

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
import { useToast } from "@/components/ui/use-toast";

import type { TUserConfigurations } from "@/schemas/user";

import { localDateTimeToQueryYearMonthDay } from "@/utils/date";

import { apiClient } from "@/api";

interface ResetPasswordAlertDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  clientId: string;
  userId: string;
  user: TUserConfigurations[number];
}

export function ResetPasswordAlertDialog({
  open,
  setOpen,
  user,
  ...props
}: ResetPasswordAlertDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const resetPassword = useMutation({
    mutationFn: apiClient.user.sendResetPasswordLink,
    onSuccess: () => {
      setOpen(false);
    },
    onError: (err) => {
      toast({
        title: t("somethingWentWrong", { ns: "messages" }),
        description:
          err instanceof Error && "message" in err
            ? err?.message
            : t("pleaseTryAgain", { ns: "messages" }),
        variant: "destructive",
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
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>{t("labels.sendResetLink", { ns: "settings" })}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
