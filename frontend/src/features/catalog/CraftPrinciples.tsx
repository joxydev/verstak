const principles = [
  {
    number: "01",
    title: "Натуральный материал",
    description:
      "Рисунок и характер древесины становятся частью композиции, а не скрываются под декоративными эффектами.",
  },
  {
    number: "02",
    title: "Точность изготовления",
    description:
      "Резьба, соединения, фурнитура и пропорции прорабатываются как единая конструкция.",
  },
  {
    number: "03",
    title: "Работа на долгий срок",
    description:
      "Изделия создаются как предметы для дома, коллекции и передачи следующему поколению.",
  },
];

export function CraftPrinciples() {
  return (
    <section className="craft-principles">
      <div className="container">
        <header className="craft-principles__heading">
          <span className="eyebrow">Принципы работы</span>

          <h2>Качество начинается до первого реза</h2>
        </header>

        <div className="craft-principles__grid">
          {principles.map((principle) => (
            <article className="craft-principle" key={principle.number}>
              <span>{principle.number}</span>

              <h3>{principle.title}</h3>

              <p>{principle.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
