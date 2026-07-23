interface NoticeProps {
  message: string | null;
  tone?: "success" | "error" | "info" | "warning";
  onDismiss?: () => void;
}

const marks = {
  success: "✓",
  error: "!",
  info: "i",
  warning: "!",
} as const;

export function Notice({ message, tone = "info", onDismiss }: NoticeProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`notice notice--${tone}`}
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
    >
      <span className="notice__mark" aria-hidden="true">
        {marks[tone]}
      </span>

      <p>{message}</p>

      {onDismiss && (
        <button
          className="notice__close"
          type="button"
          aria-label="Закрыть уведомление"
          onClick={onDismiss}
        >
          ×
        </button>
      )}
    </div>
  );
}
