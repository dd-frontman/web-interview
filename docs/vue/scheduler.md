---
title: "Scheduler"
description: "Как устроен scheduler во Vue 3: очереди задач, flush-фазы, nextTick, порядок обновлений и типичные ошибки."
tags:
  - "vue"
  - "scheduler"
updatedAt: "2026-02-18"
---
# Scheduler

## Что это

`Scheduler` во Vue 3 — внутренний планировщик обновлений.

Его задача:

- не перерисовывать UI на каждую отдельную мутацию;
- собрать изменения в очередь;
- выполнить их батчем в правильном порядке.

Именно поэтому несколько `state`-изменений подряд обычно дают один ререндер компонента.

## Зачем нужен

Без scheduler любой код вроде:

```ts
state.count++;
state.count++;
state.count++;
```

мог бы приводить к нескольким перерендерам подряд.

С scheduler Vue:

1. помечает эффекты как "нужно обновить";
2. кладёт job в очередь;
3. запускает flush в microtask;
4. делает одно согласованное обновление.

Это снижает лишнюю работу и уменьшает лаги UI.

## Как работает

Упрощенный цикл:

1. Меняется реактивное состояние.
2. `trigger()` уведомляет зависимые эффекты.
3. Компонентный render-effect планируется через scheduler.
4. Scheduler ставит flush через `Promise.then` (microtask).
5. При flush выполняются очереди в фиксированном порядке.
6. DOM патчится.

## Очереди Vue

Во Vue 3 scheduler оперирует несколькими типами задач.

- `pre-flush` callbacks: обычно сюда попадают watcher-эффекты с `flush: 'pre'`.
- `job queue`: основная очередь обновлений компонентов и эффектов.
- `post-flush` callbacks: watcher-эффекты с `flush: 'post'`, пост-эффекты.

Также есть дедупликация job: одна и та же задача не должна бесконечно дублироваться в очереди.

## Порядок jobs

Scheduler гарантирует предсказуемый порядок:

- родительский компонент обновляется раньше дочернего;
- одна job не исполняется бесконтрольно много раз в один flush;
- пост-эффекты запускаются после DOM-патча.

Это важно для стабильности дерева компонентов.

## Flush фазы

Для `watch` ключевая настройка — `flush`:

### `pre`

```ts
watch(source, callback, { flush: "pre" });
```

- поведение по умолчанию;
- callback до DOM-обновления компонента.

Подходит для логики, не требующей готового нового DOM.

### `post`

```ts
watch(source, callback, { flush: "post" });
```

- callback после DOM-обновления;
- удобно читать layout/DOM-метрики.

### `sync`

```ts
watch(source, callback, { flush: "sync" });
```

- callback запускается сразу, без отложенного батчинга;
- использовать осторожно: легко получить лишнюю работу и каскадные обновления.

## nextTick

Scheduler работает асинхронно, поэтому сразу после мутации DOM может быть старым.

```ts
state.open = true;
console.log(panelRef.value?.offsetHeight); // может быть старое значение

await nextTick();
console.log(panelRef.value?.offsetHeight); // уже после flush
```

`nextTick` — это "дождаться завершения текущего flush scheduler".

## Scheduler и computed

`computed` не перерендеривает сам по себе.

Модель такая:

- при изменении зависимостей computed помечается `dirty`;
- пересчет происходит лениво, когда значение действительно читают;
- рендер-компонента уже планируется scheduler-ом как обычная job.

Итог: `computed` + scheduler вместе уменьшают количество лишних вычислений и рендеров.

## Scheduler и watch

`watch`/`watchEffect` строятся поверх реактивных эффектов и интегрируются с scheduler.

Практически это значит:

- `watchEffect` запускается сразу и затем перепланируется при изменениях зависимостей;
- `watch` дает больше контроля: источник, `flush`, `immediate`, `deep`, `once`.

Для async-сценариев важно cleanup, чтобы старые задачи не конфликтовали с новыми:

```ts
watch(query, async (q, _, onCleanup) => {
    const controller = new AbortController();
    onCleanup(() => controller.abort());

    const res = await fetch(`/api/search?q=${q}`, {
        signal: controller.signal,
    });
    data.value = await res.json();
});
```

## Vue2 vs Vue3

В интервью часто спрашивают разницу scheduler между версиями.

- Vue 2: очередь watcher-ов и `flushSchedulerQueue`.
- Vue 3: очереди job/callback + более явная интеграция с effect-системой (`pre`/`post` flush callbacks).

Идея батчинга одна и та же, но реализация в Vue 3 более гибкая и лучше сочетается с Composition API.

## Частые ошибки

1. Читать DOM сразу после изменения state без `nextTick`.
2. Ставить `flush: 'sync'` без необходимости.
3. Делать тяжелые side effects в `pre`-watcher, когда нужен `post`.
4. Запускать внутри watcher мутации того же источника без контроля, ловя циклы.

## Мини чеклист

- Нужно производное значение -> `computed`.
- Нужен side effect -> `watch`.
- Нужен доступ к уже обновленному DOM -> `flush: 'post'` или `await nextTick()`.
- Нужна максимальная предсказуемость -> избегать `flush: 'sync'` по умолчанию.

## Официальные ссылки

- [Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [Watchers](https://vuejs.org/guide/essentials/watchers.html)
- [nextTick API](https://vuejs.org/api/general.html#nexttick)
- [Rendering Mechanism](https://vuejs.org/guide/extras/rendering-mechanism.html)
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)

---

<RelatedTopics
    :items="[
        { title: 'Асинхронный рендер', href: '/vue/asinkhronnye-rendery-i-batching' },
        { title: 'Watch vs Effect', href: '/vue/watch-i-watcheffect' },
        { title: 'Подкапотные темы', href: '/vue/podkapotnye-temy-vo-vue-js' },
    ]"
/>
