# Sistema de diseño — HYPE LIVE

## Dirección

Plataforma de streaming comercial (claridad de grandes plataformas, sin clonar).
Fondo negro / azul muy oscuro, acento azul sobrio, rojo solo para EN VIVO y errores.
Sans-serif limpia. Sin coral, neón, glassmorphism ni tipografía editorial.

Identidad provisional: **HYPE LIVE** (`APP_NAME` / `BRAND_NAME` en `@hypelive/domain`).

## Tokens (`@hypelive/design-tokens`)

### Color

| Token | Uso |
|-------|-----|
| `ink` / `charcoal` / `slate` / `elevated` | Capas de superficie |
| `white` / `mist` / `ash` / `stone` | Texto y neutros |
| `accent` `#3D7EEA` | CTA, foco, links |
| `live` / `danger` `#E11D2E` | Solo EN VIVO / errores |
| `success` / `warning` / `info` | Semántica |

### Tipografía

- Sans única (web: Source Sans 3)
- Escala `xs`–`6xl`, pesos 400–700

### Movimiento

- Micro: 150–200 ms
- Hover cards: escala máx. `1.02` (clase `.card-hover`)
- TV `focusScale` ~1.02

## Navegación web

Inicio · En vivo · Programas · Canales · Mi lista · Configuración

## Componentes (nomenclatura compartida)

Button, IconButton, Input, SearchInput, Avatar, Badge, LiveBadge, ContentCard, ChannelCard, ProgramCard, Skeleton, EmptyState, ErrorState, Dialog, Toast, Tabs, NavItem, AppShell, FocusableCard (TV).
