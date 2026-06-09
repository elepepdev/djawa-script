import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('README.md', 'utf-8');

// 1. Fix the stray backtick in Loops heading
content = content.replace('### Loops```\n', '### Loops\n');

// 2. Find line numbers for key sections
const lines = content.split('\n');
let tocEnd = 0;
let oopSectionStart = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.startsWith('## ') && tocEnd === 0 && i > 0) tocEnd = i;
  if (line.startsWith('## Object-Oriented Programming')) oopSectionStart = i;
}

// 3. Build new content piece by piece
const parts = {};

// Scan through the file and collect section blocks
let currentSection = null;
let currentContent = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.startsWith('## ') || (line.startsWith('---') && currentSection && currentContent.length > 0)) {
    if (currentSection) {
      // Don't include the --- separator in the section content
      if (line.startsWith('---')) {
        parts[currentSection] = currentContent.join('\n');
        currentContent = [];
        continue;
      }
      parts[currentSection] = currentContent.join('\n');
      currentContent = [];
    }
    if (line.startsWith('## ')) {
      currentSection = line.replace(/^## /, '').trim();
    }
  } else if (currentSection) {
    currentContent.push(line);
  }
}
if (currentSection && currentContent.length > 0) {
  parts[currentSection] = currentContent.join('\n');
}

// Helper: extract feature blocks from content
function extractFeatureBody(text, heading) {
  const esc = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`### ${esc}\\s*\\n([\\s\\S]*?)(?=\\n### |\\n## |\\n---|$)`, 'm');
  const m = text.match(re);
  return m ? `### ${heading}\n${m[1].trimEnd()}` : '';
}

// Check what content we have in the Unique Features / orphaned sections
const ufText = parts['Unique Features'] || '';
const opText = parts['Optional Parentheses (v2.2.0)'] || '';

// Extract feature blocks from between Unique Features and OOP
// These are the v2.1.0 and v2.3.0 features that ended up as orphans
const orphanBlock = content.split('## Unique Features')[1]?.split('## Optional Parentheses')[0] || '';
const afterOpBlock = content.split('## Optional Parentheses (v2.2.0)')[1]?.split('## Object-Oriented Programming')[0] || '';

// Extract v2.1.0 orphan features
const rawString = extractFeatureBody(orphanBlock, 'Raw String');
const rangeIterator = extractFeatureBody(orphanBlock, 'Range Iterator');
const iteratorHelpers = extractFeatureBody(orphanBlock, 'Iterator Helpers');
const regexpLiteral = extractFeatureBody(orphanBlock, 'RegExp Literal');
const enumSection = extractFeatureBody(orphanBlock, 'Enum');
const patternMatching = extractFeatureBody(orphanBlock, 'Pattern Matching');
const inlineAssertion = extractFeatureBody(orphanBlock, 'Inline Assertion');

// Extract v2.3.0 orphan features
const sealedClass = extractFeatureBody(afterOpBlock, 'Sealed Class');
const abstractClass = extractFeatureBody(afterOpBlock, 'Abstract Class');
const interfaceSection = extractFeatureBody(afterOpBlock, 'Interface');
const structSection = extractFeatureBody(afterOpBlock, 'Struct');
const labeledStatements = extractFeatureBody(afterOpBlock, 'Labeled Statements');
const asyncIterator = extractFeatureBody(afterOpBlock, 'Async Iterator');
const taggedTemplate = extractFeatureBody(afterOpBlock, 'Tagged Template Literals');

// Also find the content that ended up without its heading (Sealed Class was missing its heading)
// Look for "Prevent a class from being subclassed" in orphan block
const sealedHeadingMatch = afterOpBlock.match(/^(Prevent a class from being subclassed[\s\S]*?)(?=\n### Abstract Class)/m);
let sealedNoHeading = '';
if (sealedHeadingMatch) {
  sealedNoHeading = '### Sealed Class (`katutup kelas`)\n' + sealedHeadingMatch[1].trim();
}

// Remove v2.1.0 features from Unique Features section
let cleanedUF = ufText;
const headingsToRemove = ['Raw String', 'Range Iterator', 'Iterator Helpers', 'RegExp Literal', 'Enum', 'Pattern Matching', 'Inline Assertion'];
for (const h of headingsToRemove) {
  const re = new RegExp(`\n### ${h}[\\s\\S]*?(?=\n### |\n---|$)`, 'm');
  cleanedUF = cleanedUF.replace(re, '');
}
// Clean up blank lines
cleanedUF = cleanedUF.replace(/\n{3,}/g, '\n\n').trim();

// Now integrate features into proper sections

// --- Data Types: add Numeric Separator, Raw String, RegExp Literal ---
let dtText = parts['Core Concepts'] || '';
// The Data Types subsection is within Core Concepts
const dtMarker = '### Data Types\n';
const dtIdx = dtText.indexOf(dtMarker);
if (dtIdx !== -1) {
  const dtEnd = dtText.indexOf('\n### ', dtIdx + 1);
  const dtBlock = dtText.slice(dtIdx, dtEnd !== -1 ? dtEnd : dtText.length);
  const dtBodyEnd = dtBlock.lastIndexOf('```');
  const before = dtBlock.slice(0, dtBodyEnd + 3);
  const after = dtBlock.slice(dtBodyEnd + 3);
  // Extract Numeric Separator from v2.1.0 orphan block (it's still in the orphanBlock)
  const numericSepBody = orphanBlock.match(/### Numeric Separator\n[\s\S]*?(?=\n### |$)/);
  const numericSep = numericSepBody ? '### Numeric Separator\n' + numericSepBody[1].trim() : '';
  let additions = '';
  if (numericSep) additions += '\n\n' + numericSep;
  if (rawString) additions += '\n\n' + rawString;
  if (regexpLiteral) additions += '\n\n' + regexpLiteral;
  const newDtBlock = before + additions + '\n' + after;
  dtText = dtText.slice(0, dtIdx) + newDtBlock + dtText.slice(dtIdx + dtBlock.length);
}
parts['Core Concepts'] = dtText;

// --- Control Flow: add Pattern Matching after Switch ---
let cfText = parts['Control Flow'] || '';
// Find the last ``` before Switch section ends
const switchEnd = cfText.lastIndexOf('```');
// Insert Pattern Matching before the end of the section (or after Switch)
const cfAdd = patternMatching ? '\n\n' + patternMatching : '';
if (cfAdd) {
  const switchSectionEnd = cfText.lastIndexOf('\n---', switchEnd) !== -1
    ? cfText.lastIndexOf('\n---', switchEnd)
    : cfText.length;
  cfText = cfText.slice(0, switchSectionEnd) + cfAdd + '\n' + cfText.slice(switchSectionEnd);
}
// Also add the Optional Parentheses content into Control Flow
const opBody = parts['Optional Parentheses (v2.2.0)'] || '';
const opClean = opBody.replace(/^---\s*\n/, '').trim();
if (opClean) {
  cfText = cfText.trimEnd() + '\n\n---\n\n### Optional Parentheses\n\n' + opClean + '\n';
}
parts['Control Flow'] = cfText;

// --- Error Handling: add Inline Assertion ---
let ehText = parts['Error Handling'] || '';
if (inlineAssertion) {
  ehText = ehText.trimEnd() + '\n\n' + inlineAssertion + '\n';
  // Remove trailing --- if any
  ehText = ehText.replace(/\n---\s*$/, '');
}
parts['Error Handling'] = ehText;

// --- Loops: add Range Iterator, Labeled Statements, Async Iterator ---
// These are within Control Flow section
const loopsMarker = '### Loops\n';
const loopsIdx = cfText.indexOf(loopsMarker);
if (loopsIdx !== -1) {
  const loopsEnd = cfText.indexOf('\n### ', loopsIdx + 1);
  const loopsBlock = cfText.slice(loopsIdx, loopsEnd !== -1 ? loopsEnd : cfText.length);
  const loopsBodyEnd = loopsBlock.lastIndexOf('```');
  const before = loopsBlock.slice(0, loopsBodyEnd + 3);
  const after = loopsBlock.slice(loopsBodyEnd + 3);
  let additions = '';
  if (rangeIterator) additions += '\n\n' + rangeIterator;
  if (labeledStatements) additions += '\n\n' + labeledStatements;
  if (asyncIterator) additions += '\n\n' + asyncIterator;
  const newLoopsBlock = before + additions + '\n' + after;
  cfText = cfText.slice(0, loopsIdx) + newLoopsBlock + cfText.slice(loopsIdx + loopsBlock.length);
}
parts['Control Flow'] = cfText;

// --- Functions: add Tagged Template Literals after Async Functions ---
let funcText = parts['Functions'] || '';
if (taggedTemplate) {
  funcText = funcText.trimEnd() + '\n\n' + taggedTemplate + '\n';
}
parts['Functions'] = funcText;

// --- Built-in Library > Array Methods: add Iterator Helpers ---
// Iterator Helpers is already in orphanBlock - extract clean version
let ihClean = iteratorHelpers.replace(/\| JPL \| JavaScript \| Description \|\n\| :--- \| :--- \| :--- \|[\s\S]*?(?=\n```)/m, '').trim();
let blText = parts['Built-in Library'] || '';
const amMarker = '### Array Methods\n';
const amIdx = blText.indexOf(amMarker);
if (amIdx !== -1) {
  const amEnd = blText.indexOf('\n### ', amIdx + 1);
  const amBlock = blText.slice(amIdx, amEnd !== -1 ? amEnd : blText.length);
  const amBodyEnd = amBlock.lastIndexOf('```');
  const before = amBlock.slice(0, amBodyEnd + 3);
  const after = amBlock.slice(amBodyEnd + 3);
  const newAmBlock = before + '\n\n' + ihClean + '\n' + after;
  blText = blText.slice(0, amIdx) + newAmBlock + blText.slice(amIdx + amBlock.length);
}
parts['Built-in Library'] = blText;

// --- OOP: add Sealed Class, Abstract Class, Interface, Struct, Enum ---
let oopText = parts['Object-Oriented Programming (OOP)'] || '';
let oopAdditions = '';
if (sealedNoHeading) oopAdditions += '\n\n' + sealedNoHeading;
if (abstractClass) oopAdditions += '\n\n' + abstractClass;
if (interfaceSection) oopAdditions += '\n\n' + interfaceSection;
if (structSection) oopAdditions += '\n\n' + structSection;
if (enumSection) oopAdditions += '\n\n' + enumSection;
if (oopAdditions) {
  oopText = oopText.trimEnd() + oopAdditions + '\n';
}
parts['Object-Oriented Programming (OOP)'] = oopText;

// --- Unique Features: cleaned up ---
parts['Unique Features'] = cleanedUF;

// --- Remove Optional Parentheses section (it's now in Control Flow) ---
delete parts['Optional Parentheses (v2.2.0)'];

// --- Rebuild the file ---
let result = '';
for (const [sectionName, sectionBody] of Object.entries(parts)) {
  if (result) result += '\n---\n\n';
  const body = sectionBody.trim();
  if (body) {
    result += `## ${sectionName}\n${body}\n`;
  } else {
    result += `## ${sectionName}\n`;
  }
}

// Clean up
result = result.replace(/\n{3,}/g, '\n\n');
result = result.replace(/\n---\n\n---\n/g, '\n---\n');

writeFileSync('README.md', result);
console.log('Done restructuring');
