---
title: "Как вызвать метод дочернего компонента из родителя (defineExpose)?"
description: "Ответ про defineExpose, ref на дочерний компонент и случаи, когда такой подход уместен."
tags:
  - "voprosy"
  - "vue"
  - "defineexpose"
  - "components"
updatedAt: "2026-03-12"
---
# Как вызвать метод дочернего компонента из родителя (defineExpose)?

## Ответ

В Vue 3 компоненты по умолчанию изолированы.

Если нужно вызвать метод дочернего компонента из родителя, используется `defineExpose`.

Идея следующая:

1. В дочернем компоненте явно объявляется, какие методы доступны извне.
2. Родитель получает ссылку через `ref`.
3. Родитель вызывает метод.

Это используется редко, потому что обычно коммуникация идёт через:

- props;
- emits.

Но иногда это удобно для:

- управления модалками;
- сброса формы;
- программного фокуса.

---

<RelatedTopics
    :items="[
        { title: 'Что такое Suspense и когда его использовать?', href: '/voprosy/praktika-vue-i-reaktivnost/5-chto-takoe-suspense-i-kogda-ispolzovat' },
        { title: 'Как определить, что компонент слишком большой?', href: '/voprosy/praktika-vue-i-reaktivnost/8-kak-opredelit-chto-komponent-slishkom-bolshoi' },
        { title: 'defineExpose()', href: '/vue/defineexpose' },
    ]"
/>
