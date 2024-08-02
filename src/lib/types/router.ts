export type LinkComponentProps<TComp> = React.PropsWithoutRef<
  TComp extends React.FC<infer TProps> | React.Component<infer TProps>
    ? TProps
    : TComp extends keyof JSX.IntrinsicElements
      ? Omit<React.HTMLProps<TComp>, "children" | "preload">
      : never
> &
  React.RefAttributes<
    TComp extends
      | React.FC<{ ref: infer TRef }>
      | React.Component<{ ref: infer TRef }>
      ? TRef
      : TComp extends keyof JSX.IntrinsicElements
        ? React.ComponentRef<TComp>
        : never
  >;
