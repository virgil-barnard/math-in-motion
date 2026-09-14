"""Create an independent draft without editing any existing lesson or host file."""
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('id')
parser.add_argument('--title', required=True)
parser.add_argument('--after', action='append', default=[])
args = parser.parse_args()
if not re.fullmatch(r'[a-z][a-z0-9-]*', args.id) or args.id in {'index', 'collection', 'foundations'}:
    parser.error('Use a lowercase hyphenated lesson ID, excluding reserved output names.')
folder = ROOT / 'lessons' / args.id
if folder.exists():
    parser.error('That lesson folder already exists; no files were changed.')
for parent in args.after:
    if not (ROOT / 'lessons' / parent / 'lesson.json').is_file():
        parser.error(f'Unknown predecessor: {parent}')
folder.mkdir()
metadata = dict(contract=1, status='draft', id=args.id, title=args.title,
                summary='Author the intended nonverbal discovery.', order=100,
                builds_on=args.after, related=[], contexts=[], entry='entry.html', glyph='glyph.svg')
(folder / 'lesson.json').write_text(json.dumps(metadata, indent=2) + '\n')
for file in (ROOT / 'templates').iterdir():
    if file.is_file():
        text = file.read_text().replace('__LESSON_ID__', args.id)
        (folder / file.name).write_text(text)
print(f'Created draft: lessons/{args.id}. Read its README and AUTHORING.md. Drafts are excluded from navigation.')
