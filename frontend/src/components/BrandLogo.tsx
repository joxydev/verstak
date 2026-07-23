interface BrandLogoProps {
  compact?: boolean;
  light?: boolean;
}

export function BrandLogo({ compact = false, light = false }: BrandLogoProps) {
  return (
    <span
      className={[
        "brand-logo",
        compact ? "brand-logo--compact" : "",
        light ? "brand-logo--light" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="brand-logo__emblem" aria-hidden="true">
        <span className="brand-logo__letter">V</span>
      </span>

      <span className="brand-logo__wordmark">
        <strong>VERSTAK</strong>

        {!compact && <small>Wood Craftsmanship · Moldova</small>}
      </span>
    </span>
  );
}
