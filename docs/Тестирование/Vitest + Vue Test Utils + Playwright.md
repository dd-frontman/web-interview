## 1) **Vitest**

✔ Тест-раннер — запускает тесты, аналог Jest  
✔ Лёгкий, быстрый, отлично интегрируется с Vite  
✔ Поддерживает snapshot-тесты, моки, асинхронные тесты  
✔ Может запускать тесты **в Node (JSDOM)** или в **браузере через Playwright** (browser mode) [vitest.dev](https://vitest.dev/guide/browser/?utm_source=chatgpt.com)

👉 Используется в первую очередь для **юнит-тестов** и **интеграционных тестов компонентов**.

---

## 2) **Vue Test Utils (VTU)**

✔ Официальная утилита для тестирования Vue-компонентов  
✔ Позволяет **монтировать компонент** и взаимодействовать с ним  
✔ Хочешь проверить рендер, props, эмиты, события, методы? — тебе сюда [test-utils.vuejs.org](https://test-utils.vuejs.org/guide/?utm_source=chatgpt.com)

Пример простого VTU-теста с Vitest:

```js
import { mount } from "@vue/test-utils";
import MyComponent from "@/components/MyComponent.vue";

test("renders message", () => {
	const wrapper = mount(MyComponent, { props: { msg: "Hello" } });
	expect(wrapper.text()).toContain("Hello");
});
```

📌 VTU работает _локально_, без реального браузера (серверная/эмитируемая среда — JSDOM). [test-utils.vuejs.org](https://test-utils.vuejs.org/guide/?utm_source=chatgpt.com)

---

## 3) **Playwright**

✔ Инструмент для **E2E** и **UI-тестирования**, работает с реальным браузером  
✔ Может запускать тесты в Chrome/Firefox/WebKit, делает клики, навигацию, ассерты на UI [DEV Community](https://dev.to/uncle_ben/testing-vuejs-with-playwright-a-funny-journey-to-flawless-web-apps-3h3g?utm_source=chatgpt.com)

👉 Playwright позволяет тестировать приложение **как пользователь**: переходы по страницам, заполнение форм, клики, сети, навигации, URL и т.п.

---

# 🧠 Как эти три инструмента дополняют друг друга

Modern testing strategy обычно строится как **пирамида**:

```sql
     E2E (мало, но важно)
       ↑ Playwright
    Integration (средне)
       ↑ Vitest + Vue Test Utils + browser mode
    Unit (много)
       ↑ Vitest + Vue Test Utils

```

---

## 🧩 Уровни тестирования

### ✅ **Юнит-тесты — Vitest + Vue Test Utils**

- проверяют **отдельный компонент / composable / утилиту**
- быстрые, маленькие (работают в JSDOM)
- примеры: проверка рендера, работы методов, эмитов, реактивности

| Что тестируем               | Инструменты             |
| --------------------------- | ----------------------- |
| отдельный компонент         | Vitest + Vue Test Utils |
| composable (реактивный код) | Vitest                  |
| утилиты                     | Vitest                  |

📌 Это базовый уровень — тесты должны быть быстрыми и лёгкими. [ru.vuejs.org](https://ru.vuejs.org/guide/scaling-up/testing?utm_source=chatgpt.com)

---

### 🧪 **Интеграционные / компонентные тесты с браузерной средой**

По умолчанию Vitest работает с JSDOM — это _псевдо-браузер_, который не всегда точно отражает поведение реального DOM, CSS, layout и т.п.  
Здесь может помочь **Vitest Browser Mode**, который запускает тесты **в реальном браузере через Playwright**:

✔ компоненты рендерятся в реальном браузере  
✔ CSS, layout, события, focus, pointer — более реалистично  
✔ можно тестить интеграцию с `router`, сторонними либами и т.п. [vitest.dev](https://vitest.dev/guide/browser/?utm_source=chatgpt.com)

Пример включения browser mode в `vitest.config.js` (Chromium):

```js
export default {
	test: {
		browser: {
			enabled: true,
			provider: "playwright",
			name: "chromium",
		},
	},
};
```

Затем ты пишешь тесты как обычно, но Vitest **открывает настоящий браузер** и рендерит Vue-компоненты. [DEV Community](https://dev.to/mayashavin/reliable-component-testing-with-vitests-browser-mode-and-playwright-k9m?utm_source=chatgpt.com)

---

### 🚀 **E2E тесты — Playwright**

Playwright здесь выступает уже **как отдельный фреймворк тестирования**, запускающий весь сайт в браузере:

✔ goto страницы  
✔ клики, навигация  
✔ проверка URL, сетевых запросов (mock/route)  
✔ UI поведения в разных браузерах [DEV Community](https://dev.to/uncle_ben/testing-vuejs-with-playwright-a-funny-journey-to-flawless-web-apps-3h3g?utm_source=chatgpt.com)

Примеры:

```js
import { test, expect } from "@playwright/test";

test("user logs in", async ({ page }) => {
	await page.goto("/");
	await page.fill("#username", "user1");
	await page.click("#login-btn");
	await expect(page.locator("#greeting")).toHaveText("Hello user1!");
});
```

Этот уровень — «пользовательские» тесты, покрывающие реальные сцены использования приложения. [DEV Community](https://dev.to/uncle_ben/testing-vuejs-with-playwright-a-funny-journey-to-flawless-web-apps-3h3g?utm_source=chatgpt.com)

---

# 🧠 Роль Vue Test Utils

`@vue/test-utils` — это библиотека для **монтажа, инспекции и взаимодействия с компонентами Vue**:

✔ `mount()` — монтирует компонент как реальный  
✔ `find()` / `findComponent()` — ищет элементы/компоненты  
✔ `.trigger()` — имитирует события  
✔ `.text()` / `.html()` / `.props()` — инспекция результирующего DOM [test-utils.vuejs.org](https://test-utils.vuejs.org/guide/?utm_source=chatgpt.com)

---

# 🧠 Как это реализовано на практике

## 🎯 Юнит-тест с Vitest + Vue Test Utils

```js
import { mount } from "@vue/test-utils";
import Counter from "@/components/Counter.vue";

test("increments value", () => {
	const wrapper = mount(Counter);
	wrapper.find("button.increment").trigger("click");
	expect(wrapper.text()).toContain("Count: 1");
});
```

---

## 🎯 Интеграционный тест (browser mode)

```js
// vitest.config.ts:
// test.browser.enabled: true, provider: 'playwright'

import { render } from "@vitest/browser-vue";
import App from "@/App.vue";

test("renders component and reacts", async ({ page }) => {
	await page.goto("/component-page");
	await expect(page.getByRole("button")).toBeVisible();
});
```

Здесь Vitest управляет запуском браузера (через Playwright) и предоставляет API тестов. [DEV Community](https://dev.to/mayashavin/reliable-component-testing-with-vitests-browser-mode-and-playwright-k9m?utm_source=chatgpt.com)

---

## 🎯 E2E тест с Playwright

```js
import { test, expect } from "@playwright/test";

test("full login scenario", async ({ page }) => {
	await page.goto("/");
	await page.fill('input[name="email"]', "test@example.com");
	await page.click('button[type="submit"]');
	await expect(page).toHaveURL("/dashboard");
});
```

---

# 🧠 Советы по связке

---

### 📌 Pyramid-подход

```java
🛠 unit tests               (Vitest + VTU)
⬆
⚙ integration/browser tests (Vitest browser mode + Playwright)
⬆
🌍 E2E tests               (Playwright)


```

База — много быстрых unit-тестов; меньше браузерных интеграций; ещё меньше полномасштабных E2E.

---

### 📌 Моки и данные

Для изоляции use cases в Vitest и VTU можно мокать API, Pinia, хранилища, роутер, чтобы не зависеть от настоящего сервера в каждом тесте. [Pinia](https://pinia.vuejs.org/cookbook/testing.html?utm_source=chatgpt.com)

---

### 📌 Visual testing

Vitest может делать **snapshot-тесты UI**, а Playwright — **pixel-based проверки** (сравнение скриншотов), что хорошо для визуальных регрессий. [DEV Community](https://dev.to/mayashavin/effective-visual-regression-testing-for-developers-vitest-vs-playwright-3la?utm_source=chatgpt.com)

---

# 📌 Итог

| Уровень                             | Инструмент                       | Используется                     |
| ----------------------------------- | -------------------------------- | -------------------------------- |
| **Unit**                            | Vitest + Vue Test Utils          | Компоненты и функции             |
| **Integration/Component (browser)** | Vitest browser mode + Playwright | Реальный DOM, события            |
| **E2E/UI**                          | Playwright                       | Полный пользовательский сценарий |
