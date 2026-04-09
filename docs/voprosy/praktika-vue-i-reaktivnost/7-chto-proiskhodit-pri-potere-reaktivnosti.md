---
title: "Что происходит при потере реактивности?"
description: "Ответ про деструктуризацию reactive, копии данных, неправильную работу с refs и способы сохранить реактивность."
tags:
  - "voprosy"
  - "vue"
  - "reaktivnost"
  - "pinia"
updatedAt: "2026-03-12"
---
# Что происходит при потере реактивности?

## Ответ

Реактивность может потеряться, если:

- деструктурировать `reactive` объект;
- работать с копией данных;
- неправильно использовать refs.

Например:

```ts
const { user } = state;
```

В таком случае `user` перестаёт быть реактивным.

Решение — использовать:

- `toRefs`;
- `storeToRefs` для Pinia.

Это сохраняет связь с реактивной системой.

---

<RelatedTopics
    :items="[
        { title: 'Почему нельзя использовать index как key в v-for?', href: '/voprosy/praktika-vue-i-reaktivnost/6-pochemu-nelzya-ispolzovat-index-kak-key' },
        { title: 'Какие типовые ошибки во Vue-коде вы чаще всего замечаете на code review?', href: '/voprosy/code-review-i-analiz-koda/5-tipovye-oshibki-vo-vue-kode' },
        { title: 'ref vs reactive', href: '/vue/ref-and-reactive/ref-vs-reactive' },
    ]"
/>
