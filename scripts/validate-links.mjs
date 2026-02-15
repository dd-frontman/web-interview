import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const docsRoot = path.join(cwd, "docs");
const readmePath = path.join(cwd, "README.md");

const EXTERNAL_PROTOCOL_RE = /^(https?:|mailto:|tel:|data:)/i;
const MARKDOWN_LINK_RE = /!?\[[^\]]*\]\(([^)]+)\)/g;
const URL_WITH_TITLE_RE = /^(\S+)(?:\s+["'][^"']*["'])?$/;

function toPosix(filePath) {
	return filePath.split(path.sep).join("/");
}

function isInsidePublic(relativePath) {
	return relativePath === "public" || relativePath.startsWith("public/");
}

function stripCodeFences(source) {
	const lines = source.split(/\r?\n/);
	let inFence = false;
	const sanitized = [];

	for (const line of lines) {
		if (/^\s*```/.test(line)) {
			inFence = !inFence;
			sanitized.push("");
			continue;
		}
		sanitized.push(inFence ? "" : line);
	}

	return sanitized.join("\n");
}

function normalizeTarget(rawTarget) {
	let target = rawTarget.trim();
	if (target.startsWith("<") && target.endsWith(">")) {
		target = target.slice(1, -1).trim();
	}

	const match = target.match(URL_WITH_TITLE_RE);
	if (match) {
		target = match[1];
	}

	return target;
}

function splitPathAndHash(target) {
	const hashIndex = target.indexOf("#");
	if (hashIndex === -1) {
		return { pathPart: target, hashPart: "" };
	}
	return {
		pathPart: target.slice(0, hashIndex),
		hashPart: target.slice(hashIndex + 1),
	};
}

function collectDocRoutes() {
	const routes = new Set();
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
				routes.add(`/${rel.replace(/\.md$/, "")}`);
			}
		}
	}

	return routes;
}

function collectMarkdownFiles() {
	const files = [];
	if (fs.existsSync(readmePath)) {
		files.push(readmePath);
	}

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

function resolveRelativeTarget(baseFile, targetPath) {
	const baseDir = path.dirname(baseFile);
	const resolved = path.resolve(baseDir, targetPath);
	const candidates = [];

	if (path.extname(targetPath)) {
		candidates.push(resolved);
	} else {
		candidates.push(resolved);
		candidates.push(`${resolved}.md`);
		candidates.push(path.join(resolved, "index.md"));
	}

	return candidates.some((candidate) => fs.existsSync(candidate));
}

function validateMarkdownLinks(filePath, routeSet) {
	const errors = [];
	const source = fs.readFileSync(filePath, "utf8");
	const searchable = stripCodeFences(source);
	const rel = toPosix(path.relative(cwd, filePath));

	let match;
	while ((match = MARKDOWN_LINK_RE.exec(searchable)) !== null) {
		const rawTarget = match[1];
		const target = normalizeTarget(rawTarget);
		if (!target) {
			continue;
		}

		if (target.startsWith("#")) {
			continue;
		}

		if (EXTERNAL_PROTOCOL_RE.test(target)) {
			if (/^https?:/i.test(target)) {
				try {
					// eslint-disable-next-line no-new
					new URL(target);
				} catch {
					errors.push(`${rel}: invalid external URL: ${target}`);
				}
			}
			continue;
		}

		const { pathPart } = splitPathAndHash(target);
		if (!pathPart) {
			continue;
		}

		if (pathPart.startsWith("/")) {
			const normalized = pathPart.replace(/\/+$/, "") || "/";
			const routeCandidate = normalized === "/" ? "/index" : normalized;
			const publicCandidate = path.join(docsRoot, "public", normalized.replace(/^\//, ""));

			if (!routeSet.has(routeCandidate) && !fs.existsSync(publicCandidate)) {
				errors.push(`${rel}: missing root link target: ${target}`);
			}
			continue;
		}

		if (!resolveRelativeTarget(filePath, pathPart)) {
			errors.push(`${rel}: missing relative link target: ${target}`);
		}
	}

	return errors;
}

if (!fs.existsSync(docsRoot)) {
	console.error("Link validation failed: docs directory not found.");
	process.exit(1);
}

const routeSet = collectDocRoutes();
const files = collectMarkdownFiles();
const errors = files.flatMap((filePath) => validateMarkdownLinks(filePath, routeSet));

if (errors.length > 0) {
	console.error("Link validation failed:");
	for (const error of errors) {
		console.error(`- ${error}`);
	}
	process.exit(1);
}

console.log(`Link validation passed (${files.length} markdown files).`);
