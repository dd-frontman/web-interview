---
title: "Obschenie mezhdu vkladkami"
description: "Простой API для вкладок одного origin."
tags:
  - "brauzery"
  - "obschenie-mezhdu-vkladkami-brauzera"
updatedAt: "2026-02-16"
---
## Зачем нужно общение между вкладками

Типовые сценарии:

- синхронизация logout/login во всех вкладках
- обновление пользовательских настроек
- распространение нотификаций и событий без сервера

## 1. BroadcastChannel (рекомендуемый вариант)

Простой API для вкладок одного origin.

```ts
const channel = new BroadcastChannel("app-events");

channel.postMessage({ type: "LOGOUT" });

channel.onmessage = (event) => {
    if (event.data.type === "LOGOUT") {
        // очистка токенов и редирект
    }
};
```

Плюсы:

- минимальный код
- работает в пределах origin без ручной сериализации

## 2. Событие `storage` (через localStorage)

Срабатывает в других вкладках при изменении ключа.

```ts
localStorage.setItem("app:event", JSON.stringify({ type: "LOGOUT", at: Date.now() }));

window.addEventListener("storage", (event) => {
    if (event.key !== "app:event" || !event.newValue) return;
    const payload = JSON.parse(event.newValue);
    if (payload.type === "LOGOUT") {
        // синхронизация состояния
    }
});
```

Ограничение: событие не приходит в той же вкладке, где ключ изменили.

## 3. SharedWorker

Подходит, если нужен общий long-lived контекст для всех вкладок одного origin.

- сложнее в настройке
- не всегда нужен для обычных UI-событий

## Что выбрать

1. Для большинства задач: `BroadcastChannel`.
2. Для старых/ограниченных окружений: fallback на `storage`.
3. Для общего вычислительного/сетевого слоя на все вкладки: `SharedWorker`.

---

<RelatedTopics
    :items="[
        { title: 'Workers в браузере', href: '/brauzery/workers-v-brauzere' },
        { title: 'Сети, HTTP и CORS', href: '/brauzery/seti-http-i-cors' },
        { title: 'Event Loop', href: '/javascript/event-loop' },
    ]"
/>
