# Vue 3: всё про `ref` / `reactive` + `shallowRef` / `shallowReactive` и **отладка реактивности** (+ метрики производительности)

Ниже — объединённая шпаргалка middle-senior уровня: как работает реактивность **под капотом**, чем отличаются полная и «плоская» (shallow) реактивность, как **дебажить** трекинг/триггеры, и что по **перформансу**.

---

## 1) Как это устроено внутри

### `ref(value)`

- Это **реактивная ячейка** со свойством `.value`.  
  Чтение `.value` делает **track** (подписка), запись `.value = ...` делает **trigger** (уведомление эффектов).
- **Важно:** если в `ref` положить **объект/массив**, Vue **автоматически делает его глубоко реактивным** (внутри через `reactive()`), поэтому мутации вложенных свойств тоже отслеживаются.

### `reactive(obj)`

- Возвращает **Proxy** с перехватом `get/has/iterate/set`, обеспечивая **глубокую** реактивность по всему дереву. Повторный `reactive()` для того же объекта вернёт **тот же** прокси.
- Внутри **есть авто-распаковка** (unwrapping) верхнеуровневых `ref`:  
  `reactive({ count: ref(1) }).count` читается как обычное значение и синхронизирован с исходным `ref`.

---

## 2) «Плоская» реактивность

### `shallowRef(value)`

- Отслеживается **только смена ссылки `.value`**: вложенные изменения **не** трекаются. Нужен либо `state.value = новыйОбъект`, либо **ручной пинок** `triggerRef(state)`.

### `triggerRef(shallow)`

- Принудительно триггерит эффекты, зависящие от `shallowRef`, если внутри вы мутировали глубоко и хотите обновить UI.

### `shallowReactive(obj)`

- Реактивен **только верхний уровень** свойств; вложенные остаются «сырыми». Полезно, когда вложенность не влияет на рендер или управляется отдельно.

---

## 3) Когда что брать

- **`ref`** — примитивы, счётчики, флаги, а также случаи, когда вы **часто заменяете всё значение** (включая объекты/массивы). И помните: `ref(obj)` **сам обернёт объект в глубоко реактивный**.
- **`reactive`** — «богатые» объекты/массивы, где много **вложенных мутаций**.
- **`shallowRef`** — большие структуры/внешние сторы (XState, RxJS и т.п.): минимальный оверхед, реакции — по смене ссылки или `triggerRef()`.
- **`shallowReactive`** — нужно отслеживать только верхушку; вложенность либо «иммутабельная», либо обновляется отдельной логикой.

---

## 4) Шаблоны, деструктуризация, auto-unwrapping

- В **шаблонах** `ref` авто-распаковывается, если это **топ-левел свойство** контекста рендера; внутри вложенных структур авто-unwrapping **не** работает.
- При деструктуризации `reactive` используйте `toRef(s)` — иначе вытащите «голые» значения и потеряете подписку. (см. API Core/Guide)

---

## 5) Отладка реактивности (что трекается и что триггерит)

### Debug-хуки вычислений и вотчеров (dev-mode)

- В `computed`, `watch`, `watchEffect` доступны опции **`onTrack(e)`** и **`onTrigger(e)`**, чтобы увидеть, **что именно** подписалось/перетриггерило пересчёт (`e.type: 'get' | 'has' | 'iterate'`, `e.key` и т.д.).

```ts
const plusOne = computed(() => count.value + 1, {
	onTrack(e) {
		console.log("computed tracked:", e.type, e.key);
	},
	onTrigger(e) {
		console.log("computed triggered:", e.type, e.key);
	},
});

watchEffect(() => doSomething(state.user), {
	onTrack: (e) => console.log("effect tracked:", e),
	onTrigger: (e) => console.log("effect triggered:", e),
});
```

## 6) Мини-примеры поведения

```ts
import {
	ref,
	reactive,
	shallowRef,
	shallowReactive,
	triggerRef,
	computed,
	watchEffect,
	toRefs,
	onRenderTracked,
	onRenderTriggered,
} from "vue";

// 1) ref: примитив + объект (объект станет глубоко реактивным)
const count = ref(0);
const userRef = ref({ profile: { name: "Alice" } }); // deep-reactive внутри
userRef.value.profile.name = "Bob"; // вложенная мутация триггерит эффекты (через внутренний reactive)

// 2) reactive: глубокая проксификация
const state = reactive({ todos: [{ id: 1, done: false }] });
state.todos[0].done = true; // отследится

// 3) shallowRef: трек по ссылке .value
const cache = shallowRef({ items: [] });
cache.value.items.push(1); // не триггерит подписчиков...
triggerRef(cache); // ...пока явно не «пнёте»
// (или просто замените ссылку: cache.value = { ...cache.value, items: [...cache.value.items] })

// 4) shallowReactive: реактивен только верхний уровень
const bag = shallowReactive({ a: 1, nested: { b: 2 } });
bag.a++; // реактивно
bag.nested.b++; // НЕ реактивно

// 5) debug хуки рендера (dev)
onRenderTracked((e) => console.log("render tracked", e.type, e.key));
onRenderTriggered((e) => console.log("render triggered", e.type, e.key));
```

## 7) **Метрики производительности** и практические выводы

> Важно: **абсолютные числа зависят от вашего кейса** (объёмы данных, частота мутаций, глубина дерева, браузер/девайс). Ниже — проверенные тезисы из оф. доков и публичных бенчмарков; используйте их как ориентиры и обязательно **меряйте у себя**.

- **Глубокая реактивность стоит денег**, особенно на больших и/или часто мутируемых деревьях:
  - Официальный «Performance» гайд рекомендует **уменьшать «фронт реактивности»**, используя `shallowRef`/`shallowReactive` для **больших иммутабельных структур** — это **держит быстрым доступ к вложенным свойствам**, т.к. они не проксируются глубоко. Обновления делаем заменой корневой ссылки. [Vue.js](https://vuejs.org/guide/best-practices/performance)
- **`shallowRef`/`shallowReactive` снижают оверхед** за счёт отказа от глубокого трекинга:  
   типичный паттерн — держать большой список/кэш в `shallowRef` и менять ссылку разом (или `triggerRef` после редкой глубокой мутации). [Vue.js](https://vuejs.org/api/reactivity-advanced)
- **Примитивы:** разницы между `ref` и `shallowRef` практически нет (микро-оверход у `ref`), поэтому смысла оптимизировать примитивы `shallowRef`-ом обычно **нет**. [Stack Overflow](https://stackoverflow.com/questions/71809504/ref-vs-shallowref-for-simple-variables-like-string-or-number)
- **Top-level unwrapping** влияет на читаемость/микро-стоимость доступа: `reactive` избавляет от `.value`, а `ref` — добавляет явный доступ к ячейке. (Функционально — дело вкуса/архитектуры, перформанс-разница минимальна в обычных кейсах.) [Stack Overflow](https://stackoverflow.com/questions/61452458/ref-vs-reactive-in-vue-3)
- **Относительные результаты из публичных бенчмарков (как ориентир):**
  - В проектах/демо отмечают, что **инициализация/доступ** к глубоко проксируемым структурам дороже, чем к плоским (`shallowRef`), и **bulk-замены** дешевле, чем серии глубоких мутаций. (см. StackBlitz демо) [StackBlitz](https://stackblitz.com/edit/vitejs-vite-cl9nid?file=src%2FApp.vue)
  - Отдельные сравнения Vue 2 vs Vue 3 показывают, что **модификация больших реактивных объектов** в Vue 3 может быть **в 2–3× дороже**, чем в Vue 2 (за счёт Proxy-накладных расходов), но **абсолютные значения малы** и редки в реальных кейсах без гигантских структур. Вывод — **меряйте под свой профиль нагрузки**. [GitHub](https://github.com/yArna/vue2-vs-Vue3)
- **Практические лайфхаки замеров:**
  - Для синтетики используйте `performance.now()` вокруг операций и прогоняйте в `requestIdleCallback`/`setTimeout` для честных цифр (без блокировки рендера).
  - Для реального UI — **Vue Devtools timeline** + профилировщик браузера, смотрите частоту ререндеров и «горячие» участки, и включайте debug-хуки (`onTrack`/`onTrigger`, `onRenderTracked`/`onRenderTriggered`) точечно в dev-сборке, чтобы увидеть, **что именно** дёргает обновления. [Vue.js](https://vuejs.org/guide/extras/reactivity-in-depth)

---

<RelatedTopics
	:items="[
		{ title: 'reactive', href: '/vue/ref-and-reactive/reactive' },
		{ title: 'ref vs reactive', href: '/vue/ref-and-reactive/ref-vs-reactive' },
		{ title: 'shallowReactive', href: '/vue/ref-and-reactive/shallowreactive' },
	]"
/>

