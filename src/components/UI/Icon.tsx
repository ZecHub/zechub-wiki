'use client';

import { IconType } from "react-icons";
import { IconBaseProps } from "react-icons/lib";
import { useDarkModeContext } from "@/hooks/useDarkModeContext";

type Size = "tiny" | "small" | "medium" | "large";

interface Props extends Omit<IconBaseProps, "size"> {
  size?: Size | number;
  icon?: IconType | string | null;   // supports custom PNGs
}

const ICON_SIZE: Record<Size, number> = {
  large: 20,
  medium: 18,
  small: 16,
  tiny: 14,
};

export function Icon({ className, size = "small", icon, ...rest }: Props) {
  const { dark } = useDarkModeContext();
  const folder = dark ? "dark" : "light";
  const iconSize: number = typeof size === "string" ? ICON_SIZE[size] : size;

  if (typeof icon === "string") {
    const src = icon.startsWith("/")
      ? icon                                    // ← e.g. "/explore/treasury.png" or "/icons/custom.svg"
      : `/explore/${folder}/${icon}`;           // ← old behavior still works

    return (
      <img
        src={src}
        alt="icon"
        className={className}
        style={{ width: iconSize, height: iconSize }}
        {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
      />
    );
  }

  // Old React Icons (SVG) — unchanged
  const IconComponent = icon;
  if (!IconComponent) return null;

  return <IconComponent className={className} size={iconSize} {...rest} />;
}