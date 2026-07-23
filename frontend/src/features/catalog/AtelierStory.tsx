import { BrandLogo } from "../../components/BrandLogo";
import { SECTIONS } from "../../routes";

export function AtelierStory() {
  return (
    <section id={SECTIONS.atelier} className="atelier-story">
      <div className="container atelier-story__grid">
        <div className="atelier-story__identity">
          <BrandLogo />

          <span className="atelier-story__monogram" aria-hidden="true">
            V
          </span>
        </div>

        <div className="atelier-story__copy">
          <span className="eyebrow">Мастерская VERSTAK</span>

          <h2>Ремесло, в котором важна каждая деталь</h2>

          <p>
            VERSTAK объединяет художественную работу с деревом, точность
            современного производства и уважение к традиционному ремеслу.
          </p>

          <p>
            Каждое изделие проходит путь от выбора материала до ручной финишной
            обработки в мастерской в Молдове.
          </p>

          <dl className="atelier-story__facts">
            <div>
              <dt>Материалы</dt>
              <dd>Бук, ясень, орех и другие породы</dd>
            </div>

            <div>
              <dt>Подход</dt>
              <dd>Собственное производство</dd>
            </div>

            <div>
              <dt>Заказ</dt>
              <dd>Возможность индивидуальной работы</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
