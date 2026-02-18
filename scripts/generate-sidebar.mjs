import fs from "node:fs";
import path from "node:path";
import {
	collectMarkdownFiles,
	escapeTsString,
	inferTitle,
	routeFromFilePath,
	splitFrontmatter,
} from "./lib/content-utils.mjs";

const cwd = process.cwd();
const outputPath = path.join(cwd, ".vitepress", "sidebar.generated.ts");

const SECTION_ORDER = [
	"vue",
	"react",
	"arkhitektura",
	"javascript",
	"html",
	"css",
	"typescript",
	"nuxt",
	"brauzery",
	"bezopasnost-prilozhenii",
	"avtorizatsiya",
	"algoritmy",
	"oop",
	"npm-tools",
	"pixi-po-temam",
	"printsipy-programmirovaniya",
	"keshirovanie",
	"zadachi",
	"sborschiki",
	"testirovanie",
];

const SECTION_TITLES = {
	vue: "Vue",
	react: "React",
	arkhitektura: "Архитектура",
	javascript: "JavaScript",
	html: "HTML",
	css: "CSS",
	typescript: "TypeScript",
	nuxt: "Nuxt",
	brauzery: "Браузеры",
	"bezopasnost-prilozhenii": "Безопасность",
	avtorizatsiya: "Авторизация",
	algoritmy: "Алгоритмы",
	oop: "ООП",
	"npm-tools": "npm tools",
	"pixi-po-temam": "Pixi",
	"printsipy-programmirovaniya": "Принципы программирования",
	keshirovanie: "Кэширование",
	zadachi: "Задачи",
	sborschiki: "Сборщики",
	testirovanie: "Тестирование",
};

const TITLE_OVERRIDES = {
	"/algoritmy/2-struktury-dannykh": "Структуры данных",
	"/algoritmy/algoritmy": "Алгоритмы",
	"/algoritmy/karta-po-algosam": "Карта по алгосам",
	"/arkhitektura/mikrofrontend": "Микрофронтенд",
	"/arkhitektura/mikroservisy": "Микросервисы",
	"/arkhitektura/monolit": "Монолит",
	"/avtorizatsiya/avtorizatsiya": "Авторизация",
	"/avtorizatsiya/cookie-sessiya-vs-jwt": "Cookie-сессия vs JWT",
	"/avtorizatsiya/jwt": "JWT",
	"/bezopasnost-prilozhenii/csp-content-security-policy": "CSP — Content Security Policy",
	"/brauzery/garbage-collector/1-sborschik-musora": "Сборщик мусора",
	"/brauzery/garbage-collector/2-utechki-pamyati": "Утечки памяти",
	"/brauzery/crp/critical-render-path": "Critical Render Path (CRP): полный разбор",
	"/brauzery/crp/oshibki-critical-render-path": "Типичные ошибки в CRP",
	"/brauzery/lcp-inp-tti": "LCP, INP, TTI",
	"/css/pozitsionirovanie-v-css": "Позиционирование в CSS",
	"/css/tsentrirovanie-v-css": "Центрирование в CSS",
	"/css/will-change": "will-change",
	"/css/z-index-i-stacking-context": "z-index и stacking context",
	"/html/semanticheskie-tegi": "Семантические теги",
	"/html/shadow-dom": "Shadow DOM",
	"/javascript/chto-takoe-zamykanie": "Что такое замыкание",
	"/javascript/event-bubbling": "Event Bubbling",
	"/javascript/event-loop": "Event Loop",
	"/javascript/kollektsii-dannykh/map": "Map",
	"/javascript/kollektsii-dannykh/set": "Set",
	"/javascript/kollektsii-dannykh/weakmap": "WeakMap",
	"/javascript/kollektsii-dannykh/weakset": "WeakSet",
	"/javascript/metody-massivov": "Методы массивов",
	"/javascript/object-freeze": "Object.freeze()",
	"/javascript/operatory": "Операторы",
	"/javascript/promise": "Promise",
	"/javascript/tipy-dannykh/object": "Object",
	"/javascript/tipy-dannykh/tipy-dannykh": "Типы данных",
	"/javascript/tipy-funktsii": "Типы функций",
	"/javascript/uslovnye-operatory": "Условные операторы",
	"/keshirovanie/kesh": "Кэш",
	"/npm-tools/naiveui": "NaiveUI",
	"/npm-tools/nx-i-turborepo": "Nx и Turborepo",
	"/nuxt/rezhimy-rendera/ssr-server-side-rendering": "SSR (Server-Side Rendering)",
	"/nuxt/rezhimy-rendera/isr-incremental-static-regeneration": "ISR (Incremental Static Regeneration)",
	"/nuxt/rezhimy-rendera/ssg-static-site-generation": "SSG (Static Site Generation)",
	"/nuxt/rezhimy-rendera/hydration": "Hydration",
	"/nuxt/nitro": "Nitro",
	"/nuxt/nuxt-vs-vue": "Nuxt vs Vue",
	"/nuxt/nuxt2-vs-nuxt3": "Nuxt2 vs Nuxt3",
	"/oop/porazhdayuschie-patterny": "Пораждающие паттерны",
	"/oop/printsipy-oop": "Принципы",
	"/pixi-po-temam": "Pixi по темам",
	"/pixi-po-temam/1-glubokoe-ponimanie-pixijs": "Глубокое понимание PixiJS",
	"/pixi-po-temam/2-vue-3-plus-pixi-patterny-integratsii": "Vue 3 + Pixi: паттерны интеграции",
	"/pixi-po-temam/3-typescript-first": "TypeScript-first в Pixi",
	"/pixi-po-temam/4-proizvoditelnost-i-otladka": "Производительность и отладка Pixi",
	"/pixi-po-temam/karta-po-pixi": "Карта по Pixi",
	"/pixi-po-temam/pixi": "Pixi",
	"/podgotovka-k-sobesedovaniyu": "🎯 Подготовка к собеседованию",
	"/printsipy-programmirovaniya/solid": "SOLID",
	"/printsipy-programmirovaniya/malenkie-printsipy": "Маленькие принципы",
	"/react/khuki/usecontext": "useContext",
	"/react/khuki/useeffect": "useEffect",
	"/react/khuki/usestate": "useState",
	"/react/khuki/osnovnye-khuki-v-react": "Основные хуки React",
	"/react": "React",
	"/react/jsx-i-ego-alternativy": "JSX и его альтернативы",
	"/react/lokalnoe-sostoyanie-reaktivnost": "Локальное состояние в React",
	"/react/usestate-podrobno": "UseState подробно",
	"/sborschiki/vite/vite": "Vite",
	"/testirovanie/vitest": "Vitest",
	"/typescript": "TypeScript",
	"/typescript/as-const-v-typescript": "as const в TypeScript",
	"/typescript/assert-v-typescript": "assert в TypeScript",
	"/typescript/satisfies-v-typescript": "satisfies в TypeScript",
	"/typescript/shpory-ts": "Шпоры TS",
	"/typescript/taypguardy-v-typescript": "Type Guards: виды и примеры",
	"/typescript/zadachi/zadacha-realizovat-pick-svoimi-silami": "Задача: реализовать Pick",
	"/typescript/utilitarnye-tipy": "Утилитарные типы",
	"/vue": "Vue",
	"/vue/defineexpose": "defineExpose()",
	"/vue/direktivy-vue": "Директивы Vue",
	"/vue/story/pinia": "Pinia",
	"/vue/story/pinia-vs-vuex": "Pinia vs Vuex",
	"/vue/story/vuex": "Vuex",
	"/vue/scheduler": "Scheduler",
	"/vue/watch-i-watcheffect": "watch vs watchEffect",
	"/vue/podkapotnye-temy-vo-vue-js": "Подкапотные темы Vue.js",
	"/vue/template-pod-kapotom": "Template под капотом",
	"/vue/ref-and-reactive/reactive": "reactive",
	"/vue/ref-and-reactive/shallowref": "shallowRef",
	"/vue/ref-and-reactive/ref-vs-reactive": "ref vs reactive",
	"/vue/ref-and-reactive/shallowreactive": "shallowReactive",
	"/vue/vue2-vs-vue3": "Vue2 vs Vue3",
	"/vue/render-funktsii": "Рендер-функции",
	"/vue/suspense": "Suspense",
	"/vue/tree-shaking": "Tree-Shaking",
	"/vue/virtual-dom": "Virtual DOM",
	"/vue/provide-i-inject": "provide и inject",
	"/vue/zadachi/dvustoronnee-svyazyvanie-cherez-v-model": "Двустороннее связывание через v-model",
	"/vue/zadachi/propsy-emity": "Props и Emits",
	"/zadachi/yandeks/1-etap": "1 этап",
	"/brauzery/seti-http-i-cors": "Сети, HTTP и CORS",
	"/brauzery/a11y-accessibility": "A11y (Accessibility)",
	"/brauzery/versii-http/http-1-1": "HTTP/1.1",
	"/brauzery/versii-http/http-2": "HTTP/2",
	"/brauzery/versii-http/http-3": "HTTP/3",
	"/brauzery/versii-http/sravnenie-http-versii": "Сравнение HTTP версий",
};

const WEAK_HEADINGS = new Set([
	"краткое объяснение",
	"шпаргалка",
	"основы",
	"пример использования",
]);

const TITLE_REPLACEMENTS = [
	[/Critical\s+Rendering?\s+Path/gi, "CRP"],
	[/Content\s+Security\s+Policy/gi, "CSP"],
	[/Cross[-\s]Site\s+Request\s+Forgery/gi, "CSRF"],
	[/Cross[-\s]Site\s+Scripting/gi, "XSS"],
	[/Server[-\s]Sent\s+Events?/gi, "SSE"],
	[/Server[-\s]Side\s+Rendering/gi, "SSR"],
	[/Static\s+Site\s+Generation/gi, "SSG"],
	[/Incremental\s+Static\s+Regeneration/gi, "ISR"],
	[/JavaScript/gi, "JS"],
	[/TypeScript/gi, "TS"],
];

function compactTitle(title) {
	let value = title
		.replace(/[*_`]/g, "")
		.replace(/^[^\p{L}\p{N}]+/u, "")
		.replace(/[«»"“”]/g, " ")
		.replace(/[()]/g, " ")
		.replace(/[—–:;,!?+]/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	for (const [pattern, replacement] of TITLE_REPLACEMENTS) {
		value = value.replace(pattern, replacement);
	}

	const words = value.split(" ").filter(Boolean);
	if (words.length > 3) {
		value = words.slice(0, 3).join(" ");
	}

	return value
		.replace(/\bJs\b/g, "JS")
		.replace(/\bTs\b/g, "TS")
		.replace(/\bJwt\b/g, "JWT")
		.replace(/\bHttp\b/g, "HTTP")
		.replace(/\bCss\b/g, "CSS")
		.replace(/\bHtml\b/g, "HTML")
		.replace(/\bApi\b/g, "API")
		.replace(/\bCrp\b/g, "CRP")
		.replace(/\bCsp\b/g, "CSP")
		.replace(/\bCsrf\b/g, "CSRF")
		.replace(/\bXss\b/g, "XSS")
		.replace(/\bSsr\b/g, "SSR")
		.replace(/\bSsg\b/g, "SSG")
		.replace(/\bIsr\b/g, "ISR")
		.trim();
}

const GROUP_TITLE_OVERRIDES = {
	"/vue/ref-and-reactive": "Ref & reactive",
	"/vue/story": "Сторы",
	"/vue/zadachi": "Задачи",
	"/react/khuki": "Хуки",
	"/javascript/tipy-dannykh": "Типы данных",
	"/javascript/kollektsii-dannykh": "Коллекции данных",
	"/nuxt/rezhimy-rendera": "Режимы рендера",
	"/brauzery/garbage-collector": "Garbage Collector",
	"/brauzery/crp": "CRP",
	"/brauzery/versii-http": "Версии HTTP",
	"/typescript/zadachi": "Задачи",
	"/sborschiki/vite": "Vite",
	"/zadachi/yandeks": "Яндекс",
};

function toPublicRoute(route) {
	if (route === "/index") {
		return "/";
	}
	if (route.endsWith("/index")) {
		return route.slice(0, -"/index".length);
	}
	return route;
}

function looksLikeLatinOnlyTitle(value) {
	return /^[A-Za-z0-9\s+:.(),'"`’!?\-_/&]+$/.test(value) && /[A-Za-z]/.test(value);
}

function hasCyrillic(value) {
	return /[А-Яа-яЁё]/.test(value);
}

function cleanHeadingText(value) {
	return value
		.replace(/\[[xX ]\]\s*/g, "")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/\*\*([^*]+)\*\*/g, "$1")
		.replace(/[*_]/g, "")
		.replace(/<[^>]*>/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

function isWeakHeading(text) {
	const normalized = text.toLowerCase();
	if (WEAK_HEADINGS.has(normalized)) {
		return true;
	}
	if (/^(\d+|[ivx]+)\s*[\).:-]/i.test(normalized)) {
		return true;
	}
	return false;
}

function extractBestCyrillicHeading(body) {
	const headings = [];
	for (const line of body.split(/\r?\n/)) {
		const match = line.match(/^(#{1,6})\s+(.+)$/);
		if (!match) {
			continue;
		}
		const level = match[1].length;
		const text = cleanHeadingText(match[2]);
		if (!text || !hasCyrillic(text)) {
			continue;
		}
		headings.push({ level, text });
	}

	for (const heading of headings) {
		if (heading.level === 1 && !isWeakHeading(heading.text)) {
			return heading.text;
		}
	}

	for (const heading of headings) {
		if (heading.level <= 2 && !isWeakHeading(heading.text)) {
			return heading.text;
		}
	}

	for (const heading of headings) {
		if (!isWeakHeading(heading.text)) {
			return heading.text;
		}
	}

	return "";
}

function resolveSection(route) {
	if (route === "/podgotovka-k-sobesedovaniyu" || route.startsWith("/zadachi/")) {
		return "zadachi";
	}
	if (route === "/vue") {
		return "vue";
	}
	return route.replace(/^\//, "").split("/")[0];
}

function normalizeTitle(route, body, frontmatter) {
	const publicRoute = toPublicRoute(route);
	const override = TITLE_OVERRIDES[publicRoute] ?? TITLE_OVERRIDES[route];
	if (override) {
		return compactTitle(override);
	}

	if (typeof frontmatter.title === "string" && frontmatter.title.trim()) {
		const title = frontmatter.title.trim();
		if (looksLikeLatinOnlyTitle(title)) {
			const fallbackTitle = extractBestCyrillicHeading(body);
			if (fallbackTitle) {
				return compactTitle(fallbackTitle);
			}
		}
		return compactTitle(title);
	}
	return compactTitle(inferTitle(route, body));
}

function toGroupTitle(fullPath, segment) {
	const override = GROUP_TITLE_OVERRIDES[fullPath];
	if (override) {
		return override;
	}

	const normalized = segment.replace(/[-_]+/g, " ").trim();
	if (!normalized) {
		return "Раздел";
	}
	return normalized[0].toUpperCase() + normalized.slice(1);
}

function toSidebarItems(entries) {
	const section = entries[0]?.section ?? "";
	const sectionPrefix = `/${section}/`;

	/** @type {Array<{text: string, link: string}>} */
	const rootItems = [];
	/** @type {Array<{text: string, link: string}>} */
	const topLevelItems = [];
	/** @type {Map<string, { key: string, text: string, items: Array<{text: string, link: string}>, children: Map<string, any> }>} */
	const topLevelGroups = new Map();

	function ensureGroup(groupsMap, fullPath, segment) {
		let group = groupsMap.get(fullPath);
		if (!group) {
			group = {
				key: fullPath,
				text: toGroupTitle(fullPath, segment),
				items: [],
				children: new Map(),
			};
			groupsMap.set(fullPath, group);
		}
		return group;
	}

	for (const entry of entries) {
		const route = toPublicRoute(entry.route);
		const item = { text: entry.title, link: route };
		const isSectionRoot = route === `/${section}` || route === `/${section}/index`;

		if (isSectionRoot) {
			rootItems.push(item);
			continue;
		}

		if (!route.startsWith(sectionPrefix)) {
			topLevelItems.push(item);
			continue;
		}

		const relativeSegments = route.slice(sectionPrefix.length).split("/").filter(Boolean);
		if (relativeSegments.length <= 1) {
			topLevelItems.push(item);
			continue;
		}

		const folderSegments = relativeSegments.slice(0, -1);
		let currentGroups = topLevelGroups;
		let currentGroup = null;
		let currentPath = `/${section}`;

		for (const segment of folderSegments) {
			currentPath = `${currentPath}/${segment}`;
			currentGroup = ensureGroup(currentGroups, currentPath, segment);
			currentGroups = currentGroup.children;
		}

		if (currentGroup) {
			currentGroup.items.push(item);
		}
	}

	function sortLeafItems(items) {
		return items.sort((a, b) => a.text.localeCompare(b.text, "ru"));
	}

	function renderGroup(group) {
		const childGroups = Array.from(group.children.values())
			.sort((a, b) => a.text.localeCompare(b.text, "ru"))
			.map(renderGroup);
		const leafItems = sortLeafItems(group.items).map((item) => ({
			text: item.text,
			link: item.link,
		}));

		return {
			text: group.text,
			collapsible: true,
			collapsed: true,
			items: [...leafItems, ...childGroups],
		};
	}

	const renderedGroups = Array.from(topLevelGroups.values())
		.sort((a, b) => a.text.localeCompare(b.text, "ru"))
		.map(renderGroup);

	const renderedRootItems = sortLeafItems(rootItems);
	const renderedTopLevelItems = sortLeafItems(topLevelItems);

	return [...renderedRootItems, ...renderedTopLevelItems, ...renderedGroups];
}

const files = collectMarkdownFiles();
const bySection = new Map();

for (const filePath of files) {
	const route = routeFromFilePath(filePath);
	if (route === "/index") {
		continue;
	}

	const source = fs.readFileSync(filePath, "utf8");
	const { frontmatter, body } = splitFrontmatter(source);

	const section = resolveSection(route);
	const title = normalizeTitle(route, body, frontmatter);

	const list = bySection.get(section) ?? [];
	list.push({ route, title, section });
	bySection.set(section, list);
}

const sections = Array.from(bySection.entries()).sort((a, b) => {
	const aIndex = SECTION_ORDER.indexOf(a[0]);
	const bIndex = SECTION_ORDER.indexOf(b[0]);
	if (aIndex !== -1 || bIndex !== -1) {
		if (aIndex === -1) {
			return 1;
		}
		if (bIndex === -1) {
			return -1;
		}
		return aIndex - bIndex;
	}
	return a[0].localeCompare(b[0], "ru");
});

function renderSidebarItem(item, level = 0) {
	const indent = "\t".repeat(level);
	if ("link" in item) {
		return `${indent}{ text: "${escapeTsString(item.text)}", link: "${escapeTsString(item.link)}" }`;
	}

	const childItems = item.items.map((child) => renderSidebarItem(child, level + 2)).join(",\n");
	return `${indent}{
${indent}\ttext: "${escapeTsString(item.text)}",
${indent}\tcollapsible: true,
${indent}\tcollapsed: true,
${indent}\titems: [
${childItems}
${indent}\t],
${indent}}`;
}

const sidebarSource = `import type { DefaultTheme } from "vitepress";

// This file is auto-generated by scripts/generate-sidebar.mjs.
// Do not edit manually.
type SidebarItemWithCollapsible = Omit<DefaultTheme.SidebarItem, "items"> & {
\tcollapsible?: boolean;
\titems?: SidebarItemWithCollapsible[];
};

export const sidebar: SidebarItemWithCollapsible[] = [
${sections
	.map(([section, entries]) => {
		const title = SECTION_TITLES[section] ?? section;
		const items = toSidebarItems(entries);
		return `\t{
\t\ttext: "${escapeTsString(title)}",
\t\tcollapsible: true,
\t\tcollapsed: true,
\t\titems: [
${items.map((item) => renderSidebarItem(item, 3)).join(",\n")}
\t\t],
\t}`;
	})
	.join(",\n")}
];
`;

fs.writeFileSync(outputPath, sidebarSource, "utf8");
console.log(`Sidebar generated: ${path.relative(cwd, outputPath)} (${sections.length} sections).`);
