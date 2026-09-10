(function(){
const STORAGE_KEY='formaWorkoutsV1';
const TODAY_ID='2026-09-07-full-body';
const seedWorkout={
  id:TODAY_ID,
  date:'2026-09-07',
  name:'Full Body — trening roboczy',
  note:'Pierwszy trening zapisany z prowadzenia na żywo. Priorytet: dobra technika, progres bez niepotrzebnego dobijania serii.',
  exercises:[
    {name:'Wyciskanie sztangi na ławce płaskiej',unit:'kg',sets:[{w:80,r:8},{w:80,r:7},{w:75,r:8}],note:'80×8 było około 0–1 RIR. Następny cel: poprawić sumę powtórzeń na 80 kg; np. 8/8, potem back-off 75 kg 8–10.'},
    {name:'Wiosłowanie sztangą',unit:'kg',sets:[{w:50,r:12},{w:55,r:8},{w:50,r:8}],note:'55 kg ograniczała stabilizacja tułowia. Następny cel: 50 kg w 3 czystych seriach, np. 10/10/8–10.'},
    {name:'Dumbbell curl',unit:'kg / hantel',sets:[{w:12.5,r:15},{w:12.5,r:10},{w:12.5,r:8}],note:'Zostać przy 12,5 kg i poprawiać łączną liczbę czystych powtórzeń przed wejściem na 15 kg.'},
    {name:'Rope pushdown',unit:'kg',sets:[{w:17.5,r:14},{w:17.5,r:11},{w:17.5,r:10},{w:12.5,r:5,drop:true}],note:'Ostatnie 12,5×5 było drop-setem na dobicie. Nie musi pojawiać się na każdym treningu.'},
    {name:'Unoszenia hantli bokiem',unit:'kg / hantel',sets:[{w:10,r:10},{w:10,r:10},{w:10,r:8}],note:'Technika stabilna. Następny cel: 10/10/9–10 bez bujania tułowiem.'}
  ]
};

const extraSeedWorkouts=[
  {
    id:'2026-09-09-full-body',
    date:'2026-09-09',
    name:'Full Body',
    note:'Trening prowadzony na żywo. Na koniec 12–15 min spokojnego marszu na bieżni, nachylenie ok. 6–10%, tempo 4,5–5,5 km/h.',
    exercises:[
      {name:'Wyciskanie sztangi na ławce płaskiej',unit:'kg',sets:[{w:80,r:8},{w:80,r:8},{w:75,r:8}],note:'Dwie pełne serie 80×8. Back-off 75×8.'},
      {name:'Lat pulldown',unit:'kg',sets:[{w:35,r:8},{w:35,r:7},{w:35,r:8}],note:'Trzy serie robocze na 35 kg.'},
      {name:'Dumbbell curl',unit:'kg / hantel',sets:[{w:15,r:9},{w:15,r:8}],note:'Druga seria ciężka pod koniec. Trzecia seria nie została zapisana.'},
      {name:'Rope pushdown',unit:'kg',sets:[{w:17.5,r:18},{w:21.25,r:12},{w:21.25,r:8}],note:'12. powtórzenie przy 21,25 kg było już wymęczone; ostatnia seria zakończona na 8.'},
      {name:'Shoulder press machine — siedząc',unit:'kg',sets:[{w:20,r:13},{w:20,r:12}],note:'Powrót po przerwie. Następny trening: wejście na 25 kg, jeśli technika i zakres ruchu zostają czyste.'}
    ]
  },
  {
    id:'2026-09-10-mma',
    date:'2026-09-10',
    name:'MMA — 1 godzina',
    note:'Trening MMA: 60 minut.',
    exercises:[]
  }
];

function esc(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function read(){
  try{
    const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
    return Array.isArray(data)?data:[];
  }catch{return[];}
}
function write(data){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}
function seed(){
  const data=read();
  let changed=false;
  [seedWorkout,...extraSeedWorkouts].forEach(workout=>{
    if(!data.some(w=>w.id===workout.id)){data.push(workout);changed=true;}
  });
  if(changed)write(data);
}
function formatDate(s){
  const [y,m,d]=s.split('-').map(Number);
  if(!y||!m||!d)return s;
  return new Intl.DateTimeFormat('pl-PL',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(y,m-1,d));
}
function parseSets(text){
  return text.split(',').map(x=>x.trim()).filter(Boolean).map(token=>{
    const drop=/drop/i.test(token);
    const clean=token.replace(/drop/ig,'').trim().replace(',', '.');
    const match=clean.match(/([0-9]+(?:\.[0-9]+)?)\s*[x×]\s*([0-9]+)/i);
    if(!match)return null;
    return {w:Number(match[1]),r:Number(match[2]),...(drop?{drop:true}:{})};
  }).filter(Boolean);
}
function setText(s){return `${Number(s.w).toLocaleString('pl-PL')} × ${s.r}${s.drop?' · drop':''}`;}
function totalStats(workouts){
  const exercises=workouts.flatMap(w=>w.exercises||[]);
  const sets=exercises.flatMap(e=>e.sets||[]);
  return {sessions:workouts.length,exercises:exercises.length,sets:sets.length,reps:sets.reduce((a,s)=>a+(Number(s.r)||0),0)};
}
function bestBench(workouts){
  const all=workouts.flatMap(w=>(w.exercises||[]).filter(e=>/wyciskanie.*płask|bench/i.test(e.name)).flatMap(e=>e.sets||[]));
  if(!all.length)return '—';
  const best=[...all].sort((a,b)=>(b.w*b.r)-(a.w*a.r)||b.w-a.w)[0];
  return `${best.w} × ${best.r}`;
}
function injectStyles(){
  if(document.getElementById('workoutTrackerStyles'))return;
  const style=document.createElement('style');
  style.id='workoutTrackerStyles';
  style.textContent=`
  .workout-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-end;flex-wrap:wrap}
  .workout-stats{grid-template-columns:repeat(4,1fr);margin:14px 0}
  .workout-stats strong{display:block;font-size:1.35rem}
  .workout-layout{grid-template-columns:1.3fr .7fr;align-items:start}
  .workout-session{margin-top:14px}
  .workout-session-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap}
  .workout-exercise{padding:14px 0;border-top:1px solid var(--line)}
  .workout-exercise:first-child{border-top:0}
  .set-chips{display:flex;gap:7px;flex-wrap:wrap;margin:8px 0}
  .set-chip{border:1px solid var(--line);background:#0d131b;border-radius:999px;padding:6px 10px;font-weight:800}
  .set-chip.drop{border-color:#8a6930;color:var(--warn)}
  .workout-form{display:grid;gap:10px}
  .workout-form label{display:grid;gap:5px;font-size:.82rem;color:var(--muted)}
  .workout-form input,.workout-form textarea{width:100%}
  .workout-form .two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .workout-empty{padding:22px;text-align:center;color:var(--muted)}
  .session-note{margin:.3rem 0 0}
  @media(max-width:950px){.workout-layout{grid-template-columns:1fr}.workout-stats{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:580px){.workout-stats,.workout-form .two{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
}
function injectUI(){
  if(document.getElementById('workouts'))return;
  injectStyles();
  const nav=document.querySelector('.nav');
  const trainingBtn=nav?.querySelector('[data-tab="training"]');
  if(nav){
    const btn=document.createElement('button');
    btn.className='navbtn';
    btn.dataset.tab='workouts';
    btn.textContent='Dziennik treningów';
    btn.onclick=()=>{if(typeof setTab==='function')setTab('workouts');else{document.querySelectorAll('.section').forEach(x=>x.classList.toggle('active',x.id==='workouts'));document.querySelectorAll('.navbtn').forEach(x=>x.classList.toggle('active',x===btn));window.scrollTo({top:0,behavior:'smooth'});}};
    trainingBtn?.insertAdjacentElement('afterend',btn) || nav.appendChild(btn);
  }
  const section=document.createElement('section');
  section.id='workouts';section.className='section';
  section.innerHTML=`
    <div class="workout-head"><div><h2>Śledzenie treningów</h2><p class="lead">Zapisuj ciężary i powtórzenia. Progres oceniamy po jakości serii i trendzie, nie po jednym rekordzie.</p></div><button class="btn" id="workoutExportBtn">Eksport JSON</button></div>
    <div id="workoutStats" class="grid workout-stats"></div>
    <div class="grid workout-layout">
      <div><div id="workoutList"></div></div>
      <aside class="card"><h3>Dodaj wynik</h3><p class="micro">Jeśli data i nazwa treningu są takie same, ćwiczenie zostanie dopisane do istniejącej sesji.</p>
        <form id="workoutForm" class="workout-form">
          <div class="two"><label>Data<input id="woDate" type="date" required></label><label>Nazwa treningu<input id="woName" value="Full Body" required></label></div>
          <label>Ćwiczenie<input id="woExercise" placeholder="np. Wyciskanie sztangi" required></label>
          <label>Serie<input id="woSets" placeholder="np. 80x8, 80x7, 75x8" required></label>
          <label>Jednostka<input id="woUnit" value="kg" placeholder="kg / kg na hantel"></label>
          <label>Notatka<textarea id="woNote" rows="3" placeholder="RIR, technika, samopoczucie..."></textarea></label>
          <button class="btn" type="submit">Zapisz wynik</button>
        </form>
        <p class="micro" style="margin-top:12px">Możesz oznaczyć drop-set wpisując np. <b>12.5x5 drop</b>.</p>
      </aside>
    </div>`;
  const checkin=document.getElementById('checkin');
  checkin?.parentNode.insertBefore(section,checkin);
  const dateInput=section.querySelector('#woDate');
  if(dateInput)dateInput.value=new Date().toISOString().slice(0,10);
  section.querySelector('#workoutForm').addEventListener('submit',onSubmit);
  section.querySelector('#workoutExportBtn').addEventListener('click',exportData);
}
function exerciseHTML(e){
  const sets=(e.sets||[]).map(s=>`<span class="set-chip ${s.drop?'drop':''}">${esc(setText(s))}</span>`).join('');
  return `<div class="workout-exercise"><div><b>${esc(e.name)}</b> <span class="micro">(${esc(e.unit||'kg')})</span></div><div class="set-chips">${sets}</div>${e.note?`<p class="micro session-note">${esc(e.note)}</p>`:''}</div>`;
}
function workoutHTML(w){
  return `<article class="card workout-session"><div class="workout-session-head"><div><span class="eyebrow">${esc(formatDate(w.date))}</span><h3 style="margin:.3rem 0">${esc(w.name)}</h3>${w.note?`<p class="micro session-note">${esc(w.note)}</p>`:''}</div><button class="btn danger" data-delete-workout="${esc(w.id)}">Usuń</button></div><div>${(w.exercises||[]).map(exerciseHTML).join('')}</div></article>`;
}
function render(){
  const workouts=read().sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  const stats=totalStats(workouts);
  const statsEl=document.getElementById('workoutStats');
  if(statsEl)statsEl.innerHTML=`<div class="card"><span class="micro">Sesje</span><strong>${stats.sessions}</strong></div><div class="card"><span class="micro">Serie robocze</span><strong>${stats.sets}</strong></div><div class="card"><span class="micro">Łączne powtórzenia</span><strong>${stats.reps}</strong></div><div class="card"><span class="micro">Najlepszy bench</span><strong>${esc(bestBench(workouts))}</strong></div>`;
  const list=document.getElementById('workoutList');
  if(list)list.innerHTML=workouts.length?workouts.map(workoutHTML).join(''):'<div class="card workout-empty">Brak zapisanych treningów.</div>';
  document.querySelectorAll('[data-delete-workout]').forEach(btn=>btn.onclick=()=>{
    if(!confirm('Usunąć cały ten trening?'))return;
    write(read().filter(w=>w.id!==btn.dataset.deleteWorkout));render();
  });
}
function onSubmit(ev){
  ev.preventDefault();
  const date=document.getElementById('woDate').value;
  const name=document.getElementById('woName').value.trim();
  const exercise=document.getElementById('woExercise').value.trim();
  const sets=parseSets(document.getElementById('woSets').value);
  const unit=document.getElementById('woUnit').value.trim()||'kg';
  const note=document.getElementById('woNote').value.trim();
  if(!date||!name||!exercise||!sets.length){alert('Uzupełnij datę, trening, ćwiczenie i serie w formacie np. 80x8, 80x7.');return;}
  const data=read();
  let workout=data.find(w=>w.date===date&&w.name.toLowerCase()===name.toLowerCase());
  if(!workout){workout={id:`${date}-${name.toLowerCase().replace(/[^a-z0-9ąćęłńóśźż]+/gi,'-')}-${Date.now()}`,date,name,note:'',exercises:[]};data.push(workout);}
  workout.exercises.push({name:exercise,unit,sets,note});
  write(data);
  document.getElementById('woExercise').value='';document.getElementById('woSets').value='';document.getElementById('woNote').value='';
  render();
}
function exportData(){
  const blob=new Blob([JSON.stringify(read(),null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='forma-treningi.json';a.click();URL.revokeObjectURL(url);
}

seed();injectUI();render();
window.formaWorkoutTracker={render,read};
})();