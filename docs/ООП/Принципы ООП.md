# 🔑 Принципы ООП с примерами (JS, Vue, React)

ООП (объектно-ориентированное программирование) держится на **4 основных принципах**:  
**Инкапсуляция, Наследование, Полиморфизм, Абстракция**.  
Разберём каждый простыми словами и покажем примеры в **классах JS, Vue и React**.

---

## 1. Инкапсуляция

**Смысл:** прятать детали реализации и давать доступ только к нужным данным/методам.

### Классы JS

```ts
class User {
	#password: string; // приватное поле

	constructor(
		public name: string,
		password: string
	) {
		this.#password = password;
	}

	checkPassword(pwd: string) {
		return this.#password === pwd;
	}
}

const u = new User("Alice", "1234");
console.log(u.name); // "Alice"
console.log(u.checkPassword("1234")); // true
// console.log(u.#password); // ❌ Ошибка — приватное поле
```

### Vue

```vue
<script setup lang="ts">
import { ref } from "vue";

const password = ref("1234"); // локальное состояние (инкапсулировано)
function checkPassword(pwd: string) {
	return pwd === password.value;
}
</script>

<template>
	<div>
		<p>Пароль скрыт внутри компонента</p>
		<button @click="checkPassword('1234')">Проверить</button>
	</div>
</template>
```

### React

```tsx
import { useState } from "react";

export function UserComponent() {
	const [password] = useState("1234"); // скрыто внутри компонента

	function checkPassword(pwd: string) {
		return pwd === password;
	}

	return <button onClick={() => alert(checkPassword("1234"))}>Проверить</button>;
}
```

---

## 2. Наследование

**Смысл:** один класс/компонент может расширять другой.

### Классы JS

```ts
class Animal {
	speak() {
		console.log("Животное издаёт звук");
	}
}
class Dog extends Animal {
	speak() {
		console.log("Собака лает");
	}
}

new Dog().speak(); // "Собака лает"
```

### Vue (через композицию/миксины)

```ts
// useAnimal.ts (composition function)
import { ref } from "vue";
export function useAnimal() {
  const sound = ref("звук");
  const speak = () => console.log(sound.value);
  return { sound, speak };
}

// Dog.vue
<script setup lang="ts">
import { useAnimal } from "./useAnimal";
const { speak, sound } = useAnimal();
sound.value = "Гав-гав!";
</script>

<template>
  <button @click="speak">Собака</button>
</template>
```

### React (через HOC или composition)

```tsx
function withAnimal(Component: any) {
	return function Wrapper() {
		const sound = "Гав-гав!";
		return <Component sound={sound} />;
	};
}

function Dog({ sound }: { sound: string }) {
	return <button onClick={() => console.log(sound)}>Собака</button>;
}

export default withAnimal(Dog);
```

---

## 3. Полиморфизм

**Смысл:** один интерфейс → разные реализации.

### Классы JS

```ts
class Animal {
	speak() {
		console.log("звук");
	}
}
class Dog extends Animal {
	speak() {
		console.log("Гав");
	}
}
class Cat extends Animal {
	speak() {
		console.log("Мяу");
	}
}

const animals: Animal[] = [new Dog(), new Cat()];
animals.forEach((a) => a.speak());
// "Гав", "Мяу"
```

### Vue

```vue
<template>
	<component :is="current" />
</template>

<script setup lang="ts">
import Dog from "./Dog.vue";
import Cat from "./Cat.vue";

const current = Math.random() > 0.5 ? Dog : Cat;
</script>
```

### React

```tsx
function Dog() {
	return <p>Гав</p>;
}
function Cat() {
	return <p>Мяу</p>;
}

export function Animal({ type }: { type: "dog" | "cat" }) {
	const Component = type === "dog" ? Dog : Cat;
	return <Component />;
}
```

---

## 4. Абстракция

**Смысл:** выделять только важное, скрывать лишние детали.

### Классы JS

```ts
abstract class Shape {
	abstract area(): number; // метод без реализации
}

class Circle extends Shape {
	constructor(private r: number) {
		super();
	}
	area() {
		return Math.PI * this.r ** 2;
	}
}
```

### Vue

```ts
// useShape.ts — абстракция для фигур
export function useShapeArea(shape: "circle" | "square", size: number) {
	if (shape === "circle") return Math.PI * size ** 2;
	if (shape === "square") return size * size;
}
```

### React

```tsx
type ShapeProps = { shape: "circle" | "square"; size: number };

export function ShapeArea({ shape, size }: ShapeProps) {
	if (shape === "circle") return <p>{Math.PI * size ** 2}</p>;
	if (shape === "square") return <p>{size * size}</p>;
	return null;
}
```

---

# 📑 Шпаргалка

| Принцип      | Определение                         | JS-класс                   | Vue                               | React                        |
| ------------ | ----------------------------------- | -------------------------- | --------------------------------- | ---------------------------- |
| Инкапсуляция | Скрытие деталей реализации          | Приватные поля `#`         | Состояние `ref` внутри компонента | `useState` внутри компонента |
| Наследование | Расширение логики                   | `class Dog extends Animal` | Composition API / mixins          | HOC / composition            |
| Полиморфизм  | Разные реализации одного интерфейса | Разные классы с `speak()`  | `<component :is="..."/>`          | Выбор компонента по props    |
| Абстракция   | Выделение важного, сокрытие деталей | `abstract class Shape`     | Общие `composables`               | Компонент с `props`          |
