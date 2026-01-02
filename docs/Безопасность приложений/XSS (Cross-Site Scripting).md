## Что такое XSS (Cross-Site Scripting)

XSS — это атака, при которой злоумышленник внедряет вредоносный код (обычно JavaScript) в контент веб-сайта, и этот код выполняется в браузере пользователя как будто он от доверенного источника. Это позволяет похищать куки, сессию, изменять контент, перенаправлять пользователя и т.д. [owasp.org](https://owasp.org/www-community/attacks/xss/?utm_source=chatgpt.com)[developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS?utm_source=chatgpt.com).

### Основные типы XSS:

- **Reflected (отражённая)** – вредоносный код передаётся в параметре (например URL) и сразу отображается в ответе сервера. [owasp.org](https://owasp.org/www-community/attacks/xss/?utm_source=chatgpt.com)[Acunetix](https://www.acunetix.com/websitesecurity/cross-site-scripting/?utm_source=chatgpt.com)
- **Stored (хранимая)** – код сохраняется на сервере (например, в базе или комментарии) и выполняется при последующих посещениях страницы. [owasp.org+1](https://owasp.org/www-community/attacks/xss/?utm_source=chatgpt.com)
- **DOM-based (на стороне клиента)** – работает через манипуляции DOM на клиенте, данные не проходят через сервер. [owasp.org](https://owasp.org/www-community/attacks/xss/?utm_source=chatgpt.com)[Acunetix](https://www.acunetix.com/websitesecurity/cross-site-scripting/?utm_source=chatgpt.com)

**Пример (Reflected):**
`http://site.com/search?q=<script>alert('XSS')</script>`
Если `q` вставляется без экранирования — произойдёт выполнение скрипта.

**Пример (Stored):**  
Форма комментариев сохраняет HTML без очистки. При просмотре комментариев — скрипт выполняется.

---

## Почему XSS опасен

XSS может привести к захвату сессии, фишингу, выпуску вредоносных программ и другим серьёзным последствиям. Часто применяются для кражи cookies. [owasp.org](https://owasp.org/www-project-top-ten/2017/A7_2017-Cross-Site_Scripting_%28XSS%29?utm_source=chatgpt.com)[Acunetix](https://www.acunetix.com/websitesecurity/cross-site-scripting/?utm_source=chatgpt.com)
**Известный пример**: червь **Samy на MySpace** заразил более миллиона профилей менее чем за 20 часов. [Википедия](https://en.wikipedia.org/wiki/XSS_worm?utm_source=chatgpt.com)

---

## Как защититься — базовые меры

1. **Экранирование (escaping)** — контекстуальное кодирование символов (HTML, JS, CSS, URL). [Википедия](https://en.wikipedia.org/wiki/Cross-site_scripting?utm_source=chatgpt.com)[Acunetix](https://www.acunetix.com/websitesecurity/cross-site-scripting/?utm_source=chatgpt.com)
2. **Санитизация HTML** — если нужно разрешить HTML от пользователя, используйте специализированные библиотеки (например, DOMPurify). [Википедия](https://en.wikipedia.org/wiki/Cross-site_scripting?utm_source=chatgpt.com)[cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html?utm_source=chatgpt.com)
3. **Content-Security-Policy (CSP)** — настройка браузера на разрешённые источники скриптов и стилей. [Википедия](https://en.wikipedia.org/wiki/Content_Security_Policy?utm_source=chatgpt.com)
4. **HttpOnly-куки** — делают cookie недоступными из JS, снижая риск кражи. [Википедия](https://en.wikipedia.org/wiki/Cross-site_scripting?utm_source=chatgpt.com)[Acunetix](https://www.acunetix.com/websitesecurity/cross-site-scripting/?utm_source=chatgpt.com)
5. **Фреймворки с XSS-защитой** — например, React, Vue, Angular автоматически экранируют вставляемые значения. [owasp.org](https://owasp.org/www-project-top-ten/2017/A7_2017-Cross-Site_Scripting_%28XSS%29?utm_source=chatgpt.com)[CyCognito](https://www.cycognito.com/learn/cyber-attack/xss.php?utm_source=chatgpt.com)
6. **Координация фронт-енд и бэкенд** — например, передавать CSRF-токены, использовать CSP и проверять данные под бэкендом тоже. [vuejs.org](https://vuejs.org/guide/best-practices/security?utm_source=chatgpt.com)

---

## Vue.js и XSS: особенности и примеры

### Почему Vue сам по себе безопасен:

- Vue автоматически экранирует вставляемые данные (interpolation).
- **Опасно**: если явно позволить Vue рендерить HTML от пользователя — `v-html` с сырым контентом. Это небезопасно. [vuejs.org](https://vuejs.org/guide/best-practices/security?utm_source=chatgpt.com)

### Основные рекомендации (из официальной документации Vue):

- **Никогда не используйте `v-html` с пользовательским вводом без очистки.**
- **Не монтируйте Vue на узлы, которые содержат серверный или пользовательский HTML** — это может привести к ошибкам, когда Vue парсит HTML как шаблон и даст XSS-возможность. [vuejs.org](https://vuejs.org/guide/best-practices/security?utm_source=chatgpt.com)

### Практические советы:

- Используйте `v-text` или стандартный синтаксис `{{ }}`, они безопасны.
- Если нужен HTML от пользователя, применяйте **vue-dompurify-html** или аналогичный санитайзер. [blog.jobins.jp](https://blog.jobins.jp/securing-the-front-end-defending-against-xss-attacks-in-vuejs?utm_source=chatgpt.com)
- Соедините меры: валидация на вводе → санитизация HTML → безопасная вставка → CSP.

### Пример:

```vue
<template>
	<div v-text="userInput"></div>
	<!-- безопасно — экранирует теги -->

	<div v-html="sanitizedHtml"></div>
	<!-- если sanitizedHtml очищён, безопасно -->
</template>
<script>
import DOMPurify from "dompurify";
export default {
	props: ["userHtml"],
	computed: {
		sanitizedHtml() {
			return DOMPurify.sanitize(this.userHtml);
		},
	},
};
</script>
```

---

## Подводные камни и "ловушки"

- **Double encoding** — злоумышленник дважды закодировал символы (например `%253Cscript%253E`) — обход фильтров. Нужно нормализовать/декодировать перед валидацией. [Википедия](https://en.wikipedia.org/wiki/Double_encoding?utm_source=chatgpt.com)
- **Mutated XSS (mXSS)** — браузер автоматически исправляет или меняет код (например незакрытые кавычки), что может открывать новые XSS-входы. [Википедия](https://en.wikipedia.org/wiki/Cross-site_scripting?utm_source=chatgpt.com)
- **Само-XSS (self-XSS)** — когда пользователь вводит скрипт сам по обману (не уязвимость, но опасное социальное инженерство). [Википедия](https://en.wikipedia.org/wiki/Cross-site_scripting?utm_source=chatgpt.com)

---

## Чит-щит таблица

| Угроза / Тип XSS             | Описание                                                | Пример / Особенности                        |
| ---------------------------- | ------------------------------------------------------- | ------------------------------------------- |
| Reflected (отражённая)       | Скрипт в параметре запроса, сразу выполняется           | `?q=<script>alert()</script>`               |
| Stored (хранимая)            | Скрипт сохраняется на сервере, выполняется при загрузке | Комментарии, профили                        |
| DOM-based (на клиенте)       | JS меняет DOM напрямую с вводом от пользователя         | `document.write(location.href)`             |
| Self-XSS                     | Пользователь сам запускает скрипт под обманом           | Не является уязвимостью, но опасно          |
| double encoding              | Двойное кодирование bypass-атаков                       | `%253Cscript%253E...`                       |
| Mutated XSS (mXSS)           | Браузер изменяет код и создаёт XSS-вхождения            | Незакрытые теги, неправильно экранированные |
| Vue: unsafe `v-html`         | Вставка HTML от пользователя без очистки                | Использовать санитайзер + CSP               |
| Vue: монтирование на HTML    | Монтируется на серверный HTML с пользовоч. вводом       | Vue может интерпретировать как шаблон       |
| Защита: escaping/encoding    | Экранирование символов перед вставкой                   | HTML entity, JS-escape, CSS-escape          |
| Санитизация HTML (DOMPurify) | Очистка HTML от скриптов                                | Использовать при `v-html`                   |
| CSP                          | Политика доверенных источников                          | Запрет inline-скриптов, только безопасные   |
| HttpOnly-куки                | Куки недоступны из JS                                   | Снижение риска кражи сессии                 |
| Фреймворки                   | Автоматически экранируют вывод                          | React, Vue, Angular                         |
