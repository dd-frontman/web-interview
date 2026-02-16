# Type Guards в TypeScript: виды и примеры

`Type guard` (тайпгард) это проверка, после которой TypeScript понимает более точный тип значения.

Простыми словами: ты проверяешь условие в `if`, а компилятор сужает тип внутри ветки.

## Зачем нужны тайпгарды

Когда переменная имеет union-тип, например `string | number | null`, нельзя безопасно вызывать методы, пока тип не сужен.

```ts
function printLength(value: string | null) {
  // value.length; // Ошибка: value может быть null

  if (value !== null) {
    console.log(value.length); // OK
  }
}
```

## Основные виды type guards

## 1. `typeof`

Для примитивов: `string`, `number`, `boolean`, `bigint`, `symbol`, `undefined`, `function`, `object`.

```ts
function format(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase();
  }

  return value.toFixed(2);
}
```

Подводный камень: `typeof null === "object"`.

## 2. `instanceof`

Проверка, что объект создан через конкретный класс/конструктор.

```ts
class ApiError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

function handleError(error: Error | ApiError) {
  if (error instanceof ApiError) {
    console.log(error.code); // ApiError
  } else {
    console.log(error.message); // Error
  }
}
```

## 3. `in`

Проверка наличия свойства у объекта.

```ts
type Cat = { meow: () => void };
type Dog = { bark: () => void };

function makeSound(animal: Cat | Dog) {
  if ("meow" in animal) {
    animal.meow();
  } else {
    animal.bark();
  }
}
```

## 4. Сравнение по литералу (discriminated union)

Самый надёжный паттерн для сложных union-типов.

```ts
type LoadingState = { status: "loading" };
type SuccessState = { status: "success"; data: string[] };
type ErrorState = { status: "error"; message: string };

type RequestState = LoadingState | SuccessState | ErrorState;

function render(state: RequestState) {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return state.data.join(", ");
    case "error":
      return state.message;
  }
}
```

## 5. Проверка на `null`/`undefined` (truthiness и явные проверки)

```ts
function greet(name?: string) {
  if (!name) {
    return "Привет, гость";
  }

  return `Привет, ${name}`;
}
```

Лучше явные проверки, когда `""` или `0` это валидные значения.

```ts
function normalize(input: string | null) {
  if (input === null) {
    return "default";
  }

  return input.trim();
}
```

## 6. `Array.isArray`

```ts
function toArray(value: string | string[]) {
  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}
```

## Пользовательские тайпгарды (`value is Type`)

Когда встроенных проверок мало, делай свою функцию-предикат.

```ts
type User = {
  id: number;
  name: string;
};

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value
  );
}

function printUser(value: unknown) {
  if (isUser(value)) {
    console.log(value.name); // User
  }
}
```

## Assertion functions (`asserts value is Type`)

Используются, когда нужно бросить ошибку и дальше работать уже с узким типом.

```ts
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Expected string");
  }
}

function process(value: unknown) {
  assertIsString(value);
  console.log(value.toUpperCase()); // value -> string
}
```

## Частые ошибки

- Проверять только `typeof value === "object"` и забывать `value !== null`.
- Злоупотреблять `as`, обходя реальные проверки.
- Использовать `truthy`-проверку там, где `0`, `""`, `false` это валидные значения.
- Сложные union-типы без дискриминатора (`kind`/`type`/`status`), из-за чего код трудно сузить.

## Практический чеклист

- Для примитивов: `typeof`.
- Для классов: `instanceof`.
- Для структур данных: `in` или user-defined guard.
- Для сложных состояний UI/API: discriminated union по полю `status`.
- Для fail-fast сценариев: `asserts value is Type`.

---

<RelatedTopics
	:items="[
		{ title: 'as const в TypeScript', href: '/typescript/as-const-v-typescript' },
		{ title: 'assert в TypeScript', href: '/typescript/assert-v-typescript' },
		{ title: 'TypeScript', href: '/typescript/index' },
	]"
/>

