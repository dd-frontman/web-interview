CSP — это «белый список» для браузера: откуда **можно** загружать и выполнять скрипты, стили, картинки, какие страницы могут встраивать наш сайт в `<iframe>`, куда можно отправлять запросы и т. д. Цель — **снизить риск XSS/кликджекинга** и других атак.

---

## 2) Как это работает под капотом

### 2.1. Где задаётся политика

- **HTTP-заголовок**: `Content-Security-Policy: ...` — предпочтительно.
- **`<meta http-equiv="Content-Security-Policy">`** — допустимо, но **не все директивы** поддерживаются через meta (например, `frame-ancestors` нужно только в заголовке).
- Есть режим наблюдения: `Content-Security-Policy-Report-Only: ...` — логирует нарушения без блокировки.

### 2.2. Классы директив (что именно ограничиваем)

- **Fetch-директивы**: `script-src`, `style-src`, `img-src`, `font-src`, `connect-src`, `media-src`, `object-src`, `worker-src`, `frame-src` — откуда грузим конкретные типы ресурсов.
- **Navigation-директивы**: `form-action`, `frame-ancestors` — куда можно отправлять формы, кто может встраивать наш сайт в `<iframe>`.
- **Document/Other**: `base-uri`, `sandbox`, `upgrade-insecure-requests` и др.
- **Reporting**: `report-uri` (устар.) / `report-to` (через Reporting API) + `Reporting-Endpoints` — куда присылать отчёты о нарушениях.
- **Hardening-надстройки**: `trusted-types`, `require-trusted-types-for 'script'` — защита DOM-XSS на уровне типов.

### 2.3. Выражения-источники (source expressions)

- `'self'` — тот же origin.
- `'none'` — полный запрет для директивы.
- `https:` / `data:` / `blob:` / `wss:` — схемы.
- `example.com` / `*.example.com` — хосты.
- `'unsafe-inline'`, `'unsafe-eval'` — **разрешают опасные вещи** (по возможности избегаем).
- **Nonce/Hash**: `'nonce-<rand>'`, `'sha256-<...>'` — точечно разрешают конкретный inline-скрипт/стиль.
- **`'strict-dynamic'`** (в `script-src`): доверяем только скриптам с nonce/hash **и** всем скриптам, которые они **динамически** загрузили; игнорируем списки доменов.

### 2.4. Fallback-логика

- `default-src` — «умолчание» для многих типов. Если конкретной директивы (например, `img-src`) нет, применяется `default-src`.
- В некоторых случаях директивы **не имеют** fallback к `default-src` (например, `frame-ancestors`).

---

## 3) Стратегии и шаблоны политик

### 3.1. Базовая строгая политика (минимально жизнеспособная)

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'self';
  object-src 'none';
  frame-ancestors 'none';
```

- Грузим всё только с нашего домена, объекты (`<object>/<embed>`) запрещаем, фреймы запрещаем.
- Подходит для простых SPA/MPA **без** внешних CDN и inline-кода.

### 3.2. «Строгий CSP» (nonce/hash-based) — рекомендован против XSS

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{RANDOM}' 'strict-dynamic';
  style-src  'self' 'nonce-{RANDOM}';
  img-src    'self' data:;
  connect-src 'self' https://api.example.com;
  font-src   'self';
  object-src 'none';
  base-uri   'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
  report-uri /csp-report;
  report-to csp-endpoint;
```

**Ключевая идея**: _никаких_ `unsafe-inline`/`unsafe-eval`; все inline-скрипты/стили получают **nonce**, и только они (и то, что они динамически подгрузят при `strict-dynamic`) выполняются.

> `nonce` генерируется **для каждого запроса** случайно, не кэшируется, встраивается в `<script nonce="...">`/`<style nonce="...">`.

### 3.3. Разрешить `<iframe>` только из доверенных источников

```http
Content-Security-Policy:
  ...;
  frame-ancestors 'self' https://partner.example;
  frame-src https://player.videosvc.com;
```

### 3.4. HTTPS-миграция и смешанный контент

```http
Content-Security-Policy:
  ...;
  upgrade-insecure-requests;
```

- Просим браузер **апгрейдить** `http://` → `https://` там, где возможно.
- `block-all-mixed-content` устарел как отдельная мера; современные браузеры и так апгрейдят/блокируют нужные категории.

### 3.5. Trusted Types (защита от DOM-XSS)

```http
Content-Security-Policy:
  ...;
  require-trusted-types-for 'script';
  trusted-types default dompurify-js;
```

- Принуждает использовать «доверенные» значения для опасных JS-синков (`innerHTML`, `eval`-подобные).
- Полезно в больших фронтах с HTML-вставками (санитайзеры, `DOMPurify` и т. п.).

---

## 4) Интеграция с React / Vue / SSR

### 4.1. Next.js (Pages/App Router)

- Генерируйте `nonce` на **каждый** ответ (middleware/edge), добавляйте его:
  - в CSP (заголовок/`<meta>`),
  - в ваши `<script>`/`<style>` (включая `next/script`).
- Пример (условно): middleware задаёт `x-nonce` + CSP, затем `Document`/`Layout` читает и ставит `nonce` атрибуты.
- Следите за внешними провайдерами (аналитика, карты, видео): добавляйте их хосты в `connect-src`/`frame-src`/`img-src`.

### 4.2. Nuxt 3

- Модуль **`nuxt-security`** позволяет включить CSP и даже «Strict CSP» проще (генерация nonce, готовые пресеты).
- Разрешения для внешних ресурсов (`images`, `fonts`, `connect`) настраивайте в конфиге модуля.

### 4.3. Общие рекомендации для SPA/SSR

- **Не используйте** `dangerouslySetInnerHTML` / `v-html` без жёсткой санитизации и, по возможности, Trusted Types.
- Скрипты с CDN — по возможности через **SRI** (`integrity`) + точечные хосты в `script-src` (если не `strict-dynamic`).
- В проде держите CSP в **заголовках** (а не только `<meta>`), чтобы все навигационные директивы работали.

---

## 5) Частые грабли и как их решать

| Проблема                                 | Почему так                                                      | Как исправить                                                                                            |
| ---------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Inline-скрипты/стили заблокированы       | По умолчанию строгая политика запрещает inline                  | Введите **nonce/hash** и добавьте `'nonce-...'`/`'sha256-...'` в `script-src`/`style-src`                |
| Третья сторона динамически подгружает JS | У неё нет вашего nonce                                          | Используйте `'strict-dynamic'` + nonce на «корневом» `<script>`; **избегайте** whitelist-подхода доменов |
| «Сломались» события вида `onclick=`      | Это inline-обработчики                                          | Перепишите на `addEventListener`; либо `unsafe-hashes` (точечно, но лучше избегать)                      |
| iFrame не встраивается                   | `frame-ancestors 'none'`                                        | Разрешите нужные родительские источники: `frame-ancestors 'self' https://partner...`                     |
| Картинки/шрифты не грузятся              | Нет нужных источников                                           | Добавьте `img-src`/`font-src` для нужных доменов/схем (`data:` для inline)                               |
| «Всё белый экран» после включения CSP    | Политика слишком жёсткая                                        | Включайте сначала **Report-Only**, собирайте отчёты, постепенно ужесточайте                              |
| `report-to` не шлёт отчёты               | Неполная поддержка/не настроен Reporting-Endpoints              | Укажите **оба**: `report-uri` (legacy) **и** `report-to` + `Reporting-Endpoints`                         |
| `blob:`/`data:` дали дыру                | Эти схемы могут быть опасны                                     | Разрешайте их **точечно** и только там, где без них никак                                                |
| `block-all-mixed-content` не помогает    | Современные браузеры и так апгрейдят/блокируют нужные категории | Используйте `upgrade-insecure-requests` и исправляйте источники на HTTPS                                 |
| Trusted Types «ломает» встраивания       | Принуждает к санитизации                                        | Настройте политики (`trusted-types`) и используйте санитайзеры (например, DOMPurify)                     |

---

## 6) Пошаговое внедрение (рекомендуемый процесс)

1. **Инвентаризация**: найдите все внешние ресурсы (скрипты, стили, изображения, фреймы, API).
2. **Включите `Report-Only`**: соберите логи нарушений (Sentry/Report URI/собственный endpoint).
3. **Минимизируйте inline**: вынесите скрипты/стили в файлы или расставьте **nonce/hash**.
4. **Соберите строгую политику**: начните с `'self'` + явных доменов; для скриптов — лучше **nonce/hash + 'strict-dynamic'**.
5. **Защитите фреймы**: `frame-ancestors` только для нужных родителей; `frame-src` — для разрешённых источников.
6. **Подтяните HTTPS**: `upgrade-insecure-requests`, уберите оставшиеся `http://`.
7. **Добавьте Trusted Types** (поэтапно) и SRI там, где это уместно.
8. **Переведите в enforce-режим**: смените `Report-Only` на реальный `Content-Security-Policy`, не забывая про отчёты.
9. **Автоматизируйте**: проверяйте CSP в CI/CD, следите за отчётами в проде.

---

## 7) Примеры для серверов/фреймворков

### 7.1. Nginx (заголовок)

```nginx
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'nonce-$request_id' 'strict-dynamic';
  style-src 'self' 'nonce-$request_id';
  img-src 'self' data:;
  connect-src 'self' https://api.example.com;
  object-src 'none';
  frame-ancestors 'none';
  upgrade-insecure-requests;
  report-uri /csp-report;
  report-to csp-endpoint
" always;
add_header Reporting-Endpoints "csp-endpoint=\"https://report.example.com/csp\"";
```

### 7.2. Next.js (middleware → заголовки + nonce; `_document` → проставить nonce)

```ts
// middleware.ts (упрощённый пример)
import { NextResponse } from "next/server";

export function middleware(req: Request) {
	const nonce = crypto.randomUUID().replace(/-/g, "");
	const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src  'self' 'nonce-${nonce}';
    img-src    'self' data:;
    connect-src 'self' https://api.example.com;
    object-src 'none';
    base-uri   'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    report-uri /csp-report; report-to csp-endpoint;
  `
		.replace(/\s{2,}/g, " ")
		.trim();

	const res = NextResponse.next();
	res.headers.set("x-nonce", nonce);
	res.headers.set("Content-Security-Policy", csp);
	res.headers.set("Reporting-Endpoints", 'csp-endpoint="https://report.example.com/csp"');
	return res;
}
```

### 7.3. Nuxt 3 (`nuxt-security`)

```ts
// nuxt.config.ts (идея, реальные опции см. в доке модуля)
export default defineNuxtConfig({
	modules: ["nuxt-security"],
	security: {
		headers: {
			contentSecurityPolicy: {
				value: {
					"default-src": ["'self'"],
					"script-src": ["'self'", "'strict-dynamic'", "'nonce-{{nonce}}'"],
					"style-src": ["'self'", "'nonce-{{nonce}}'"],
					"img-src": ["'self'", "data:"],
					"connect-src": ["'self'", "https://api.example.com"],
					"object-src": ["'none'"],
					"frame-ancestors": ["'none'"],
					"upgrade-insecure-requests": true,
					"report-uri": ["/csp-report"],
					"report-to": ["csp-endpoint"],
				},
			},
			reportingEndpoints: {
				value: 'csp-endpoint="https://report.example.com/csp"',
			},
		},
	},
});
```

---

## 8) Чит-шит (таблица)

| Тема               | Что запомнить                                                            | Быстрый пример                                                    |
| ------------------ | ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| База               | CSP — whitelist для ресурсов и навигации                                 | `default-src 'self'; object-src 'none'`                           |
| Скрипты            | Избегаем `unsafe-inline/eval`; берем **nonce/hash** + `'strict-dynamic'` | `script-src 'self' 'nonce-...' 'strict-dynamic'`                  |
| Стили              | Inline только с nonce/hash                                               | `style-src 'self' 'nonce-...'`                                    |
| Картинки/шрифты    | Добавляем `data:` при необходимости                                      | `img-src 'self' data:`                                            |
| API/WebSocket      | Явно разрешаем                                                           | `connect-src 'self' https://api.example.com`                      |
| iFrame/кликджекинг | Кто может встраивать наш сайт → `frame-ancestors`                        | `frame-ancestors 'none'` или `... partner.com`                    |
| Mixed content      | Апгрейдить на HTTPS                                                      | `upgrade-insecure-requests`                                       |
| Trusted Types      | DOM-XSS харднинг                                                         | `require-trusted-types-for 'script'; trusted-types default`       |
| Отчёты             | Совместимость: указываем **оба**                                         | `report-uri /csp; report-to csp-endpoint` + `Reporting-Endpoints` |
| Процесс            | Сначала **Report-Only**, потом enforce                                   | `Content-Security-Policy-Report-Only: ...`                        |
| SPA/SSR            | Генерируй **nonce на каждый ответ**, проставляй в `<script>/<style>`     | middleware/сервер формирует CSP + nonce                           |

---

---

> [!tip] Связанные темы
>
> - [Безопасность приложений](/bezopasnost-prilozhenii/bezopasnost-prilozhenii)
> - [CSRF (Cross-Site Request Forgery)](/bezopasnost-prilozhenii/csrf-cross-site-request-forgery)
> - [XSS (Cross-Site Scripting)](/bezopasnost-prilozhenii/xss-cross-site-scripting)

