Позволяет **экспортировать внутренние переменные из компонента** наружу, когда ты используешь `<script setup>` и хочешь получить доступ к `ref`, `method` и т.п. из `ref(componentRef)`.

```js
<!-- MyChild.vue -->
<script setup>
const sayHi = () => alert('hi')
defineExpose({ sayHi })
</script>

<!-- Родитель -->
<MyChild ref="child" />
onMounted(() => {
  child.value.sayHi()
})
```

---

<RelatedTopics
	:items="[
		{ title: 'Асинхронные рендеры и батчинг', href: '/vue/asinkhronnye-rendery-i-batching' },
		{ title: 'Директивы Vue', href: '/vue/direktivy-vue' },
		{ title: 'Оптимизация High Load проекта', href: '/vue/optimizatsiya-high-load-proekta' },
	]"
/>

