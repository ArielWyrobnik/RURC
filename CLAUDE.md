# CLAUDE.md — RURC Website

Guidance for Claude Code (and humans) working in this repo. Read this first.

## What this is

The marketing/landing website for **RURC — Reichman University Robotics Club**
(Herzliya, Israel). It's a single-page site with a modern, technical aesthetic:
big typography, a royal-blue brand, scroll-reveal animations, an animated
hero "node network", a marquee, animated counters, and a sticky navbar.

The design language is inspired by the genre of university robotics-club sites
(e.g. ETH Robotics). The content, copy, branding and code here are **original
to RURC** — do not copy text, images, or assets from other sites. Reuse the
*patterns* (layout, effects), not their material.

## Tech stack

- **Plain static site.** No framework, no build step, no dependencies.
- `index.html` + `css/style.css` + `js/main.js` (vanilla, ~one file each).
- Fonts: Google Fonts — **Space Grotesk** (display) + **Inter** (body).
- Everything is hand-rolled so it stays easy to host anywhere (GitHub Pages,
  Netlify, Vercel, or a plain web server).

## File map

```
index.html          All page markup, section by section (see HTML comments).
css/style.css        Design tokens (:root) + components + responsive + effects.
js/main.js           Navbar, scroll-reveal, counters, scrollspy, mobile menu,
                     magnetic buttons, card glow, hero canvas network.
assets/logo.svg      Recreated RURC wordmark (swap for the official file if you have it).
assets/favicon.svg   Favicon ("R" monogram in brand blue).
README.md            Short how-to for humans.
CLAUDE.md            This file.
```

## Brand / design tokens

All colors live in `:root` in `css/style.css`. The brand blue is taken from the
RURC logo.

| Token            | Value     | Use                          |
|------------------|-----------|------------------------------|
| `--blue`         | `#1b2fb5` | Primary brand (logo blue)    |
| `--blue-bright`  | `#2f43e0` | Hover / accent               |
| `--blue-deep`    | `#0c1670` | Deep shade, gradients        |
| `--blue-soft`    | `#eaecfb` | Tints, icon backgrounds      |
| `--ink`          | `#0a0e26` | Headings / primary text      |
| `--muted`        | `#5b6080` | Secondary text               |
| `--bg-alt`       | `#f5f6fc` | Alternating section bg       |
| `--bg-dark`      | `#070a1c` | Join (CTA) section bg        |

If the exact logo blue differs, update `--blue` (and the `COLOR` RGB constant in
`js/main.js`, used by the hero canvas — keep it in sync).

## Page sections (in order)

1. Scroll-progress bar + sticky navbar (`.nav`)
2. Hero (`#hero`) — canvas node-network background, grid, glow, CTAs, mini-stats
3. Marquee ticker (keywords)
4. About (`#about`) — sticky heading + mission copy
5. Stats (`#stats` area) — animated counters
6. What we do (`#focus`) — 4 focus-area cards
7. Projects (`#projects`) — 4 project cards with gradient "media"
8. Team (`#team`) — member cards with initial avatars
9. Events (`#events`) — date-stamped event list
10. Partners (`#partners`) — logo grid (text placeholders)
11. Join / CTA (`#join`) — dark section, mailto buttons
12. Footer — brand, nav, socials, copyright

## How to customize (most common tasks)

- **Replace the logo:** drop the official file in `assets/` and either update the
  `assets/logo.svg` contents, or replace the `.logo` markup in `index.html`
  (navbar + footer) with an `<img>`. The in-page logo is currently CSS text
  (`.logo__mark` / `.logo__tag`) for crispness.
- **Edit copy:** all text is directly in `index.html`. Sections are separated by
  clear `<!-- ===== NAME ===== -->` comments.
- **Team members:** edit the `.member` blocks in `#team`. `data-initials` on
  `.member__avatar` sets the avatar text.
- **Projects:** edit `.project` blocks. `data-art="1..4"` on `.project__media`
  picks the gradient. Replace the gradient block with a real `<img>` when photos
  exist.
- **Events:** edit `.event` blocks (`event__day` / `event__mon` for the date).
- **Partners:** edit `.partner` text blocks, or swap to `<img>` logos.
- **Stats numbers:** `data-count` (target) and optional `data-suffix` on
  `.stat__num`.
- **Contact email:** currently `rurc@runi.ac.il` in the Join section + footer.
  Update if the real address differs.
- **Social links:** footer `.footer__social` anchors are `#` placeholders —
  point them at the real Instagram/LinkedIn/GitHub.

## Effects (where they live in `js/main.js`)

- Sticky navbar + scroll-progress bar + back-to-top → `onScroll`
- Mobile hamburger menu → `toggle/menu` block
- Scroll-reveal (`.reveal` → `.is-visible`) → IntersectionObserver
- Animated counters → `animateCount`
- Active-link scrollspy → `spy` observer
- Card cursor glow (`--mx`) and magnetic buttons (`[data-magnetic]`)
- Hero node network → `initNetwork` (canvas; pauses when hero is off-screen)

All motion is gated behind `prefers-reduced-motion` and the CSS has a reduced-
motion fallback — keep that contract when adding effects.

## Run locally

No build needed. Any static server works, e.g.:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Opening `index.html` directly in a browser also works (fonts need internet).

## Deploy

GitHub Pages: Settings → Pages → deploy from branch, root (`/`). The site is the
repo root, so no extra config is required.

## Conventions / guardrails

- Keep it dependency-free and buildless unless there's a strong reason.
- BEM-ish class names (`.block__element--modifier`).
- New colors go through `:root` tokens, not hard-coded hex.
- Respect `prefers-reduced-motion` for anything animated.
- Keep content original to RURC; don't paste copyrighted text/images from other
  clubs' sites.
- Development happens on the feature branch given in the task; commit with clear
  messages and push.
