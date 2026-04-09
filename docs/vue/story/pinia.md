---
title: "Pinia"
description: "Подробная практическая документация по Pinia: структура store, state/getters/actions, подписки, SSR, плагины и типичные ошибки."
tags:
  - "vue"
  - "pinia"
  - "state-management"
updatedAt: "2026-04-09"
search: false
---
# Pinia

## Что это

`Pinia` — рекомендованный state manager для современных Vue-приложений.

По сути store в Pinia это:

- общий реактивный контейнер состояния;
- набор вычисляемых значений поверх этого состояния;
- набор действий, которые меняют состояние и инкапсулируют бизнес-логику.

Pinia особенно хорош там, где состояние используется в нескольких местах приложения, должно быть синхронизировано между страницами и удобно наблюдаться через devtools.

## Как мыслить о store

Полезная ментальная модель из официальной экосистемы Vue:

- `state` = `data`;
- `getters` = `computed`;
- `actions` = `methods`.

То есть store не отдельная магия, а тот же реактивный Vue-подход, только вынесенный из конкретного компонента на уровень приложения или доменной feature.

## Почему Pinia обычно выбирают для Vue 3

- проще API, чем у Vuex;
- нет обязательных `mutations`;
- хороший TypeScript inference;
- удобнее Composition API-подход;
- есть SSR, HMR, devtools, plugins и понятные доменные stores.

## Базовая структура store

### Option Store

```ts
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null as null | { id: string; name: string },
        token: "",
        loading: false,
    }),

    getters: {
        isAuthorized: (state) => Boolean(state.token),
        userName: (state) => state.user?.name ?? "Guest",
    },

    actions: {
        async login(credentials: { email: string; password: string }) {
            this.loading = true;

            try {
                const data = await apiLogin(credentials);
                this.user = data.user;
                this.token = data.token;
            } finally {
                this.loading = false;
            }
        },

        logout() {
            this.user = null;
            this.token = "";
        },
    },
});
```

### Setup Store

```ts
import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", () => {
    const items = ref<{ id: string; qty: number; price: number }[]>([]);
    const syncing = ref(false);

    const totalCount = computed(() => items.value.reduce((sum, item) => sum + item.qty, 0));
    const totalPrice = computed(() => items.value.reduce((sum, item) => sum + item.qty * item.price, 0));

    function addItem(item: { id: string; qty: number; price: number }) {
        items.value.push(item);
    }

    async function syncCart() {
        syncing.value = true;
        try {
            await apiSyncCart(items.value);
        } finally {
            syncing.value = false;
        }
    }

    watch(totalCount, (value) => {
        console.log("Items in cart:", value);
    });

    return {
        items,
        syncing,
        totalCount,
        totalPrice,
        addItem,
        syncCart,
    };
});
```

## Option Store vs Setup Store

| Критерий | Option Store | Setup Store |
| --- | --- | --- |
| Стиль | ближе к Options API | ближе к Composition API |
| Порог входа | ниже | выше |
| Гибкость | хорошая | максимальная |
| Watch/composables внутри store | ограниченно | удобно и нативно |
| SSR-сложность | проще | выше, если есть browser-only state |
| Когда брать | типовой бизнес-store | сложный store, тесно связанный с composables |

### Практическое правило

- Если store обычный: `state + getters + actions`, часто достаточно **Option Store**.
- Если внутри store нужны `watch`, `inject`, внешние composables или более гибкая сборка логики, обычно лучше **Setup Store**.

## Composables внутри store

Это важная тема, потому что Pinia хорошо сочетается с Composition API, но не любой composable одинаково безопасно использовать внутри store.

### Главное правило

- для **простых store без composables** часто хватает `Option Store`;
- если store должен **использовать composables как строительные блоки**, обычно лучше **Setup Store**;
- если store использует browser-only или non-serializable сущности, нужно отдельно думать про SSR/hydration.

### Что можно делать в Setup Store

В `Setup Store` можно свободно использовать почти любые composables, потому что по модели он очень похож на обычный `setup()` без шаблона.

Например:

```ts
import { computed } from "vue";
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useUiStore = defineStore("ui", () => {
    const theme = useLocalStorage<"light" | "dark">("theme", "light");
    const isDark = computed(() => theme.value === "dark");

    function toggleTheme() {
        theme.value = theme.value === "dark" ? "light" : "dark";
    }

    return {
        theme,
        isDark,
        toggleTheme,
    };
});
```

Такой вариант хорош, когда store собирается из:

- VueUse composables;
- доменных composables;
- `watch` / `computed` / `inject`;
- собственных stateful utilities.

### Ограничения Setup Store

У setup-store есть важное ограничение: **состояние store должно быть полностью видно Pinia**.

Это значит:

- если внутри store создан `ref`, который является частью состояния, его нужно вернуть;
- не стоит держать "приватный state", который Pinia не видит;
- не надо возвращать readonly/non-state значения как будто это обычный state.

Если скрыть часть state внутри setup-store, можно сломать:

- SSR hydration;
- devtools;
- плагины Pinia;
- предсказуемость store API.

### Что нельзя бездумно возвращать из composables

Некоторые composables возвращают не только state, но и вещи, которые **не являются store-state**:

- `router`;
- `route`;
- DOM elements и template refs;
- `MediaStream`, `WebSocket`, `AbortController`;
- app-level injected services.

Их можно использовать **внутри store**, но обычно не стоит возвращать наружу как часть store API.

Если такие значения всё же участвуют в setup-store, для SSR часто нужен `skipHydrate()`.

### Что можно делать в Option Store

В `Option Store` composables использовать можно, но заметно осторожнее.

Нормальный сценарий для option-store:

- composable возвращает **записываемый state**;
- этот state реально становится частью store;
- тебе не нужно возвращать из composable функции, readonly refs или сложные runtime-объекты.

Пример идеи:

```ts
state: () => ({
    theme: useLocalStorage("theme", "light"),
})
```

Это уместно для простых state composables наподобие persisted-value паттернов.

### Что плохо подходит для Option Store

Плохо подходят composables, которые:

- возвращают функции и внутренний runtime API;
- используют `watch`, lifecycle или side effects как основную механику;
- работают с `inject`;
- завязаны на browser-only объекты;
- возвращают readonly refs и сложные non-state структуры.

В таких случаях почти всегда лучше перейти на `Setup Store`.

### Composable внутри store vs store внутри composable

Есть два похожих, но разных паттерна:

#### 1. Composable используется внутри store

Подходит, когда composable является частью внутренней реализации store.

Пример:

- `useLocalStorage`;
- `useDebounceFn`;
- `useOnline`;
- `useMediaQuery`.

#### 2. Store используется внутри composable

Подходит, когда composable строит поверх store feature-level API.

Пример:

```ts
export function useAuthGuards() {
    const authStore = useAuthStore();

    const canViewAdmin = computed(() => authStore.user?.role === "admin");

    return { canViewAdmin };
}
```

Это полезно, если store даёт базовые данные, а composable собирает поверх них UI/feature-логику.

### Использование одного store внутри другого

Pinia позволяет одному store использовать другой store:

```ts
export const useCartStore = defineStore("cart", () => {
    const authStore = useAuthStore();

    const canCheckout = computed(() => authStore.isAuthorized);

    return { canCheckout };
});
```

Но есть важное правило:

- не делай так, чтобы два store сразу на верхнем уровне синхронно читали состояние друг друга.

Плохо:

- `authStore` при создании сразу читает `cartStore.total`;
- `cartStore` при создании сразу читает `authStore.user`.

Так легко получить циклическую зависимость или бесконечный loop при инициализации.

Безопаснее:

- читать другой store внутри `computed`;
- читать другой store внутри `actions`;
- вызывать `useOtherStore()` до первого `await`, если код может жить в SSR-контексте.

## Как Pinia работает под капотом

### 1. `defineStore()` не создаёт store сразу

`defineStore()` возвращает функцию `use...Store()`.
Сам store создаётся только когда ты впервые вызываешь `useStore()` в `setup()`, `action`, `getter` или другом корректном контексте.

### 2. Store привязан к `pinia` instance

Один и тот же `pinia` instance нужен для того, чтобы все вызовы `useStore()` получали правильный экземпляр store.

Поэтому:

- внутри компонента `setup()` всё обычно работает автоматически;
- вне компонента иногда нужно явно передавать `pinia`;
- в SSR это особенно важно, чтобы не делить state между запросами.

### 3. Store обёрнут в `reactive`

Store в Pinia является реактивным объектом.
Поэтому:

- `store.count` читается напрямую;
- `store.doubleCount` тоже читается как обычное свойство;
- но прямую деструктуризацию делать нельзя, иначе потеряешь реактивность.

## Правильное использование в компонентах

```vue
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const { user, loading, isAuthorized } = storeToRefs(authStore);
const { login, logout } = authStore;
</script>
```

### Почему нужен `storeToRefs()`

Если сделать так:

```ts
const { user, isAuthorized } = authStore;
```

то реактивность сломается, потому что store обёрнут в `reactive`.

`storeToRefs()`:

- превращает `state` и `getters` в `ref`;
- игнорирует actions;
- сохраняет реактивность и корректную работу TypeScript.

## `state`, `getters`, `actions` подробно

### `state`

`state` в Pinia задаётся функцией, возвращающей начальное состояние.
Это важно для SSR и для `$reset()`.

Практические правила:

- объявляй все поля сразу, даже если они `null` или `undefined`;
- храни в `state` исходные данные, а не производные;
- не добавляй новые поля в store динамически после создания.

### `getters`

`getters` в Pinia эквивалентны `computed` для store.

Что важно:

- если getter зависит только от `state`, используй обычную стрелочную функцию;
- если getter использует другие getters через `this`, в TypeScript обычно нужен явный return type;
- getter должен быть чистым вычислением, а не местом для side effects.

Плохо:

```ts
getters: {
    expensiveSideEffect(state) {
        localStorage.setItem("x", JSON.stringify(state.items));
        return state.items.length;
    },
}
```

Хорошо:

- getter только считает производное значение;
- побочные эффекты живут в `actions`, `watch` или подписках.

### `actions`

`actions` в Pinia это обычные методы store.

Они:

- могут быть синхронными и асинхронными;
- имеют доступ ко всему store через `this`;
- хорошо подходят для orchestration-логики: API, optimistic update, rollback, retry, logging.

Практическое правило:

- **компонент инициирует сценарий**;
- **action координирует сценарий**;
- **state хранит результат**;
- **getter считает производные данные**.

## Изменение состояния

### Прямая мутация

```ts
store.count++;
store.user = profile;
```

Для Pinia это нормальный путь.

### `$patch()`

Если нужно сгруппировать изменения:

```ts
store.$patch({
    count: store.count + 1,
    loading: false,
});
```

Если модифицируешь коллекции или делаешь серию связанных изменений:

```ts
store.$patch((state) => {
    state.items.push({ id: "1", qty: 1, price: 100 });
    state.hasChanges = true;
});
```

`$patch()` полезен потому, что:

- логически группирует изменения;
- делает devtools-историю чище;
- для подписок выглядит как один mutation event.

### `$reset()`

В Option Store есть встроенный `$reset()`.

Он:

- заново вызывает `state()`;
- создаёт начальный state;
- подменяет текущее состояние новым начальным.

В Setup Store `$reset()` нужно написать вручную.

## Хуки и точки интеграции Pinia

Хотя в Pinia это не называется "хуками" в React-смысле, на практике важны именно эти точки расширения и наблюдения.

### 1. `$subscribe()`

Наблюдает за изменениями state.

```ts
cartStore.$subscribe((mutation, state) => {
    localStorage.setItem("cart", JSON.stringify(state));
});
```

Что приходит в callback:

- `mutation.type` — `direct`, `patch object` или `patch function`;
- `mutation.storeId` — id store;
- `mutation.payload` — объект patch для `patch object`.

Что важно под капотом:

- `$subscribe()` использует Vue `watch()`;
- в отличие от обычного `watch`, после `$patch(fn)` подписка сработает один раз на всю группу изменений;
- можно передавать `flush: "sync"`, если нужно реагировать сразу;
- можно передать `{ detached: true }`, чтобы подписка жила после unmount компонента.

### 2. `$onAction()`

Наблюдает за вызовами actions.

```ts
const unsubscribe = cartStore.$onAction(({ name, args, after, onError }) => {
    const startedAt = performance.now();

    after((result) => {
        console.log(name, args, result, performance.now() - startedAt);
    });

    onError((error) => {
        console.error(name, error);
    });
});
```

Здесь есть три важных момента:

- callback вызывается **до** выполнения action;
- `after()` срабатывает после успешного завершения, включая `Promise`;
- `onError()` срабатывает при throw/reject.

Если нужна подписка дольше жизни компонента, можно detach-нуть её вторым аргументом:

```ts
store.$onAction(callback, true);
```

### 3. `pinia.use()`

Это plugin API Pinia.

Через него можно:

- добавлять свойства в store;
- добавлять методы;
- оборачивать actions;
- внедрять кросс-срезовые side effects;
- читать кастомные options store.

Пример:

```ts
import { createPinia } from "pinia";
import { markRaw } from "vue";
import { router } from "@/router";

const pinia = createPinia();

pinia.use(({ store }) => {
    store.router = markRaw(router);
});
```

### 4. `hydrate()` и `skipHydrate()`

Это уже SSR-специфика.

Если в store участвуют composables или browser-only значения:

- в **Option Store** можно описать `hydrate()`;
- в **Setup Store** используют `skipHydrate()` для значений, которые нельзя гидрировать из server state.

Это важно, если store возвращает:

- DOM-ссылки;
- router instance;
- browser API objects;
- client-only composables.

### 5. `acceptHMRUpdate()`

Это dev-only интеграция для HMR.

Она позволяет:

- редактировать store без полной перезагрузки страницы;
- сохранить текущий state при локальной разработке;
- быстрее отлаживать store-логику.

## SSR и использование вне компонентов

### Внутри компонентов

Обычно достаточно:

```ts
const authStore = useAuthStore();
```

### Вне компонентов

Например, в router guard:

```ts
router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthorized) {
        return "/login";
    }
});
```

В SPA это обычно безопасно, если вызов происходит уже после `app.use(pinia)`.

### В SSR

В SSR вне `setup()` лучше явно передавать instance:

```ts
const authStore = useAuthStore(pinia);
```

Иначе можно случайно использовать не тот store instance и получить утечку состояния между запросами.

### SSR и composables внутри store

Это место, где чаще всего появляются тонкие баги.

Если composable внутри store:

- зависит от браузера;
- возвращает non-serializable данные;
- использует app-level injection;
- ведёт себя по-разному на сервере и на клиенте,

то нужно отдельно проверить, как будет работать hydration.

Практические правила:

- в `Setup Store` используй `skipHydrate()` для свойств, которые не должны гидрироваться из server state;
- в `Option Store` для composable-based state может понадобиться `hydrate()`;
- не экспортируй из store DOM refs и browser-only runtime objects без крайней необходимости.

## Типичные best practices

1. Один store = одна доменная область: `auth`, `cart`, `profile`, `featureFlags`.
2. Не превращай store в универсальный склад для всего подряд.
3. Держи в `state` исходные данные, а не производные копии.
4. Производные значения выноси в `getters/computed`.
5. Асинхронные сценарии держи в `actions`.
6. Если store использует другой store, вызывай `useOtherStore()` до `await`, особенно в SSR-сценариях.
7. Не держи в store серверный кэш "как есть", если для него больше подходит query-layer.
8. Если store активно строится из composables, предпочитай `Setup Store`.
9. Возвращай из setup-store только тот state, который действительно должен быть частью store API.

## Частые ошибки

### 1. Store превращают в God Object

Когда в одном store лежат auth, filters, modal flags, socket state и половина бизнес-логики, сопровождать это становится трудно.

### 2. Деструктурируют store напрямую

Нужно использовать `storeToRefs()` для state и getters.

### 3. Кладут в store всё подряд

Не всё shared state обязано быть глобальным.
Многое лучше хранить:

- в локальном состоянии компонента;
- в composable;
- в URL;
- в query-кэше.

### 4. Возвращают из Setup Store то, что не является store-state

Например:

- `route`;
- `router`;
- DOM refs;
- app-level injected objects.

Их можно использовать внутри store, но не стоит без необходимости экспонировать как часть store API.

### 5. Пытаются засунуть сложный composable в Option Store

Если composable внутри себя живёт как мини-runtime со `watch`, side effects, inject и browser API, это почти всегда сигнал, что store надо писать в формате setup-store.

### 6. Скрывают часть state внутри setup-store

Это делает store неполным для Pinia и может сломать SSR, devtools и плагины.

## Когда Pinia действительно нужен

Pinia оправдан, если:

- одно и то же состояние используется в нескольких несвязанных местах;
- нужно синхронизировать состояние между страницами/feature;
- важны devtools, plugins, SSR и единые соглашения для команды;
- доменная логика уже переросла уровень одного composable.

Если состояние локальное или feature-local, глобальный store часто избыточен.

Отдельно про замену store смотри: [Чем заменить store](/vue/story/chem-zamenit-store).

## Источники

- [Pinia: Introduction](https://pinia.vuejs.org/introduction.html)
- [Pinia: Defining a Store](https://pinia.vuejs.org/core-concepts/)
- [Pinia: State](https://pinia.vuejs.org/core-concepts/state)
- [Pinia: Getters](https://pinia.vuejs.org/core-concepts/getters.html)
- [Pinia: Actions](https://pinia.vuejs.org/core-concepts/actions)
- [Pinia: Plugins](https://pinia.vuejs.org/core-concepts/plugins)
- [Pinia: Using a store outside of a component](https://pinia.vuejs.org/core-concepts/outside-component-usage.html)
- [Pinia: SSR](https://pinia.vuejs.org/ssr/)
- [Pinia: HMR](https://pinia.vuejs.org/cookbook/hot-module-replacement.html)
- [Pinia: Dealing with composables](https://pinia.vuejs.org/cookbook/composables.html)
- [Pinia: Composing Stores](https://pinia.vuejs.org/cookbook/composing-stores.html)
- [Vue: State Management](https://vuejs.org/guide/scaling-up/state-management.html)

---

<RelatedTopics
    :items="[
        { title: 'Vuex', href: '/vue/story/vuex' },
        { title: 'Pinia vs Vuex', href: '/vue/story/pinia-vs-vuex' },
        { title: 'Сторы под капотом', href: '/vue/story/story-pod-kapotom' },
        { title: 'Чем заменить store', href: '/vue/story/chem-zamenit-store' },
    ]"
/>
