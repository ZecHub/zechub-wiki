'use client';

import { IconType } from "react-icons";
import { IconBaseProps } from "react-icons/lib";
import { useDarkModeContext } from "@/hooks/useDarkModeContext";

type Size = "tiny" | "small" | "medium" | "large";

interface Props extends IconBaseProps {
  size?: Size | number;
  icon?: IconType | string | null;   // ← now supports string (PNG path)
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

  // CUSTOM PNG from public/explore/
  if (typeof icon === "string") {
    return (
      <img
        src={`/explore/${folder}/${icon}`}
        alt="icon"
        className={className}
        style={{ width: iconSize, height: iconSize }}
        {...rest}
      />
    );
  }

  // Old React icon (unchanged)
  const IconComponent = icon;
  if (!IconComponent) return null;

  return <IconComponent className={className} size={iconSize} {...rest} />;
}