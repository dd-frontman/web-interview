import fs from "node:fs";
import path from "node:path";

const docsRoot = path.join(process.cwd(), "docs");

function walk(dir) {
	const result = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const absolute = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (absolute.startsWith(path.join(docsRoot, "public"))) {
				continue;
			}
			result.push(...walk(absolute));
			continue;
		}

		if (entry.isFile() && entry.name.endsWith(".md")) {
			result.push(absolute);
		}
	}
	return result;
}

function wikiTargetToText(target) {
	const normalized = target.trim().replace(/^\.\//, "");
	const parts = normalized.split("/").filter(Boolean);
	const last = parts[parts.length - 1] ?? normalized;
	return last.replace(/\.md$/i, "");
}

const files = walk(docsRoot);
let changed = 0;

for (const file of files) {
	const source = fs.readFileSync(file, "utf8");
	let next = source;

	// Remove ChatGPT UTM markers from links.
	next = next.replace(/\?utm_source=chatgpt\.com/g, "");
	next = next.replace(/&utm_source=chatgpt\.com/g, "");

	// Remove oaicite artifacts.
	next = next.replace(/\s*:contentReference\[oaicite:[^\]]+\]\{[^}]+\}/g, "");
	next = next.replace(/^::contentReference\[oaicite:[^\]]+\]\{[^}]+\}\s*$/gm, "");

	// Convert Obsidian image embeds to nothing (asset is not present on site).
	next = next.replace(/^\s*!\[\[[^\]]+\]\]\s*$/gm, "");

	// Convert Obsidian wikilinks to plain text labels.
	next = next.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_m, target, label) => {
		return label.trim() || wikiTargetToText(target);
	});
	next = next.replace(/\[\[([^\]]+)\]\]/g, (_m, target) => wikiTargetToText(target));

	// Remove prompt leftovers and malformed tails.
	next = next.replace(/^\s*ChatGPT может допускать ошибки\.[^\n]*$/gm, "");
	next = next.replace(/^\s*Скажи, что нужно дальше[^\n]*$/gm, "");
	next = next.replace(/\?```\s*$/gm, "?");

	// Trim excessive blank lines (max 2).
	next = next.replace(/\n{3,}/g, "\n\n");

	if (next !== source) {
		fs.writeFileSync(file, next);
		changed += 1;
	}
}

console.log(`Updated markdown files: ${changed}`);
