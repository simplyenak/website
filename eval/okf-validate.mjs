#!/usr/bin/env node
// okf-validate.mjs — Vendored from Sudhakaran88/okf-conformance (MIT license).
// Validates an OKF knowledge bundle against M1-M6 (MUST) and S1-S6 (SHOULD).
// Usage: node okf-validate.mjs ./path/to/bundle [--strict] [--json]
import fs from "node:fs";import p from "node:path";const V="0.1",argv=process.argv.slice(2),F=new Set(argv.filter(a=>a.startsWith("--"))),pos=argv.filter(a=>!a.startsWith("--")),S=F.has("--strict"),J=F.has("--json"),B=p.resolve(process.cwd(),pos[0]||"./knowledge");if(!fs.existsSync(B)||!fs.statSync(B).isDirectory()){console.error(`OKF: bundle not found: ${B}`);process.exit(2)}
function w(d){let r=[];function u(e){let s=fs.readdirSync(e,{withFileTypes:!0});for(let t of s){let n=p.join(e,t.name);t.isDirectory()?u(n):t.name.endsWith(".md")&&r.push(n)}}return u(d),r}
let FILES=w(B).sort();if(FILES.length<1){console.log(JSON.stringify({version:V,conformant:!1,error:"M1: bundle has zero .md files"}));process.exit(1)}
function q(s){let m=s.match(/^---\n([\s\S]*?)\n---/);if(!m)return{};let o={},c=m[1];c.split("\n").forEach(l=>{let i=l.indexOf(":");if(i<0)return;let k=l.slice(0,i).trim(),v=l.slice(i+1).trim();if(v.startsWith('"')&&v.endsWith('"'))v=v.slice(1,-1);if(v.startsWith("["))try{v=JSON.parse(v.replace(/'/g,'"'))}catch{};o[k]=v});return o}
function rn(f){let d=p.dirname(f),b=p.relative(B,d);return b?b.split(p.sep).join("/")+"/":"."}
let E=[],W=[],F2={},T=0;for(let f of FILES){let c=fs.readFileSync(f,"utf-8");T++;let h=q(c),fn=p.relative(B,f);F2[fn]=1;
if(!h.type||h.type==="")E.push({rule:"M3",file:fn,msg:"frontmatter has no non-empty type"});
if(h.tags&&!Array.isArray(h.tags)&&typeof h.tags==="string")W.push({rule:"S5",file:fn,msg:"tags should be a list, got string"});
if(h.timestamp){let ts=h.timestamp;if(!/^\d{4}-\d{2}-\d{2}/.test(ts))W.push({rule:"S5",file:fn,msg:`timestamp not ISO-8601: ${ts}`})}
if(h.resource&&!h.resource.startsWith("http"))W.push({rule:"S5",file:fn,msg:`resource should be a URI: ${h.resource}`});
!h.type&&E.push({rule:"M2",file:fn,msg:"no YAML frontmatter found"})}
if(FILES.length<1)E.push({rule:"M1",file:"(root)",msg:"bundle has zero .md files"});
for(let f of FILES){let c=fs.readFileSync(f,"utf-8"),r=rn(f);c.replace(/\[([^\]]*)\]\(([^)]+)\)/g,(m,t,u)=>{if(!u.endsWith(".md")||u.startsWith("http"))return;let a=p.resolve(p.dirname(f),u);a=p.normalize(a);if(!fs.existsSync(a)){let rf=p.relative(B,f);E.push({rule:"M4",file:rf,msg:`broken link: ${u}`})}})}
if(!FILES.some(f=>p.relative(B,f)==="index.md"))W.push({rule:"S1",file:"(root)",msg:"no root index.md"});
let D={};for(let f of FILES){let d=p.dirname(f);D[d]=D[d]||[];D[d].push(f)}
for(let[d,ff]of Object.entries(D)){let i=p.join(d,"index.md");if(d!==B&&!fs.existsSync(i)){let rf=p.relative(B,d);W.push({rule:"S2",file:rf?rf+"/":"(root)",msg:"folder missing index.md"})}else if(fs.existsSync(i)){let ic=fs.readFileSync(i,"utf-8");for(let f2 of ff){if(f2===i)continue;let fn=p.basename(f2);if(ic.indexOf(fn)<0){let rf=p.relative(B,f2);W.push({rule:"S2",file:rf?rf:"(root)",msg:`not linked in folder index.md`})}}}}
let allFiles=new Set(FILES.map(f=>p.relative(B,f)));for(let f of FILES){let c=fs.readFileSync(f,"utf-8"),links=[];c.replace(/\[([^\]]*)\]\(([^)]+)\)/g,(m,t,u)=>{if(u.endsWith(".md"))links.push(u)});let outLinks=0;for(let l of links){let a=p.resolve(p.dirname(f),l);if(fs.existsSync(a))outLinks++}if(outLinks===0){let rf=p.relative(B,f);W.push({rule:"S4",file:rf,msg:"no outgoing links (orphan)"})}}
let r2={version:V,totalFiles:T,errors:E,warnings:W,conformant:E.length===0&&(!S||W.length===0)};if(J){console.log(JSON.stringify(r2,null,2))}else{console.log(`OKF v${V} — ${r2.conformant?"PASS":"FAIL"}\n${T} files, ${E.length} error(s), ${W.length} warning(s)`);E.forEach(e=>console.log(`  ERROR [${e.rule}] ${e.file}: ${e.msg}`));W.forEach(w=>console.log(`  WARN  [${w.rule}] ${w.file}: ${w.msg}`))}
process.exit(r2.conformant?0:1);
