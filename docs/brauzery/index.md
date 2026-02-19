---
title: "Браузеры"
description: "Краткая выжимка по теме \"Браузеры\"."
tags:
  - "brauzery"
updatedAt: "2026-02-16"
---
# Браузеры

Раздел про то, как браузер загружает страницу, рендерит интерфейс, выполняет JS и где обычно теряется производительность.

## Что изучить в первую очередь

- [Полный путь загрузки сайта](/brauzery/polnyi-put-zagruzki-saita) — от URL до отрисовки.
- [Critical Render Path](/brauzery/crp/critical-render-path) — из каких шагов складывается первый рендер.
- [Типичные ошибки в CRP](/brauzery/crp/oshibki-critical-render-path) — что чаще всего замедляет первую отрисовку.
- [Reflow, Repaint и Layout Thrashing](/brauzery/reflow-repaint-i-layout-thrashing) — частые причины лагов в UI.
- [LCP, INP, TTI](/brauzery/lcp-inp-tti) — ключевые метрики пользовательского опыта.
- [Сети, HTTP и CORS](/brauzery/seti-http-i-cors) — базовые сетевые знания для фронтенда.
- [Сравнение HTTP версий](/brauzery/versii-http/sravnenie-http-versii) — что выбрать: HTTP/1.1, HTTP/2 или HTTP/3.

## Для практики

После базовых тем пройди материалы про workers, websockets, SSE, оптимизацию изображений и сборщик мусора.

---

<RelatedTopics
    :items="[
        { title: 'Critical Render Path', href: '/brauzery/crp/critical-render-path' },
        { title: 'Типичные ошибки в CRP', href: '/brauzery/crp/oshibki-critical-render-path' },
        { title: 'Forced Synchronous Layout и Long Tasks', href: '/brauzery/forced-synchronous-layout-i-long-tasks' },
    ]"
/>
