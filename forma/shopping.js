(function(){
const STORAGE='formaWeekPlanV1';
const CHECKED_STORAGE='formaShoppingCheckedV1';
const ENDPOINT='/.netlify/functions/forma-sync';
const SYNC_KEY='formaSyncKey';
const cats=[['breakfast','Śniadanie'],['lunch','Obiad'],['snack','Przekąska'],['dinner','Kolacja']];
const recipeById=Object.fromEntries(recipes.map(r=>[r.id,r]));
let syncTimer=null;

function defaultState(){
  return {updatedAt:new Date(0).toISOString(),plan:weekly.map(d=>({day:d[0],breakfast:d[1],lunch:d[2],snack:d[3],dinner:d[4]}))};
}
function loadState(){
  try{
    const x=JSON.parse(localStorage.getItem(STORAGE)||'null');
    if(x&&Array.isArray(x.plan)&&x.plan.length===7)return x;
  }catch{}
  return defaultState();
}
let state=loadState();
function saveLocal(){localStorage.setItem(STORAGE,JSON.stringify(state));}
function touch(){state.updatedAt=new Date().toISOString();saveLocal();scheduleCloud();}

function injectStyles(){
  if(document.getElementById('shoppingStyles'))return;
  const s=document.createElement('style');s.id='shoppingStyles';s.textContent=`
  .week-planner{grid-template-columns:repeat(2,minmax(0,1fr))}.week-day h3{margin-top:0}.week-meal{display:grid;grid-template-columns:105px 1fr;gap:8px;align-items:center;margin:8px 0}.week-meal span{font-size:.8rem;color:var(--muted)}.week-meal select{width:100%;min-width:0}.week-summary{margin-top:10px;color:var(--accent);font-weight:800}.shopping-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.shopping-category{background:#0d131b;border:1px solid var(--line);border-radius:14px;padding:14px}.shopping-category h4{margin:0 0 9px}.shopping-item{display:flex;align-items:flex-start;gap:9px;padding:7px 0;border-top:1px solid var(--line)}.shopping-item:first-of-type{border-top:0}.shopping-item input{margin-top:4px}.shopping-item.done span{text-decoration:line-through;color:var(--muted)}.shopping-toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:14px 0}.shopping-status{margin-left:auto}.weekly-numbers{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 0}.weekly-numbers div{background:#0d131b;border:1px solid var(--line);border-radius:12px;padding:10px}.weekly-numbers strong{display:block;font-size:1.1rem}
  @media(max-width:800px){.week-planner,.shopping-grid{grid-template-columns:1fr}.weekly-numbers{grid-template-columns:1fr 1fr}.shopping-status{margin-left:0;width:100%}.week-meal{grid-template-columns:90px 1fr}}
  `;document.head.appendChild(s);
}

function optionHTML(cat,selected){return recipes.filter(r=>r.cat===cat).map(r=>`<option value="${r.id}" ${r.id===selected?'selected':''}>${r.name} — ${r.kcal} kcal</option>`).join('');}
function dayMacros(day){return cats.map(([cat])=>recipeById[day[cat]]).filter(Boolean).reduce((a,r)=>({k:a.k+r.kcal,p:a.p+r.p,f:a.f+r.f,c:a.c+r.c}),{k:0,p:0,f:0,c:0});}
function allMacros(){return state.plan.reduce((a,d)=>{const s=dayMacros(d);return{k:a.k+s.k,p:a.p+s.p,f:a.f+s.f,c:a.c+s.c}},{k:0,p:0,f:0,c:0});}

function renderWeek(){
  const grid=document.getElementById('weekGrid');if(!grid)return;
  grid.className='grid week-planner';
  grid.innerHTML=state.plan.map((d,i)=>{const m=dayMacros(d);return `<div class="card week-day"><h3>${d.day}</h3>${cats.map(([cat,label])=>`<label class="week-meal"><span>${label}</span><select data-day="${i}" data-cat="${cat}">${optionHTML(cat,d[cat])}</select></label>`).join('')}<div class="week-summary" id="weekMacro${i}">${m.k} kcal · B ${m.p} · T ${m.f} · W ${m.c}</div></div>`}).join('');
  grid.querySelectorAll('select').forEach(sel=>sel.addEventListener('change',e=>{const i=Number(e.target.dataset.day),cat=e.target.dataset.cat;state.plan[i][cat]=e.target.value;touch();const m=dayMacros(state.plan[i]);document.getElementById('weekMacro'+i).textContent=`${m.k} kcal · B ${m.p} · T ${m.f} · W ${m.c}`;renderShopping();}));
  renderShopping();
}

const aliases={
  'skyr':'Skyr naturalny','skyr naturalny':'Skyr naturalny','jajko':'Jajka','jajka':'Jajka','tortilla':'Tortille','tortille':'Tortille',
  'płatki owsiane':'Płatki owsiane','owoce jagodowe':'Owoce jagodowe','masło orzechowe':'Masło orzechowe','białka jaj':'Białka jaj','pieczywo':'Pieczywo','szynka z indyka':'Szynka z indyka','płatki kukurydziane':'Płatki kukurydziane','banan':'Banany','serek wiejski':'Serek wiejski','awokado':'Awokado','ryż suchy':'Ryż','pierś z kurczaka':'Pierś z kurczaka','oliwa':'Oliwa','warzywa':'Warzywa','wołowina mielona 5%':'Wołowina mielona 5%','ziemniaki':'Ziemniaki','makaron suchy':'Makaron','łosoś':'Łosoś','jogurt naturalny':'Jogurt naturalny','wafle ryżowe':'Wafle ryżowe','odżywka białkowa':'Odżywka białkowa','mleko 1,5%':'Mleko 1,5%','miód':'Miód','mozzarella light':'Mozzarella light','tuńczyk w sosie własnym':'Tuńczyk w sosie własnym'
};
function parseIngredient(text){
  const m=text.trim().match(/^(.*?)\s+(\d+(?:[.,]\d+)?)\s*(g|ml|szt\.?|szt)$/i);
  if(!m)return{name:text.trim(),amount:null,unit:''};
  const raw=m[1].trim(),key=raw.toLowerCase(),name=aliases[key]||raw,amount=parseFloat(m[2].replace(',','.')),unit=m[3].toLowerCase().startsWith('szt')?'szt.':m[3].toLowerCase();
  return{name,amount,unit};
}
function groupName(name){const n=name.toLowerCase();if(/kurczak|wołow|łosoś|tuńczyk|makrela|szynka/.test(n))return'Mięso i ryby';if(/skyr|jaj|serek|jogurt|mleko|mozzarella/.test(n))return'Nabiał i jajka';if(/ryż|makaron|pieczywo|płatki|tortill|wafle|ziemniak/.test(n))return'Węglowodany i pieczywo';if(/warzyw|banan|owoce|awokado|pomidory|cebula|czosnek|ogórek/.test(n))return'Owoce i warzywa';return'Dodatki';}
function aggregate(){
  const map=new Map();
  state.plan.forEach(d=>cats.forEach(([cat])=>{const r=recipeById[d[cat]];if(!r)return;(r.ingredients||[]).forEach(txt=>{const x=parseIngredient(txt),key=x.name.toLowerCase()+'|'+x.unit;if(!map.has(key))map.set(key,{...x});else if(Number.isFinite(x.amount))map.get(key).amount=(map.get(key).amount||0)+x.amount;});}));
  return [...map.values()].sort((a,b)=>groupName(a.name).localeCompare(groupName(b.name),'pl')||a.name.localeCompare(b.name,'pl'));
}
function fmt(x){if(!Number.isFinite(x.amount))return x.name;let a=x.amount;if(x.unit==='g'&&a>=1000)return`${x.name} — ${(a/1000).toFixed(a%1000===0?0:2).replace('.',',')} kg`;if(x.unit==='ml'&&a>=1000)return`${x.name} — ${(a/1000).toFixed(a%1000===0?0:2).replace('.',',')} l`;return`${x.name} — ${Number.isInteger(a)?a:a.toFixed(1).replace('.',',')} ${x.unit}`;}
function checkedMap(){try{return JSON.parse(localStorage.getItem(CHECKED_STORAGE)||'{}')}catch{return{}}}
function saveChecked(x){localStorage.setItem(CHECKED_STORAGE,JSON.stringify(x));}
function renderShopping(){
  const root=document.getElementById('shoppingList');if(!root)return;
  const items=aggregate(),groups={};items.forEach(x=>(groups[groupName(x.name)]??=[]).push(x));const checked=checkedMap();
  root.innerHTML=Object.entries(groups).map(([g,list])=>`<div class="shopping-category"><h4>${g}</h4>${list.map(x=>{const id=(x.name+'|'+x.unit).toLowerCase(),done=!!checked[id];return`<label class="shopping-item ${done?'done':''}"><input type="checkbox" data-shop="${encodeURIComponent(id)}" ${done?'checked':''}><span>${fmt(x)}</span></label>`}).join('')}</div>`).join('');
  root.querySelectorAll('[data-shop]').forEach(cb=>cb.addEventListener('change',e=>{const id=decodeURIComponent(e.target.dataset.shop),m=checkedMap();m[id]=e.target.checked;saveChecked(m);e.target.closest('.shopping-item').classList.toggle('done',e.target.checked);}));
  const m=allMacros(),avg={k:Math.round(m.k/7),p:Math.round(m.p/7),f:Math.round(m.f/7),c:Math.round(m.c/7)};const n=document.getElementById('weeklyNutrition');if(n)n.innerHTML=`<div><span class="micro">Śr. kcal/dzień</span><strong>${avg.k}</strong></div><div><span class="micro">Białko</span><strong>${avg.p} g</strong></div><div><span class="micro">Tłuszcz</span><strong>${avg.f} g</strong></div><div><span class="micro">Węgle</span><strong>${avg.c} g</strong></div>`;
}
function shoppingText(){const groups={};aggregate().forEach(x=>(groups[groupName(x.name)]??=[]).push(x));return ['LISTA ZAKUPÓW — FORMA',...Object.entries(groups).flatMap(([g,list])=>['',g.toUpperCase(),...list.map(x=>'☐ '+fmt(x))])].join('\n');}

function buildControls(){
  const week=document.getElementById('week');if(!week||document.getElementById('shoppingCard'))return;
  const card=document.createElement('div');card.id='shoppingCard';card.className='card';card.style.marginTop='14px';card.innerHTML=`<h3>🛒 Lista zakupów na tydzień</h3><p class="micro">Lista aktualizuje się z wybranych wyżej 28 posiłków i sumuje powtarzające się produkty.</p><div id="weeklyNutrition" class="weekly-numbers"></div><div class="shopping-toolbar"><button class="btn" id="generateShopping">Generuj / odśwież</button><button class="btn" id="copyShopping">Kopiuj listę</button><button class="btn" id="clearShoppingChecks">Odznacz wszystko</button><button class="btn" id="resetWeek">Przywróć domyślny tydzień</button><button class="btn" id="syncWeekNow">☁ Synchronizuj jadłospis</button><span id="weekCloudStatus" class="micro shopping-status"></span></div><div id="shoppingList" class="shopping-grid"></div>`;week.appendChild(card);
  document.getElementById('generateShopping').onclick=renderShopping;
  document.getElementById('copyShopping').onclick=async()=>{try{await navigator.clipboard.writeText(shoppingText());flash('Lista skopiowana.','good')}catch{flash('Nie udało się skopiować listy.','bad')}};
  document.getElementById('clearShoppingChecks').onclick=()=>{localStorage.removeItem(CHECKED_STORAGE);renderShopping();};
  document.getElementById('resetWeek').onclick=()=>{if(!confirm('Przywrócić domyślny jadłospis na cały tydzień?'))return;state=defaultState();state.updatedAt=new Date().toISOString();saveLocal();renderWeek();scheduleCloud(true);};
  document.getElementById('syncWeekNow').onclick=()=>syncWeek(true);
}
function flash(t,cls='muted'){const e=document.getElementById('weekCloudStatus');if(e){e.textContent=t;e.className='micro shopping-status '+cls}}

async function cloud(action,payload={}){const key=localStorage.getItem(SYNC_KEY)||'';if(!key)throw new Error('Najpierw skonfiguruj klucz synchronizacji w Historii.');const res=await fetch(ENDPOINT,{method:'POST',headers:{'content-type':'application/json','x-forma-sync-key':key},body:JSON.stringify({action,...payload})});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data.error||'Błąd synchronizacji');return data;}
async function syncWeek(manual=false){
  const key=localStorage.getItem(SYNC_KEY);if(!key){if(manual)flash('Brak klucza synchronizacji — ustaw go w Historii.','warn');return;}
  try{
    flash('Synchronizacja…','warn');
    const pulled=await cloud('pull-week');const remote=pulled.weekPlan;const lt=Date.parse(state.updatedAt||0)||0,rt=Date.parse(remote?.updatedAt||0)||0;
    if(remote&&rt>lt){state=remote;saveLocal();renderWeek();flash('Pobrano nowszy jadłospis z chmury.','good');return;}
    const saved=await cloud('sync-week',{weekPlan:state});if(saved.weekPlan){state=saved.weekPlan;saveLocal();}
    flash('Jadłospis zsynchronizowany.','good');
  }catch(e){flash(e.message||'Błąd synchronizacji.','bad')}
}
function scheduleCloud(force=false){clearTimeout(syncTimer);syncTimer=setTimeout(()=>syncWeek(false),force?100:900);}

injectStyles();buildControls();renderWeek();
setTimeout(()=>syncWeek(false),1200);
})();