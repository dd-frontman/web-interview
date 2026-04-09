---
title: "Чем заменить store"
description: "Когда глобальный store не нужен и чем его заменить: local state, props/emits, provide/inject, composables, URL state, query cache и state machines."
tags:
  - "vue"
  - "pinia"
  - "state-management"
updatedAt: "2026-04-09"
---
# Чем заменить store

## Главное правило

Не каждое shared состояние заслуживает глобальный store.

Если состояние:

- живёт только внутри одного экрана;
- относится к одной feature;
- существует недолго;
- не требует devtools/persistence/SSR-инфраструктуры,

то полноценный store может быть избыточным.

## Быстрый decision matrix

| Сценарий | Чем заменить store |
| --- | --- |
| Состояние одного компонента | `ref()` / `reactive()` |
| Родитель -> дети в одном дереве | `props` / `emits` |
| Глубокое дерево одной feature | `provide` / `inject` |
| Переиспользуемая stateful-логика | composable |
| Фильтры, сортировка, пагинация, табы | URL/query params |
| API-кэш, loading, refetch, stale data | query-layer |
| Сложный сценарий со статусами и переходами | state machine |
| Очень простое shared state в small app | модульный `reactive()` singleton |

## 1. Локальное состояние компонента

Если данные нужны только одному компоненту, store не нужен.

```ts
const isOpen = ref(false);
const draft = reactive({
    name: "",
    email: "",
});
```

Подходит для:

- modal open/close;
- dropdown state;
- form draft;
- локальная сортировка;
- временные UI-флаги.

### Когда это лучший вариант

- никто кроме текущего компонента не читает это состояние;
- состояние не нужно сохранять между маршрутами;
- бизнес-логики почти нет.

## 2. `props` / `emits`

Если состояние принадлежит родителю и должно быть доступно нескольким детям, часто достаточно просто поднять состояние вверх.

```vue
<!-- Parent.vue -->
<script setup lang="ts">
import { ref } from "vue";

const selectedId = ref<string | null>(null);
</script>

<template>
    <UserList :selected-id="selectedId" @select="selectedId = $event" />
    <UserPreview :selected-id="selectedId" />
</template>
```

Подходит для:

- master-detail layout;
- контролируемые inputs;
- связка списка и карточки;
- wizard, если всё ещё живёт в одном дереве.

### Когда это лучше store

- shared state имеет одного естественного владельца;
- дерево компонентов ещё не слишком глубокое;
- нужна прозрачность data flow.

## 3. `provide` / `inject`

Это хороший компромисс между локальным состоянием и глобальным store.

```ts
// provider
const filters = reactive({
    search: "",
    status: "all",
});

provide("tableFilters", filters);

// deep child
const filters = inject("tableFilters");
```

Подходит для:

- одна feature с глубоким деревом;
- таблица + toolbar + pagination + filters;
- form context;
- nested widgets внутри одного экрана.

### Плюсы

- убирает prop drilling;
- не делает состояние глобальным на всё приложение;
- хорошо работает как feature-level context.

### Ограничения

- хуже discoverability, чем у Pinia;
- слабее devtools story;
- легко превратить в "скрытую глобальность", если прокидывать слишком много.

## 4. Composables

Если нужна переиспользуемая stateful-логика, но ещё не нужен настоящий store, composable часто лучший выбор.

```ts
import { ref, computed } from "vue";

export function usePagination() {
    const page = ref(1);
    const pageSize = ref(20);

    const offset = computed(() => (page.value - 1) * pageSize.value);

    function reset() {
        page.value = 1;
    }

    return {
        page,
        pageSize,
        offset,
        reset,
    };
}
```

Подходит для:

- form logic;
- pagination;
- table state;
- feature-specific fetch orchestration;
- browser APIs;
- reusable business helpers.

### Два важных режима composables

#### Instance composable

Состояние создаётся заново на каждый вызов.

Подходит, когда каждому компоненту нужен свой изолированный state.

#### Singleton composable

Состояние создаётся в module scope и разделяется между импортами.

```ts
import { reactive } from "vue";

const sidebarState = reactive({
    collapsed: false,
});

export function useSidebarState() {
    return sidebarState;
}
```

Это уже очень близко к маленькому store.

### Важно про SSR

Официальная Vue-документация предупреждает:
singleton-state на уровне модуля в SSR может разделяться между запросами.

То есть для SPA такой паттерн часто нормален, а для SSR его нужно использовать осторожно.

## 5. URL как источник состояния

Для части UI-состояния лучший store — это URL.

Например:

- поиск;
- фильтры;
- сортировка;
- текущая вкладка;
- страница пагинации;
- id выбранной сущности.

```ts
router.replace({
    query: {
        search: search.value,
        page: String(page.value),
    },
});
```

### Почему это хорошо

- состояние переживает reload;
- им можно делиться ссылкой;
- браузерная история работает естественно;
- меньше дублирования между router-state и store-state.

### Когда это лучший вариант

- состояние влияет на навигацию;
- состояние нужно шарить ссылкой;
- состояние должно быть восстанавливаемым после refresh.

## 6. Query-layer вместо store для server state

Если данные приходят с сервера и основная задача — кэш, повторные запросы, invalidation и loading/error state, то обычный store часто не лучший инструмент.

Обычно лучше query-подход.

Что он решает лучше store:

- caching;
- deduplication;
- background refetch;
- stale/fresh semantics;
- retry;
- invalidation.

### Хорошее правило

- **app state**: auth flags, ui preferences, feature toggles, wizard progress -> store;
- **server state**: список заказов, карточка пользователя, каталог товаров -> query-layer.

## 7. State machine

Если сценарий не "просто данные", а конечный автомат состояний, store тоже может быть не лучшей абстракцией.

Например:

- checkout flow;
- onboarding;
- payment process;
- upload pipeline;
- multi-step moderation flow.

Если у процесса есть жёсткие состояния и переходы:

- `idle -> validating -> submitting -> success/error`,

то state machine делает систему понятнее и надёжнее.

## 8. Event-driven подход

Редкий, но иногда полезный вариант для слабосвязанных частей интерфейса:

- event emitter;
- pub/sub;
- message bus.

Подходит аккуратно и локально, но не как default replacement для всего state management.

Иначе очень быстро теряется прозрачность потока данных.

## Когда глобальный store точно не нужен

### Store почти наверняка лишний, если:

1. Состояние читается и меняется в одном компоненте.
2. Состояние живёт только внутри одного route tree.
3. Это просто UI-флаг или локальный draft.
4. Данные уже естественно живут в URL.
5. Это обычный server cache без сложной client-side доменной логики.

## Когда store всё же нужен

### Pinia или другой store оправдан, если:

1. Одни и те же данные нужны в нескольких независимых местах приложения.
2. Нужно единое доменное API для изменения состояния.
3. Нужны devtools, плагины, persistence, SSR-поддержка.
4. Состояние должно жить дольше конкретного route subtree.
5. Команде нужны чёткие соглашения и понятный единый слой shared app state.

## Практическое правило выбора

Выбирай самое узкое решение, которое покрывает задачу:

1. Сначала `ref/reactive`.
2. Потом `props/emits`.
3. Потом `provide/inject` или composable.
4. Потом singleton composable или feature context.
5. И только когда этого реально мало, поднимай глобальный store.

Так архитектура растёт естественно, а не начинается сразу с глобального "склада всего".

## Источники

- [Vue: State Management](https://vuejs.org/guide/scaling-up/state-management.html)
- [Pinia: Introduction](https://pinia.vuejs.org/introduction.html)
- [Pinia: Defining a Store](https://pinia.vuejs.org/core-concepts/)
- [Pinia: Using a store outside of a component](https://pinia.vuejs.org/core-concepts/outside-component-usage.html)

---

<RelatedTopics
    :items="[
        { title: 'Pinia', href: '/vue/story/pinia' },
        { title: 'Vuex', href: '/vue/story/vuex' },
        { title: 'Сторы под капотом', href: '/vue/story/story-pod-kapotom' },
        { title: 'provide и inject', href: '/vue/provide-i-inject' },
    ]"
/>
