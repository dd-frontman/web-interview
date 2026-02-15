- **Pixi v8 снова поставляется единым пакетом**; декларации типов (`pixi.js/dist/pixi.d.ts`) лежат прямо внутри node-module, так что `@types` не нужны [GitHub](https://github.com/pixijs/pixijs/discussions/8765)[GitHub](https://github.com/pixijs/pixi.js/issues/7155).
- В `tsconfig.json` включаем строгие флаги и отключаем анализ внутренних структур Pixi, чтобы IDE не тормозила:

```json
{
	"compilerOptions": {
		"strict": true,
		"types": ["vite/client"],
		"paths": {
			"pixi.js": ["node_modules/pixi.js/dist/browser/pixi.mjs"] // тот-же alias используем в Vite
		}
	}
}
```

## 3.2 Сборка и Asset-pipeline

| Задача                                      | Решение                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Быстрый HMR + tree-shaking**              | `vite` + `vite-plugin-pixi` или просто alias до `pixi.mjs`; исправляет ошибку «Cannot use import outside module» на прод-сборке [pixijs.io](https://pixijs.io/assetpack/docs/guide/getting-started/vite/)[Stack Overflow](https://stackoverflow.com/questions/73075168/svelte-vite-pixi-js-build-error-cannot-use-import-statement-outside-a-module) |
| **Автоматическая упаковка спрайтов/звуков** | `@assetpack/core` — плагин запускается в `vite.config.mts`, кладёт оптимизированные ассеты в `public/assets` [pixijs.io](https://pixijs.io/assetpack/docs/guide/getting-started/vite/)                                                                                                                                                                                      |
| **Шаблон под ключ**                         | `create-pixi` уже имеет пресет «Vite + PixiJS» [pixijs.io](https://pixijs.io/create-pixi/docs/guide/installation/)                                                                                                                                                                                                                                   |

## 3.3 Lint + type-safety

- Подключаем `@vue/eslint-config-typescript` — конфиг объединяет `eslint-plugin-vue` и строгие правила `typescript-eslint` [npm](https://www.npmjs.com/package/%40vue/eslint-config-typescript).
- В Flat-конфиге можно включить `vueTsConfigs.recommendedTypeChecked`, чтобы ESLint проверял типы даже внутри шаблонов `<template>`.

## 3.4 Юнит- и интеграционные тесты Canvas

### Vitest

```ts
// Render.test.ts
/**
 * @vitest-environment jsdom
 */
import { Application } from "pixi.js";
import { describe, it, expect } from "vitest";
import "vitest-webgl-canvas-mock"; // даёт 2D+WebGL контекст

describe("Pixi boot", () => {
	it("creates App", () => {
		expect(() => new Application()).not.toThrow();
	});
});
```

- Ошибка `Worker is not defined` решается переходом на Pixi ≥ 8.0 или моком worker-пакетов [Stack Overflow](https://stackoverflow.com/questions/78123897/testing-pixijs-in-vitest).
- Библиотека `vitest-webgl-canvas-mock` — форк jest-версии, который подменяет и 2D, и WebGL контекст [GitHub](https://github.com/RSamaium/vitest-webgl-canvas-mock).

### Jest (если нужен)

- `jest-canvas-mock` или его WebGL-вариант подключаем через `setupFiles` [npm](https://www.npmjs.com/package/jest-webgl-canvas-mock)[Stack Overflow](https://stackoverflow.com/questions/33269093/how-to-add-canvas-support-to-my-tests-in-jest).
- При сложных кейсах удобно запускать тесты в Electron через `@pixi/jest-electron` — реальный браузерный движок без десятка моков [npm](https://www.npmjs.com/package/%40pixi/jest-electron).

### Снятие UI-снапшотов

- Для визуальных регрессий отрисовываем сцену в `RenderTexture`, превращаем в dataURL и сравниваем пиксели — моки Canvas это поддерживают.

## 3.5 Developer-Experience

- **PixiJS DevTools** (расширение Chrome) показывает дерево сцены, размеры текстур и позволяет логировать узел как `$pixi` — must-have на dev-сборке [Chrome Web Store](https://chromewebstore.google.com/detail/pixijs-devtools/aamddddknhcagpehecnhphigffljadon?hl=en).
- **Встроенный Vite HMR** мгновенно перезагружает канву; карта источников остаётся, потому что Pixi v8 разбит на ESM-файлы с поддержкой tree-shaking [GitHub](https://github.com/pixijs/pixijs/discussions/8765).
