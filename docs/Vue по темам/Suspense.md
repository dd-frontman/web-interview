- `<Suspense>` — встроенный компонент Vue 3 для управления асинхронными зависимостями внутри компонентов. Он позволяет показывать один общий индикатор загрузки, пока всё не подгрузится, вместо множества спиннеров. :contentReference[oaicite:0]{index=0}
- Он ждёт два типа асинхронных зависимостей:
  1. Компоненты с `async setup()` или `<script setup>` с `await` на верхнем уровне :contentReference[oaicite:1]{index=1}.
  2. **Асинхронные компоненты** (`defineAsyncComponent`) :contentReference[oaicite:2]{index=2}.
- Пока зависимые части не готовы — отображается слот `#fallback`, когда готовы — `#default`. :contentReference[oaicite:3]{index=3}
- Если асинхронного в дереве нет — сразу показывается `default`. :contentReference[oaicite:4]{index=4}

## Пример использования

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncProfile />
      <AsyncStats />
    </template>
    <template #fallback>
      <LoadingIndicator />
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncProfile = defineAsyncComponent(() => import('./Profile.vue'));
const AsyncStats   = defineAsyncComponent(() => import('./Stats.vue'));
</script>
```
## Поведение и тонкости

- На первоначальном рендере пробует отрисовать `#default`, и если обнаружены async зависимости — уходит в **pending** и показывает `#fallback` до их готовности. [Stack Overflow+4Vue.js+4Medium+4](https://vuejs.org/guide/built-ins/suspense?utm_source=chatgpt.com)
    
- После resolution остаётся в резолв-состоянии, пока корневой узел `#default` не заменится. Промежуточные async внутри не вызовут повторной загрузки. [Vue.js](https://vuejs.org/guide/built-ins/suspense?utm_source=chatgpt.com)
    
- `timeout` проп можно задать, чтобы показать `fallback`, если рендеринг нового контента долго не завершался. Значение `0` — показывается сразу. [Vue.js](https://vuejs.org/guide/built-ins/suspense?utm_source=chatgpt.com)
    
- Есть события:
    
    - `pending` — когда начинается загрузка,
    - `resolve` — когда всё подгрузилось,
    - `fallback` — когда отображается `#fallback`. [Vue.js+2AnyMind Group+2](https://vuejs.org/guide/built-ins/suspense?utm_source=chatgpt.com)
        
- Ошибки не обрабатываются напрямую, но можно использовать `onErrorCaptured` или `errorCaptured` в родителе, чтобы поймать ошибки асинхронных компонентов. [Vue.js+2LearnVue+2](https://vuejs.org/guide/built-ins/suspense?utm_source=chatgpt.com)
    

## Дополнительно: вложенность и сочетание с другими компонентами

- `<Suspense>` можно вложить в `<Transition>`, `<KeepAlive>`, `<RouterView>` и другие — порядок важен для корректного поведения. [Medium+9Vue.js+9Vue School+9](https://vuejs.org/guide/built-ins/suspense?utm_source=chatgpt.com)
    
- Vue Router поддерживает lazy loading компонентов, но они пока не триггерят Suspense напрямую — однако асинхронные дочерние компоненты внутри маршрутов работают как обычно. [Vue.js](https://vuejs.org/guide/built-ins/suspense?utm_source=chatgpt.com)
    

## Объяснения простым языком

- Объединённый индикатор загрузки (вместо множества): Vue ждёт, пока всё не готово, и только потом показывает контент — это избавляет от "эффекта попкорна", когда разные части интерфейса появляются в разное время. [Vue School](https://vueschool.io/articles/vuejs-tutorials/suspense-everything-you-need-to-know/?utm_source=chatgpt.com)[Medium](https://fadamakis.com/vue-suspense-a-cleaner-way-to-manage-loading-states-54df885a52c3?utm_source=chatgpt.com)
    
- Упрощает чистоту кода: вместо ручной логики с `v-if` и множеством загрузочных состояний — один `<Suspense>`. [LearnVue](https://learnvue.co/articles/vue-suspense?utm_source=chatgpt.com)[Medium](https://fadamakis.com/vue-suspense-a-cleaner-way-to-manage-loading-states-54df885a52c3?utm_source=chatgpt.com)
    
- Удобство при вложенных уровнях загрузки: можно контролировать загрузку отдельных зон через вложенные `<Suspense>`. [Vue School](https://vueschool.io/articles/vuejs-tutorials/suspense-everything-you-need-to-know/?utm_source=chatgpt.com)

| Что                        | Описание |
|---------------------------|----------|
| **Что такое**             | `<Suspense>` — компонент для управления async зависимостями, показывает `fallback` пока не готовы все части. |
| **Async зависимости**     | `async setup()` или `defineAsyncComponent` |
| **Слоты**                 | `#default` — основной контент; `#fallback` — загрузочное состояние |
| **Поведение**             | Если есть async — сначала `fallback`, потом `default`. Если нет — сразу `default`. |
| **Повторная загрузка**    | Происходит, только если заменён корневой узел `#default` — внутренняя async не триггерят. |
| **Timeout**               | Проп `timeout`: через сколько мс показать `fallback`. `0` — сразу. |
| **События**               | `pending`, `resolve`, `fallback` — для кастомной логики. |
| **Обработка ошибок**      | Через `onErrorCaptured` вокруг `<Suspense>`. |
| **Комбинация с другими**  | Используйте с `<Transition>`, `<KeepAlive>`, `<RouterView>` — важен порядок. |
| **Польза**                | Убирает множество загрузочных спиннеров, избегает layout shifts (“popcorn effect”), улучшает UX. |
| **Официальное описание** | Vue Official Docs: описание всех фич и API. :contentReference[oaicite:27]{index=27} |
