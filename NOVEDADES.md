# Novedades - Versión 1.0.0 (Agosto 2026)

¡Bienvenido a la versión oficial 1.0.0 del **Sistema de Levantamiento Técnico de Campo**! 

Esta versión marca el primer lanzamiento estable de producción, diseñado específicamente para garantizar fluidez y precisión en el trabajo de campo.

## 🚀 Características Principales (V 1.0.0)

- **Soporte PWA (100% Offline):** La aplicación ahora es instalable. Una vez cargada en el navegador, el *Service Worker* cachea todos los recursos (`app.js`, `style.css`, Leaflet) permitiendo el uso total de la herramienta en zonas sin cobertura de red.
- **Pines y Gráficos Nativos (SVG):** Eliminada la dependencia de íconos o imágenes locales. Los pines se dibujan dinámicamente según su categoría de color (Paredes, Columnas, Inyección Epóxico, etc.).
- **Etiquetas de Alta Visibilidad:** Al exportar el plano, las etiquetas de los marcadores (ej. `C-R1`) se renderizan usando el color representativo de su categoría con una escala de fuente mejorada para mayor legibilidad.
- **Trazado de Líneas de Reparación:** Inclusión de la herramienta de medición lineal en el lienzo del plano.
- **Motor de Renderizado:** Integración total entre Leaflet.js para la interactividad y HTML5 Canvas para el procesado y exportación instantánea a JPG.

## ⚙️ Notas Técnicas
- Desarrollado en Vanilla JS, CSS3 y HTML5.
- Dependencias offline: `leaflet.js`, `leaflet.css`.
- Listo para ser desplegado mediante GitHub Pages.