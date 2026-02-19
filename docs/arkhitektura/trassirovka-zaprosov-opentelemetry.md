---
title: "Trassirovka zaprosov opentelemetry"
description: "Трассировка нужна, чтобы видеть полный путь одного пользовательского запроса через несколько сервисов."
tags:
  - "arkhitektura"
  - "trassirovka-zaprosov-opentelemetry"
updatedAt: "2026-02-16"
---
## Трассировка запросов (Request Tracing)

Трассировка нужна, чтобы видеть полный путь одного пользовательского запроса через несколько сервисов.

Пример: пользователь нажал "Оформить заказ", и запрос прошел через `frontend -> api-gateway -> order-service -> payment-service`.

## Базовые термины

- `Trace` — вся цепочка одного запроса.
- `Span` — отдельный шаг внутри trace.
- `Trace ID` — общий идентификатор всей цепочки.
- `Span ID` — идентификатор конкретного шага.

## Как это выглядит на практике

```text
Trace 8f3a...:
  frontend span (120ms)
    -> api-gateway span (90ms)
      -> order-service span (65ms)
      -> payment-service span (40ms, error)
```

По такой картине быстро видно, где задержка или ошибка.

## Как frontend участвует в tracing

Frontend обычно:

1. стартует исходный запрос;
2. передает trace-контекст в заголовках;
3. связывает user-action в аналитике с backend trace.

Стандартный заголовок для контекста: `traceparent` (W3C Trace Context).

## Мини-пример

```ts
await fetch("/api/orders", {
    method: "POST",
    headers: {
        "content-type": "application/json",
        traceparent: "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
    },
    body: JSON.stringify({ productId: "p-1" }),
});
```

На практике `traceparent` обычно ставится автоматически через SDK/инструментацию.

## Что дает команде

1. Быстрая диагностика медленных запросов.
2. Понимание, какой сервис стал bottleneck.
3. Легче разбирать инциденты и регрессии после релиза.
4. Удобнее контролировать SLO/SLI по задержке и ошибкам.

## Частые ошибки

1. Логи есть, но без общего `trace id`.
2. Трассировка включена только в backend, без связки с frontend-action.
3. Нет семплирования (слишком дорого по объему данных).
4. В трассы попадают чувствительные данные (PII) без фильтрации.

## Официальные источники

- OpenTelemetry: Traces  
  https://opentelemetry.io/docs/concepts/signals/traces/
- W3C Trace Context  
  https://www.w3.org/TR/trace-context/
- OpenTelemetry: Instrumentation (JS)  
  https://opentelemetry.io/docs/languages/js/instrumentation/

---

<RelatedTopics
    :items="[
        { title: 'Архитектура приложений — виды и особенности', href: '/arkhitektura/arkhitektura-prilozhenii-vidy-i-osobennosti' },
        { title: 'Микросервисы', href: '/arkhitektura/mikroservisy' },
        { title: 'Безопасность приложений', href: '/bezopasnost-prilozhenii/bezopasnost-prilozhenii' },
    ]"
/>
