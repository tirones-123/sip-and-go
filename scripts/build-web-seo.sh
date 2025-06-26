#!/bin/bash

echo "Building web app with SEO support..."

# Save the smart redirect index.html
cp web/index.html web/index.redirect.html 2>/dev/null || true

# Build the app
npm run build:web

# Copy build to web folder
cp -r dist/* web/

# Restore the smart redirect as index.html
if [ -f web/index.redirect.html ]; then
    mv web/index.html web/app.html
    mv web/index.redirect.html web/index.html
fi

echo "Build complete! SEO redirection preserved." 