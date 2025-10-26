# Wall-E Robot 3D

Un sitio web interactivo con un robot estilo Wall-E en 3D creado con Babylon.js.

## Características

🤖 **Robot Wall-E en 3D** - Modelo de robot completamente funcional creado con geometrías básicas (sin problemas de derechos de autor)

🎮 **Controles Interactivos:**
- **W/A/S/D** - Mover el robot por el escenario 3D
- **Q/E** - Rotar el robot
- **ESPACIO** - Abrir y cerrar la compuerta frontal del robot
- **C** - Transformar el robot en un cubo compacto (¡y viceversa!)
- **Click + Arrastrar** - Rotar la cámara alrededor del robot

🌍 **Escenario 3D** - Superficie con patrón de cuadrícula para facilitar la navegación

## Cómo Usar

1. Abre `index.html` en un navegador web moderno
2. Usa los controles del teclado para interactuar con el robot
3. ¡Diviértete explorando las animaciones!

## Tecnología

- **Babylon.js 8.33.2** - Motor de renderizado 3D WebGL
- **JavaScript vanilla** - Sin frameworks adicionales
- **HTML5 Canvas** - Para el renderizado

## Instalación Local

Si deseas ejecutar el proyecto localmente con un servidor:

```bash
# Instalar dependencias
npm install

# Servir el sitio (con Python)
python3 -m http.server 8080

# O con Node.js
npx http-server
```

Luego abre http://localhost:8080 en tu navegador.

## Estructura del Proyecto

```
Wall-E/
├── index.html          # Página principal HTML
├── robot.js           # Lógica del robot y escena 3D
├── lib/               # Bibliotecas de Babylon.js
│   ├── babylon.js
│   └── babylonjs.materials.js
├── package.json       # Configuración de npm
└── README.md         # Este archivo
```

## Licencia

Este proyecto utiliza geometrías básicas creadas programáticamente, sin modelos con derechos de autor.