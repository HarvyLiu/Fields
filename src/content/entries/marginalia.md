---
title: Marginalia, notes that survive the page
tab: projects
summary: A browser extension that turns any article into a shared margin, so a reading group can argue in the same place they read.
fields: [cs, english]
impact: [access]
sdg: [4]
date: 2025-09
role: Solo build
link: https://github.com
linkLabel: Try it
order: 20
---

Our English class discussed readings in a chat thread, which meant the
conversation drifted a day away from the text and nobody could find the passage
being argued about.

Marginalia pins a note to a text selection instead of to a timestamp. Selections
are stored as a quote plus a fuzzy offset, so a note survives when the paragraph
above it changes — which, on the open web, it always does.

The hard part was not the annotations. It was making the anchored quote
resilient: I rewrote the anchoring twice, then settled on storing both the
character offset and the surrounding text, and re-matching on load when the
offset no longer lands. It now survives about 96% of live pages in a test set.

Six classmates used it for a semester. Nobody mentioned the feature. Three
people mentioned that they read the article twice, which I am counting as the
win.

## Reflection

I built a tool for a problem I had and then discovered the real problem was that
people were reading alone. The anchoring work mattered; the social default
mattered more.
