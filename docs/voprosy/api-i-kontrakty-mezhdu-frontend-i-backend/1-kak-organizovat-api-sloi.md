---
title: "Как вы обычно организуете API-слой во frontend-проекте?"
description: "Ответ про разделение API client, сервисного слоя, маппинга DTO и composables для работы с данными."
tags:
  - "voprosy"
  - "api"
  - "frontend"
  - "arkhitektura"
updatedAt: "2026-03-12"
---
# Как вы обычно организуете API-слой во frontend-проекте?

## Ответ

API-слой лучше отделять от компонентов и UI-логики. Компоненты не должны напрямую выполнять HTTP-запросы, потому что это усложняет поддержку и тестирование.

Обычно архитектура выглядит так.

## 1. API client

Это слой, который отвечает за HTTP-запросы:

- настройка base URL;
- headers;
- обработка токенов;
- перехват ошибок;
- retry-механизмы.

## 2. Сервисный слой

Здесь описываются конкретные операции бизнес-домена.

Например:

- `getUsers()`;
- `createOrder()`;
- `updateProfile()`.

Этот слой абстрагирует детали HTTP.

## 3. Маппинг данных

Часто backend возвращает DTO, которые не идеально подходят для UI. Поэтому иногда добавляют слой трансформации:

- нормализация данных;
- преобразование полей;
- вычисление дополнительных значений.

## 4. Использование в composables

Компоненты обычно не работают с API напрямую. Они используют composables, которые управляют:

- загрузкой данных;
- состоянием загрузки;
- обработкой ошибок;
- кэшированием.

Это позволяет разделить ответственность между слоями системы.

---

<RelatedTopics
    :items="[
        { title: 'Какие преимущества даёт OpenAPI и генерация клиентов?', href: '/voprosy/api-i-kontrakty-mezhdu-frontend-i-backend/2-preimushchestva-openapi-i-generatsii-klientov' },
        { title: 'Как вы отделяете DTO, приходящие с backend, от внутренних моделей frontend-приложения?', href: '/voprosy/api-i-kontrakty-mezhdu-frontend-i-backend/5-kak-otdelyat-dto-ot-vnutrennikh-modelei' },
        { title: 'OpenAPI, Swagger, Protobuf', href: '/npm-tools/openapi-swagger-protobuf' },
    ]"
/>
