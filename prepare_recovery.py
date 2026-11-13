"""Offline, read-only preparation of wedding gallery recovery records.

Run: python prepare_recovery.py
Reads cloudinary_recovery_review.csv next to this script; creates
wedding_recovery_dry_run.csv. Never connects to Neon or Cloudinary.
"""
import csv
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'cloudinary_recovery_review.csv'
DEST = ROOT / 'wedding_recovery_dry_run.csv'
CATEGORIES = {'pre_wedding', 'haldi', 'mehndi', 'sagan', 'rokha', 'wedding'}


def main():
    if not SOURCE.exists():
        raise SystemExit(f'Missing {SOURCE.name}: copy it beside this script.')
    with SOURCE.open(newline='', encoding='utf-8-sig') as file:
        reader = csv.DictReader(file)
        required = {'public_id', 'secure_url', 'suggested_category'}
        if not required.issubset(reader.fieldnames or []):
            raise SystemExit(f'CSV missing columns: {sorted(required - set(reader.fieldnames or []))}')
        source_rows = list(reader)

    results = []
    seen = set()
    errors = []
    for number, row in enumerate(source_rows, start=1):
        public_id = (row.get('public_id') or '').strip()
        url = (row.get('secure_url') or '').strip()
        category = (row.get('suggested_category') or '').strip().lower()
        title = (row.get('title') or '').strip() or f'Wedding Photo {number:03d}'
        featured = (row.get('is_featured') or '').strip().lower()
        order = (row.get('order') or '').strip()
        if not public_id.startswith('wedding_gallery/') or '/thumbnails/' in public_id:
            errors.append(f'Row {number}: unexpected public_id {public_id!r}')
        if public_id in seen:
            errors.append(f'Row {number}: duplicate public_id {public_id!r}')
        seen.add(public_id)
        parsed = urlparse(url)
        if parsed.scheme != 'https' or parsed.netloc != 'res.cloudinary.com' or public_id not in parsed.path:
            errors.append(f'Row {number}: URL does not match Cloudinary public_id')
        if category and category not in CATEGORIES:
            errors.append(f'Row {number}: invalid category {category!r}')
        if featured not in ('', 'true', 'false', 'yes', 'no', '1', '0'):
            errors.append(f'Row {number}: invalid featured value {featured!r}')
        if order and not order.isdigit():
            errors.append(f'Row {number}: order must be a non-negative integer')
        results.append({
            'public_id': public_id,
            'secure_url': url,
            'category': category,
            'title': title,
            'is_featured': 'true' if featured in ('true', 'yes', '1') else 'false',
            'order': order if order else str(number),
            'status': 'READY' if category else 'NEEDS_CATEGORY',
        })
    if errors:
        print('\n'.join(errors[:30]))
        raise SystemExit(f'Validation failed: {len(errors)} issue(s). No output written.')

    with DEST.open('w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=list(results[0]) if results else [
            'public_id', 'secure_url', 'category', 'title', 'is_featured', 'order', 'status'])
        writer.writeheader()
        writer.writerows(results)
    ready = sum(r['status'] == 'READY' for r in results)
    print(f'Assets validated: {len(results)}')
    print(f'Ready to import after review: {ready}')
    print(f'Needs category assignment: {len(results) - ready}')
    print(f'Preview saved: {DEST.name}')
    print('No database connection or Cloudinary changes performed.')


if __name__ == '__main__':
    main()
