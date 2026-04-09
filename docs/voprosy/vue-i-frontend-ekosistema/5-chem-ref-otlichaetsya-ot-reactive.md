---
title: "Чем ref отличается от reactive?"
description: "Ответ про разницу между ref и reactive, доступ через value, работу с объектами и типичные сценарии применения."
tags:
  - "voprosy"
  - "vue"
  - "ref"
  - "reactive"
updatedAt: "2026-03-12"
---
# Чем ref отличается от reactive?

## Ответ

`ref` используется для хранения примитивных значений или одиночных реактивных переменных.

Пример:

```ts
const count = ref(0);
```

Доступ к значению происходит через `.value`.

`reactive` используется для объектов и сложных структур данных.

```ts
const state = reactive({
    user: null,
    loading: false,
});
```

Главные различия:

`ref`

- работает с примитивами;
- доступ через `.value`;
- хорошо подходит для одиночных значений;
- удобен в composables.

`reactive`

- работает с объектами;
- не требует `.value`;
- удобен для state-объектов;
- менее удобен при деструктуризации.

На практике часто используют комбинацию этих подходов.

---

<RelatedTopics
    :items="[
        { title: 'Как устроена реактивность во Vue 3 на высоком уровне?', href: '/voprosy/vue-i-frontend-ekosistema/4-kak-ustroena-reaktivnost-vue-3' },
        { title: 'В каких случаях watch лучше computed, а в каких нет?', href: '/voprosy/vue-i-frontend-ekosistema/6-kogda-watch-luchshe-computed' },
        { title: 'ref vs reactive', href: '/vue/ref-and-reactive/ref-vs-reactive' },
    ]"
/>
