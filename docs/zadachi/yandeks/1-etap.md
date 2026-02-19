---
title: "1 этап"
description: "Подборка базовых задач первого этапа: промисы и работа со строками."
tags:
  - "zadachi"
  - "yandeks"
  - "etap"
updatedAt: "2026-02-17"
---
# Яндекс 1 этап

Ниже две типовые задачи с собеседований: работа с промисами и вариативными аргументами.

## Задача 1. Сумма результатов промисов

```js
/**
 * Реализовать функцию sumPromises, которая принимает
 * в качестве аргументов промисы и возвращает сумму
 * результатов их выполнения.
 *
 * Функция может принимать любое количество аргументов.
 * Можно использовать любые API процессы.
 */
function sumPromises(...promises) {
    return Promise.all(promises).then((results) => results.reduce((acc, number) => acc + number, 0));
}

// Пример использования:
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);

sumPromises(promise1, promise2).then(console.log); // 3
```

## Задача 2. Склейка строк через разделитель

```js
/**
 * Необходимо написать функцию strjoin,
 * которая склеивает строки через разделитель.
 */

function strjoin(separator, ...letters) {
    return letters.join(separator);
}

console.log(strjoin(".", "a", "b", "c")); // 'a.b.c'
console.log(strjoin("-", "d", "e", "f")); // 'd-e-f'
```

---

<RelatedTopics
    :items="[
        { title: 'Задачи', href: '/zadachi/index' },
        { title: 'Vue', href: '/vue' },
        { title: 'Реактивность во Vue3', href: '/vue/ref-and-reactive/reaktivnost-vo-vue3' },
    ]"
/>
