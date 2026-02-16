<script setup lang="ts">
interface RelatedTopic {
	title: string;
	href: string;
}

defineProps<{
	items: RelatedTopic[];
}>();
</script>

<template>
	<div class="tip custom-block related-topics">
		<p class="custom-block-title">Связанные темы</p>
		<ul>
			<li v-for="item in items" :key="item.href">
				<a :href="item.href">{{ item.title }}</a>
			</li>
		</ul>
	</div>
</template>
