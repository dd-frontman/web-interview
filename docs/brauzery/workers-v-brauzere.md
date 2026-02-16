## Зачем нужны Workers

Workers позволяют вынести тяжёлые задачи из main thread, чтобы интерфейс не зависал.

Примеры задач:

- парсинг больших JSON
- криптография
- обработка изображений
- фоновые синхронизации

## Основные типы

### 1. Web Worker

Отдельный поток для вычислений, без прямого доступа к DOM.

```ts
// main thread
const worker = new Worker(new URL("./sum.worker.ts", import.meta.url), { type: "module" });
worker.postMessage({ numbers: [1, 2, 3, 4] });
worker.onmessage = (event) => console.log(event.data);
```

```ts
// sum.worker.ts
self.onmessage = (event) => {
	const sum = event.data.numbers.reduce((acc: number, n: number) => acc + n, 0);
	self.postMessage({ sum });
};
```

### 2. Service Worker

Прокси между приложением и сетью:

- кеширование
- офлайн-режим
- push-уведомления
- background sync

### 3. SharedWorker

Один worker на несколько вкладок одного origin.  
Подходит для централизованного state/event слоя между вкладками.

### 4. Worklets

Лёгкие специализированные worker-контексты (например, `PaintWorklet`, `AudioWorklet`) для конкретных API браузера.

## Ограничения и практические советы

- в Web Worker нельзя работать с DOM API
- передача данных копирует объекты, используйте `Transferable` для больших буферов
- не выносите в worker мелкие операции, иначе overhead может быть выше пользы
- при длительной работе следите за утечками и завершайте worker через `terminate()`

---

<RelatedTopics
	:items="[
		{ title: 'Общение между вкладками браузера', href: '/brauzery/obschenie-mezhdu-vkladkami-brauzera' },
		{ title: 'Critical Render Path', href: '/brauzery/critical-render-path' },
		{ title: 'LCP, INP, TTI', href: '/brauzery/lcp-inp-tti' },
	]"
/>
