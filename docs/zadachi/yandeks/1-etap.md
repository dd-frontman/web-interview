```js
/**
 * Реализовать функцию sumPromises, которая принимает
 * в качестве аргументов промисы и возвращает сумму
 * результатов их выполнения.
 *
 * Функция может принимать любое количество аргументов.
 * Можно использовать любые API процессы.
 */
// Code here
function sumPromises(...promises) {
	return Promise.all(promises).then((results) => results.reduce((acc, number) => acc + number, 0));
}

// Пример использования:
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);

sumPromises(promise1, promise2).then(console.log); // 3
```

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

> [!tip] Связанные темы
>
> - [Задачи](/zadachi/index)
> - [Vue](/vue)
> - [Реактивность во Vue3](/vue/ref-and-reactive/reaktivnost-vo-vue3)

