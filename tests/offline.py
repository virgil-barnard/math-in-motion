"""Inspect packaging of the actual exports; this does not launch a browser."""
from html.parser import HTMLParser
from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]


class Inspector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.labels = []
        self.resources = []
        self.scripts = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "label" and "for" in attrs:
            self.labels.append(attrs["for"])
        if tag == "script":
            self.scripts += 1
        if tag in {"script", "img", "iframe", "audio", "video", "link"}:
            for key in ("src", "href"):
                if key in attrs:
                    self.resources.append(attrs[key])


manifest = json.loads((ROOT / "evidence/build-manifest.json").read_text())
for item in manifest["files"]:
    file = ROOT / "docs" / item["file"]
    data = file.read_bytes()
    text = data.decode("utf-8")
    parser = Inspector()
    parser.feed(text)
    assert not parser.resources, (file, parser.resources)
    assert parser.scripts >= 2
    assert len(set(parser.ids)) == len(parser.ids)
    assert all(label in parser.ids for label in parser.labels)
    assert not re.search(r"__STYLE__|__CORE__|__APP__|__EDITION__|__TITLE__|__CATALOG__|__PAYLOADS__|__HOST_[A-Z_]+__|<!--\s*@include", text)
    assert not re.search(r"\bfetch\s*\(|XMLHttpRequest|WebSocket|@import", text)
    assert hashlib.sha256(data).hexdigest() == item["sha256"]
    assert len(data) == item["bytes"]
assert (ROOT / "docs/.nojekyll").exists()
print(json.dumps({"suite": "offline export inspection", "files": len(manifest["files"]), "passed": True}))
