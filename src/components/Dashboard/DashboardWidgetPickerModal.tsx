import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { type DashboardWidgetItemParsed } from "../../utils/schemas/dashboard";

const DashboardWidgetPickerModal = ({
  show = false,
  widgets,
  onModalStateChange,
}: {
  show: boolean | undefined;
  widgets: DashboardWidgetItemParsed[];
  onModalStateChange: (show: boolean) => void;
}) => {
  return (
    <Transition show={show} as={Fragment}>
      <Dialog onClose={() => onModalStateChange(false)} className="relative">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-40 bg-black/30" />
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
          <Dialog.Panel className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="w-full max-w-md rounded bg-white p-4">
              <Dialog.Title className="">Customize widgets</Dialog.Title>
              <Dialog.Description>
                Select and order the widgets you want to see on your dashboard.
              </Dialog.Description>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default DashboardWidgetPickerModal;
