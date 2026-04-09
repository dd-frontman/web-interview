---
title: "Что делает cleanup в watch?"
description: "Ответ про cleanup как механизм отмены побочных эффектов, очистки таймеров и предотвращения race condition."
tags:
  - "voprosy"
  - "vue"
  - "watch"
  - "cleanup"
updatedAt: "2026-03-12"
---
# Что делает cleanup в watch?

## Ответ

Cleanup позволяет отменить предыдущий побочный эффект перед запуском нового.

Это важно для:

- отмены API-запросов;
- очистки таймеров;
- отписки от событий.

Пример сценария:

- пользователь быстро меняет фильтр;
- предыдущий запрос становится неактуальным;
- cleanup отменяет его.

Это предотвращает:

- race condition;
- утечки памяти;
- некорректное состояние UI.

---

<RelatedTopics
    :items="[
        { title: 'Как обработать race condition в async watch?', href: '/voprosy/praktika-vue-i-reaktivnost/2-kak-obrabotat-race-condition-v-async-watch' },
        { title: 'Когда использовать computed, watch и watchEffect?', href: '/voprosy/praktika-vue-i-reaktivnost/1-kogda-ispolzovat-computed-watch-watcheffect' },
        { title: 'watch vs watchEffect', href: '/vue/watch-i-watcheffect' },
    ]"
/>
