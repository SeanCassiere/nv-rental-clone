import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { EmptyState } from "@/components/layouts/empty-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import {
  notifyLocalStorageChange,
  useLocalStorage,
} from "@/hooks/useLocalStorage";

import {
  featureFlags,
  type DropdownFeatureFlag,
  type StringFeatureFlag,
  type SwitchFeatureFlag,
} from "@/utils/features";

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
            {featureFlags.length === 0 ? (
              <EmptyState
                title="No features available"
                subtitle="There are no features currently available for activation. Please check back later for updates."
              />
            ) : (
              featureFlags.map((feature, idx) => {
                const key = `feature_toggle_${feature.id}_${idx}`;
                if (feature.input_type === "string") {
                  return <StringFeatureInput key={key} feature={feature} />;
                }

                if (feature.input_type === "dropdown") {
                  return <DropdownFeatureInput key={key} feature={feature} />;
                }

                if (feature.input_type === "switch") {
                  return <SwitchFeatureInput key={key} feature={feature} />;
                }

                return null;
              })
            )}
          </ul>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

const TOAST_DISMISS_OPTIONS = {
  dismissible: false,
  closeButton: false,
  duration: 1500,
} as const;

// Feature toggle component for the input_type "string"
interface StringFeatureInputProps {
  feature: StringFeatureFlag;
}

function StringFeatureInput(props: StringFeatureInputProps) {
  const { feature } = props;
  const { t } = useTranslation();

  const [value, setValue] = useLocalStorage(feature.id, feature.default_value);

  const [editValue, onEditValueChange] = React.useState(value);

  const handleResetToDefault = React.useCallback(() => {
    window.localStorage.removeItem(feature.id);
    onEditValueChange(feature.default_value);
    notifyLocalStorageChange();
    toast.info(
      t("labelFeatureReset", { ns: "messages", label: feature.name }),
      TOAST_DISMISS_OPTIONS
    );
  }, [feature.default_value, feature.id, feature.name, t]);

  const handleSave = React.useCallback(() => {
    if (editValue === feature.default_value) {
      window.localStorage.removeItem(feature.id);
      onEditValueChange(feature.default_value);
      notifyLocalStorageChange();
    } else {
      setValue(editValue);
    }
    toast.info(
      t("labelFeatureUpdated", { ns: "messages", label: feature.name }),
      TOAST_DISMISS_OPTIONS
    );
  }, [editValue, feature.default_value, feature.id, feature.name, setValue, t]);

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
      <div className="flex w-full items-center justify-center gap-2 px-1 md:min-w-32 md:max-w-32 md:grow-0 md:flex-col">
        <Input
          className="w-full md:h-8"
          value={editValue}
          onChange={(evt) => onEditValueChange(evt.target.value)}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="md:h-7 md:w-7"
            onClick={handleResetToDefault}
          >
            <icons.RotateBackwards className="h-3.5 w-3.5" />
            <span className="sr-only">
              {t("buttons.reset", { ns: "labels" })}
            </span>
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="md:h-7 md:w-7"
            onClick={handleSave}
          >
            <icons.Save className="h-3.5 w-3.5" />
            <span className="sr-only">
              {t("buttons.save", { ns: "labels" })}
            </span>
          </Button>
        </div>
      </div>
    </li>
  );
}

// Feature toggle component for the input_type "dropdown"
interface DropdownFeatureInputProps {
  feature: DropdownFeatureFlag;
}

function DropdownFeatureInput(props: DropdownFeatureInputProps) {
  const { feature } = props;
  const { t } = useTranslation();

  const [value, setValue] = useLocalStorage(feature.id, feature.default_value);

  const [editValue, onEditValueChange] = React.useState(value);

  const handleResetToDefault = React.useCallback(() => {
    window.localStorage.removeItem(feature.id);
    onEditValueChange(feature.default_value);
    notifyLocalStorageChange();
    toast.info(
      t("labelFeatureReset", { ns: "messages", label: feature.name }),
      TOAST_DISMISS_OPTIONS
    );
  }, [feature.default_value, feature.id, feature.name, t]);

  const handleSave = React.useCallback(() => {
    if (editValue === feature.default_value) {
      window.localStorage.removeItem(feature.id);
      onEditValueChange(feature.default_value);
      notifyLocalStorageChange();
    } else {
      setValue(editValue);
    }
    toast.info(
      t("labelFeatureUpdated", { ns: "messages", label: feature.name }),
      TOAST_DISMISS_OPTIONS
    );
  }, [editValue, feature.default_value, feature.id, feature.name, setValue, t]);

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
      <div className="flex w-full items-center justify-center gap-2 px-1 md:min-w-32 md:max-w-32 md:grow-0 md:flex-col">
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
            <span className="sr-only">
              {t("buttons.reset", { ns: "labels" })}
            </span>
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="md:h-7 md:w-7"
            onClick={handleSave}
          >
            <icons.Save className="h-3.5 w-3.5" />
            <span className="sr-only">
              {t("buttons.save", { ns: "labels" })}
            </span>
          </Button>
        </div>
      </div>
    </li>
  );
}

// Feature toggle component for the input_type "switch"
interface SwitchFeatureInputProps {
  feature: SwitchFeatureFlag;
}

function SwitchFeatureInput(props: SwitchFeatureInputProps) {
  const { feature } = props;
  const { t } = useTranslation();

  const [value, setValue] = useLocalStorage(feature.id, feature.default_value);

  const [editValue, onEditValueChange] = React.useState(value);

  const handleResetToDefault = React.useCallback(() => {
    window.localStorage.removeItem(feature.id);
    onEditValueChange(feature.default_value);
    notifyLocalStorageChange();
    toast.info(
      t("labelFeatureReset", { ns: "messages", label: feature.name }),
      TOAST_DISMISS_OPTIONS
    );
  }, [feature.default_value, feature.id, feature.name, t]);

  const handleSave = React.useCallback(() => {
    if (editValue === feature.default_value) {
      window.localStorage.removeItem(feature.id);
      onEditValueChange(feature.default_value);
      notifyLocalStorageChange();
    } else {
      setValue(editValue);
    }
    toast.info(
      t("labelFeatureUpdated", { ns: "messages", label: feature.name }),
      TOAST_DISMISS_OPTIONS
    );
  }, [editValue, feature.default_value, feature.id, feature.name, setValue, t]);

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
      <div className="flex w-full items-center justify-center gap-2 px-1 md:min-w-32 md:max-w-32 md:grow-0 md:flex-col">
        <Switch checked={editValue} onCheckedChange={onEditValueChange} />
        <div className="flex gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="md:h-7 md:w-7"
            onClick={handleResetToDefault}
          >
            <icons.RotateBackwards className="h-3.5 w-3.5" />
            <span className="sr-only">
              {t("buttons.reset", { ns: "labels" })}
            </span>
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="md:h-7 md:w-7"
            onClick={handleSave}
          >
            <icons.Save className="h-3.5 w-3.5" />
            <span className="sr-only">
              {t("buttons.save", { ns: "labels" })}
            </span>
          </Button>
        </div>
      </div>
    </li>
  );
}
