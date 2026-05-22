# ──────────────────────────────────────────────────────────────────────────────
# Hardcoded coordinate fallbacks
# Keyed by country_code.  Used when Nominatim is unreachable or returns no hit.
# Values: (longitude, latitude) — GeoJSON order.
# ──────────────────────────────────────────────────────────────────────────────

FALLBACK_COORDS: dict[str, tuple[float, float]] = {
    "KR": (127.7669, 35.9078),  # South Korea
    "RU": (37.6156, 55.7522),  # Russia — Moscow as representative pin
    "SA": (45.0792, 23.8859),  # Saudi Arabia
    "BR": (-51.9253, -14.2350),  # Brazil
    "GH": (-1.0232, 7.9465),  # Ghana
    "ES": (-3.7492, 40.4637),  # Spain
    "NG": (8.6753, 9.0820),  # Nigeria
    "UA": (31.1656, 48.3794),  # Ukraine
    "TR": (35.2433, 38.9637),  # Turkey
    "KE": (37.9062, -0.0236),  # Kenya
    "IN": (78.9629, 20.5937),  # India
}
