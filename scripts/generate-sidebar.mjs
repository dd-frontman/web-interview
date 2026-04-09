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
	"voprosy",
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
	voprosy: "Вопросы",
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
	"/javascript/object-freeze/object-seal": "Object.seal()",
	"/javascript/object-freeze/object-prevent-extensions": "Object.preventExtensions()",
	"/javascript/object-freeze/freeze-vs-seal-vs-prevent-extensions": "Сравнение режимов",
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
	"/voprosy/api-i-kontrakty-mezhdu-frontend-i-backend/1-kak-organizovat-api-sloi": "1. Как вы обычно организуете API-слой во frontend-проекте?",
	"/voprosy/api-i-kontrakty-mezhdu-frontend-i-backend/2-preimushchestva-openapi-i-generatsii-klientov": "2. Какие преимущества даёт OpenAPI и генерация клиентов?",
	"/voprosy/api-i-kontrakty-mezhdu-frontend-i-backend/3-chto-dayut-generatsiya-tipov-i-kontraktov": "3. Что именно даёт генерация типов и контрактов для frontend-команды?",
	"/voprosy/api-i-kontrakty-mezhdu-frontend-i-backend/4-ogranicheniya-openapi-code-generation": "4. Какие ограничения есть у подхода с OpenAPI code generation?",
	"/voprosy/api-i-kontrakty-mezhdu-frontend-i-backend/5-kak-otdelyat-dto-ot-vnutrennikh-modelei": "5. Как вы отделяете DTO, приходящие с backend, от внутренних моделей frontend-приложения?",
	"/voprosy/praktika-vue-i-reaktivnost/1-kogda-ispolzovat-computed-watch-watcheffect": "1. Когда использовать computed, watch и watchEffect?",
	"/voprosy/praktika-vue-i-reaktivnost/2-kak-obrabotat-race-condition-v-async-watch": "2. Как обработать race condition в async watch?",
	"/voprosy/praktika-vue-i-reaktivnost/3-chto-delaet-cleanup-v-watch": "3. Что делает cleanup в watch?",
	"/voprosy/praktika-vue-i-reaktivnost/4-kak-vyzvat-metod-dochernego-komponenta": "4. Как вызвать метод дочернего компонента из родителя (defineExpose)?",
	"/voprosy/praktika-vue-i-reaktivnost/5-chto-takoe-suspense-i-kogda-ispolzovat": "5. Что такое Suspense и когда его использовать?",
	"/voprosy/praktika-vue-i-reaktivnost/6-pochemu-nelzya-ispolzovat-index-kak-key": "6. Почему нельзя использовать index как key в v-for?",
	"/voprosy/praktika-vue-i-reaktivnost/7-chto-proiskhodit-pri-potere-reaktivnosti": "7. Что происходит при потере реактивности?",
	"/voprosy/praktika-vue-i-reaktivnost/8-kak-opredelit-chto-komponent-slishkom-bolshoi": "8. Как определить, что компонент слишком большой?",
	"/voprosy/praktika-vue-i-reaktivnost/9-kogda-logiku-stoit-vynosat-v-composable": "9. Когда логику стоит выносить в composable?",
	"/voprosy/praktika-vue-i-reaktivnost/10-priznaki-plokhoi-reaktivnoi-arkhitektury": "10. Какие признаки указывают на плохую реактивную архитектуру?",
	"/voprosy/opyt-i-slozhnye-zadachi/1-samaya-slozhnaya-zadacha": "1. Какая задача в вашем опыте была самой сложной и больше всего повлияла на ваш рост как инженера?",
	"/voprosy/opyt-i-slozhnye-zadachi/2-vyzovy-v-legacy-proektakh": "2. С какими техническими или архитектурными вызовами вы сталкивались в legacy-проектах?",
	"/voprosy/opyt-i-slozhnye-zadachi/3-tekhnicheskii-dolg-i-ustarevshii-stek": "3. Расскажите про проект, где вам пришлось работать с техническим долгом или устаревшим стеком. В чём была основная сложность?",
	"/voprosy/migratsiya-s-vue-2-na-vue-3/1-osnovnye-slozhnosti-migratsii": "1. Какие основные сложности возникают при миграции с Vue 2 на Vue 3?",
	"/voprosy/migratsiya-s-vue-2-na-vue-3/2-bezopasnyi-podkhod-k-migratsii": "2. Какой подход к миграции Vue 2 -> Vue 3 вы считаете наиболее безопасным и практичным?",
	"/voprosy/migratsiya-s-vue-2-na-vue-3/3-kakie-chasti-sistemy-trebuyut-migratsii": "3. Какие части системы, кроме компонентов, обычно требуют миграции при переходе на Vue 3?",
	"/voprosy/migratsiya-s-vue-2-na-vue-3/4-migratsiya-vuex-na-pinia": "4. Как вы подходите к миграции Vuex на Pinia?",
	"/voprosy/migratsiya-s-vue-2-na-vue-3/5-pochemu-stoit-zamenyat-mixins-na-composables": "5. Почему имеет смысл заменять mixins на composables?",
	"/voprosy/migratsiya-s-vue-2-na-vue-3/6-kakie-arkhitekturnye-uluchsheniya-delat-parallelno": "6. Какие архитектурные улучшения имеет смысл делать параллельно с миграцией на новую версию фреймворка?",
	"/voprosy/migratsiya-s-vue-2-na-vue-3/7-perekhod-ot-monolita-k-modulnoi-arkhitekture": "7. Как вы понимаете переход от монолитной frontend-архитектуры к модульной?",
	"/voprosy/code-review-i-analiz-koda/1-kak-vy-provodite-code-review": "1. Как вы проводите code review?",
	"/voprosy/code-review-i-analiz-koda/2-na-chto-smotrite-v-pervuyu-ochered-pri-revyu": "2. На что вы смотрите в первую очередь при ревью кода?",
	"/voprosy/code-review-i-analiz-koda/3-kriterii-v-code-review": "3. Какие критерии для вас самые важные в code review?",
	"/voprosy/code-review-i-analiz-koda/4-kak-proveryaete-sootvetstvie-arkhitekture": "4. Как вы проверяете, соответствует ли код архитектуре проекта?",
	"/voprosy/code-review-i-analiz-koda/5-tipovye-oshibki-vo-vue-kode": "5. Какие типовые ошибки во Vue-коде вы чаще всего замечаете на code review?",
	"/voprosy/code-review-i-analiz-koda/6-kak-formuliruete-zamechaniya": "6. Как вы формулируете замечания на code review?",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii/1-kak-povyshat-otkazoustoichivost-frontend-prilozheniya": "1. Как вы повышаете отказоустойчивость frontend-приложения?",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii/2-kak-sdelat-padeniya-bolee-predskazuemymi-i-diagnostiruemymi": "2. Как сделать так, чтобы падения приложения в проде были более предсказуемыми и диагностируемыми?",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii/3-instrumenty-dlya-monitoringa-frontend-prilozheniya": "3. Какие инструменты вы используете для мониторинга frontend-приложения?",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii/4-kak-organizovat-sbor-oshibok-na-kliente": "4. Как вы организуете сбор ошибок на клиенте?",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii/5-chto-otpravlyat-v-error-tracking": "5. Что должно попадать в error tracking помимо текста ошибки?",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii/6-kak-diagnostirovat-padenie-u-chasti-polzovatelei": "6. Как вы диагностируете проблему, если приложение падает только у части пользователей?",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii/7-kakie-metriki-sobirat-na-frontend": "7. Какие метрики полезно собирать на frontend?",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii/8-chem-testy-otlichayutsya-ot-prodovoi-nablyudaemosti": "8. Чем отличаются тесты от продовой наблюдаемости?",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii/9-kak-organizovat-logirovanie-polzovatelskikh-stsenariev": "9. Как бы вы организовали логирование пользовательских сценариев на клиенте?",
	"/voprosy/vue-i-frontend-ekosistema/1-vazhnye-vozmozhnosti-vue-3": "1. Какие возможности Vue 3 вы считаете наиболее важными в реальной разработке?",
	"/voprosy/vue-i-frontend-ekosistema/2-kogda-ispolzovat-composition-api": "2. В каких случаях вы используете Composition API и какие преимущества он даёт?",
	"/voprosy/vue-i-frontend-ekosistema/3-gde-polezny-teleport-i-suspense": "3. Где на практике полезны Teleport и Suspense?",
	"/voprosy/vue-i-frontend-ekosistema/4-kak-ustroena-reaktivnost-vue-3": "4. Как устроена реактивность во Vue 3 на высоком уровне?",
	"/voprosy/vue-i-frontend-ekosistema/5-chem-ref-otlichaetsya-ot-reactive": "5. Чем ref отличается от reactive?",
	"/voprosy/vue-i-frontend-ekosistema/6-kogda-watch-luchshe-computed": "6. В каких случаях watch лучше computed, а в каких нет?",
	"/voprosy/vue-i-frontend-ekosistema/7-pochemu-deep-watch-mozhet-byt-dorogim": "7. Почему deep watch может быть дорогим?",
	"/voprosy/vue-i-frontend-ekosistema/8-oshibki-pri-rabote-s-reaktivnostyu": "8. Какие ошибки чаще всего допускают разработчики при работе с реактивностью во Vue?",
	"/voprosy/state-management/1-kogda-nuzhen-globalnyi-store": "1. Когда в проекте действительно нужен глобальный store, а когда можно обойтись без него?",
	"/voprosy/state-management/2-pochemu-vybrat-pinia": "2. Почему вы бы выбрали Pinia для Vue-проекта?",
	"/voprosy/state-management/3-otlichiya-pinia-ot-vuex": "3. В чём основные отличия Pinia от Vuex?",
	"/voprosy/state-management/4-kogda-rassmatrivat-alternativy-dlya-state-management": "4. В каких случаях вы бы рассмотрели альтернативные решения для state management?",
	"/voprosy/vybor-steka-i-arkhitekturnye-resheniya/1-kakoi-stek-vybrat-dlya-novogo-proekta": "1. Какой стек вы бы выбрали для нового frontend-проекта и почему?",
	"/voprosy/vybor-steka-i-arkhitekturnye-resheniya/2-kakie-faktory-utochnyat-pered-vyborom-steka": "2. Какие факторы вы уточняете перед тем, как предлагать стек для нового проекта?",
	"/voprosy/vybor-steka-i-arkhitekturnye-resheniya/3-kogda-dostatochno-csr-a-kogda-ssr": "3. В каких случаях для проекта достаточно CSR, а когда стоит рассматривать SSR?",
	"/voprosy/vybor-steka-i-arkhitekturnye-resheniya/4-preimushchestva-ssr": "4. Какие преимущества даёт SSR?",
	"/voprosy/vybor-steka-i-arkhitekturnye-resheniya/5-izderzhki-ssr": "5. Какие дополнительные издержки появляются при использовании SSR?",
	"/voprosy/vybor-steka-i-arkhitekturnye-resheniya/6-kogda-podklyuchat-typescript": "6. Когда TypeScript стоит подключать с самого начала, а когда допустим поэтапный переход?",
	"/voprosy/vybor-steka-i-arkhitekturnye-resheniya/7-bazovye-instrumenty-dlya-frontend-proekta": "7. Какие инструменты и библиотеки вы считаете базовыми для современного frontend-проекта?",
	"/voprosy/vybor-steka-i-arkhitekturnye-resheniya/8-chto-dobavit-dlya-kachestva-razrabotki": "8. Что бы вы добавили в проект помимо Vue, TypeScript и роутера, чтобы улучшить качество разработки и сопровождения?",
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

const FULL_TITLE_ROUTES = new Set([
	"/voprosy/api-i-kontrakty-mezhdu-frontend-i-backend/1-kak-organizovat-api-sloi",
	"/voprosy/api-i-kontrakty-mezhdu-frontend-i-backend/2-preimushchestva-openapi-i-generatsii-klientov",
	"/voprosy/api-i-kontrakty-mezhdu-frontend-i-backend/3-chto-dayut-generatsiya-tipov-i-kontraktov",
	"/voprosy/api-i-kontrakty-mezhdu-frontend-i-backend/4-ogranicheniya-openapi-code-generation",
	"/voprosy/api-i-kontrakty-mezhdu-frontend-i-backend/5-kak-otdelyat-dto-ot-vnutrennikh-modelei",
	"/voprosy/opyt-i-slozhnye-zadachi/1-samaya-slozhnaya-zadacha",
	"/voprosy/opyt-i-slozhnye-zadachi/2-vyzovy-v-legacy-proektakh",
	"/voprosy/opyt-i-slozhnye-zadachi/3-tekhnicheskii-dolg-i-ustarevshii-stek",
	"/voprosy/migratsiya-s-vue-2-na-vue-3/1-osnovnye-slozhnosti-migratsii",
	"/voprosy/migratsiya-s-vue-2-na-vue-3/2-bezopasnyi-podkhod-k-migratsii",
	"/voprosy/migratsiya-s-vue-2-na-vue-3/3-kakie-chasti-sistemy-trebuyut-migratsii",
	"/voprosy/migratsiya-s-vue-2-na-vue-3/4-migratsiya-vuex-na-pinia",
	"/voprosy/migratsiya-s-vue-2-na-vue-3/5-pochemu-stoit-zamenyat-mixins-na-composables",
	"/voprosy/migratsiya-s-vue-2-na-vue-3/6-kakie-arkhitekturnye-uluchsheniya-delat-parallelno",
	"/voprosy/migratsiya-s-vue-2-na-vue-3/7-perekhod-ot-monolita-k-modulnoi-arkhitekture",
	"/voprosy/code-review-i-analiz-koda/1-kak-vy-provodite-code-review",
	"/voprosy/code-review-i-analiz-koda/2-na-chto-smotrite-v-pervuyu-ochered-pri-revyu",
	"/voprosy/code-review-i-analiz-koda/3-kriterii-v-code-review",
	"/voprosy/code-review-i-analiz-koda/4-kak-proveryaete-sootvetstvie-arkhitekture",
	"/voprosy/code-review-i-analiz-koda/5-tipovye-oshibki-vo-vue-kode",
	"/voprosy/code-review-i-analiz-koda/6-kak-formuliruete-zamechaniya",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii/1-kak-povyshat-otkazoustoichivost-frontend-prilozheniya",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii/2-kak-sdelat-padeniya-bolee-predskazuemymi-i-diagnostiruemymi",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii/3-instrumenty-dlya-monitoringa-frontend-prilozheniya",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii/4-kak-organizovat-sbor-oshibok-na-kliente",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii/5-chto-otpravlyat-v-error-tracking",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii/6-kak-diagnostirovat-padenie-u-chasti-polzovatelei",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii/7-kakie-metriki-sobirat-na-frontend",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii/8-chem-testy-otlichayutsya-ot-prodovoi-nablyudaemosti",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii/9-kak-organizovat-logirovanie-polzovatelskikh-stsenariev",
	"/voprosy/praktika-vue-i-reaktivnost/1-kogda-ispolzovat-computed-watch-watcheffect",
	"/voprosy/praktika-vue-i-reaktivnost/2-kak-obrabotat-race-condition-v-async-watch",
	"/voprosy/praktika-vue-i-reaktivnost/3-chto-delaet-cleanup-v-watch",
	"/voprosy/praktika-vue-i-reaktivnost/4-kak-vyzvat-metod-dochernego-komponenta",
	"/voprosy/praktika-vue-i-reaktivnost/5-chto-takoe-suspense-i-kogda-ispolzovat",
	"/voprosy/praktika-vue-i-reaktivnost/6-pochemu-nelzya-ispolzovat-index-kak-key",
	"/voprosy/praktika-vue-i-reaktivnost/7-chto-proiskhodit-pri-potere-reaktivnosti",
	"/voprosy/praktika-vue-i-reaktivnost/8-kak-opredelit-chto-komponent-slishkom-bolshoi",
	"/voprosy/praktika-vue-i-reaktivnost/9-kogda-logiku-stoit-vynosat-v-composable",
	"/voprosy/praktika-vue-i-reaktivnost/10-priznaki-plokhoi-reaktivnoi-arkhitektury",
	"/voprosy/state-management/1-kogda-nuzhen-globalnyi-store",
	"/voprosy/state-management/2-pochemu-vybrat-pinia",
	"/voprosy/state-management/3-otlichiya-pinia-ot-vuex",
	"/voprosy/state-management/4-kogda-rassmatrivat-alternativy-dlya-state-management",
	"/voprosy/vue-i-frontend-ekosistema/1-vazhnye-vozmozhnosti-vue-3",
	"/voprosy/vue-i-frontend-ekosistema/2-kogda-ispolzovat-composition-api",
	"/voprosy/vue-i-frontend-ekosistema/3-gde-polezny-teleport-i-suspense",
	"/voprosy/vue-i-frontend-ekosistema/4-kak-ustroena-reaktivnost-vue-3",
	"/voprosy/vue-i-frontend-ekosistema/5-chem-ref-otlichaetsya-ot-reactive",
	"/voprosy/vue-i-frontend-ekosistema/6-kogda-watch-luchshe-computed",
	"/voprosy/vue-i-frontend-ekosistema/7-pochemu-deep-watch-mozhet-byt-dorogim",
	"/voprosy/vue-i-frontend-ekosistema/8-oshibki-pri-rabote-s-reaktivnostyu",
	"/voprosy/vybor-steka-i-arkhitekturnye-resheniya/1-kakoi-stek-vybrat-dlya-novogo-proekta",
	"/voprosy/vybor-steka-i-arkhitekturnye-resheniya/2-kakie-faktory-utochnyat-pered-vyborom-steka",
	"/voprosy/vybor-steka-i-arkhitekturnye-resheniya/3-kogda-dostatochno-csr-a-kogda-ssr",
	"/voprosy/vybor-steka-i-arkhitekturnye-resheniya/4-preimushchestva-ssr",
	"/voprosy/vybor-steka-i-arkhitekturnye-resheniya/5-izderzhki-ssr",
	"/voprosy/vybor-steka-i-arkhitekturnye-resheniya/6-kogda-podklyuchat-typescript",
	"/voprosy/vybor-steka-i-arkhitekturnye-resheniya/7-bazovye-instrumenty-dlya-frontend-proekta",
	"/voprosy/vybor-steka-i-arkhitekturnye-resheniya/8-chto-dobavit-dlya-kachestva-razrabotki",
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
	"/vue/bandlery": "Бандлеры",
	"/vue/ref-and-reactive": "Ref & reactive",
	"/vue/story": "Сторы",
	"/vue/zadachi": "Задачи",
	"/react/khuki": "Хуки",
	"/javascript/tipy-dannykh": "Типы данных",
	"/javascript/kollektsii-dannykh": "Коллекции данных",
	"/javascript/object-freeze": "Контроль мутаций объекта",
	"/nuxt/rezhimy-rendera": "Режимы рендера",
	"/brauzery/garbage-collector": "Garbage Collector",
	"/brauzery/crp": "CRP",
	"/brauzery/versii-http": "Версии HTTP",
	"/typescript/zadachi": "Задачи",
	"/sborschiki/vite": "Vite",
	"/voprosy/api-i-kontrakty-mezhdu-frontend-i-backend": "API и контракты между frontend и backend",
	"/voprosy/code-review-i-analiz-koda": "Code Review и анализ кода",
	"/voprosy/migratsiya-s-vue-2-na-vue-3": "Миграция Vue 2 на Vue 3",
	"/voprosy/nadezhnost-monitoring-i-podderzhka-frontend-prilozhenii": "Надёжность, мониторинг и поддержка frontend-приложений",
	"/voprosy/opyt-i-slozhnye-zadachi": "Опыт и сложные задачи",
	"/voprosy/praktika-vue-i-reaktivnost": "Практика Vue и реактивность",
	"/voprosy/state-management": "State management",
	"/voprosy/vue-i-frontend-ekosistema": "Vue и frontend-экосистема",
	"/voprosy/vybor-steka-i-arkhitekturnye-resheniya": "Выбор стека и архитектурные решения",
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
	const keepFullTitle = FULL_TITLE_ROUTES.has(publicRoute) || FULL_TITLE_ROUTES.has(route);
	const override = TITLE_OVERRIDES[publicRoute] ?? TITLE_OVERRIDES[route];
	if (override) {
		return keepFullTitle ? override.trim() : compactTitle(override);
	}

	if (typeof frontmatter.title === "string" && frontmatter.title.trim()) {
		const title = frontmatter.title.trim();
		if (looksLikeLatinOnlyTitle(title)) {
			const fallbackTitle = extractBestCyrillicHeading(body);
			if (fallbackTitle) {
				return keepFullTitle ? fallbackTitle : compactTitle(fallbackTitle);
			}
		}
		return keepFullTitle ? title : compactTitle(title);
	}
	const inferredTitle = inferTitle(route, body);
	return keepFullTitle ? inferredTitle : compactTitle(inferredTitle);
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
	const titleCollator = new Intl.Collator("ru", {
		numeric: true,
		sensitivity: "base",
	});

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
		return items.sort((a, b) => titleCollator.compare(a.text, b.text));
	}

	function renderGroup(group) {
		const childGroups = Array.from(group.children.values())
			.sort((a, b) => titleCollator.compare(a.text, b.text))
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
		.sort((a, b) => titleCollator.compare(a.text, b.text))
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
