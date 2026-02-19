---
title: "shallowRef"
description: "Что такое shallowRef во Vue 3, когда он нужен, как правильно обновлять данные и зачем использовать triggerRef."
tags:
  - "vue"
  - "ref-and-reactive"
  - "shallowref"
updatedAt: "2026-02-17"
---
# shallowRef Vue 3

`shallowRef` хранит значение как `ref`, но отслеживает только смену ссылки в `.value`.

Это значит:

- `state.value = newValue` -> реактивно, UI обновится.
- `state.value.deep.nested = ...` -> не реактивно само по себе.

Официально:
[Vue Reactivity Advanced](https://vuejs.org/api/reactivity-advanced.html#shallowref),
[Vue Performance Guide](https://vuejs.org/guide/best-practices/performance.html#reduce-reactivity-overhead-for-large-immutable-structures).

## Когда использовать `shallowRef`

- Большие объекты и массивы, где глубокий трекинг дорогой.
- Данные из внешних библиотек (RxJS, XState, сторонние SDK).
- Кеши и снапшоты, которые обычно обновляются заменой ссылки.

## Главное отличие от `ref`

- `ref(obj)`:
  Vue сделает объект внутри глубоко реактивным.
- `shallowRef(obj)`:
  Vue не будет глубоко проксировать вложенность.

Поэтому `shallowRef` удобен, когда вы хотите контролировать обновления вручную и уменьшить накладные расходы.

## Как правильно обновлять

### Вариант 1: заменять ссылку

```ts
import { shallowRef } from "vue";

const state = shallowRef({ items: [1, 2, 3] });

state.value = {
    ...state.value,
    items: [...state.value.items, 4],
}; // UI обновится
```

### Вариант 2: `triggerRef` после глубокой мутации

```ts
import { shallowRef, triggerRef } from "vue";

const state = shallowRef({ items: [1, 2, 3] });

state.value.items.push(4); // само по себе не вызовет обновление
triggerRef(state); // вручную триггерим зависимости
```

## Типичные ошибки

- Использовать `shallowRef` и ожидать авто-реактивность вложенных полей.
- Мутировать глубоко и забывать про `triggerRef`.
- Применять `shallowRef` к простым примитивам без причины (выгоды обычно нет).

## Короткий вывод

- `shallowRef` = реакция на смену `.value`, а не на глубокие мутации.
- Это инструмент для производительности и контролируемых обновлений.
- Если нужна обычная глубокая реактивность объекта, чаще подходит `ref` или `reactive`.

---

<RelatedTopics
    :items="[
        { title: 'ref / reactive: краткая шпаргалка', href: '/vue/ref-and-reactive/reaktivnost-vo-vue3' },
        { title: 'ref vs reactive', href: '/vue/ref-and-reactive/ref-vs-reactive' },
        { title: 'shallowReactive', href: '/vue/ref-and-reactive/shallowreactive' },
    ]"
/>
