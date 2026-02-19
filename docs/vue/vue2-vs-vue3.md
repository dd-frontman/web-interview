---
title: "Vue2 vs Vue3"
description: "Сравнение Vue 2 и Vue 3 по официальной документации: что поменялось, что важно для миграции и что использовать в новых проектах."
tags:
  - "vue"
  - "vue2-vs-vue3"
updatedAt: "2026-02-18"
---
# Vue2 vs Vue3

Ниже сравнение на базе официальных материалов Vue и Migration Guide.

## Что важно

- Vue 2 достиг EOL **31 декабря 2023** (официальный FAQ).
- Vue 3 не ломает весь подход к разработке, но меняет ряд API и добавляет новые возможности.
- Options API **не deprecated**: в Vue 3 можно писать и на Options API, и на Composition API.

## Краткая таблица

| Тема | Vue 2 | Vue 3 |
| --- | --- | --- |
| Статус | EOL | Активно поддерживается |
| Создание app | `new Vue()` | `createApp()` |
| Реактивность | `Object.defineProperty` | `Proxy` |
| `v-model` | `value` + `input` | `modelValue` + `update:modelValue` |
| События компонента | `$on/$off/$once` | удалены, использовать `emits` |
| Корневой шаблон | 1 root node | Fragments (несколько root) |
| TS DX | базовый | значительно лучше |
| IE11 | возможно через legacy-подходы | не поддерживается (из-за Proxy) |

## Архитектура

### Создание app

Vue 2:

```ts
import Vue from "vue";
import App from "./App.vue";

new Vue({
    render: (h) => h(App),
}).$mount("#app");
```

Vue 3:

```ts
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");
```

По migration guide глобальный API перешел на `app` instance (`createApp`), и API стали лучше tree-shakable.

### Глобальный API

Vue 2 имел глобальное состояние на уровне конструктора `Vue`, что осложняло изоляцию в тестах и при нескольких приложениях на странице.

Vue 2:

```ts
import Vue from "vue";
import Router from "vue-router";
import AppButton from "./AppButton.vue";

Vue.use(Router);
Vue.component("AppButton", AppButton);
```

Vue 3:

```ts
import { createApp } from "vue";
import Router from "./router";
import AppButton from "./AppButton.vue";
import App from "./App.vue";

const app = createApp(App);
app.use(Router);
app.component("AppButton", AppButton);
app.mount("#app");
```

Итог: настройки привязаны к **конкретному app instance**, а не ко всему рантайму.

### Mount поведение

В migration guide отмечено изменение `mount`:

- Vue 2: элемент, на который монтируешься, обычно заменялся.
- Vue 3: сам контейнер сохраняется, заменяется его `innerHTML`.

Это важно, если у тебя CSS/JS зависит от самого контейнера.

### Реактивность

- Vue 2: ограничение реактивности на уровне `Object.defineProperty`, часто использовали `$set` / `$delete`.
- Vue 3: Proxy-based реактивность, поэтому `set/delete` helper-ы убраны как ненужные.

Пример отличия:

```ts
// Vue 2 (Options API) - новая пропа могла не стать реактивной без Vue.set
this.user.age = 30;
// Vue.set(this.user, "age", 30)
```

```ts
// Vue 3
import { reactive } from "vue";

const user = reactive({ name: "Ann" });
user.age = 30; // реактивно
```

Дополнительно: из-за Proxy Vue 3 не поддерживает IE11 (официально).

## API изменения

### `v-model`

Vue 2 (по умолчанию):

- prop: `value`
- event: `input`

Vue 3:

- prop: `modelValue`
- event: `update:modelValue`
- можно иметь несколько `v-model` у одного компонента

Vue 3 с `defineModel`:

```vue
<script setup lang="ts">
const model = defineModel<string>();
</script>

<template>
    <input v-model="model" />
</template>
```

Vue 3 с несколькими моделями:

```vue
<!-- Parent -->
<UserName v-model:first-name="first" v-model:last-name="last" />
```

```vue
<!-- Child -->
<script setup lang="ts">
const firstName = defineModel<string>("firstName");
const lastName = defineModel<string>("lastName");
</script>
```

### Emits API

В Vue 3 лучше явно объявлять события компонента через `emits`.

```vue
<script setup lang="ts">
const emit = defineEmits<{
    (e: "submit", payload: { id: string }): void;
}>();

function onSave() {
    emit("submit", { id: "42" });
}
</script>
```

Плюсы:

- понятный контракт компонента;
- лучше типизация;
- меньше неожиданностей при пробросе атрибутов/листенеров.

### Native события

`v-on.native` удален.  
Теперь событие нативного `click` обычно пробрасывают как обычный `@click` (и при необходимости объявляют в `emits`).

Vue 2:

```vue
<BaseButton @click.native="onClick" />
```

Vue 3:

```vue
<BaseButton @click="onClick" />
```

### Slots API

В Vue 3 слоты унифицированы:

- `this.$scopedSlots` удален;
- использовать `this.$slots`.

Vue 2:

```ts
this.$scopedSlots.default?.({ item });
```

Vue 3:

```ts
this.$slots.default?.({ item });
```

### Filters API

Filters удалены.  
Логику форматирования переносим в `computed`/методы/утилиты.

Vue 2:

```vue
<span>{{ price | currency }}</span>
```

Vue 3:

```vue
<script setup lang="ts">
function formatCurrency(value: number) {
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
    }).format(value);
}
</script>

<template>
    <span>{{ formatCurrency(price) }}</span>
</template>
```

### Хуки цикла

- Vue 2: `beforeDestroy` / `destroyed`
- Vue 3: `beforeUnmount` / `unmounted`

Остальная логика жизненного цикла в целом знакома, особенно если остаешься на Options API.

### Render API

В render-функциях изменился стиль использования `h`.

Vue 2:

```ts
export default {
    render(h: any) {
        return h("div", "Hello");
    },
};
```

Vue 3:

```ts
import { h } from "vue";

export default {
    render() {
        return h("div", "Hello");
    },
};
```

### Удаления API

Из migration guide:

- удалены Filters
- удалены `$on`, `$off`, `$once`
- удалены `$children`, `$destroy`
- `v-on.native` удален
- keyCode-модификаторы (`.13`) удалены

## Новое Vue3

- Composition API встроен в ядро
- `<script setup>` как основной ergonomic стиль для SFC
- Fragments (несколько корневых узлов)
- Teleport
- Suspense (в migration guide отмечен как experimental)
- лучше TypeScript DX (официальный FAQ Composition API)

### Fragments

Vue 2 требовал один корневой элемент в шаблоне.

Vue 3:

```vue
<template>
    <header>Header</header>
    <main>Content</main>
</template>
```

### Teleport

Позволяет рендерить часть шаблона в другой узел DOM (например, модалку в `body`).

```vue
<teleport to="body">
    <MyModal v-if="open" />
</teleport>
```

### Suspense

Удобно показывать fallback при ожидании async-компонентов.

```vue
<Suspense>
    <AsyncPanel />
    <template #fallback>Loading...</template>
</Suspense>
```

## Производительность

По официальным материалам Vue 3 сильнее оптимизирован компилятором:

- лучше tree-shaking;
- более точечные обновления DOM;
- оптимизации для статических узлов.

На практике это чаще заметно в средних и больших интерфейсах.

## TypeScript DX

Vue 3 заметно лучше дружит с TS:

- `defineProps`, `defineEmits`, `defineModel`;
- лучше inference в SFC;
- проще писать типобезопасные библиотеки компонентов.

```vue
<script setup lang="ts">
type Props = { id: string; disabled?: boolean };
const props = defineProps<Props>();
</script>
```

## Экосистема

- Router: Vue Router 4
- State: Vuex 4 или (чаще) Pinia
- Build tooling: Vite обычно стандартный выбор

## Когда выбирать

### Vue 3

- новые проекты
- активная поддержка экосистемы
- современный TS и Composition API

### Vue 2

- только legacy-проекты, где миграция пока невозможна
- лучше планировать миграцию на Vue 3 (или минимум оценить migration build/пошаговый переход)

## План миграции

1. Обновить зависимости экосистемы (router, state, tooling).
2. Пройтись по breaking changes из migration guide.
3. Мигрировать `v-model`, lifecycle naming и удаленные API.
4. Постепенно вводить Composition API там, где реально нужно.
5. Закрыть регрессии тестами (unit + e2e).

## Частые ошибки

1. Оставляют старый `v-model` контракт (`value`/`input`) в компонентах.
2. Продолжают использовать `v-on.native`.
3. Переносят код 1:1 и забывают про `emits`.
4. Оставляют Filters вместо обычных функций/`computed`.
5. Не обновляют экосистему (router/store/plugins) до версий для Vue 3.

## Итог выбора

- Для нового проекта: **Vue 3**.
- Для legacy Vue 2: миграция поэтапно через migration guide и проверку breaking changes.

## Официальные источники

- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Breaking Changes](https://v3-migration.vuejs.org/breaking-changes/)
- [v-model Migration](https://v3-migration.vuejs.org/breaking-changes/v-model.html)
- [Migration Build](https://v3-migration.vuejs.org/migration-build.html)
- [Render Function API](https://v3-migration.vuejs.org/breaking-changes/render-function-api.html)
- [Events API](https://v3-migration.vuejs.org/breaking-changes/events-api.html)
- [Slots Unification](https://v3-migration.vuejs.org/breaking-changes/slots-unification.html)
- [Composition API FAQ](https://vuejs.org/guide/extras/composition-api-faq)
- [Vue FAQ: Is Vue 2 still supported?](https://vuejs.org/about/faq.html#is-vue-2-still-supported)

---

<RelatedTopics
    :items="[
        { title: 'Жизненный цикл', href: '/vue/zhiznennye-tsikly-komponentov-vue-2-vs-vue-3' },
        { title: 'Ref vs Reactive', href: '/vue/ref-and-reactive/ref-vs-reactive' },
        { title: 'watch vs watchEffect', href: '/vue/watch-i-watcheffect' },
    ]"
/>
