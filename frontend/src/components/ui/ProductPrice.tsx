import {
  formatCurrency,
} from '../../utils/format';

interface ProductPriceProps {
  value: string | number;
  size?: 'small' | 'medium' | 'large';
}

export function ProductPrice({
  value,
  size = 'medium',
}: ProductPriceProps) {
  return (
    <span
      className={`product-price product-price--${size}`}
    >
      {formatCurrency(value)}
    </span>
  );
}
