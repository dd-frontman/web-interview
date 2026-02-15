> [!tip] Связанные темы
>
> - Типичные ошибки CRP
> - Reflow, Repaint, Layout Thrashing
> - Workers в браузере

## Forced Synchronous Layout и Long Tasks

Это две частые причины "тормозов" интерфейса:

- **Forced Synchronous Layout** - принудительный layout прямо сейчас
- **Long Task** - задача в main thread дольше 50ms

Обе проблемы напрямую бьют по INP/TBT и ощущению "залипания" UI.

## 1) Forced Synchronous Layout: как возникает

Паттерн:

1. вы меняете DOM/стили
2. сразу читаете layout-метрику
3. браузер вынужден синхронно пересчитать layout

Частые API-чтения:

- `offsetWidth/offsetHeight`
- `clientWidth/clientHeight`
- `scrollTop/scrollHeight`
- `getBoundingClientRect()`

## Плохой пример

```js
panel.classList.add("expanded"); // write
const h = panel.getBoundingClientRect().height; // forced layout read
indicator.textContent = `${h}px`;
```

## Лучше: разделить фазы

```js
panel.classList.add("expanded");

requestAnimationFrame(() => {
	const h = panel.getBoundingClientRect().height;
	indicator.textContent = `${h}px`;
});
```

Еще лучше - уменьшить потребность в измерениях через CSS/layout-стратегию.

## 2) Long Tasks: почему опасны

Если JS-задача длится долго, браузер не может:

- обработать клик/ввод
- обновить кадр
- быстро показать реакцию на действие

В итоге пользователь нажал кнопку, а визуального ответа нет сотни миллисекунд.

## Плохой пример

```js
button.addEventListener("click", () => {
	heavySyncWork(); // 120ms
	openPanel();
});
```

## Улучшение: дробление задач

```js
button.addEventListener("click", async () => {
	openPanel(); // мгновенный визуальный фидбек

	for (const chunk of chunks) {
		processChunk(chunk);
		await new Promise((r) => setTimeout(r, 0)); // yield
	}
});
```

## Когда нужен Web Worker

Если вычисления реально тяжелые (парсинг, агрегации, криптография):

- переносите их в worker
- оставляйте main thread для UI

## Практический чеклист

1. Нет read-after-write в горячих UI-циклах.
2. Нет long tasks в критичных user-flow.
3. Тяжелая логика вынесена из main thread.
4. Пользователь получает быстрый визуальный отклик до тяжелых операций.

## Официальные материалы

- web.dev: Optimize long tasks  
  https://web.dev/articles/optimize-long-tasks
- web.dev: INP  
  https://web.dev/articles/inp
- MDN: Long tasks API  
  https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming
