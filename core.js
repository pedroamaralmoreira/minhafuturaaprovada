'use strict';
const Core = {
 empty:()=>({version:1,attempts:[],custom:[],favorites:[],notes:{},drafts:{},topicStatus:{},session:null}),
 stats(rows){const correct=rows.filter(a=>a.choice!==null&&a.choice===a.key).length;const blank=rows.filter(a=>a.choice===null).length;const wrong=rows.length-correct-blank;return {total:rows.length,correct,wrong,blank,answered:correct+wrong,accuracy:correct+wrong?Math.round(100*correct/(correct+wrong)):null,net:correct-wrong,unique:new Set(rows.map(a=>a.qid)).size};},
 first(rows){const seen=new Set();return rows.filter(a=>{if(seen.has(a.qid))return false;seen.add(a.qid);return true;});},
 latest(rows){const m=new Map();for(const a of rows)m.set(a.qid,a);return [...m.values()];},
 pending(rows){return this.latest(rows).filter(a=>a.choice===null||a.choice!==a.key).map(a=>a.qid);},
 shuffle(rows){const x=[...rows];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;},
 validateBackup(input,seed,topics){
  const fail=()=>{throw new Error('Arquivo incompatível. Use um backup exportado pelo minha-futura-aprovada.');};
  if(!input||input.version!==1||!Array.isArray(input.custom)||!Array.isArray(input.attempts)||!Array.isArray(input.favorites))fail();
  const text=(v,n=20000)=>typeof v==='string'&&v.length<=n;
  const validTopic=v=>topics.some(t=>t.id===v);
  const ids=new Set(seed.map(q=>q.id));
  for(const q of input.custom){if(!q||!text(q.id,100)||!q.id.startsWith('user-')||ids.has(q.id)||!validTopic(q.topic)||!text(q.text)||!q.text.trim()||typeof q.answer!=='boolean'||!text(q.explanation)||!q.source||!text(q.source.title,500)||!text(q.source.url,2000)||!text(q.origin,500))fail();ids.add(q.id);}
  const aid=new Set();for(const a of input.attempts){if(!a||!text(a.id,100)||aid.has(a.id)||!ids.has(a.qid)||!validTopic(a.topic)||typeof a.key!=='boolean'||![true,false,null].includes(a.choice)||!['low','mid','high'].includes(a.confidence)||!Number.isFinite(Date.parse(a.at))||!text(a.session,100))fail();aid.add(a.id);}
  if(input.favorites.some(x=>!ids.has(x)))fail();
  for(const k of ['notes','drafts','topicStatus'])if(!input[k]||typeof input[k]!=='object'||Array.isArray(input[k]))fail();
  for(const [k,v]of Object.entries(input.notes))if(!ids.has(k)||!text(v))fail();
  for(const [k,v]of Object.entries(input.topicStatus))if(!validTopic(k)||!['new','studying','reviewed'].includes(v))fail();
  for(const [k,v]of Object.entries(input.drafts))if(!/^p([1-9]|[1-9]\d)$/.test(k)||!v||!text(v.text)||!Array.isArray(v.checks)||v.checks.some(c=>!Number.isInteger(c)||c<0||c>10))fail();
  if(input.session){const s=input.session;if(!text(s.id,100)||!Array.isArray(s.ids)||s.ids.length===0||s.ids.some(id=>!ids.has(id))||new Set(s.ids).size!==s.ids.length||!Number.isInteger(s.index)||s.index<0||s.index>=s.ids.length||!['practice','test','simulado','review','favorites'].includes(s.mode)||!Number.isFinite(Date.parse(s.started))||typeof s.done!=='boolean')fail();}
  return input;
 },
 merge(a,b){
  const unique=(x,y)=>[...new Map([...x,...y].map(v=>[v.id,v])).values()];
  return {...a,custom:unique(b.custom,a.custom),attempts:unique(b.attempts,a.attempts).sort((x,y)=>Date.parse(x.at)-Date.parse(y.at)),favorites:[...new Set([...a.favorites,...b.favorites])],notes:{...b.notes,...a.notes},drafts:{...b.drafts,...a.drafts},topicStatus:{...b.topicStatus,...a.topicStatus}};
 }
};
if(typeof module!=='undefined')module.exports=Core;
