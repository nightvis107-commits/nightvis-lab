# NIGHTVIS LAB · v3.1

Suite estática de cuatro herramientas en HTML, CSS y JavaScript. No necesita servidor, cuenta ni compilación; abre `index.html` o publícala en GitHub Pages.

## Apps

| App | Página | Enfoque |
|---|---|---|
| ARK Command Center | `ark.html` | Registro de dinosaurios, bases, crianza, jefes y catálogo filtrable de comandos útiles de ARK: Survival Evolved / Ascended. Selección no exhaustiva. |
| EGO Tracker | `ego.html` | Seguimiento manual de torneos y estadísticas de Fortnite, con identidad visual original. |
| Rewards Quest | `rewards.html` | Seguimiento manual de puntos, metas y estimaciones. No está conectado a Microsoft Rewards. |
| GameHub | `gamehub.html` | Historial gamer precargado con juegos mencionados, fichas editables, estados y progreso. |

Move Studio es una app aparte con ZIP propio y no forma parte de esta suite.

## Publicar en GitHub Pages

1. Crea un repositorio y copia el contenido de esta carpeta a la raíz; `index.html` debe quedar en la raíz.
2. En GitHub abre **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
4. Guarda y abre la dirección que GitHub Pages muestre al terminar.

El service worker almacena las páginas después de la primera visita HTTPS y permite volver a abrirlas sin conexión.

## Datos y respaldos

Cada app guarda datos en `localStorage` del navegador y dispositivo actual. No se sincronizan con GitHub ni entre dispositivos. Los botones al pie exportan o importan JSON de esa app.

## Comandos ARK

Catálogo seleccionado, no exhaustivo. La [wiki oficial de la comunidad](https://ark.wiki.gg/wiki/Console_commands) mantiene notas de sintaxis y diferencias por juego. Los comandos de administrador requieren permisos en servidores; disponibilidad y parámetros pueden variar según versión, plataforma, mapa o configuración. Verifica antes de comandos destructivos.
