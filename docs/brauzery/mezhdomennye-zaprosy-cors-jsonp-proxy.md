## База: что такое origin

`origin = protocol + host + port`.

Примеры:

- `https://app.example.com` и `https://api.example.com` — разные origin
- `https://example.com` и `http://example.com` — разные origin
- `https://example.com:443` и `https://example.com:8443` — разные origin

По умолчанию браузер применяет Same-Origin Policy и ограничивает доступ между origin.

## 1. CORS (основной современный механизм)

CORS позволяет серверу явно сказать, каким origin можно читать ответ.

Основные заголовки:

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`
- `Access-Control-Allow-Credentials`

Если запрос "несложный", браузер отправляет его сразу.  
Если несложный условиям не соответствует, браузер сначала делает preflight `OPTIONS`.

### Важный нюанс с cookie/сессией

Если используете `credentials: "include"`:

- нельзя ставить `Access-Control-Allow-Origin: *`
- сервер должен вернуть конкретный origin и `Access-Control-Allow-Credentials: true`

## 2. JSONP (устаревший подход)

JSONP работает через `<script src="...">`, потому что загрузка скриптов historically не блокируется SOP как XHR/fetch.

Ограничения JSONP:

- только `GET`
- риск безопасности (выполняется как script)
- неудобно для современных API

Сегодня JSONP используют только в legacy-системах.

## 3. Backend Proxy / BFF

Подход: браузер ходит только в ваш backend (`same-origin`), а backend уже обращается к внешним API.

Плюсы:

- CORS-проблема уходит с клиента
- удобнее скрыть ключи и централизовать auth/retry/cache/rate-limit

Минусы:

- больше нагрузки на ваш backend
- дополнительная точка отказа

## Что выбирать на практике

1. Публичный API для web-клиента: CORS с точной allowlist origin.
2. Внутренние интеграции/секреты/агрегация: backend proxy (BFF).
3. JSONP: только для поддержки старого легаси.

## Частые ошибки

- `Access-Control-Allow-Origin: *` вместе с credentials
- "разрешить всё" в production без списка origin
- перенос security-логики в клиент вместо backend
- ожидание, что CORS защищает от CSRF (это разные классы задач)

---

<RelatedTopics
	:items="[
		{ title: 'Сети, HTTP и CORS', href: '/brauzery/seti-http-i-cors' },
		{ title: 'Разница между HTTP 1.1, HTTP 2 и HTTP 3', href: '/brauzery/raznitsa-mezhdu-http-1-1-http-2-i-http-3' },
		{ title: 'CSRF (Cross-Site Request Forgery)', href: '/bezopasnost-prilozhenii/csrf-cross-site-request-forgery' },
	]"
/>
