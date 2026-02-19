---
title: "Pinia vs Vuex"
description: "Сравнение Pinia и Vuex по официальным источникам: API, типизация, экосистема и практический выбор."
tags:
  - "vue"
  - "pinia-vs-vuex"
updatedAt: "2026-02-18"
---
# Pinia vs Vuex

## Статус

- Pinia — рекомендованный state manager для новых Vue 3-проектов.
- Vuex 3/4 — чаще для поддержки и развития legacy-кода.

## Быстрое сравнение

| Критерий | Vuex | Pinia |
| --- | --- | --- |
| API | state/getters/mutations/actions | state/getters/actions |
| Mutations | обязательны | не нужны |
| TypeScript DX | больше шаблонного кода | проще inference |
| Архитектура | один store + modules | много доменных stores |
| Порог входа | выше | ниже |

## Разница в коде

### Vuex

```ts
commit("increment");
dispatch("incAsync");
```

### Pinia

```ts
store.increment();
await store.incAsync();
```

Pinia обычно читается проще, потому что меньше промежуточных слоев.

## TypeScript

Pinia обычно даёт более удобный DX:

- меньше ручной типизации;
- лучше автодополнение действий/геттеров;
- проще типизировать store при Composition API-подходе.

## Devtools

Обе библиотеки интегрированы с Vue Devtools.

Pinia показывает state/action-потоки в привычном для Vue 3 стиле.

## Миграция

Официальный путь Vuex -> Pinia:

1. Включить Pinia рядом с Vuex.
2. Переносить модули по одному.
3. Обновить доступ к данным в компонентах.
4. Удалить Vuex после стабилизации.

## Альтернативы

Не всегда нужен глобальный store.

Часто достаточно:

- `props/emits` для локального дерева,
- `provide/inject` для feature-уровня,
- composables для переиспользуемой логики,
- URL state для фильтров/сортировок,
- server-state инструментов для кэша API.

## Когда выбирать

### Pinia

- новый Vue 3-проект;
- важны скорость разработки и TS DX;
- нужен простой и понятный state API.

### Vuex

- большой legacy-проект;
- миграция сейчас рискованна по срокам;
- команда хочет идти поэтапно.

## Источники

- [Vue State Management](https://vuejs.org/guide/scaling-up/state-management.html)
- [Vuex Docs](https://vuex.vuejs.org/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Pinia: Migration from Vuex](https://pinia.vuejs.org/cookbook/migration-vuex.html)

---

<RelatedTopics
    :items="[
        { title: 'Pinia', href: '/vue/story/pinia' },
        { title: 'Vuex', href: '/vue/story/vuex' },
        { title: 'provide и inject', href: '/vue/provide-i-inject' },
    ]"
/>
