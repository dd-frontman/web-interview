Ключевая мысль: во «встрече» **PixiJS v8** и **Vue 3** именно Vue управляет состоянием и жизненным циклом, а Pixi — быстрой отрисовкой; важно грамотно «сшить» их, чтобы не перегружать реактивность и не терять FPS. Ниже — подробный разбор паттернов интеграции.

## 2.1 Composition API + жизненный цикл

Vue-хуки дают естественное место, где «включать» и «выключать» Pixi-движок.

```vue
<script setup lang="ts">
import { Application, Sprite, Assets } from "pixi.js";
import { onMounted, onUnmounted, shallowRef } from "vue";

const view = shallowRef<HTMLCanvasElement>();
let app: Application;

onMounted(async () => {
	app = new Application({ view: view.value!, resizeTo: window });
	await app.init(); // важно для WebGPU
	const tex = await Assets.load("/logo.png"); // асинка загрузки
	app.stage.addChild(Sprite.from(tex));
});

onUnmounted(() => app.destroy(true));
</script>

<template>
	<canvas ref="view" />
</template>
```

- `onMounted` / `onUnmounted` обеспечивают корректный старт/стоп и чистку памяти [Stack Overflow](https://stackoverflow.com/questions/67620605/how-to-use-pixi-js-in-a-vue-js-component).
- `shallowRef` хранит ссылку на канву без глубокого трекинга, чтобы Vue не «рекурсировал» по WebGL-полям [Stack Overflow](https://stackoverflow.com/questions/67620605/how-to-use-pixi-js-in-a-vue-js-component).
- `resizeTo: window` автоматом подгоняет рендерер под любое изменение окна, но при кастомном соотношении сторон добавьте собственный обработчик `window.addEventListener('resize', onResize)` и вызовите `app.renderer.resize(w,h)` [HTML5 Game Devs Forum](https://www.html5gamedevs.com/topic/47396-proper-way-to-initializeresize-pixiapplication-for-a-simple-2d-game/).

## 2.2 Компонируемый хэлпер `usePixi`

Выносите общий код в кастом-composable, чтобы переиспользовать:

```ts
// usePixi.ts
import { Application } from "pixi.js";
import { onMounted, onUnmounted } from "vue";

export function usePixi(canvas: HTMLCanvasElement) {
	let app: Application;
	onMounted(async () => {
		app = new Application({ view: canvas, resizeTo: window });
		await app.init();
	});
	onUnmounted(() => app?.destroy(true));
	return {
		get app() {
			return app;
		},
	};
}
```

## 2.3 Custom Renderer `vue3-pixi`

Если хочется декларативных шаблонов вместо imperative-кода, подключайте **vue3-pixi** — поверх Vue Runtime написан свой renderer, который создаёт `Sprite`, `Container`, `Text` и т.д. вместо DOM-узлов [GitHub](https://github.com/hairyf/vue3-pixi).

```vue
<template>
	<PIXI-Stage :width="800" :height="600">
		<PIXI-Sprite texture="/hero.png" :x="hero.x" :y="hero.y" :anchor="0.5" @pointertap="jump" />
	</PIXI-Stage>
</template>

<script setup lang="ts">
const hero = reactive({ x: 400, y: 300 });
function jump() {
	hero.y -= 120;
}
</script>
```

_Все_ Pixi-события (`pointertap`, `pointerover`, …) уже проброшены как нативные слушатели [vue3-pixi.vercel.app](https://vue3-pixi.vercel.app/guide/elements/container.html).  
Под капотом библиотека создана через `createRenderer()` из Vue API, значит остаются `<script setup>`, компилятор шаблонов, HMR и вся обычная экосистема Vue

## 2.4 Разумная реактивность

- **Часто меняющиеся** данные (позиции частиц, гранулярные координаты) держите в самом Pixi — обновляйте их в `app.ticker.add(dt => sprite.x += vx*dt)`; Vue-watchеры слишком медленные для 60 FPS.
- **UI-параметры** (видимость слоя, выбранный скин) можно хранить в `ref`/`reactive`, а в Pixi применять через единственный `watchEffect`.
- Для тяжёлых структур используйте `shallowRef` или `markRaw`, чтобы отключить глубинное трекание Vue и избежать просматриваний больших объектов WebGL-памяти.

## 2.5 Мост событий

Pixi отдаёт `pointer*` события; в imperative-подходе:

```ts
sprite.eventMode = "static";
sprite.on("pointertap", () => emit("select", id));
```

В declarative-renderer событие уже попадает в `@pointertap` (см. пример выше) [vue3-pixi.vercel.app](https://vue3-pixi.vercel.app/guide/elements/container.html). Vue механика `emit` остаётся неизменной, что упрощает связь с остальными компонентами приложения.

## 2.6 Производительность «на стыке»

| Приём                        | Где ставить мост   | Деталь / эффект                                                                                                                                                                           |
| ---------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`Ticker` вместо watchers** | Игровая логика     | Даёт стабильную дельту и не трогает Vue DOM                                                                                                                                               |
| **`ParticleContainer`**      | Эффекты снега/искр | Инстансинг 50 000+ частиц без просадок [pixijs.com](https://pixijs.com/blog/particlecontainer-v8)                                                                  |
| **Атласы + batching**        | UI-иконки          | < 1 draw-call для десятков спрайтов                                                                                                                                                       |
| **DevTools**                 | Профилинг          | Проверяйте draw-calls и сцену прямо в браузере [Chrome Web Store](https://chromewebstore.google.com/detail/pixijs-devtools/aamddddknhcagpehecnhphigffljadon?hl=en) |

## 2.7 Тесты и DX

- **vite + vitest**: билдит Vue и Pixi единым конфигом, HMR работает и для канвы.
- **jest-canvas-mock** или `@pixi/canvas-renderer` в тестах — позволяет снимать снапшоты Pixi-сцены без WebGL.
- Типы идут из самого пакета Pixi (нет `@types`) — строгий TypeScript без лишних зависимостей [pixijs.download](https://pixijs.download/dev/docs/assets.Assets.html).

## 2.8 Мини-архитектура SPA

```
<App>
 ├─ <MainScene>          ← канва / Pixi
 │    └ usePixi()
 ├─ <HudPanel>           ← обычный DOM + CSS
 └─ <SettingsModal>      ← Teleport в конец body
```

Слои DOM-UI (Vue) и Pixi-канва разделены; события из Pixi пробрасываются во Vue через `emit`, а реактивные пропы — «затягиваются» внутрь Pixi через watchers. Такой подход даёт чистую границу, лёгкий тест и быстрый рендер.

### Вывод

Грамотная интеграция Pixi и Vue строится на простых принципах: используем хуки Vue для старта/останова канвы, держим горячие данные в Pixi, холодные — в реактивности, а за декларативность отвечает `vue3-pixi` (или собственный renderer). Следуя этим паттернам, вы получаете реактивный фронт плюс 60 FPS-рендер без лишнего кода.
