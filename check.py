"""One local gate; discovers ready lessons and their own mathematical checks."""
from pathlib import Path
import subprocess
import sys
from build import discover

ROOT = Path(__file__).resolve().parent


def run(*args):
    subprocess.run(args, cwd=ROOT, check=True)


run(sys.executable, 'build.py')
run('node', 'tests/runtime.cjs')
checked = set()
for item in discover():
    for relative in item.get('checks', ['lesson.test.cjs']):
        local = (item['directory'] / relative).resolve()
        if not local.is_relative_to(ROOT) or not local.is_file():
            raise SystemExit(f'Ready lesson needs local mathematical checks: {item["id"]}')
        if local not in checked:
            run('node', str(local))
            checked.add(local)
    for relative in item.get('interaction_checks', []):
        local = (item['directory'] / relative).resolve()
        if not local.is_relative_to(ROOT) or not local.is_file():
            raise SystemExit(f'Missing local interaction check: {item["id"]}')
        if local not in checked:
            run('node', str(local))
            checked.add(local)
run('node', 'tests/interaction.cjs')
run('node', 'tests/catalog.cjs')
run('node', 'tests/catalog-transitions.cjs')
run(sys.executable, 'tests/contract.py')
run(sys.executable, 'tests/offline.py')
print('All implemented gates passed. Browser/device and learner studies remain separate.')
