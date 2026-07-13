#!/usr/bin/env python3
"""Build index.html by inlining the embedded fonts into src.html."""
import os

here = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(here, "src.html"), encoding="utf-8").read()
fonts = open(os.path.join(here, "fonts-inline.css"), encoding="utf-8").read()
assert "/*__FONTS__*/" in src, "font placeholder missing from src.html"
out = os.path.join(here, "..", "index.html")
open(out, "w", encoding="utf-8").write(src.replace("/*__FONTS__*/", fonts))
print("built", os.path.normpath(out), os.path.getsize(out) // 1024, "KB")
