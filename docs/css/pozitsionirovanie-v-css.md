## Позиционирование в CSS: что это

`position` управляет тем, как элемент участвует в потоке документа и как работают `top/right/bottom/left`.

Основные значения:

- `static` (по умолчанию)
- `relative`
- `absolute`
- `fixed`
- `sticky`

## 1) `static`

```css
.item {
	position: static;
}
```

- элемент в обычном потоке
- `top/right/bottom/left` не работают

## 2) `relative`

```css
.badge {
	position: relative;
	top: 4px;
	left: 8px;
}
```

- элемент остается в потоке
- визуально смещается от своего обычного места
- часто используют как "якорь" для `absolute`-детей

## 3) `absolute`

```css
.card {
	position: relative;
}

.card__icon {
	position: absolute;
	top: 8px;
	right: 8px;
}
```

- элемент исключается из потока
- позиционируется относительно ближайшего "positioned ancestor"
- если такого предка нет, относительно viewport/начального containing block

## 4) `fixed`

```css
.chat-button {
	position: fixed;
	right: 16px;
	bottom: 16px;
}
```

- элемент исключается из потока
- привязан к viewport
- часто для FAB-кнопок, sticky-панелей, cookie-баннеров

## 5) `sticky`

```css
.table-head {
	position: sticky;
	top: 0;
	background: white;
}
```

- в обычном потоке до порога прокрутки
- после порога ведет себя как `fixed` внутри ближайшего scroll-контейнера
- нужен порог (`top`, `bottom`, ...)

## Пример: шапка + бейдж в карточке

```html
<header class="header">Каталог</header>
<article class="card">
	<button class="badge">New</button>
	<h3>Товар</h3>
</article>
```

```css
.header {
	position: sticky;
	top: 0;
	z-index: 10;
}

.card {
	position: relative;
}

.badge {
	position: absolute;
	top: 8px;
	right: 8px;
}
```

## Частые ошибки

- `absolute` "улетает", потому что у родителя нет `position: relative`.
- `sticky` не работает, если у контейнера неподходящий `overflow`.
- `z-index` пытаются чинить без понимания stacking context.

<OfficialDocsLinks
	:links="[
		{ title: 'MDN: position', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/position' },
		{
			title: 'MDN: Learn CSS positioning',
			href: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Positioning',
		},
	]"
/>

---

<RelatedTopics
	:items="[
		{ title: 'Центрирование в CSS', href: '/css/tsentrirovanie-v-css' },
		{ title: 'z-index и stacking context', href: '/css/z-index-i-stacking-context' },
		{ title: 'will-change', href: '/css/will-change' },
	]"
/>
