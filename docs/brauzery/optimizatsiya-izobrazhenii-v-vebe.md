---
title: "Optimizatsiya izobrazhenii v"
description: "Изображения часто занимают большую часть веса страницы. Цель оптимизации:"
tags:
  - "brauzery"
  - "optimizatsiya-izobrazhenii-v-vebe"
updatedAt: "2026-02-16"
---
## Оптимизация изображений в вебе

Изображения часто занимают большую часть веса страницы. Цель оптимизации:

- быстрее показать первый экран;
- уменьшить трафик;
- не допустить скачков макета (CLS).

## 1. Выбираем формат

- `AVIF` — обычно самый компактный для фото.
- `WebP` — хороший баланс размера и поддержки.
- `JPEG/PNG` — fallback для старых кейсов.
- `SVG` — для иконок и векторной графики.

## 2. Отдаем разные размеры под разные экраны

```html
<picture>
    <source
        type="image/avif"
        srcset="/img/hero-640.avif 640w, /img/hero-1280.avif 1280w"
        sizes="(max-width: 768px) 100vw, 50vw"
    />
    <source
        type="image/webp"
        srcset="/img/hero-640.webp 640w, /img/hero-1280.webp 1280w"
        sizes="(max-width: 768px) 100vw, 50vw"
    />
    <img
        src="/img/hero-1280.jpg"
        alt="Главный баннер"
        width="1280"
        height="720"
        loading="lazy"
        decoding="async"
    />
</picture>
```

Что важно:

- `srcset` + `sizes` экономят трафик на мобильных;
- `width`/`height` резервируют место и снижают CLS;
- `loading="lazy"` откладывает загрузку вне первого экрана.

## 3. Для LCP-изображения lazy-loading не нужен

Для hero-изображения на первом экране лучше приоритизировать загрузку:

```html
<link rel="preload" as="image" href="/img/hero-1280.avif" />
```

## 4. Кэширование и CDN

- Храните изображения за CDN.
- Для versioned-файлов ставьте долгий кэш (`Cache-Control`).
- Делайте оптимизацию в CI/CD или на edge (ресайз/формат по `Accept`).

## 5. Частые ошибки

1. Один огромный JPEG для всех устройств.
2. Нет `width`/`height` и макет прыгает.
3. Ленивая загрузка для главного изображения на первом экране.
4. PNG там, где можно AVIF/WebP.
5. Отсутствие кэширования статики.

## Официальные источники

- MDN: Responsive images  
  https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
- MDN: `loading` attribute (`img`)  
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading
- MDN: `picture` element  
  https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture
- web.dev: Use responsive images  
  https://web.dev/articles/serve-responsive-images
- web.dev: Browser-level image lazy loading  
  https://web.dev/articles/browser-level-image-lazy-loading

---

<RelatedTopics
    :items="[
        { title: 'Critical Render Path', href: '/brauzery/crp/critical-render-path' },
        { title: 'LCP, INP, TTI', href: '/brauzery/lcp-inp-tti' },
        { title: 'Reflow, Repaint и Layout Thrashing', href: '/brauzery/reflow-repaint-i-layout-thrashing' },
    ]"
/>
