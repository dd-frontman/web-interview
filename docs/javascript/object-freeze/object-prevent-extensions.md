---
title: "Object.preventExtensions в JavaScript"
description: "Что делает Object.preventExtensions, чем он слабее seal и freeze, и где этот метод действительно подходит."
tags:
  - "javascript"
  - "object-prevent-extensions"
  - "object"
  - "immutability"
updatedAt: "2026-03-14"
---
# Object.preventExtensions в JavaScript

`Object.preventExtensions()` переводит объект в non-extensible состояние. Это самый мягкий встроенный режим защиты.

После него:

- нельзя добавить новые собственные свойства;
- нельзя поменять прототип;
- но существующие свойства можно менять и удалять, если descriptor это допускает.

## Базовый пример

```js
const settings = {
  theme: "dark",
  debug: true,
};

Object.preventExtensions(settings);

settings.theme = "light"; // сработает
delete settings.debug; // сработает
settings.locale = "ru"; // не добавится
```

## Чем preventExtensions отличается от seal

`preventExtensions` отвечает только за запрет расширения объекта. Он не делает свойства non-configurable.

То есть:

- `preventExtensions` не даёт добавлять новые поля;
- `seal` не даёт и добавлять, и удалять существующие;
- `freeze` дополнительно блокирует запись в обычные writable-свойства.

## Когда метод полезен

- нужен минимальный уровень защиты от случайного "докидывания" новых полей;
- объект должен сохранить текущий набор ключей, но значения ещё свободно меняются;
- хочется явно зафиксировать завершение этапа инициализации объекта.

## Когда лучше выбрать другой режим

- если нельзя допустить удаление свойств, нужен `Object.seal`;
- если нельзя допустить изменение значений, нужен `Object.freeze`;
- если нужна глубокая неизменяемость, встроенных методов недостаточно без рекурсии.

## Проверка состояния

```js
const options = Object.preventExtensions({
  retries: 3,
});

console.log(Object.isExtensible(options)); // false
console.log(Object.isSealed(options)); // false
console.log(Object.isFrozen(options)); // false
```

## Важный practical take

`Object.preventExtensions` редко используют как конечную цель. Чаще он важен как часть понимания градации:

- `preventExtensions` — запретить расширение;
- `seal` — зафиксировать структуру;
- `freeze` — зафиксировать структуру и поверхностные значения.

<OfficialDocsLinks
    :links="[
        {
            title: 'MDN: Object.preventExtensions()',
            href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions',
        },
        {
            title: 'MDN: Object.isExtensible()',
            href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible',
        },
    ]"
/>

---

<RelatedTopics
    :items="[
        { title: 'Object.freeze', href: '/javascript/object-freeze' },
        { title: 'Object.seal', href: '/javascript/object-freeze/object-seal' },
        { title: 'Сравнение freeze, seal и preventExtensions', href: '/javascript/object-freeze/freeze-vs-seal-vs-prevent-extensions' },
    ]"
/>
