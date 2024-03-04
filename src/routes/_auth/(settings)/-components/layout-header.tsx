import React from "react";

type SettingsLayoutHeaderProps = {
  title: string;
  subtitle?: string;
};

export function SettingsLayoutHeader(props: SettingsLayoutHeaderProps) {
  const { title, subtitle } = props;
  return (
    <React.Fragment>
      <h2 className="text-xl font-semibold leading-10">{title}</h2>
      {subtitle ? (
        <p className="text-base text-foreground/80">{subtitle}</p>
      ) : null}
    </React.Fragment>
  );
}
