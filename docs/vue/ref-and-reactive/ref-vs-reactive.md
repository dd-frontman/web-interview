---
title: "ref vs reactive"
description: "Практическое сравнение ref и reactive: различия, ограничения, примеры и частые ошибки."
tags:
  - "vue"
  - "ref-and-reactive"
  - "ref-vs-reactive"
updatedAt: "2026-02-17"
---
# ref vs reactive

Ниже только практическая разница без повторов.

## Быстрое сравнение

| Критерий | `ref` | `reactive` |
| --- | --- | --- |
| Что хранит | Одно значение в `.value` | Объект/массив как Proxy |
| Примитивы | Отлично подходит | Нельзя передать примитив напрямую |
| Объекты | Можно (`ref({})`) | Основной сценарий |
| Полная замена значения | Удобно: `state.value = next` | Обычно меняют свойства, не весь объект |
| Деструктуризация | Обычно безопасно через `.value` | Нужны `toRef/toRefs`, иначе теряется реактивность |

Официально:
[Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html),
[Reactivity Core API](https://vuejs.org/api/reactivity-core.html).

## Как выбрать

- Используйте `ref`, если:
  - у вас примитив;
  - вы часто заменяете значение целиком;
  - хотите явный контроль через `.value`.
- Используйте `reactive`, если:
  - состояние объектное;
  - чаще мутируете вложенные поля;
  - нужен удобный доступ без `.value` у каждого свойства.

## Как `ref` работает под капотом (кратко)

- Чтение `myRef.value` -> Vue делает `track` (подписка зависимости).
- Запись `myRef.value = ...` -> Vue делает `trigger` (перезапуск зависимых эффектов).
- Если внутри `ref` объект, Vue делает его реактивным (через `reactive`).

То есть `ref` это не "особый отдельный мир", а удобная обёртка над той же системой реактивности Vue.

## Примеры

```ts
import { ref, reactive, toRefs } from "vue";

const count = ref(0);
count.value++;

const state = reactive({
    user: { name: "Alice" },
    loading: false,
});
state.user.name = "Bob";

// если нужно деструктурировать reactive
const { user, loading } = toRefs(state);
```

## Частые ошибки

- Писать `count++` вместо `count.value++` в JS-коде.
- Деструктурировать `reactive` как обычный объект (`const { user } = state`) и ожидать реактивность.
- Выбирать `reactive`, хотя данные логичнее представлять как единичное значение в `ref`.

---

<RelatedTopics
    :items="[
        { title: 'ref / reactive: краткая шпаргалка', href: '/vue/ref-and-reactive/reaktivnost-vo-vue3' },
        { title: 'shallowRef', href: '/vue/ref-and-reactive/shallowref' },
        { title: 'reactive', href: '/vue/ref-and-reactive/reactive' },
    ]"
/>
