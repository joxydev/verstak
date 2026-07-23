interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <div
        className="category-filter__scroll"
        role="group"
        aria-label="Фильтр каталога по категориям"
      >
        {categories.map((category) => (
          <button
            className={[
              "category-filter__button",
              selected === category ? "category-filter__button--active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            key={category}
            type="button"
            aria-pressed={selected === category}
            onClick={() => onChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <label className="category-filter__select">
        <span>Категория</span>

        <select
          value={selected}
          onChange={(event) => onChange(event.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
