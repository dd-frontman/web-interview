---
title: "Хук useState"
description: "useState — это хук для хранения и изменения локального состояния внутри функционального компонента."
tags:
  - "react"
  - "khuki"
  - "usestate"
updatedAt: "2026-02-16"
---
# Хук useState

## 1) Кратко, простыми словами

`useState` — это хук для хранения и изменения **локального состояния** внутри функционального компонента.  
Он возвращает массив из двух элементов:

1. **текущее значение state**,
2. **функцию для его обновления**.

Когда мы вызываем функцию обновления, React перерисовывает компонент с новым значением.

---

## 2) Подробно с теорией и нюансами

### Основы

```tsx
const [count, setCount] = useState(0);
```

- `count` — текущее значение состояния (здесь число).
- `setCount` — функция, которая изменяет значение.
- `0` — начальное значение.

### Как работает

- Состояние сохраняется между рендерами компонента.
- Вызов `setCount(newValue)` планирует **перерисовку**.
- React сравнивает новое значение со старым через `Object.is`. Если «равны» → рендера не будет.

### Нюансы

- Вызывать `useState` можно **только на верхнем уровне компонента** (не в if/for/while).
- Начальное значение можно задавать функцией: `useState(() => heavyCompute())` — выполнится один раз.
- Если новое значение зависит от старого → используем функциональный апдейтер:
  ```tsx
  setCount((prev) => prev + 1);
  ```
- Не мутируйте объекты/массивы напрямую:
  ```tsx
  // ❌ плохо
  user.name = "Bob";
  setUser(user);
  // ✅ хорошо
  setUser((prev) => ({ ...prev, name: "Bob" }));
  ```
- В React 18 обновления автоматически **батчатся** (несколько setState в одном тике → один ререндер).
- `setState` **асинхронен**: сразу после вызова значение ещё старое, новое будет в следующем рендере.

### Частые ошибки

1. **Старое значение после setState**  
   Решение: использовать функциональный апдейтер.
2. **Сброс состояния** при изменении `key` у компонента.
3. **Бесконечные ререндеры**: вызов `setState` прямо в теле компонента.
4. **Типизация в TS**: пустой массив без типа → `never[]`. Нужно `useState<Item[]>([])`.

---

## 3) Примеры (React + TypeScript)

### 3.1. Счётчик

```tsx
import { useState } from "react";

export function Counter() {
	const [count, setCount] = useState<number>(0);

	return (
		<div>
			<p>Счётчик: {count}</p>
			<button onClick={() => setCount((p) => p + 1)}>+1</button>
			<button onClick={() => setCount(0)}>Сброс</button>
		</div>
	);
}
```

### 3.2. Объект в state

```tsx
type User = { id: string; name: string };

export function Profile() {
	const [user, setUser] = useState<User>({ id: "1", name: "Alice" });

	return (
		<div>
			<p>{user.name}</p>
			<button onClick={() => setUser((prev) => ({ ...prev, name: "Bob" }))}>Переименовать</button>
		</div>
	);
}
```

### 3.3. Массив в state

```tsx
type Todo = { id: string; text: string };

export function TodoList() {
	const [todos, setTodos] = useState<Todo[]>([]);

	const add = (text: string) => setTodos((prev) => [...prev, { id: crypto.randomUUID(), text }]);

	return (
		<div>
			<button onClick={() => add("Новая задача")}>Добавить</button>
			<ul>
				{todos.map((t) => (
					<li key={t.id}>{t.text}</li>
				))}
			</ul>
		</div>
	);
}
```

---

## 4) Сравнение с Vue

| React                                             | Vue                                                       |
| ------------------------------------------------- | --------------------------------------------------------- |
| `useState(0)` → `[value, setValue]`               | `ref(0)` → `.value`                                       |
| Обновление через `setValue(newValue)`             | Обновление напрямую: `value.value++`                      |
| Иммутабельность обязательна (новый объект/массив) | Можно мутировать (`reactive`/`ref` следят за изменениями) |
| Несколько апдейтов батчатся (React 18+)           | Vue обновляет реактивность батчами через `nextTick`       |
| Состояние сбрасывается при изменении `key`        | То же самое: `:key` у компонента сбрасывает состояние     |

---

## 5) Чит-щит (таблица)

| Что                         | Как                              | Пример                            | Нюанс                               |
| --------------------------- | -------------------------------- | --------------------------------- | ----------------------------------- |
| Базовое использование       | `[val, setVal] = useState(init)` | `const [n, setN] = useState(0)`   | setN вызывает ререндер              |
| Зависимость от старого      | Функциональный апдейтер          | `setN(p => p + 1)`                | Избегает stale closure              |
| Ленивый init                | Передать функцию                 | `useState(() => heavyCalc())`     | Выполнится один раз                 |
| Объект/массив               | Создаём копию                    | `setArr(p => [...p, x])`          | Не мутируем напрямую                |
| Несколько вызовов           | Батчатся в один ререндер         | `setN(p => p+1); setN(p => p+1);` | React 18+                           |
| Чтение сразу после setState | Старое значение                  | `console.log(n)`                  | Новое доступно только после рендера |
| Reset state                 | Смена `key`                      | `<Comp key={id}/>`                | Новый инстанс компонента            |
| Типизация                   | Указываем явно                   | `useState<Item[]>([])`            | Иначе будет `never[]`               |

---

---

<RelatedTopics
	:items="[
		{ title: 'Основные хуки в React', href: '/react/khuki/osnovnye-khuki-v-react' },
		{ title: 'useContext', href: '/react/khuki/usecontext' },
		{ title: 'useEffect', href: '/react/khuki/useeffect' },
	]"
/>
