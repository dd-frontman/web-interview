# `assert` в TypeScript

`Assert` обычно используют в двух смыслах:

- runtime-проверка: если условие ложно, кидаем ошибку;
- type-level сужение: через `asserts` помогаем TypeScript понять более точный тип.

## Простой runtime assert

```ts
function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

const user = { name: "Alice" };
assert(user.name.length > 0, "Имя не должно быть пустым");
```

Такой assert останавливает код при неверном состоянии, но сам по себе не всегда сужает типы.

## Assertion function: `asserts condition`

```ts
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function printLength(value: string | null) {
  assert(value !== null, "value is null");
  console.log(value.length); // value -> string
}
```

После `assert(value !== null)` TypeScript знает, что `value` не `null`.

## Assertion function: `asserts value is Type`

```ts
type User = {
  id: number;
  name: string;
};

function assertIsUser(value: unknown): asserts value is User {
  if (typeof value !== "object" || value === null) {
    throw new Error("Not an object");
  }

  if (!("id" in value) || !("name" in value)) {
    throw new Error("Invalid user shape");
  }
}

function handleResponse(data: unknown) {
  assertIsUser(data);
  console.log(data.name); // data -> User
}
```

Этот вариант полезен на границе системы: API, localStorage, сообщения из `postMessage`.

## Встроенный `assert` в Node.js

Если проект на Node.js, можно использовать модуль `node:assert/strict`:

```ts
import assert from "node:assert/strict";

function divide(a: number, b: number) {
  assert(b !== 0, "b must not be zero");
  return a / b;
}
```

Важно: Node assert делает runtime-проверку. Для точного type narrowing удобнее свои assertion functions с `asserts`.

## Когда применять

- fail-fast проверки инвариантов;
- валидация входных данных на границе приложения;
- защита от `null/undefined` в местах, где значение обязано существовать.

## Частые ошибки

- Использовать `as` вместо реальной проверки.
- Проверять только `typeof value === "object"` и забывать `value !== null`.
- Писать assert без понятного сообщения ошибки.

Кратко: `assert` проверяет корректность состояния во время выполнения, а `asserts` дополнительно улучшает типобезопасность в TypeScript.

---

<RelatedTopics
	:items="[
		{ title: 'as const в TypeScript', href: '/typescript/as-const-v-typescript' },
		{ title: 'TypeScript', href: '/typescript/index' },
		{ title: 'satisfies в TypeScript', href: '/typescript/satisfies-v-typescript' },
	]"
/>

