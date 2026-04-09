---
title: "Object.seal в JavaScript"
description: "Что делает Object.seal, чем он отличается от freeze и preventExtensions, и в каких случаях этот режим действительно полезен."
tags:
  - "javascript"
  - "object-seal"
  - "object"
  - "immutability"
updatedAt: "2026-03-14"
---
# Object.seal в JavaScript

`Object.seal()` делает объект sealed: он перестаёт быть расширяемым, а все его собственные свойства становятся `configurable: false`.

Это означает:

- нельзя добавить новое свойство;
- нельзя удалить существующее свойство;
- нельзя переопределить descriptor;
- но можно менять значение writable-свойства.

## Базовый пример

```js
const user = {
  name: "Ann",
  role: "admin",
};

Object.seal(user);

user.name = "Bob"; // сработает
user.age = 30; // не добавится
delete user.role; // не удалится
```

`seal` полезен, когда форма объекта должна остаться фиксированной, но сами значения ещё можно обновлять.

## Чем seal отличается от freeze

Главное отличие простое:

- `seal` фиксирует структуру объекта;
- `freeze` фиксирует и структуру, и значения обычных writable-свойств.

```js
const sealed = Object.seal({ count: 1 });
sealed.count = 2; // ok

const frozen = Object.freeze({ count: 1 });
frozen.count = 2; // не изменится
```

## Когда seal уместен

- объект уже полностью сформирован, но его поля ещё будут обновляться;
- хочется запретить случайное "докидывание" полей в runtime;
- нужно стабилизировать shape объекта для слоя доменной модели или DTO-адаптера.

## На что обратить внимание

- `seal` тоже неглубокий;
- если свойство уже было `writable: false`, `seal` не сделает его writable;
- удалить sealed-свойство нельзя, потому что `configurable: false`.

## Проверка состояния

```js
const session = Object.seal({
  id: "42",
  status: "active",
});

console.log(Object.isSealed(session)); // true
console.log(Object.isExtensible(session)); // false
console.log(Object.isFrozen(session)); // false
```

## Практическое правило выбора

Если нужно запретить расширение объекта, но не блокировать обновление значений, чаще всего нужен именно `Object.seal`.

Если нужно полностью защитить объект от поверхностной мутации, выбирай `Object.freeze`.

<OfficialDocsLinks
    :links="[
        {
            title: 'MDN: Object.seal()',
            href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal',
        },
        {
            title: 'MDN: Object.isSealed()',
            href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed',
        },
    ]"
/>

---

<RelatedTopics
    :items="[
        { title: 'Object.freeze', href: '/javascript/object-freeze' },
        { title: 'Object.preventExtensions', href: '/javascript/object-freeze/object-prevent-extensions' },
        { title: 'Сравнение freeze, seal и preventExtensions', href: '/javascript/object-freeze/freeze-vs-seal-vs-prevent-extensions' },
    ]"
/>
