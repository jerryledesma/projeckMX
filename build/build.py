#!/usr/bin/env python3
"""Build site pages by inlining the embedded fonts into each src file."""
import os

here = os.path.dirname(os.path.abspath(__file__))
fonts = open(os.path.join(here, "fonts-inline.css"), encoding="utf-8").read()

PAGES = {
    "src.html": "index.html",
    "itinerario.src.html": "itinerario.html",
}

for src_name, out_name in PAGES.items():
    src = open(os.path.join(here, src_name), encoding="utf-8").read()
    assert "/*__FONTS__*/" in src, "font placeholder missing from " + src_name
    out = os.path.join(here, "..", out_name)
    open(out, "w", encoding="utf-8").write(src.replace("/*__FONTS__*/", fonts))
    print("built", os.path.normpath(out), os.path.getsize(out) // 1024, "KB")
