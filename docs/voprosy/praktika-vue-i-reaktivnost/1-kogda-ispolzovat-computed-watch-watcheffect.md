---
title: "Когда использовать computed, watch и watchEffect?"
description: "Ответ про различие между computed, watch и watchEffect, и как выбирать правильный инструмент под задачу."
tags:
  - "voprosy"
  - "vue"
  - "reaktivnost"
  - "watch"
updatedAt: "2026-03-12"
---
# Когда использовать computed, watch и watchEffect?

## Ответ

### `computed`

Используется для вычисляемых значений, которые зависят от других реактивных данных.

Особенности:

- результат кешируется;
- пересчитывается только при изменении зависимостей;
- не должен иметь побочных эффектов.

Примеры:

- фильтрация списка;
- форматирование данных;
- вычисление статуса.

Главное правило: если значение можно получить как чистую функцию от других данных, это `computed`.

### `watch`

Используется, когда нужно выполнить побочный эффект при изменении данных.

Типичные случаи:

- API-запрос;
- запись в `localStorage`;
- запуск анимации;
- синхронизация состояния.

`watch` даёт:

- доступ к предыдущему значению;
- возможность наблюдать конкретные источники.

Пример:

```ts
watch(userId, async (id) => {
  await loadUser(id);
});
```

### `watchEffect`

`watchEffect` автоматически отслеживает все реактивные зависимости внутри функции.

Он удобен, когда:

- зависимостей много;
- они могут динамически изменяться.

Но есть минус — зависимости менее очевидны.

Поэтому `watchEffect` чаще используют для:

- реактивных побочных эффектов;
- простых сценариев синхронизации.

---

<RelatedTopics
    :items="[
        { title: 'Как обработать race condition в async watch?', href: '/voprosy/praktika-vue-i-reaktivnost/2-kak-obrabotat-race-condition-v-async-watch' },
        { title: 'Что делает cleanup в watch?', href: '/voprosy/praktika-vue-i-reaktivnost/3-chto-delaet-cleanup-v-watch' },
        { title: 'watch vs watchEffect', href: '/vue/watch-i-watcheffect' },
    ]"
/>
