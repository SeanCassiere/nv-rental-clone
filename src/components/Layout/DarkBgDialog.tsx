import { Fragment, type ReactNode } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { XIcon } from "lucide-react";

import { cn } from "@/utils";

interface DarkBgDialogProps {
  title: ReactNode;
  description?: ReactNode;
  show: boolean;
  onClose?: () => void;
  setShow: (showState: boolean) => void;
  restrictClose?: boolean;
  children?: ReactNode;
  sizing?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  hideCloseBtn?: boolean;
}

const DarkBgDialog = (props: DarkBgDialogProps) => {
  const restrictClose = props.restrictClose ?? false;
  const sizing = props.sizing ?? "md";
  const hideCloseBtn = props.hideCloseBtn ?? false;

  const handleClose = () => {
    if (!restrictClose) {
      props?.onClose?.();
    }
  };

  return (
    <Transition show={props.show} as={Fragment}>
      <Dialog onClose={handleClose} className="relative">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-10 bg-black/30" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 z-10 flex w-full items-center justify-center">
            <Dialog.Panel className="mx-1 md:mx-4">
              <div
                className={cn(
                  "max-w-sm",
                  {
                    "md:max-w-xs": sizing === "xs",
                    "md:max-w-sm": sizing === "sm",
                    "md:max-w-md": sizing === "md",
                    "md:max-w-lg": sizing === "lg",
                    "md:max-w-xl": sizing === "xl",
                    "md:max-w-2xl": sizing === "2xl",
                    "md:max-w-3xl": sizing === "3xl",
                    "md:max-w-4xl": sizing === "4xl",
                    "md:max-w-5xl": sizing === "5xl",
                  },
                  "w-full rounded bg-white p-4"
                )}
              >
                <Dialog.Title className="flex w-full items-center justify-between">
                  <div className="flex select-none items-center pr-2 text-xl font-semibold leading-6 text-gray-700">
                    {props.title}
                  </div>
                  {!hideCloseBtn && (
                    <div>
                      <button
                        className="rounded-full p-2 text-slate-600 focus:text-slate-900"
                        disabled={restrictClose}
                        onClick={handleClose}
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </Dialog.Title>
                {props?.description && (
                  <Dialog.Description className="mt-2 border-b border-gray-200 pb-2 text-sm text-slate-600">
                    {props.description}
                  </Dialog.Description>
                )}
                {props.children && (
                  <div className="max-h-[80vh] overflow-y-auto">
                    {props.children}
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default DarkBgDialog;
