import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { apiClient } from "@/api";
import { rolesStore } from "@/utils";

interface DeleteRoleAlertDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  clientId: string;
  userId: string;
  roleId: string;
}

export function DeleteRoleAlertDialog({
  open,
  setOpen,
  ...props
}: DeleteRoleAlertDialogProps) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { toast } = useToast();

  const deleteRole = useMutation({
    mutationFn: apiClient.role.deleteRole,
    onMutate: () => {
      qc.cancelQueries({
        queryKey: rolesStore.all({
          clientId: props.clientId,
          userId: props.userId,
        }).queryKey,
      });
    },
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
    onSettled: () => {
      qc.invalidateQueries({
        queryKey: rolesStore.all({
          clientId: props.clientId,
          userId: props.userId,
        }).queryKey,
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("titles.deleteUserRole", { ns: "settings" })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("descriptions.deleteUserRole", { ns: "settings" })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("buttons.cancel", { ns: "labels" })}
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={(evt) => {
              evt.preventDefault();

              deleteRole.mutate({
                params: {
                  roleId: props.roleId,
                },
              });
            }}
          >
            {deleteRole.isLoading && (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>{t("buttons.confirm", { ns: "labels" })}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
