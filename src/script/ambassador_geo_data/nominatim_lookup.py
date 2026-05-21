import requests
from typing import Optional
import time
import logging

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
NOMINATIM_DELAY = 1.1  # seconds — Nominatim policy: max 1 req/sec
HTTP_TIMEOUT = 10
USER_AGENT = "ZecHub-AmbassadorMap/1.0 (https://zechub.wiki; map@zechub.wiki)"


_session = requests.Session()
_session.headers.update({"User-Agent": USER_AGENT})
_last_call = 0.0


def nominatim_lookup(query: str) -> Optional[tuple[float, float]]:
    """
    Geocode `query` via Nominatim.
    Returns (longitude, latitude) or None on failure.
    Respect the 1 req/sec rate limit
    """
    global _last_call

    elapsed = time.time() - _last_call
    if elapsed < NOMINATIM_DELAY:
        time.sleep(NOMINATIM_DELAY - elapsed)

    try:
        resp = _session.get(
            NOMINATIM_URL,
            params={"q": query, "format": "json", "limit": 1},
            timeout=HTTP_TIMEOUT,
        )
        _last_call = time.time()
        resp.raise_for_status()

        result = resp.json()
        if result:
            lon = float(result[0]["lon"])
            lat = float(result[0]["lat"])
            logging.info(f" Nominatim resolved '{query}' -> ({lon:.4f}, {lat:.4f})")

            return (lon, lat)

        logging.warning(f" Nominatim returned no result for '{query}'")

    except Exception as e:
        logging.warning(f" Nominatim failed for '{query}': {e}")

    return None
