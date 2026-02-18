---
title: "Vuex"
description: "База по Vuex: архитектура state/getters/mutations/actions/modules, где он уместен сегодня и как планировать миграцию."
tags:
  - "vue"
  - "vuex"
updatedAt: "2026-02-18"
---
# Vuex

## Что это

`Vuex` — классический state manager для Vue 2 и раннего Vue 3-стека.

Архитектура строится вокруг централизованного store и паттерна:

- `state` — данные,
- `getters` — производные данные,
- `mutations` — синхронные изменения,
- `actions` — асинхронная логика.

## Базовый пример

```ts
import { createStore } from "vuex";

export default createStore({
	state: {
		count: 0,
	},
	getters: {
		double: (state) => state.count * 2,
	},
	mutations: {
		increment(state) {
			state.count++;
		},
	},
	actions: {
		incAsync({ commit }) {
			setTimeout(() => commit("increment"), 300);
		},
	},
});
```

## Плюсы

- понятная дисциплина изменений через `mutations`;
- зрелая экосистема для legacy-проектов;
- удобен там, где Vuex уже глубоко встроен.

## Ограничения

- больше шаблонного кода, чем в Pinia;
- типизация обычно сложнее;
- архитектура тяжелее для быстрых итераций в новых Vue 3-проектах.

## Modules

Vuex часто организуют через modules:

- `auth`, `cart`, `products`, `ui` и т.д.

Это удобно, но при росте проекта часто приводит к сложной связности между модулями.

## Когда оставлять Vuex

1. Большой legacy-проект с низкой толерантностью к риску.
2. Нужен постепенный переход без big-bang миграции.
3. Команда хорошо знает существующий Vuex-код и приоритет сейчас в фичах, а не в миграции.

## Миграция

Если проект на Vuex, но планируется долгий жизненный цикл, обычно рассматривают постепенную миграцию на Pinia:

1. Поднять Pinia рядом с Vuex.
2. Переносить модули по одному.
3. Сверять поведение тестами.
4. Удалить Vuex после стабилизации.

## Источники

- [Vuex Docs](https://vuex.vuejs.org/)
- [Vuex Guide](https://vuex.vuejs.org/guide/)
- [Pinia: Migration from Vuex](https://pinia.vuejs.org/cookbook/migration-vuex.html)

---

<RelatedTopics
	:items="[
		{ title: 'Pinia', href: '/vue/story/pinia' },
		{ title: 'Pinia vs Vuex', href: '/vue/story/pinia-vs-vuex' },
		{ title: 'Vue2 vs Vue3', href: '/vue/vue2-vs-vue3' },
	]"
/>
