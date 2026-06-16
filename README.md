<div align="center">

# RURC — Reichman University Robotics Club

**We build robots — and the people who build them.**

A modern, single-page website for the student-led robotics club at
Reichman University, Herzliya.

</div>

---

## ✨ Highlights

- ⚡ **Zero dependencies** — plain HTML, CSS and JavaScript. No build step.
- 🎨 **On-brand** — royal-blue palette pulled from the RURC logo.
- 🧠 **Animated hero** — interactive "node network" canvas that reacts to the cursor.
- 🌀 **Rich effects** — scroll reveals, animated counters, marquee, magnetic
  buttons, card cursor-glow, sticky/blur navbar, scrollspy, scroll-progress bar.
- 📱 **Fully responsive** with a mobile menu, and respects `prefers-reduced-motion`.

## 🚀 Run it

No tooling required. Use any static server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Or just open `index.html` in a browser (needs internet for Google Fonts).

## 🗂 Structure

```
index.html        Page markup (sections are commented)
css/style.css     Design tokens + components + responsive + effects
js/main.js        All interactions & the hero canvas
assets/           Logo + favicon (SVG)
CLAUDE.md         Full guide for editing & extending the site
```

## ✏️ Make it yours

Everything is plain text and easy to edit — team members, projects, events,
partners, copy, colors and the logo. See **[CLAUDE.md](CLAUDE.md)** for a
section-by-section customization guide.

Quick wins:
- Swap the placeholder team/projects/events with your real ones in `index.html`.
- Drop your official logo into `assets/` (see CLAUDE.md → "Replace the logo").
- Point the footer social links and the contact email at your real accounts.

## 📦 Deploy

GitHub Pages → Settings → Pages → deploy from branch, root `/`. Done.

---

<div align="center">
Made with ⚙ by students, for students · Herzliya
</div>
