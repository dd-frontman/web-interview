---
title: "Z index i"
description: "z-index определяет порядок наложения элементов по оси Z (кто \\\\\"поверх\\\\\" кого)."
tags:
  - "css"
  - "z-index-i-stacking-context"
updatedAt: "2026-02-16"
---
## Что такое `z-index`

`z-index` определяет порядок наложения элементов по оси Z (кто "поверх" кого).

Важно:

- работает для позиционируемых элементов (`relative/absolute/fixed/sticky`) и некоторых других случаев
- сравнивается внутри одного stacking context

Если у элемента большой `z-index`, но он в другом stacking context, он все равно может оказаться ниже.

## Что такое stacking context

Stacking context — это "локальный слой", внутри которого браузер сравнивает `z-index`.

Новые stacking context часто создают:

- корневой элемент (`html`)
- позиционируемый элемент с `z-index` не `auto`
- `opacity < 1`
- `transform`, `filter`, `perspective`
- `isolation: isolate`
- `will-change` (для свойств, которые создают контекст)

## Пример, где `z-index` "не работает"

```html
<div class="parent">
    <div class="tooltip">Tooltip</div>
</div>
<div class="modal">Modal</div>
```

```css
.parent {
    position: relative;
    transform: translateZ(0); /* создает новый stacking context */
}

.tooltip {
    position: absolute;
    z-index: 9999;
}

.modal {
    position: fixed;
    z-index: 10;
}
```

`tooltip` может оказаться под `modal`, даже с `9999`, потому что их сравнение идет через разные контексты.

## Рабочая стратегия для проекта

1. Договоритесь о шкале слоев (например: header 10, dropdown 100, modal 1000, toast 1100).
2. Минимизируйте лишние `transform`/`opacity` на контейнерах.
3. Храните оверлеи (modal/popover) ближе к корню приложения.
4. Проверяйте stacking context в DevTools.

<OfficialDocsLinks
    :links="[
        { title: 'MDN: z-index', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/z-index' },
        {
            title: 'MDN: Stacking context',
            href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context',
        },
    ]"
/>

---

<RelatedTopics
    :items="[
        { title: 'Позиционирование в CSS', href: '/css/pozitsionirovanie-v-css' },
        { title: 'will-change', href: '/css/will-change' },
        { title: 'Shadow DOM', href: '/html/shadow-dom' },
    ]"
/>
