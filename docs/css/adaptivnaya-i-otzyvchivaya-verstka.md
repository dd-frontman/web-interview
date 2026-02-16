## Адаптивная и отзывчивая верстка простыми словами

Обычно в собеседованиях спрашивают про два подхода:

- `Responsive` (отзывчивая): один макет тянется и перестраивается по ширине экрана.
- `Adaptive` (адаптивная): несколько фиксированных вариантов под диапазоны ширины.

На практике чаще используют **responsive + mobile-first**.

## Что такое mobile-first

Идея: сначала делаем стили для маленького экрана, потом добавляем правила для больших.

```css
.card-list {
	display: grid;
	grid-template-columns: 1fr;
	gap: 12px;
}

@media (min-width: 768px) {
	.card-list {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (min-width: 1200px) {
	.card-list {
		grid-template-columns: repeat(4, 1fr);
	}
}
```

Почему это полезно:

- проще приоритизировать контент;
- меньше лишних стилей для мобильных;
- легче контролировать рост интерфейса.

## Базовые инструменты responsive-верстки

### 1. Viewport meta-tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

Без него mobile-верстка часто масштабируется браузером некорректно.

### 2. Относительные единицы

- `%`, `rem`, `em`, `vw`, `dvw`
- `minmax()` и `fr` в Grid
- `clamp()` для плавной типографики

```css
h1 {
	font-size: clamp(1.5rem, 1.2rem + 1.5vw, 2.4rem);
}
```

### 3. Гибкие изображения

```css
img {
	max-width: 100%;
	height: auto;
}
```

Это предотвращает вылезание изображения за контейнер.

## Adaptive-подход: когда нужен

Adaptive полезен, если:

- есть строгие дизайн-макеты под конкретные брейкпоинты;
- интерфейс сильно отличается между мобильной и десктопной версией;
- нужно жестко контролировать поведение сложных экранов (дашборды, таблицы).

Чаще это делают как набор брейкпоинтов, но внутри все равно используют responsive-техники.

## Частые ошибки

1. Нет `viewport`, и мобильная версия «уменьшенная десктопная».
2. Фиксированные ширины (`width: 1200px`) без адаптации.
3. Дублирование одинаковых media-query по всему проекту.
4. Изображения без ограничений размера.
5. Игнорирование реальных устройств (проверка только в DevTools).

## Мини-чеклист перед релизом

1. Экран 320px/375px: ничего не ломается и не уезжает.
2. Планшет: нет горизонтального скролла.
3. Десктоп 1440px+: контент не «растекается» слишком широко.
4. Все основные действия доступны большим пальцем на мобильном.
5. Шрифты и интерактивные зоны читаемы/кликабельны.

## Официальные источники

- MDN: Responsive design  
  https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design
- MDN: Using media queries  
  https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries
- MDN: Viewport meta tag  
  https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport
- web.dev: Responsive web design basics  
  https://web.dev/articles/responsive-web-design-basics

---

> [!tip] Связанные темы
>
> - [Центрирование в CSS](/css/tsentrirovanie-v-css)
> - [Позиционирование в CSS](/css/pozitsionirovanie-v-css)
> - [Расположение контента и высота main](/css/raspolozhenie-kontenta-i-vysota-main)
