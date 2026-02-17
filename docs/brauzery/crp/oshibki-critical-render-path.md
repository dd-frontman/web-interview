---
title: "Типичные ошибки Critical"
description: "Практический разбор частых ошибок в Critical Render Path: блокирующие ресурсы, layout thrashing, длинные задачи и скачки макета."
tags:
  - "brauzery"
  - "oshibki-critical-render-path"
updatedAt: "2026-02-17"
---
# Типичные ошибки Critical

Эта статья дополняет базовый разбор CRP и фокусируется именно на проблемах, которые чаще всего замедляют первый рендер.

## 1) Блокирующие CSS и JS

### Как выглядит проблема

- много крупных CSS-файлов в `<head>`;
- синхронные скрипты без необходимости.

Пока браузер не дочитал критичные CSS/JS, он не может корректно продолжать рендер.

### Что делать

- оставить в `<head>` только действительно критичные стили;
- остальное грузить отложенно;
- ставить `defer`/`async` там, где это безопасно.

```html
<script src="/app.js" defer></script>
```

## 2) Слишком большой и глубокий DOM

### Как выглядит проблема

- лишние обёртки в разметке;
- глубокая вложенность;
- большие списки без виртуализации.

DOM становится тяжелее для layout и style recalculation.

### Что делать

- упрощать структуру компонентов;
- виртуализировать длинные списки;
- удалять неиспользуемые узлы.

## 3) Layout thrashing

### Как выглядит проблема

Код постоянно чередует чтение layout и запись стилей в одном цикле.

```js
for (const item of items) {
	item.style.width = item.offsetWidth + 10 + "px";
}
```

Так браузер вынужден многократно пересчитывать layout.

### Что делать

- сначала читать размеры/позиции;
- потом отдельным шагом применять записи в DOM;
- батчить обновления через `requestAnimationFrame`.

## 4) Анимации через layout-свойства

### Как выглядит проблема

Анимации `top`, `left`, `width`, `height` приводят к частым reflow.

### Что делать

- анимировать `transform` и `opacity`;
- `will-change` включать точечно и временно.

## 5) CLS: скачки макета

### Как выглядит проблема

- изображения и iframe без размеров;
- динамические вставки контента без резервирования места.

### Что делать

- задавать `width`/`height` или `aspect-ratio`;
- заранее выделять место под рекламу/виджеты/ленивый контент.

## 6) Длинные задачи в main thread

### Как выглядит проблема

Задачи дольше ~50 мс блокируют обработку ввода и ухудшают INP/TBT.

### Что делать

- дробить тяжёлые вычисления;
- переносить часть логики в Web Workers;
- откладывать не-критичную инициализацию.

## 7) Мини-чеклист перед релизом

1. Нет ли блокирующих скриптов без причины?
2. Не разросся ли DOM в ключевых шаблонах?
3. Нет ли участков с layout thrashing?
4. Анимации точно на `transform/opacity`?
5. У медиа заданы размеры?
6. Есть ли long tasks в пользовательских сценариях?

## Официальные источники

- [MDN: Critical rendering path](https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path)
- [web.dev: Render-blocking resources](https://web.dev/articles/render-blocking-resources)
- [web.dev: Avoid large, complex layouts and layout thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)
- [web.dev: Optimize long tasks](https://web.dev/articles/optimize-long-tasks)

---

<RelatedTopics
	:items="[
		{ title: 'Critical Render Path (CRP): полный разбор', href: '/brauzery/crp/critical-render-path' },
		{ title: 'Reflow, Repaint и Layout Thrashing', href: '/brauzery/reflow-repaint-i-layout-thrashing' },
		{ title: 'Forced Synchronous Layout и Long Tasks', href: '/brauzery/forced-synchronous-layout-i-long-tasks' },
	]"
/>
