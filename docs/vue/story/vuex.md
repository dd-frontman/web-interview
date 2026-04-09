---
title: "Vuex"
description: "Подробный разбор Vuex: state/getters/mutations/actions/modules, subscribe hooks, strict mode и когда его стоит сохранять в legacy."
tags:
  - "vue"
  - "vuex"
  - "state-management"
updatedAt: "2026-04-09"
---
# Vuex

## Что это

`Vuex` — предыдущий официальный state manager экосистемы Vue.

Сегодня его важно знать по двум причинам:

- он до сих пор широко встречается в legacy Vue 2 и ранних Vue 3 проектах;
- многие идеи Pinia исторически выросли из проблем и ограничений Vuex.

Для новых приложений чаще выбирают `Pinia`, а `Vuex` обычно остаётся там, где цена миграции пока выше пользы.

## Архитектура Vuex

Классический Vuex строится вокруг централизованного store и четырёх основных сущностей:

- `state` — исходные данные;
- `getters` — производные данные;
- `mutations` — синхронные изменения `state`;
- `actions` — асинхронная логика и orchestration.

## Базовый пример

```ts
import { createStore } from "vuex";

export default createStore({
    state: {
        count: 0,
        loading: false,
    },

    getters: {
        doubleCount: (state) => state.count * 2,
    },

    mutations: {
        increment(state) {
            state.count++;
        },
        setLoading(state, value: boolean) {
            state.loading = value;
        },
    },

    actions: {
        async incrementAsync({ commit }) {
            commit("setLoading", true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 300));
                commit("increment");
            } finally {
                commit("setLoading", false);
            }
        },
    },
});
```

## Внутренний поток данных

### Как выглядит цикл изменения состояния

1. Компонент вызывает `dispatch("incrementAsync")`.
2. `action` выполняет асинхронную логику.
3. `action` делает `commit("increment")`.
4. `mutation` синхронно меняет `state`.
5. Реактивные зависимости и компоненты обновляются.

Эта схема делит ответственность так:

- `action` решает, **когда** и **зачем** менять состояние;
- `mutation` меняет состояние;
- `getter` считает производное;
- компонент только инициирует сценарий и отображает данные.

## Почему Vuex кажется более тяжёлым

Главная причина — дополнительный слой `mutations`.

В Pinia можно написать:

```ts
store.count++;
```

Во Vuex тот же сценарий обычно выглядит так:

```ts
dispatch("incrementAsync");
commit("increment");
```

Это делает архитектуру более дисциплинированной, но увеличивает шаблонный код и усложняет DX.

## `state`, `getters`, `mutations`, `actions` подробно

### `state`

Один большой state tree живёт внутри store.
По мере роста приложения его обычно разбивают на modules.

### `getters`

`getters` — вычисляемые значения поверх state.

Они получают:

- `state`;
- `getters`;
- в module-контексте ещё `rootState` и `rootGetters`.

### `mutations`

`mutations` обязаны быть синхронными.

Именно это делает историю изменений детерминированной и удобной для devtools/time-travel.

Практический смысл:

- асинхронность выносим в `actions`;
- любое реальное изменение state проходит через `commit()`.

### `actions`

`actions` получают `context`, в котором доступны:

- `state`;
- `rootState`;
- `getters`;
- `rootGetters`;
- `commit`;
- `dispatch`.

То есть action во Vuex не меняет state напрямую, а координирует поток через `commit`.

## Modules

По мере роста приложения Vuex почти всегда переходит к modules:

```ts
const authModule = {
    namespaced: true,
    state: () => ({
        token: "",
    }),
    mutations: {
        setToken(state, token: string) {
            state.token = token;
        },
    },
};

const store = createStore({
    modules: {
        auth: authModule,
    },
});
```

Modules решают проблему "одного слишком большого store", но создают новые сложности:

- namespace management;
- сильная связность между модулями;
- больше ceremony;
- сложнее типизация и рефакторинг.

## Хуки и точки наблюдения во Vuex

У Vuex нет hooks в React-смысле, но есть несколько важных API для наблюдения и интеграции.

### `store.watch()`

Следит за реактивным значением, вычисленным из `state` и `getters`.

```ts
const unwatch = store.watch(
    (state, getters) => getters.doubleCount,
    (value) => {
        console.log("doubleCount:", value);
    }
);
```

Используется, когда нужно наблюдать конкретное derived value.

### `store.subscribe()`

Срабатывает после каждой mutation.

```ts
const unsubscribe = store.subscribe((mutation, state) => {
    console.log(mutation.type, mutation.payload);
});
```

Это аналог "наблюдения за историей мутаций".
Обычно используется для:

- persistence;
- audit/logging;
- plugin-side effects.

Важно:

- нужно вручную отписываться через `unsubscribe()`;
- можно управлять порядком через `{ prepend: true }`.

### `store.subscribeAction()`

Срабатывает на actions.

```ts
const unsubscribe = store.subscribeAction({
    before: (action) => {
        console.log("before", action.type);
    },
    after: (action) => {
        console.log("after", action.type);
    },
    error: (action, state, error) => {
        console.error(action.type, error);
    },
});
```

Это полезно для:

- телеметрии;
- трассировки сценариев;
- runtime error tracking;
- metrics по длительности действий.

### Plugins

Vuex plugin получает store и может:

- слушать `subscribe`/`subscribeAction`;
- пушить данные наружу;
- принимать внешние события и коммитить их внутрь store.

Именно поэтому persistence, logging и websocket bridge в Vuex часто делали через plugins.

## Strict mode

`strict: true` заставляет Vuex ругаться, если кто-то мутирует state вне mutation handler.

Это полезно:

- в development;
- в больших командах;
- когда надо быстро найти незаконные прямые мутации.

Но strict mode дороже по runtime cost, поэтому обычно его используют осознанно и чаще в dev.

## Dynamic modules

Vuex умеет:

- `registerModule()`;
- `unregisterModule()`;
- `hasModule()`.

Это полезно, если:

- модуль нужен только на части маршрутов;
- приложение очень большое;
- какие-то куски state должны подключаться динамически.

Но динамические модули ещё сильнее усложняют архитектуру и debugging.

## Composition API и `useStore()`

Во Vue 3 с Vuex можно использовать composable API:

```ts
import { useStore } from "vuex";

export default {
    setup() {
        const store = useStore();
        return { store };
    },
};
```

Для TypeScript обычно используют injection key, чтобы store был типизирован.

## Когда Vuex всё ещё уместен

### Оставлять Vuex разумно, если:

1. Проект большой и давно в проде.
2. Архитектура вокруг Vuex уже устоялась.
3. Основной приоритет сейчас в delivery, а не в миграции state layer.
4. Любая большая миграция несёт риск регрессий в критичном продукте.

### Мигрировать на Pinia разумно, если:

1. Проект живёт долго и активно развивается.
2. Команда уже на Vue 3.
3. Важны DX, TS inference и уменьшение шаблонного кода.
4. Store-слой всё равно активно трогают и legacy-подход тормозит разработку.

## Типичные ошибки во Vuex

### 1. Слишком много логики в mutations

Mutation должна быть простой и синхронной.
Сценарии, API и orchestration лучше держать в actions.

### 2. Один root store разрастается в монолит

Когда нет чёткой модульной декомпозиции, Vuex быстро становится тяжёлым.

### 3. Сильная связанность модулей

Если один модуль постоянно лезет в другой, архитектура начинает напоминать общий глобальный script object.

### 4. Хранение server cache внутри Vuex без причины

Для API-кэша часто лучше query-инструменты, чем ручной store-контроль.

## Короткий вывод

Vuex остаётся важным инструментом для чтения и поддержки legacy-кода.
Но если стартуешь новый Vue 3 проект, выбор по умолчанию обычно будет в пользу Pinia.

## Источники

- [Vuex: API Reference](https://vuex.vuejs.org/api/)
- [Vuex: Actions](https://vuex.vuejs.org/guide/actions.html)
- [Vuex: Modules](https://vuex.vuejs.org/guide/modules.html)
- [Vue: State Management](https://vuejs.org/guide/scaling-up/state-management.html)
- [Pinia: Migration from Vuex](https://pinia.vuejs.org/cookbook/migration-vuex.html)

---

<RelatedTopics
    :items="[
        { title: 'Pinia', href: '/vue/story/pinia' },
        { title: 'Pinia vs Vuex', href: '/vue/story/pinia-vs-vuex' },
        { title: 'Сторы под капотом', href: '/vue/story/story-pod-kapotom' },
        { title: 'Чем заменить store', href: '/vue/story/chem-zamenit-store' },
    ]"
/>
