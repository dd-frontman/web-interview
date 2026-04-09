---
title: "Как обработать race condition в async watch?"
description: "Ответ про параллельные async-операции в watch, отмену неактуальных запросов и защиту от устаревших ответов."
tags:
  - "voprosy"
  - "vue"
  - "watch"
  - "async"
updatedAt: "2026-03-12"
---
# Как обработать race condition в async watch?

## Ответ

Race condition возникает, когда несколько асинхронных операций выполняются параллельно, и результат более старого запроса может перезаписать новый.

Например:

- пользователь быстро меняет фильтр;
- отправляется несколько API-запросов;
- последний ответ приходит не первым.

Решение — cleanup предыдущего эффекта.

Во Vue это делается через функцию очистки.

Пример идеи:

- при новом запуске watcher отменяется предыдущий запрос;
- используется `AbortController` или флаг отмены.

Таким образом только актуальный запрос может обновить состояние.

---

<RelatedTopics
    :items="[
        { title: 'Что делает cleanup в watch?', href: '/voprosy/praktika-vue-i-reaktivnost/3-chto-delaet-cleanup-v-watch' },
        { title: 'Когда использовать computed, watch и watchEffect?', href: '/voprosy/praktika-vue-i-reaktivnost/1-kogda-ispolzovat-computed-watch-watcheffect' },
        { title: 'watch vs watchEffect', href: '/vue/watch-i-watcheffect' },
    ]"
/>
