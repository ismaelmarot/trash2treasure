import { useEffect } from 'react';

export function PWASetup() {
  useEffect(() => {
    // Meta tag para el color del tema
    const metaThemeColor = document.createElement('meta');
    metaThemeColor.name = 'theme-color';
    metaThemeColor.content = '#0071e3';
    document.head.appendChild(metaThemeColor);

    // Meta tags obligatorios para iOS
    const metaAppleMobileWebAppCapable = document.createElement('meta');
    metaAppleMobileWebAppCapable.name = 'apple-mobile-web-app-capable';
    metaAppleMobileWebAppCapable.content = 'yes';
    document.head.appendChild(metaAppleMobileWebAppCapable);

    const metaAppleStatusBarStyle = document.createElement('meta');
    metaAppleStatusBarStyle.name = 'apple-mobile-web-app-status-bar-style';
    metaAppleStatusBarStyle.content = 'default';
    document.head.appendChild(metaAppleStatusBarStyle);

    const metaAppleMobileWebAppTitle = document.createElement('meta');
    metaAppleMobileWebAppTitle.name = 'apple-mobile-web-app-title';
    metaAppleMobileWebAppTitle.content = 'Trash2Treasure';
    document.head.appendChild(metaAppleMobileWebAppTitle);

    // Enlace para el icono de la pantalla de inicio de iOS
    const linkAppleTouchIcon = document.createElement('link');
    linkAppleTouchIcon.rel = 'apple-touch-icon';
    linkAppleTouchIcon.href = '/icon-192.png';
    document.head.appendChild(linkAppleTouchIcon);

    // Enlace para el manifiesto (PWA)
    const linkManifest = document.createElement('link');
    linkManifest.rel = 'manifest';
    linkManifest.href = '/manifest.json';
    document.head.appendChild(linkManifest);

    // Registro del Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registrado con éxito:', registration.scope);
          })
          .catch((error) => {
            console.log('Error al registrar Service Worker:', error);
          });
      });
    }

    return () => {
      // Cleanup
      document.head.removeChild(metaThemeColor);
      document.head.removeChild(metaAppleMobileWebAppCapable);
      document.head.removeChild(metaAppleStatusBarStyle);
      document.head.removeChild(metaAppleMobileWebAppTitle);
      document.head.removeChild(linkAppleTouchIcon);
      document.head.removeChild(linkManifest);
    };
  }, []);

  return null;
}
