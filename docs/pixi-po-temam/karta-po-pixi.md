---
title: "Карта по Pixi"
description: "Pixi даёт быстрый WebGL/WebGPU-рендер 2D-сцен, Vue 3 — реактивное UI. Senior обязан уверенно владеть ядром Pixi (рендер-пайплайн, сцена, текстуры), глубоко знать Compo..."
tags:
  - "pixi-po-temam"
  - "karta-po-pixi"
updatedAt: "2026-02-16"
---
Pixi даёт быстрый WebGL/WebGPU-рендер 2D-сцен, Vue 3 — реактивное UI. Senior обязан уверенно владеть ядром Pixi (рендер-пайплайн, сцена, текстуры), глубоко знать Composition API Vue и уметь «сшивать» оба мира: управлять жизненным циклом канвы через хуки, держать state в реактивности, оптимизировать FPS (batching, кеширование), типизировать всё TypeScript-ом и автоматизировать билд (Vite/Vitest). Ниже — подробности и примеры кода.

---

## 1. Глубокое понимание PixiJS

| Что знать                                                                         | Зачем                                                                                                                                                                            |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Application / Renderer / Stage** — базовая точка входа, API `init()` для WebGPU | Основы инициализации сцены [pixijs.com](https://pixijs.com/8.x/guides/getting-started/intro)                                                                                     |
| **Scene Graph**: `Container`, `Sprite`, `Graphics`, `Text`, `NineSlice`           | Структура отображаемых объектов [pixijs.com](https://pixijs.com/8.x/guides)                                                                                                      |
| **Assets & Texture Loader**: асинхронная загрузка, `Assets.load`                  | Подготовка ресурсов до монтирования Vue компонента [pixijs.com](https://pixijs.com/8.x/guides)                                                                                   |
| **Pixi v8 Architecture & Extensions**                                             | Плагинная модель, возможность писать собственные рендер-системы [pixijs.com](https://pixijs.com/8.x/guides/concepts/architecture)                                                |
| **Performance Tips**: геометрический batching, `cacheAsTexture`, GC-ловушки       | Поддержка 60 FPS в сложных сценах [pixijs.com](https://pixijs.com/8.x/guides/concepts/performance-tips)                                                                          |
| **DevTools** (официальное расширение)                                             | Инспекция сцены и текстур прямо в браузере [pixijs.com](https://pixijs.com/8.x/guides/getting-started/ecosystem)[pixijs.io](https://pixijs.io/devtools/docs/guide/installation/) |

### Мини-пример прямого включения Pixi в Vue

```vue
<script setup lang="ts">
import { Application, Sprite, Assets } from "pixi.js";
import { onMounted, onUnmounted, ref } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);
let app: Application;

onMounted(async () => {
	app = new Application({ view: canvas.value!, resizeTo: window });
	await app.init();
	const tex = await Assets.load("/logo.png");
	app.stage.addChild(Sprite.from(tex));
});

onUnmounted(() => app.destroy(true));
</script>

<template><canvas ref="canvas" /></template>
```

---

## 2. Vue 3 + Pixi: паттерны интеграции

### 2.1 Composition API и жизненный цикл

- Используем `onMounted` / `onUnmounted` для создания и уничтожения Pixi-приложения [vuejs.org](https://vuejs.org/guide/extras/composition-api-faq).
- Реактивные пропы (`ref`, `reactive`) управляют положением и параметрами спрайтов без лишних `setState` [vuejs.org](https://vuejs.org/api/).

### 2.2 Кастомный рендерер (vue3-pixi)

- Библиотека **vue3-pixi** строит Pixi-объекты через собственный renderer Vue; позволяет писать JSX/Template как обычную разметку [GitHub](https://github.com/hairyf/vue3-pixi)[vue3-pixi.vercel.app](https://vue3-pixi.vercel.app/guide/api-reference/renderer.html).

```vue
<template>
	<PIXI-Stage :width="800" :height="600">
		<PIXI-Sprite texture="/hero.png" :x="400" :y="300" :anchor="0.5" @pointertap="jump" />
	</PIXI-Stage>
</template>
```

- Полная поддержка событий (`pointertap`, `drag`, …) и transition-эффектов — всё остаётся реактивным [vue3-pixi.vercel.app](https://vue3-pixi.vercel.app/).

### 2.3 Общие best practices

1. Храните heavy-модели вне Vue reactivity, передавайте в компоненты только ссылки/идентификаторы.
2. Снимаем нагрузку с реактивной системы: анимацию делаем в Pixi-`Ticker`, а не в `watch`/`computed`.
3. Используем `<script setup>` для декларативных компонент SFC и лаконичного кода [vuejs.org](https://vuejs.org/api/sfc-script-setup).

---

## 3. TypeScript, тесты и DX

- Pixi v8 поставляется с единым `*.d.ts`-bundle — никаких `@types` не нужно [pixijs.com](https://pixijs.com/blog/better-docs-v8).
- Рекомендуемый стек: **Vite + Vue 3 + vite-plugin-pixi** (авто-external) — минимальный бандл и HMR.
- Покрываем игру логику `vitest`, снапшоты Canvas — через `jest-canvas-mock`.
- ESLint + eslint-plugin-vue + TypeScript strict mode — ловим утечки рантайм-типа.

---

## 4. Производительность и отладка

1. **Batching**: объединяйте однотипные спрайты, используйте `Sprite.from` со спрайт-шейтами.
2. **`cacheAsTexture`** для статических слоёв UI и теней [pixijs.com](https://pixijs.com/8.x/guides/components/scene-objects/container/cache-as-texture).
3. **RenderTexture pooling** — избегаем частого GC.
4. В DevTools проверяем размеры текстур и размеры draw-calls — стремимся <1 000 draw-calls на кадр.
5. При тяжёлых сценах комбинируем Pixi 2D с Three.js 3D, выводя оба контекста поверх друг друга [pixijs.com](https://pixijs.com/8.x/guides/third-party/mixing-three-and-pixi).

---

## 5. Архитектура продукта

- **Модульный DOM-less UI** — рендер всей игры в Pixi, HUD/меню — компонентами Vue DOM, поверх канвы (z-index).
- **FSM или ECS** для сложной логики; ECS-данные остаются вне Vue, Vue отвечает только за визуальный слой.
- **DI / composables**: выносите общие Pixi-helpers (`useTicker`, `useResize`) в отдельные composable-файлы для повторного использования [vuejs.org](https://vuejs.org/guide/reusability/composables).

---

<RelatedTopics
	:items="[
		{ title: 'Глубокое понимание PixiJS', href: '/pixi-po-temam/1-glubokoe-ponimanie-pixijs' },
		{ title: 'Vue 3 + Pixi паттерны интеграции', href: '/pixi-po-temam/2-vue-3-plus-pixi-patterny-integratsii' },
		{ title: 'TypeScript first', href: '/pixi-po-temam/3-typescript-first' },
	]"
/>
