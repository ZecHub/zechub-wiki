/** Navigate to a ZIP 321 payment URI. Isolated so tests can capture it. */
export function openPaymentUri(uri: string): void {
  window.location.href = uri;
}
