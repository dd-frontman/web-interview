import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h, onMounted } from "vue";
import AsideSupportFooter from "./components/AsideSupportFooter.vue";
import "./custom.css";

export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
			"aside-bottom": () => h(AsideSupportFooter),
		});
	},
	setup() {
		// Логирование структуры sidebar для отладки
		onMounted(() => {
			setTimeout(() => {
				const sidebar = document.querySelector(".VPSidebar, .VPSidebarGroup, .VPSidebarItem");
				if (sidebar) {
					console.log("🔍 Sidebar structure:", sidebar.className);
					console.log("🔍 Sidebar HTML:", sidebar.outerHTML.substring(0, 500));
					// Проверяем все элементы с классом items
					const items = document.querySelectorAll("[class*='items']");
					console.log("🔍 Found items elements:", items.length);
					items.forEach((item, index) => {
						if (index < 3) {
							console.log(`🔍 Item ${index}:`, item.className, item.getAttribute("aria-expanded"));
						}
					});
				}
			}, 2000);
		});
	},
} satisfies Theme;
