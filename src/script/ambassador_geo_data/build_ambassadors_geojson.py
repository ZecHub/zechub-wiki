#!/usr/bin/env python3

"""Converts the ambassadorProjects TypeScript array from 'src/constants/ambassadorProjects.ts' into a valid ambassadors.geojson file ready for the global map.

Coordinates are resolved automatically via Nominatim (OpenStrretMap geocoding).
Results are cached locally in `.geocache.json` so re-run are instant and offline.
Only new or missing entries ever hit the network.

Usage
    python3 ./src/script/ambassador_geo_data/build_ambassadors_geojson.py  --input ./src/app/zcash-global-ambassadors/ambassador_list_v2.json --output ./public


Dependencies
    pip install request

Rate limit: Moninatim enforces 1 req/sec. geopy's RateLimit handles this.
"""

import argparse
import json
from pathlib import Path
import logging
from geo_json_builder import build_geojson


def main():
    """Parse the ambassadors list (.json)"""
    parser = argparse.ArgumentParser(
        description="Build ambassador.geojson from ambassadors_list.json"
    )
    parser.add_argument(
        "--input",
        default="ambassador_list_v2.json",
        help="Path to ambassadors_list.json (default: ./ambassadors_list.json)",
    )
    parser.add_argument(
        "--output",
        default="ambassadors.geojson",
        help="Output path (default: ./public/ambassadors.geojson)",
    )
    parser.add_argument(
        "--no-nominatim",
        default="store-true",
        help="Skip Nominatim entirely: use hardcoded fallback coords only. WARNING: Data might not be complete.",
    )
    parser.add_argument("--verbose", action="store_true", help="Enable debug logging")
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)-7s %(message)s",
        datefmt="%H:%M:%S",
    )

    input_path = Path(args.input)
    output_path = Path(args.output)

    if not input_path.exists():
        raise FileNotFoundError(f" Input file not found: {input_path}")

    with open(input_path, encoding="utf-8") as f:
        ambassadors = json.load(f)

    logging.info(f"Loaded {len(ambassadors)} ambassador(s) from {input_path}")

    use_nominatim = not args.no_nominatim
    if use_nominatim:
        logging.info(
            "Nominatim disabled - using hardcoded fallback coords only - WARMING: Coords might not be complete..."
        )
    else:
        logging.info("Geocoding via Nominatim (1 req/sec)...")

    geojson = build_geojson(ambassadors)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(geojson, f, indent=2, ensure_ascii=False)

    n = geojson["metadata"]["total_features"]
    skipped = len(ambassadors) - n

    print("\n" + "-" * 52)
    print(" ambassadors.geojson built")
    print("-" * 52)
    print(f" Input ambassador: {len(ambassadors)}")
    print(f" Features written: {n}")

    if skipped:
        print(
            f" Skipped (no coords): {skipped} <- add to FALLBACK_COORDS in fallback_coords.py "
        )

    print(f" Output : {output_path}")
    print("-" * 52 + "\n")


if __name__ == "__main__":
    main()
