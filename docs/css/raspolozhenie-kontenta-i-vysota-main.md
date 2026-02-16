## Расположение контента на странице и растягивание `main`

Частая задача: сделать layout "шапка + контент + футер" так, чтобы:

- при коротком контенте футер был внизу экрана
- при длинном контенте страница нормально скроллилась
- `main` занимал оставшуюся высоту

Ниже рабочие схемы и подводные камни.

## 1) Базовый паттерн через Flex (самый практичный)

```html
<body class="page">
	<header>Header</header>
	<main>Main content</main>
	<footer>Footer</footer>
</body>
```

```css
.page {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	margin: 0;
}

main {
	flex: 1;
}
```

Что это дает:

- `main` растягивается на оставшееся место
- футер прижимается вниз на коротких страницах
- на длинных страницах всё корректно уходит в скролл

## 2) То же самое через Grid

```css
.page {
	min-height: 100vh;
	display: grid;
	grid-template-rows: auto 1fr auto; /* header / main / footer */
	margin: 0;
}
```

Хорошо, когда layout изначально "сеточный".

## 3) Мобильные браузеры: `100vh` vs `100dvh`

На мобильных `100vh` может работать не так, как ожидается, из-за динамических панелей браузера.

Безопасный современный вариант:

```css
.page {
	min-height: 100vh; /* fallback */
	min-height: 100dvh; /* dynamic viewport height */
}
```

Это уменьшает скачки и "лишний" скролл при появлении/скрытии адресной строки.

### Таблица сравнения viewport-единиц (`vh`, `dvh` и др.)

| Единица | Что означает | Поведение на мобильных | Когда использовать |
| --- | --- | --- | --- |
| `vh` | 1% высоты viewport | Может давать скачки из-за динамических панелей браузера | Базовый fallback, простые desktop-экраны |
| `dvh` | 1% *динамической* высоты viewport | Адаптируется к появлению/скрытию UI браузера | Для полноэкранных секций и page-layout на мобильных |
| `svh` | 1% *минимальной* высоты viewport | Консервативная высота (обычно меньше), стабильнее | Когда важно избежать переполнения/обрезки при появлении панелей |
| `lvh` | 1% *максимальной* высоты viewport | Берет максимальную высоту viewport | Когда нужен максимально высокий экранный блок |
| `vw` | 1% ширины viewport | Обычно предсказуемо, но может учитывать скроллбар | Для горизонтальных размеров, fluid-типографики (осторожно) |
| `vmin` | 1% меньшей из сторон viewport | Меняется при смене ориентации | Для адаптивных квадратов/масштабирования от меньшей стороны |
| `vmax` | 1% большей из сторон viewport | Меняется при смене ориентации | Для декоративных/крупных элементов, завязанных на большую сторону |

Практический вывод для layout страницы:

```css
.page {
	min-height: 100vh; /* fallback */
	min-height: 100dvh; /* основной вариант на мобильных */
}
```

## 4) Если внутри `main` есть собственный скролл-контейнер

Важно про flex/grid-детей: у них часто `min-height: auto`, и контент может "ломать" внутренний скролл.

```css
main {
	flex: 1;
	min-height: 0; /* критично для внутренних scroll-зон */
}

.content-scroll {
	height: 100%;
	overflow: auto;
}
```

Аналогично для grid-контейнера: иногда тоже нужен `min-height: 0` у нужного child.

## 5) Если есть фиксированный header

При `position: fixed` у header он выпадает из потока, и `main` может уехать под него.

```css
header {
	position: fixed;
	inset: 0 0 auto 0;
	height: 64px;
}

main {
	padding-top: 64px; /* компенсация высоты шапки */
}
```

Лучше по возможности использовать `position: sticky`, если нужен обычный flow + прилипание.

## Подводные камни (самые частые)

### 1) `height: 100%` "не работает"

`height: 100%` работает только если у родителя задана высота.

Если выбираешь `%`, нужно задать цепочку:

```css
html,
body {
	height: 100%;
}
```

Чаще проще использовать `min-height: 100vh/100dvh`.

### 2) Использование `height` вместо `min-height`

`height: 100vh` фиксирует высоту и может резать контент.

Для страниц почти всегда лучше `min-height`, чтобы рост контента не ломал layout.

### 3) Лишний отступ от `body`

У `body` по умолчанию есть margin (обычно 8px), что визуально "ломает" расчет высоты.

```css
body {
	margin: 0;
}
```

### 4) Коллапс margin у первого дочернего элемента

В некоторых случаях верхний `margin` первого child в `main` может давать неожиданный отступ.

Практичный фикс:

- использовать `padding-top` у `main`
- или создать новый форматирующий контекст (`display: flow-root`)

### 5) `100vh` на iOS/Android и скачки при скролле

Используй `100dvh` (с fallback на `100vh`), чтобы высота была ближе к фактической видимой области.

### 6) Safe area на устройствах с вырезами

Для нижних панелей/футера на iOS иногда нужен safe-area отступ:

```css
footer {
	padding-bottom: env(safe-area-inset-bottom);
}
```

## Рекомендуемый шаблон "из коробки"

```css
html,
body {
	margin: 0;
}

body {
	min-height: 100vh;
	min-height: 100dvh;
	display: flex;
	flex-direction: column;
}

main {
	flex: 1;
	min-height: 0;
}
```

Этот шаблон покрывает большую часть проектов.

## Официальная документация

- MDN: `min-height`  
  https://developer.mozilla.org/en-US/docs/Web/CSS/min-height
- MDN: `height`  
  https://developer.mozilla.org/en-US/docs/Web/CSS/height
- MDN: Layout cookbook - Sticky footers  
  https://developer.mozilla.org/en-US/docs/Web/CSS/Layout_cookbook/Sticky_footers
- MDN: Flexbox  
  https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout
- MDN: Grid layout  
  https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout

---

> [!tip] Связанные темы
>
> - [Центрирование в CSS](/css/tsentrirovanie-v-css)
> - [Позиционирование в CSS](/css/pozitsionirovanie-v-css)
> - [z-index и stacking context](/css/z-index-i-stacking-context)
