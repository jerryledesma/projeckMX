#!/usr/bin/env python3
"""Build site pages by inlining the embedded fonts into each src file.

Prepends a proper doctype and <html lang> so browsers use standards mode
and translate prompts know the page language (see itinerario's JS toggle,
which flips the lang attribute at runtime).
"""
import os

here = os.path.dirname(os.path.abspath(__file__))
fonts = open(os.path.join(here, "fonts-inline.css"), encoding="utf-8").read()

PAGES = {
    "src.html": ("index.html", "es"),
    "itinerario.src.html": ("itinerario.html", "es"),
}

for src_name, (out_name, lang) in PAGES.items():
    src = open(os.path.join(here, src_name), encoding="utf-8").read()
    assert "/*__FONTS__*/" in src, "font placeholder missing from " + src_name
    html = '<!doctype html>\n<html lang="%s">\n' % lang + src.replace("/*__FONTS__*/", fonts)
    out = os.path.join(here, "..", out_name)
    open(out, "w", encoding="utf-8").write(html)
    print("built", os.path.normpath(out), os.path.getsize(out) // 1024, "KB")
