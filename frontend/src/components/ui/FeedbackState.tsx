import type {
  ReactNode,
} from 'react';

interface FeedbackStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: 'neutral' | 'error';
  compact?: boolean;
}

export function FeedbackState({
  title,
  description,
  action,
  tone = 'neutral',
  compact = false,
}: FeedbackStateProps) {
  return (
    <section
      className={[
        'feedback-state',
        `feedback-state--${tone}`,
        compact
          ? 'feedback-state--compact'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role={
        tone === 'error'
          ? 'alert'
          : 'status'
      }
      aria-live="polite"
    >
      <span
        className="feedback-state__mark"
        aria-hidden="true"
      >
        {tone === 'error'
          ? '!'
          : 'V'}
      </span>

      <div className="feedback-state__copy">
        <h2>{title}</h2>

        {description && (
          <p>{description}</p>
        )}
      </div>

      {action && (
        <div className="feedback-state__action">
          {action}
        </div>
      )}
    </section>
  );
}
