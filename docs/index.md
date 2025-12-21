---
layout: page
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const style = document.createElement('style')
  style.textContent = `
    .home-background-logos {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }
    .home-background-logos img {
      position: absolute;
      opacity: 0.08;
      width: 120px;
      height: auto;
      filter: grayscale(100%);
      animation: float 20s infinite ease-in-out;
    }
    .home-background-logos img:nth-child(1) { top: 10%; left: 5%; animation-delay: 0s; }
    .home-background-logos img:nth-child(2) { top: 25%; left: 75%; animation-delay: 2s; }
    .home-background-logos img:nth-child(3) { top: 50%; left: 15%; animation-delay: 4s; }
    .home-background-logos img:nth-child(4) { top: 70%; left: 80%; animation-delay: 6s; }
    .home-background-logos img:nth-child(5) { top: 15%; left: 50%; animation-delay: 8s; }
    .home-background-logos img:nth-child(6) { top: 60%; left: 40%; animation-delay: 10s; }
    .home-background-logos img:nth-child(7) { top: 35%; left: 90%; animation-delay: 12s; }
    .home-background-logos img:nth-child(8) { top: 80%; left: 25%; animation-delay: 14s; }
    .home-background-logos img:nth-child(9) { top: 5%; left: 30%; animation-delay: 1s; }
    .home-background-logos img:nth-child(10) { top: 45%; left: 60%; animation-delay: 3s; }
    .home-background-logos img:nth-child(11) { top: 20%; left: 20%; animation-delay: 5s; }
    .home-background-logos img:nth-child(12) { top: 65%; left: 55%; animation-delay: 7s; }
    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(20px, -20px) rotate(5deg); }
      50% { transform: translate(-15px, 15px) rotate(-5deg); }
      75% { transform: translate(10px, 10px) rotate(3deg); }
    }
    .home-content {
      position: relative;
      z-index: 1;
      padding: 2rem 1.5rem;
      max-width: 800px;
      margin: 0 auto;
    }
  `
  document.head.appendChild(style)
})
</script>

<div class="home-background-logos">
  <img src="/logos/vue.png" alt="Vue" onerror="this.style.display='none'" />
  <img src="/logos/react.png" alt="React" onerror="this.style.display='none'" />
  <img src="/logos/vue.png" alt="Vue" onerror="this.style.display='none'" />
  <img src="/logos/react.png" alt="React" onerror="this.style.display='none'" />
  <img src="/logos/vue.png" alt="Vue" onerror="this.style.display='none'" />
  <img src="/logos/react.png" alt="React" onerror="this.style.display='none'" />
  <img src="/logos/vue.png" alt="Vue" onerror="this.style.display='none'" />
  <img src="/logos/react.png" alt="React" onerror="this.style.display='none'" />
  <img src="/logos/vue.png" alt="Vue" onerror="this.style.display='none'" />
  <img src="/logos/react.png" alt="React" onerror="this.style.display='none'" />
  <img src="/logos/vue.png" alt="Vue" onerror="this.style.display='none'" />
  <img src="/logos/react.png" alt="React" onerror="this.style.display='none'" />
</div>

<div class="home-content" style="text-align: center;">
  <h1 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; color: var(--vp-c-brand-1);">Web Interview Documentation</h1>
  <p style="font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--vp-c-text-1);">Документация по веб-разработке</p>
  <p style="font-size: 0.95rem; color: var(--vp-c-text-2); margin-bottom: 1.5rem;">Собрание знаний и материалов по фронтенд разработке для подготовки к собеседованиям</p>
  <a href="/Vue по темам/" style="display: inline-block; padding: 0.6rem 1.2rem; background: var(--vp-button-brand-bg); color: var(--vp-button-brand-text); border-radius: 8px; text-decoration: none; font-weight: 600;">Начать изучение</a>
</div>

<div style="max-width: 800px; margin: 2rem auto 0; padding: 0 1.5rem;">
  <hr style="border: none; border-top: 1px solid var(--vp-c-divider); margin: 0;">
</div>

<div class="home-content" style="margin-top: 2rem;">

## Основные разделы

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.5rem;">

<div style="padding: 1rem; background: var(--vp-c-bg-soft); border-radius: 8px; border: 1px solid var(--vp-c-divider);">
  <h3 style="margin: 0 0 0.5rem 0;"><a href="/Vue по темам/" style="text-decoration: none; color: var(--vp-c-brand-1);">Vue.js</a></h3>
  <p style="color: var(--vp-c-text-2); margin: 0; font-size: 0.9rem;">Глубокое погружение в экосистему Vue 3</p>
</div>

<div style="padding: 1rem; background: var(--vp-c-bg-soft); border-radius: 8px; border: 1px solid var(--vp-c-divider);">
  <h3 style="margin: 0 0 0.5rem 0;"><a href="/React/" style="text-decoration: none; color: var(--vp-c-brand-1);">React</a></h3>
  <p style="color: var(--vp-c-text-2); margin: 0; font-size: 0.9rem;">Основы и продвинутые техники работы с React</p>
</div>

<div style="padding: 1rem; background: var(--vp-c-bg-soft); border-radius: 8px; border: 1px solid var(--vp-c-divider);">
  <h3 style="margin: 0 0 0.5rem 0;"><a href="/🏛️Архитектура/" style="text-decoration: none; color: var(--vp-c-brand-1);">Архитектура</a></h3>
  <p style="color: var(--vp-c-text-2); margin: 0; font-size: 0.9rem;">Паттерны проектирования и архитектурные подходы</p>
</div>

<div style="padding: 1rem; background: var(--vp-c-bg-soft); border-radius: 8px; border: 1px solid var(--vp-c-divider);">
  <h3 style="margin: 0 0 0.5rem 0;"><a href="/Js по темам/" style="text-decoration: none; color: var(--vp-c-brand-1);">JavaScript</a></h3>
  <p style="color: var(--vp-c-text-2); margin: 0; font-size: 0.9rem;">Фундаментальные знания по JS/TS</p>
</div>

<div style="padding: 1rem; background: var(--vp-c-bg-soft); border-radius: 8px; border: 1px solid var(--vp-c-divider);">
  <h3 style="margin: 0 0 0.5rem 0;"><a href="/Браузеры/" style="text-decoration: none; color: var(--vp-c-brand-1);">Браузеры</a></h3>
  <p style="color: var(--vp-c-text-2); margin: 0; font-size: 0.9rem;">Как работают браузеры, HTTP, производительность</p>
</div>

<div style="padding: 1rem; background: var(--vp-c-bg-soft); border-radius: 8px; border: 1px solid var(--vp-c-divider);">
  <h3 style="margin: 0 0 0.5rem 0;"><a href="/Безопасность приложений 3/" style="text-decoration: none; color: var(--vp-c-brand-1);">Безопасность</a></h3>
  <p style="color: var(--vp-c-text-2); margin: 0; font-size: 0.9rem;">Практики безопасности веб-приложений</p>
</div>

</div>

</div>
