---
title: "Почему нельзя использовать index как key в v-for?"
description: "Ответ про роль key в списках Vue, некорректное сопоставление элементов и проблемы со state при index как key."
tags:
  - "voprosy"
  - "vue"
  - "v-for"
  - "performance"
updatedAt: "2026-03-12"
---
# Почему нельзя использовать index как key в v-for?

## Ответ

`key` используется Vue для отслеживания элементов списка.

Если использовать `index`:

- Vue может неправильно сопоставить элементы;
- компоненты могут переиспользоваться некорректно;
- состояние элементов может "перепутаться".

Проблема особенно проявляется при:

- удалении элементов;
- сортировке;
- вставке в середину списка.

Поэтому лучше использовать уникальный идентификатор данных.

Например:

```vue
 :key="user.id"
```

---

<RelatedTopics
    :items="[
        { title: 'Что происходит при потере реактивности?', href: '/voprosy/praktika-vue-i-reaktivnost/7-chto-proiskhodit-pri-potere-reaktivnosti' },
        { title: 'Как определить, что компонент слишком большой?', href: '/voprosy/praktika-vue-i-reaktivnost/8-kak-opredelit-chto-komponent-slishkom-bolshoi' },
        { title: 'Директивы Vue', href: '/vue/direktivy-vue' },
    ]"
/>
