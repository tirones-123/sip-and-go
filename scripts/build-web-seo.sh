#!/bin/bash

echo "Building web app with SEO support..."

# Save the smart redirect index.html
cp web/index.html web/index.redirect.html 2>/dev/null || true

# Build the app
npm run build:web

# Copy build to web folder
cp -r dist/* web/

# Get the generated JS file name
JS_FILE=$(ls dist/_expo/static/js/web/AppEntry-*.js | head -n 1 | xargs basename)
echo "Generated JS file: $JS_FILE"

# Restore the smart redirect as index.html
if [ -f web/index.redirect.html ]; then
    mv web/index.html web/app.html
    mv web/index.redirect.html web/index.html
fi

# Preserve PWA configurations
echo "Preserving PWA configurations..."

# Update index.html with PWA configurations
cat > web/index.html << EOF
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
    <title>SIP&GO! - Jeu à Boire</title>
    
    <!-- iOS PWA Meta Tags -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="SIP&GO!">
    <meta name="mobile-web-app-capable" content="yes">
    
    <!-- The 'react-native-web' recommended style reset: https://necolas.github.io/react-native-web/docs/setup/#root-element -->
    <style id="expo-reset">
      /* These styles make the body full-height */
      html,
      body {
        height: 100%;
      }
      /* These styles disable body scrolling if you are using <ScrollView> */
      body {
        overflow: hidden;
      }
      /* These styles make the root element full-height */
      #root {
        display: flex;
        height: 100%;
        flex: 1;
      }
    </style>
    <meta name="description" content="Application de jeu à boire ultime pour vos soirées">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#FF784F">
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-3SZWMFEFM8"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-3SZWMFEFM8');
    </script>
  </head>

  <body>
    <!-- Use static rendering with Expo Router to support running without JavaScript. -->
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>
    <!-- The root element for your Expo app. -->
    <div id="root"></div>
    <script src="/_expo/static/js/web/${JS_FILE}" defer></script>
  </body>
</html>
EOF

# Update app.html as well
cp web/index.html web/app.html

# Ensure all PWA assets are in place
echo "Ensuring PWA assets..."
cp -f assets/icon.png web/icon.png
cp -f assets/logo-jauneclair.png web/logo-jauneclair.png
cp -f assets/splash.png web/splash.png

echo "Build complete! SEO redirection preserved." 