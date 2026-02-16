# 🏛️ Монолитная архитектура во фронтенде

---

## 1) Что такое монолит

**Монолитная архитектура** — это когда всё приложение собрано в **один проект** (репозиторий, сборка, деплой).

- Фронтенд: SPA/MPA целиком в одном кодовом дереве.
- Бэкенд (часто): в том же репозитории (fullstack-монолит).

📌 Пример: интернет-магазин на Vue/Nuxt или React/Next, где фронт, API, дизайн-система — всё в одном проекте.

---

## 2) Особенности

- ✅ **Простота**: одна кодовая база, единый билд.
- ✅ **Легко стартовать**: один `npm run dev` — и всё работает.
- ✅ **Единый стек**: те же линтеры, CI/CD, тесты.
- ❌ **С ростом** → сборка медленная, код переплетённый.
- ❌ **Сложно масштабировать**: одна команда блокирует другую.

---

## 3) Структура проекта (Vue пример)

```
monolith-vue/
  public/                # статические файлы
  src/
    assets/              # картинки, шрифты, стили
    components/          # UI-компоненты (Button, Modal)
    pages/               # страницы (Home.vue, Profile.vue)
    store/               # Pinia/vuex
    services/            # API-клиенты
    router/              # маршрутизация
    App.vue              # корневой компонент
    main.ts              # точка входа
  package.json
  vite.config.ts
```

---

## 4) Мини-пример (Vue)

### Router

```ts
// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import Profile from "@/pages/Profile.vue";

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: "/", component: Home },
		{ path: "/profile/:id", component: Profile },
	],
});
```

### Store

```ts
// src/store/user.ts
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
	state: () => ({ name: "Guest" }),
	actions: {
		setName(newName: string) {
			this.name = newName;
		},
	},
});
```

### Сервис API

```ts
// src/services/api.ts
export const api = {
	getUser: (id: string) => fetch(`/api/users/${id}`).then((r) => r.json()),
};
```

### Страница

```vue
<!-- src/pages/Profile.vue -->
<script setup lang="ts">
import { useRoute } from "vue-router";
import { api } from "@/services/api";

const route = useRoute();
const user = ref<any>(null);

onMounted(async () => {
	user.value = await api.getUser(route.params.id as string);
});
</script>

<template>
	<div v-if="user">
		<h1>{{ user.name }}</h1>
		<p>Email: {{ user.email }}</p>
	</div>
</template>
```

---

## 5) Структура проекта (React пример)

```
monolith-react/
  public/
  src/
    components/        # UI
    pages/             # страницы
    store/             # Zustand/Redux
    services/          # API
    App.tsx
    index.tsx
  package.json
```

### Router (React Router v6)

```tsx
// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/profile/:id" element={<Profile />} />
		</Routes>
	);
}
```

### Store (Zustand)

```ts
// src/store/user.ts
import create from "zustand";

export const useUserStore = create((set) => ({
	name: "Guest",
	setName: (name: string) => set({ name }),
}));
```

### API

```ts
// src/services/api.ts
export const api = {
	getUser: async (id: string) => {
		const res = await fetch(`/api/users/${id}`);
		return res.json();
	},
};
```

---

## 6) Пример монолита «Fullstack» (Nuxt/Next)

### Nuxt 3 (Vue + сервер Nitro)

```
fullstack-nuxt/
  pages/                # фронт роутинг
  components/           # UI
  server/api/           # API-эндпоинты
  store/                # Pinia
  app.vue
```

```ts
// server/api/user.get.ts
export default defineEventHandler(() => ({ id: 1, name: "Alice" }));
```

```vue
<!-- pages/index.vue -->
<script setup>
const { data: user } = await useFetch("/api/user");
</script>
<template>
	<h1>{{ user.name }}</h1>
</template>
```

### Next.js (React + API routes)

```
fullstack-next/
  app/
    page.tsx
    api/
      user/
        route.ts
```

```ts
// app/api/user/route.ts
export async function GET() {
	return Response.json({ id: 1, name: "Alice" });
}
```

```tsx
// app/page.tsx
export default async function Home() {
	const res = await fetch("http://localhost:3000/api/user");
	const user = await res.json();
	return <h1>{user.name}</h1>;
}
```

---

## 7) Когда использовать монолит

✅ Подходит:

- Стартапы, MVP.
- Малые/средние проекты с одной командой.
- Когда важен быстрый релиз.

❌ Не подходит:

- Огромные проекты с несколькими командами.
- Когда нужно масштабировать разные части независимо.

---

# 📑 Шпаргалка: Монолит во фронтенде

| Характеристика   | Vue/React монолит                          | Fullstack монолит (Nuxt/Next)      |
| ---------------- | ------------------------------------------ | ---------------------------------- |
| Структура        | `components`, `pages`, `store`, `services` | Плюс `server/api/` в одном проекте |
| Плюсы            | Простота, быстрый старт                    | Универсальный стек, один деплой    |
| Минусы           | С ростом сложнее поддерживать              | Сервер и фронт тесно связаны       |
| Где использовать | Малые/средние проекты, MVP                 | Стартапы, корпоративные сайты      |

---

<RelatedTopics
	:items="[
		{ title: 'Архитектура приложений — виды и особенности', href: '/arkhitektura/arkhitektura-prilozhenii-vidy-i-osobennosti' },
		{ title: 'Domain-Driven Design', href: '/arkhitektura/domain-driven-design' },
		{ title: 'Feature-Sliced Design', href: '/arkhitektura/feature-sliced-design' },
	]"
/>

