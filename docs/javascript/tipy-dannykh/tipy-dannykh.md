1. String
2. Number (Целочесленные, с плавающей точкой. Диапозон: от -9 007 199 254 740 991 до 9 007 199 254 740 991)
   1. Infinity (Математическая бесконечность. Получить: 1/0, или задать его явно)
   2. NaN (Означает вычислительную ошибку 'string'/2)
3. BigInt
4. Boolean
5. Null - typeof(null) // Object - ошибка, допущеная создателем JS
6. Undefined
7. Symbol
8. Object - подтипы: Object, Array, Function, Date, Map, Set, Promise и др.

## [ ]Массив как объект

- За реализацией массивов лежит обычный объект, ключи — строки, но JS интерпретирует ключи `"0"`, `"1"` как числовые индексы, и автоматически управляет свойством `length` [DEV Community+11JavaScript.info+11Stack Overflow+11](https://javascript.info/array).
- В отличие от обычных объектов, массив:
  - Дополнительно наследует методы из `Array.prototype` (`push`, `map`, `filter`, и др.).
  - Автоматически обновляет `length`.
  - Содержит алгоритм определения индексных ключей [Stack Overflow](https://stackoverflow.com/questions/5048371/are-javascript-arrays-primitives-strings-objects).
  - Для проверки массива используют `Array.isArray()`, а не `typeof`

---

## 🛡️ Symbol

Примитивный тип, появившийся в ES6. Символы гарантированно **уникальны**, даже если у них одинаковое описание:

```
const s1 = Symbol("id");
const s2 = Symbol("id");
console.log(s1 === s2); // false
```

- Используются как **скрытые ключи** в объектах, предотвращая конфликты с другими свойствами
  - Полезны в создании **пользовательских условно-симметричных полей** и **метапрограммировании**
  - Есть встроенные «well‑known symbols», например:
    - `Symbol.iterator` — позволяет объекту быть итерируемым
    - `Symbol.toStringTag` — влияет на вывод в `Object.prototype.toString.call(...)`  
       [Stack Overflow+12Reddit+12Smashing Magazine+12](https://www.reddit.com/r/learnjavascript/comments/ot5dge/there_are_the_primitive_datatypes_in_js/)[Википедия](https://en.wikipedia.org/wiki/JavaScript_syntax)
- **Тип и проверка:**
  - `typeof Symbol("x") === "symbol"`

## 🔢 BigInt

Примитивный тип для работы с **любополными целыми числами большого размера**, выходящими за пределы `Number.MAX_SAFE_INTEGER` (~±9×10¹⁵) [Википедия+1Smashing Magazine+1](https://en.wikipedia.org/wiki/JavaScript_syntax)[Smashing Magazine](https://www.smashingmagazine.com/2019/07/essential-guide-javascript-newest-data-type-bigint/)

```
const a = 10n;
const b = BigInt("9007199254740993"); // безопасно
```

- **Особенности:**
  - `typeof a === "bigint"`
  - Поддерживаются арифметические операторы: `+ - * / % **`, побитовые (`>>`, `<<`, `&`, `|`, `^`, `~`) [MDN Web Docs+1Wikipedia+1](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cant_convert_x_to_BigInt)[MDN Web Docs+1www-igm.univ-mlv.fr+1](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
  - **Не совместим с `Number`** (операция смешения вызовет `TypeError`) [Smashing Magazine+4Stack Overflow+4www-igm.univ-mlv.fr+4](https://stackoverflow.com/questions/61583163/javascript-data-type-bigint-vs-number)
  - **В отличие от float**, BigInt представляет только целые числа
- **Статические методы:**
  - `BigInt.asIntN(width, value)`
  - `BigInt.asUintN(width, value)`
  - `BigInt.prototype.toString()`, `valueOf()`, `toLocaleString()` [MDN Web Docs+15MDN Web Docs+15Stack Overflow+15](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt/toString)[Stack Overflow+4MDN Web Docs+4LogRocket Blog+4](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cant_convert_x_to_BigInt)[LogRocket Blog](https://blog.logrocket.com/how-to-use-javascript-bigint/)
- **Когда применять?**
  - Когда нужны большие целые значения: криптография, финансовые расчёты, высокоточные счётчики, работа с ID и timestamp’ами [v8.dev](https://v8.dev/features/bigint)[LogRocket Blog](https://blog.logrocket.com/how-to-use-javascript-bigint/)

---

> [!tip] Связанные темы
>
> - [Object](/javascript/tipy-dannykh/object)
> - [Типы функций](/javascript/tipy-funktsii)
> - [Методы массивов](/javascript/metody-massivov)

