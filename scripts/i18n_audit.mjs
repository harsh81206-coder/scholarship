import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const require = createRequire(path.join(root, "web", "package.json"));
const ts = require("typescript");
const webRoot = path.join(root, "web");
const findings = [];

async function filesUnder(directory) {
  const result = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await filesUnder(full));
    else if (/\.(tsx|ts)$/.test(entry.name)) result.push(full);
  }
  return result;
}

function attrText(attribute, sourceFile) {
  const value = attribute?.initializer;
  if (value && (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value))) {
    return value.text;
  }
  return undefined;
}

function inIcon(node, sourceFile) {
  for (let current = node.parent; current; current = current.parent) {
    if (ts.isJsxElement(current) || ts.isJsxSelfClosingElement(current)) {
      const opening = ts.isJsxElement(current) ? current.openingElement : current;
      for (const attribute of opening.attributes.properties) {
        if (ts.isJsxAttribute(attribute) && attribute.name.getText(sourceFile) === "className") {
          if (attrText(attribute, sourceFile)?.includes("material-symbols-outlined")) return true;
        }
      }
    }
  }
  return false;
}

function meaningful(text) {
  return /[A-Za-z]{2,}|[\u0A80-\u0AFF]|[\u0900-\u097F]/.test(text);
}

function mixed(text) {
  const withoutPlaceholders = text.replace(/\{[a-zA-Z0-9_]+\}/g, " ").replace(/&[a-z]+;/gi, " ");
  const englishWords = /\b(?:[a-z]{3,}|[A-Z][a-z]{2,})\b/;
  return /[\u0A80-\u0AFF\u0900-\u097F]/.test(withoutPlaceholders) && englishWords.test(withoutPlaceholders);
}

for (const file of [...await filesUnder(path.join(webRoot, "app")), ...await filesUnder(path.join(webRoot, "components"))]) {
  const text = await fs.readFile(file, "utf8");
  const sourceFile = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  function visit(node) {
    if (ts.isJsxText(node)) {
      const value = node.getText(sourceFile).replace(/\s+/g, " ").trim();
      if (value && meaningful(value) && !inIcon(node, sourceFile)) {
        findings.push({ kind: mixed(value) ? "mixed JSX text" : "unlocalized JSX text", file, line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1, value });
      }
    }
    if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
      if (node.tagName.getText(sourceFile) === "T") {
        for (const attribute of node.attributes.properties) {
          if (!ts.isJsxAttribute(attribute)) continue;
          const language = attribute.name.getText(sourceFile);
          if (language !== "gu" && language !== "hi") continue;
          const value = attrText(attribute, sourceFile);
          if (!value) continue;
          const cleaned = value.replace(/\s*\([^()]*[A-Za-z][^()]*\)/g, "").replace(/\s*(?:\/|\||•|—)\s*[A-Za-z][A-Za-z /&-]*/g, "");
          if (mixed(cleaned)) {
            findings.push({ kind: `mixed ${language} translation`, file, line: sourceFile.getLineAndCharacterOfPosition(attribute.getStart(sourceFile)).line + 1, value });
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
}

const counts = findings.reduce((summary, item) => ({ ...summary, [item.kind]: (summary[item.kind] ?? 0) + 1 }), {});
console.log(`i18n audit: ${findings.length} remaining source issues`);
console.table(Object.entries(counts).map(([kind, count]) => ({ kind, count })));
for (const item of findings) {
  console.log(`${path.relative(root, item.file)}:${item.line} [${item.kind}] ${item.value}`);
}
if (findings.length) process.exitCode = 1;
