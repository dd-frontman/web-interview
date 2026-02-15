import { defineConfig } from "vitepress";
import { sidebar } from "./sidebar";

export default defineConfig({
	title: "Web Interview Documentation",
	description: "Документация по веб-разработке для подготовки к собеседованиям",

	// Настройка для деплоя на GitHub Pages
	// Репозиторий называется "web-interview", поэтому используем base: '/web-interview/'
	// В локальной разработке тоже нужно использовать этот base - открывайте http://localhost:5173/web-interview/
	base: "/web-interview/",

	// Чистые URL без .html
	cleanUrls: true,

	// Настройки темы
	themeConfig: {
		// Логотип сайта (опционально)
		// logo: '/logo.svg',

		// Навигация в верхней части
		nav: [],

		// Боковая панель навигации - глобальный sidebar для всех страниц
		// Используем массив вместо объекта, чтобы sidebar отображался на всех страницах
		sidebar,

		// Настройки поиска
		search: {
			provider: "local",
		},

		// Социальные ссылки (опционально)
		socialLinks: [
			// { icon: 'github', link: 'https://github.com/yourusername/web-interview' }
		],

		// Футер (опционально)
		footer: {
			message: "Документация по веб-разработке",
			copyright: "Copyright © 2024",
		},

		// Настройки редактирования (опционально)
		// editLink: {
		// 	pattern: 'https://github.com/yourusername/web-interview/edit/main/docs/:path',
		// 	text: 'Редактировать эту страницу на GitHub'
		// },
	},

	// Указываем, что исходные файлы находятся в папке docs
	// Это нужно для правильной работы с base path
	srcDir: "docs",

	// Настройки Markdown для исправления ошибок Shiki
	markdown: {
		theme: {
			light: "github-light",
			dark: "github-dark",
		},
		codeTransformers: [],
	},
});
