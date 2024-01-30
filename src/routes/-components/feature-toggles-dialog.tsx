import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { icons } from "@/components/ui/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useLocalStorage } from "@/hooks/useLocalStorage";

import { featureFlags, type DropdownFeatureFlag } from "@/utils/features";

import { useGlobalDialogContext } from "@/context/modals";

export function FeatureTogglesDialog() {
  const { showFeatureFlags, setShowFeatureFlags } = useGlobalDialogContext();

  return (
    <React.Fragment>
      <Dialog open={showFeatureFlags} onOpenChange={setShowFeatureFlags}>
        <DialogContent className="md:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <icons.Experimental className="h-4 w-4" />
              Experimental features
            </DialogTitle>
            <DialogDescription>
              These features are experimental and may not work as expected. Use
              at your own risk.
            </DialogDescription>
          </DialogHeader>
          <ul
            role="list"
            className="min-h-96 max-w-full divide-y divide-muted overflow-x-auto"
          >
            {featureFlags.map((feature, idx) => {
              if (feature.input_type === "dropdown") {
                return (
                  <DropdownFeatureInput
                    key={`feature_toggle_${feature.id}_${idx}`}
                    feature={feature}
                  />
                );
              }

              if (feature.input_type === "string") {
                return null;
              }

              return null;
            })}
          </ul>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

interface DropdownFeatureInputProps {
  feature: DropdownFeatureFlag;
}

function DropdownFeatureInput(props: DropdownFeatureInputProps) {
  const { feature } = props;

  const [value, setValue] = useLocalStorage(feature.id, feature.default_value);

  const [editValue, onEditValueChange] = React.useState(value);

  const handleResetToDefault = React.useCallback(() => {
    window.localStorage.removeItem(feature.id);
    onEditValueChange(feature.default_value);
  }, [feature.default_value, feature.id]);

  const handleSave = React.useCallback(() => {
    if (editValue === feature.default_value) {
      handleResetToDefault();
      return;
    }
    setValue(editValue);
  }, [editValue, feature.default_value, handleResetToDefault, setValue]);

  return (
    <li className="flex max-w-full flex-col items-center justify-between gap-x-6 gap-y-2 py-2 md:flex-row">
      <div className="flex min-w-0 flex-col text-sm">
        <p className="font-semibold leading-6 text-foreground">
          {feature.name}
        </p>
        <p className="mt-1 leading-5 text-muted-foreground">
          {feature.description}
        </p>
      </div>
      <div className="flex items-center justify-center gap-2 md:min-w-32 md:grow-0 md:flex-col md:pr-1">
        <Select value={editValue} onValueChange={onEditValueChange}>
          <SelectTrigger className="w-full md:h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {feature.options.map((option, idx) => (
              <SelectItem
                key={`${feature.id}_option_${option}_${idx}`}
                value={option}
              >
                {option}
                {option === feature.default_value ? " (default)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="md:h-7 md:w-7"
            onClick={handleResetToDefault}
          >
            <icons.RotateBackwards className="h-3.5 w-3.5" />
            <span className="sr-only">Reset</span>
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="md:h-7 md:w-7"
            onClick={handleSave}
          >
            <icons.Save className="h-3.5 w-3.5" />
            <span className="sr-only">Save</span>
          </Button>
        </div>
      </div>
    </li>
  );
}
