- Реализовать корректное **двустороннее связывание** между родителем и дочерним компонентом через `v-model`.
- Изменения в инпуте **дочернего компонента** должны обновлять состояние в родителе.
- Кнопка в дочернем компоненте должна **сбрасывать значение** и корректно уведомлять родителя.
- Родитель должен уметь **программно менять значение**, и оно должно отобразиться в дочернем компоненте.

Родительский компонент

```vue
<template>
	<div>
		<h2>Родительский компонент</h2>

		<!-- TODO FIX: v-model не будет работать, если в Child не реализованы нужные props/emits -->
		<!-- ✅ FIX: в Child должен быть prop modelValue и emit update:modelValue -->
		<ChildInput v-model="name" />

		<p>Текущее значение в родителе: "{{ name }}"</p>

		<button @click="setProgrammatically">Установить значение из родителя</button>
	</div>
</template>

<script setup>
import { ref } from "vue";
import ChildInput from "./ChildInput.vue";

const name = ref(undefined);

function setProgrammatically() {
	name.value = "Vue";
}
</script>
```

Дочерний компонент

```vue
<template>
	<input v-model="value" placeholder="Введите текст" />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({ modelValue: String });
const emit = defineEmits(["update:modelValue"]);

const value = computed({
	get: () => props.modelValue ?? "",
	set: (v) => emit("update:modelValue", v),
});

function reset() {
	emit("update:modelValue", "");
}
</script>
```

так же можно сделать через @input

```vue
<input :value="props.modelValue ?? ''" @input="onInput" />

<script>
function onInput(event) {
  emit("update:modelValue", event.target.value);
}
</script>
```

---

<RelatedTopics
	:items="[
		{ title: 'Props и Emits', href: '/vue/zadachi/propsy-emity' },
		{ title: 'Vue', href: '/vue' },
		{ title: 'Реактивность во Vue3', href: '/vue/ref-and-reactive/reaktivnost-vo-vue3' },
	]"
/>

