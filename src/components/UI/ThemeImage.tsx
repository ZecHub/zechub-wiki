"use client";

import Image from "next/image";
import { useDarkModeContext } from "@/hooks/useDarkModeContext";

interface ThemeImageProps {
  src: string;
  srcLight?: string;
  srcDark?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  unoptimized?: boolean;
}

export function ThemeImage({
  src,
  srcLight,
  srcDark,
  alt,
  width = 500,
  height = 500,
  className,
  unoptimized,
}: ThemeImageProps) {
  const { dark } = useDarkModeContext();
  const resolvedSrc =
    dark && srcDark ? srcDark : !dark && srcLight ? srcLight : src;

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized={unoptimized}
    />
  );
}
