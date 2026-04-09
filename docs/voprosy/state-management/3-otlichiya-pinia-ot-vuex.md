---
title: "В чём основные отличия Pinia от Vuex?"
description: "Ответ про разницу в архитектуре, boilerplate, типизации, интеграции с Composition API и модульности Pinia."
tags:
  - "voprosy"
  - "state-management"
  - "pinia"
  - "vuex"
updatedAt: "2026-03-12"
---
# В чём основные отличия Pinia от Vuex?

## Ответ

Основное отличие — в архитектуре и модели использования.

В Vuex классическая схема выглядела так:

- `state`;
- `mutations`;
- `actions`;
- `getters`.

Это делало код более формализованным, но добавляло большое количество шаблонного кода.

В Pinia модель проще.

Store — это обычная функция, внутри которой можно объявлять:

- состояние;
- действия;
- вычисляемые значения.

Кроме этого:

Pinia:

- лучше типизируется;
- проще читается;
- лучше интегрируется с Composition API;
- не требует `mutations`.

Также Pinia поддерживает более гибкое разделение store на независимые модули.

---

<RelatedTopics
    :items="[
        { title: 'Почему вы бы выбрали Pinia для Vue-проекта?', href: '/voprosy/state-management/2-pochemu-vybrat-pinia' },
        { title: 'В каких случаях вы бы рассмотрели альтернативные решения для state management?', href: '/voprosy/state-management/4-kogda-rassmatrivat-alternativy-dlya-state-management' },
        { title: 'Pinia vs Vuex', href: '/vue/story/pinia-vs-vuex' },
    ]"
/>
