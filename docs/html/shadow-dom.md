## Что такое Shadow DOM

Shadow DOM — это механизм Web Components, который дает компоненту собственное "внутреннее дерево" DOM со стилевой изоляцией.

Проще:

- у компонента есть обычный DOM снаружи
- и скрытый DOM внутри (`shadow root`)
- стили внутри не протекают наружу и наоборот (с оговорками про custom properties и `::part`)

## Зачем он нужен

- изоляция стилей (меньше конфликтов CSS)
- капсулированная разметка компонента
- предсказуемое поведение переиспользуемых UI-элементов

## Базовый пример

```js
class XBadge extends HTMLElement {
	constructor() {
		super();

		const root = this.attachShadow({ mode: "open" });
		root.innerHTML = `
      <style>
        .badge {
          padding: 4px 8px;
          border-radius: 999px;
          background: #111;
          color: #fff;
          font: 12px/1.2 sans-serif;
        }
      </style>
      <span class="badge"><slot></slot></span>
    `;
	}
}

customElements.define("x-badge", XBadge);
```

```html
<x-badge>New</x-badge>
```

## `open` vs `closed`

`attachShadow({ mode: "open" })`

- можно получить `element.shadowRoot` из JS

`attachShadow({ mode: "closed" })`

- `element.shadowRoot` снаружи вернет `null`
- внутренности более скрыты для внешнего кода

## Слоты (проекция внешнего контента)

`<slot>` позволяет вставить внешний контент внутрь shadow-разметки.

```html
<x-card>
	<h3 slot="title">Заголовок</h3>
	<p>Обычный контент карточки</p>
</x-card>
```

В компоненте:

```html
<slot name="title"></slot>
<slot></slot>
```

## Что важно помнить

- глобальные CSS-классы не стилизуют внутренности shadow root напрямую
- для кастомизации обычно используют CSS custom properties и `::part`
- событие из shadow может "пробулькать" наружу, если оно `composed`

<OfficialDocsLinks
	:links="[
		{
			title: 'MDN: Using shadow DOM',
			href: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM',
		},
	]"
/>

---

<RelatedTopics
	:items="[
		{ title: 'Семантические теги', href: '/html/semanticheskie-tegi' },
		{ title: 'Центрирование в CSS', href: '/css/tsentrirovanie-v-css' },
		{ title: 'z-index и stacking context', href: '/css/z-index-i-stacking-context' },
	]"
/>
