## Что такое DDD (Domain-Driven Design)

Domain-Driven Design — подход к проектированию ПО, в основе которого лежит бизнес-домен: термины, правила, структуры, которые отражают реальную предметную область. Главная цель — чтобы код был “говорящим”, понятным и поддерживаемым. :contentReference[oaicite:0]{index=0}

Ключевые элементы:

- **Убиквитозный язык (Ubiquitous Language)** — бизнес-эксперты и разработчики используют одни и те же термины, и они отражаются в именах классов, методов, сущностей. :contentReference[oaicite:1]{index=1}
- **Bounded Contexts** — выделенные доменные контексты, в которых понятия работают одинаково. Например, “Пользователи”, “Заказы”, “Платежи” и др. :contentReference[oaicite:2]{index=2}
- **Слои ответственности**: домен (сущности, value objects, бизнес-правила), слой приложения / сервисов (use cases, orchestrators), инфраструктура (API, репозитории), UI / представление. :contentReference[oaicite:3]{index=3}

---

## Как применяют DDD во Vue / Nuxt — примеры и структура

### Статья “Domain Driven Design With Nuxt Layers” (Vue School) :contentReference[oaicite:4]{index=4}

- В Nuxt Layers можно создавать “mini Nuxt проекты” — домены. Например, папка `/domains/users/`, где внутри: `components`, `composables`, `pages`, `utils`, `server` и др. :contentReference[oaicite:5]{index=5}
- Эти доменные слои регистрируются в корневом `nuxt.config.ts` через `extends`, так что Nuxt “сливает” их конфигурации, маршруты, компоненты и др. :contentReference[oaicite:6]{index=6}
- Это позволяет организовать всё, что связано с “пользователями”, в одном месте, и при том не терять преимуществ Nuxt (автоимпорт, маршрутов и др.). :contentReference[oaicite:7]{index=7}

### Статья “Migrating our VueJS Frontend to Domain Driven Design” (Penn Interactive) :contentReference[oaicite:8]{index=8}

- Команда раньше использовала структуру MVC, с папками вроде `components`, `views`, `store`, `assets`, `utilities` и др. Внутри этих папок были “разбросаны” файлы, относящиеся к разным доменам. :contentReference[oaicite:9]{index=9}
- Перешли к “домены” → каждый домен содержит свои компоненты, store (модули), утилиты, маршруты и др. Это позволило сократить “спагетти кода”, упростить навигацию и уменьшить взаимозависимости. :contentReference[oaicite:10]{index=10}

### Статья “Vue Project Directory Structure: Keep It Flat or Group by Domain” (Markus Oberlehner) :contentReference[oaicite:11]{index=11}

- Описаны варианты структуры папок: от плоской структуры до группировки по домену. :contentReference[oaicite:12]{index=12}
- Подход “Group by Domain” — ключ к DDD-проектированию: модули / домены, каждый с собственными компонентами, сервисами и утилитами. :contentReference[oaicite:13]{index=13}

---

## Пример структуры Vue + DDD

Вот пример, как может быть организован проект на Vue 3 + TypeScript с DDD-архитектурой:

```
src/
├── domains/
│    ├── user/
│    │    ├── api/
│    │    │    └── userApi.ts
│    │    ├── model/
│    │    │    ├── entities/
│    │    │    │   └── User.ts
│    │    │    └── useUser.ts
│    │    ├── components/
│    │    │   └── UserProfile.vue
│    │    └── index.ts    # public API домена user
│    ├── product/
│    │    ├── api/
│    │    ├── model/
│    │    ├── components/
│    │    └── index.ts
│    └── order/
│         ├── api/
│         ├── model/
│         ├── components/
│         └── index.ts
├── shared/
│    ├── ui/              # кнопки, базовые компоненты
│    ├── utils/
│    ├── types/
│    └── services/
├── app/
│    ├── router/
│    ├── store/
│    ├── main.ts
│    └── plugins/
└── pages/
     ├── HomePage.vue
     ├── OrdersPage.vue
     └── ProfilePage.vue
```

- `domains/user/model/entities/User.ts` — класс сущности с бизнес-логикой (валидация, методы).
- `domains/user/api/userApi.ts` — функции работы с API / трансформаций.
- `domains/user/components/UserProfile.vue` — UI, специфичный к домену.
- `shared/` — всё, что не зависит от домена / переиспользуется в разных доменах.

---

## Пример части кода

```ts
// domains/user/model/entities/User.ts
export class User {
	constructor(
		public id: string,
		public email: string,
		public name: string
	) {
		if (!User.isValidEmail(email)) {
			throw new Error("Invalid email");
		}
	}

	static isValidEmail(email: string): boolean {
		return /\S+@\S+\.\S+/.test(email);
	}

	rename(newName: string) {
		if (!newName) throw new Error("Name cannot be empty");
		this.name = newName;
	}
}
```

```ts
// domains/user/api/userApi.ts
import { User } from "../model/entities/User";

type RawUser = { id: string; email: string; name: string };

export async function fetchUser(userId: string): Promise<User> {
	const resp = await fetch(`/api/users/${userId}`);
	if (!resp.ok) {
		throw new Error("Fetch failed");
	}
	const raw = (await resp.json()) as RawUser;
	return new User(raw.id, raw.email, raw.name);
}
```

```ts
// domains/user/model/useUser.ts
import { ref } from "vue";
import { fetchUser } from "../api/userApi";
import { User } from "./entities/User";

export function useUser(userId: string) {
	const user = ref<User | null>(null);
	const loading = ref(false);
	const error = ref<string | null>(null);

	async function load() {
		loading.value = true;
		error.value = null;
		try {
			const u = await fetchUser(userId);
			user.value = u;
		} catch (e: any) {
			error.value = e.message || "Error fetching user";
		} finally {
			loading.value = false;
		}
	}

	return { user, loading, error, load };
}
```

```vue
<!-- domains/user/components/UserProfile.vue -->
<template>
	<div v-if="loading">Loading user...</div>
	<div v-else-if="error">Error: {{ error }}</div>
	<div v-else>
		<h2>{{ user?.name }}</h2>
		<p>{{ user?.email }}</p>
	</div>
</template>

<script setup lang="ts">
import { useUser } from "../model/useUser";
const { user, loading, error, load } = useUser("123");
load();
</script>
```

---

## Плюсы / минусы DDD в Vue + на что обратить внимание

| Плюсы                                                                                                                                           | Минусы / трудности                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Исходя из статей: структура становится более логичной, легче объекты/domain модули находить и понимать. :contentReference[oaicite:14]{index=14} | Требуется дисциплина: если команда не договорится о правилах, код может “расползтись” обратно в старый стиль.                       |
| Чёткие границы между доменами помогают уменьшить связность, улучшают тестируемость. :contentReference[oaicite:15]{index=15}                     | Начальное время / усилия: проектирование доменов, возможно рефактор старого кода, настройка автозагрузки маршрутов / store модулей. |
| Упрощает масштабирование, когда проект растёт, добавляются новые фичи. :contentReference[oaicite:16]{index=16}                                  | Для маленьких / простых проектов может быть “перегруз” структуры, слишком много уровней.                                            |
| Улучшает совместимость между бэкендом и фронтендом, если модели сущностей отражают бизнес правила.                                              | Возможно избыточность, если бизнес правила просто минимальные / менее сложный домен.                                                |

---

## Сводка — что запомнить

| Понятие                     | Кратко                                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| DDD                         | Код организован вокруг доменов / контекстов, бизнес-логики, а не вокруг типов файлов (компоненты / сервисы / виды и др.) |
| Домены                      | Области (modules) с сущностями, API, UI, логикой — каждая изолирована                                                    |
| Сущности (Entity)           | Объект с идентичностью, бизнес логика, методы, проверки                                                                  |
| Domain API / Infrastructure | API-вызовы, трансформации → часть инфраструктуры, район ответственности домена                                           |
| Shared / Core / Common      | Утилиты, типы, стили, компоненты, используемые многократно, без знания бизнес-логики                                     |
| Public API домена           | `index.ts`-файл, через который другие части приложения импортируют функциональность домена                               |
| Когда DDD стоит применять   | Большие проекты, проекты с развивающимися требованиями, сложные бизнес сервисы                                           |
| Когда может быть перебор    | Для MVP / простых сайтов / когда количество сущностей / правил ограничено                                                |

---

Если хочешь, могу подготовить **усы шаблон** структуры проекта на Vue 3 + DDD, плюс ESLint правила для импортов между доменами, чтобы соблюдать изоляцию, и показать, как мигрировать старый проект под DDD?```
::contentReference[oaicite:17]{index=17}
