# Dashboard Multimedia Interactivo (p5.js) - Actividad 11 & 12

EEST N.º 1 "Eduardo Ader" - 7° 2° - PWD 2026
Creadora: Zoe Linares Rios

## Descripción

Dashboard multimedia interactivo que visualiza frecuencias de audio en tiempo real usando la biblioteca p5.js. El sistema reproduce un archivo de música y genera gráficos dinámicos (barras de frecuencia, partículas y puntero reactivo) que reaccionan tanto al sonido como al movimiento del mouse.

## Funcionalidades implementadas

- Carga y reproducción de archivo de audio (MP3) con p5.sound.js
- Analizador FFT de 64 bandas para descomposición espectral del audio
- Visualización de frecuencias con barras de colores dinámicos
- Círculo interactivo que responde a graves y agudos con el mouse
- Control de volumen con slider visual

## Stack tecnológico

- HTML5
- CSS3 (Flexbox, media queries, diseño oscuro)
- JavaScript (ES6)
- p5.js (librería de gráficos creativos)
- p5.sound.js (extensión de audio)

## Estructura del proyecto

```text
Dashboard Multimedia Interactivo/
├── assets/
│   └── tini.mp3
├── css/
│   └── styles.css
├── js/
│   └── sketch.js
├── index.html
├── LICENSE.md
└── README.md
```

## Cómo ejecutar

1. Abrir la carpeta del proyecto en VS Code
2. Iniciar Live Server (o cualquier servidor local) desde `index.html`
3. Hacer clic en **Play** para activar el audio
4. Mover el mouse sobre el canvas para interactuar con el visualizador

## Notas técnicas

- El navegador bloquea el autoplay de audio; la reproducción se inicia con un clic del usuario
- p5.js y p5.sound se cargan desde CDN (no requieren instalación)
- El canvas se redimensiona automáticamente al ancho del contenedor
- Compatible con Chrome, Firefox y Edge

## Licencia

Proyecto académico para uso educativo.
