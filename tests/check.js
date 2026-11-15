#!/usr/bin/env node
/* Checks a built chapter: every generated question must have 4 different options and exactly one correct answer,
 * every past question must resolve to a practice item of the same topic, and the full-chapter test must cover everything.
 *   node tests/check.js                       → checks every built chapter in dist/
 *   node tests/check.js physics-1/vectors 5000 → one chapter, 5000 samples per template
 */
const fs=require('fs'),path=require('path'),vm=require('vm');
const DIST=path.join(__dirname,'..','dist');
function load(file){const html=fs.readFileSync(file,'utf8'),js=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
 const ctx={module:{exports:{}},console};vm.createContext(ctx);vm.runInContext(js+'\n;module.exports={makeTest,BANK,TPL,fromTpl,fromBank,PAST,pastQ,TI};',ctx);return ctx.module.exports}
function check(id,N){const M=load(path.join(DIST,id+'.html'));let bad=0;
 M.TPL.forEach((f,i)=>{for(let k=0;k<N;k++){let q;try{q=M.fromTpl(f)}catch(e){bad++;console.log(`template ${i}: could not build 3 distinct wrong options`);break}
  const hs=q.opts.map(o=>o.h);if(new Set(hs).size!==4||q.opts.filter(o=>o.ok).length!==1||/NaN|undefined|Infinity/.test(hs.join()+q.text+q.exp)){bad++;if(bad<5)console.log('BAD',i,hs,q.text)}}});
 M.PAST.forEach((r,i)=>{try{M.pastQ(r[4])}catch(e){bad++;console.log(`past #${i+1} (${r[4]}) has no practice item`)}});
 const full=M.makeTest('all',{});if(full.length!==M.BANK.length+M.TPL.length){bad++;console.log('full test does not cover everything')}
 console.log(`${id}: ${M.BANK.length} bank, ${M.TPL.length} templates, ${M.TPL.length*N} generated, ${M.PAST.length} past → ${bad?bad+' problems':'all OK'}`);return bad}
const [one,n]=process.argv.slice(2),N=+(n||2000);
const ids=one?[one]:fs.readdirSync(DIST).flatMap(s=>fs.readdirSync(path.join(DIST,s)).filter(f=>f.endsWith('.html')).map(f=>s+'/'+f.slice(0,-5)));
process.exit(ids.reduce((s,id)=>s+check(id,N),0)?1:0);
