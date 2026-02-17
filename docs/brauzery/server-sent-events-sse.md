---
title: "SSE sse"
description: "Server-Sent Events (SSE) — это способ передавать данные с сервера в браузер по одному долгоживущему HTTP-соединению."
tags:
  - "brauzery"
  - "server-sent-events-sse"
updatedAt: "2026-02-16"
---
## Что такое SSE

Server-Sent Events (SSE) — это способ передавать данные с сервера в браузер по одному долгоживущему HTTP-соединению.

- направление: только `server -> client`
- формат: текстовый поток `text/event-stream`
- клиент: стандартный API `EventSource`

SSE удобно использовать для уведомлений, live-статусов, лент событий и прогресса фоновых задач.

## SSE vs WebSocket vs Polling

- `SSE`: просто, нативно в браузере, однонаправленно
- `WebSocket`: двунаправленно, лучше для чатов/игр/коллаборации
- `Polling`: проще инфраструктурно, но больше лишних запросов

## Пример клиента

```ts
const source = new EventSource("/api/events");

source.addEventListener("message", (event) => {
	console.log("update:", event.data);
});

source.addEventListener("order-updated", (event) => {
	const payload = JSON.parse(event.data);
	console.log("order", payload.id, payload.status);
});

source.onerror = () => {
	console.log("connection error");
};
```

## Пример сервера (Node.js/Express)

```ts
app.get("/api/events", (req, res) => {
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive");
	res.flushHeaders();

	const timer = setInterval(() => {
		res.write(`event: order-updated\n`);
		res.write(`data: ${JSON.stringify({ id: 42, status: "processing" })}\n\n`);
	}, 2000);

	req.on("close", () => {
		clearInterval(timer);
		res.end();
	});
});
```

## Важные детали продакшена

- отправляйте heartbeat, чтобы не рвалось соединение на прокси
- учитывайте авто-reconnect `EventSource`
- для resume используйте `id:` и `Last-Event-ID`
- проверяйте таймауты у reverse proxy/CDN

---

<RelatedTopics
	:items="[
		{ title: 'Сети, HTTP и CORS', href: '/brauzery/seti-http-i-cors' },
		{ title: 'Сравнение HTTP/1.1, HTTP/2 и HTTP/3', href: '/brauzery/versii-http/sravnenie-http-versii' },
		{ title: 'Полный путь загрузки сайта', href: '/brauzery/polnyi-put-zagruzki-saita' },
	]"
/>
