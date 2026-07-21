"""
Fetches the ISS's current TLE from Celestrak, propagates its position with
SGP4 (via skyfield), and rewrites the block between the markers below in
README.md. Designed to be run on a schedule by a GitHub Action.
"""

import re
import sys
from datetime import datetime, timezone

import requests
from skyfield.api import EarthSatellite, load, wgs84

TLE_URL = "https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE"
README_PATH = "README.md"

START_MARKER = "<!--START_SECTION:iss-->"
END_MARKER = "<!--END_SECTION:iss-->"


def fetch_tle() -> tuple[str, str, str]:
    resp = requests.get(TLE_URL, timeout=15)
    resp.raise_for_status()
    lines = [l.strip() for l in resp.text.strip().splitlines() if l.strip()]
    if len(lines) < 3:
        raise ValueError(f"Unexpected TLE response:\n{resp.text}")
    return lines[0], lines[1], lines[2]


def compute_position(name: str, line1: str, line2: str) -> dict:
    ts = load.timescale()
    satellite = EarthSatellite(line1, line2, name, ts)
    t = ts.now()

    geocentric = satellite.at(t)
    subpoint = wgs84.subpoint(geocentric)

    lat = subpoint.latitude.degrees
    lon = subpoint.longitude.degrees
    alt_km = subpoint.elevation.km

    velocity_km_s = geocentric.velocity.km_per_s
    speed_km_s = sum(v**2 for v in velocity_km_s) ** 0.5

    return {
        "lat": lat,
        "lon": lon,
        "alt_km": alt_km,
        "speed_km_s": speed_km_s,
        "timestamp": t.utc_strftime("%Y-%m-%d %H:%M UTC"),
    }


def format_block(pos: dict) -> str:
    lat_dir = "N" if pos["lat"] >= 0 else "S"
    lon_dir = "E" if pos["lon"] >= 0 else "W"
    return (
        f"{START_MARKER}\n"
        f"**ISS (ZARYA)** — "
        f"Lat: {abs(pos['lat']):.1f}°{lat_dir}, "
        f"Lon: {abs(pos['lon']):.1f}°{lon_dir} — "
        f"Alt: {pos['alt_km']:.0f} km — "
        f"Vel: {pos['speed_km_s']:.2f} km/s\n"
        f"\n"
        f"<sub>Last sync: {pos['timestamp']} · propagated with SGP4 from live Celestrak TLE, "
        f"same approach as [ORBIS](https://github.com/SSPlaucode/orbis)</sub>\n"
        f"{END_MARKER}"
    )


def update_readme(new_block: str) -> bool:
    with open(README_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    pattern = re.compile(
        re.escape(START_MARKER) + r".*?" + re.escape(END_MARKER), re.DOTALL
    )

    if not pattern.search(content):
        print(
            f"Could not find {START_MARKER} ... {END_MARKER} in {README_PATH}. "
            "Add both markers to the file first.",
            file=sys.stderr,
        )
        sys.exit(1)

    updated = pattern.sub(new_block, content)

    if updated == content:
        print("No change in README content — skipping write.")
        return False

    with open(README_PATH, "w", encoding="utf-8") as f:
        f.write(updated)
    return True


def main():
    name, line1, line2 = fetch_tle()
    pos = compute_position(name.strip() or "ISS (ZARYA)", line1, line2)
    block = format_block(pos)
    changed = update_readme(block)
    print("README updated." if changed else "README unchanged.")


if __name__ == "__main__":
    main()
