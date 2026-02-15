```vue
<template>
	<section class="child">
		<h3>ZeroChild</h3>

		<p>
			<b>props.title:</b> "{{ props.title }}"
			<br />
			<b>props.count:</b> {{ props.count }}
			<br />
			<b>props.active:</b> {{ props.active }}
			<br />
			<b>props.meta.source:</b> {{ props.meta?.source ?? "—" }}
		</p>

		<div class="row">
			<!-- Способ 1: эмит через обработчик -->
			<button @click="ping">emit('ping')</button>

			<!-- Способ 2: обновление prop через update:* (паттерн v-model / .sync) -->
			<button @click="rename">emit('update:title')</button>

			<!-- Способ 3: эмит с payload-объектом -->
			<button @click="submit">emit('submit')</button>
		</div>

		<!-- Пример v-model-like связывания внутри дочернего: -->
		<div class="row">
			<input
				class="input"
				:value="props.title"
				@input="onInputTitle"
				placeholder="Изменяй title (через update:title)"
			/>
		</div>
	</section>
</template>

<script setup lang="ts">
/**
 * =========================
 * ✅ СПОСОБЫ ПРИНИМАТЬ PROPS
 * =========================
 *
 * ВАЖНО: в одном компоненте одновременно можно использовать только ОДИН defineProps().
 * Поэтому ниже — активный вариант (TS typed), а альтернативы — закомментированы.
 */

/** ✅ Вариант A (активный): TypeScript типизация через generic */
type Props = {
	title: string;
	count: number;
	active?: boolean;
	meta?: { source: string; ts: number };
};
const props = defineProps<Props>();

/**
 * ✅ Вариант B: runtime-объект (валидаторы, default)
 *
 * const props = defineProps({
 *   title: { type: String, required: true },
 *   count: { type: Number, required: true },
 *   active: { type: Boolean, default: false },
 *   meta: { type: Object, default: () => ({ source: "?", ts: Date.now() }) },
 * })
 */
/**
 * ✅ Вариант C: массив строк (самый простой, без типов/валидации)
 *
 * const props = defineProps(["title", "count", "active", "meta"])
 */

/**
 * ✅ Вариант D: withDefaults + generic (TS) для дефолтов
 *
 * type Props = { title: string; count: number; active?: boolean }
 * const props = withDefaults(defineProps<Props>(), {
 *   active: true,
 * })
 */

/**
 * ✅ Вариант E: деструктуризация props (ОСТОРОЖНО: можно потерять реактивность)
 *
 * const { title } = defineProps<Props>()
 * // title не будет реактивно обновляться при изменении parent'ом (часто ловушка)
 *
 * ✅ Правильнее при деструктуризации сохранять реактивность через toRefs:
 *
 * import { toRefs } from "vue"
 * const props = defineProps<Props>()
 * const { title, count } = toRefs(props)
 */

/**
 * =========================
 * ✅ СПОСОБЫ ОТДАВАТЬ EMITS
 * =========================
 *
 * defineEmits тоже выбираешь один вариант.
 * Ниже активный — TS typed signatures (самый строгий).
 */

/** ✅ Вариант 1 (активный): TS typed signatures */
const emit = defineEmits<{
	(e: "ping", payload: { from: string; at: number }): void;
	(e: "update:title", value: string): void;
	(e: "submit", payload: { title: string; count: number }): void;
}>();

/**
 * ✅ Вариант 2: массив строк (без типов/валидации)
 *
 * const emit = defineEmits(["ping", "update:title", "submit"])
 */

/**
 * ✅ Вариант 3: runtime-объект с валидацией payload (Vue будет проверять в dev)
 *
 * const emit = defineEmits({
 *   ping: (payload) => typeof payload?.from === "string" && typeof payload?.at === "number",
 *   "update:title": (v) => typeof v === "string",
 *   submit: (payload) => typeof payload?.title === "string" && typeof payload?.count === "number",
 * })
 */

/**
 * ✅ Вариант 4: v-model канонический для Vue 3 (если делаешь именно v-model)
 * - prop: modelValue
 * - emit: update:modelValue
 *
 * type Props = { modelValue: string }
 * const props = defineProps<Props>()
 * const emit = defineEmits<{ (e: "update:modelValue", v: string): void }>()
 */

function ping() {
	emit("ping", { from: "ZeroChild", at: Date.now() });
}

function rename() {
	emit("update:title", props.title + "!");
}

function submit() {
	emit("submit", { title: props.title, count: props.count });
}

function onInputTitle(e: Event) {
	const v = (e.target as HTMLInputElement).value;
	emit("update:title", v);
}
</script>

<style scoped>
.child {
	display: grid;
	gap: 10px;
	padding: 12px;
	border: 1px dashed #bbb;
	border-radius: 10px;
}
.row {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	align-items: center;
}
.input {
	padding: 8px 10px;
	border: 1px solid #ccc;
	border-radius: 8px;
	min-width: 240px;
}
</style>
```

```vue
<template>
	<div class="wrap">
		<h3>Пользователи</h3>

		<ul>
			<li v-for="user in users" :key="user.id">{{ user.name }} — {{ user.age }}</li>
		</ul>

		<button @click="addUser">Добавить пользователя</button>
		<button @click="increaseAge">Увеличить возраст последнего</button>
	</div>
</template>

<script>
export default {
	name: "UsersList",
	data() {
		return {
			users: [
				{ id: 1, name: "Alice", age: 25 },
				{ id: 2, name: "Bob", age: 30 },
			],
		};
	},
	methods: {
		addUser() {
			const newUser = {
				id: Date.now(),
				name: "New user",
				// age специально не задаём — будет добавляться позже
			};

			// TODO FIX: Vue 2 не отслеживает добавление массива через индекс (arr[i] = ...)
			// ✅ FIX: this.users.push(newUser)
			// ✅ FIX: this.users = [...this.users, newUser]
			// ✅ FIX: this.$set(this.users, this.users.length, newUser)
			this.users[this.users.length] = newUser;
		},

		increaseAge() {
			const lastIndex = this.users.length - 1;
			const user = this.users[lastIndex];

			// TODO FIX: Vue 2 не отслеживает добавление НОВОГО свойства в объект (user.age = ...)
			// ✅ FIX: this.$set(user, "age", (user.age || 0) + 1)
			// ✅ FIX: this.users.splice(lastIndex, 1, { ...user, age: (user.age || 0) + 1 })
			// ✅ FIX: this.users = this.users.map((u, i) => i === lastIndex ? { ...u, age: (u.age || 0) + 1 } : u)
			user.age = (user.age || 0) + 1;
		},
	},
};
</script>

<style scoped>
.wrap {
	max-width: 420px;
}
ul {
	padding-left: 16px;
}
li {
	margin-bottom: 4px;
}
button {
	margin-top: 8px;
	margin-right: 8px;
}
</style>
```
