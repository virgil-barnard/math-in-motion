"""Discover portable lessons; build Pages and a one-file offline collection."""
from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'docs'
INCLUDE = re.compile(r'<!--\s*@include\s+([^\s]+)\s*-->')


def expand(path, stack=()):
    path = path.resolve()
    if not path.is_relative_to(ROOT) or path in stack:
        raise ValueError(f'Unsafe or recursive include: {path}')
    text = path.read_text(encoding='utf-8')
    return INCLUDE.sub(lambda m: expand(path.parent / m[1], (*stack, path)), text)


def discover(directory=None):
    directory = directory or ROOT / 'lessons'
    catalog = []
    for path in sorted(directory.glob('*/lesson.json')):
        item = json.loads(path.read_text())
        if item.get('status', 'ready') == 'draft':
            continue
        required = {'id', 'title', 'summary', 'order', 'builds_on', 'related', 'contexts', 'entry', 'glyph', 'contract'}
        if not required.issubset(item) or item['contract'] != 1:
            raise ValueError(f'Invalid lesson contract: {path}')
        if not re.fullmatch(r'[a-z][a-z0-9-]*', item['id']) or item['id'] != path.parent.name:
            raise ValueError(f'Lesson ID must match its folder: {path}')
        if item['id'] in {'index', 'collection', 'foundations'}:
            raise ValueError(f'Reserved output name: {item["id"]}')
        if not isinstance(item['order'], (int, float)) or isinstance(item['order'], bool):
            raise ValueError(f'Order must be numeric: {path}')
        if 'opening_order' in item and (type(item['opening_order']) is not int or item['opening_order'] < 0):
            raise ValueError(f'Opening order must be a nonnegative integer: {path}')
        for key in ('builds_on', 'related', 'contexts'):
            if not isinstance(item[key], list) or not all(isinstance(x, str) for x in item[key]) or len(set(item[key])) != len(item[key]):
                raise ValueError(f'Invalid {key}: {path}')
        for key in ('entry', 'glyph'):
            p = (path.parent / item[key]).resolve()
            if not p.is_relative_to(path.parent.resolve()) or not p.is_file():
                raise ValueError(f'Missing or escaping {key}: {path}')
        item['directory'] = path.parent
        catalog.append(item)
    if not catalog:
        raise ValueError('No lessons found')
    by_id = {x['id']: x for x in catalog}
    if len(by_id) != len(catalog):
        raise ValueError('Duplicate lesson IDs')
    opening_orders = [x['opening_order'] for x in catalog if 'opening_order' in x]
    if len(set(opening_orders)) != len(opening_orders):
        raise ValueError('Opening order must be unique')
    visiting, visited = set(), set()

    def visit(item):
        if item['id'] in visiting:
            raise ValueError('Cycle in builds_on relationships')
        if item['id'] in visited:
            return
        visiting.add(item['id'])
        for key in ('builds_on', 'related'):
            for other in item[key]:
                if other not in by_id or other == item['id']:
                    raise ValueError(f'Invalid {key} target in {item["id"]}: {other}')
        for other in item['builds_on']:
            visit(by_id[other])
        visiting.remove(item['id'])
        visited.add(item['id'])
    for item in catalog:
        visit(item)
    return sorted(catalog, key=lambda x: (x['order'], x['id']))


def json_script(value):
    return json.dumps(value, ensure_ascii=True, separators=(',', ':')).replace('<', '\\u003c')


def build():
    OUT.mkdir(exist_ok=True)
    entries = discover()
    payloads, catalog, files = {}, [], []

    def write(name, text):
        path = OUT / name
        path.write_text(text, encoding='utf-8')
        files.append({'file': name, 'bytes': path.stat().st_size, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()})

    for item in entries:
        document = expand(item['directory'] / item['entry'])
        if '<!doctype html>' not in document.lower() or re.search(r'__(?:STYLE|CORE|APP|TITLE|EDITION)__', document):
            raise ValueError(f'Entry must expand to a complete document: {item["id"]}')
        payloads[item['id']] = document
        write(f'{item["id"]}.html', document)
        metadata = {k: v for k, v in item.items() if k not in {'directory', 'entry', 'glyph'}}
        metadata['related'] = sorted(set(item['related']) | {x['id'] for x in entries if item['id'] in x['related']})
        metadata.update(glyph=(item['directory'] / item['glyph']).read_text(), file=f'{item["id"]}.html')
        catalog.append(metadata)

    source = ROOT / 'src/catalog'
    template = (source / 'shell.html').read_text()
    shared = {'__HOST_STYLE__': (source / 'style.css').read_text(), '__HOST_MODEL__': (source / 'model.js').read_text(), '__HOST_APP__': (source / 'app.js').read_text(), '__CATALOG__': json_script(catalog)}
    for name, bundle in [('index.html', None), ('collection.html', payloads)]:
        html = template
        for token, value in shared.items():
            html = html.replace(token, value)
        html = html.replace('__PAYLOADS__', json_script(bundle))
        write(name, html)

    foundation = (ROOT / 'src/shell.html').read_text()
    for token, value in {'__STYLE__': expand(ROOT / 'src/style.css'), '__CORE__': (ROOT / 'src/core.js').read_text(), '__APP__': (ROOT / 'src/app.js').read_text(), '__EDITION__': 'all', '__TITLE__': 'Foundations · Mathematics in Motion'}.items():
        foundation = foundation.replace(token, value)
    write('foundations.html', foundation)
    (OUT / '.nojekyll').write_text('')
    (ROOT / 'evidence').mkdir(exist_ok=True)
    (ROOT / 'evidence/build-manifest.json').write_text(json.dumps({'version': '0.5.0', 'lessons': len(catalog), 'files': files}, indent=2) + '\n')
    print(json.dumps({'version': '0.5.0', 'lessons': len(catalog), 'files': files}, indent=2))


if __name__ == '__main__':
    build()
