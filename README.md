# Iram Wellness Zone

A complete, responsive static website for **Iram Wellness Zone** — a weight loss and wellness community. Built with plain **HTML5, CSS3, and vanilla JavaScript** only (no frameworks, no build tools). Ready to deploy directly on **GitHub Pages**.

## Folder structure

```
Iram-Wellness-Zone/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   ├── hero/                 → hero background
│   ├── before-after/         → transformation photo pairs
│   ├── testimonials/         → member avatar photos
│   └── icons/                → (icons are inline SVG in the HTML — this folder is reserved if you'd rather use image files)
├── favicon.ico
└── README.md
```

## What's already built in

- Sticky navigation with a JS-powered hamburger menu for mobile
- Full-screen hero section with three call-to-action buttons (Join Community, Contact Us, WhatsApp)
- About, Why Choose Us, Services, Testimonials, and FAQ (accordion) sections
- A **drag-to-reveal before/after slider** for every transformation — drag the handle (or tap/click) to compare, click anywhere on a card to open a full detail lightbox
- A contact form with live JavaScript validation and on-page success/error messages (no page reload, no backend required)
- A Google Maps embed placeholder
- Floating WhatsApp, Call, and Scroll-to-Top buttons
- Scroll-reveal animations, hover effects, and a page-load animation — all pure CSS/JS
- Fully responsive layout (mobile, tablet, laptop, desktop) using Flexbox and CSS Grid
- Reduced-motion support for accessibility

## How to customize

### 1. Replace placeholder images
All images in `images/` are generated placeholders labelled with what they should become. Replace them **using the exact same filenames** and everything will update automatically:

- `images/hero/hero-background.jpg` — a wide (1920×1080 or larger) photo for the hero background
- `images/before-after/transformation-1-before.jpg` / `-after.jpg` (and `-2-`, `-3-`) — real member photos
- `images/testimonials/avatar-1.jpg`, `avatar-2.jpg`, `avatar-3.jpg` — member profile photos

### 2. Add more transformations
Open `index.html`, find the `<!-- Transformation 1 -->` block inside `<section class="gallery">`, copy the whole `<div class="reveal-slider">...</div>` block, and update:
- `data-name`, `data-lost`, `data-duration`
- `data-before` / `data-after` (paths to your new images)
- the `<img>` `src` attributes and the caption text

No JavaScript changes are needed — the slider and lightbox work automatically for any card with this markup.

### 3. Update contact details
Search `index.html` for:
- `+91 00000 00000` (phone/WhatsApp — also update the `tel:` and `wa.me/` links)
- `hello@iramwellnesszone.example` (email)
- The address placeholder in the Contact section

### 4. Wire up the contact form to actually send messages
GitHub Pages can't run backend code, so the form currently shows a success message without sending anywhere. To actually receive submissions, sign up for a free form backend such as [Formspree](https://formspree.io) or [EmailJS](https://www.emailjs.com), then update the `submit` handler in `js/script.js` (see the comment marked `No backend on GitHub Pages`) to call their API instead of simulating success.

### 5. Update the map
Replace the `src` on the `<iframe>` inside `<section class="map-section">` with your own Google Maps embed link (Google Maps → Share → Embed a map → copy the `src` URL).

### 6. Colors, fonts, and text
All colors and spacing are defined as CSS custom properties at the top of `css/style.css` (the `:root` block) — change them once and they apply site-wide. Headings use **Fraunces**, body text uses **Inter** (loaded from Google Fonts, with system font fallbacks so the site still works fully offline).

## Deploying to GitHub Pages

1. Create a new GitHub repository and push this entire folder's contents to it.
2. In the repository, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to `Deploy from a branch`, choose your default branch and the `/ (root)` folder.
4. Save — your site will be live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

No build step, package manager, or server is required.
