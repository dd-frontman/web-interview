- В Pinia геттеры (`getters`) — это по сути то же, что `computed` для состояния стора. Они определяются внутри `defineStore(...)`.
- При использовании _Setup Store_ можно внутри стора объявлять `ref()` для состояния, `computed()` для производных данных, и возвращать их.
- `storeToRefs(store)` нужен, когда ты хочешь деструктурировать свойства стора в компоненте и сохранить реактивность. Если просто делать `const { x, y } = store`, реактивность может быть потеряна.
- Лучшие практики: использовать `getters` чтобы вычислять производные состояния, а не хранить уже вычисленные данные в `state` (чтобы состояние было “сухим”, lean).

---

## Не использовать свойства стора / геттеры, а пользоваться `ref` + `computed` в компоненте

Это **возможно и нормальная практика**, особенно когда:

- логика производного состояния **локальна** только для компонента, не нужна в других частях приложения,
- ты хочешь быстро прототипировать или минимизировать изменения стора,
- или геттеры в стора кажутся “тяжёлыми” или перегруженными.

Но есть нюансы, риски, и моменты, которые нужно учесть.

---

## Плюсы и минусы такого подхода

| Плюс                                                                                          | Минус / риск                                                                                                                  |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Компонент контролирует, как именно будет вычисляться производная логика (`computed` локально) | Дублирование логики, если такая фильтрация / сортировка / преобразование нужна в нескольких компонентах                       |
| Меньше изменений в стора при изменениях UI-логики                                             | Если стора изменится, придётся поддерживать локальные `computed` везде, где они есть                                          |
| Возможность легко экспериментировать / кастомизировать UI-логику, не трогая стор              | Возможность потери реактивности, если неправильно извлекаешь свойства стора (без `storeToRefs`) или деструктурируешь напрямую |
| Более гибкий контроль времени, когда вычисления происходят                                    | Может быть менее организованно, сложнее рефакторить, если логика распространится на несколько мест                            |

---

## Как делать правильно, если выбрал “ref + computed” подход

Вот рекомендации + шаблон использования:

- Всю загрузку данных (fetch) делать в сторе через `actions`.
- Сырой state хранить в сторе (`ref()` или `state`), не вычисленные данные.
- В компоненте использовать `storeToRefs(store)` чтобы получить `refs` на state / геттеры.
- В компоненте объявлять `computed`, зависящие от этих refs, если нужна производная логика.
- Не мутировать стор внутри `computed`. `computed` должны быть “чистыми”: только чтение, вычисление, без побочных эффектов. (аналог правил Vue: “Computed properties should be side-effect free”)
- Если логика становится широко используемой — переносить её в стор как геттер, чтобы переиспользовать и централизовать.

---

## Примеры

### Пример A — стор + компонент с локальным `computed`

```ts
// stores/useItemsStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const useItemsStore = defineStore("items", () => {
	const items = ref<Item[]>([]);
	const loading = ref(false);

	async function loadItems() {
		loading.value = true;
		try {
			const resp = await fetch("/api/items");
			const data = await resp.json();
			items.value = data;
		} finally {
			loading.value = false;
		}
	}

	return {
		items,
		loading,
		loadItems,
	};
});
```

```vue
<!-- Component.vue -->
<template>
	<div>
		<input v-model="filterText" placeholder="Filter..." />
		<p v-if="loading">Loading...</p>
		<ul>
			<li v-for="it in filteredItems" :key="it.id">{{ it.name }}</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useItemsStore } from "@/stores/useItemsStore";

const store = useItemsStore();
store.loadItems();

const { items, loading } = storeToRefs(store);
const filterText = ref("");

const filteredItems = computed(() => {
	if (!filterText.value) {
		return items.value;
	}
	return items.value.filter((it) => it.name.toLowerCase().includes(filterText.value.toLowerCase()));
});
</script>
```

---

### Пример B — когда логика дублируется → стоит геттер в сторе

```ts
// stores/useItemsStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useItemsStore = defineStore("items", () => {
	const items = ref<Item[]>([]);
	const filterText = ref("");
	const loading = ref(false);

	async function loadItems() {
		loading.value = true;
		try {
			const resp = await fetch("/api/items");
			const data = await resp.json();
			items.value = data;
		} finally {
			loading.value = false;
		}
	}

	const filteredItems = computed(() => {
		if (!filterText.value) {
			return items.value;
		}
		return items.value.filter((it) =>
			it.name.toLowerCase().includes(filterText.value.toLowerCase())
		);
	});

	return {
		items,
		filterText,
		filteredItems,
		loading,
		loadItems,
	};
});
```

```vue
<!-- Component.vue -->
<template>
	<div>
		<input v-model="store.filterText" placeholder="Filter..." />
		<p v-if="store.loading">Loading...</p>
		<ul>
			<li v-for="it in store.filteredItems" :key="it.id">{{ it.name }}</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useItemsStore } from "@/stores/useItemsStore";

const store = useItemsStore();
store.loadItems();

const { filteredItems, loading } = storeToRefs(store);
</script>
```

---

## Таблица “объединённый вывод”

| Подход                                                    | Когда использовать                                                                             | Преимущества                                                                                                                                                                           | Риски / надо остерегаться                                                                                                            |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Использовать **getters / computed внутри стора**          | Логика производная нужна в многих компонентах, переиспользуется часто                          | Код будет централизован, меньше дублирования; реактивность Pinia + Devtools поддержка; геттеры автоматически пересчитываются при изменении state | Если геттеры сложные — может быть нагрузка; если логика UI-специфична → может быть лишним                                            |
| Использовать `ref` + `computed` в компоненте без геттеров | Когда логика производной лишь для одного компонента, не нужна в других; быстро прототипировать | Большая гибкость, меньше “забегания” в стор; проще отладка локально                                                                                                                    | Дублирование, может потеряться реактивность при деструктуризации; изменение структуры сторы приводит к изменению в нескольких местах |

---

Если хочешь, я подготовлю “конкретный эталон” структуры стора + компонентного подхода + рекомендации для реального проекта, чтобы ты мог просто вставить и адаптировать?
:

---

> [!tip] Связанные темы
>
> - [Асинхронные рендеры и батчинг](/vue/asinkhronnye-rendery-i-batching)
> - [defineExpose()](/vue/defineexpose)
> - [Директивы Vue](/vue/direktivy-vue)

