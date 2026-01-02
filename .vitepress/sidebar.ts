import type { DefaultTheme } from "vitepress";

// Расширяем тип SidebarItem для поддержки collapsible рекурсивно
type SidebarItemWithCollapsible = Omit<DefaultTheme.SidebarItem, "items"> & {
	collapsible?: boolean;
	items?: SidebarItemWithCollapsible[];
};

export const sidebar: SidebarItemWithCollapsible[] = [
	{
		text: "Общее",
		collapsible: true,
		collapsed: false,
		items: [
			{ text: "Подготовка к собеседованию", link: "/Подготовка к собеседованию" },
			{ text: "Общие вопросы по Web", link: "/Общие вопросы по Web" },
			{ text: "Vue", link: "/Vue" },
		],
	},
	{
		text: "Vue по темам",
		collapsible: true,
		collapsed: true,
		items: [
			{
				text: "Реактивность во Vue3",
				link: "/Vue по темам/Реактивность во Vue3",
			},
			{
				text: "Ref & reactive",
				collapsible: true,
				collapsed: true,
				items: [
					{ text: "ref vs reactive", link: "/Vue по темам/Ref & reactive/ref vs reactive" },
					{ text: "reactive", link: "/Vue по темам/Ref & reactive/reactive" },
					{ text: "shallowReactive", link: "/Vue по темам/Ref & reactive/shallowReactive" },
					{
						text: "Как работает ref внутри в Vue 3",
						link: "/Vue по темам/Ref & reactive/ref/🧠 Как работает ref внутри в Vue 3",
					},
				],
			},
			{
				text: "watch и watchEffect",
				link: "/Vue по темам/watch и watchEffect",
			},
			{
				text: "provide и inject",
				link: "/Vue по темам/provide и inject",
			},
			{ text: "Pinia", link: "/Vue по темам/Pinia" },
			{ text: "defineExpose()", link: "/Vue по темам/defineExpose()" },
			{ text: "Suspense", link: "/Vue по темам/Suspense" },
			{
				text: "Template под капотом",
				link: "/Vue по темам/Template под капотом",
			},
			{ text: "Рендер-функции", link: "/Vue по темам/Рендер-функции" },
			{ text: "Директивы Vue", link: "/Vue по темам/Директивы Vue" },
			{
				text: "Жизненные циклы компонентов Vue 2 vs Vue 3",
				link: "/Vue по темам/Жизненные циклы компонентов Vue 2 vs Vue 3",
			},
			{
				text: "Асинхронные рендеры и батчинг",
				link: "/Vue по темам/Асинхронные рендеры и батчинг",
			},
			{
				text: "Scheduler",
				link: "/Vue по темам/Scheduler",
			},
			{ text: "Virtual DOM", link: "/Vue по темам/Virtual DOM" },
			{ text: "Tree-Shaking", link: "/Vue по темам/Tree-Shaking" },
			{
				text: "Оптимизация High Load проекта",
				link: "/Vue по темам/Оптимизация Higth Load проекта",
			},
			{
				text: "Подкапотные темы во Vue.js",
				link: "/Vue по темам/🔎 Подкапотные темы во Vue.js",
			},
		],
	},
	{
		text: "React",
		collapsible: true,
		collapsed: true,
		items: [
			{
				text: "Основные функции React",
				link: "/React/Основные функции React",
			},
			{
				text: "Локальное состояние (реактивность)",
				link: "/React/Локальное состояние (реактивность)",
			},
			{ text: "UseState подробно", link: "/React/UseState подробно" },
			{
				text: "JSX и его альтернативы",
				link: "/React/JSX и его альтернативы",
			},
			{
				text: "React на примере Vue",
				link: "/React/React на примере Vue",
			},
			{
				text: "Таблица сравнения React vs Vue",
				link: "/React/Таблица сравнения React vs Vue",
			},
			{
				text: "Хуки",
				collapsible: true,
				collapsed: true,
				items: [
					{
						text: "Основные хуки в React",
						link: "/React/Хуки/📌 Основные хуки в React",
					},
					{ text: "useState", link: "/React/Хуки/🔹 useState" },
					{ text: "useEffect", link: "/React/Хуки/🔹 useEffect" },
					{ text: "useContext", link: "/React/Хуки/🔹 useContext" },
				],
			},
		],
	},
	{
		text: "Архитектура",
		collapsible: true,
		collapsed: true,
		items: [
			{
				text: "Архитектура приложений — виды и особенности",
				link: "/🏛️Архитектура/🏛️ Архитектура приложений — виды и особенности",
			},
			{
				text: "Domain-Driven Design",
				link: "/🏛️Архитектура/🎯 Domain-Driven Design",
			},
			{
				text: "Feature-Sliced Design",
				link: "/🏛️Архитектура/🧠 Feature-Sliced Design",
			},
			{ text: "Монолит", link: "/🏛️Архитектура/Монолит" },
			{ text: "Микросервисы", link: "/🏛️Архитектура/Микросервисы" },
			{
				text: "Топ-5 фронтенд-архитектур",
				link: "/🏛️Архитектура/Топ-5 фронтенд-архитектур",
			},
			{
				text: "Циклические зависимости",
				link: "/🏛️Архитектура/Циклические зависимости",
			},
			{
				text: "Шпаргалка по архитектурам",
				link: "/🏛️Архитектура/Шпаргалка по архитектурам",
			},
		],
	},
	{
		text: "JavaScript",
		collapsible: true,
		collapsed: true,
		items: [
			{ text: "Типы данных", link: "/Js по темам/Типы  данных" },
			{ text: "Типы функций", link: "/Js по темам/Типы функций" },
			{ text: "Методы массивов", link: "/Js по темам/Методы массивов" },
			{ text: "Операторы", link: "/Js по темам/Операторы" },
			{
				text: "Условные операторы",
				link: "/Js по темам/Условные операторы",
			},
			{ text: "Event Loop", link: "/Js по темам/Event Loop" },
			{ text: "Promise", link: "/Js по темам/Promice" },
		],
	},
	{
		text: "TypeScript",
		collapsible: true,
		collapsed: true,
		items: [
			{ text: "Утилитарные типы", link: "/Ts по темам/Утилитарные типы" },
			{ text: "Шпоры TS", link: "/Ts по темам/Шпоры TS" },
			{
				text: "Задачи",
				collapsible: true,
				collapsed: true,
				items: [
					{
						text: "Задача - реализовать Pick своими силами",
						link: "/Ts по темам/Задачи/💡 Задача - реализовать Pick своими силами",
					},
				],
			},
		],
	},
	{
		text: "Nuxt",
		collapsible: true,
		collapsed: true,
		items: [
			{
				text: "SSR - Server-Side Rendering",
				link: "/Nuxt/📌 SSR - Server-Side Rendering",
			},
			{
				text: "SSG - Static Site Generation",
				link: "/Nuxt/📌 SSG - Static Site Generation",
			},
			{
				text: "ISR - Incremental Static Regeneration",
				link: "/Nuxt/📌 ISR - Incremental Static Regeneration",
			},
			{ text: "Hydration", link: "/Nuxt/Hydration" },
			{ text: "Nuxt vs Vue", link: "/Nuxt/Nuxt vs Vue" },
			{ text: "Nuxt2 vs Nuxt3", link: "/Nuxt/Nuxt2 vs Nuxt3" },
		],
	},
	{
		text: "Браузеры",
		collapsible: true,
		collapsed: true,
		items: [
			{
				text: "Полный путь загрузки сайта",
				link: "/Браузеры/Полный путь загрузки сайта",
			},
			{
				text: "Critical Render Path",
				link: "/Браузеры/Critical Render Path",
			},
			{ text: "LCP, INP, TTI", link: "/Браузеры/LCP, INP, TTI" },
			{
				text: "Garbage Collector",
				collapsible: true,
				collapsed: true,
				items: [
					{ text: "Сборщик мусора", link: "/Браузеры/Garbage Collector/1 Cборщик мусора" },
					{ text: "Утечки памяти", link: "/Браузеры/Garbage Collector/2 Утечки памяти" },
					{
						text: "Вопросы по Garbage Collector",
						link: "/Браузеры/Garbage Collector/Вопросы по Garbage Collector",
					},
				],
			},
			{
				text: "Разница между HTTP 1.1, HTTP 2 и HTTP 3",
				link: "/Браузеры/🌐 Разница между HTTP 1.1, HTTP 2 и HTTP 3",
			},
			{
				text: "Сети, HTTP и CORS",
				link: "/Браузеры/🌐 Сети, HTTP и CORS",
			},
			{
				text: "A11y (Accessibility)",
				link: "/Браузеры/♿️ A11y (Accessibility)",
			},
		],
	},
	{
		text: "Безопасность",
		collapsible: true,
		collapsed: true,
		items: [
			{
				text: "Безопасность приложений в интернете",
				link: "/Безопасность приложений/Безопасность приложений в интернете",
			},
			{
				text: "XSS (Cross-Site Scripting)",
				link: "/Безопасность приложений/XSS (Cross-Site Scripting)",
			},
			{ text: "JWT", link: "/Безопасность приложений/JWT" },
			{
				text: "Cookie-сессия vs JWT",
				link: "/Безопасность приложений/🔐 Cookie-сессия vs JWT",
			},
			{
				text: "CSP — Content Security Policy",
				link: "/Безопасность приложений/🔐 CSP — Content Security Policy",
			},
			{
				text: "Авторизация",
				link: "/Безопасность приложений/Авторизация",
			},
		],
	},
	{
		text: "Алгоритмы",
		collapsible: true,
		collapsed: true,
		items: [
			{ text: "Алгоритмы", link: "/Алгоритмы/Алгоритмы" },
			{ text: "Структуры данных", link: "/Алгоритмы/2 Структуры данных" },
			{ text: "Карта по алгосам", link: "/Алгоритмы/Карта по алгосам" },
		],
	},
	{
		text: "ООП",
		collapsible: true,
		collapsed: true,
		items: [
			{ text: "Принципы ООП", link: "/ООП/Принципы ООП" },
			{ text: "Пораждающие паттерны", link: "/ООП/Пораждающие паттерны" },
		],
	},
	{
		text: "npm tools",
		collapsible: true,
		collapsed: true,
		items: [
			{ text: "NaiveUI", link: "/npm tools/NaiveUI" },
			{ text: "Nx и Turborepo", link: "/npm tools/Nx и Turborepo" },
			{
				text: "OpenAPI, Swagger, Protobuf",
				link: "/npm tools/OpenAPI, Swagger, Protobuf",
			},
		],
	},
	{
		text: "Pixi по темам",
		collapsible: true,
		collapsed: true,
		items: [
			{
				text: "Глубокое понимание PixiJS",
				link: "/Pixi по темам/1 Глубокое понимание PixiJS",
			},
			{
				text: "Vue 3 + Pixi паттерны интеграции",
				link: "/Pixi по темам/2 Vue 3 + Pixi паттерны интеграции",
			},
			{
				text: "TypeScript first",
				link: "/Pixi по темам/3 TypeScript first",
			},
			{
				text: "Производительность и отладка",
				link: "/Pixi по темам/4 Производительность и отладка",
			},
			{ text: "Pixi", link: "/Pixi по темам/Pixi" },
			{ text: "Карта по Pixi", link: "/Pixi по темам/Карта по Pixi" },
		],
	},
	{
		text: "Принципы программирования",
		collapsible: true,
		collapsed: true,
		items: [
			{ text: "SOLID", link: "/Принципы программирования/SOLID" },
			{
				text: "Маленькие принципы",
				link: "/Принципы программирования/Маленькие принципы",
			},
		],
	},
	{
		text: "Кэширование",
		collapsible: true,
		collapsed: true,
		items: [{ text: "Кэш", link: "/Кэширование/Кэш" }],
	},
	{
		text: "Задачи",
		collapsible: true,
		collapsed: true,
		items: [
			{
				text: "Яндекс",
				collapsible: true,
				collapsed: true,
				items: [{ text: "1 этап", link: "/Задачи/Яндекс/1 этап" }],
			},
		],
	},
	{
		text: "Сборщики",
		collapsible: true,
		collapsed: true,
		items: [{ text: "Vite", link: "/Сборщики/Vite/Vite" }],
	},
];
