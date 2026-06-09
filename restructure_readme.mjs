import { readFileSync, writeFileSync } from 'fs';

const fp = 'README.md';
let content = readFileSync(fp, 'utf-8');

// ============ SECTION CONTENT EXTRACTION ============

// Helper: extract content between a heading and the next heading or ---
function extractSection(text, heading) {
  const esc = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^${esc}\\s*\\n([\\s\\S]*?)(?=\\n## |\\n---|$)`, 'm');
  const m = text.match(re);
  return m ? m[1].trimEnd() : '';
}

function removeSection(text, heading) {
  const esc = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\n${esc}\\s*\\n[\\s\\S]*?(?=\\n## |\\n---|$)`, 'm');
  return text.replace(re, '');
}

// Template helpers
function subheading(name) {
  return `\n\n### ${name}\n`;
}

// ============ EXTRACT v2.1.0 FEATURES ============
const v210Section = content.match(/^## New Features \(v2\.1\.0\)\s*\n([\s\S]*?)(?=\n## |\n---|$)/m);
let v210Body = v210Section ? v210Section[1].trimEnd() : '';

// Remove the v2.1.0 section from content
content = content.replace(/\n## New Features \(v2\.1\.0\)\s*\n[\s\S]*?(?=\n## |\n---|$)/m, '\n');

// Parse individual features from v2.1.0
function extractFeature(text, name) {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`### ${esc}\\s*\\n([\\s\\S]*?)(?=\\n### |$)`, 'm');
  const m = text.match(re);
  return m ? `### ${name}\n${m[1].trimEnd()}` : '';
}

const numericSeparator = extractFeature(v210Body, 'Numeric Separator');
const rawString = extractFeature(v210Body, 'Raw String');
const rangeIterator = extractFeature(v210Body, 'Range Iterator');
const iteratorHelpers = extractFeature(v210Body, 'Iterator Helpers');
const regexpLiteral = extractFeature(v210Body, 'RegExp Literal');
const enumSection = extractFeature(v210Body, 'Enum');
const patternMatching = extractFeature(v210Body, 'Pattern Matching');
const inlineAssertion = extractFeature(v210Body, 'Inline Assertion');
// Promise Methods and Additional Built-in Objects are already outside v2.1.0 section in the current file

// ============ EXTRACT v2.3.0 FEATURES ============
const v230Section = content.match(/^## New Features \(v2\.3\.0\)\s*\n([\s\S]*?)(?=\n## |\n---|$)/m);
let v230Body = v230Section ? v230Section[1].trimEnd() : '';

content = content.replace(/\n## New Features \(v2\.3\.0\)\s*\n[\s\S]*?(?=\n## |\n---|$)/m, '\n');

const sealedClass = extractFeature(v230Body, 'Sealed Class');
const abstractClass = extractFeature(v230Body, 'Abstract Class');
const interfaceSection = extractFeature(v230Body, 'Interface');
const structSection = extractFeature(v230Body, 'Struct');
const labeledStatements = extractFeature(v230Body, 'Labeled Statements');
const asyncIterator = extractFeature(v230Body, 'Async Iterator');
const taggedTemplate = extractFeature(v230Body, 'Tagged Template Literals');

// ============ INTEGRATE INTO EXISTING SECTIONS ============

// --- Data Types — add Numeric Separator, Raw String, RegExp Literal ---
const dtMarker = '### Data Types\n';
let dtContent = content.match(/### Data Types\n[\s\S]*?(?=\n### |\n---|$)/m);
if (dtContent) {
  let oldDt = dtContent[0];
  let newDt = oldDt;
  // Add before the closing console example
  const dtEnd = newDt.lastIndexOf('```');
  const beforeEnd = newDt.slice(0, dtEnd);
  const afterEnd = newDt.slice(dtEnd);
  let additions = '';
  if (numericSeparator) additions += '\n\n' + numericSeparator;
  if (rawString) additions += '\n\n' + rawString;
  if (regexpLiteral) additions += '\n\n' + regexpLiteral;
  newDt = beforeEnd + additions + '\n\n' + afterEnd;
  content = content.replace(oldDt, newDt);
}

// --- Loops — add Range Iterator, Labeled Statements, Async Iterator ---
const loopsMarker = '### Loops\n';
let loopsContent = content.match(/### Loops\n[\s\S]*?(?=\n### |\n---|$)/m);
if (loopsContent) {
  let oldLoops = loopsContent[0];
  let newLoops = oldLoops;
  // Add after the loop control table
  const lcEnd = newLoops.lastIndexOf('```');
  // Actually we need to find a good insertion point
  // Find `mandek`/`lanjutno` table end
  const mandekEnd = newLoops.lastIndexOf('```');
  const before = newLoops.slice(0, mandekEnd);
  const after = newLoops.slice(newLoops.indexOf('\n', mandekEnd)); // skip past the closing ```
  let additions = '';
  if (rangeIterator) additions += '\n\n' + rangeIterator;
  if (labeledStatements) additions += '\n\n' + labeledStatements;
  if (asyncIterator) additions += '\n\n' + asyncIterator;
  newLoops = before + '```' + additions + after;
  content = content.replace(oldLoops, newLoops);
}

// --- Control Flow — add Pattern Matching after Switch ---
// Find the Switch section end and insert Pattern Matching before the --- separator
const switchEnd = content.indexOf('---', content.indexOf('### Switch Statement'));
if (switchEnd !== -1 && patternMatching) {
  // Insert before the --- that separates control flow from functions
  const insertPos = switchEnd;
  content = content.slice(0, insertPos) + '\n' + patternMatching + '\n\n' + content.slice(insertPos);
}

// --- Error Handling — add Inline Assertion ---
const errorSection = content.match(/## Error Handling\n[\s\S]*?(?=\n---|$)/m);
if (errorSection && inlineAssertion) {
  let oldErr = errorSection[0];
  // Add before the trailing ---
  const errEnd = oldErr.trimEnd().length;
  const newErr = oldErr.trimEnd() + '\n\n' + inlineAssertion + '\n';
  content = content.replace(oldErr, newErr);
}

// --- OOP section — add Sealed Class, Abstract Class, Interface, Struct, Enum ---
const oopSection = content.match(/## Object-Oriented Programming \(OOP\)\n[\s\S]*?(?=\n---|$)/m);
if (oopSection) {
  let oldOop = oopSection[0];
  let oopBody = oldOop;
  // Add at the end, before the trailing ---
  const oopEnd = oopBody.trimEnd().length;
  let oopAdditions = '';
  if (sealedClass) oopAdditions += '\n\n' + sealedClass;
  if (abstractClass) oopAdditions += '\n\n' + abstractClass;
  if (interfaceSection) oopAdditions += '\n\n' + interfaceSection;
  if (structSection) oopAdditions += '\n\n' + structSection;
  if (enumSection) oopAdditions += '\n\n' + enumSection;
  oopBody = oopBody.trimEnd() + oopAdditions + '\n';
  content = content.replace(oldOop, oopBody);
}

// --- Functions — add Tagged Template Literals ---
// Find the Async Functions section and add after it
const taggedInsert = content.indexOf('---', content.indexOf('### Async Functions'));
if (taggedInsert !== -1 && taggedTemplate) {
  // Insert before the --- after Async Functions
  content = content.slice(0, taggedInsert) + '\n' + taggedTemplate + '\n\n' + content.slice(taggedInsert);
}

// --- Array Methods — add Iterator Helpers ---
const arrayMethodsSection = content.match(/### Array Methods\n[\s\S]*?(?=\n### |\n---|$)/m);
if (arrayMethodsSection && iteratorHelpers) {
  let oldArr = arrayMethodsSection[0];
  // Remove the table part from Iterator Helpers (keep only the code example)
  const ihClean = iteratorHelpers
    .replace(/\| JPL \| JavaScript \| Description \|\n\| :--- \| :--- \| :--- \|\n[\s\S]*?(?=\n```)/m, '')
    .trim();
  // Add at the end
  const arrEnd = oldArr.trimEnd().length;
  const newArr = oldArr.trimEnd() + '\n\n' + ihClean + '\n';
  content = content.replace(oldArr, newArr);
}

// ============ UPDATE TOC ============
// Remove New Features entries from TOC and add individual entries
const tocStart = content.indexOf('- [Quick Start](#quick-start)');
const tocEnd = content.indexOf('\n---', tocStart);
let toc = content.slice(tocStart, tocEnd);

// Remove "New Features" TOC entries
toc = toc.replace(/\n- \[New Features.*?\(v2\.\d\.\d\)\].*[\s\S]*?(?=\n- |$)/, '');

// Add new TOC entries if they don't already exist
const tocAdditions = [
  '- [Sealed Class](#sealed-class-katutup-kelas)',
  '- [Abstract Class](#abstract-class-abstrak-kelas)',
  '- [Interface](#interface-wangun)',
  '- [Struct](#struct-struktur)',
  '- [Labeled Statements](#labeled-statements)',
  '- [Async Iterator](#async-iterator-kanggo-tenangan--soko-)',
  '- [Tagged Template Literals](#tagged-template-literals)',
];

// Insert new entries under OOP in TOC
const oopTocIndex = toc.indexOf('- [Object-Oriented Programming (OOP)](#object-oriented-programming-oop)');
if (oopTocIndex !== -1) {
  const lineEnd = toc.indexOf('\n', oopTocIndex);
  const indent = '\n  ';
  toc = toc.slice(0, lineEnd) + indent + tocAdditions.slice(0, 4).join('\n  ') + toc.slice(lineEnd);
}

// Insert Labeled and Async Iterator after Loops
const loopsTocIndex = toc.indexOf('- [Loops](#loops)');
if (loopsTocIndex !== -1) {
  // Find the end of the Loops sub-items (next top-level item)
  const afterLoops = toc.indexOf('\n- ', loopsTocIndex + 1);
  const indent = '\n  ';
  toc = toc.slice(0, afterLoops) + indent + '- [Labeled Statements](#labeled-statements)' + '\n  ' + '- [Async Iterator](#async-iterator-kanggo-tenangan--soko-)' + toc.slice(afterLoops);
}

// Insert Tagged Template under Functions
const funcsTocIndex = toc.indexOf('- [Functions](#functions)');
if (funcsTocIndex !== -1) {
  // Find AFTER the function sub-items (next top-level)
  const afterFuncs = toc.indexOf('\n- ', funcsTocIndex + 1);
  // Find the actual position (one past the last sub-item)
  // Add after Async Functions or Rest & Spread
  const asyncFuncsToc = toc.indexOf('- [Async Functions', funcsTocIndex);
  if (asyncFuncsToc !== -1) {
    const asyncLineEnd = toc.indexOf('\n', asyncFuncsToc);
    const indent = '\n  ';
    toc = toc.slice(0, asyncLineEnd) + indent + '- [Tagged Template Literals](#tagged-template-literals)' + toc.slice(asyncLineEnd);
  }
}

content = content.slice(0, tocStart) + toc + content.slice(tocEnd);

// ============ CLEANUP ============
// Remove any double blank lines
content = content.replace(/\n{3,}/g, '\n\n');
// Fix section separators (ensure consistent --- usage)
content = content.replace(/\n---\n\n---\n/g, '\n---\n');

writeFileSync(fp, content);
console.log('Done: ' + fp);
