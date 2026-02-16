| Вид функции                   | Мини-пример                                        | Когда используют                                        | Фишки                                                                                                                                                                                                                                                                                                                 |
| ----------------------------- | -------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Function declaration          | `function greet() {…}`                             | Любой обычный код                                       | Поднимается вверху файла; у неё есть собственные `this`, `arguments`, `prototype` [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)                                                                                                                      |
| Function expression           | `const sum = function(a,b){…}`                     | Когда нужно сохранить в переменной, передать как колбэк | Не поднимается; имя (чаще анонимна) остаётся внутри переменной [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)                                                                                                                                         |
| **Arrow** function            | `const sum = (a,b) => a+b`                         | Колбэки, методы класса, когда не нужен свой `this`      | Лексический `this`, нет `arguments`, нельзя `new` [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)[Medium](https://medium.com/%40ctrlaltmonique/lexical-this-how-this-works-in-arrow-functions-100239be6550) |
| **Метод** объекта (shorthand) | `const obj = { hi() {…} }`                         | Короткая запись «функции-свойства»                      | Читабельнее, имеет обычное `this` [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions)                                                                                                                                               |
| **Конструктор**               | `function Person(n){this.name=n}` + `new Person()` | Создать много однотипных объектов                       | Вызывают c `new`, получают собственный объект-`this` [programiz.com](https://www.programiz.com/javascript/constructor-function)                                                                                                                                                                |
| **IIFE**                      | `(function(){…})()`                                | Выполнить код сразу и спрятать переменные               | Изолирует область видимости, не оставляет глобальный мусор [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)[GeeksforGeeks](https://www.geeksforgeeks.org/javascript/immediately-invoked-function-expressions-iife-in-javascript/)                 |
| **Generator** (`function*`)   | `function* id(){ let i=0; while(true) yield i++ }` | Пауза/возобновление, итераторы                          | Возвращает объект-итератор с `next()`/`yield` [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function%2A)[GeeksforGeeks](https://www.geeksforgeeks.org/javascript/javascript-function-generator/)                          |
| **Async**-function            | `async function load(){ await fetch(url) }`        | Асинхронный код «как синхронный»                        | Всегда отдаёт `Promise`, можно `await` внутри [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)[MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Introducing) |
| **Getter / Setter**           | `get full(){…}` `set full(v){…}`                   | Выставить «умные» свойства в объекте                    | Вызываются как свойства, не как функции [w3schools.com](https://www.w3schools.com/js/js_object_accessors.asp)[programiz.com](https://www.programiz.com/javascript/getter-setter)                                                                                        |

### 1. Function declaration

Пишем ключевое `function` и имя; такую функцию можно вызвать даже **до** строки, где она написана — движок поднимает определение наверх (hoisting) [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions). Она получает свой `this`, массив‐псевдомассив `arguments` и может работать как конструктор через `new`.

### 2. Function expression

То же слово `function`, но внутри выражения — обычно присваиваем переменной или передаём как аргумент. Поднимается только переменная (`undefined`), поэтому вызвать раньше нельзя [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions).

### 3. Arrow function

Запись `=>` короче; главная особенность — **стрелка не создаёт свой `this`**, она «захватывает» его из кода вокруг, а значит не «теряет контекст» внутри колбэков класса/компонента [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)[Medium](https://medium.com/%40ctrlaltmonique/lexical-this-how-this-works-in-arrow-functions-100239be6550). У стрелки нет `arguments` и её нельзя использовать как конструктор.

### 4. Метод объекта (shorthand)

ES6 позволяет писать `foo() {…}` без слова `function` внутри литерала объекта или класса. Получается компактнее, но это всё тот же обычный метод с динамическим `this` [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions).

### 5. Конструктор (обычная функция + `new`)

Любая обычная функция, если вызвать её с `new`, превратится в конструктор: движок создаст новый объект, привяжет его к `this` и вернёт. Так строят старые «классы» без синтаксиса `class` [programiz.com](https://www.programiz.com/javascript/constructor-function).

### 6. IIFE — Immediately-Invoked Function Expression

Функция, обёрнутая в скобки и вызванная тут же: `(function(){…})();`. Такой паттерн создаёт собственную область видимости и не ломает глобальное пространство имён — удобно для одноразовой инициализации [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)[GeeksforGeeks](https://www.geeksforgeeks.org/javascript/immediately-invoked-function-expressions-iife-in-javascript/).

### 7. Generator (`function*`)

Ставим звёздочку: `function*`. При вызове вернётся генератор-объект. Каждый `yield` «приостанавливает» работу; продолжить можно через `next()`. Подходит для ленивых последовательностей и сложных асинхронных сценариев (например, redux-saga) [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function%2A)[GeeksforGeeks](https://www.geeksforgeeks.org/javascript/javascript-function-generator/).

### 8. Async-function

Ключевое слово `async` перед обычной или стрелочной функцией даёт возможность писать асинхронный код «линейно». Внутри разрешается `await`, а сам вызов всегда возвращает `Promise` — поэтому можно цепляться `.then()` или снова `await` снаружи [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)[MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Introducing).

### 9. Getter / Setter

Ключевые слова `get` и `set` внутри объекта позволяют объявить функции-аксессоры: снаружи они выглядят как обычные поля, но под капотом выполняют код при чтении или записи [w3schools.com](https://www.w3schools.com/js/js_object_accessors.asp)[programiz.com](https://www.programiz.com/javascript/getter-setter). Полезно, когда нужно вычислить значение «на лету» или валидировать присваивание.

---

> [!tip] Связанные темы
>
> - [Что такое замыкание](/javascript/chto-takoe-zamykanie)
> - [Event Bubbling](/javascript/event-bubbling)
> - [Event Loop](/javascript/event-loop)

