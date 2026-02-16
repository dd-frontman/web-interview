## 1) Кратко, простыми словами

`useContext` нужен, чтобы **передавать данные через дерево компонентов без "пробрасывания пропсов"**.  
Например, тема (тёмная/светлая), язык интерфейса, текущий пользователь.

---

## 2) Пример (React + TypeScript)

```tsx
import { createContext, useContext, useState } from "react";

// 1. Создаём контекст
type Theme = "light" | "dark";
const ThemeContext = createContext<Theme>("light");

// 2. Провайдер — оборачиваем приложение
function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>("light");
	return (
		<ThemeContext.Provider value={theme}>
			{children}
			<button onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}>
				Toggle theme
			</button>
		</ThemeContext.Provider>
	);
}

// 3. Дочерний компонент может получить тему без пропсов
function ThemedText() {
	const theme = useContext(ThemeContext);
	return <p style={{ color: theme === "light" ? "#000" : "#fff" }}>Hello!</p>;
}

// 4. Используем
export default function App() {
	return (
		<ThemeProvider>
			<ThemedText />
		</ThemeProvider>
	);
}
```

---

## 3) Сравнение с Vue

- В React: `useContext(ThemeContext)`
- В Vue: `provide/inject("theme")`

---

## 4) Чит-щит

| Что              | Как работает                                             |
| ---------------- | -------------------------------------------------------- |
| Создать контекст | `const Ctx = createContext(defaultValue)`                |
| Обернуть дерево  | `<Ctx.Provider value={...}>...</Ctx.Provider>`           |
| Использовать     | `const v = useContext(Ctx)`                              |
| Для чего         | Тема, язык, юзер, глобальные настройки                   |
| Альтернатива     | Проброс пропсов вниз — неудобно при глубокой вложенности |

---

---

> [!tip] Связанные темы
>
> - [Основные хуки в React](/react/khuki/osnovnye-khuki-v-react)
> - [useEffect](/react/khuki/useeffect)
> - [useState](/react/khuki/usestate)

