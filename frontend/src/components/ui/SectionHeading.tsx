import type {
  ReactNode,
} from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  align?: 'start' | 'center';
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  meta,
  align = 'start',
}: SectionHeadingProps) {
  return (
    <header
      className={`section-heading section-heading--${align}`}
    >
      <div className="section-heading__copy">
        {eyebrow && (
          <span className="eyebrow">
            {eyebrow}
          </span>
        )}

        <h2>{title}</h2>

        {description && (
          <p>{description}</p>
        )}
      </div>

      {meta && (
        <div className="section-heading__meta">
          {meta}
        </div>
      )}
    </header>
  );
}
