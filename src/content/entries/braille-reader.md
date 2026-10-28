---
title: A braille reader that works without wifi
tab: projects
summary: A $40 handheld device that reads braille aloud, built for a school where the wifi does not reach and the budget is one teacher's.
fields: [cs]
impact: [access, equity]
sdg: [4, 10]
date: 2025-05
org: Portland School for the Blind
role: Solo build
link: https://github.com
linkLabel: Read the code
featured: true
order: 10
---

At the Portland School for the Blind, the braille curriculum runs on paper. The
reading software runs on desktops bolted to a wall in the resource room. The gap
between those two facts is where a student who wants to read in the hallway gets
stuck.

I built a handheld reader that takes a line of braille from a small camera,
converts it to text, and speaks it through a bone-conduction speaker. No wifi, no
cloud call, no account. It runs on a Pi Zero and roughly $40 of parts.

Three things changed the design after I stopped guessing and started watching:

- **The camera angle was wrong.** Students hold paper at a slant. I rebuilt the
  mount around a 3D-printed clip that holds the lens at the angle hands actually use.
- **Recognition failed on contractions**, which is most of what braille actually
  is. Swapping the model for a rule-based contraction resolver took accuracy from
  71% to 94% on our test book.
- **Nobody wanted a screen.** I removed it. The device has one button.

> "It doesn't feel like assistive technology. It feels like a walkman."
> — a teacher at the school

## What I would do differently

I spent six weeks on hardware before testing with a single student. That was six
weeks of solving my problem instead of theirs.
