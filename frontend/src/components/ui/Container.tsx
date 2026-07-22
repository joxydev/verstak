import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

interface ContainerProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: 'default' | 'narrow' | 'wide';
}

export function Container({
  children,
  size = 'default',
  className = '',
  ...props
}: ContainerProps) {
  return (
    <div
      {...props}
      className={[
        'container',
        `container--${size}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
