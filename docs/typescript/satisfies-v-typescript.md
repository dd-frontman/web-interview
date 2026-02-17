---
title: "satisfies в TS"
description: "Satisfies проверяет, что значение соответствует нужному типу, но не \\\\\"перетирает\\\\\" исходный, более точный тип значения."
tags:
  - "typescript"
  - "satisfies-v-typescript"
updatedAt: "2026-02-16"
---
# satisfies в TS

`Satisfies` проверяет, что значение соответствует нужному типу, но не "перетирает" исходный, более точный тип значения.

Это удобно, когда нужно:

- проверить форму объекта;
- сохранить литеральные типы (`"dark"`, `3000`, `true`);
- не терять автодополнение и точность типов.

## Зачем нужен `satisfies`

Без `satisfies` часто используют аннотацию типа:

```ts
// Аннотация сужает знания о конкретных значениях
const config: Record<string, string | number> = {
	mode: "dark",
	port: 3000,
};

// Тип config.mode теперь string | number, а не "dark"
```

С `satisfies`:

```ts
const config = {
	mode: "dark",
	port: 3000,
} satisfies Record<string, string | number>;

// Проверка формы есть,
// но mode остаётся литералом "dark", port остаётся 3000
```

## `satisfies` vs `as` vs аннотация

### 1. Аннотация `: Type`

```ts
const user: { role: string } = { role: "admin" };
// user.role -> string
```

Плюс: строгая проверка структуры.  
Минус: можно потерять точность литеральных значений.

### 2. Приведение `as Type`

```ts
const user = { role: "admin" } as { role: string };
```

Плюс: быстро.  
Минус: можно "обмануть" компилятор, получить небезопасный код.

### 3. `satisfies Type`

```ts
const user = { role: "admin" } satisfies { role: string };
// Проверка есть, точность значения сохраняется
```

Обычно это лучший вариант для конфигов и таблиц соответствий.

## Практические примеры

## Пример 1: конфиг приложения

```ts
type AppConfig = {
	mode: "development" | "production";
	apiBaseUrl: string;
	retry: number;
};

const config = {
	mode: "development",
	apiBaseUrl: "https://api.example.com",
	retry: 3,
} satisfies AppConfig;
```

Если ошибиться в поле, TS сразу покажет проблему:

```ts
const badConfig = {
	mode: "dev", // Ошибка: нет в union
	apiBaseUrl: "https://api.example.com",
	retry: 3,
} satisfies AppConfig;
```

## Пример 2: словарь обработчиков

```ts
type EventName = "open" | "close";

type Handlers = Record<EventName, () => void>;

const handlers = {
	open: () => console.log("opened"),
	close: () => console.log("closed"),
} satisfies Handlers;
```

Плюс: нельзя забыть ключ и нельзя добавить мусорный ключ.

## Пример 3: валидация структуры API-мока

```ts
type ApiResponse = {
	status: "ok" | "error";
	data: { id: number; name: string };
};

const mockResponse = {
	status: "ok",
	data: { id: 1, name: "Alice" },
} satisfies ApiResponse;
```

## Частые ошибки

- Путать `satisfies` с runtime-проверкой.
  `satisfies` работает только на этапе компиляции.
- Использовать `as` там, где нужна проверка структуры.
- Ожидать, что `satisfies` изменит тип переменной под "широкий". Он наоборот сохраняет точность исходного литерала.

## Когда использовать

- Конфиги (`vite`, `eslint`, `routes`, `feature flags`).
- Объекты-мапы (`Record<Union, Value>`).
- Тестовые моки, где нужна проверка формы и точные литералы.

Кратко: `satisfies` = "проверь, что форма верная, но оставь мне точные типы".

---

<RelatedTopics
	:items="[
		{ title: 'as const в TypeScript', href: '/typescript/as-const-v-typescript' },
		{ title: 'assert в TypeScript', href: '/typescript/assert-v-typescript' },
		{ title: 'TypeScript', href: '/typescript/index' },
	]"
/>
