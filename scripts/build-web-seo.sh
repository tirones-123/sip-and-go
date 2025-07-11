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
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>SIP&GO! - The Ultimate Drinking Game App</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="SIP&GO! - The ultimate drinking game app with 5 themed packs and over 1500 questions to spice up your parties. Available for free!">
    <meta name="keywords" content="drinking game, party game, SIP&GO, drinking app, party app, social game, fun games">
    <meta name="author" content="SIP&GO!">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://sipandgo.app/">
    <meta property="og:title" content="SIP&GO! - The Ultimate Drinking Game App">
    <meta property="og:description" content="Discover SIP&GO!, the drinking game app with 5 themed packs and over 1500 questions. Perfect for your parties!">
    <meta property="og:image" content="https://sipandgo.app/logo-jauneclair.png">
    <meta property="og:image:width" content="1024">
    <meta property="og:image:height" content="1024">
    <meta property="og:locale" content="en_US">
    <meta property="og:locale:alternate" content="fr_FR">
    <meta property="og:site_name" content="SIP&GO!">
    
    <!-- Twitter Card -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://sipandgo.app/">
    <meta property="twitter:title" content="SIP&GO! - The Ultimate Drinking Game App">
    <meta property="twitter:description" content="Discover SIP&GO!, the drinking game app with 5 themed packs and over 1500 questions.">
    <meta property="twitter:image" content="https://sipandgo.app/logo-jauneclair.png">
    
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
    
    <!-- Preload fonts -->
    <link rel="preload" href="/assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.6148e7019854f3bde85b633cb88f3c25.ttf" as="font" type="font/ttf" crossorigin="anonymous">
    
    <!-- Font declarations -->
    <style>
      @font-face {
        font-family: 'Ionicons';
        src: url('/assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.6148e7019854f3bde85b633cb88f3c25.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      
      @font-face {
        font-family: 'Montserrat_400Regular';
        src: url('/assets/node_modules/@expo-google-fonts/montserrat/400Regular/Montserrat_400Regular.38712903602f88435ddddec98862f8b8.ttf') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
      
      @font-face {
        font-family: 'Montserrat_800ExtraBold';
        src: url('/assets/node_modules/@expo-google-fonts/montserrat/800ExtraBold/Montserrat_800ExtraBold.1497e6fee4dd060b35f6b49e4241cb3f.ttf') format('truetype');
        font-weight: 800;
        font-style: normal;
      }
    </style>
    
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