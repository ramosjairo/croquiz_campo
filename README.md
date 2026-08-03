[README.md](https://github.com/user-attachments/files/30648754/README.md)
# 📋 Sistema de Levantamiento Técnico de Campo (PWA)

Herramienta web optimizada para dispositivos móviles y de escritorio, diseñada para realizar **levantamientos técnicos de campo, inspecciones y planimetría** de manera completamente offline.

Permite cargar planos arquitectónicos o imágenes, ubicar pines y trazar líneas de patologías/reparaciones por categorías (Paredes, Columnas, Inyección Epóxico, etc.), guardar las posiciones y **exportar el plano final con todas las anotaciones y etiquetas a color** en formato de imagen (JPG).

---

## 🚀 Características Principales

- **100% Offline (PWA):** Gracias al uso de un *Service Worker* y un archivo *Manifest*, la aplicación se puede instalar directamente en la pantalla de inicio del teléfono, tablet o PC y funciona sin conexión a internet.
- **Pines y Gráficos Dinámicos (SVG):** Sistema visual integrado basado en colores por categoría sin dependencia de enlaces externos de imágenes.
- **Herramientas de Precisión:**
  - **Pines:** Ubicación de puntos específicos con etiquetas automáticas (`W1-R1`, `C-R1`, etc.).
  - **Líneas:** Trazado de tramos de reparación de 2 clics.
- **Exportación Profesional:** Generación automática de una imagen JPG consolidada del plano con leyendas y etiquetas a color adaptadas y escaladas.

---

## 🎨 Categorías de Elementos y Colores

| Código | Categoría | Color Representativo |
| :---: | :--- | :---|
| **W1** | Paredes | Gris (`#6b7280`) |
| **P1** | Escayola Grande | Marrón (`#8b4513`) |
| **P2** | Reparación Lineal | Naranja (`#f97316`) |
| **C** | Columna | Rojo (`#ef4444`) |
| **S2** | Inyección Epóxico | Morado (`#a855f7`) |

---

## 🛠️ Tecnologías Utilizadas

- **HTML5 & CSS3** (Diseño adaptable y moderno).
- **JavaScript Moderno (Vanilla JS)** (Lógica del visor y renderizado en Canvas).
- **Leaflet.js** (Gestor de mapas interactivos y coordenadas espaciales).
- **PWA APIs** (Service Workers y Web App Manifest).

---

## 📂 Estructura del Proyecto

```text
├── index.html          # Interfaz principal de usuario
├── style.css           # Estilos visuales y componentes
├── app.js              # Lógica del mapa, pines, líneas y exportación
├── manifest.json       # Configuración de la aplicación progresiva (PWA)
├── sw.js               # Service Worker para funcionamiento en caché offline
├── leaflet.js          # Librería Leaflet local
├── leaflet.css         # Estilos de Leaflet local
├── icon-192.png        # Icono PWA (192x192)
├── icon-512.png        # Icono PWA (512x512)
├── NOVEDADES.md        # Registro de cambios (Changelog)
└── README.md           # Documentación del proyecto
