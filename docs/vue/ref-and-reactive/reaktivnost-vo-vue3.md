---
title: "ref / reactive"
description: "Коротко и практично: когда использовать ref, reactive, shallowRef и shallowReactive во Vue 3."
tags:
  - "vue"
  - "ref-and-reactive"
  - "reaktivnost-vo-vue3"
updatedAt: "2026-02-17"
---
# ref / reactive

Это короткий конспект без дублей: что выбрать, когда и почему.

## Что делает каждый API

- `ref(value)`:
  реактивная "ячейка" с `.value`. Подходит для примитивов и значений, которые часто заменяются целиком.
- `reactive(obj)`:
  проксирует объект/массив и даёт глубокую реактивность по свойствам.
- `shallowRef(value)`:
  реактивность только по смене `.value` (вложенные мутации не отслеживаются).
- `shallowReactive(obj)`:
  реактивен только верхний уровень объекта.

Официальная документация:
[Vue Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html),
[Vue Reactivity Core](https://vuejs.org/api/reactivity-core.html),
[Vue Reactivity Advanced](https://vuejs.org/api/reactivity-advanced.html).

## Когда что использовать

- Берите `ref`:
  для `number/string/boolean`, а также когда часто делаете `state = newState`.
- Берите `reactive`:
  для объектного состояния, где часто меняются вложенные поля.
- Берите `shallowRef`:
  для больших структур, внешних сторов и интеграций, где обновление идёт заменой ссылки.
- Берите `shallowReactive`:
  когда нужен контроль только на верхнем уровне, а вложенность обновляется отдельно.

## Мини-пример

```ts
import { ref, reactive, shallowRef, shallowReactive, triggerRef } from "vue";

const count = ref(0);
count.value++;

const form = reactive({
    user: { name: "Alice" },
});
form.user.name = "Bob"; // реактивно

const cache = shallowRef({ items: [] as number[] });
cache.value.items.push(1); // UI не обновится
triggerRef(cache); // обновится после ручного trigger

const settings = shallowReactive({
    theme: "dark",
    nested: { compact: false },
});
settings.theme = "light"; // реактивно
settings.nested.compact = true; // не реактивно
```

## Типичные ошибки

- Деструктурировать `reactive` без `toRefs`:
  реактивная связь теряется.
- Использовать `shallowRef` и ожидать реакцию на глубокую мутацию без `triggerRef`.
- Выбирать `reactive`, когда по факту нужен простой "контейнер" значения (`ref`).

## Короткий вывод

- `ref` = значение целиком.
- `reactive` = реактивные свойства объекта.
- `shallow*` = осознанная оптимизация для тяжёлых структур.

---

<RelatedTopics
    :items="[
        { title: 'ref vs reactive', href: '/vue/ref-and-reactive/ref-vs-reactive' },
        { title: 'shallowRef', href: '/vue/ref-and-reactive/shallowref' },
        { title: 'shallowReactive', href: '/vue/ref-and-reactive/shallowreactive' },
    ]"
/>
