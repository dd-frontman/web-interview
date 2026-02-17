---
title: "Nuxt 2 vs"
description: "1. Контекст/плагины: в Nuxt 3 нет this — только функции/композаблы/useNuxtApp."
tags:
  - "nuxt"
  - "nuxt2-vs-nuxt3"
updatedAt: "2026-02-16"
---
# Nuxt 2 vs

## 1) Краткое объяснение

- **Nuxt 2** — основан на **Vue 2**, использует **Options API**, сборка через **Webpack**, серверная часть через Connect/Express-подобный сервер, статика через `nuxt generate`.
- **Nuxt 3** — основан на **Vue 3** (Composition API, `<script setup>`, Suspense), по умолчанию **Vite**, сервер — **Nitro** (Edge/Serverless/Node), из коробки TypeScript, новые композаблы (`useAsyncData`, `useFetch`, `useState`), **Server API** (`server/api/**`), гибридный рендеринг и гибкий пререндер.

**Итог:** Nuxt 3 быстрее, легче, удобнее для масштабирования и edge-деплоя, с современным DX.

---

## 2) Подробное объяснение

### А. Рендеринг и сервер

- **Nuxt 2:** классический SSR на Node-сервере, статика через `nuxt generate`.
- **Nuxt 3:** **Nitro** — единый рантайм для SSR/SPA/пререндеринга/edge, пресеты деплоя (Node/Vercel/Netlify/Cloudflare Workers), on-demand/partial пререндер, кэш ответов.

### Б. Ядро Vue и DX

- **Nuxt 2:** Vue 2, Options API, без нативного Suspense/Teleport, TypeScript — аддон.
- **Nuxt 3:** Vue 3, **Composition API**, `<script setup>`, **Suspense**, **Teleport**, TS — **first-class**.

### В. Сборка и производительность

- **Nuxt 2:** **Webpack** (стабильно, но тяжелее на больших монорепах).
- **Nuxt 3:** **Vite** по умолчанию (мгновенный HMR, быстрый dev), можно Webpack при необходимости.

### Г. Данные и фетчинг

- **Nuxt 2:** `asyncData`, `fetch` (в компонентах/страницах), часто `@nuxtjs/axios`.
- **Nuxt 3:** `useAsyncData`, `useFetch` (автокэш, де-дупликация, SSR-совместимость), типобезопасность с `$fetch`/runtime-валидаторами.

### Д. Состояние

- **Nuxt 2:** **Vuex** (официально).
- **Nuxt 3:** **Pinia** (рекомендовано) + простая глобалка через `useState('key', () => initial)`.

### Е. Плагины/инъекции/контекст

- **Nuxt 2:** `plugins/**`, `context.app`, `this.$xyz`, `inject('xyz', ...)`.
- **Nuxt 3:** `defineNuxtPlugin`, доступ через **auto-imports**/`useNuxtApp().$xyz`, без `this` в компонентах.

### Ж. Серверные роуты / API

- **Nuxt 2:** `serverMiddleware` (Express-like).
- **Nuxt 3:** `server/api/**` — файл = API-роут (H3/Nitro), cookies, streaming, кэш, middleware.

### З. Конфиг и рантайм переменные

- **Nuxt 2:** `nuxt.config.js`, `process.env`/`env`.
- **Nuxt 3:** `nuxt.config.ts`, **`runtimeConfig`** (`public`/секреты), `useRuntimeConfig()` + типы.

### И. Маршрутизация и структура

- **Nuxt 2:** `pages/**`, `layouts/**`, `middleware/**`.
- **Nuxt 3:** корневой **`app.vue`** (shell), те же `pages/**`, `layouts/**`, route-middleware через `defineNuxtRouteMiddleware`.

### К. Модули и совместимость

- **Nuxt 2:** зрелая экосистема модулей v2.
- **Nuxt 3:** модули на `defineNuxtModule` (много портировано), **Nuxt Bridge** для плавной миграции с v2.

### Л. Деплой/Edge

- **Nuxt 2:** чаще Node-хостинг или статик.
- **Nuxt 3:** **Edge-friendly** (Workers/Serverless), пресеты Nitro, гибкий пререндер/кэш.

---

## 3) Примеры кода (Nuxt 2 → Nuxt 3)

### 3.1 Страница со списком (SSR-фетчинг)

**Nuxt 2 (pages/index.vue)**

```vue
<template>
	<div>
		<h1>Posts</h1>
		<ul>
			<li v-for="p in posts" :key="p.id">{{ p.title }}</li>
		</ul>
	</div>
</template>

<script>
export default {
	async asyncData({ $axios }) {
		const posts = await $axios.$get("https://jsonplaceholder.typicode.com/posts?_limit=5");
		return { posts };
	},
	data: () => ({ posts: [] }),
};
</script>
```

**Nuxt 3 (pages/index.vue)**

```vue
<script setup lang="ts">
const { data: posts } = await useAsyncData("posts", () =>
	$fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
);
</script>

<template>
	<div>
		<h1>Posts</h1>
		<ul>
			<li v-for="p in posts" :key="p.id">{{ p.title }}</li>
		</ul>
	</div>
</template>
```

### 3.2 Глобальное состояние

**Nuxt 2 (Vuex)**

```js
export const state = () => ({ cart: [] });
export const mutations = {
	add(s, item) {
		s.cart.push(item);
	},
};
export const getters = { count: (s) => s.cart.length };
```

**Nuxt 3 (через useState)**

```ts
// composables/useCart.ts
export function useCart() {
	const cart = useState<any[]>("cart", () => []);
	const add = (item: any) => cart.value.push(item);
	const count = computed(() => cart.value.length);
	return { cart, add, count };
}
```

### 3.3 Плагины и инъекции

**Nuxt 2**

```js
export default ({ app }, inject) => {
	const api = (path) => app.$axios.$get(`/api/${path}`);
	inject("api", api);
};
```

**Nuxt 3**

```ts
export default defineNuxtPlugin(() => {
	const api = (path: string) => $fetch(`/api/${path}`);
	return { provide: { api } };
});
// использование: const { $api } = useNuxtApp()
```

### 3.4 Серверные роуты / API

**Nuxt 2**

```js
// nuxt.config.js
export default {
	serverMiddleware: [{ path: "/api/hello", handler: "~/server-middleware/hello.js" }],
};
```

```js
// server-middleware/hello.js
export default function (req, res) {
	res.end(JSON.stringify({ msg: "Hello from Nuxt 2" }));
}
```

**Nuxt 3**

```ts
// server/api/hello.get.ts
export default defineEventHandler(() => ({ msg: "Hello from Nuxt 3/Nitro" }));
```

### 3.5 Middleware (роут)

**Nuxt 2**

```js
export default function ({ store, redirect }) {
	if (!store.state.user) return redirect("/login");
}
```

**Nuxt 3**

```ts
// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
	const user = useState("user");
	if (!user.value && to.path !== "/login") return navigateTo("/login");
});
```

### 3.6 SEO Head

**Nuxt 2**

```js
export default {
	head() {
		return { title: "Home", meta: [{ hid: "desc", name: "description", content: "..." }] };
	},
};
```

**Nuxt 3**

```vue
<script setup lang="ts">
useHead({ title: "Home", meta: [{ name: "description", content: "..." }] });
</script>
```

---

## 4) Сравнение (Nuxt 3 vs Next 13+/14) — если применимо

| Тема              | Nuxt 3                                   | Next (App Router)                        |
| ----------------- | ---------------------------------------- | ---------------------------------------- |
| Фреймворк         | Vue 3 + Composition API                  | React 18 + Server Components             |
| Сборка            | Vite по умолчанию                        | Turbopack/Vite/Webpack (по конфигу)      |
| Серверный рантайм | **Nitro** (Edge/Workers/Serverless/Node) | Edge/Serverless/Node (Vercel runtime)    |
| API роуты         | `server/api/**` (H3/Nitro)               | `app/api/**` (Route Handlers)            |
| Данные            | `useAsyncData`/`useFetch`                | `fetch()` в RSC/Handlers                 |
| Стор              | Pinia/`useState`                         | Любая либa (Zustand/Redux), RSC-паттерны |
| Пререндер/ISR     | Пререндер + on-demand (Nitro)            | ISR из коробки (Vercel)                  |
| DX                | `<script setup>`, авто-импорты           | RSC, nested layouts/loading              |

---

## 5) Чит-щит (таблица)

| Ключ      | Nuxt 2               | Nuxt 3                             | Подсказка        |
| --------- | -------------------- | ---------------------------------- | ---------------- |
| База      | Vue 2 + Options      | Vue 3 + Composition                | `<script setup>` |
| Сборка    | Webpack              | Vite/Webpack                       | Быстрый HMR      |
| Сервер    | Connect/Express-like | **Nitro (H3)**                     | Edge/Workers     |
| Данные    | `asyncData`, `fetch` | `useAsyncData`, `useFetch`         | Автокэш/SSR      |
| Стор      | Vuex                 | Pinia/`useState`                   | Простая глобалка |
| Плагины   | `inject` + `this.$x` | `defineNuxtPlugin`, `useNuxtApp()` | Без `this`       |
| Конфиг    | `process.env`        | `runtimeConfig`                    | `public`/секреты |
| SEO       | `head()`             | `useHead()`                        | Типы/автоимпорт  |
| Пререндер | `nuxt generate`      | Nitro prerender/on-demand          | Edge-friendly    |
| Миграция  | —                    | **Nuxt Bridge**                    | Поэтапно         |

---

## 6) Подводные камни и ошибки

1. **Контекст/плагины:** в Nuxt 3 нет `this` — только функции/композаблы/`useNuxtApp`.
2. **Env → runtimeConfig:** разделяйте `public` и приватные ключи.
3. **Vuex → Pinia/`useState`:** инициализация для SSR и гидратации.
4. **Фетчинг:** `asyncData`/`fetch` ≠ `useAsyncData`/`useFetch` (кэш/ошибки/загрузка).
5. **Модули:** проверьте аналоги для Nuxt 3 и совместимость.
6. **Middleware:** другой синтаксис/слои (route vs server).
7. **Client-only код:** используйте `process.client`/`onMounted`.
8. **TypeScript:** настройте `tsconfig`, используйте авто-типы runtime.

---

## 7) «Под капотом»: ключевые технические отличия

### 7.1 Реактивность и рендеринг Vue

- **Nuxt 2 / Vue 2:** реактивность через `Object.defineProperty` (не ловит новые свойства/индексы массивов без костылей); `vue-server-renderer`.
- **Nuxt 3 / Vue 3:** реактивность через **Proxy** (глубокое наблюдение, лучшая производительность), новый **`@vue/server-renderer`** со **streaming SSR** и **Suspense**, улучшенный диф VDOM.

### 7.2 Компилятор и tree-shaking

- **Nuxt 2:** старый SFC-компилятор, меньше возможностей по tree-shaking.
- **Nuxt 3:** vue-compiler-sfc нового поколения, агрессивный **tree-shaking**, `<script setup>` минимизирует рантайм-обвязку, меньше боилерплейта в бандле.

### 7.3 Dev/Build пайплайн

- **Nuxt 2:** Webpack dev server, HMR через webpack-middleware, server bundle + client bundle, медленнее на больших кодовых базах.
- **Nuxt 3:** **Vite** dev server (ESM, instant HMR, no bundle dev), SSR-рендер через **vite-node** в dev, прод-сборка раздельно для **Nitro server** и **client**.

### 7.4 Nitro стек (серверная часть Nuxt 3)

- **H3**: минималистичный HTTP-фреймворк.
- **unenv**: полифиллы Node-API для edge/Workers.
- **unstorage**: унифицированное key-value хранилище (FS, Redis, Cloud KV).
- **ofetch/$fetch**: fetch с тайпингами/интерсепторами для server/client.
- **nitro-prerender**: краулер и статическая выгрузка роутов.
- **Адаптеры деплоя**: билд в один артефакт, таргеты Node/Serverless/Edge без изменения кода.

### 7.5 Роутинг и авто-импорты

- **Nuxt 2:** генерация роутов из `pages/**` через шаблон, опциональная авто-регистрация компонентов через модуль.
- **Nuxt 3:** авто-импорт **композаблов** и **компонентов** из стандартных директорий (`composables`, `components`), современная генерация роутов, хуки `pages:extend` для кастомизации.

### 7.6 Payload/гидратация

- **Nuxt 2:** inlined payload/`window.__NUXT__` с ограниченной оптимизацией.
- **Nuxt 3:** оптимизированный **payload extraction** (вынесение в отдельные чанки), кэш и инвалидация данных, более надежная ID-схема для гидратации, поддержка streaming + Suspense.

### 7.7 Модульная экосистема

- **Nuxt 2:** модули на старом hook-API.
- **Nuxt 3:** **`@nuxt/kit`** и `defineNuxtModule` (типобезопасные хуки, auto-imports, удобные утилиты), унификация с unjs-эко.

### 7.8 CSS/Assets

- **Nuxt 2:** `file-loader/url-loader`, PostCSS via Webpack.
- **Nuxt 3:** Vite asset pipeline (`import` ассетов, `?url`/`?raw`), PostCSS по умолчанию, поддержка `import.meta.glob` для файловых матчингов.

---

Если нужно, подготовлю **чек-лист миграции Nuxt 2 → Nuxt 3** (1-в-1 соответствия API, типичные замены, ловушки) и минимальный шаблон репозитория для PoC.

---

<RelatedTopics
	:items="[
		{ title: 'Hydration', href: '/nuxt/rezhimy-rendera/hydration' },
		{ title: 'ISR - Incremental Static Regeneration', href: '/nuxt/rezhimy-rendera/isr-incremental-static-regeneration' },
		{ title: 'Nitro', href: '/nuxt/nitro' },
	]"
/>
