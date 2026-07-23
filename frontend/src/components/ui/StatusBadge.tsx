interface StatusBadgeProps {
  published: boolean;
}

export function StatusBadge({ published }: StatusBadgeProps) {
  return (
    <span
      className={[
        "status-badge",
        published ? "status-badge--published" : "status-badge--draft",
      ].join(" ")}
    >
      <span className="status-badge__dot" aria-hidden="true" />

      {published ? "Опубликован" : "Черновик"}
    </span>
  );
}
