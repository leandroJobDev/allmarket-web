#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file === 'node_modules' || file === 'dist' || file === '.git') continue;
      walk(full, filelist);
    } else {
      if (/\.(ts|scss)$/.test(full)) filelist.push(full);
    }
  }
  return filelist;
}

function stripComments(content) {
  let out = '';
  let i = 0;
  const len = content.length;
  let inSingle = false;
  let inDouble = false;
  let inBack = false;
  let inBlockComment = false;
  let inLineComment = false;
  let prev = '';

  while (i < len) {
    const ch = content[i];
    const next = content[i + 1];

    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i += 2;
        continue;
      }
      i++;
      continue;
    }

    if (inLineComment) {
      if (ch === '\n' || ch === '\r') {
        inLineComment = false;
        out += ch; // keep newline
      }
      i++;
      continue;
    }

    // handle string toggles (ignore escaped quotes)
    if (!inSingle && !inDouble && !inBack) {
      if (ch === "'") { inSingle = true; out += ch; i++; continue; }
      if (ch === '"') { inDouble = true; out += ch; i++; continue; }
      if (ch === '`') { inBack = true; out += ch; i++; continue; }
    } else {
      // inside strings
      if (ch === '\\') { // escape
        out += ch;
        if (i + 1 < len) { out += content[i+1]; i +=2; continue; }
      }
      if (inSingle && ch === "'") { inSingle = false; out += ch; i++; continue; }
      if (inDouble && ch === '"') { inDouble = false; out += ch; i++; continue; }
      if (inBack && ch === '`') { inBack = false; out += ch; i++; continue; }
      out += ch; i++; continue;
    }

    // not in string or comment: detect comment starts
    if (ch === '/' && next === '*') {
      inBlockComment = true; i += 2; continue;
    }
    if (ch === '/' && next === '/') {
      inLineComment = true; i += 2; continue;
    }

    out += ch;
    i++;
  }

  return out;
}

const root = process.cwd();
const files = walk(root);
let changed = 0;
for (const f of files) {
  try {
    const src = fs.readFileSync(f, 'utf8');
    const cleaned = stripComments(src);
    if (cleaned !== src) {
      fs.writeFileSync(f, cleaned, 'utf8');
      changed++;
    }
  } catch (e) {
    console.error('Error processing', f, e.message);
  }
}
if (changed === 0) process.exit(0);
else process.exit(0);
