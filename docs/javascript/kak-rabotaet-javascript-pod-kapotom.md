---
title: "Kak rabotaet JS"
description: "JavaScript исполняется не напрямую браузером \\\\\"как текст\\\\\", а через движок (engine) и runtime-среду."
tags:
  - "javascript"
  - "kak-rabotaet-javascript-pod-kapotom"
updatedAt: "2026-02-16"
---
## Как работает JavaScript под капотом

JavaScript исполняется не напрямую браузером "как текст", а через движок (engine) и runtime-среду.

Упрощенно путь такой:

1. Парсинг кода.
2. Построение внутреннего представления.
3. Исполнение в call stack.
4. Асинхронные задачи попадают в очереди и обрабатываются event loop.

## 1. Движок JavaScript

В браузерах это, например, V8 (Chrome), SpiderMonkey (Firefox), JavaScriptCore (Safari).

На уровне концепции движок работает с:

- `Call Stack` — где выполняются функции;
- `Heap` — где живут объекты/данные.

```ts
function a() {
    b();
}

function b() {
    console.log("done");
}

a();
```

Во время выполнения:

- `a` кладется в stack;
- внутри `a` кладется `b`;
- после `b` стек освобождается.

## 2. Runtime-среда в браузере

Сам движок не умеет напрямую делать `setTimeout`, DOM-операции, сеть.
Это дает браузерная среда (Web APIs):

- таймеры;
- Fetch/XHR;
- DOM-события;
- WebSocket и т.д.

## 3. Event loop и очереди

Когда стек пуст, event loop берет следующую задачу из очереди.

Важно различать:

- `Macrotask` (например, `setTimeout`, события UI);
- `Microtask` (`Promise.then`, `queueMicrotask`).

Микротаски выполняются раньше следующей макротаски.

```ts
console.log("1");

setTimeout(() => console.log("2 timeout"), 0);
Promise.resolve().then(() => console.log("3 microtask"));

console.log("4");
```

Результат:

```text
1
4
3 microtask
2 timeout
```

## 4. Где тут память и GC

Объекты в heap очищаются сборщиком мусора, когда они становятся недостижимыми.

Практический вывод:

- не держите лишние ссылки на большие объекты;
- очищайте подписки/таймеры;
- избегайте утечек через глобальные коллекции.

## Частые ошибки в понимании

1. "JavaScript многопоточный" — основной JS-поток обычно один.
2. "`setTimeout(..., 0)` выполнится сразу" — нет, только после текущего стека и микротасков.
3. "Promise — это отдельный поток" — нет, это механизм очереди микротасков.

## Официальные источники

- MDN: JavaScript execution model  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model
- MDN: JavaScript event loop  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop
- MDN: Microtask guide  
  https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide
- V8 docs  
  https://v8.dev/docs

---

<RelatedTopics
    :items="[
        { title: 'Event Loop', href: '/javascript/event-loop' },
        { title: 'Promise', href: '/javascript/promise' },
        { title: 'Garbage Collector', href: '/brauzery/garbage-collector/1-sborschik-musora' },
    ]"
/>
