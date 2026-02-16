# Общие вопросы по Web (разнесено по разделам)

Этот файл оставлен как навигационная карта.
Подробные ответы перенесены в профильные разделы, чтобы не было дублей и конфликтующих формулировок.

## Верстка и UI

- Адаптивная и отзывчивая веб-разработка  
  `docs/css/adaptivnaya-i-otzyvchivaya-verstka.md`
- Центрирование в CSS  
  `docs/css/tsentrirovanie-v-css.md`
- Позиционирование в CSS  
  `docs/css/pozitsionirovanie-v-css.md`
- Растягивание `main` на высоту экрана + подводные камни  
  `docs/css/raspolozhenie-kontenta-i-vysota-main.md`
- Оптимизация изображений в проекте  
  `docs/brauzery/optimizatsiya-izobrazhenii-v-vebe.md`

## Сети, протоколы и браузер

- Сетевые технологии (OSI/TCP-IP, HTTP, CORS)  
  `docs/brauzery/seti-http-i-cors.md`
- Принципы работы браузера и путь загрузки страницы  
  `docs/brauzery/polnyi-put-zagruzki-saita.md`
- Критический путь рендеринга и типичные ошибки  
  `docs/brauzery/critical-render-path.md`  
  `docs/brauzery/oshibki-critical-rendering-path.md`
- HTTP/1.1 vs HTTP/2 vs HTTP/3  
  `docs/brauzery/raznitsa-mezhdu-http-1-1-http-2-i-http-3.md`
- Междоменные запросы: CORS / JSONP / Proxy  
  `docs/brauzery/mezhdomennye-zaprosy-cors-jsonp-proxy.md`
- WebSocket  
  `docs/brauzery/websockety-v-brauzere.md`
- Server-Sent Events (SSE)  
  `docs/brauzery/server-sent-events-sse.md`
- Общение между вкладками  
  `docs/brauzery/obschenie-mezhdu-vkladkami-brauzera.md`
- Workers (Web / Service / Shared / Worklets)  
  `docs/brauzery/workers-v-brauzere.md`

## Безопасность

- XSS  
  `docs/bezopasnost-prilozhenii/xss-cross-site-scripting.md`
- CSRF  
  `docs/bezopasnost-prilozhenii/csrf-cross-site-request-forgery.md`
- CSP  
  `docs/bezopasnost-prilozhenii/csp-content-security-policy.md`

## JavaScript и форматы данных

- Как работает JavaScript под капотом (engine, runtime, event loop)  
  `docs/javascript/kak-rabotaet-javascript-pod-kapotom.md`
- Event Loop  
  `docs/javascript/event-loop.md`
- Garbage Collector  
  `docs/brauzery/garbage-collector/1-sborschik-musora.md`  
  `docs/brauzery/garbage-collector/2-utechki-pamyati.md`
- JSON и его альтернативы  
  `docs/javascript/json-i-ego-alternativy.md`

## Архитектура

- Архитектура приложений: виды и особенности  
  `docs/arkhitektura/arkhitektura-prilozhenii-vidy-i-osobennosti.md`
- Feature-Sliced Design  
  `docs/arkhitektura/feature-sliced-design.md`
- Микрофронтенд  
  `docs/arkhitektura/mikrofrontend.md`
- Трассировка запросов (request tracing, OpenTelemetry)  
  `docs/arkhitektura/trassirovka-zaprosov-opentelemetry.md`

## Примечание

Если нужно, в следующем шаге могу удалить этот файл полностью и оставить только тематические статьи.

---

<RelatedTopics
	:items="[
		{ title: 'Index', href: '/index' },
		{ title: 'Подготовка к собеседованию', href: '/podgotovka-k-sobesedovaniyu' },
		{ title: 'Vue', href: '/vue' },
	]"
/>
