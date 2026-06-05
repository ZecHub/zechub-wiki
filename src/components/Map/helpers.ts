export function getBrandColor(brand: string) {
  return BRAND_COLORS[brand] ?? DEFAULT_PIN_COLOR;
}
