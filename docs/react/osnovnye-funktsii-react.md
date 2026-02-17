---
title: "Osnovnye funktsii react"
description: "Краткая выжимка по теме \\\"Osnovnye funktsii react\\\"."
tags:
  - "react"
  - "osnovnye-funktsii-react"
updatedAt: "2026-02-16"
search: false
---
## 📚 React vs Vue — пофункциональное сравнение

### 1) Локальное состояние

**React → `useState`**

```jsx
const [count, setCount] = useState(0);
<button onClick={() => setCount((c) => c + 1)}>{count}</button>;
```

**Vue → `ref()` / `reactive()`**

```vue
<script setup>
import { ref } from "vue";
const count = ref(0);
</script>
<template>
	<button @click="count++">{{ count }}</button>
</template>
```

---

### 2) Побочные эффекты / жизненный цикл

**React → `useEffect`**

```jsx
useEffect(() => {
	fetchData();
}, []);
```

**Vue → `onMounted` / `watch` / `watchEffect`**

```vue
<script setup>
import { onMounted } from "vue";
onMounted(() => {
	fetchData();
});
</script>
```

---

### 3) Вычисляемые значения / мемоизация вычислений

**React → `useMemo`**

```jsx
const total = useMemo(() => sum(items), [items]);
```

**Vue → `computed()`**

```vue
<script setup>
import { computed } from "vue";
const total = computed(() => sum(items));
</script>
```

---

### 4) Мемоизация обработчиков

**React → `useCallback`**

```jsx
const onClick = useCallback(() => doSomething(id), [id]);
```

**Vue → обычно не нужно**

```vue
<script setup>
const onClick = () => doSomething(id);
</script>
```

---

### 5) Доступ к DOM / хранение мутируемых ссылок

**React → `useRef`**

```jsx
const inputRef = useRef(null);
<input ref={inputRef} />;
```

**Vue → template ref + `ref()`**

```vue
<script setup>
import { ref, onMounted } from "vue";
const inputRef = ref(null);
onMounted(() => inputRef.value.focus());
</script>
<template><input ref="inputRef" /></template>
```

---

### 6) Передача данных без проп-дриллинга

**React → Context API**

```jsx
const Theme = createContext("light");
<Theme.Provider value="dark">
	<App />
</Theme.Provider>;
```

**Vue → `provide` / `inject`**

```vue
<!-- родитель -->
<script setup>
import { provide } from "vue";
provide("theme", "dark");
</script>

<!-- потомок -->
<script setup>
import { inject } from "vue";
const theme = inject("theme");
</script>
```

---

### 7) Маршрутизация

**React → React Router**

```jsx
<Routes>
	<Route path="/about" element={<About />} />
</Routes>
```

**Vue → `vue-router`**

```vue
<template><RouterView /></template>
```

---

### 8) Оптимизация повторных рендеров

**React → `React.memo` / `useMemo` / `useCallback`**

```jsx
const Row = memo(({ item }) => <div>{item.name}</div>);
```

**Vue → оптимизации по умолчанию + `v-memo`**

```vue
<template v-memo="[item.id]">
	<div>{{ item.name }}</div>
</template>
```

---

### 9) Порталы

**React → `createPortal`**

```jsx
return createPortal(<Modal />, document.body);
```

**Vue → `<Teleport>`**

```vue
<template>
	<Teleport to="body"><Modal /></Teleport>
</template>
```

---

### 10) Ожидание асинхронных компонентов

**React → `Suspense`**

```jsx
<Suspense fallback={<Spinner />}>
	<LazyComp />
</Suspense>
```

**Vue → `<Suspense>`**

```vue
<Suspense>
  <template #default><LazyComp/></template>
  <template #fallback>Загрузка…</template>
</Suspense>
```

---

### 11) Границы ошибок

**React → Error Boundary**

```jsx
class Boundary extends React.Component { componentDidCatch(e){...} ... }
```

**Vue → `onErrorCaptured`**

```vue
<script setup>
import { onErrorCaptured } from "vue";
onErrorCaptured((err) => {
	report(err);
});
</script>
```

---

### 12) Переиспользуемая логика

**React → кастомные хуки**

```jsx
function useCounter() {
	const [c, setC] = useState(0);
	return {
		c,
		inc: () => setC((x) => x + 1),
	};
}
```

**Vue → композиционные функции**

```js
// useCounter.ts
import { ref } from "vue";
export function useCounter() {
	const c = ref(0);
	const inc = () => c.value++;
	return { c, inc };
}
```

---

### 13) Сложная логика состояния / редьюсеры

**React → `useReducer`**

```jsx
const [state, dispatch] = useReducer(reducer, {
	count: 0,
});
```

**Vue → `reactive` + функции / Pinia**

```js
import { defineStore } from "pinia";
export const useCounter = defineStore("c", {
	state: () => ({ count: 0 }),
	actions: {
		inc() {
			this.count++;
		},
	},
});
```

---

### 14) Управление формами и валидация

**React → controlled inputs / React Hook Form**

```jsx
const { register, handleSubmit } = useForm();
<input {...register("email")} />;
```

**Vue → `v-model` / VeeValidate**

```vue
<script setup>
import { ref } from "vue";
const email = ref("");
</script>
<template>
	<input v-model="email" />
</template>
```

---

### 15) Условный и списочный рендер

**React → тернарный оператор / `map`**

```jsx
{
	isAuth ? <User /> : <Login />;
}
{
	list.map((i) => <li key={i.id}>{i.name}</li>);
}
```

**Vue → `v-if` / `v-for`**

```vue
<template>
	<User v-if="isAuth" /><Login v-else />
	<li v-for="i in list" :key="i.id">{{ i.name }}</li>
</template>
```

---

### 16) Двусторонняя привязка

**React → controlled input**

```jsx
const [v, setV] = useState('')
<input value={ v } onChange={ e => setV(e.target.value) } />
```

**Vue → `v-model`**

```vue
<input v-model="value" />
```

---

### 17) Фрагменты

**React → `<>...</>`**

```jsx
<>
	<h1 />
	<p />
</>
```

**Vue → несколько корней или `<template>`**

```vue
<template>
	<h1 />
	<p />
</template>
```

---

### 18) SSR / SSG

**React → Next.js**

```txt
getServerSideProps / getStaticProps
```

**Vue → Nuxt**

```txt
useAsyncData / file-based routing
```

---

### 19) Анимации

**React → Framer Motion**

```jsx
<motion.div animate={{ opacity: 1 }} />
```

**Vue → `<Transition>`**

```vue
<Transition name="fade"><div v-if="open"/></Transition>
```

---

### 20) Работа с данными

**React → React Query**

```jsx
const { data } = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });
```

**Vue → Vue Query**

```js
const { data } = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });
```

---

### 21) Разделение кода

**React → `React.lazy`**

```jsx
const Page = lazy(() => import("./Page"));
```

**Vue → `defineAsyncComponent`**

```js
import { defineAsyncComponent } from "vue";
const Page = defineAsyncComponent(() => import("./Page.vue"));
```

---

### 22) Стили

**React → CSS Modules / Styled Components**

```jsx
import s from "./btn.module.css";
<button className={s.btn} />;
```

**Vue → SFC `scoped`**

```vue
<style scoped>
.btn {
	padding: 8px;
}
</style>
```

---

### 23) Рендер-функции

**React → JSX / `createElement`**
**Vue → render-функции (`h`)**

```js
import { h } from "vue";
export default {
	render() {
		return h("div", "hi");
	},
};
```

---

### 24) Concurrent UI

**React → `useTransition`, `useDeferredValue`**
**Vue → `Suspense`, `Transition`**

```vue
<Suspense>
  <template #default>...</template>
  <template #fallback>Загрузка...</template>
</Suspense>
```

### 25) Управление фокусом и доступностью

**React → `useRef` + DOM API**

```jsx
const btnRef = useRef(null);
useEffect(() => {
	btnRef.current.focus();
}, []);
<button ref={btnRef}>Click</button>;
```

**Vue → template ref + `onMounted`**

```vue
<script setup>
import { ref, onMounted } from "vue";
const btnRef = ref(null);
onMounted(() => {
	btnRef.value.focus();
});
</script>
<template><button ref="btnRef">Click</button></template>
```

---

### 26) Взаимодействие с внешними библиотеками

**React → useEffect + refs**

```jsx
const elRef = useRef();
useEffect(() => {
	externalLib.init(elRef.current);
}, []);
<div ref={elRef} />;
```

**Vue → `onMounted` + refs**

```vue
<script setup>
import { ref, onMounted } from "vue";
const elRef = ref(null);
onMounted(() => {
	externalLib.init(elRef.value);
});
</script>
<template><div ref="elRef"></div></template>
```

---

### 27) Управление глобальным состоянием

**React → Redux / Zustand / Jotai**

```jsx
const count = useSelector((s) => s.count);
const dispatch = useDispatch();
```

**Vue → Pinia / Vuex**

```js
const store = useCounter();
store.count;
store.inc();
```

---

### 28) События клавиатуры и мыши

**React → onClick / onKeyDown**

```jsx
<button onClick={handleClick} onKeyDown={handleKey} />
```

**Vue → @click / @keydown**

```vue
<button @click="handleClick" @keydown="handleKey"></button>
```

---

### 29) Кастомные события

**React → через пропсы**

```jsx
<Child onCustomEvent={handler} />
```

**Vue → $emit**

```vue
<!-- Child.vue -->
<template>
	<button @click="$emit('custom-event')">Emit</button>
</template>
```

---

### 30) Множественные слоты

**React → children пропсы**

```jsx
<Layout header={<Header />} footer={<Footer />}>
	Main
</Layout>
```

**Vue → именованные слоты**

```vue
<Layout>
  <template #header><Header/></template>
  <template #footer><Footer/></template>
  Main
</Layout>
```

---

### 31) Ленивая загрузка маршрутов

**React → React Router lazy**

```jsx
const Page = lazy(() => import("./Page"));
```

**Vue → vue-router lazy**

```js
{ path: '/page', component: () => import('./Page.vue') }
```

---

### 32) Предзагрузка данных до рендера

**React → getServerSideProps / loader (React Router 6.4+)**

```js
export async function loader() {
	return fetchData();
}
```

**Vue → Nuxt `useAsyncData`**

```js
const { data } = await useAsyncData("key", fetchData);
```

---

### 33) Мемоизация больших списков

**React → react-window / react-virtualized**

```jsx
<VirtualList height={400} itemCount={1000} itemSize={35} />
```

**Vue → vue-virtual-scroller**

```vue
<RecycleScroller :items="items" :item-size="35" key-field="id">
  <template #default="{ item }">{{ item.name }}</template>
</RecycleScroller>
```

---

### 34) Локализация

**React → react-i18next**

```jsx
const { t } = useTranslation();
<p>{t("welcome")}</p>;
```

**Vue → vue-i18n**

```vue
<p>{{ $t('welcome') }}</p>
```

---

### 35) Обработка ошибок API

**React → try/catch + state**

```jsx
try {
	await fetchData();
} catch (e) {
	setError(e);
}
```

**Vue → try/catch + ref**

```vue
<script setup>
import { ref } from "vue";
const error = ref(null);
try {
	await fetchData();
} catch (e) {
	error.value = e;
}
</script>
```

---

### 36) Оптимизация при множественных состояниях

**React → batching (автоматически в React 18)**

```jsx
setA(1);
setB(2); // один рендер
```

**Vue → реактивность автоматически группирует обновления**

```js
a.value = 1;
b.value = 2; // один рендер
```

---

### 37) Серверные события (SSE) и WebSockets

**React → useEffect + socket API**

```jsx
useEffect(() => {
	const s = new WebSocket(url);
	return () => s.close();
}, []);
```

**Vue → onMounted + socket API**

```vue
<script setup>
import { onMounted, onUnmounted } from "vue";
onMounted(() => {
	socket = new WebSocket(url);
});
onUnmounted(() => {
	socket.close();
});
</script>
```

---

### 38) Работа с анимациями при условии

**React → AnimatePresence (Framer Motion)**

```jsx
<AnimatePresence>{isOpen && <Modal />}</AnimatePresence>
```

**Vue → Transition с v-if**

```vue
<Transition name="fade"><Modal v-if="isOpen" /></Transition>
```

---

### 39) Тестирование

**React → Jest + React Testing Library**

```jsx
render(<Button />);
expect(screen.getByRole("button")).toBeInTheDocument();
```

**Vue → Vitest + Vue Testing Library**

```js
render(Button);
expect(screen.getByRole("button")).toBeInTheDocument();
```

---

### 40) Работа с внешними данными (глобальный кеш)

**React → SWR**

```jsx
const { data } = useSWR("/api/user", fetcher);
```

**Vue → vue-swr / Vue Query**

```js
const { data } = useSWR("/api/user", fetcher);
```

---

<RelatedTopics
	:items="[
		{ title: 'React', href: '/react/index' },
		{ title: 'JSX и его альтернативы', href: '/react/jsx-i-ego-alternativy' },
		{ title: 'Локальное состояние (реактивность)', href: '/react/lokalnoe-sostoyanie-reaktivnost' },
	]"
/>
