import React from "react";

import { Checkbox } from "@/components/ui/checkbox";

function InputCheckbox(props: {
  label: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  const id = React.useId();

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={props.checked}
        onCheckedChange={props.onCheckedChange}
        disabled={props.disabled}
      />
      <label
        htmlFor={id}
        className="break-before-left text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {props.label}
      </label>
    </div>
  );
}

export { InputCheckbox };
