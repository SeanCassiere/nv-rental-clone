import * as React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { icons } from "@/components/ui/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

const InputSelectCtx = React.createContext<{
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  items: { id: string; value: string; label: string }[];
  setOpen: (open: boolean) => void;
} | null>(null);

function useInputSelectCtx() {
  const ctx = React.useContext(InputSelectCtx);
  if (!ctx) {
    throw new Error("useInputSelectCtx must be used within a InputSelectCtx");
  }
  return ctx;
}

interface InputSelectProps {
  children: React.ReactNode;
  items: { id: string; value: string; label: string }[];
  defaultValue?: string | undefined;
  onValueChange?: (val: string) => void;
  disabled?: boolean;
  placeholder?: string;
}
function InputSelect({
  children,
  defaultValue,
  onValueChange,
  disabled,
  placeholder,
  items,
}: InputSelectProps) {
  const [open, setOpen] = React.useState(false);
  const onChange = (val: string) => {
    onValueChange?.(val);
  };

  return (
    <InputSelectCtx.Provider
      value={{
        value: defaultValue,
        onChange,
        disabled,
        placeholder,
        items,
        setOpen,
      }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </InputSelectCtx.Provider>
  );
}

const InputSelectTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverTrigger>,
  React.ComponentPropsWithoutRef<typeof PopoverTrigger>
>(({ className, disabled, ...props }, ref) => {
  const {
    placeholder,
    disabled: _disabled,
    items,
    value,
  } = useInputSelectCtx();

  const selected = items.find((item) => item.value === value);

  return (
    <PopoverTrigger
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      disabled={disabled ?? _disabled}
      {...props}
    >
      {selected?.label ?? placeholder ?? "Select an option"}
      <icons.ChevronDown className="h-4 w-4 opacity-50" />
    </PopoverTrigger>
  );
});

function InputSelectContent({
  className,
  ...props
}: Parameters<typeof PopoverContent>[0]) {
  const {
    placeholder,
    items,
    value: _selectedValue,
    onChange,
    setOpen,
  } = useInputSelectCtx();
  return (
    <PopoverContent
      align="start"
      className={cn("w-full p-0", className)}
      {...props}
    >
      <Command>
        <CommandInput className="h-8" placeholder={placeholder} />
        <CommandList>
          <CommandEmpty>
            <span className="text-muted-foreground">No results</span>
          </CommandEmpty>
          <CommandGroup>
            {items.map(({ value, label, id }) => {
              const isSelected = value === _selectedValue;

              return (
                <CommandItem
                  key={id}
                  value={label}
                  onSelect={() => {
                    onChange(value);
                    setOpen(false);
                  }}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-3 w-3 items-center justify-center rounded-full border border-primary/70",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <icons.Check className={cn("h-4 w-4")} />
                  </div>
                  <span>{label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  );
}

export { InputSelect, InputSelectTrigger, InputSelectContent };
