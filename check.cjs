const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const dir=__dirname;
const C=require(path.join(dir,'core.js'));
const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(dir,'data.js'),'utf8')+';this.seed=SEED;this.topics=TOPICS;this.prompts=PROMPTS;this.vouchers=VOUCHERS;this.medals=MEDALS;this.letters=SECRET_LETTERS;',ctx);
const seed=JSON.parse(JSON.stringify(ctx.seed)),topics=JSON.parse(JSON.stringify(ctx.topics)),prompts=JSON.parse(JSON.stringify(ctx.prompts));
assert.equal(ctx.vouchers.length,5);
assert.equal(ctx.medals.length,8);
assert.equal(ctx.letters.length,4);
const a=(id,qid,choice,key=true)=>({id,qid,choice,key,topic:'epi',confidence:'high',at:'2026-10-29T20:00:00.000Z',session:'s1'});
const rows=[a('1','campo-1',true),a('2','campo-2',true,false),a('3','campo-3',null),a('4','campo-2',false,false)];
assert.deepEqual(C.stats(rows),{total:4,correct:2,wrong:1,blank:1,answered:3,accuracy:67,net:1,unique:3});
assert.equal(C.stats([]).accuracy,null);
assert.equal(C.stats([a('1','campo-1',null)]).net,0);
assert.deepEqual(C.pending(rows),['campo-3']);
assert.equal(C.first(rows).length,3);
assert.equal(C.stats(C.first(rows)).accuracy,50);
assert.equal(new Set(C.shuffle(seed).map(q=>q.id)).size,seed.length);
const b=C.empty();b.attempts=rows;b.drafts={p6:{text:'Teste discursiva ADEAL',checks:[0,2]}};
b.session={id:'sim-1',ids:['campo-1','campo-27'],index:0,mode:'simulado',started:'2026-10-29T22:00:00.000Z',done:false};
assert.equal(C.validateBackup(b,seed,topics),b);
assert.equal(C.merge(b,b).attempts.length,4);
assert.throws(()=>C.validateBackup({...b,version:3},seed,topics));
assert.throws(()=>C.validateBackup({...b,attempts:[{...rows[0],choice:'true'}]},seed,topics));
assert.throws(()=>C.validateBackup({...b,attempts:[{...rows[0],qid:'unknown'}]},seed,topics));
assert.ok(seed.length>=415,`Expected >=415 questions, got ${seed.length}`);
assert.equal(new Set(seed.map(q=>q.id)).size,seed.length);
assert.equal(new Set(seed.map(q=>q.text.replace(/\s+/g,' ').trim().toLowerCase())).size,seed.length,'Duplicate question text found');
assert.equal(prompts.length,6);
const hardQs=seed.filter(q=>q.hard);
const realQs=seed.filter(q=>q.real);
assert.ok(hardQs.length>=140,`Expected >=140 hard questions, got ${hardQs.length}`);
assert.ok(realQs.length>=145,`Expected >=145 real Cebraspe questions, got ${realQs.length}`);
for(const q of seed){
 assert.ok(topics.find(t=>t.id===q.topic),`Invalid topic ${q.topic}`);
 assert.equal(typeof q.answer,'boolean');
 assert.ok(q.text&&q.explanation&&q.source&&q.source.title,`Incomplete question ${q.id}`);
 assert.ok(!/^(Certo|Errado)\.\s/i.test(q.explanation),`Redundant leading Certo/Errado in explanation of ${q.id}`);
 if(q.real){
  assert.match(q.origin,/^Prova Real • (Cebraspe|CESPE\/Cebraspe) — .+ \(\d{4}\)$/,`Invalid real origin on ${q.id}: ${q.origin}`);
 }else{
  assert.match(q.origin,/^Inédita (Nível Difícil )?• /,`Non-real question ${q.id} must be clearly labeled Inédita: ${q.origin}`);
 }
}
for(const t of topics){
 const cnt=seed.filter(q=>q.topic===t.id).length;
 const hcnt=hardQs.filter(q=>q.topic===t.id).length;
 const rcnt=realQs.filter(q=>q.topic===t.id).length;
 assert.ok(cnt>=20,`Topic ${t.id} has only ${cnt} questions`);
 assert.ok(hcnt>=6,`Topic ${t.id} has only ${hcnt} hard questions`);
 assert.ok(rcnt>=8,`Topic ${t.id} has only ${rcnt} real Cebraspe questions`);
}
const basCount=seed.filter(q=>topics.find(t=>t.id===q.topic).group==='Básicos').length;
const espCount=seed.filter(q=>topics.find(t=>t.id===q.topic).group==='Específicos').length;
const realBasCount=realQs.filter(q=>topics.find(t=>t.id===q.topic).group==='Básicos').length;
const realEspCount=realQs.filter(q=>topics.find(t=>t.id===q.topic).group==='Específicos').length;
assert.ok(basCount>=165,`Expected >=165 Básicos, got ${basCount}`);
assert.ok(espCount>=245,`Expected >=245 Específicos, got ${espCount}`);
assert.ok(realBasCount>=55,`Expected >=55 real Básicos, got ${realBasCount}`);
assert.ok(realEspCount>=85,`Expected >=85 real Específicos, got ${realEspCount}`);
for(const file of ['data.js','core.js','app.js'])new vm.Script(fs.readFileSync(path.join(dir,file),'utf8'));
console.log(`PASS: ${seed.length} questions (${basCount} P1 + ${espCount} P2 | ${realQs.length} Provas Reais Cebraspe [${realBasCount} P1 + ${realEspCount} P2] | ${hardQs.length} Nível Difícil across all ${topics.length} topics), ${prompts.length} essay prompts, simulado mode, backup validation and JS syntax verified.`);
