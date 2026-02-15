# 🏗️ Порождающие паттерны (подробно)

Порождающие паттерны нужны для того, чтобы **упорядочить создание объектов**:

- как их инициализировать,
- сколько экземпляров хранить,
- как управлять их жизненным циклом.

Разберём 5 основных: **Singleton, Factory Method, Abstract Factory, Builder, Prototype**.

---

## 1. Singleton (Одиночка)

### Идея

- Гарантировать, что у класса будет только один экземпляр.
- Удобно для глобальной конфигурации, подключения к БД, хранилища состояния.

### JS

```ts
class Config {
	private static instance: Config;
	private constructor(public readonly apiUrl: string) {}

	static getInstance() {
		if (!Config.instance) {
			Config.instance = new Config("https://api.example.com");
		}
		return Config.instance;
	}
}

const c1 = Config.getInstance();
const c2 = Config.getInstance();
console.log(c1 === c2); // true
```

### Vue

Pinia store работает как Singleton: при `useStore()` получаешь один и тот же объект.

```ts
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
	state: () => ({ name: "Guest" }),
});
```

### React

Context обеспечивает единый экземпляр для всего приложения.

```tsx
const ThemeContext = createContext(null);

export function ThemeProvider({ children }: any) {
	const [theme, setTheme] = useState("light");
	return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	return useContext(ThemeContext);
}
```

---

## 2. Factory Method (Фабричный метод)

### Идея

- У класса есть метод, который создаёт объект, но конкретный тип определяется в подклассе или по условию.
- Избавляет от жёсткой привязки `new Something()`.

### JS

```ts
abstract class Dialog {
	abstract createButton(): Button;
}

class HtmlDialog extends Dialog {
	createButton() {
		return new HtmlButton();
	}
}
class WindowsDialog extends Dialog {
	createButton() {
		return new WindowsButton();
	}
}
```

### Vue

Можно динамически подставлять компонент через `<component :is="...">`.

```vue
<template>
	<component :is="current" />
</template>

<script setup>
import HtmlButton from "./HtmlButton.vue";
import ImgButton from "./ImgButton.vue";

const current = Math.random() > 0.5 ? HtmlButton : ImgButton;
</script>
```

### React

Функция-фабрика, которая возвращает нужный компонент.

```tsx
function ButtonFactory({ type }: { type: "html" | "image" }) {
	if (type === "html") return <button>HTML</button>;
	if (type === "image") return <img src="btn.png" alt="btn" />;
	return null;
}
```

---

## 3. Abstract Factory (Абстрактная фабрика)

### Идея

- Создаём **семейство объектов**, которые должны работать вместе.
- Пример: светлая/тёмная тема → разные кнопки, инпуты, фон, но все согласованы.

### JS

```ts
interface Button {
	render(): void;
}
interface Checkbox {
	render(): void;
}

class DarkButton implements Button {
	render() {
		console.log("Dark btn");
	}
}
class DarkCheckbox implements Checkbox {
	render() {
		console.log("Dark check");
	}
}

class DarkUIFactory {
	createButton(): Button {
		return new DarkButton();
	}
	createCheckbox(): Checkbox {
		return new DarkCheckbox();
	}
}
```

### Vue

```vue
<script setup>
import DarkBtn from "./DarkBtn.vue";
import DarkInput from "./DarkInput.vue";

class DarkFactory {
	createButton() {
		return DarkBtn;
	}
	createInput() {
		return DarkInput;
	}
}

const factory = new DarkFactory();
</script>

<template>
	<component :is="factory.createButton()" />
	<component :is="factory.createInput()" />
</template>
```

### React

```tsx
function createFactory(theme: "dark" | "light") {
	return {
		Button: theme === "dark" ? DarkButton : LightButton,
		Input: theme === "dark" ? DarkInput : LightInput,
	};
}

const { Button, Input } = createFactory("dark");
```

---

## 4. Builder (Строитель)

### Идея

- Пошагово конструировать сложный объект.
- Удобно, если у объекта много опций (например, `User` с десятком свойств).

### JS

```ts
class User {
	constructor(
		public name?: string,
		public age?: number,
		public email?: string
	) {}
}

class UserBuilder {
	private u = new User();

	setName(name: string) {
		this.u.name = name;
		return this;
	}
	setAge(age: number) {
		this.u.age = age;
		return this;
	}
	setEmail(email: string) {
		this.u.email = email;
		return this;
	}

	build() {
		return this.u;
	}
}

const user = new UserBuilder().setName("Alice").setAge(25).build();
```

### Vue

Пошаговая форма → собираем объект по шагам.

```vue
<script setup>
import { reactive } from "vue";
const user = reactive({ name: "", age: 0, email: "" });
</script>

<template>
	<input v-model="user.name" />
	<input v-model="user.age" type="number" />
	<input v-model="user.email" />
</template>
```

### React

```tsx
export function UserForm() {
	const [user, setUser] = useState({ name: "", age: 0, email: "" });

	return (
		<>
			<input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
			<input value={user.age} onChange={(e) => setUser({ ...user, age: +e.target.value })} />
			<input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
		</>
	);
}
```

---

## 5. Prototype (Прототип)

### Идея

- Создаём новый объект на основе существующего (клонирование).
- Удобно для шаблонов/преднастроек.

### JS

```ts
const proto = { role: "user", active: true };

const u1 = Object.create(proto);
u1.name = "Alice";

const u2 = Object.create(proto);
u2.name = "Bob";

console.log(u1.role); // "user"
```

### Vue/React

Обычно это повторное использование одного компонента как шаблона.  
Пример: мы имеем базовый конфиг, клонируем его и подменяем часть свойств для разных страниц.

---

# 📑 Шпаргалка

| Паттерн              | Идея                                | Пример в JS                     | Пример во Vue              | Пример в React              |
| -------------------- | ----------------------------------- | ------------------------------- | -------------------------- | --------------------------- |
| **Singleton**        | Один объект во всей системе         | `Config.getInstance()`          | Pinia store                | React Context               |
| **Factory Method**   | Создание объекта по условию         | `buttonFactory("html")`         | `<component :is="..."/>`   | Фабричный компонент         |
| **Abstract Factory** | Семейство объектов                  | DarkUIFactory → btn+checkbox    | Фабрика UI-компонентов     | Фабрика компонентов по теме |
| **Builder**          | Пошаговое создание сложного объекта | `UserBuilder.setName().build()` | Пошаговая форма (reactive) | Пошаговая форма (useState)  |
| **Prototype**        | Клонирование                        | `Object.create(proto)`          | Клон базового конфига      | Копия props/state           |

---

## 🎯 Жизненные аналогии

- **Singleton** → паспорт: у тебя всегда один.
- **Factory Method** → автомастерская: выбираешь, какую деталь изготовить.
- **Abstract Factory** → IKEA: один стиль мебели для всей комнаты.
- **Builder** → конструктор LEGO: собираешь по шагам.
- **Prototype** → копировать документ и заполнить по-новому.
