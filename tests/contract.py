"""Test real build discovery, escaping, and failure paths without editing lessons."""
from pathlib import Path
import importlib.util
import json
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('builder', ROOT / 'build.py')
b = importlib.util.module_from_spec(spec)
spec.loader.exec_module(b)
checks = 0


def reject(fn):
    global checks
    try:
        fn()
    except ValueError:
        checks += 1
        return
    raise AssertionError('Invalid contract was accepted')


with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
    temp = Path(tmp)
    shutil.copytree(ROOT / 'lessons', temp / 'lessons')
    lessons = temp / 'lessons'
    baseline = len(b.discover())
    assert len(b.discover(lessons)) == baseline
    checks += 1
    new = lessons / 'new-independent-lesson'
    new.mkdir()
    manifest = dict(contract=1, id=new.name, title='New', summary='Independent test package',
                    order=10, builds_on=['return'], related=['membership'], contexts=['test'],
                    entry='entry.html', glyph='glyph.svg')
    (new / 'entry.html').write_text('<!doctype html><html></html>')
    (new / 'glyph.svg').write_text('<svg/>')

    def write():
        (new / 'lesson.json').write_text(json.dumps(manifest))

    write()
    assert len(b.discover(lessons)) == baseline + 1  # Nothing in the host was edited.
    checks += 1
    manifest['status'] = 'draft'
    write()
    assert len(b.discover(lessons)) == baseline
    checks += 1
    manifest['status'] = 'ready'
    manifest['builds_on'] = ['missing']
    write()
    reject(lambda: b.discover(lessons))
    manifest['builds_on'] = [new.name]
    write()
    reject(lambda: b.discover(lessons))
    manifest['builds_on'] = ['return']
    write()
    existing = lessons / 'composition/lesson.json'
    altered = json.loads(existing.read_text())
    altered['builds_on'] = [new.name]
    existing.write_text(json.dumps(altered))
    reject(lambda: b.discover(lessons))
    loop = temp / 'loop.html'
    loop.write_text('<!-- @include loop.html -->')
    reject(lambda: b.expand(loop))
    reject(lambda: b.expand(ROOT.parent / 'outside.html'))
    scaffold = temp / 'scaffold-project'
    scaffold.mkdir()
    shutil.copy(ROOT / 'new_lesson.py', scaffold)
    shutil.copytree(ROOT / 'templates', scaffold / 'templates')
    prior = scaffold / 'lessons/return'
    prior.mkdir(parents=True)
    (prior / 'lesson.json').write_text('{}')
    subprocess.run([sys.executable, str(scaffold / 'new_lesson.py'), 'new-orbit', '--title', 'New orbit', '--after', 'return'], check=True, capture_output=True)
    created = scaffold / 'lessons/new-orbit'
    data = json.loads((created / 'lesson.json').read_text())
    assert data['status'] == 'draft' and data['builds_on'] == ['return']
    assert 'data-lesson="new-orbit"' in (created / 'entry.html').read_text()
    assert (created / 'README.md').exists()
    checks += 3

assert '</script>' not in b.json_script({'x': '</script><script>bad</script>'})
assert json.loads(b.json_script({'x': '</script>'}))['x'] == '</script>'
checks += 2
print(json.dumps({'suite': 'portable lesson contract', 'checks': checks, 'passed': True}))
