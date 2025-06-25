import { useEffect } from 'react';
import { isWeb } from '../utils/platform';
import { Asset } from 'expo-asset';
import { generateManifest } from '../utils/generateManifest';

/**
 * Hook to configure PWA meta tags dynamically
 * This helps ensure proper PWA behavior on iOS
 */
export const usePWAConfiguration = () => {
  useEffect(() => {
    if (!isWeb) return;

    const configurePWA = async () => {
      // Generate dynamic manifest with correct asset URLs
      await generateManifest();

      // Load the logo asset using Expo Asset
      const logoAsset = Asset.fromModule(require('../../assets/logo-jauneclair.png'));
      await logoAsset.downloadAsync();
      const iconUrl = logoAsset.uri || '/assets/logo-jauneclair.png';

      console.log('PWA Icon URL:', iconUrl);

      // Create or update meta tags for PWA
      const updateMetaTag = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // Create or update link tags
      const updateLinkTag = (rel: string, href: string, sizes?: string) => {
        let link = sizes 
          ? document.querySelector(`link[rel="${rel}"][sizes="${sizes}"]`)
          : document.querySelector(`link[rel="${rel}"]:not([sizes])`);
        
        if (!link) {
          link = document.createElement('link');
          link.setAttribute('rel', rel);
          if (sizes) link.setAttribute('sizes', sizes);
          document.head.appendChild(link);
        }
        link.setAttribute('href', href);
      };

      // Set all necessary meta tags for iOS PWA
      updateMetaTag('apple-mobile-web-app-capable', 'yes');
      updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
      updateMetaTag('apple-mobile-web-app-title', 'SIP&GO!');
      updateMetaTag('mobile-web-app-capable', 'yes');
      updateMetaTag('format-detection', 'telephone=no');
      updateMetaTag('theme-color', '#FF784F');
      updateMetaTag('application-name', 'SIP&GO!');
      
      // Force viewport for true fullscreen
      updateMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, shrink-to-fit=no');

      // Update various icon sizes for iOS
      updateLinkTag('apple-touch-icon', iconUrl);
      updateLinkTag('apple-touch-icon', iconUrl, '57x57');
      updateLinkTag('apple-touch-icon', iconUrl, '72x72');
      updateLinkTag('apple-touch-icon', iconUrl, '76x76');
      updateLinkTag('apple-touch-icon', iconUrl, '114x114');
      updateLinkTag('apple-touch-icon', iconUrl, '120x120');
      updateLinkTag('apple-touch-icon', iconUrl, '144x144');
      updateLinkTag('apple-touch-icon', iconUrl, '152x152');
      updateLinkTag('apple-touch-icon', iconUrl, '180x180');
      updateLinkTag('icon', iconUrl);
      updateLinkTag('shortcut icon', iconUrl);

      // Add web app manifest link
      updateLinkTag('manifest', '/manifest.json');

      // iOS specific: Set status bar height to 0
      const style = document.createElement('style');
      style.innerHTML = `
        @supports (-webkit-touch-callout: none) {
          /* iOS only */
          :root {
            --sat: env(safe-area-inset-top);
            --sar: env(safe-area-inset-right);
            --sab: env(safe-area-inset-bottom);
            --sal: env(safe-area-inset-left);
          }
          
          /* Remove all margins and paddings that might show the URL bar */
          html, body {
            position: fixed !important;
            overflow: hidden !important;
            width: 100% !important;
            height: 100vh !important;
            height: -webkit-fill-available !important;
            margin: 0 !important;
            padding: 0 !important;
            top: 0 !important;
            left: 0 !important;
          }
          
          /* Ensure the app fills the entire screen */
          #root {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
            overflow: hidden !important;
          }
          
          /* Hide any potential scroll indicators */
          ::-webkit-scrollbar {
            display: none !important;
          }
          
          /* Force standalone mode styles */
          @media all and (display-mode: standalone) {
            body {
              -webkit-touch-callout: none !important;
              -webkit-user-select: none !important;
              user-select: none !important;
            }
          }
        }
      `;
      document.head.appendChild(style);

      // Prevent elastic scrolling on iOS
      document.body.addEventListener('touchmove', (e) => {
        if (!e.target || !(e.target as HTMLElement).closest('.scrollable')) {
          e.preventDefault();
        }
      }, { passive: false });

      // Force hide address bar
      window.scrollTo(0, 1);
      setTimeout(() => window.scrollTo(0, 1), 100);
      setTimeout(() => window.scrollTo(0, 1), 500);
    };

    configurePWA();

    return () => {
      // Cleanup if needed
    };
  }, []);
}; 