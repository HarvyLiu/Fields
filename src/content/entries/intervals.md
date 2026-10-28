---
title: Intervals, a sight-reading trainer that listens
tab: projects
summary: Pitch-tracking practice software that grades what you actually played, not what you clicked.
fields: [cs, music]
date: 2024-11
role: Solo build
link: https://github.com
linkLabel: Repo
order: 30
---

Most sight-reading apps are quizzes: they show a note, you click a button. That
tests note naming, not reading under tempo.

Intervals uses the microphone and a real-time pitch tracker to follow along while
you play. It scrolls the staff at your tempo instead of its own, and it marks each
note as clean, bent, or missed.

## What the math bought me

Pitch detection is the easy half. The interesting part was designing the feedback:
too strict and every beginner quits, too lenient and the score is meaningless. I
tuned the "bent" threshold on recordings from eight players at three skill levels,
then published the calibration set so the choice could be argued with.

I play violin. Building this made me a better reader, because I had to name the
mistakes I had been making silently for years.
