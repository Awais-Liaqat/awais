# Muhammad Awais — Portfolio Website

This is the source code for Muhammad Awais's personal portfolio: a
static website built with plain HTML, CSS, and JavaScript, with an
interactive 3D avatar section. No build tools, no npm, no backend —
it works by opening `index.html` directly, and it works on GitHub
Pages exactly as-is.

---

## 1. What this website is

A one-page portfolio (`index.html`) with sections for About,
Experience, Skills, Education, Awards, Projects, an interactive 3D
"World" section, and Contact. It's designed to be readable and
editable by someone still learning to code — every file is commented,
and this README explains the moving parts.

---

## 2. Folder structure

```
portfolio/
│
├── index.html          ← the page itself: all content and structure
├── style.css            ← all visual styling
├── script.js             ← all interactivity (menu, animations, 3D)
├── README.md              ← this file
│
└── assets/
    ├── images/
    │   └── profile.jpg     ← your photo (you add this — see Part 9)
    │
    └── models/
        └── avatar.glb        ← your 3D avatar (you add this — see Part 8)
```

**Important:** the `assets/images/` and `assets/models/` folders exist
in this project but are currently **empty** — no `avatar.glb` or
`profile.jpg` file has been generated or included. Nothing was
invented on your behalf. The website is built to handle both files
being missing gracefully (see Part 8 and Part 12 below) until you add
your real files.

---

## 3. What each file does

- **`index.html`** — the content and structure of the page: every
  heading, paragraph, button, and section, in the order they appear.
  If you want to change *what the page says*, this is the file to
  edit.
- **`style.css`** — everything about how the page *looks*: colors,
  fonts, spacing, layout, animations. If you want to change *how the
  page looks*, this is the file to edit.
- **`script.js`** — everything the page *does*: opening the mobile
  menu, animating sections in as you scroll, loading the 3D avatar,
  and showing a fallback if the avatar file is missing.

HTML, CSS, and JavaScript are three separate languages that work
together: HTML is the skeleton, CSS is the skin and clothing, and
JavaScript is the muscles that make things move and respond.

---

## 4. How the 3D system works

The 3D avatar uses a free Google library called **`<model-viewer>`**.
It's loaded with one `<script>` tag in `index.html` — no installation
needed:

```html
<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js" defer></script>
```

**What is a `.glb` file?**
A `.glb` file is a 3D model packaged into a single file — geometry,
textures, and materials all bundled together. It's one of the most
common formats for 3D on the web because it's compact and loads fast
in a browser. (`.gltf` is a closely related format that sometimes
splits the model into multiple files instead of one; this project
expects the single-file `.glb` version.)

**How `<model-viewer>` works:**
It's a custom HTML element — you use it just like `<img>`, but for 3D:

```html
<model-viewer src="assets/models/avatar.glb" camera-controls auto-rotate></model-viewer>
```

**How HTML, CSS, and JavaScript each play a role in the 3D system:**

| Layer | Job |
|---|---|
| **HTML** | Creates the `<model-viewer>` element and tells it which file to load (`src="assets/models/avatar.glb"`) |
| **CSS** | Sizes and positions the viewer, styles the loading spinner and fallback panel, gives the surrounding "stage" its rounded card look |
| **JavaScript** | Watches for the model to load successfully, watches for it to fail, hides the spinner, shows the fallback message if needed |
| **The `.glb` file** | Contains the actual 3D model data — the shape and appearance of the avatar itself |

None of these four layers can do the others' job. HTML alone won't
size the viewer correctly; CSS alone can't detect a loading failure;
JavaScript alone has nothing to control without the HTML element.

**Performance note:** large `.glb` files make the page slower to
load, since the whole model has to download before it can display.
Keep your avatar file as small as you reasonably can (compressed
textures, lower polygon count) — under a few megabytes is a good
target for a portfolio site.

---

## 5. Adding your 3D avatar (`avatar.glb`)

1. Get or export a `.glb` file of your avatar.
2. Rename it exactly to `avatar.glb` (lowercase — file names are
   **case-sensitive** on GitHub Pages, so `Avatar.glb` will *not*
   work).
3. Place it inside `assets/models/`, so the final path is:
   ```
   assets/models/avatar.glb
   ```
4. Commit and push the change (see Part 11 if "commit" is a new word
   for you).
5. Wait about a minute for GitHub Pages to rebuild.
6. Refresh your live website — the 3D avatar should now load in both
   the hero section and the "My 3D World" section (they both point to
   the same file).

**If you don't have a model yet:** that's fine. Until this file
exists, both 3D areas of the site automatically show a clean
placeholder that says *"Add avatar.glb to assets/models/ to display
the 3D character."* The rest of the site works completely normally.

---

## 6. Adding your profile photo (`profile.jpg`)

1. Save your photo as `profile.jpg`.
2. Place it inside `assets/images/`, so the path is:
   ```
   assets/images/profile.jpg
   ```
3. Commit and push.
4. Refresh the site.

**Note on the current build:** the About section in this version
uses text and stat cards rather than a photo frame, to keep the
initial design focused on your stated experience rather than an
empty image placeholder. If you'd like a photo frame added to the
About section, the `assets/images/profile.jpg` path is already
reserved and ready — just ask, and it can be wired in the same way
the 3D fallback works (shows the photo if present, shows a
placeholder if not).

---

## 7. How to customize the website

Every section you're likely to want to edit is marked with a comment
in `index.html`:

```html
<!-- EDIT PERSONAL INFORMATION -->
<!-- EDIT PROJECTS -->
<!-- EDIT CONTACT -->
```

And in `style.css`:

```css
/* MAIN COLORS */   → look for the :root { } block at the very top
```

**To change colors:** open `style.css`, find the `:root` block at the
top (Section 1, "VARIABLES"). Every color on the site is defined
there once — change a value there and it updates everywhere that
color is used.

**To change text:** open `index.html` and edit the text directly.
Section content is grouped under HTML comments like
`<!-- EXPERIENCE -->`, `<!-- SKILLS -->`, etc., matching this README.

**To add a real project:** find the `<!-- EDIT PROJECTS -->` comment
in `index.html`, copy one `<div class="project-card">...</div>`
block, and edit its heading and description.

**To add your GitHub/LinkedIn:** find the `contact-social` block near
the bottom of the Contact section in `index.html`, and replace the
`href="#"` placeholders with your real URLs.

---

## 8. GitHub concepts, explained simply

- **Repository ("repo")** — a project folder that GitHub tracks the
  history of. Your portfolio's repo holds these four files plus the
  `assets` folder.
- **Commit** — essentially "saving a version of your changes," with a
  short message describing what changed. Unlike a normal file save,
  every commit is kept, so you can always go back to an earlier
  version.
- **Main branch** — the primary, published version of your project.
  For a simple portfolio like this, you'll usually work directly on
  `main`.
- **Branch** — a separate copy of your project where you can try
  changes without affecting the main version yet.
- **Pull request** — a request to merge a branch's changes back into
  `main`. Mostly useful when collaborating with others or reviewing
  changes before publishing them; for a solo portfolio project, it's
  optional.
- **GitHub Pages** — a free GitHub feature that takes the files in
  your repo and serves them as a live website.

**"Commit directly to `main`"** means your change goes live (after
GitHub Pages rebuilds) as soon as you save it — simplest option for a
personal project like this one.
**"Create a branch and open a pull request"** means you save your
change separately first, review it, and merge it into `main`
afterward — more relevant once you're collaborating with others or
want to review changes before they go live.

---

## 9. Deploying to GitHub Pages, step by step

1. Create (or open) a GitHub repository. If you want it available at
   `https://awais-liaqat.github.io/`, the repository itself must be
   named exactly `awais-liaqat.github.io` under your GitHub account —
   **verify this username and repository name are available on
   GitHub before relying on that URL; nothing here can confirm
   availability for you.**
2. Upload these files (`index.html`, `style.css`, `script.js`,
   `README.md`, and the `assets` folder) to the repository.
3. Commit the changes.
4. Open the repository's **Settings** tab.
5. Open **Pages** in the left sidebar.
6. Under "Build and deployment," choose **Deploy from a branch**.
7. Choose the **`main`** branch.
8. Choose the **`/ (root)`** folder.
9. Click **Save**.
10. Wait a minute or two for GitHub Pages to build your site.
11. Open the URL GitHub gives you (shown on that same Pages settings
    screen once it's ready) to see your live website.

---

## 10. Troubleshooting

**Website not updating after a change**
Make sure you actually committed the file, then hard-refresh your
browser (Ctrl+Shift+R / Cmd+Shift+R) — browsers cache old CSS/JS
aggressively. GitHub Pages can also take a minute or two to rebuild.

**3D model not appearing**
Check that the file is at exactly `assets/models/avatar.glb`
(lowercase, correct spelling) and that you committed it. Open your
browser's Developer Tools (F12) → Console tab, and look for a
warning starting with `[3D]` — it will tell you why the model fell
back to the placeholder.

**3D model loading forever**
This shouldn't happen — `script.js` includes a 9-second timeout that
automatically shows the fallback message if the model hasn't loaded
by then, so the page never gets stuck showing "Loading…" forever.
If you still see it hang, check your internet connection and the
browser console for errors.

**Profile image not appearing**
The current build doesn't display a profile photo yet (see Part 6
above) — this is expected, not a bug.

**CSS not loading (page looks unstyled)**
Confirm `style.css` is in the same folder as `index.html`, and that
the `<link rel="stylesheet" href="style.css">` line in the `<head>`
hasn't been edited or moved.

**JavaScript not working (menu doesn't open, animations don't play)**
Open Developer Tools → Console and look for a red error message. Also
confirm `script.js` is in the same folder as `index.html`.

**Mobile menu not opening**
Confirm you haven't renamed the `id="nav-toggle"` or `id="mobile-menu"`
attributes in `index.html` — `script.js` looks for those exact IDs.

**GitHub Pages not publishing / blank page**
Double-check Settings → Pages shows "Deploy from a branch," `main`,
and `/ (root)`. If you recently created the repo, give it a few extra
minutes on the first deploy.

**404 error / incorrect URL**
Confirm the repository name matches what you expect, and that
`index.html` sits at the root of the repo (not inside a subfolder).

**Animations not working**
If you (or your OS) have "reduce motion" turned on in accessibility
settings, animations are intentionally minimized — this is a
deliberate accessibility feature of the site, not a bug.

---

## 11. Final testing checklist

- [ ] All navigation links scroll to the correct section
- [ ] Mobile hamburger menu opens, closes, and closes automatically
      after tapping a link
- [ ] Every button does something real (scroll, `mailto:`, `tel:`)
- [ ] Site looks correct with no `avatar.glb` present (fallback shows)
- [ ] Site looks correct with no `profile.jpg` present (no broken
      image icon — none is referenced yet)
- [ ] No horizontal scrolling on mobile widths
- [ ] Keyboard Tab key can reach and activate every link/button, with
      a visible focus outline
- [ ] Page remains readable if JavaScript is disabled (menu simply
      won't open, but all content is visible)
