---
title: "Asinkhronnye rendery i"
description: "Краткая выжимка по теме \\\"Asinkhronnye rendery i batching\\\"."
tags:
  - "vue"
  - "asinkhronnye-rendery-i-batching"
updatedAt: "2026-02-16"
---
- Когда вы меняете реактивное состояние, Vue не обновляет DOM сразу. Вместо этого он **группирует несколько изменений** и применяет их **в одном обновлении**. Это помогает избежать лишних перерисовок и экономит ресурсы.
- Каждое изменение добавляет **Watchers** в очередь. Vue запускает `flushSchedulerQueue` на **следующем тике** (асинхронно через microtask), и выполняет все накопленные обновления одним пакетом.

---

## `nextTick()`: что это и почему важно

- `nextTick()` — это утилита, которая позволяет выполнить код **после того, как Vue завершил перерендер DOM**, но **до следующего рендера браузера**.
- В отличие от `setTimeout(..., 0)`, callback у `nextTick()` запускается **раньше**, прямо после завершения обновления DOM, а не после рендера.

---

## Когда нужно испозовать `nextTick()`

- **После мутации данных**, чтобы обращаться к актуальному DOM (например, scroll, focus).
- При тестировании: чтобы assertion выполнялся после того, как DOM обновился.
- В хуках вроде `onMounted()` или `onUpdated()`, когда нужно работать с физической структурой DOM.

---

## Примеры

```vue
<script setup>
import { ref, nextTick } from "vue";

const count = ref(0);
const el = ref(null);

function increment() {
    count.value++;
    console.log("до nextTick:", el.value?.textContent); // всё ещё старое значение

    nextTick(() => {
        console.log("после nextTick:", el.value?.textContent); // уже обновлённое
    });
}
</script>

<template>
    <div ref="el">{{ count }}</div>
    <button @click="increment">+</button>
</template>
```

---

<RelatedTopics
    :items="[
        { title: 'defineExpose()', href: '/vue/defineexpose' },
        { title: 'Директивы Vue', href: '/vue/direktivy-vue' },
        { title: 'Оптимизация High Load проекта', href: '/vue/optimizatsiya-high-load-proekta' },
    ]"
/>
