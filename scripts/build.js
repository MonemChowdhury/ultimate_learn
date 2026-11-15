#!/usr/bin/env node
/* Builds one self-contained HTML page per chapter.
 *   node scripts/build.js                     → builds every chapter under content/
 *   node scripts/build.js physics-1/vectors   → builds one chapter
 * Output: dist/<subject>/<chapter>.html
 */
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..'),CONTENT=path.join(ROOT,'content'),DIST=path.join(ROOT,'dist');
const read=(d,f)=>fs.readFileSync(path.join(d,f),'utf8');
const json=(d,f)=>JSON.parse(read(d,f));
const J=x=>JSON.stringify(x);

function build(id){
 const dir=path.join(CONTENT,id),ch=json(dir,'chapter.json'),T=ch.topics;
 const bank=json(dir,'bank.json'),past=json(dir,'past.json'),learn=json(dir,'learn.json');
 const bad=[];
 bank.forEach((b,i)=>{if(!T[b.topic])bad.push(`bank #${i+1}: unknown topic ${b.topic}`);if(b.options.length!==4||new Set(b.options).size!==4)bad.push(`bank #${i+1}: needs 4 different options`);if(!(b.answer>=0&&b.answer<=3))bad.push(`bank #${i+1}: answer must be 0–3`)});
 past.forEach((p,i)=>{if(!T[p.topic])bad.push(`past #${i+1}: unknown topic ${p.topic}`)});
 Object.keys(ch.weights).forEach(k=>{if(!T[k])bad.push(`weights: unknown topic ${k}`)});
 if(bad.length){console.error(bad.join('\n'));process.exit(1)}
 const topics='/* ---------- topics ---------- */\nconst '+Object.entries(T).map(([k,v])=>`${k}=${J(v)}`).join(',')+';\n'+
  'const TW={'+Object.entries(ch.weights).map(([k,v])=>`[${k}]:${v}`).join(',')+'};';
 const bankJs='/* ---------- question bank (content/'+id+'/bank.json) ---------- */\nconst BANK='+J(bank.map(b=>Object.assign({t:T[b.topic],q:b.question,o:b.options,a:b.answer,e:b.explanation},b.mistakes?{w:b.mistakes}:{})))+';';
 const pastJs='/* ---------- past admission questions (content/'+id+'/past.json) ---------- */\nconst PAST='+J(past.map(p=>[p.exam,p.session,T[p.topic],p.type,p.practice]))+';';
 const L=learn,learnJs='const RULES='+J(L.rules)+';\nconst DEFS='+J(L.definitions.map(d=>[d.term,d.meaning]))+';\nconst ONE='+J(L.oneLiners.map(o=>[o.q,o.a]))+';\nconst SHORT='+J(L.shortAnswers.map(o=>[o.q,o.a]))+';\nconst UNITS='+J(L.units.map(u=>[u.quantity,u.type,u.unit,u.dimension]))+';\nconst FORM='+J(L.formulas.map(f=>({h:f.title,f:f.formula,w:f.when,c:f.shortcut,x:f.example,s:f.steps})))+';';
 const sub=(s,k,v)=>{if(!s.includes(k))throw new Error('template is missing '+k);return s.split(k).join(v)};
 let html=read(path.join(ROOT,'engine'),'chapter-template.html');
 html=sub(html,'/*@@TOPICS@@*/',topics);html=sub(html,'/*@@BANK@@*/',bankJs);html=sub(html,'/*@@TEMPLATES@@*/',read(dir,'templates.js'));
 html=sub(html,'/*@@PAST@@*/',pastJs);html=sub(html,'/*@@LEARN@@*/',learnJs);
 html=sub(html,'%%PAGE_TITLE%%',ch.pageTitle);html=sub(html,'%%TITLE%%',ch.title);html=sub(html,'%%SUBTITLE%%',ch.subtitle);
 const out=path.join(DIST,id+'.html');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,html);
 console.log(`built ${path.relative(ROOT,out)}: ${bank.length} bank questions, ${past.length} past questions`);
 return out}

const chapters=process.argv.slice(2);
const all=()=>fs.readdirSync(CONTENT).flatMap(s=>fs.readdirSync(path.join(CONTENT,s)).filter(c=>fs.existsSync(path.join(CONTENT,s,c,'chapter.json'))).map(c=>s+'/'+c));
(chapters.length?chapters:all()).forEach(build);
module.exports={build};
