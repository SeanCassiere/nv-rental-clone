import React from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LocationEditDialogProps {
  mode: "new" | "edit";
  open: boolean;
  setOpen: (open: boolean) => void;
  clientId: string;
  userId: string;
  locationId: string;
}

export function LocationEditDialog(props: LocationEditDialogProps) {
  const { open, setOpen } = props;

  const { t } = useTranslation();

  const formId = React.useId();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {props.mode === "edit"
              ? t("titles.editLocation", {
                  ns: "settings",
                })
              : t("titles.newLocation", {
                  ns: "settings",
                })}
          </DialogTitle>
          <DialogDescription>
            {props.mode === "edit"
              ? t("descriptions.editLocation", {
                  ns: "settings",
                })
              : t("descriptions.newLocation", {
                  ns: "settings",
                })}
          </DialogDescription>
        </DialogHeader>
        <div>Content here</div>
        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            type="button"
            onClick={() => setOpen(false)}
            // disabled={
            //   props.mode === "edit" ? editModeDisabled : createModeDisabled
            // }
            // aria-disabled={
            //   props.mode === "edit" ? editModeDisabled : createModeDisabled
            // }
          >
            {t("buttons.cancel", { ns: "labels" })}
          </Button>
          <Button
            type="submit"
            form={formId}
            // aria-disabled={
            //   props.mode === "edit" ? editModeDisabled : createModeDisabled
            // }
          >
            {/* {isUpdateMutationActive && (
              <icons.Loading className="mr-2 h-4 w-4 animate-spin" />
            )} */}
            {props.mode === "edit"
              ? t("buttons.saveChanges", { ns: "labels" })
              : t("buttons.save", { ns: "labels" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
