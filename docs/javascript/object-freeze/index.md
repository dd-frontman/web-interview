---
title: "Object.freeze в JavaScript"
description: "Как работает Object.freeze, почему он неглубокий, когда полезен и чем отличается от seal и preventExtensions."
tags:
  - "javascript"
  - "object-freeze"
  - "immutability"
  - "object"
updatedAt: "2026-03-14"
---
# Object.freeze в JavaScript

`Object.freeze()` переводит объект в максимально жёсткий режим среди встроенных способов защиты от случайной мутации.

После `freeze` для самого объекта:

- нельзя добавить новое свойство;
- нельзя удалить существующее свойство;
- нельзя поменять значение обычного writable-свойства;
- нельзя переопределить descriptor;
- нельзя изменить прототип.

## Базовый пример

```js
const user = {
  name: "Ann",
  role: "admin",
};

Object.freeze(user);

user.name = "Bob"; // не изменится
user.age = 30; // не добавится
delete user.role; // не удалится
```

В строгом режиме такие операции обычно заканчиваются `TypeError`. Без strict mode JavaScript часто просто молча игнорирует изменение.

## Что именно делает freeze под капотом

По смыслу `Object.freeze(obj)` сочетает две вещи:

1. делает объект non-extensible;
2. переводит все собственные свойства в `configurable: false`, а для обычных data properties ещё и в `writable: false`.

Это означает, что frozen-объект нельзя "достроить" и нельзя случайно переписать уже существующие поля.

## Freeze неглубокий

Это самый частый источник ошибок. `freeze` защищает только сам объект, но не вложенные объекты и массивы.

```js
const config = {
  api: {
    baseUrl: "/api",
  },
  features: ["search"],
};

Object.freeze(config);

config.api.baseUrl = "/v2"; // изменится
config.features.push("chat"); // тоже сработает
```

Если важна глубокая неизменяемость, нужно либо рекурсивно замораживать вложенные структуры, либо переходить к дисциплине immutable-update на уровне архитектуры.

## Пример deepFreeze

```js
function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== "object" || seen.has(value)) {
    return value;
  }

  seen.add(value);

  for (const key of Reflect.ownKeys(value)) {
    deepFreeze(value[key], seen);
  }

  return Object.freeze(value);
}

const settings = deepFreeze({
  theme: { mode: "dark" },
  flags: ["a", "b"],
});
```

`WeakSet` нужен, чтобы корректно переживать циклические ссылки и не уходить в бесконечную рекурсию.

## Где freeze полезен на практике

- конфиги приложения, которые не должны меняться после инициализации;
- enum-like объекты с константами;
- публичные API-объекты, которые нужно защитить от случайной мутации;
- dev-only проверки инвариантов в state management и архитектурных слоях.

## Где freeze не решает задачу

- когда нужно защитить вложенные структуры без рекурсии;
- когда объект должен оставаться расширяемым;
- когда требуется не защита, а просто дисциплина обновлений через копирование;
- когда важна производительность и глубокая заморозка больших графов объектов слишком дорогая.

## Проверка состояния объекта

Для frozen-объекта можно сделать явную проверку:

```js
const payload = Object.freeze({ ok: true });

console.log(Object.isFrozen(payload)); // true
console.log(Object.isSealed(payload)); // true
console.log(Object.isExtensible(payload)); // false
```

## Что читать дальше

Если нужен менее жёсткий режим, смотри соседние методы:

- [Object.seal](/javascript/object-freeze/object-seal) — запрещает добавление и удаление, но оставляет возможность менять writable-значения;
- [Object.preventExtensions](/javascript/object-freeze/object-prevent-extensions) — только запрещает расширение объекта;
- [Сравнение freeze, seal и preventExtensions](/javascript/object-freeze/freeze-vs-seal-vs-prevent-extensions) — сводная таблица и правила выбора.

<OfficialDocsLinks
    :links="[
        {
            title: 'MDN: Object.freeze()',
            href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze',
        },
        {
            title: 'MDN: Object.isFrozen()',
            href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen',
        },
    ]"
/>

---

<RelatedTopics
    :items="[
        { title: 'Object.seal', href: '/javascript/object-freeze/object-seal' },
        { title: 'Object.preventExtensions', href: '/javascript/object-freeze/object-prevent-extensions' },
        { title: 'Сравнение freeze, seal и preventExtensions', href: '/javascript/object-freeze/freeze-vs-seal-vs-prevent-extensions' },
    ]"
/>
