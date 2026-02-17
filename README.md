# Web Interview Documentation

Комплексная документация по веб-разработке для подготовки к собеседованиям.

🌐 **Сайт:** [https://dd-frontman.github.io/web-interview/](https://dd-frontman.github.io/web-interview/)  
📦 **Репозиторий:** [dd-frontman/web-interview](https://github.com/dd-frontman/web-interview)

## О проекте

Проект построен на VitePress и содержит структурированную базу знаний по фронтенду: Vue, React, JavaScript, TypeScript, архитектура, браузеры, безопасность и смежные темы.

Ключевые особенности:

- Контент в `docs/` с единым `frontmatter`
- Автогенерация `sidebar` из контента
- Генерация индекса контента по тегам
- Проверки ссылок/роутов/контента и orphan-страниц
- Stale-репорт по `updatedAt`
- Mobile smoke-тесты через Playwright в CI

## Требования

- Node.js `>=20`
- Yarn `1.22.x`

## Быстрый старт

```bash
yarn install
yarn dev
```

Локальный адрес: `http://localhost:5173/web-interview/`

Продакшен-сборка:

```bash
yarn build
```

Артефакты: `.vitepress/dist`

## Основные команды

```bash
# Dev / Build
yarn dev
yarn build
yarn preview

# Генерация метаданных
yarn sync:frontmatter       # нормализует frontmatter в docs/**/*.md
yarn generate:content-index # генерирует .vitepress/theme/generated/content-index.ts
yarn generate:sidebar       # генерирует .vitepress/sidebar.generated.ts
yarn sync:meta              # все 3 шага выше
yarn check:generated        # проверяет, что генерация не меняет файлы

# Валидации
yarn type-check
yarn validate-content
yarn validate-links
yarn validate-routes
yarn report:stale

# Линтинг / форматирование / тесты
yarn lint
yarn lint:md
yarn format
yarn test:mobile
```

## Контент: правила добавления

1. Добавляйте новый материал как `docs/<section>/<slug>.md` в `kebab-case`.
2. Пишите контент простым markdown, без ручной правки `sidebar.generated.ts`.
3. Перед коммитом запускайте:

```bash
yarn sync:meta
yarn validate-content
yarn validate-links
yarn validate-routes
```

### Frontmatter (обязательный формат)

Для всех страниц (кроме `docs/index.md`) используется единая схема:

```yaml
---
title: "Название статьи"
description: "Короткое описание"
tags:
  - "tag-1"
  - "tag-2"
updatedAt: "2026-02-16"
---
```

Часть полей может заполняться/нормализоваться автоматически через `yarn sync:frontmatter`.

## Структура проекта

```text
.
├── docs/                               # markdown-контент
├── .vitepress/
│   ├── config.ts                       # VitePress config
│   ├── sidebar.ts                      # прокси на generated sidebar
│   ├── sidebar.generated.ts            # автогенерируемый sidebar
│   └── theme/
│       ├── index.ts
│       ├── custom.css
│       ├── components/
│       └── generated/content-index.ts  # автогенерируемый индекс контента
├── scripts/
│   ├── sync-frontmatter.mjs
│   ├── generate-sidebar.mjs
│   ├── generate-content-index.mjs
│   ├── validate-*.mjs
│   └── report-stale-content.mjs
├── tests/mobile/                       # mobile smoke tests
├── playwright.mobile.config.ts
└── .github/workflows/deploy.yml
```

## CI / Deploy

GitHub Actions (`.github/workflows/deploy.yml`) на push в `main/master` выполняет:

1. `yarn install --frozen-lockfile`
2. `yarn check:generated`
3. `yarn type-check`
4. `yarn validate-content`
5. `yarn lint:md`
6. `yarn validate-links`
7. `yarn validate-routes`
8. `yarn report:stale`
9. `yarn test:mobile`
10. `yarn build`
11. Deploy на GitHub Pages

Для GitHub Pages в репозитории должен быть выбран источник `GitHub Actions` (`Settings -> Pages`).

## Лицензия

MIT, см. [LICENSE](LICENSE).

## Поддержка

Понравилась дока? Поставь ⭐ на GitHub:  
[https://github.com/dd-frontman/web-interview](https://github.com/dd-frontman/web-interview)
