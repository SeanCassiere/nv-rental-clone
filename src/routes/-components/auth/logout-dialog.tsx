import React from "react";
import { useNavigate } from "@tanstack/react-router";

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

import { useGlobalDialogContext } from "@/lib/context/modals";

import { UI_APPLICATION_NAME } from "@/lib/utils/constants";

export default function LogoutDialog() {
  const navigate = useNavigate();
  const { showLogout, setShowLogout } = useGlobalDialogContext();

  const handleLogout = () => {
    navigate({ to: "/logout" });
  };

  return (
    <AlertDialog open={showLogout} onOpenChange={setShowLogout}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Continuing with this action will sign you out of the&nbsp;
            <strong>{UI_APPLICATION_NAME}</strong> application.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
