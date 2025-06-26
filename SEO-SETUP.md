# SIP&GO! SEO Setup Documentation

## Overview

The SIP&GO! web deployment now includes SEO-optimized pages alongside the PWA app.

## Structure

- **`/`** - Smart redirect (bots → landing page, users → app)
- **`/landing.html`** - Main SEO landing page
- **`/app.html`** - The actual PWA application
- **`/packs/`** - Game pack details (SEO)
- **`/features.html`** - Features page (SEO)
- **`/drinking-games.html`** - Guide content (SEO)
- **`/install-app.html`** - Installation guide
- **`/drink-responsibly.html`** - Safety information
- **`/terms.html`** - Terms of service
- **`/privacy.html`** - Privacy policy

## How It Works

### Smart Redirection

The `index.html` file contains JavaScript that:
1. Detects search engine bots and crawlers
2. Checks if visitors come from search engines
3. Redirects accordingly:
   - Bots/Search visitors → `/landing.html` (SEO content)
   - Regular users → `/app.html` (PWA)
   - Force app access with `/?app=true`

### Building the App

Use the custom build script to preserve SEO setup:

```bash
./scripts/build-web-seo.sh
```

Or manually:

```bash
# Save redirect
cp web/index.html web/index.redirect.html

# Build
npm run build:web

# Copy to web
cp -r dist/* web/

# Restore redirect
mv web/index.html web/app.html
mv web/index.redirect.html web/index.html
```

## SEO Features

- ✅ Proper meta tags on all pages
- ✅ Canonical URLs
- ✅ Open Graph & Twitter Cards
- ✅ JSON-LD structured data
- ✅ XML sitemap (`/sitemap.xml`)
- ✅ Long-form content (600+ words)
- ✅ Mobile-responsive design
- ✅ Fast loading (inline CSS)

## Target Keywords

- Primary: "drinking games", "drinking game app", "party games"
- Brand: "SIP&GO!"
- Long-tail: "free drinking games", "bachelor party games", etc.

## Deployment

Deploy the entire `web/` folder to your hosting. No server-side configuration needed. 