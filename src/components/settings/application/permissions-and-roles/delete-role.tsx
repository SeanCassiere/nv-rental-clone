import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { buttonVariants } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";

import { fetchRolesListOptions } from "@/utils/query/role";

import { apiClient } from "@/api";

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

  const authParams = {
    clientId: props.clientId,
    userId: props.userId,
  };

  const deleteRole = useMutation({
    mutationFn: apiClient.role.deleteRole,
    onMutate: () => {
      qc.cancelQueries({
        queryKey: fetchRolesListOptions({
          auth: authParams,
        }).queryKey,
      });
    },
    onSuccess: () => {
      toast.success(
        t("labelDeleted", {
          ns: "messages",
          label: t("labels.role", { ns: "settings" }),
        })
      );

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
    onSettled: () => {
      qc.invalidateQueries({
        queryKey: fetchRolesListOptions({
          auth: authParams,
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
          <AlertDialogCancel
            disabled={deleteRole.isPending}
            aria-disabled={deleteRole.isPending}
          >
            {t("buttons.cancel", { ns: "labels" })}
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            aria-disabled={deleteRole.isPending}
            onClick={(evt) => {
              evt.preventDefault();

              if (deleteRole.isPending) return;

              deleteRole.mutate({
                params: {
                  roleId: props.roleId,
                },
              });
            }}
          >
            {deleteRole.isPending && (
              <icons.Loading className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>{t("buttons.confirm", { ns: "labels" })}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
