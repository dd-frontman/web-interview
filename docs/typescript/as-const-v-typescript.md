---
title: "as const TS"
description: "as const это специальное const-утверждение, которое делает литерал максимально \\\\\"узким\\\\\" и readonly."
tags:
  - "typescript"
  - "as-const-v-typescript"
updatedAt: "2026-02-16"
---
# as const TS

`as const` это специальное const-утверждение, которое делает литерал максимально "узким" и readonly.

Что происходит:

- строки/числа/boolean остаются литеральными типами (`"dark"`, `200`, `true`);
- свойства объекта становятся `readonly`;
- массив превращается в `readonly tuple`.

## Базовый пример

Без `as const`:

```ts
const theme = {
    mode: "dark",
};

// theme.mode -> string
```

С `as const`:

```ts
const theme = {
    mode: "dark",
} as const;

// theme.mode -> "dark"
// theme.mode нельзя переопределить
```

## `as const` для массивов

```ts
const roles = ["admin", "user", "guest"] as const;

// тип roles:
// readonly ["admin", "user", "guest"]
```

Теперь можно получить union-тип из массива:

```ts
type Role = (typeof roles)[number];
// "admin" | "user" | "guest"
```

Это частый паттерн для безопасных enum-подобных списков.

## `as const` + discriminated union

```ts
const loadingState = {
    status: "loading",
} as const;

const successState = {
    status: "success",
    data: [1, 2, 3],
} as const;
```

`status` остаётся литералом, поэтому `switch` по состояниям типизируется точнее.

## Отличие от `const` переменной

`const` фиксирует ссылку переменной, но не делает вложенные поля литеральными и readonly автоматически.

```ts
const user = { role: "admin" };
// role чаще всего будет string

const strictUser = { role: "admin" } as const;
// role -> "admin", поле readonly
```

## Когда `as const` особенно полезен

- таблицы маршрутов/конфиги;
- наборы строковых констант;
- action type в Redux-подобных сторах;
- мапы статусов (`loading/success/error`).

## Частые ошибки

- Ожидать, что `as const` работает в runtime. Это только для типов.
- Ставить `as const` слишком рано, когда объект должен быть изменяемым.
- Путать с `Readonly<T>`:
  `Readonly<T>` делает поля readonly на уровне типа, а `as const` ещё и сохраняет литералы.

## `as const` + `satisfies`

Часто лучший вариант для конфигов:

```ts
type ApiConfig = {
    baseUrl: string;
    retry: number;
};

const config = {
    baseUrl: "https://api.example.com",
    retry: 3,
} as const satisfies ApiConfig;
```

Так ты одновременно:

- проверяешь форму (`satisfies`);
- сохраняешь точные литеральные значения (`as const`).

Кратко: `as const` нужен, когда хочешь максимум точности и неизменяемости для литералов.

---

<RelatedTopics
    :items="[
        { title: 'assert в TypeScript', href: '/typescript/assert-v-typescript' },
        { title: 'TypeScript', href: '/typescript/index' },
        { title: 'satisfies в TypeScript', href: '/typescript/satisfies-v-typescript' },
    ]"
/>
