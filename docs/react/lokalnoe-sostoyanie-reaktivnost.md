---
title: "Шаг 1. Простое"
description: "Локальное состояние — это данные, которые принадлежат только одному компоненту и не нужны глобально."
tags:
  - "react"
  - "lokalnoe-sostoyanie-reaktivnost"
updatedAt: "2026-02-16"
---
# Шаг 1. Простое

**Что это?**

Локальное состояние — это данные, которые принадлежат только одному компоненту и не нужны глобально.

### React

```tsx
import { useState } from "react";

export function SimpleCounter() {
	const [count, setCount] = useState(0); // локальное состояние

	return (
		<div>
			<p>Count: {count}</p>
			<button onClick={() => setCount(count + 1)}>+1</button>
		</div>
	);
}
```

### Vue 3

```vue
<template>
	<div>
		<p>Count: {{ count }}</p>
		<button @click="count++">+1</button>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const count = ref(0); // локальное состояние
</script>
```

---

# 🔹 Шаг 2. Локальное состояние с зависимостями

Иногда одно значение зависит от другого.

### React

```tsx
import { useState } from "react";

export function FullName() {
	const [first, setFirst] = useState("John");
	const [last, setLast] = useState("Doe");

	return (
		<div>
			<p>
				Full name: {first} {last}
			</p>
			<input value={first} onChange={(e) => setFirst(e.target.value)} />
			<input value={last} onChange={(e) => setLast(e.target.value)} />
		</div>
	);
}
```

### Vue

```vue
<template>
	<div>
		<p>Full name: {{ first }} {{ last }}</p>
		<input v-model="first" />
		<input v-model="last" />
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const first = ref("John");
const last = ref("Doe");
</script>
```

---

# 🔹 Шаг 3. Сложные структуры (объекты)

Иногда проще хранить объект, чем десятки переменных.

### React

```tsx
import { useState } from "react";

type User = { name: string; age: number };

export function UserCard() {
	const [user, setUser] = useState<User>({ name: "Alice", age: 20 });

	const birthday = () => {
		// ⚠️ нельзя мутировать напрямую user.age++
		setUser((prev) => ({ ...prev, age: prev.age + 1 }));
	};

	return (
		<div>
			<p>
				{user.name}, {user.age} years old
			</p>
			<button onClick={birthday}>Happy Birthday!</button>
		</div>
	);
}
```

### Vue

```vue
<template>
	<div>
		<p>{{ user.name }}, {{ user.age }} years old</p>
		<button @click="user.age++">Happy Birthday!</button>
	</div>
</template>

<script setup lang="ts">
import { reactive } from "vue";

const user = reactive({ name: "Alice", age: 20 });
</script>
```

---

# 🔹 Шаг 4. Производные значения (computed / useMemo)

Часто нужно хранить не только данные, но и **значения, которые зависят от них**.

### React

```tsx
import { useState, useMemo } from "react";

export function ShoppingCart() {
	const [items, setItems] = useState([100, 200, 50]);

	const total = useMemo(() => items.reduce((a, b) => a + b, 0), [items]);

	return (
		<div>
			<p>Total: {total}</p>
			<button onClick={() => setItems([...items, 75])}>Add Item</button>
		</div>
	);
}
```

### Vue

```vue
<template>
	<div>
		<p>Total: {{ total }}</p>
		<button @click="items.push(75)">Add Item</button>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const items = ref([100, 200, 50]);
const total = computed(() => items.value.reduce((a, b) => a + b, 0));
</script>
```

---

# 🔹 Шаг 5. Синхронизация пропсов и локального состояния

Бывает, что локальное состояние **должно реагировать на изменения извне**.

### React

```tsx
import { useState, useEffect } from "react";

type Props = { initial: number };

export function Timer({ initial }: Props) {
	const [time, setTime] = useState(initial);

	useEffect(() => {
		setTime(initial); // если initial изменится у родителя — обновим локальное состояние
	}, [initial]);

	return <p>Time: {time}</p>;
}
```

### Vue

```vue
<template>
	<p>Time: {{ time }}</p>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{ initial: number }>();
const time = ref(props.initial);

watch(
	() => props.initial,
	(v) => (time.value = v)
);
</script>
```

---

# 🔹 Типичные ошибки

1. **React: прямая мутация state**

   ```tsx
   user.age++; // ❌ НЕ обновит UI
   ```

   Нужно: `setUser({...user, age: user.age + 1})`

2. **Vue: хранить всё в ref вместо reactive**

   ```ts
   const user = ref({ name: "Bob" }); // будет работать, но громоздко user.value.name
   ```

   Лучше: `const user = reactive({ name: "Bob" })`

3. **Слишком много состояний**
   - Плохо: 10 отдельных `useState` для полей формы.
   - Лучше: `useReducer` в React или `reactive` в Vue.

---

# 🔹 Задание

Сделай компонент **TodoList**:

- Локальное состояние — массив задач (`{id, text, done}`).
- Возможности:
  - Добавить задачу (input + кнопка).
  - Отметить задачу выполненной.
  - Удалить задачу.
- React: использовать `useState` (или `useReducer` для бонуса).
- Vue: использовать `reactive`.

---

# 🔹 Краткое резюме

- Локальное состояние — данные, которые принадлежат только одному компоненту.
- В React состояние **иммутабельно** → всегда создаём новые объекты.
- В Vue состояние **реактивно** → можно менять напрямую.
- Для derived values используем `useMemo` (React) и `computed` (Vue).
- Для синхронизации с пропсами — `useEffect` (React) и `watch` (Vue).

---

<RelatedTopics
	:items="[
		{ title: 'React', href: '/react/index' },
		{ title: 'JSX и его альтернативы', href: '/react/jsx-i-ego-alternativy' },
		{ title: 'Основные функции React', href: '/react/osnovnye-funktsii-react' },
	]"
/>
