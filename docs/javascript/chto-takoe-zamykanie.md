---
title: "Chto takoe zamykanie"
description: "Замыкание (closure) — это функция, которая \\\\\"помнит\\\\\" переменные из внешней области видимости, даже если внешняя функция уже отработала."
tags:
  - "javascript"
  - "chto-takoe-zamykanie"
updatedAt: "2026-02-16"
---
## Что такое замыкание простыми словами

Замыкание (closure) — это функция, которая "помнит" переменные из внешней области видимости, даже если внешняя функция уже отработала.

Идея:

- функция создается
- вместе с ней сохраняется ссылка на lexical environment
- потом функцию вызывают в другом месте, а доступ к этим переменным остается

## Базовый пример

```js
function createCounter() {
    let count = 0;

    return function next() {
        count += 1;
        return count;
    };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

`createCounter()` завершилась, но `count` живет, потому что на него ссылается внутренняя функция.

## Где это полезно

### 1) Инкапсуляция состояния

```js
function createSecretStore() {
    let value = null;
    return {
        set(v) {
            value = v;
        },
        get() {
            return value;
        },
    };
}
```

Снаружи `value` напрямую недоступен, доступ только через методы.

### 2) Фабрики обработчиков

```js
function withPrefix(prefix) {
    return function log(message) {
        console.log(`[${prefix}] ${message}`);
    };
}

const apiLog = withPrefix("API");
apiLog("request started"); // [API] request started
```

## Частая ловушка: цикл и `var`

```js
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
}
// 3, 3, 3
```

Причина: у `var` одна функция-область, замыкания смотрят на одно и то же `i`.

Исправление через `let`:

```js
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
}
// 0, 1, 2
```

## Важный момент про память

Пока есть ссылка на функцию-замыкание, окружение может оставаться в памяти.  
Если держать тяжелые объекты в замыкании без необходимости, можно получить утечки.

<OfficialDocsLinks
    :links="[
        {
            title: 'MDN: Closures',
            href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures',
        },
    ]"
/>

---

<RelatedTopics
    :items="[
        { title: 'Типы функций', href: '/javascript/tipy-funktsii' },
        { title: 'Event Loop', href: '/javascript/event-loop' },
        { title: 'Promise', href: '/javascript/promise' },
    ]"
/>
