import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { EmptyState } from "@/components/layouts/empty-state";
import { Badge } from "@/components/ui/badge";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  notifyLocalStorageChange,
  useLocalStorage,
} from "@/lib/hooks/useLocalStorage";
import { useGlobalDialogContext } from "@/lib/context/modals";

import {
  featureFlags,
  type DropdownFeatureFlag,
  type StringFeatureFlag,
  type SwitchFeatureFlag,
} from "@/lib/config/features";

export function FeatureTogglesDialog() {
  const { t } = useTranslation();

  const { showFeatureFlags, setShowFeatureFlags } = useGlobalDialogContext();

  return (
    <React.Fragment>
      <Dialog open={showFeatureFlags} onOpenChange={setShowFeatureFlags}>
        <DialogContent className="md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t("titles.experimentalFeatures", { ns: "translation" })}
            </DialogTitle>
            <DialogDescription>
              {t("descriptions.experimentalFeatures", { ns: "translation" })}
            </DialogDescription>
          </DialogHeader>
          <ul
            role="list"
            className="min-h-96 max-w-full divide-y divide-muted overflow-x-auto md:max-h-[80dvh]"
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
    notifyLocalStorageChange({ key: feature.id });
    toast.info(
      t("labelFeatureReset", { ns: "messages", label: feature.name }),
      TOAST_DISMISS_OPTIONS
    );
  }, [feature.default_value, feature.id, feature.name, t]);

  const handleSave = React.useCallback(() => {
    if (editValue === feature.default_value) {
      window.localStorage.removeItem(feature.id);
      onEditValueChange(feature.default_value);
      notifyLocalStorageChange({ key: feature.id });
    } else {
      setValue(editValue);
    }
    toast.info(
      t("labelFeatureUpdated", { ns: "messages", label: feature.name }),
      TOAST_DISMISS_OPTIONS
    );
  }, [editValue, feature.default_value, feature.id, feature.name, setValue, t]);

  const isTouched = value !== editValue;
  const isDiffering = value !== feature.default_value;

  const resetBtnLabel = `${t("buttons.reset", { ns: "labels" })} ${feature.name}`;
  const saveBtnLabel = `${t("buttons.save", { ns: "labels" })} ${feature.name}`;

  return (
    <li className="flex max-w-full flex-col items-center justify-between gap-x-6 gap-y-2 py-2 md:flex-row">
      <div className="flex min-w-0 flex-col gap-y-1 text-sm">
        <p className="font-semibold leading-6 text-foreground">
          {isDiffering ? <icons.Check className="mr-2 inline h-3 w-3" /> : null}
          {feature.name}
          {isTouched ? (
            <icons.Alert className="ml-2 inline h-3 w-3 text-destructive" />
          ) : null}
        </p>
        <p className="leading-5 text-muted-foreground">{feature.description}</p>
        <Badge variant="outline" className="w-min truncate">
          {feature.id}
        </Badge>
      </div>
      <div className="flex w-full items-center justify-end gap-2 px-1 md:min-w-32 md:max-w-32 md:grow-0 md:flex-col md:justify-center">
        <Input
          className="w-full md:h-8"
          value={editValue}
          onChange={(evt) => onEditValueChange(evt.target.value)}
        />
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="md:h-7 md:w-7"
                onClick={handleResetToDefault}
              >
                <icons.RotateBackwards className="h-3.5 w-3.5" />
                <span className="sr-only">{resetBtnLabel}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end" side="bottom">
              <p>{resetBtnLabel}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant={isTouched ? "default" : "outline"}
                className="md:h-7 md:w-7"
                onClick={handleSave}
              >
                <icons.Save className="h-3.5 w-3.5" />
                <span className="sr-only">{saveBtnLabel}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end" side="bottom">
              <p>{saveBtnLabel}</p>
            </TooltipContent>
          </Tooltip>
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
    notifyLocalStorageChange({ key: feature.id });
    toast.info(
      t("labelFeatureReset", { ns: "messages", label: feature.name }),
      TOAST_DISMISS_OPTIONS
    );
  }, [feature.default_value, feature.id, feature.name, t]);

  const handleSave = React.useCallback(() => {
    if (editValue === feature.default_value) {
      window.localStorage.removeItem(feature.id);
      onEditValueChange(feature.default_value);
      notifyLocalStorageChange({ key: feature.id });
    } else {
      setValue(editValue);
    }
    toast.info(
      t("labelFeatureUpdated", { ns: "messages", label: feature.name }),
      TOAST_DISMISS_OPTIONS
    );
  }, [editValue, feature.default_value, feature.id, feature.name, setValue, t]);

  const isTouched = value !== editValue;
  const isDiffering = value !== feature.default_value;

  const resetBtnLabel = `${t("buttons.reset", { ns: "labels" })} ${feature.name}`;
  const saveBtnLabel = `${t("buttons.save", { ns: "labels" })} ${feature.name}`;

  return (
    <li className="flex max-w-full flex-col items-center justify-between gap-x-6 gap-y-2 py-2 md:flex-row">
      <div className="flex min-w-0 flex-col gap-y-1 text-sm">
        <p className="font-semibold leading-6 text-foreground">
          {isDiffering ? <icons.Check className="mr-2 inline h-3 w-3" /> : null}
          {feature.name}
          {isTouched ? (
            <icons.Alert className="ml-2 inline h-3 w-3 text-destructive" />
          ) : null}
        </p>
        <p className="leading-5 text-muted-foreground">{feature.description}</p>
        <Badge variant="outline" className="w-min truncate">
          {feature.id}
        </Badge>
      </div>
      <div className="flex w-full items-center justify-end gap-2 px-1 md:min-w-32 md:max-w-32 md:grow-0 md:flex-col md:justify-center">
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="md:h-7 md:w-7"
                onClick={handleResetToDefault}
              >
                <icons.RotateBackwards className="h-3.5 w-3.5" />
                <span className="sr-only">{resetBtnLabel}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end" side="bottom">
              <p>{resetBtnLabel}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant={isTouched ? "default" : "outline"}
                className="md:h-7 md:w-7"
                onClick={handleSave}
              >
                <icons.Save className="h-3.5 w-3.5" />
                <span className="sr-only">{saveBtnLabel}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end" side="bottom">
              <p>{saveBtnLabel}</p>
            </TooltipContent>
          </Tooltip>
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
    notifyLocalStorageChange({ key: feature.id });
    toast.info(
      t("labelFeatureReset", { ns: "messages", label: feature.name }),
      TOAST_DISMISS_OPTIONS
    );
  }, [feature.default_value, feature.id, feature.name, t]);

  const handleSave = React.useCallback(() => {
    if (editValue === feature.default_value) {
      window.localStorage.removeItem(feature.id);
      onEditValueChange(feature.default_value);
      notifyLocalStorageChange({ key: feature.id });
    } else {
      setValue(editValue);
    }
    toast.info(
      t("labelFeatureUpdated", { ns: "messages", label: feature.name }),
      TOAST_DISMISS_OPTIONS
    );
  }, [editValue, feature.default_value, feature.id, feature.name, setValue, t]);

  const isTouched = value !== editValue;
  const isDiffering = value !== feature.default_value;

  const resetBtnLabel = `${t("buttons.reset", { ns: "labels" })} ${feature.name}`;
  const saveBtnLabel = `${t("buttons.save", { ns: "labels" })} ${feature.name}`;

  return (
    <li className="flex max-w-full flex-col items-center justify-between gap-x-6 gap-y-2 py-2 md:flex-row">
      <div className="flex min-w-0 flex-col gap-y-1 text-sm">
        <p className="font-semibold leading-6 text-foreground">
          {isDiffering ? <icons.Check className="mr-2 inline h-3 w-3" /> : null}
          {feature.name}
          {isTouched ? (
            <icons.Alert className="ml-2 inline h-3 w-3 text-destructive" />
          ) : null}
        </p>
        <p className="leading-5 text-muted-foreground">{feature.description}</p>
        <Badge variant="outline" className="w-min truncate">
          {feature.id}
        </Badge>
      </div>
      <div className="flex w-full items-center justify-end gap-2 px-1 md:min-w-32 md:max-w-32 md:grow-0 md:flex-col md:justify-center">
        <Switch checked={editValue} onCheckedChange={onEditValueChange} />
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="md:h-7 md:w-7"
                onClick={handleResetToDefault}
              >
                <icons.RotateBackwards className="h-3.5 w-3.5" />
                <span className="sr-only">{resetBtnLabel}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end" side="bottom">
              <p>{resetBtnLabel}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant={isTouched ? "default" : "outline"}
                className="md:h-7 md:w-7"
                onClick={handleSave}
              >
                <icons.Save className="h-3.5 w-3.5" />
                <span className="sr-only">{saveBtnLabel}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end" side="bottom">
              <p>{saveBtnLabel}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </li>
  );
}
