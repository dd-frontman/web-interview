> [!tip] Связанные темы
>
> - Critical Render Path
> - LCP, INP, TTI
> - Reflow, Repaint, Layout Thrashing
> - Forced Synchronous Layout и Long Tasks

## Типичные ошибки в Critical Rendering Path

CRP ломается не "одной большой проблемой", а суммой мелких ошибок:

- блокирующие ресурсы
- лишние пересчеты layout
- тяжелый JavaScript в main thread
- скачки макета (CLS)

Ниже самые частые антипаттерны с практическими фикcами.

## 1) Блокирующий CSS и JS в критической зоне

### Ошибка

- много больших CSS-файлов в `<head>`
- синхронные `<script>` без `defer/async`

### Почему плохо

- браузер позже строит CSSOM/Render Tree
- растут LCP и TBT

### Что делать

- critical CSS для above-the-fold оставить минимальным
- второстепенные стили грузить позже
- скрипты ставить `defer`, где возможно

```html
<script src="/app.js" defer></script>
```

## 2) Большой и "грязный" DOM

### Ошибка

- слишком глубокая вложенность
- тысячи узлов без необходимости

### Почему плохо

- дороже style recalculation и layout
- дороже ререндер при изменениях

### Что делать

- упрощать структуру
- убирать лишние обертки
- не рендерить огромные списки целиком (виртуализация)

## 3) Layout thrashing (чередование чтения и записи)

### Ошибка

В цикле читать геометрию (`offsetWidth`) и сразу писать стиль.

```js
for (const item of items) {
	item.style.width = item.offsetWidth + 10 + "px";
}
```

### Почему плохо

- браузер вынужден многократно делать layout
- появляются лаги и плохой INP

### Что делать

- сначала батч всех чтений
- потом батч всех записей

## 4) Анимации через layout-свойства

### Ошибка

Анимировать `top/left/width/height`.

### Почему плохо

- это часто запускает layout + paint на каждом кадре

### Что делать

- анимировать `transform` и `opacity`
- `will-change` только точечно и временно

## 5) CLS: контент "прыгает" после рендера

### Ошибка

- у изображений нет размеров
- блоки рекламы/виджеты вставляются без резервирования места

### Почему плохо

- визуальные скачки
- плохой UX и метрика CLS

### Что делать

- задавать `width`/`height` или `aspect-ratio`
- резервировать место под динамические блоки

## 6) Длинные JS-задачи в main thread

### Ошибка

Операции > 50ms в одном куске.

### Почему плохо

- пользователь кликает, UI "не отвечает"
- ухудшается INP/TBT

### Что делать

- дробить задачи на более мелкие
- выносить тяжелые вычисления в Web Workers
- лениво гидрировать тяжелые зоны UI

## Быстрый чеклист перед релизом

1. Нет блокирующих скриптов без причины.
2. CSS критической зоны минимальный.
3. Нет горячих мест с forced layout.
4. Анимации на `transform/opacity`.
5. У медиа задан размер.
6. В профайлере нет длинных задач в критичных сценариях.

## Официальные материалы

- web.dev: Render-blocking resources  
  https://web.dev/articles/render-blocking-resources
- web.dev: Avoid large, complex layouts and layout thrashing  
  https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing
- web.dev: Optimize long tasks  
  https://web.dev/articles/optimize-long-tasks
- MDN: Critical rendering path  
  https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path
