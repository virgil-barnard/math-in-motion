# Authoring Mathematics in Motion

Read `AUTHORING.md` and the target lesson's `README.md` first. For a new lesson,
read only the short contract and one relevant lesson as an example. Do not load
the entire curriculum or every lesson to implement a new one.

- A lesson is a portable offline document in `lessons/<id>/`, described by
  `lesson.json`. The build discovers it. Do not add lesson IDs to the host.
- Keep mathematical models pure and local. SVG, canvas, and other renderers
  belong to their lesson; the catalog does not interpret lesson state.
- Learner surfaces are wordless. Use persistent shapes, native accessible
  controls, reversible inspection, and user-controlled motion. Written author
  notes and nonvisual accessible descriptions are welcome.
- Test the mathematical claim against an independent construction, including
  contrasting cases. Test direct gestures and interruption paths when changed.
- Run `python3 check.py` before delivering. It builds and verifies the exports.
  Do not describe DOM-shim tests or vector renders as browser/device tests.
- Generate outputs through the builder. Do not hand-edit `docs/*.html`.
- Keep lessons marked draft until their local mathematical and interaction
  checks are written. A visited marker means visited, never mastered.
