import logging
from typing import Optional
from datetime import date

from nominatim_lookup import nominatim_lookup
from fallback_coords import FALLBACK_COORDS
from build_feature import build_feature


def build_geojson(ambassadors: list[dict]) -> dict:
    """Build the geojson for the map geodata

    Args:
        ambassadors (list[dict]): _description_
        use_nominatim (bool): _description_

    Returns:
        dict: _description_
    """
    features = []

    for amb in ambassadors:
        name = amb.get("name", "unknown")
        geo_query = amb.get("geo_query")
        country_code = str(amb.get("countryCode"))

        logging.info(f"Processing: {name}")

        coords: Optional[tuple[float, float]] = None
        source = "fallback"

        # --- Try Nominatim
        if geo_query:
            coords = nominatim_lookup(geo_query)
            if coords:
                source = "nominatim"

        # --- Fallback
        if not coords:
            coords = FALLBACK_COORDS.get(country_code)
            if coords:
                logging.info(f" Using hardcoded fallback for {country_code}")
                source = "fallback"

        if not coords:
            logging.error(
                f" SKIPPED {name} - no coords from Nominatim or fallback table.",
                f"Add '{country_code}' to FALLBACK_COORDS.",
            )

            continue

        data = build_feature(amb, coords, source)
        features.append(data)

    return {
        "type": "FeatureCollection",
        "metadata": {
            "schema_version": "1.0",
            "generated": str(date.today()),
            "source": "ambassador_list.json + build_ambassadors_geojson.py",
            "total_features": len(features),
            "note": (
                "This file is auto-geneated. "
                "Edit ambassador_list.json to add or update ambassadors, "
                "then re-run build_ambassadors_geojson.py."
            ),
        },
        "features": features,
    }
