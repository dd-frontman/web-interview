## Что такое `will-change`

`will-change` — это подсказка браузеру: "это свойство скоро изменится, подготовь оптимизации заранее".

Пример:

```css
.card {
	will-change: transform;
}
```

## Когда использовать

Только для "горячих" мест:

- сложные анимации/переходы
- элементы, которые часто двигаются/фейдятся
- тяжелые сцены, где есть явный профит после профилирования

## Когда не использовать

- "на всякий случай" для всех элементов
- постоянно на десятках/сотнях нод

`will-change` может увеличивать расход памяти и даже ухудшить производительность.

## Практичный паттерн: включать временно

```ts
const el = document.querySelector(".panel");

function startAnimation() {
	el.style.willChange = "transform, opacity";
	requestAnimationFrame(() => {
		el.classList.add("panel--open");
	});
}

function endAnimation() {
	el.classList.remove("panel--open");
	el.addEventListener(
		"transitionend",
		() => {
			el.style.willChange = "auto";
		},
		{ once: true }
	);
}
```

Идея:

1. включить перед анимацией
2. выключить сразу после

## Что чаще всего указывать

- `transform`
- `opacity`

Это самые безопасные кандидаты для анимаций в UI.

<OfficialDocsLinks
	:links="[
		{ title: 'MDN: will-change', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/will-change' },
	]"
/>

---

<RelatedTopics
	:items="[
		{ title: 'z-index и stacking context', href: '/css/z-index-i-stacking-context' },
		{ title: 'Позиционирование в CSS', href: '/css/pozitsionirovanie-v-css' },
		{ title: 'LCP, INP, TTI', href: '/brauzery/lcp-inp-tti' },
	]"
/>
