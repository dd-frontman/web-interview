import type { DefaultTheme } from "vitepress";

// Расширяем тип SidebarItem для поддержки collapsible рекурсивно
type SidebarItemWithCollapsible = Omit<DefaultTheme.SidebarItem, "items"> & {
	collapsible?: boolean;
	items?: SidebarItemWithCollapsible[];
};

export const sidebar: SidebarItemWithCollapsible[] = [
	{
		text: "Vue",
		collapsible: true,
		collapsed: true,
		items: [
			{ text: "Vue", link: "/vue" },
			{
				text: "Реактивность во Vue3",
				link: "/vue/ref-and-reactive/reaktivnost-vo-vue3",
			},
			{
				text: "Ref & reactive",
				collapsible: true,
				collapsed: true,
				items: [
					{ text: "ref vs reactive", link: "/vue/ref-and-reactive/ref-vs-reactive" },
					{ text: "reactive", link: "/vue/ref-and-reactive/reactive" },
					{ text: "shallowReactive", link: "/vue/ref-and-reactive/shallowreactive" },
					{
						text: "Как работает ref внутри в Vue 3",
						link: "/vue/ref-and-reactive/ref/kak-rabotaet-ref-vnutri-v-vue-3",
					},
				],
			},
			{
				text: "watch и watchEffect",
				link: "/vue/watch-i-watcheffect",
			},
			{
				text: "provide и inject",
				link: "/vue/provide-i-inject",
			},
			{ text: "Pinia", link: "/vue/pinia" },
			{ text: "defineExpose()", link: "/vue/defineexpose" },
			{ text: "Suspense", link: "/vue/suspense" },
			{
				text: "Template под капотом",
				link: "/vue/template-pod-kapotom",
			},
			{ text: "Рендер-функции", link: "/vue/render-funktsii" },
			{ text: "Директивы Vue", link: "/vue/direktivy-vue" },
			{
				text: "Жизненные циклы компонентов Vue 2 vs Vue 3",
				link: "/vue/zhiznennye-tsikly-komponentov-vue-2-vs-vue-3",
			},
			{
				text: "Асинхронные рендеры и батчинг",
				link: "/vue/asinkhronnye-rendery-i-batching",
			},
			{
				text: "Scheduler",
				link: "/vue/scheduler",
			},
			{ text: "Virtual DOM", link: "/vue/virtual-dom" },
			{ text: "Tree-Shaking", link: "/vue/tree-shaking" },
			{
				text: "Оптимизация High Load проекта",
				link: "/vue/optimizatsiya-high-load-proekta",
			},
			{
				text: "Задачи",
				collapsible: true,
				collapsed: true,
				items: [
					{ text: "Props и Emits", link: "/vue/zadachi/propsy-emity" },
					{
						text: "Двустороннее связывание через v-model",
						link: "/vue/zadachi/dvustoronnee-svyazyvanie-cherez-v-model",
					},
				],
			},
			{
				text: "Подкапотные темы во Vue.js",
				link: "/vue/podkapotnye-temy-vo-vue-js",
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
				link: "/react/osnovnye-funktsii-react",
			},
			{
				text: "Локальное состояние (реактивность)",
				link: "/react/lokalnoe-sostoyanie-reaktivnost",
			},
			{ text: "UseState подробно", link: "/react/usestate-podrobno" },
			{
				text: "JSX и его альтернативы",
				link: "/react/jsx-i-ego-alternativy",
			},
			{
				text: "React на примере Vue",
				link: "/react/react-na-primere-vue",
			},
			{
				text: "Таблица сравнения React vs Vue",
				link: "/react/tablitsa-sravneniya-react-vs-vue",
			},
			{
				text: "Хуки",
				collapsible: true,
				collapsed: true,
				items: [
					{
						text: "Основные хуки в React",
						link: "/react/khuki/osnovnye-khuki-v-react",
					},
					{ text: "useState", link: "/react/khuki/usestate" },
					{ text: "useEffect", link: "/react/khuki/useeffect" },
					{ text: "useContext", link: "/react/khuki/usecontext" },
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
				link: "/arkhitektura/arkhitektura-prilozhenii-vidy-i-osobennosti",
			},
			{
				text: "Domain-Driven Design",
				link: "/arkhitektura/domain-driven-design",
			},
			{
				text: "Feature-Sliced Design",
				link: "/arkhitektura/feature-sliced-design",
			},
			{ text: "Монолит", link: "/arkhitektura/monolit" },
			{ text: "Микросервисы", link: "/arkhitektura/mikroservisy" },
			{ text: "Микрофронтенд", link: "/arkhitektura/mikrofrontend" },
			{
				text: "Трассировка запросов (OpenTelemetry)",
				link: "/arkhitektura/trassirovka-zaprosov-opentelemetry",
			},
			{
				text: "Топ-5 фронтенд-архитектур",
				link: "/arkhitektura/top-5-frontend-arkhitektur",
			},
			{
				text: "Циклические зависимости",
				link: "/arkhitektura/tsiklicheskie-zavisimosti",
			},
			{
				text: "Шпаргалка по архитектурам",
				link: "/arkhitektura/shpargalka-po-arkhitekturam",
			},
		],
	},
	{
		text: "JavaScript",
		collapsible: true,
		collapsed: true,
		items: [
			{
				text: "Типы данных",
				collapsible: true,
				collapsed: true,
				items: [
					{ text: "Типы данных", link: "/javascript/tipy-dannykh/tipy-dannykh" },
					{ text: "Object", link: "/javascript/tipy-dannykh/object" },
				],
			},
			{ text: "Типы функций", link: "/javascript/tipy-funktsii" },
			{ text: "Методы массивов", link: "/javascript/metody-massivov" },
			{ text: "Операторы", link: "/javascript/operatory" },
			{
				text: "Условные операторы",
				link: "/javascript/uslovnye-operatory",
			},
			{ text: "Event Loop", link: "/javascript/event-loop" },
			{ text: "Event Bubbling", link: "/javascript/event-bubbling" },
			{ text: "Promise", link: "/javascript/promise" },
			{
				text: "Как работает JavaScript под капотом",
				link: "/javascript/kak-rabotaet-javascript-pod-kapotom",
			},
			{ text: "Что такое замыкание", link: "/javascript/chto-takoe-zamykanie" },
			{
				text: "JSON и его альтернативы",
				link: "/javascript/json-i-ego-alternativy",
			},
			{ text: "Object.freeze()", link: "/javascript/object-freeze" },
			{
				text: "Коллекции данных",
				collapsible: true,
				collapsed: true,
				items: [
					{ text: "Map", link: "/javascript/kollektsii-dannykh/map" },
					{ text: "Set", link: "/javascript/kollektsii-dannykh/set" },
					{ text: "WeakMap", link: "/javascript/kollektsii-dannykh/weakmap" },
					{ text: "WeakSet", link: "/javascript/kollektsii-dannykh/weakset" },
				],
			},
		],
	},
	{
		text: "HTML",
		collapsible: true,
		collapsed: true,
		items: [
			{ text: "Семантические теги", link: "/html/semanticheskie-tegi" },
			{ text: "Shadow DOM", link: "/html/shadow-dom" },
		],
	},
	{
		text: "CSS",
		collapsible: true,
		collapsed: true,
		items: [
			{
				text: "Адаптивная и отзывчивая верстка",
				link: "/css/adaptivnaya-i-otzyvchivaya-verstka",
			},
			{ text: "Центрирование в CSS", link: "/css/tsentrirovanie-v-css" },
			{ text: "Позиционирование в CSS", link: "/css/pozitsionirovanie-v-css" },
			{
				text: "Расположение контента и высота main",
				link: "/css/raspolozhenie-kontenta-i-vysota-main",
			},
			{ text: "z-index и stacking context", link: "/css/z-index-i-stacking-context" },
			{ text: "will-change", link: "/css/will-change" },
		],
	},
	{
		text: "TypeScript",
		collapsible: true,
		collapsed: true,
		items: [
			{ text: "Утилитарные типы", link: "/typescript/utilitarnye-tipy" },
			{ text: "as const в TypeScript", link: "/typescript/as-const-v-typescript" },
			{ text: "satisfies в TypeScript", link: "/typescript/satisfies-v-typescript" },
			{ text: "Type Guards: виды и примеры", link: "/typescript/taypguardy-v-typescript" },
			{ text: "assert в TypeScript", link: "/typescript/assert-v-typescript" },
			{ text: "Шпоры TS", link: "/typescript/shpory-ts" },
			{
				text: "Задачи",
				collapsible: true,
				collapsed: true,
				items: [
					{
						text: "Задача - реализовать Pick своими силами",
						link: "/typescript/zadachi/zadacha-realizovat-pick-svoimi-silami",
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
				link: "/nuxt/ssr-server-side-rendering",
			},
			{
				text: "SSG - Static Site Generation",
				link: "/nuxt/ssg-static-site-generation",
			},
			{
				text: "ISR - Incremental Static Regeneration",
				link: "/nuxt/isr-incremental-static-regeneration",
			},
			{ text: "Hydration", link: "/nuxt/hydration" },
			{ text: "Nitro", link: "/nuxt/nitro" },
			{ text: "Nuxt vs Vue", link: "/nuxt/nuxt-vs-vue" },
			{ text: "Nuxt2 vs Nuxt3", link: "/nuxt/nuxt2-vs-nuxt3" },
		],
	},
	{
		text: "Браузеры",
		collapsible: true,
		collapsed: true,
		items: [
			{
				text: "Полный путь загрузки сайта",
				link: "/brauzery/polnyi-put-zagruzki-saita",
			},
			{
				text: "Critical Render Path",
				link: "/brauzery/critical-render-path",
			},
			{
				text: "Ошибки Critical Rendering Path",
				collapsible: true,
				collapsed: true,
				items: [
					{
						text: "Типичные ошибки CRP",
						link: "/brauzery/oshibki-critical-rendering-path",
					},
					{
						text: "Reflow, Repaint, Layout Thrashing",
						link: "/brauzery/reflow-repaint-i-layout-thrashing",
					},
					{
						text: "Forced Synchronous Layout и Long Tasks",
						link: "/brauzery/forced-synchronous-layout-i-long-tasks",
					},
				],
			},
			{ text: "LCP, INP, TTI", link: "/brauzery/lcp-inp-tti" },
			{
				text: "Garbage Collector",
				collapsible: true,
				collapsed: true,
				items: [
					{ text: "Сборщик мусора", link: "/brauzery/garbage-collector/1-sborschik-musora" },
					{ text: "Утечки памяти", link: "/brauzery/garbage-collector/2-utechki-pamyati" },
					{
						text: "Вопросы по Garbage Collector",
						link: "/brauzery/garbage-collector/voprosy-po-garbage-collector",
					},
				],
			},
			{
				text: "Разница между HTTP 1.1, HTTP 2 и HTTP 3",
				link: "/brauzery/raznitsa-mezhdu-http-1-1-http-2-i-http-3",
			},
			{
				text: "Сети, HTTP и CORS",
				link: "/brauzery/seti-http-i-cors",
			},
			{
				text: "WebSocket в браузере",
				link: "/brauzery/websockety-v-brauzere",
			},
			{
				text: "Междоменные запросы: CORS, JSONP, Proxy",
				link: "/brauzery/mezhdomennye-zaprosy-cors-jsonp-proxy",
			},
			{
				text: "Server-Sent Events (SSE)",
				link: "/brauzery/server-sent-events-sse",
			},
			{
				text: "Общение между вкладками браузера",
				link: "/brauzery/obschenie-mezhdu-vkladkami-brauzera",
			},
			{
				text: "Workers в браузере",
				link: "/brauzery/workers-v-brauzere",
			},
			{
				text: "Оптимизация изображений в вебе",
				link: "/brauzery/optimizatsiya-izobrazhenii-v-vebe",
			},
			{
				text: "A11y (Accessibility)",
				link: "/brauzery/a11y-accessibility",
			},
		],
	},
	{
		text: "Безопасность",
		collapsible: true,
		collapsed: true,
		items: [
			{
				text: "Безопасность приложений",
				link: "/bezopasnost-prilozhenii/bezopasnost-prilozhenii",
			},
			{
				text: "XSS (Cross-Site Scripting)",
				link: "/bezopasnost-prilozhenii/xss-cross-site-scripting",
			},
			{
				text: "CSP — Content Security Policy",
				link: "/bezopasnost-prilozhenii/csp-content-security-policy",
			},
			{
				text: "CSRF (Cross-Site Request Forgery)",
				link: "/bezopasnost-prilozhenii/csrf-cross-site-request-forgery",
			},
		],
	},
	{
		text: "Авторизация",
		collapsible: true,
		collapsed: true,
		items: [
			{ text: "Авторизация", link: "/avtorizatsiya/avtorizatsiya" },
			{ text: "JWT", link: "/avtorizatsiya/jwt" },
			{
				text: "Cookie-сессия vs JWT",
				link: "/avtorizatsiya/cookie-sessiya-vs-jwt",
			},
		],
	},
	{
		text: "Алгоритмы",
		collapsible: true,
		collapsed: true,
		items: [
			{ text: "Алгоритмы", link: "/algoritmy/algoritmy" },
			{ text: "Структуры данных", link: "/algoritmy/2-struktury-dannykh" },
			{ text: "Карта по алгосам", link: "/algoritmy/karta-po-algosam" },
		],
	},
	{
		text: "ООП",
		collapsible: true,
		collapsed: true,
		items: [
			{ text: "Принципы", link: "/oop/printsipy-oop" },
			{ text: "Пораждающие паттерны", link: "/oop/porazhdayuschie-patterny" },
		],
	},
	{
		text: "npm tools",
		collapsible: true,
		collapsed: true,
		items: [
			{ text: "NaiveUI", link: "/npm-tools/naiveui" },
			{ text: "Nx и Turborepo", link: "/npm-tools/nx-i-turborepo" },
			{
				text: "OpenAPI, Swagger, Protobuf",
				link: "/npm-tools/openapi-swagger-protobuf",
			},
			{
				text: "gRPC и Protobuf",
				link: "/npm-tools/grpc-i-protobuf",
			},
		],
	},
	{
		text: "Pixi",
		collapsible: true,
		collapsed: true,
		items: [
			{ text: "Обзор Pixi", link: "/pixi-po-temam/index" },
			{
				text: "Глубокое понимание PixiJS",
				link: "/pixi-po-temam/1-glubokoe-ponimanie-pixijs",
			},
			{
				text: "Vue 3 + Pixi паттерны интеграции",
				link: "/pixi-po-temam/2-vue-3-plus-pixi-patterny-integratsii",
			},
			{
				text: "TypeScript first",
				link: "/pixi-po-temam/3-typescript-first",
			},
			{
				text: "Производительность и отладка",
				link: "/pixi-po-temam/4-proizvoditelnost-i-otladka",
			},
			{ text: "Pixi", link: "/pixi-po-temam/pixi" },
			{ text: "Карта по Pixi", link: "/pixi-po-temam/karta-po-pixi" },
		],
	},
	{
		text: "Принципы программирования",
		collapsible: true,
		collapsed: true,
		items: [
			{ text: "SOLID", link: "/printsipy-programmirovaniya/solid" },
			{
				text: "Маленькие принципы",
				link: "/printsipy-programmirovaniya/malenkie-printsipy",
			},
		],
	},
	{
		text: "Кэширование",
		collapsible: true,
		collapsed: true,
		items: [{ text: "Кэш", link: "/keshirovanie/kesh" }],
	},
	{
		text: "Задачи",
		collapsible: true,
		collapsed: true,
		items: [
			{ text: "Подготовка к собеседованию", link: "/podgotovka-k-sobesedovaniyu" },
			{
				text: "Яндекс",
				collapsible: true,
				collapsed: true,
				items: [{ text: "1 этап", link: "/zadachi/yandeks/1-etap" }],
			},
		],
	},
	{
		text: "Сборщики",
		collapsible: true,
		collapsed: true,
		items: [{ text: "Vite", link: "/sborschiki/vite/vite" }],
	},
	{
		text: "Тестирование",
		collapsible: true,
		collapsed: true,
		items: [
			{ text: "Vitest", link: "/testirovanie/vitest" },
			{
				text: "Vitest + Vue Test Utils + Playwright",
				link: "/testirovanie/vitest-plus-vue-test-utils-plus-playwright",
			},
		],
	},
];
