---
title: "Vue"
description: "Vue автоматически отслеживает изменения в данных и обновляет DOM:"
tags:
  - "vue"
updatedAt: "2026-02-16"
---
## 🎯 Что такое Vue.js

**Vue.js** — это прогрессивный JavaScript-фреймворк для создания пользовательских интерфейсов. Он прост в освоении, но мощный в использовании.

### **Ключевые особенности**

- **Реактивность**: автоматическое обновление UI при изменении данных
- **Компонентный подход**: переиспользуемые блоки интерфейса
- **Постепенное внедрение**: можно использовать частично в проекте
- **Отличная документация**: подробные примеры и руководства

## ⚡ Реактивность

- [Vue2 vs Vue3](/vue/vue2-vs-vue3) — ключевые различия и план миграции по официальной документации.

Vue автоматически отслеживает изменения в данных и обновляет DOM:

```javascript
const app = Vue.createApp({
	data() {
		return {
			message: "Hello Vue!",
			count: 0,
		};
	},
	methods: {
		increment() {
			this.count++;
		},
	},
});

app.mount("#app");
```

```html
<div id="app">
	<p>{{ message }}</p>
	<p>Счетчик: {{ count }}</p>
	<button @click="increment">+1</button>
</div>
```

## 🧩 Компоненты

### **Создание компонента**

```javascript
app.component("todo-item", {
	props: ["todo"],
	template: `
    <li>
      {{ todo.text }}
      <button @click="$emit('remove')">Удалить</button>
    </li>
  `,
});
```

### **Использование компонента**

```html
<todo-item
	v-for="item in todos"
	:key="item.id"
	:todo="item"
	@remove="removeTodo(item.id)"
></todo-item>
```

## 🎭 Директивы

### **v-if и v-show**

```html
<!-- v-if - условный рендеринг -->
<div v-if="isVisible">Показывается при true</div>

<!-- v-show - переключение видимости -->
<div v-show="isVisible">Скрывается/показывается</div>
```

### **v-for**

```html
<ul>
	<li v-for="(item, index) in items" :key="item.id">{{ index + 1 }}. {{ item.name }}</li>
</ul>
```

### **v-model**

```html
<input v-model="message" placeholder="Введите текст" />
<textarea v-model="description"></textarea>
<select v-model="selected">
	<option value="">Выберите опцию</option>
	<option value="a">Опция A</option>
	<option value="b">Опция B</option>
</select>
```

## 🔄 Жизненный цикл

```javascript
export default {
	beforeCreate() {
		// Компонент еще не создан
	},

	created() {
		// Компонент создан, данные доступны
		// API вызовы, инициализация
	},

	beforeMount() {
		// Компонент будет смонтирован в DOM
	},

	mounted() {
		// Компонент в DOM
		// Инициализация, API вызовы
	},

	beforeUpdate() {
		// Данные изменились, DOM обновится
	},

	updated() {
		// DOM обновлен
	},

	beforeUnmount() {
		// Компонент будет удален
		// Очистка таймеров, отписка от событий
	},

	unmounted() {
		// Компонент удален
	},
};
```

## 📊 Управление состоянием

### **Локальное состояние**

```javascript
export default {
	data() {
		return {
			count: 0,
			todos: [],
			filter: "all",
		};
	},

	computed: {
		filteredTodos() {
			if (this.filter === "all") return this.todos;
			return this.todos.filter((todo) => todo.completed === (this.filter === "completed"));
		},

		totalTodos() {
			return this.todos.length;
		},
	},

	methods: {
		addTodo(text) {
			this.todos.push({
				id: Date.now(),
				text,
				completed: false,
			});
		},

		toggleTodo(id) {
			const todo = this.todos.find((t) => t.id === id);
			if (todo) todo.completed = !todo.completed;
		},
	},
};
```

### **Глобальное состояние с Pinia**

- [Pinia](/vue/story/pinia) — база по store-паттернам в современном Vue.
- [Vuex](/vue/story/vuex) — когда нужен в legacy-проектах и как с ним работать.
- [Pinia vs Vuex](/vue/story/pinia-vs-vuex) — что выбрать для нового проекта и как мигрировать legacy.

```javascript
// store/todos.js
import { defineStore } from "pinia";

export const useTodosStore = defineStore("todos", {
	state: () => ({
		todos: [],
		filter: "all",
	}),

	getters: {
		filteredTodos: (state) => {
			if (state.filter === "all") return state.todos;
			return state.todos.filter((todo) => todo.completed === (state.filter === "completed"));
		},
	},

	actions: {
		addTodo(text) {
			this.todos.push({
				id: Date.now(),
				text,
				completed: false,
			});
		},

		toggleTodo(id) {
			const todo = this.todos.find((t) => t.id === id);
			if (todo) todo.completed = !todo.completed;
		},
	},
});
```

## 📝 Работа с формами

### **Простая форма**

```html
<form @submit.prevent="submitForm">
	<div>
		<label for="name">Имя:</label>
		<input id="name" v-model="form.name" type="text" required />
	</div>

	<div>
		<label for="email">Email:</label>
		<input id="email" v-model="form.email" type="email" required />
	</div>

	<div>
		<label for="message">Сообщение:</label>
		<textarea id="message" v-model="form.message" rows="4"></textarea>
	</div>

	<button type="submit">Отправить</button>
</form>
```

```javascript
export default {
	data() {
		return {
			form: {
				name: "",
				email: "",
				message: "",
			},
		};
	},

	methods: {
		submitForm() {
			console.log("Форма отправлена:", this.form);
			// API вызов
			this.resetForm();
		},

		resetForm() {
			this.form = {
				name: "",
				email: "",
				message: "",
			};
		},
	},
};
```

## 🎨 Стили и CSS

### **Scoped CSS**

```vue
<template>
	<div class="todo-item">
		<span :class="{ completed: todo.completed }">
			{{ todo.text }}
		</span>
	</div>
</template>

<style scoped>
.todo-item {
	padding: 10px;
	border-bottom: 1px solid #eee;
}

.completed {
	text-decoration: line-through;
	color: #999;
}
</style>
```

### **Динамические стили**

```html
<div
	:style="{
    backgroundColor: isActive ? '#4CAF50' : '#f44336',
    color: 'white',
    padding: '10px',
    borderRadius: '4px'
  }"
>
	{{ isActive ? 'Активно' : 'Неактивно' }}
</div>
```

## 🔧 Composition API

### **setup() функция**

```javascript
import { ref, computed, onMounted } from "vue";

export default {
	setup() {
		const count = ref(0);
		const todos = ref([]);

		const doubleCount = computed(() => count.value * 2);

		const increment = () => {
			count.value++;
		};

		const addTodo = (text) => {
			todos.value.push({
				id: Date.now(),
				text,
				completed: false,
			});
		};

		onMounted(() => {
			console.log("Компонент смонтирован");
		});

		return {
			count,
			todos,
			doubleCount,
			increment,
			addTodo,
		};
	},
};
```

### **Script Setup (Vue 3)**

```vue
<script setup>
import { ref, computed, onMounted } from "vue";

const count = ref(0);
const todos = ref([]);

const doubleCount = computed(() => count.value * 2);

const increment = () => {
	count.value++;
};

const addTodo = (text) => {
	todos.value.push({
		id: Date.now(),
		text,
		completed: false,
	});
};

onMounted(() => {
	console.log("Компонент смонтирован");
});
</script>

<template>
	<div>
		<p>Счетчик: {{ count }}</p>
		<p>Удвоенный: {{ doubleCount }}</p>
		<button @click="increment">+1</button>

		<ul>
			<li v-for="todo in todos" :key="todo.id">
				{{ todo.text }}
			</li>
		</ul>
	</div>
</template>
```

## 🛣️ Vue Router

### **Настройка маршрутов**

```javascript
import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import TodoList from "./views/TodoList.vue";

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/about",
		name: "About",
		component: About,
	},
	{
		path: "/todos",
		name: "TodoList",
		component: TodoList,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
```

### **Навигация**

```html
<template>
	<nav>
		<router-link to="/">Главная</router-link> | <router-link to="/about">О нас</router-link> |
		<router-link to="/todos">Задачи</router-link>
	</nav>

	<router-view />
</template>
```

```javascript
// Программная навигация
this.$router.push("/todos");
this.$router.push({ name: "TodoList" });
this.$router.push({ path: "/todos", query: { filter: "completed" } });
```

## 🧪 Тестирование

### **Unit тесты с Jest**

```javascript
import { mount } from "@vue/test-utils";
import TodoItem from "@/components/TodoItem.vue";

describe("TodoItem", () => {
	test("отображает текст задачи", () => {
		const wrapper = mount(TodoItem, {
			props: {
				todo: {
					id: 1,
					text: "Тестовая задача",
					completed: false,
				},
			},
		});

		expect(wrapper.text()).toContain("Тестовая задача");
	});

	test("эмитит событие при клике на кнопку", async () => {
		const wrapper = mount(TodoItem, {
			props: {
				todo: {
					id: 1,
					text: "Тестовая задача",
					completed: false,
				},
			},
		});

		await wrapper.find("button").trigger("click");

		expect(wrapper.emitted("remove")).toBeTruthy();
		expect(wrapper.emitted("remove")[0]).toEqual([1]);
	});
});
```

## 🚀 Оптимизация производительности

### **Ленивая загрузка компонентов**

```javascript
const TodoList = () => import("./views/TodoList.vue");
const About = () => import("./views/About.vue");
```

### **Мемоизация вычисляемых свойств**

```javascript
computed: {
  expensiveCalculation() {
    // Кэшируется до изменения зависимостей
    return this.items
      .filter(item => item.active)
      .map(item => item.value * 2)
      .reduce((sum, val) => sum + val, 0);
  },
},
```

### **v-memo для оптимизации рендеринга**

```html
<div v-for="item in items" :key="item.id" v-memo="[item.id, item.completed]">{{ item.text }}</div>
```

## 📚 Лучшие практики

- **Используй Composition API** для сложной логики
- **Разделяй компоненты** на логические части
- **Именуй события** в kebab-case: `@todo-removed`
- **Используй TypeScript** для больших проектов
- **Тестируй компоненты** изолированно
- **Оптимизируй рендеринг** с помощью `v-memo` и `v-once`

#vue #фреймворк #frontend #реактивность #компоненты

---

<RelatedTopics
	:items="[
		{ title: 'JavaScript', href: '/javascript/tipy-dannykh/tipy-dannykh' },
		{ title: 'React на примере Vue', href: '/react/react-na-primere-vue' },
		{ title: 'Таблица сравнения React vs Vue', href: '/react/tablitsa-sravneniya-react-vs-vue' },
		{ title: 'defineExpose()', href: '/vue/defineexpose' },
		{ title: 'provide и inject', href: '/vue/provide-i-inject' },
		{ title: 'Эффективное обучение', href: '/podgotovka-k-sobesedovaniyu' },
	]"
/>
