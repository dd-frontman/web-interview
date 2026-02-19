---
title: "React примере Vue"
description: "2. Замени v-if на условный рендеринг"
tags:
  - "react"
  - "react-na-primere-vue"
updatedAt: "2026-02-16"
---
# React примере Vue

## 🎯 Основные идеи

### **Реактивность**

**Vue**: автоматическая реактивность через `data()` и `reactive()`
**React**: ручное управление через `useState` и `useEffect`

### **Компоненты**

**Vue**: Single File Components (`.vue` файлы)
**React**: JSX функции или классы

### **Синтаксис**

**Vue**: HTML-подобный шаблон с директивами
**React**: JavaScript с JSX

## 🔄 Реактивность

### **Vue:**

```javascript
// Автоматическая реактивность
const app = Vue.createApp({
    data() {
        return {
            message: "Hello Vue!",
        };
    },
});

// Или Composition API
import { ref, reactive } from "vue";

const message = ref("Hello Vue!");
const user = reactive({
    name: "John",
    age: 30,
});
```

### **React:**

```javascript
import { useState } from "react";

function App() {
    const [message, setMessage] = useState("Hello React!");
    const [user, setUser] = useState({
        name: "John",
        age: 30,
    });

    const updateMessage = (newMessage) => {
        setMessage(newMessage);
    };

    const updateUser = (updates) => {
        setUser((prev) => ({ ...prev, ...updates }));
    };
}
```

## 🧩 Компоненты

### **Vue:**

```vue
<template>
    <div class="todo-item">
        <span :class="{ completed: todo.completed }">
            {{ todo.text }}
        </span>
        <button @click="$emit('remove')">Удалить</button>
    </div>
</template>

<script>
export default {
    props: ["todo"],
    emits: ["remove"],
};
</script>

<style scoped>
.completed {
    text-decoration: line-through;
}
</style>
```

### **React:**

```jsx
function TodoItem({ todo, onRemove }) {
    return (
        <div className="todo-item">
            <span className={todo.completed ? "completed" : ""}>{todo.text}</span>
            <button onClick={onRemove}>Удалить</button>
        </div>
    );
}

const styles = {
    completed: {
        textDecoration: "line-through",
    },
};
```

## 📊 Состояние

### **Vue:**

```javascript
export default {
    data() {
        return {
            count: 0,
            todos: [],
        };
    },

    computed: {
        totalTodos() {
            return this.todos.length;
        },

        completedTodos() {
            return this.todos.filter((todo) => todo.completed);
        },
    },

    methods: {
        increment() {
            this.count++;
        },

        addTodo(text) {
            this.todos.push({
                id: Date.now(),
                text,
                completed: false,
            });
        },
    },
};
```

### **React:**

```javascript
import { useState, useMemo, useCallback } from "react";

function TodoApp() {
    const [count, setCount] = useState(0);
    const [todos, setTodos] = useState([]);

    const totalTodos = useMemo(() => todos.length, [todos]);
    const completedTodos = useMemo(() => todos.filter((todo) => todo.completed), [todos]);

    const increment = useCallback(() => {
        setCount((prev) => prev + 1);
    }, []);

    const addTodo = useCallback((text) => {
        setTodos((prev) => [
            ...prev,
            {
                id: Date.now(),
                text,
                completed: false,
            },
        ]);
    }, []);

    return (
        <div>
            <p>Счетчик: {count}</p>
            <button onClick={increment}>+1</button>

            <p>Всего задач: {totalTodos}</p>
            <p>Выполнено: {completedTodos.length}</p>
        </div>
    );
}
```

## 🔄 Жизненный цикл

### **Vue:**

```javascript
export default {
    mounted() {
        console.log("Компонент в DOM");
        // Инициализация, API вызовы
    },

    beforeUnmount() {
        console.log("Компонент будет удален");
        // Очистка таймеров, отписка от событий
    },

    // Composition API
    setup() {
        onMounted(() => {
            console.log("Компонент в DOM");
        });

        onUnmounted(() => {
            console.log("Компонент удален");
        });
    },
};
```

### **React:**

```javascript
import { useEffect } from "react";

function MyComponent() {
    useEffect(() => {
        console.log("Компонент в DOM");

        // Очистка при размонтировании
        return () => {
            console.log("Компонент будет удален");
        };
    }, []); // Пустой массив = только при монтировании

    useEffect(() => {
        console.log("Компонент обновился");
    }); // Без массива = при каждом обновлении

    useEffect(() => {
        console.log("count изменился");
    }, [count]); // При изменении count
}
```

## 🎨 Стили

### **Vue:**

```vue
<template>
    <div class="container">
        <h1 class="title">Заголовок</h1>
    </div>
</template>

<style scoped>
.container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.title {
    color: #333;
    font-size: 24px;
}
</style>
```

### **React:**

```jsx
// CSS модули
import styles from "./MyComponent.module.css";

function MyComponent() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Заголовок</h1>
        </div>
    );
}

// Inline стили
function MyComponent() {
    const containerStyle = {
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
    };

    const titleStyle = {
        color: "#333",
        fontSize: "24px",
    };

    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>Заголовок</h1>
        </div>
    );
}
```

## 🎭 Условный рендеринг

### **Vue:**

```vue
<template>
    <div>
        <div v-if="isVisible">Показывается при true</div>
        <div v-else-if="isLoading">Загрузка...</div>
        <div v-else>Показывается при false</div>

        <div v-show="isVisible">Скрывается/показывается</div>
    </div>
</template>
```

### **React:**

```jsx
function MyComponent({ isVisible, isLoading }) {
    return (
        <div>
            {isVisible ? (
                <div>Показывается при true</div>
            ) : isLoading ? (
                <div>Загрузка...</div>
            ) : (
                <div>Показывается при false</div>
            )}

            <div style={{ display: isVisible ? "block" : "none" }}>Скрывается/показывается</div>
        </div>
    );
}
```

## 🔁 Списки

### **Vue:**

```vue
<template>
    <ul>
        <li v-for="(item, index) in items" :key="item.id">{{ index + 1 }}. {{ item.name }}</li>
    </ul>
</template>
```

### **React:**

```jsx
function ItemList({ items }) {
    return (
        <ul>
            {items.map((item, index) => (
                <li key={item.id}>
                    {index + 1}. {item.name}
                </li>
            ))}
        </ul>
    );
}
```

## 🎯 События

### **Vue:**

```vue
<template>
    <button @click="handleClick">Клик</button>
    <input @input="handleInput" @keyup.enter="handleEnter" />
    <form @submit.prevent="handleSubmit">
        <button type="submit">Отправить</button>
    </form>
</template>

<script>
export default {
    methods: {
        handleClick() {
            console.log("Клик!");
        },

        handleInput(event) {
            console.log("Ввод:", event.target.value);
        },

        handleEnter() {
            console.log("Нажат Enter");
        },

        handleSubmit() {
            console.log("Форма отправлена");
        },
    },
};
</script>
```

### **React:**

```jsx
function MyComponent() {
    const handleClick = () => {
        console.log("Клик!");
    };

    const handleInput = (event) => {
        console.log("Ввод:", event.target.value);
    };

    const handleKeyUp = (event) => {
        if (event.key === "Enter") {
            console.log("Нажат Enter");
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Форма отправлена");
    };

    return (
        <div>
            <button onClick={handleClick}>Клик</button>
            <input onInput={handleInput} onKeyUp={handleKeyUp} />
            <form onSubmit={handleSubmit}>
                <button type="submit">Отправить</button>
            </form>
        </div>
    );
}
```

## 🏗️ Практические примеры

### **Todo приложение**

#### **Vue:**

```vue
<template>
    <div class="todo-app">
        <h1>Список задач</h1>

        <div class="add-todo">
            <input v-model="newTodo" @keyup.enter="addTodo" placeholder="Новая задача" />
            <button @click="addTodo">Добавить</button>
        </div>

        <ul class="todo-list">
            <li v-for="todo in todos" :key="todo.id" class="todo-item">
                <input type="checkbox" v-model="todo.completed" />
                <span :class="{ completed: todo.completed }">
                    {{ todo.text }}
                </span>
                <button @click="removeTodo(todo.id)">Удалить</button>
            </li>
        </ul>

        <div class="stats">Всего: {{ todos.length }} | Выполнено: {{ completedCount }}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            newTodo: "",
            todos: [],
        };
    },

    computed: {
        completedCount() {
            return this.todos.filter((todo) => todo.completed).length;
        },
    },

    methods: {
        addTodo() {
            if (this.newTodo.trim()) {
                this.todos.push({
                    id: Date.now(),
                    text: this.newTodo.trim(),
                    completed: false,
                });
                this.newTodo = "";
            }
        },

        removeTodo(id) {
            this.todos = this.todos.filter((todo) => todo.id !== id);
        },
    },
};
</script>
```

#### **React:**

```jsx
import { useState, useMemo } from "react";

function TodoApp() {
    const [newTodo, setNewTodo] = useState("");
    const [todos, setTodos] = useState([]);

    const completedCount = useMemo(() => todos.filter((todo) => todo.completed).length, [todos]);

    const addTodo = () => {
        if (newTodo.trim()) {
            setTodos((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    text: newTodo.trim(),
                    completed: false,
                },
            ]);
            setNewTodo("");
        }
    };

    const removeTodo = (id) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    const toggleTodo = (id) => {
        setTodos((prev) =>
            prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
        );
    };

    return (
        <div className="todo-app">
            <h1>Список задач</h1>

            <div className="add-todo">
                <input
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyUp={(e) => e.key === "Enter" && addTodo()}
                    placeholder="Новая задача"
                />
                <button onClick={addTodo}>Добавить</button>
            </div>

            <ul className="todo-list">
                {todos.map((todo) => (
                    <li key={todo.id} className="todo-item">
                        <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
                        <span className={todo.completed ? "completed" : ""}>{todo.text}</span>
                        <button onClick={() => removeTodo(todo.id)}>Удалить</button>
                    </li>
                ))}
            </ul>

            <div className="stats">
                Всего: {todos.length} | Выполнено: {completedCount}
            </div>
        </div>
    );
}
```

## 🎯 Когда использовать что

### **Выбирай Vue если:**

- Нужен быстрый старт проекта
- Команда знает HTML/CSS лучше JavaScript
- Хочешь меньше boilerplate кода
- Нужна встроенная система стилей

### **Выбирай React если:**

- Команда хорошо знает JavaScript
- Нужна гибкость и контроль
- Проект большой и сложный
- Используешь экосистему React (Next.js, Gatsby)

## 🔄 Миграция между фреймворками

### **Vue → React:**

1. Изучи JSX синтаксис
2. Замени `v-if` на условный рендеринг
3. Замени `v-for` на `map()`
4. Замени `@click` на `onClick`
5. Замени `v-model` на `value` + `onChange`

### **React → Vue:**

1. Изучи директивы Vue
2. Замени условный рендеринг на `v-if`
3. Замени `map()` на `v-for`
4. Замени `onClick` на `@click`
5. Замени `value` + `onChange` на `v-model`

## 💡 Советы по изучению

- **Начни с одного фреймворка** и изучи его хорошо
- **Практикуйся** на реальных проектах
- **Изучай экосистему** (Vue Router, Pinia vs React Router, Redux)
- **Сравнивай подходы** для лучшего понимания
- **Не бойся переключаться** между фреймворками

#react #vue #сравнение #фреймворки #frontend

---

<RelatedTopics
    :items="[
        { title: 'JavaScript', href: '/javascript/tipy-dannykh/tipy-dannykh' },
        { title: 'Vue.md', href: '/vue' },
        { title: 'Основные функции React', href: '/react/osnovnye-funktsii-react' },
        { title: 'Таблица сравнения React vs Vue', href: '/react/tablitsa-sravneniya-react-vs-vue' },
        { title: 'Эффективное обучение', href: '/podgotovka-k-sobesedovaniyu' },
    ]"
/>
