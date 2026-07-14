# Inventario UI — rediseño (fuente de verdad)

## Existe en el MVP
- Rutas: `/`, `/home`, `/live/[id]`, `/channel/[slug]`, `/watch/[id]`, `/studio`, `/studio/go-live`, `/login`, `/register`
- Datos: canales, programas, streams (live/scheduled/ended), videos, continue watching, chat, follow (demo), share (live)
- Studio: métricas, próxima transmisión, programas, historial, go-live simulado

## No existe (no inventar)
- Películas, noticias, categorías deportivas/documentales como secciones
- Búsqueda cableada, likes, player real

## Navegación rediseño (mapeo a datos existentes)
| Nav | Destino | Fuente de datos |
|-----|---------|-----------------|
| Inicio | `/home` | HomeFeed |
| En vivo | `/en-vivo` | liveNow + todaySchedule |
| Programas | `/programas` | programs |
| Canales | `/canales` | channels |
| Mi lista | `/mi-lista` | continueWatching / sesión |
| Configuración | `/configuracion` | cuenta / demo (sin features nuevas) |

## Dirección visual
Negro/azul muy oscuro, acento azul sobrio, rojo solo LIVE/error, sans limpia, cards rectangulares.
