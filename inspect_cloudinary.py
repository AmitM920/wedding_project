
import os
import csv
from pathlib import Path

import cloudinary
import cloudinary.api
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

cloudinary.config(
    cloud_name=os.environ["CLOUDINARY_CLOUD_NAME"],
    api_key=os.environ["CLOUDINARY_API_KEY"],
    api_secret=os.environ["CLOUDINARY_API_SECRET"],
    secure=True,
)

OUTPUT_FILE = BASE_DIR / "cloudinary_inventory.csv"

def inspect_images():
    print("Reading Cloudinary image metadata...")

    records = []
    next_cursor = None

    while True:
        params = {
            "resource_type": "image",
            "type": "upload",
            "prefix": "wedding_gallery/",
            "max_results": 500,
            "context": True,
            "tags": True,
        }

        if next_cursor:
            params["next_cursor"] = next_cursor

        response = cloudinary.api.resources(**params)

        for asset in response.get("resources", []):
            public_id = asset.get("public_id", "")

            # Skip separately uploaded thumbnails
            if "/thumbnails/" in public_id:
                continue

            records.append({
                "public_id": public_id,
                "secure_url": asset.get("secure_url", ""),
                "filename": asset.get("filename", ""),
                "format": asset.get("format", ""),
                "created_at": asset.get("created_at", ""),
                "width": asset.get("width", ""),
                "height": asset.get("height", ""),
                "tags": ",".join(asset.get("tags") or []),
                "context": str(asset.get("context") or {}),
            })

        next_cursor = response.get("next_cursor")
        if not next_cursor:
            break

    columns = [
        "public_id", "secure_url", "filename",
        "format", "created_at", "width", "height",
        "tags", "context",
    ]

    with OUTPUT_FILE.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=columns)
        writer.writeheader()
        writer.writerows(records)

    print(f"Images found: {len(records)}")
    print(f"Inventory saved: {OUTPUT_FILE.name}")
    print("No database or Cloudinary assets were modified.")

if __name__ == "__main__":
    inspect_images()
