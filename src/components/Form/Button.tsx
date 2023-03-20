import { forwardRef, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import classNames from "classnames";
import { Link, type LinkPropsOptions } from "@tanstack/react-router";

const buttonStyles = cva(
  "flex justify-center h-max rounded border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      color: {
        teal: "bg-teal-500 hover:bg-teal-600 focus:ring-teal-500",
        gray: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500",
        slate:
          "bg-slate-400 text-slate-900 hover:bg-slate-500 focus:ring-slate-500",
        "dark-gray": "bg-slate-900 text-white hover:bg-slate-700",
        red: "bg-red-500 hover:bg-red-600 focus:ring-red-500",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      disabled: {
        true: "disabled:cursor-not-allowed disabled:border-gray-200",
        false: "",
      },
    },
    compoundVariants: [
      {
        color: "teal",
        disabled: true,
        className:
          "disabled:bg-teal-800 disabled:text-gray-200 disabled:opacity-75",
      },
      {
        color: "gray",
        disabled: true,
        className:
          "disabled:bg-gray-500 disabled:text-gray-200 disabled:opacity-75",
      },
      {
        color: "slate",
        disabled: true,
        className:
          "disabled:bg-slate-300 disabled:text-slate-200 disabled:opacity-75 disabled:shadow-none",
      },
      {
        color: "dark-gray",
        disabled: true,
        className: "disabled:bg-slate-700 disabled:shadow-none",
      },
      {
        color: "red",
        disabled: true,
        className: "disabled:bg-red-800 disabled:shadow-none",
      },
    ],
    defaultVariants: {
      color: "dark-gray",
      fullWidth: false,
      disabled: false,
    },
  }
);

interface CustomButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

type ButtonProps = CustomButtonProps & VariantProps<typeof buttonStyles>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      children,
      type = "button",
      color,
      disabled,
      fullWidth,
      className,
      ...otherProps
    } = props;
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={classNames(
          buttonStyles({ fullWidth, disabled, color }),
          className
        )}
        {...otherProps}
      >
        {children}
      </button>
    );
  }
);

type CustomLinkButtonProps = LinkPropsOptions & {
  children: ReactNode;
  className?: string;
};

export const LinkButton = forwardRef<
  HTMLAnchorElement,
  CustomLinkButtonProps & VariantProps<typeof buttonStyles>
>((props, ref) => {
  const { children, color, disabled, fullWidth, className, ...otherProps } =
    props;
  return (
    <Link
      ref={ref}
      {...otherProps}
      className={classNames(
        buttonStyles({ fullWidth, disabled, color }),
        className
      )}
      disabled={disabled}
    >
      {children}
    </Link>
  );
});
