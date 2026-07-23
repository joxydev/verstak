import { useEffect, useState, type ImgHTMLAttributes } from "react";

interface ProductImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  src: string;
  alt: string;
  fallbackText?: string;
}

export function ProductImage({
  src,
  alt,
  className = "",
  fallbackText = "Изображение недоступно",
  ...props
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError) {
    return (
      <div
        className={[className, "image-fallback"].filter(Boolean).join(" ")}
        role={alt ? "img" : undefined}
        aria-label={alt ? `${alt}. ${fallbackText}` : undefined}
        aria-hidden={alt ? undefined : true}
      >
        <span aria-hidden="true">V</span>

        {alt && <small>{fallbackText}</small>}
      </div>
    );
  }

  return (
    <img
      {...props}
      className={className}
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
    />
  );
}
