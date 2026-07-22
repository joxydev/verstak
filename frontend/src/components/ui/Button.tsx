import type {
  ButtonHTMLAttributes,
} from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'quiet'
  | 'danger';

export type ButtonSize =
  | 'small'
  | 'medium'
  | 'large';

interface ButtonClassOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
}

export function buttonClassName({
  variant = 'primary',
  size = 'medium',
  block = false,
  className = '',
}: ButtonClassOptions = {}): string {
  return [
    'button',
    `button--${variant}`,
    `button--${size}`,
    block ? 'button--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  block = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={buttonClassName({
        variant,
        size,
        block,
        className,
      })}
    />
  );
}
