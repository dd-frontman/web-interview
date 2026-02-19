---
title: "Pinia"
description: "Практическая документация по Pinia: setup, store-паттерны, типизация, best practices и типичные ошибки."
tags:
  - "vue"
  - "pinia"
updatedAt: "2026-02-18"
---
# Pinia

## Что это

`Pinia` — официальный state manager для современного Vue-стека.

По смыслу это «глобальные реактивные контейнеры», где ты хранишь доменные данные и действия.

## Почему Pinia

- простой API без `mutations`;
- лучше TypeScript DX;
- хорошая интеграция с Vue Devtools;
- удобно разбивать состояние по доменным stores.

## Установка

```ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

const app = createApp(App);
app.use(createPinia());
app.mount("#app");
```

## Option Store

```ts
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
    state: () => ({
        count: 0,
    }),
    getters: {
        double: (state) => state.count * 2,
    },
    actions: {
        increment() {
            this.count++;
        },
    },
});
```

## Setup Store

```ts
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCounterStore = defineStore("counter", () => {
    const count = ref(0);
    const double = computed(() => count.value * 2);

    function increment() {
        count.value++;
    }

    return { count, double, increment };
});
```

## Использование

```vue
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCounterStore } from "@/stores/counter";

const store = useCounterStore();
const { count, double } = storeToRefs(store);
</script>

<template>
    <button @click="store.increment">+1</button>
    <p>{{ count }}</p>
    <p>{{ double }}</p>
</template>
```

`storeToRefs` нужен, когда деструктурируешь state/getters и хочешь сохранить реактивность.

## Best practices

1. Один store = одна доменная область (`auth`, `cart`, `products`).
2. State хранить «сырым», производные значения выносить в `getters/computed`.
3. Сетевые запросы держать в `actions`.
4. Для SSR/Nuxt следить за корректной инициализацией состояния на сервере и клиенте.
5. Не превращать store в «god object» со всей логикой проекта.

## Частые ошибки

1. Деструктурировать store без `storeToRefs` и терять реактивность.
2. Хранить в state уже вычисленные значения вместо getters.
3. Писать тяжелые side effects в getters.
4. Путать app-state и server-state (кэш API лучше отдельно, например через query-библиотеки).

## Когда Pinia не нужен

Если состояние локально для одного-двух компонентов, чаще проще:

- `props/emits`,
- `provide/inject`,
- composables.

## Источники

- [Pinia Docs](https://pinia.vuejs.org/)
- [Pinia Core Concepts](https://pinia.vuejs.org/core-concepts/)
- [Pinia Plugins](https://pinia.vuejs.org/core-concepts/plugins.html)
- [Pinia Testing](https://pinia.vuejs.org/cookbook/testing.html)

---

<RelatedTopics
    :items="[
        { title: 'Vuex', href: '/vue/story/vuex' },
        { title: 'Pinia vs Vuex', href: '/vue/story/pinia-vs-vuex' },
        { title: 'provide и inject', href: '/vue/provide-i-inject' },
    ]"
/>
