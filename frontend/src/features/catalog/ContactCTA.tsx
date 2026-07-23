import { buttonClassName } from "../../components/ui/Button";
import { SECTIONS } from "../../routes";

interface ContactCTAProps {
  contactLink: string;
}

export function ContactCTA({ contactLink }: ContactCTAProps) {
  return (
    <section id={SECTIONS.contact} className="contact-cta">
      <div className="container contact-cta__inner">
        <div className="contact-cta__copy">
          <span className="eyebrow">Индивидуальный заказ</span>

          <h2>Обсудим ваше изделие</h2>

          <p>
            Уточните наличие, стоимость доставки или возможность изготовления
            работы по индивидуальной идее.
          </p>
        </div>

        <div className="contact-cta__action">
          <a
            className={buttonClassName({
              variant: "secondary",
              size: "large",
              block: true,
            })}
            href={contactLink}
            target="_blank"
            rel="noreferrer"
          >
            Написать в Telegram
            <span aria-hidden="true">↗</span>
          </a>

          <small>Откроется диалог с представителем мастерской</small>
        </div>
      </div>
    </section>
  );
}
