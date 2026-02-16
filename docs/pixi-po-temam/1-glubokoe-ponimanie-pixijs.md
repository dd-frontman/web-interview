_`Application`_ создаёт канву, _`Renderer`_ (WebGL или WebGPU) рисует, _`Stage`_ (корневой `Container`) хранит сцены.  
Тесно зная граф-пространство (`Container` → `Sprite`/`Graphics`), ассеты (`Assets.load`), расширяемый движок v8 и методы оптимизации (batching, `ParticleContainer`, `cacheAsBitmap`), senior-разработчик держит 60 FPS и дебажит через DevTools. Всё — с учётом новшеств v8 и реальных «подводных камней».

```
| Сущность        | Роль                                                                                                   |
|-----------------|--------------------------------------------------------------------------------------------------------|
| **Application** | Фасад: инициализирует `Renderer`, `Ticker`, `Stage`, канву; поддерживает `resizeTo` и плагины          |
| **Renderer**    | Низкоуровневый WebGL/WebGPU-движок, выполняет реальные draw-calls                                      |
| **Stage**       | Корневой `Container`, хранит дерево сцены                                                              |
```

### Важные нюансы

1. **WebGPU**. Pixi v8 умеет переключаться на `WebGPURenderer`; важно проверять поддержку браузера и вызывать `await app.init()` после `new Application({ preferWebGPU:true })` — без `init()` движок не прогрузит шейдеры. [pixijs.com](https://pixijs.com/blog/pixi-v8-launches)[pixijs.download](https://pixijs.download/v8.0.0/docs/rendering.WebGPURenderer.html)
2. **autoDensity/ resolution**. Для hi-DPI экранов выставляйте `resolution: devicePixelRatio` + `autoDensity:true`, иначе канва выглядит мутной. [pixijs.download](https://pixijs.download/v8.1.1/docs/app.Application.html)
3. **Resize**. Плагин `ResizePlugin` автоматически подгоняет рендерер к `window`, но если нужно адаптивное соотношение сторон, подписывайтесь на `resize` и меняйте `app.renderer.resize(w,h)` вручную. [pixijs.download](https://pixijs.download/dev/docs/app.Application.html)

```ts
const app = new Application({
	view: canvas,
	preferWebGPU: true,
	resizeTo: window,
	background: "#1d1d1d",
	resolution: devicePixelRatio,
	autoDensity: true,
});
await app.init(); // важно для WebGPU
```

---

## 1.2 Scene Graph: Container, Sprite, Graphics, …

### Иерархия

`Container` может вкладываться друг в друга, образуя дерево; позиция/масштаб каждого узла комбинируется от родителей. [pixijs.com](https://pixijs.com/8.x/guides/components/scene-objects)

### Anchor vs Pivot

- `anchor` — процент от габаритов текстуры, полезно для центрирования спрайта (`anchor.set(0.5)`).
- `pivot` — смещение в пикселях, удобно при анимации ножек/стрелок.  
   Непонимание разницы вызывает «подпрыгивания» объектов при scale. [pixijs.com](https://pixijs.com/8.x/guides/components/scene-objects)

```ts
const hero = Sprite.from("hero.png");
hero.anchor.set(0.5); // центр относительно текстуры
hero.pivot.set(16, 32); // кость ног
```

### Специализированные узлы

- **`Graphics`** — векторные формы, подходят для HUD; но перерасчёт геометрии дорог, кешируйте статику.
- **`AnimatedSprite`** — спрайтовые анимации.
- **`ParticleContainer`** — GPU-инстансинг тысяч частиц, поддерживает только ограниченный набор свойств (position, tint, scale, alpha). [pixijs.download](https://pixijs.download/dev/docs/scene.ParticleContainer.html)

```
| Узел               | Назначение                                   | Замечания                          |
|--------------------|----------------------------------------------|------------------------------------|
| `Container`        | Группирует потомков, формирует иерархию      | Позволяет трансформировать «пачку» |
| `Sprite`           | Быстрый рендер растровой текстуры            | Есть `anchor` и `pivot`            |
| `Graphics`         | Векторные примитивы (HUD, маски)             | Для статики кешируйте              |
| `AnimatedSprite`   | Кадровая анимация из спрайт-листа            | Управление через `play()/stop()`   |
| `ParticleContainer`| Инстансинг десятков тысяч частиц             | Поддерживает ограниченный API      |
```

## 1.3 Асинхронная загрузка ассетов

`const tex = await Assets.load('/bunny.png')` — возвращает `Texture`. Можно передавать массив или manifest для пакетной загрузки. [pixijs.com](https://pixijs.com/8.x/guides/components/assets)

```js
await Assets.init({ basePath: "/sprites" });
const [sheet, sfx] = await Assets.load(["atlas.json", "jump.wav"]);
```

### Нюансы

1. **Bundle-preloading** — объявите manifest, тогда `Assets.loadBundle('core')` скачает файлы параллельно и выполнит callback при готовности.
2. **baseTextureCache** — Pixi шарит текстуры; повторные вызовы `Assets.load` дадут объект из кеша без доп. запроса.
3. **AbortController** — можно отменять загрузку при переходе сцены, освобождая сетевые ресурсы.

```
| Шаг            | API / Паттерн                                    | Что учесть                                 |
|----------------|--------------------------------------------------|--------------------------------------------|
| Инициализация  | `await Assets.init({ basePath })`                | Задайте общий путь для всех ресурсов       |
| Загрузка       | `await Assets.load(['atlas.json', 'bg.mp3'])`    | Возвращает промис; array ≡ параллельная    |
| Бандл          | Manifest + `Assets.loadBundle('core')`           | Гибкая предзагрузка сцен                   |
| Отмена         |`Assets.load(url, { signal })` + `AbortController`| Останавливайте при смене сцены             |
```

---

## 1.4 Архитектура и расширения v8

Pixi 8 перешёл на модульную систему `extensions`. Плагин объявляется статическим полем `extension` с `ExtensionType`. [GitHub](https://github.com/pixijs/pixijs/wiki/Create-PixiJS-Extensions)

```ts
import { extensions, ExtensionType, Renderer } from "pixi.js";

class FPSMeter {
	static extension = { type: ExtensionType.RendererPlugin, name: "fpsMeter" };
	init(renderer: Renderer) {
		this.t0 = performance.now();
	}
	destroy() {}
	postrender() {
		const dt = performance.now() - this.t0;
		renderer.plugins.logger?.info(`frame: ${dt.toFixed(2)}ms`);
		this.t0 = performance.now();
	}
}
extensions.add(FPSMeter);
```

_Расширяем_ рендер-пайплайн без форка Pixi: фильтры, пост-процесс, собственные системы UI.

```
| Тип расширения                   | Где регистрируется           | Пример использования                        |
|----------------------------------|------------------------------|---------------------------------------------|
| Renderer-plugin (`postrender`)   |`ExtensionType.RendererPlugin`| FPS-метр, пост-процесс                      |
| Loader-middleware                | `ExtensionType.Loader`       | Декодирование своих форматов                |
| Display-object                   | `ExtensionType.DisplayObject`| Кастомный UI-контрол (например, Gauge)      |
```

---

## 1.5 Производительность

```
| Приём                                   | Когда выбирать                              | Что даёт                                    |
|-----------------------------------------|---------------------------------------------|---------------------------------------------|
| **Batching (TextureAtlas)**             | 1 000+ однотипных спрайтов                  | Снижает draw-calls, повышает FPS            |
| **`cacheAsBitmap / cacheAsTexture`**    | Статичные слои (HUD, тени)                  | Рисуется один раз → потом как текстура      |
| **`ParticleContainer`**                 | Массовые эффекты (снег, искры)              | GPU-инстансинг, десятки тысяч частиц        |
|**Ticker вместо `requestAnimationFrame`**| Игровая логика, анимация                    | Авто-дельта-тайм, можно паузить             |
| **Переиспользование `Graphics`**        | Много одинаковых векторных примитивов       | Снижает GC-давление и аллокации             |
```

---

<RelatedTopics
	:items="[
		{ title: 'Vue 3 + Pixi паттерны интеграции', href: '/pixi-po-temam/2-vue-3-plus-pixi-patterny-integratsii' },
		{ title: 'TypeScript first', href: '/pixi-po-temam/3-typescript-first' },
		{ title: 'Производительность и отладка', href: '/pixi-po-temam/4-proizvoditelnost-i-otladka' },
	]"
/>

