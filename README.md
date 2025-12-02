# Wall-E Robot 3D

Un sitio web interactivo con un robot estilo Wall-E en 3D creado con Babylon.js.

## Características

🤖 **Robot Wall-E en 3D Mejorado** - Modelo de robot completamente funcional con detalles realistas
- Diseño inspirado en Wall-E con ojos binoculares característicos
- Orugas/tracks realistas para movimiento auténtico
- Panel solar en la parte superior del cuerpo
- Detalles de desgaste y oxidación para mayor realismo
- Pernos/tornillos decorativos en las esquinas
- Texturas procedurales con efectos de envejecimiento

🚜 **Sistema de Orugas** - El robot se mueve con tracks/orugas animadas como el Wall-E original

🎮 **Controles Interactivos:**
- **W/A/S/D** - Mover el robot por el escenario 3D
- **Q/E** - Rotar el robot
- **ESPACIO** - Abrir y cerrar la compuerta frontal del robot
- **C** - Transformar el robot en un cubo compacto (¡y viceversa!)
- **Click + Arrastrar** - Rotar la cámara alrededor del robot

📱 **Controles Táctiles con Joystick** - Sistema de control táctil completamente rediseñado:
- 🕹️ **Joystick circular** en la esquina inferior izquierda para movimiento omnidireccional
- Control analógico suave y responsivo
- Botones de rotación (⟲⟳) en la esquina inferior derecha
- Botones de acción (🚪 compuerta, ◻ transformación) en el lado derecho
- Funciona con touch y mouse para máxima compatibilidad
- Efectos visuales y animaciones al presionar

🌅 **Entorno Realista:**
- **Cielo con Skybox** - Gradiente azul realista con nubes procedurales
- **Césped/Pasto** - Textura detallada de hierba con variaciones de color, parches y detalles
- **Iluminación mejorada** - Luz hemisférica y direccional para mayor realismo
- Todo generado proceduralmente sin archivos externos

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

## Recursos y Licencias

### Todos los Recursos son Libres de Derechos

Este proyecto utiliza **exclusivamente recursos procedurales y libres de derechos**:

1. **Modelo 3D del Robot**: Creado completamente con geometrías básicas de Babylon.js (cubos, cilindros, esferas)
2. **Texturas**: Todas las texturas son generadas proceduralmente usando Canvas API:
   - Textura de césped con variaciones de color y detalle
   - Textura del cielo con gradiente y nubes
   - Texturas de desgaste y oxidación del robot
3. **Sin archivos externos**: No se utilizan modelos 3D, texturas o recursos de terceros
4. **Licencia**: Este proyecto está disponible bajo la licencia MIT

### Fuentes de las Bibliotecas

- **Babylon.js** v8.33.2 - Motor de renderizado 3D WebGL (Apache License 2.0)
- **Blockly** v12.3.1 - Editor de programación visual de Google (Apache License 2.0)

Todas las bibliotecas utilizadas son de código abierto y gratuitas para uso comercial y no comercial.