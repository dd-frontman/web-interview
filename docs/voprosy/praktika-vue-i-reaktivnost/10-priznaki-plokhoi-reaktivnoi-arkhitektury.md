---
title: "Какие признаки указывают на плохую реактивную архитектуру?"
description: "Ответ про избыток watch, неявные зависимости, дублирование данных и плохие границы ответственности в реактивной системе."
tags:
  - "voprosy"
  - "vue"
  - "reaktivnost"
  - "arkhitektura"
updatedAt: "2026-03-12"
---
# Какие признаки указывают на плохую реактивную архитектуру?

## Ответ

Некоторые сигналы:

- большое количество `watch`;
- сложные цепочки зависимостей;
- непонятно, что вызывает обновление UI;
- данные дублируются в нескольких местах;
- глобальный store используется для всего.

Хорошая архитектура обычно строится на:

- `computed` для derived state;
- минимальном количестве watchers;
- явных границах ответственности;
- разделении бизнес-логики и UI.

---

<RelatedTopics
    :items="[
        { title: 'Когда логику стоит выносить в composable?', href: '/voprosy/praktika-vue-i-reaktivnost/9-kogda-logiku-stoit-vynosat-v-composable' },
        { title: 'Когда использовать computed, watch и watchEffect?', href: '/voprosy/praktika-vue-i-reaktivnost/1-kogda-ispolzovat-computed-watch-watcheffect' },
        { title: 'Реактивность во Vue3', href: '/vue/ref-and-reactive/reaktivnost-vo-vue3' },
    ]"
/>
