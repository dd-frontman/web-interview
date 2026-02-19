---
title: "Critical Render Path"
description: "Что такое Critical Render Path, из каких этапов он состоит и как ускорить первый показ контента."
tags:
  - "brauzery"
  - "critical-render-path"
updatedAt: "2026-02-17"
---
# Critical Render Path

**Critical Render Path** — это путь от ответа сервера до первого корректного кадра в браузере.

Цель оптимизации CRP:

- как можно быстрее показать полезный контент (LCP);
- как можно раньше сделать UI отзывчивым (INP/TBT).

## 1) Как устроен CRP по шагам

### 1.1 Сеть и первый байт

Браузер проходит DNS, устанавливает TCP/TLS и получает HTML (TTFB).

Что тормозит:

- медленный бэкенд;
- отсутствие CDN/кеша;
- слишком тяжёлый ответ.

### 1.2 HTML -> DOM

Браузер парсит HTML и строит DOM-дерево.

Что тормозит:

- синхронные `<script>` без `defer/async` (останавливают парсинг).

### 1.3 CSS -> CSSOM

Браузер загружает стили и строит CSSOM.

Важно: CSS обычно **render-blocking**. Пока критичные стили не готовы, отрисовка задерживается.

### 1.4 DOM + CSSOM -> Render Tree

DOM и CSSOM объединяются в Render Tree (дерево того, что реально рисуется).

### 1.5 Layout (Reflow)

Браузер считает размеры и позиции элементов.

Что дорого:

- сложный/глубокий DOM;
- частые изменения геометрии;
- forced sync layout.

### 1.6 Paint

Отрисовка текста, фонов, изображений, теней.

### 1.7 Composite

Слои компонуются на GPU в финальный кадр.

---

## 2) Где чаще всего ломают CRP

Типовые ошибки вынесены в отдельный материал, чтобы не дублировать разбор:

- [Типичные ошибки в Critical Render Path](/brauzery/crp/oshibki-critical-render-path)

Коротко: чаще всего рендер тормозят блокирующие ресурсы, тяжёлый layout/reflow, layout thrashing и длинные задачи в main thread.

---

## 3) Ключевые метрики

- **TTFB** — скорость ответа сервера.
- **FCP** — когда появился первый контент.
- **LCP** — когда отрисован крупнейший видимый элемент.
- **TBT** — сколько времени главный поток был заблокирован.
- **INP** — задержка отклика на действие пользователя.
- **CLS** — стабильность макета.

---

## 4) Практический чеклист перед релизом

1. Нет блокирующих скриптов без причины.
2. Критический CSS минимален.
3. Нет горячих точек с forced layout.
4. Анимации на `transform/opacity`.
5. У медиа есть размеры.
6. Нет длинных задач в ключевых пользовательских сценариях.

---

## 5) Официальные материалы

- MDN: Critical rendering path  
  https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path
- web.dev: Render-blocking resources  
  https://web.dev/articles/render-blocking-resources
- web.dev: Avoid large, complex layouts and layout thrashing  
  https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing
- web.dev: Optimize long tasks  
  https://web.dev/articles/optimize-long-tasks

---

<RelatedTopics
    :items="[
        { title: 'Типичные ошибки в Critical Render Path', href: '/brauzery/crp/oshibki-critical-render-path' },
        { title: 'Forced Synchronous Layout и Long Tasks', href: '/brauzery/forced-synchronous-layout-i-long-tasks' },
        { title: 'Reflow, Repaint и Layout Thrashing', href: '/brauzery/reflow-repaint-i-layout-thrashing' },
        { title: 'LCP, INP, TTI', href: '/brauzery/lcp-inp-tti' },
    ]"
/>
