---
title: "Сравнение Object.freeze, Object.seal и Object.preventExtensions"
description: "Сводное сравнение трёх режимов защиты объекта: что они запрещают, что разрешают и как быстро выбрать нужный вариант."
tags:
  - "javascript"
  - "object-freeze"
  - "object-seal"
  - "object-prevent-extensions"
  - "object"
updatedAt: "2026-03-14"
---
# Сравнение Object.freeze, Object.seal и Object.preventExtensions

Эти методы удобно воспринимать как три уровня жёсткости:

1. `Object.preventExtensions` — нельзя расширять объект;
2. `Object.seal` — нельзя расширять и нельзя удалять/переконфигурировать свойства;
3. `Object.freeze` — нельзя расширять, удалять и менять значения обычных writable-свойств.

## Сводная таблица

| Что происходит | `preventExtensions` | `seal` | `freeze` |
| --- | --- | --- | --- |
| Добавить новое свойство | Нет | Нет | Нет |
| Удалить существующее свойство | Да, если `configurable: true` | Нет | Нет |
| Изменить значение writable-свойства | Да | Да | Нет |
| Изменить descriptor | Частично возможно на старых свойствах, пока это допускает descriptor | Нет | Нет |
| Изменить прототип | Нет | Нет | Нет |
| `Object.isExtensible()` | `false` | `false` | `false` |
| `Object.isSealed()` | Обычно `false` | `true` | `true` |
| `Object.isFrozen()` | Обычно `false` | Обычно `false` | `true` |

## Как выбрать быстро

### Нужен только запрет на новые поля

Используй `Object.preventExtensions`.

Это подходит, когда форма объекта уже определена, но текущие свойства ещё должны свободно меняться и иногда удаляться.

### Нельзя добавлять и удалять, но значения менять можно

Используй `Object.seal`.

Это типичный вариант, когда ты хочешь зафиксировать структуру объекта, но не превращать его в полностью read-only.

### Нельзя ни расширять, ни переписывать текущие значения

Используй `Object.freeze`.

Это лучший встроенный вариант для поверхностной защиты от мутации.

## Мини-пример на одном объекте

```js
const nonExtensible = Object.preventExtensions({ count: 1 });
const sealed = Object.seal({ count: 1 });
const frozen = Object.freeze({ count: 1 });

nonExtensible.extra = true; // не добавится
sealed.count = 2; // сработает
frozen.count = 2; // не изменится
delete nonExtensible.count; // может сработать
delete sealed.count; // не сработает
```

## Частые ошибки

- думать, что `freeze` глубокий;
- путать запрет на расширение с полной неизменяемостью;
- считать, что `seal` делает объект read-only;
- забывать, что поведение записи в frozen/sealed объект в strict mode и non-strict mode различается по ошибкам.

## Практический вывод

В большинстве прикладных задач выбор такой:

- нужна минимальная защита от "лишних полей" — `preventExtensions`;
- нужна фиксированная структура объекта — `seal`;
- нужен read-only на уровне поверхности объекта — `freeze`.

<OfficialDocsLinks
    :links="[
        {
            title: 'MDN: Object.preventExtensions()',
            href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions',
        },
        {
            title: 'MDN: Object.seal()',
            href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal',
        },
        {
            title: 'MDN: Object.freeze()',
            href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze',
        },
    ]"
/>

---

<RelatedTopics
    :items="[
        { title: 'Object.freeze', href: '/javascript/object-freeze' },
        { title: 'Object.seal', href: '/javascript/object-freeze/object-seal' },
        { title: 'Object.preventExtensions', href: '/javascript/object-freeze/object-prevent-extensions' },
    ]"
/>
