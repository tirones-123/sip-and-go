import { Asset } from 'expo-asset';

/**
 * Generate PWA manifest dynamically with correct asset URLs
 */
export const generateManifest = async () => {
  // Load the logo asset
  const logoAsset = Asset.fromModule(require('../../assets/logo-jauneclair.png'));
  await logoAsset.downloadAsync();
  const iconUrl = logoAsset.uri || '/assets/logo-jauneclair.png';

  const manifest = {
    name: "SIP&GO! - Jeu à Boire",
    short_name: "SIP&GO!",
    description: "L'application de jeu à boire ultime pour vos soirées. Plus de 1500 questions et défis !",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "fullscreen", "minimal-ui"],
    orientation: "portrait",
    theme_color: "#FF784F",
    background_color: "#0B0E1A",
    lang: "fr",
    dir: "ltr",
    categories: ["games", "entertainment", "lifestyle"],
    prefer_related_applications: false,
    icons: [
      {
        src: iconUrl,
        sizes: "any",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: iconUrl,
        sizes: "48x48",
        type: "image/png"
      },
      {
        src: iconUrl,
        sizes: "72x72",
        type: "image/png"
      },
      {
        src: iconUrl,
        sizes: "96x96",
        type: "image/png"
      },
      {
        src: iconUrl,
        sizes: "128x128",
        type: "image/png"
      },
      {
        src: iconUrl,
        sizes: "144x144",
        type: "image/png"
      },
      {
        src: iconUrl,
        sizes: "152x152",
        type: "image/png"
      },
      {
        src: iconUrl,
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: iconUrl,
        sizes: "256x256",
        type: "image/png"
      },
      {
        src: iconUrl,
        sizes: "384x384",
        type: "image/png"
      },
      {
        src: iconUrl,
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };

  // Create a blob URL for the manifest
  const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
  const manifestUrl = URL.createObjectURL(manifestBlob);

  // Update the manifest link
  let link = document.querySelector('link[rel="manifest"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'manifest');
    document.head.appendChild(link);
  }
  link.setAttribute('href', manifestUrl);

  return manifestUrl;
}; 