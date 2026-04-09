---
title: "Где на практике полезны Teleport и Suspense?"
description: "Ответ про использование Teleport для модалок и Suspense для асинхронного рендера и fallback UI."
tags:
  - "voprosy"
  - "vue"
  - "teleport"
  - "suspense"
updatedAt: "2026-03-12"
---
# Где на практике полезны Teleport и Suspense?

## Ответ

Teleport используется в ситуациях, когда компонент логически находится в одном месте дерева компонентов, но должен быть отрендерен в другом месте DOM.

Типичные примеры:

- модальные окна;
- всплывающие уведомления;
- dropdown-меню;
- tooltip.

Например, модалка может быть объявлена внутри компонента страницы, но фактически рендериться в корневом DOM-узле, чтобы избежать проблем со стилями и `z-index`.

Suspense применяется для управления асинхронными зависимостями компонентов.

Он позволяет:

- показывать fallback-UI;
- ждать загрузки данных;
- управлять асинхронным рендером.

Однако на практике Suspense используется реже, потому что многие команды предпочитают контролировать загрузку данных через store или composables.

---

<RelatedTopics
    :items="[
        { title: 'Какие возможности Vue 3 вы считаете наиболее важными в реальной разработке?', href: '/voprosy/vue-i-frontend-ekosistema/1-vazhnye-vozmozhnosti-vue-3' },
        { title: 'Composition API и его преимущества', href: '/voprosy/vue-i-frontend-ekosistema/2-kogda-ispolzovat-composition-api' },
        { title: 'Suspense', href: '/vue/suspense' },
    ]"
/>
