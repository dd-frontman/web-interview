> [!tip] Связанные темы
>
> - Типичные ошибки CRP
> - Critical Render Path
> - LCP, INP, TTI

## Reflow, Repaint и Layout Thrashing простыми словами

Когда DOM/CSS меняются, браузер проходит этапы:

1. **Style recalculation**
2. **Layout (reflow)** - пересчет размеров и позиций
3. **Paint** - отрисовка пикселей
4. **Composite** - сборка слоев

Чем чаще и тяжелее эти этапы, тем хуже плавность и отклик интерфейса.

## Что такое reflow (layout)

Reflow - это пересчет геометрии.

Типичные триггеры:

- изменение `width/height/padding/margin`
- добавление/удаление DOM-узлов
- смена шрифтов/контента, влияющих на размеры

## Что такое repaint

Repaint - перерисовка внешнего вида без пересчета геометрии.

Примеры:

- `color`
- `background`
- `box-shadow` (может быть дорогим на больших областях)

## Что такое layout thrashing

Layout thrashing - это многократный forced layout из-за чередования:

- запись в DOM/CSS
- чтение layout-метрик
- снова запись

в одном горячем цикле.

## Плохой пример

```js
for (const card of cards) {
	card.style.width = card.offsetWidth + 20 + "px"; // write + read в каждой итерации
}
```

## Хороший пример (батчинг)

```js
const widths = cards.map((card) => card.offsetWidth); // batch read

cards.forEach((card, i) => {
	card.style.width = widths[i] + 20 + "px"; // batch write
});
```

## `requestAnimationFrame` для UI-обновлений

```js
requestAnimationFrame(() => {
	panel.style.transform = "translateX(0)";
	panel.style.opacity = "1";
});
```

Идея: визуальные изменения выполнять в кадре рендера.

## Что анимировать, чтобы не ломать кадры

Предпочтительно:

- `transform`
- `opacity`

С осторожностью:

- `width/height/top/left` (часто запускают layout)

## Практические стратегии снижения reflow/repaint

1. Группировать чтения отдельно от записей.
2. Минимизировать глубину и сложность DOM.
3. Для локальных сложных зон применять `contain` (когда уместно).
4. Избегать тяжелых визуальных эффектов на больших областях.
5. Профилировать в DevTools, а не гадать.

## Что смотреть в DevTools

- Performance timeline:
  - частые Layout/Paint события
  - длинные кадры (>16ms для 60fps)
- Lighthouse/Core Web Vitals:
  - INP, TBT, CLS

## Официальные материалы

- web.dev: Avoid large, complex layouts and layout thrashing  
  https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing
- MDN: CSS and JavaScript animation performance  
  https://developer.mozilla.org/en-US/docs/Web/Performance/CSS_JavaScript_animation_performance
- MDN: Rendering performance  
  https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work
