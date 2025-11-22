import { useEffect } from 'react';

/**
 * Un hook personalizado para actualizar dinámicamente el favicon de la página.
 * @param {string} href - La URL del nuevo favicon.
 */
const useFavicon = (href) => {
  useEffect(() => {
    // No hacer nada si no se proporciona un href
    if (!href) {
      return;
    }

    // Buscar el elemento <link> del favicon existente
    let link = document.querySelector("link[rel*='icon']");

    // Si no existe, crearlo y añadirlo al <head>
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    // Actualizar la ruta del favicon
    link.href = href;

    // El efecto se vuelve a ejecutar solo si el `href` cambia
  }, [href]);
};

export default useFavicon;
