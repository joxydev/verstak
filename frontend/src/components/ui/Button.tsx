import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";

export type ButtonSize = "small" | "medium" | "large";

interface ButtonClassOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
}

export function buttonClassName({
  variant = "primary",
  size = "medium",
  block = false,
  className = "",
}: ButtonClassOptions = {}): string {
  return [
    "button",
    `button--${variant}`,
    `button--${size}`,
    block ? "button--block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "medium",
      block = false,
      className,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={buttonClassName({
          variant,
          size,
          block,
          className,
        })}
      />
    );
  },
);
