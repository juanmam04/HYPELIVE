# Entrega — polish visual y microinteracciones

Fecha: 2026-07-14

## Resumen

Fase exclusiva de interacción: tokens de motion, hovers/pressed/focus, skeletons, carousels, player, chat, modals/toasts, transiciones de ruta, empty/error, mobile pressed y foco TV. Sin cambios de modelo, rutas ni features de producto.

## Tokens

`packages/design-tokens` → `motion` + `durations`/`easings` actualizados:

- instant 80 · fast 140 · normal 200 · slow 280 · page 320
- easingStandard / enter / exit
- cardHoverScale 1.015 · cardPressedScale 0.985 · tvFocusScale 1.04

CSS en `apps/web/app/globals.css` + Tailwind durations.

## Componentes tocados (web)

Cards, Button, IconButton, Input, LiveBadge, Skeleton + ContentSkeletons, FadeImage, ContentRow, Follow/Reminder, Dialog, Toast, FakePlayer, LiveChat, StreamingShell (nav underline, page transition, progress, offline), Empty/Error, Home.

## Mobile / TV

- Mobile ContentCard/ChannelCard: pressed scale 0.985
- TV Focusable: scale 1.04 + sombra + borde azul

## Verificación

| Check | Resultado |
|-------|-----------|
| Lint web | OK |
| Typecheck web/mobile/TV | OK |
| Tests domain/api/database/validation | OK |
| Build web | OK |
| Screenshots polish | OK en `docs/screenshots/polish-*.png` |

## Limitaciones

- No hay video grabado de hover/TV en esta entrega (screenshots estáticos).
- Transiciones de ruta son CSS fade (no View Transitions API).
- RN no anima duración de foco con CSS; el scale es inmediato al focus.
- Reminder/Follow son UI local (mock) sin persistencia nueva.
