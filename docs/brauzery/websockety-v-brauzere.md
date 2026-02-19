---
title: "Websockety v brauzere"
description: "WebSocket — это постоянное двустороннее соединение между клиентом и сервером."
tags:
  - "brauzery"
  - "websockety-v-brauzere"
updatedAt: "2026-02-16"
---
## WebSocket в браузере

`WebSocket` — это постоянное двустороннее соединение между клиентом и сервером.

В отличие от обычного HTTP, здесь не нужно открывать новое соединение для каждого сообщения.

## Когда использовать

Подходит для realtime-сценариев:

- чаты;
- live-уведомления;
- онлайн-игры;
- торговые/мониторинговые панели.

Если данные идут только от сервера к клиенту и без строгого realtime, часто проще использовать SSE.

## Как работает

1. Клиент отправляет HTTP-запрос с `Upgrade: websocket`.
2. Сервер подтверждает upgrade.
3. После этого начинается обмен WebSocket-фреймами в обе стороны.

Для защищенного канала используют `wss://`.

## Пример клиента

```ts
const socket = new WebSocket("wss://example.com/ws");

socket.addEventListener("open", () => {
    socket.send(JSON.stringify({ type: "PING" }));
});

socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    console.log("message", data);
});

socket.addEventListener("close", () => {
    console.log("connection closed");
});
```

## Практика для продакшена

1. Делайте heartbeat/ping-pong, чтобы выявлять "мертвые" соединения.
2. Добавляйте reconnect с backoff (1s, 2s, 5s, 10s...).
3. Версионируйте формат сообщений (`type`, `version`, `payload`).
4. Проверяйте авторизацию на handshake и на сервере при обработке событий.
5. Ставьте лимиты на размер сообщений и частоту.

## WebSocket vs SSE vs HTTP-polling

- `WebSocket`: двусторонний realtime.
- `SSE`: однонаправленный поток сервер -> клиент, проще для уведомлений.
- `HTTP polling`: самый простой fallback, но больше overhead.

## Официальные источники

- MDN: WebSocket API  
  https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
- MDN: Writing WebSocket client applications  
  https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications
- IETF RFC 6455: The WebSocket Protocol  
  https://datatracker.ietf.org/doc/html/rfc6455

---

<RelatedTopics
    :items="[
        { title: 'Server-Sent Events (SSE)', href: '/brauzery/server-sent-events-sse' },
        { title: 'Сети, HTTP и CORS', href: '/brauzery/seti-http-i-cors' },
        { title: 'Общение между вкладками браузера', href: '/brauzery/obschenie-mezhdu-vkladkami-brauzera' },
    ]"
/>
