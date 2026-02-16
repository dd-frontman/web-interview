###  1 KISS — _Keep It Simple, Stupid_

**Смысл:** решение должно быть настолько простым, насколько возможно, без «премудрой» архитектуры.  
**Vue‑пример:** реактивный `ref` + `watchEffect`, а не собственный мини‑Redux для счётчика кликов.

### 2. DRY — _Don’t Repeat Yourself_

**Смысл:** знание должно жить в одном месте, иначе править придётся в десяти местах сразу.  
**Vue‑пример:** общий компонент `<FormField />` вместо копипаста лейблов + валидации по всей форме.

### 3. YAGNI — _You Aren’t Gonna Need It_

**Смысл:** не реализуй функциональность «на всякий случай». Делай, когда станет нужна.  
**Vue‑пример:** не заводить отдельный Pinia‑стор для фичи, требующей всего один запрос на страницу.

### 4. POLA — _Principle of Least Astonishment_

**Смысл:** код должен вести себя так, как ожидает большинство разработчиков.  
**Vue‑пример:** если проп называется `disabled`, он **действительно** блокирует кнопку, а не прячет её.

### 5. Law of Demeter (LoD) — «принцип наименьшего знания»

**Смысл:** объекту разрешено «говорить» только с соседями, чтобы уменьшить сцепление.  
**Vue‑пример:** компонент не роется глубоко в `user.profile.address.city`, а получает уже сформированную строку `fullAddress` через проп. [Википедия](https://en.wikipedia.org/wiki/Law_of_Demeter)

---

### 6. SoC — _Separation of Concerns_

**Смысл:** разные заботы живут в разных модулях (UI ↔ бизнес‑логика ↔ данные).  
**Vue‑пример:** UI‑компонент отвечает только за разметку, а данные приходят из composable `useFetchPosts()`. [Википедия](https://en.wikipedia.org/wiki/Separation_of_concerns)

---

### 7. TDA — _Tell Don’t Ask_

**Смысл:** вместо «спросить объект и сделать что‑то» — «попросить объект сам выполнить действие».  
**Vue‑пример:** `cart.add(item)` внутри сервиса, а не `items = cart.items; items.push(item)`. [martinfowler.com](https://martinfowler.com/bliki/TellDontAsk.html)

---

### 8. CQS / CQS(RS) — _Command‑Query Separation_

**Смысл:** метод либо меняет состояние (command → `void`), либо возвращает данные (query), но никогда оба сразу.  
**Vue‑пример:** `saveTodo()` отправляет POST и ничего не возвращает; чтение списка идёт через отдельную `getTodos()` или реактивный `computed`. [martinfowler.com](https://www.martinfowler.com/bliki/CommandQuerySeparation.html)

---

### 9. Boy Scout Rule — «оставь место чище, чем нашёл»

**Смысл:** при любом изменении кода убери мелкий «мусор» рядом: переименуй переменную, удалите dead‑code, поправь форматирование.  
**Vue‑пример:** если правишь компонент, заодно вынеси инлайновый стиль в CSS‑класс. [DevIQ](https://deviq.com/principles/boy-scout-rule/)

---

### 10. GRASP — _General Responsibility Assignment Software Patterns_

Это не один принцип, а набор из 9 (Controller, Creator, Information Expert, High Cohesion, Low Coupling и др.) — описывают, **кому** назначать ответственность в ОО‑дизайне.  
**Vue‑пример:** «Controller» может лечь на слой маршрутизатора (view‑model), а «Pure Fabrication» — в композабл, который формирует отчёт, не будучи настоящей доменной сущностью.

---

<RelatedTopics
	:items="[
		{ title: 'Принципы программирования', href: '/printsipy-programmirovaniya/index' },
		{ title: 'SOLID', href: '/printsipy-programmirovaniya/solid' },
		{ title: 'Vue', href: '/vue' },
	]"
/>

