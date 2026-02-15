import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const docsRoot = path.join(cwd, "docs");

const LINE_RULES = [
	{
		pattern: /(?:\?|&)utm_source=chatgpt\.com/g,
		message: "remove tracking parameter utm_source=chatgpt.com",
	},
	{
		pattern: /:contentReference\[oaicite:[^\]]+\]\{[^}]+\}/g,
		message: "remove oaicite artifact",
	},
	{
		pattern: /^\s*::contentReference\[oaicite:[^\]]+\]\{[^}]+\}\s*$/g,
		message: "remove oaicite line artifact",
	},
	{
		pattern: /!\[\[[^\]]+\]\]/g,
		message: "replace Obsidian image embed with standard markdown image",
	},
	{
		pattern: /\[\[[^[\]]+\]\]/g,
		message: "replace Obsidian wikilink with plain markdown link or text",
	},
	{
		pattern: /ChatGPT может допускать ошибки/gi,
		message: "remove assistant boilerplate text",
	},
	{
		pattern: /Скажи, что нужно дальше/gi,
		message: "remove assistant prompt text",
	},
];

function toPosix(filePath) {
	return filePath.split(path.sep).join("/");
}

function isInsidePublic(relativePath) {
	return relativePath === "public" || relativePath.startsWith("public/");
}

function collectMarkdownFiles() {
	const files = [];
	const stack = [docsRoot];

	while (stack.length > 0) {
		const current = stack.pop();
		for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
			const abs = path.join(current, entry.name);
			const rel = toPosix(path.relative(docsRoot, abs));

			if (isInsidePublic(rel)) {
				continue;
			}

			if (entry.isDirectory()) {
				stack.push(abs);
				continue;
			}

			if (entry.isFile() && entry.name.endsWith(".md")) {
				files.push(abs);
			}
		}
	}

	return files.sort();
}

function validateFile(filePath) {
	const issues = [];
	const source = fs.readFileSync(filePath, "utf8");
	const lines = source.split(/\r?\n/);
	const rel = toPosix(path.relative(cwd, filePath));

	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index];
		for (const rule of LINE_RULES) {
			rule.pattern.lastIndex = 0;
			if (rule.pattern.test(line)) {
				issues.push(`${rel}:${index + 1} ${rule.message}`);
			}
		}
	}

	let inFence = false;
	let fenceOpenedAt = 0;
	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index];
		if (/^\s*```/.test(line)) {
			if (inFence) {
				inFence = false;
				fenceOpenedAt = 0;
			} else {
				inFence = true;
				fenceOpenedAt = index + 1;
			}
		}
	}

	if (inFence) {
		issues.push(`${rel}:${fenceOpenedAt} unclosed code fence`);
	}

	return issues;
}

if (!fs.existsSync(docsRoot)) {
	console.error("Content validation failed: docs directory not found.");
	process.exit(1);
}

const files = collectMarkdownFiles();
const errors = files.flatMap(validateFile);

if (errors.length > 0) {
	console.error("Content validation failed:");
	for (const error of errors) {
		console.error(`- ${error}`);
	}
	process.exit(1);
}

console.log(`Content validation passed (${files.length} markdown files).`);
