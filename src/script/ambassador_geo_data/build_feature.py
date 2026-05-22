from datetime import date


def build_feature(
    ambassador: dict, coords: tuple[float, float], coods_source: str
) -> dict:
    """Produce a single GeoJSON Feature from an ambassador record + coordinates."""
    lon, lat = coords

    # Derive a clean ID from the name: 'Zcash India' -> 'amb_india'
    slug = ambassador["name"].lower().replace("zcash ", "").strip().replace(" ", "_")
    amb_id = f"amb_{slug}"

    # Extract x handle from full Twitter/X URL for convience
    x_url = ambassador.get("twitter", "") or ""
    x_handle = x_url.rstrip("/").split("/")[-1].split("?")[0] if x_url else None

    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [lon, lat],
        },
        "properties": {
            "id": amb_id,
            "name": ambassador["name"],
            "flag": ambassador.get("flag"),
            "description": ambassador.get("description"),
            "image": ambassador.get("image"),
            "twitter": ambassador.get("twitter"),
            "x_handle": x_handle,
            "project_site": ambassador.get("projectSite"),
            "blog": ambassador.get("blog"),
            "country_code": ambassador.get("countryCode"),
            "region": ambassador.get("region"),
            "language": ambassador.get("language"),
            "pin_note": ambassador.get("pin_note"),
            "coords_source": coods_source,
            "active": True,
            "last_update": str(date.today()),
        },
    }
