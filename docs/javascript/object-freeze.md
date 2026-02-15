> [!tip] Связанные темы
>
> - Типы данных / Object
> - Что такое замыкание
> - TypeScript: утилитарные типы

## Что делает `Object.freeze()`

`Object.freeze(obj)` "замораживает" объект:

- нельзя добавлять новые свойства
- нельзя удалять свойства
- нельзя менять существующие свойства
- нельзя менять `enumerable/configurable/writable`

```js
const user = { name: "Ann", role: "admin" };
Object.freeze(user);

user.name = "Bob"; // не изменится (в strict mode будет TypeError)
user.age = 30; // не добавится
delete user.role; // не удалится
```

## Важно: freeze неглубокий

```js
const config = {
	api: { baseUrl: "/api" },
};

Object.freeze(config);
config.api.baseUrl = "/v2"; // изменится, потому что вложенный объект не frozen
```

Чтобы заморозить глубоко, нужна рекурсия.

## Пример `deepFreeze`

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

`WeakSet` нужен, чтобы не уйти в бесконечную рекурсию на циклических ссылках.

## Сравнение с похожими методами

- `Object.preventExtensions(obj)`  
  нельзя добавлять новые свойства, но можно менять и удалять существующие.

- `Object.seal(obj)`  
  нельзя добавлять/удалять, но можно менять значения writable-свойств.

- `Object.freeze(obj)`  
  самый строгий режим.

## Когда применять

- конфиги приложения
- enum-like объекты
- защиту от случайной мутации
- immutable-подходы в архитектуре

## Официальная документация

- MDN: `Object.freeze()`  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
