---
title: "Как вы отделяете DTO, приходящие с backend, от внутренних моделей frontend-приложения?"
description: "Ответ про слой трансформации данных, отделение DTO от UI-моделей и уменьшение связности frontend с backend."
tags:
  - "voprosy"
  - "api"
  - "dto"
  - "frontend"
updatedAt: "2026-03-12"
---
# Как вы отделяете DTO, приходящие с backend, от внутренних моделей frontend-приложения?

## Ответ

DTO (Data Transfer Object) — это структура данных, которую возвращает backend. Но UI не всегда должен работать напрямую с этой структурой.

Обычно применяют слой преобразования данных.

Например:

1. Backend возвращает DTO.
2. API-слой получает данные.
3. Происходит трансформация в UI-модель.

Причины для такого разделения:

- backend может менять структуру данных;
- UI может требовать дополнительные вычисления;
- разные страницы могут использовать разные представления данных.

Например:

DTO:

```ts
{
  first_name: "Ivan",
  last_name: "Petrov"
}
```

UI-модель:

```ts
{
  fullName: "Ivan Petrov"
}
```

Такое разделение уменьшает связность между frontend и backend и упрощает изменение интерфейса.

---

<RelatedTopics
    :items="[
        { title: 'Как вы обычно организуете API-слой во frontend-проекте?', href: '/voprosy/api-i-kontrakty-mezhdu-frontend-i-backend/1-kak-organizovat-api-sloi' },
        { title: 'Что именно даёт генерация типов и контрактов для frontend-команды?', href: '/voprosy/api-i-kontrakty-mezhdu-frontend-i-backend/3-chto-dayut-generatsiya-tipov-i-kontraktov' },
        { title: 'OpenAPI, Swagger, Protobuf', href: '/npm-tools/openapi-swagger-protobuf' },
    ]"
/>
