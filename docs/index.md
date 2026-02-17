---
---

<script setup>
import { withBase } from 'vitepress'
</script>

<div class="home-content home-header">
  <h1 class="home-title">Web Interview Documentation</h1>
  <p class="home-subtitle">Документация по веб-разработке</p>
  <p class="home-description">Собрание знаний и материалов по фронтенд разработке для подготовки к собеседованиям</p>
  <a :href="withBase('/vue/ref-and-reactive/reaktivnost-vo-vue3')" class="home-cta-button">Начать изучение</a>
</div>

<div class="home-divider">
  <hr>
</div>

<div class="home-content home-sections">

## Основные разделы

<div class="home-sections-grid">

<div class="home-section-card">
  <h3 class="home-section-title"><a :href="withBase('/vue/ref-and-reactive/reaktivnost-vo-vue3')" class="home-section-link">Vue.js</a></h3>
  <p class="home-section-description">Глубокое погружение в экосистему Vue 3</p>
</div>

<div class="home-section-card">
  <h3 class="home-section-title"><a :href="withBase('/react/osnovnye-funktsii-react')" class="home-section-link">React</a></h3>
  <p class="home-section-description">Основы и продвинутые техники работы с React</p>
</div>

<div class="home-section-card">
  <h3 class="home-section-title"><a :href="withBase('/arkhitektura/arkhitektura-prilozhenii-vidy-i-osobennosti')" class="home-section-link">Архитектура</a></h3>
  <p class="home-section-description">Паттерны проектирования и архитектурные подходы</p>
</div>

<div class="home-section-card">
  <h3 class="home-section-title"><a :href="withBase('/javascript/tipy-dannykh/tipy-dannykh')" class="home-section-link">JavaScript</a></h3>
  <p class="home-section-description">Фундаментальные знания по JS/TS</p>
</div>

<div class="home-section-card">
  <h3 class="home-section-title"><a :href="withBase('/brauzery/polnyi-put-zagruzki-saita')" class="home-section-link">Браузеры</a></h3>
  <p class="home-section-description">Как работают браузеры, HTTP, производительность</p>
</div>

<div class="home-section-card">
  <h3 class="home-section-title"><a :href="withBase('/bezopasnost-prilozhenii/bezopasnost-prilozhenii')" class="home-section-link">Безопасность</a></h3>
  <p class="home-section-description">Практики безопасности веб-приложений</p>
</div>

</div>

</div>

---

<RelatedTopics
	:items="[
		{ title: 'Подготовка к собеседованию', href: '/podgotovka-k-sobesedovaniyu' },
		{ title: 'Vue', href: '/vue' },
	]"
/>
