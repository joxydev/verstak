import { formatDateTime } from "../../utils/format";

interface AdminStatsProps {
  total: number;
  published: number;
  drafts: number;
  lastUpdated: string | null;
}

export function AdminStats({
  total,
  published,
  drafts,
  lastUpdated,
}: AdminStatsProps) {
  const stats = [
    {
      label: "Всего товаров",
      value: String(total),
    },
    {
      label: "Опубликовано",
      value: String(published),
    },
    {
      label: "Черновики",
      value: String(drafts),
    },
    {
      label: "Последнее изменение",
      value: lastUpdated ? formatDateTime(lastUpdated) : "—",
      compact: true,
    },
  ];

  return (
    <section className="admin-stats" aria-label="Статистика каталога">
      {stats.map((stat) => (
        <article
          className={[
            "admin-stat-card",
            stat.compact ? "admin-stat-card--compact" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          key={stat.label}
        >
          <span>{stat.label}</span>

          <strong>{stat.value}</strong>
        </article>
      ))}
    </section>
  );
}
