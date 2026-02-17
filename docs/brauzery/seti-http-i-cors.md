---
title: "Шпаргалка"
description: "Чтобы понимать, как работает HTTP и почему существует CORS, важно вспомнить основы работы сетей."
tags:
  - "brauzery"
  - "seti-http-i-cors"
updatedAt: "2026-02-16"
---
## 1. Введение в компьютерные сети

Чтобы понимать, как работает HTTP и почему существует CORS, важно вспомнить основы работы сетей.

### 1.1 Модель OSI и TCP/IP

**Модель OSI (7 уровней):**

1. **Physical (Физический)** — передача битов (кабели, радиосигналы).
2. **Data Link (Канальный)** — формирование кадров (frames), доступ к среде.
3. **Network (Сетевой)** — IP-протокол, маршрутизация.
4. **Transport (Транспортный)** — TCP (надёжно) или UDP (быстро, но без гарантии).
5. **Session (Сеансовый)** — управление сессиями, соединениями.
6. **Presentation (Представительский)** — кодирование, шифрование.
7. **Application (Прикладной)** — HTTP, FTP, SMTP и др.

**TCP/IP (практическая модель, 4 уровня):**

- Link (Network Access)
- Internet (IP)
- Transport (TCP/UDP)
- Application (HTTP, DNS, FTP, …)

### 1.2 IP-адреса и порты

- **IP-адрес (IPv4)**: `192.168.1.1` — адрес хоста.
- **Порт**: число (1–65535), идентификатор службы на хосте.
  - HTTP — порт 80.
  - HTTPS — порт 443.

---

## 2. Протокол HTTP (HyperText Transfer Protocol)

HTTP — протокол прикладного уровня для передачи данных в Интернете. Работает по модели **клиент → сервер**.

### 2.1 Основные версии

- **HTTP/1.1** — текстовый протокол, keep-alive, один поток.
- **HTTP/2** — бинарный, мультиплексирование, сжатие заголовков.
- **HTTP/3 (QUIC)** — работает поверх UDP, быстрее устанавливает соединения.

### 2.2 Структура HTTP-запроса

Пример GET-запроса:

```
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html
```

- Метод (GET, POST, PUT, DELETE, …).
- Путь (URI, например `/index.html`).
- Версия протокола.
- Заголовки.
- Тело (для POST/PUT).

### 2.3 Структура HTTP-ответа

```
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<html>...</html>
```

- Статусная строка (версия + код + описание).
- Заголовки (Content-Type, Length, Cache-Control).
- Тело (HTML, JSON, файл).

### 2.4 Методы HTTP

- **GET** — получение.
- **POST** — создание.
- **PUT** — полное обновление.
- **PATCH** — частичное обновление.
- **DELETE** — удаление.
- **HEAD, OPTIONS** — вспомогательные.

### 2.5 Коды состояния

- **1xx** — информационные.
- **2xx** — успех (200 OK, 201 Created).
- **3xx** — редиректы (301, 302).
- **4xx** — ошибки клиента (400, 401, 403, 404).
- **5xx** — ошибки сервера (500, 503).

---

## 3. CORS (Cross-Origin Resource Sharing)

### 3.1 Что такое Origin

**Origin** определяется тремя параметрами:

- схема (http/https),
- домен,
- порт.

Разные origin:

- `http://example.com` ≠ `https://example.com` (разная схема).
- `http://example.com` ≠ `http://api.example.com` (разный поддомен).
- `http://example.com` ≠ `http://example.com:3000` (разный порт).

### 3.2 Как работает CORS

- **Simple Request** (GET/POST без кастомных заголовков).  
  Браузер сразу отправляет запрос, но **блокирует ответ**, если сервер не добавил:
  ```
  Access-Control-Allow-Origin: http://siteA.com
  ```
- **Preflight Request (OPTIONS)** — если запрос сложный (PUT, DELETE, нестандартные заголовки).  
  Браузер сначала отправляет `OPTIONS`, чтобы «спросить разрешение».  
  Сервер отвечает:
  ```
  Access-Control-Allow-Origin: http://siteA.com
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  Access-Control-Allow-Headers: Content-Type, Authorization
  ```
  Если разрешено — браузер выполнит основной запрос.

### 3.3 Настройки на сервере (Node.js + Express)

```js
// Ручная настройка
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://siteA.com");
	res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
	res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
	next();
});

// С помощью cors middleware
import cors from "cors";
app.use(
	cors({
		origin: "http://siteA.com",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);
```

### 3.4 Зачем нужен CORS

Без CORS → любой сайт мог бы делать запросы от лица пользователя (например, к банку).  
CORS → сервер сам решает, **кому можно**. Это защита от XSRF/CSRF-атак.

---

# Шпаргалка

| Раздел                  | Ключевые моменты                                                           |
| ----------------------- | -------------------------------------------------------------------------- |
| **Сети**                | OSI (7 уровней), TCP/IP (4 уровня), IP + порты                             |
| **HTTP**                | Клиент-сервер, методы (GET/POST/PUT/DELETE), коды 1xx–5xx                  |
| **HTTP версии**         | 1.1 (текст), 2 (бинарный + мультиплекс), 3 (UDP + QUIC)                    |
| **CORS**                | Ограничивает доступ между origin; основан на заголовках `Access-Control-*` |
| **Simple vs Preflight** | Простые запросы проверяются по ответу, сложные → `OPTIONS` запрос          |
| **Защита**              | CORS предотвращает кражу запросов между сайтами, особенно CSRF             |

---

<RelatedTopics
	:items="[
		{ title: 'A11y (Accessibility)', href: '/brauzery/a11y-accessibility' },
		{ title: 'Critical Render Path', href: '/brauzery/crp/critical-render-path' },
		{ title: 'Forced Synchronous Layout и Long Tasks', href: '/brauzery/forced-synchronous-layout-i-long-tasks' },
	]"
/>
