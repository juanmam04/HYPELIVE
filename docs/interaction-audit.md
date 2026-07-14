# Auditoría de interacciones — HYPE LIVE

Fecha: 2026-07-14  
Alcance: polish visual / microinteracciones (sin cambios de modelo, rutas ni features).

## Componentes auditados

| Componente | Hover | Focus | Pressed | Loading | Reduced motion | Notas |
|------------|-------|-------|---------|---------|----------------|-------|
| Button | parcial (color) | global | opacity only | spinner OK | no específico | Falta scale pressed, success/error |
| IconButton | OK | global | scale 0.96 (agresivo) | OK | no | Ajustar a 0.985; tooltip title OK |
| Input / SearchInput | color | border | — | — | — | Focus ring incompleto; error layout |
| ContentCard (Stream) | card-hover 1.02 | ring | scale 1 | — | reduce transform | Falta play icon, img zoom, overlay |
| ChannelCard | card-hover | ring | — | — | — | Logo no resalta |
| ProgramCard | card-hover | ring | — | — | schedule en overlay | Falta próximo horario explícito |
| EpisodeCard | card-hover | ring | — | — | — | Falta play en hover |
| LiveBadge | — | — | — | — | — | Dot sin pulse |
| Dialog | — | Escape | — | confirm | useReducedMotion | Falta focus trap / restore |
| Toast | — | — | — | — | OK | Sin pause on hover; max 3 no enforced; sin warning |
| Skeleton | shimmer | — | — | — | no desactiva shimmer | Genérico; falta delay; white-ish risk |
| FakePlayer | controles siempre | parcial | — | sin skeleton | — | Falta idle/buffering/controls hide |
| LiveChat | — | input | — | sending | — | Sin anim msg; “demo” copy; sin connection UI |
| EmptyState / ErrorState | — | — | — | — | — | OK base; copy a unificar |
| StreamingShell nav | color | — | — | — | — | Sin underline activo sutil |
| Home rows | overflow-x | — | — | Skeleton genérico | — | Sin flechas carousel |
| Route transitions | — | — | — | — | — | Ausentes |
| Mobile cards | — | — | opacity 0.85 | — | — | Sin scale pressed |
| TV Focusable | N/A | scale 1.02 | — | — | — | Subir a 1.04 token |

## Inconsistencias

1. `card-hover` usa scale **1.02** (spec: **1.015**) y pressed vuelve a 1 (spec: **0.985**).
2. Duraciones tokens: fast 150 / normal 180 / slow 200 — incompletas vs motion.instant/page.
3. Easing standard es Material `0.4,0,0.2,1`; spec pide `0.2,0,0,1`.
4. Skeletons genéricos → layout shift relativo en home/channel.
5. Imágenes vía `background-image` → sin fade-in ni fallback de error.
6. Chat muestra “Simulación local (demo)” — suavizar a “Conectado / Reconectando”.
7. Player controles siempre visibles.
8. Sin progress bar de navegación.
9. Sin ContentRow con flechas.
10. Toast sin warning tone ni pause-on-hover.

## Plan de polish (esta fase)

1. Tokens `motion.*` + CSS vars + Tailwind durations.
2. Buttons / IconButton / Inputs.
3. Cards + LiveBadge pulse + FadeImage.
4. Skeletons específicos + delayed reveal.
5. ContentRow carousel + hero enter.
6. PageTransition + top progress.
7. Player estados + controls auto-hide.
8. Chat connection + message enter + counter near limit.
9. Dialog focus trap; Toast max 3 / pause / warning.
10. Empty/Error copy; OfflineBanner.
11. Mobile pressed; TV focusScale 1.04.
