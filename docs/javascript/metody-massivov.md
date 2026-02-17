---
title: "Metody massivov"
description: "1. arr.push(...items) – добавляет элементы в конец,"
tags:
  - "javascript"
  - "metody-massivov"
updatedAt: "2026-02-16"
---
1. `arr.push(...items) – добавляет элементы в конец,`
2. `arr.pop() – извлекает элемент из конца,`
3. `arr.shift() – извлекает элемент из начала,`
4. `arr.unshift(...items) – добавляет элементы в начало.`
5. `arr.splice(1, 1, ...items); - начиная с индекса 1, удалить 1 элемент, вставить items`
6. `arr.slice([start], [end]) - return new arr, в который копирует все элементы с индекса start до end, создаёт копию []`
7. `arr.concat(arg1, arg2...) create new [], в который копирует данные из других [] и дополнительные значения.`
8. `arr.forEach(function(item, index, array) { // ... делать что-то с item }) позволяет запускать функцию для каждого элемента массива.`
9. `arr.indexOf(item, from) ищет item начиная с индекса from и возвращает номер индекса, на котором был найден искомый элемент, в противном случае -1.`
10. `arr.includes(item, from) ищет item начиная с индекса from и возвращает true, если поиск успешен.`
11. `arr.find(function(item, index, array) { // если true - возвращается первый элемент и перебор прерывается, иначе возвращается undefined });`
12. `arr.findIndex(function(item, index, array) { // начинается поиск с начала, возвращается индекс, иначе возвращается -1 });`
13. `arr.findLastIndex(function(item, index, array) { // начинается поиск с конца, возвращается индекс, иначе возвращается -1 });`
14. `arr.filter // let results = arr.filter(function(item, index, array) { // если true -- элемент добавляется к results и перебор продолжается // возвращается [] в случае, если ничего не найдено });`
15. `arr.map // Он вызывает функцию для каждого элемента массива и возвращает массив результатов выполнения этой функции. let result = arr.map(function(item, index, array) { // возвращается новое значение вместо элемента });`
16. `arr.sort() // сортирует массив на месте, меняя в нём порядок элементов.`
17. `arr.reverse() - меняет порядок элементов в arr на обратный`
18. `arr.split() - разбивает строку по заданному разделителю и возвращает массив элементов`
19. `arr.join() - склеивает массив в строку по указанному разделителю`
20. `arr.reduce() - используются для вычисления единого значения с начала [] на основе всего массива arr.reduce(function(accumulator, item, index, array) { // ... }, [initial]) let result = arr.reduce((sum, current) => sum + current, 0)`
21. `arr.reduceright() - используются для вычисления единого значения с конца [] на основе всего массива arr.reduce(function(accumulator, item, index, array) { // ... }, [initial]) let result = arr.reduce((sum, current) => sum + current, 0)`

---

<RelatedTopics
	:items="[
		{ title: 'Что такое замыкание', href: '/javascript/chto-takoe-zamykanie' },
		{ title: 'Event Bubbling', href: '/javascript/event-bubbling' },
		{ title: 'Event Loop', href: '/javascript/event-loop' },
	]"
/>
