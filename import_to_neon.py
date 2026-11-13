"""Import existing Cloudinary IDs into the configured Neon PostgreSQL database.

Run: python import_to_neon.py             # inspect destination and planned inserts
     python import_to_neon.py --apply     # commit inserts

Uses wedding_recovery_dry_run.csv beside this file. Never uploads/deletes
Cloudinary assets, and never calls WeddingImage.save() or .delete().
"""
import argparse
import csv
import os
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
CSV_FILE = ROOT / 'wedding_recovery_dry_run.csv'
CATEGORIES = {'pre_wedding', 'haldi', 'mehndi', 'sagan', 'rokha', 'wedding'}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true', help='Commit missing rows to Neon')
    args = parser.parse_args()
    if not CSV_FILE.is_file():
        parser.error(f'Missing {CSV_FILE.name} next to script')

    with CSV_FILE.open(newline='', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        required = {'public_id', 'secure_url', 'category', 'title', 'order'}
        missing = required - set(reader.fieldnames or [])
        if missing:
            parser.error(f'Missing CSV columns: {sorted(missing)}')
        rows = list(reader)
    if len(rows) != 329:
        parser.error(f'Expected 329 records; found {len(rows)}. Refusing partial import.')

    clean = []
    seen = set()
    for i, row in enumerate(rows, 1):
        pid = (row.get('public_id') or '').strip()
        url = (row.get('secure_url') or '').strip()
        parsed = urlparse(url)
        if not pid.startswith('wedding_gallery/') or '/thumbnails/' in pid or pid in seen:
            parser.error(f'Invalid or duplicate Cloudinary public ID at row {i}: {pid}')
        if parsed.scheme != 'https' or parsed.netloc != 'res.cloudinary.com' or f'/{pid}.' not in parsed.path:
            parser.error(f'Invalid Cloudinary URL at row {i}: {url}')
        seen.add(pid)
        category = (row.get('category') or '').strip().lower() or 'wedding'
        if category not in CATEGORIES:
            parser.error(f'Invalid category at row {i}: {category}')
        title = (row.get('title') or '').strip() or f'Wedding Photo {i:03d}'
        if len(title) > 200:
            parser.error(f'Title too long at row {i}')
        try:
            order = int((row.get('order') or '').strip() or str(i))
        except ValueError:
            parser.error(f'Invalid order at row {i}')
        if order < 0:
            parser.error(f'Negative order at row {i}')
        featured = (row.get('is_featured') or '').strip().lower() in ('true', '1', 'yes')
        clean.append((pid, category, title, order, featured))

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    import django
    django.setup()
    from django.db import connection, transaction
    from gallery.models import WeddingImage

    settings = connection.settings_dict
    host = str(settings.get('HOST') or '').lower()
    if connection.vendor != 'postgresql' or not (host.endswith('.neon.tech') or host == 'neon.tech'):
        parser.error('Refusing to write: Django is NOT connected to a Neon PostgreSQL host. Set DATABASE_URL correctly.')
    print(f'Destination verified: PostgreSQL / Neon ({host})')
    print(f'CSV records: {len(clean)}')
    with transaction.atomic():
        existing = set(WeddingImage.objects.filter(image__in=[p[0] for p in clean]).values_list('image', flat=True))
        pending = [p for p in clean if p[0] not in existing]
        print(f'Already present: {len(existing)}')
        print(f'Missing records: {len(pending)}')
        print(f'Temporary wedding categories: {sum(p[1] == "wedding" for p in pending)}')
        if args.apply:
            objects = [WeddingImage(image=p[0], title=p[2], category=p[1], media_type='image',
                                    description='', is_featured=p[4], order=p[3]) for p in pending]
            WeddingImage.objects.bulk_create(objects, batch_size=100)
            print(f'IMPORTED: {len(objects)} new records. No Cloudinary uploads or deletes.')
        else:
            print('DRY RUN ONLY. Run python import_to_neon.py --apply to insert.')


if __name__ == '__main__':
    main()
