---
title: "Сторы под капотом"
description: "Как устроены store-решения во Vue под капотом: Pinia, Vuex, lifecycle store, подписки, SSR, HMR и основные точки расширения."
tags:
  - "vue"
  - "pinia"
  - "vuex"
  - "state-management"
updatedAt: "2026-04-09"
---
# Сторы под капотом

## Что вообще такое store

Store — это вынесенное из компонентов общее состояние приложения вместе с правилами его изменения.

По факту любой store-слой отвечает на три вопроса:

1. Где живёт shared state?
2. Кто имеет право его менять?
3. Как за изменениями наблюдать и как их отлаживать?

## Общая модель во Vue

С точки зрения Vue store опирается на ту же реактивность, что и компоненты:

- есть исходное состояние;
- есть вычисляемые значения;
- есть действия;
- есть реактивные подписчики, которые обновляют UI.

Разница в том, что store живёт не внутри одного компонента, а на уровне приложения или доменной области.

## Как устроен Pinia

### 1. `createPinia()` создаёт контейнер store-инстансов

Приложение подключает Pinia один раз:

```ts
const pinia = createPinia();
app.use(pinia);
```

Дальше все stores будут жить внутри этого конкретного `pinia` instance.

### 2. `defineStore()` возвращает factory-функцию

```ts
export const useUserStore = defineStore("user", { ... });
```

На этом этапе store ещё не создан.
Создана только функция, которая умеет получить или создать store позже.

### 3. Реальный store создаётся лениво

Когда впервые вызывается:

```ts
const userStore = useUserStore();
```

Pinia:

- ищет store по `id`;
- если его ещё нет, создаёт;
- регистрирует в текущем `pinia` instance;
- подключает devtools/meta-информацию;
- возвращает реактивный store-объект.

### 4. Store оборачивается в `reactive`

Это даёт удобный API:

- `store.count`;
- `store.totalPrice`;
- `store.login()`.

Но из-за этого нельзя бездумно делать:

```ts
const { count } = store;
```

Для state/getters нужен `storeToRefs()`.

### 5. Setup Store фактически работает как composable-контейнер

Это важный практический вывод: setup-store под капотом ближе не к "конфигу", а к **функции-компоновщику**, внутри которой можно собирать store из других composables.

Поэтому в нём удобно:

- использовать VueUse;
- вызывать `watch` и `inject`;
- собирать feature-state из нескольких composables.

Но за эту гибкость приходится платить:

- сложнее SSR;
- нужно следить, чтобы весь настоящий state был возвращён наружу;
- non-serializable значения нельзя путать с обычным store-state.

## Как устроен Vuex

### 1. Vuex создаёт один центральный store tree

В отличие от Pinia, где естественная модель это "много доменных stores", Vuex исторически тяготеет к одному большому store с modules.

### 2. Изменения проходят через `commit`

Базовый pipeline во Vuex:

- компонент делает `dispatch`;
- action выполняет сценарий;
- action делает `commit`;
- mutation синхронно меняет state;
- watchers/getters/UI обновляются.

### 3. Наблюдение идёт через subscribe chain

Vuex хранит цепочки подписчиков:

- на mutations;
- на actions;
- на reactive watch.

Это делает его удобным для plugins, но архитектура становится тяжелее по ceremony.

## Pinia vs Vuex под капотом

| Тема | Pinia | Vuex |
| --- | --- | --- |
| Модель | много stores по доменам | один store tree + modules |
| Создание | ленивое через `useStore()` | store создаётся сразу |
| Изменение state | напрямую или через `$patch()` | через `commit()` |
| Derived values | getters как `computed` | getters на store tree |
| Основной orchestration слой | actions | actions + mutations |
| Подписки | `$subscribe`, `$onAction` | `watch`, `subscribe`, `subscribeAction` |
| Dev ergonomics | проще | тяжелее |

## Хуки и точки интеграции

Ни Pinia, ни Vuex не используют слово "hooks" в React-смысле, но у них есть важные runtime hook points.

## Pinia: важные hook points

### `$subscribe()`

Подписка на изменение state.

Когда полезно:

- persistence;
- audit trail;
- глобальный sync;
- analytics на изменения store.

Практическая особенность:

- Pinia делает `$subscribe()` поверх Vue `watch()`;
- после `$patch(fn)` изменения приходят как одна сгруппированная операция.

### `$onAction()`

Подписка на вызовы actions.

Даёт:

- название action;
- аргументы;
- `after()` для успешного завершения;
- `onError()` для ошибки.

Это один из лучших способов в Pinia для:

- performance metrics;
- tracing;
- runtime error tracking;
- логирования бизнес-сценариев.

### `pinia.use()`

Plugin-level hook для расширения store.

Через него можно:

- добавлять свойства;
- оборачивать actions;
- читать кастомные options;
- внедрять кросс-срезовые side effects.

### `hydrate()` и `skipHydrate()`

SSR-интеграция:

- `hydrate()` нужен в option-store сценариях с composables;
- `skipHydrate()` нужен в setup-store для client-only или non-serializable state.

### `acceptHMRUpdate()`

Dev hook для hot update store без потери текущего state.

## Vuex: важные hook points

### `store.watch()`

Подписка на произвольное derived value из `state/getters`.

Нужен, когда интересует не вся история mutations, а конкретное вычисляемое значение.

### `store.subscribe()`

Подписка на mutations.

Полезен для:

- persistence;
- logging;
- плагинов;
- replay/audit.

### `store.subscribeAction()`

Подписка на actions.

Можно подписываться:

- `before`;
- `after`;
- `error`.

Это близкий аналог `Pinia $onAction()`.

### Vuex plugins

Получают store и обычно вешают `subscribe`/`subscribeAction`, либо прокидывают внешние события в state.

## Таблица: чем наблюдать за чем

| Что нужно отследить | Pinia | Vuex |
| --- | --- | --- |
| Любое изменение state | `$subscribe()` | `subscribe()` |
| Вызовы actions | `$onAction()` | `subscribeAction()` |
| Конкретное derived value | `watch(() => store.x)` или `storeToRefs + watch` | `store.watch()` |
| Глобальные side effects | `pinia.use()` | plugins |
| SSR hydration | `pinia.state.value`, `hydrate`, `skipHydrate` | `replaceState`, SSR-specific setup |

## SSR: где тонкие места

### Главная проблема

Если shared state оформлен как модульный singleton "на весь процесс", то в SSR можно случайно разделить состояние между разными запросами.

### В Pinia

Поэтому в SSR:

- нужен отдельный `pinia` instance на запрос;
- вне `setup()` лучше явно передавать `pinia` в `useStore(pinia)`;
- состояние нужно гидрировать до первого клиентского `useStore()`.

### В самодельных shared stores на `reactive`

Официальная Vue-документация прямо предупреждает, что singleton state pattern в SSR может привести к shared state между запросами.

## HMR и жизненный цикл store

### Pinia

Pinia поддерживает HMR на уровне store definition.
Это позволяет редактировать store и не терять уже набранное состояние в dev.

### Vuex

У Vuex тоже есть `hotUpdate`, но в реальной жизни DX вокруг этого обычно менее приятный, чем у Pinia+Vite.

## Что важно архитектурно

### 1. Store не должен знать слишком много про UI

Store — это слой состояния и доменной логики, а не место для управления всеми модалками, hover-состояниями и временными локальными флагами интерфейса.

### 2. Store не должен становиться transport-layer

Если состояние это по сути кэш сервера, часто лучше:

- query-layer;
- data-fetch composables;
- route-driven state.

### 3. Межstore зависимости должны быть осознанными

Pinia позволяет store использовать store, но если всё начинает зависеть от всего, модульность быстро ломается.

Особенно осторожно нужно быть с циклическими зависимостями.

## Короткий вывод

Под капотом store во Vue — это не магия, а организованная реактивность:

- Pinia делает её проще и ближе к Composition API;
- Vuex делает её более церемониальной, но предсказуемой для legacy;
- реальные hook points нужны не ради "красоты API", а ради логирования, persistence, SSR и кросс-срезовых side effects.

## Источники

- [Pinia: Defining a Store](https://pinia.vuejs.org/core-concepts/)
- [Pinia: State](https://pinia.vuejs.org/core-concepts/state)
- [Pinia: Actions](https://pinia.vuejs.org/core-concepts/actions)
- [Pinia: Plugins](https://pinia.vuejs.org/core-concepts/plugins)
- [Pinia: Using a store outside of a component](https://pinia.vuejs.org/core-concepts/outside-component-usage.html)
- [Pinia: SSR](https://pinia.vuejs.org/ssr/)
- [Pinia: HMR](https://pinia.vuejs.org/cookbook/hot-module-replacement.html)
- [Vuex: API Reference](https://vuex.vuejs.org/api/)
- [Vuex: Modules](https://vuex.vuejs.org/guide/modules.html)
- [Vuex: Actions](https://vuex.vuejs.org/guide/actions.html)
- [Vue: State Management](https://vuejs.org/guide/scaling-up/state-management.html)

---

<RelatedTopics
    :items="[
        { title: 'Pinia', href: '/vue/story/pinia' },
        { title: 'Vuex', href: '/vue/story/vuex' },
        { title: 'Pinia vs Vuex', href: '/vue/story/pinia-vs-vuex' },
        { title: 'Чем заменить store', href: '/vue/story/chem-zamenit-store' },
    ]"
/>
