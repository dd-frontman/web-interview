## Центрирование в CSS: полный практический справочник

У центрирования всегда есть контекст:

1. Что центрируем: текст, блок, один элемент, группу элементов, overlay.
2. По какой оси: горизонталь, вертикаль или обе.
3. В каком layout-контексте: normal flow, flex, grid, absolute/fixed.

Ниже собраны практически все рабочие кейсы, которые встречаются в реальной верстке.

## 0) Базовая карта выбора

1. Текст/inline-контент: `text-align: center`.
2. Блочный элемент в потоке: `margin-inline: auto`.
3. Одна или несколько карточек в контейнере: Flex/Grid.
4. Overlay/модалка поверх контента: `position + transform` или `inset + margin: auto`.
5. Медиа в контейнере: `object-fit`/`object-position` или `background-position`.

## 1) Текст и inline-контент

### 1.1 Центр текста по горизонтали

```css
.title {
	text-align: center;
}
```

Работает для текста и inline/inline-block потомков.

### 1.2 Центр одной строки по вертикали (legacy-прием)

```css
.pill {
	height: 40px;
	line-height: 40px;
	text-align: center;
}
```

Подходит только для одной строки и фиксированной высоты.

## 2) Блочный элемент в обычном потоке

### 2.1 Горизонтальный центр через auto margins

```css
.card {
	width: 320px;
	margin-inline: auto;
}
```

Условия:

- элемент блочный
- его ширина меньше контейнера

### 2.2 Для неизвестной фиксированной ширины контента

```css
.tag-cloud {
	width: fit-content;
	margin-inline: auto;
}
```

Удобно, когда ширина зависит от содержимого.

### 2.3 Центр изображения как блока

```css
img.avatar {
	display: block;
	margin-inline: auto;
}
```

## 3) Центрирование через Flexbox

### 3.1 Один элемент по двум осям

```css
.parent {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 240px;
}
```

### 3.2 Только по горизонтали

```css
.parent {
	display: flex;
	justify-content: center;
}
```

### 3.3 Только по вертикали

```css
.parent {
	display: flex;
	align-items: center;
	min-height: 240px;
}
```

### 3.4 Центр конкретного элемента внутри flex-контейнера

```css
.item {
	margin: auto;
}
```

`margin: auto` в flex может центрировать элемент по свободному пространству.

### 3.5 Много строк (wrap) и центр всей пачки

```css
.grid-like {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-content: center;
	gap: 12px;
	min-height: 300px;
}
```

`align-content` работает только когда есть несколько flex-строк.

## 4) Центрирование через Grid

### 4.1 Один элемент по двум осям

```css
.parent {
	display: grid;
	place-items: center;
	min-height: 240px;
}
```

### 4.2 Центр только по одной оси

```css
.parent {
	display: grid;
	justify-items: center; /* inline axis */
	/* или */
	align-items: center; /* block axis */
}
```

### 4.3 Центр конкретного grid-item

```css
.item {
	place-self: center;
}
```

### 4.4 Центр треков целиком

```css
.parent {
	display: grid;
	grid-template-columns: repeat(3, 120px);
	justify-content: center;
	align-content: center;
	min-height: 300px;
}
```

`justify-content`/`align-content` тут центрируют саму сетку, если есть свободное место.

## 5) Absolute/Fixed центрирование

### 5.1 Классический способ для неизвестного размера

```css
.overlay {
	position: relative;
}

.modal {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
```

### 5.2 Через `inset: 0` + `margin: auto` (когда известны размеры)

```css
.dialog {
	position: absolute;
	inset: 0;
	width: 420px;
	height: 240px;
	margin: auto;
}
```

Работает, когда размер элемента задан (или вычислим).

### 5.3 Центр в viewport

```css
.toast-center {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
```

## 6) Центрирование в таблицах (legacy-кейс)

```css
.cell {
	display: table-cell;
	vertical-align: middle;
	text-align: center;
}
```

Сейчас чаще заменяют на Flex/Grid, но в старом коде встречается.

## 7) Центр медиа и фонов

### 7.1 Фоновая картинка

```css
.hero {
	background-image: url("/img/bg.jpg");
	background-position: center;
	background-size: cover;
}
```

### 7.2 Картинка/видео внутри контейнера

```css
.media {
	width: 100%;
	height: 260px;
	object-fit: cover;
	object-position: center;
}
```

## 8) Центрирование в логических осях (LTR/RTL/writing-mode)

Предпочитай логические свойства:

- `margin-inline: auto` вместо `margin-left/right: auto`
- `inset-inline-start/end` вместо `left/right` при сложной интернационализации

Это делает центрирование устойчивым к RTL и нестандартным writing modes.

## 9) Часто забываемые кейсы

### 9.1 Центр псевдоэлемента (иконка/спиннер)

```css
.button {
	position: relative;
}

.button::after {
	content: "";
	position: absolute;
	inset: 0;
	margin: auto;
	width: 16px;
	height: 16px;
}
```

### 9.2 Центр popup внутри scroll-контейнера

Используй flex/grid на контейнере, а не `position: fixed`, если popup должен жить в границах скролл-блока.

```css
.scroll-panel {
	display: grid;
	place-items: center;
	overflow: auto;
}
```

## 10) Частые ошибки

- `margin: auto` без ограниченной ширины/высоты в normal flow.
- `absolute` без `position: relative` у нужного предка.
- Попытка лечить все `z-index`, когда проблема в stacking context.
- Неправильная ось в flex: `justify-content` и `align-items` меняются местами при `flex-direction: column`.
- Использование `will-change` как "магии для центрирования" (не для этого свойства).

## 11) Мини-шпаргалка по задачам

1. Заголовок по центру: `text-align: center`.
2. Карточка по центру страницы: `margin-inline: auto` + `max-width`.
3. Контент в пустом состоянии по центру блока: `display: grid; place-items: center;`.
4. Кнопка по центру hero: flex/grid на родителе.
5. Модалка в центре экрана: `fixed + transform`.
6. Loader поверх карточки: `absolute + inset: 0 + margin: auto`.

<OfficialDocsLinks
	:links="[
		{
			title: 'MDN: Center an element',
			href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Layout_cookbook/Center_an_element',
		},
		{
			title: 'MDN: Aligning items in a flex container',
			href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container',
		},
		{
			title: 'MDN: Box alignment in grid layout',
			href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Box_alignment_in_grid_layout',
		},
		{ title: 'MDN: position', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/position' },
		{ title: 'MDN: margin', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/margin' },
	]"
/>

---

<RelatedTopics
	:items="[
		{ title: 'Позиционирование в CSS', href: '/css/pozitsionirovanie-v-css' },
		{ title: 'z-index и stacking context', href: '/css/z-index-i-stacking-context' },
		{ title: 'Shadow DOM', href: '/html/shadow-dom' },
	]"
/>
