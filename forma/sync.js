(function(){
const ENDPOINT='/.netlify/functions/forma-sync';
const KEY_STORAGE='formaSyncKey';
const AUTO_STORAGE='formaAutoSync';
let syncing=false;

function mergeReports(a=[],b=[]){
  const map=new Map();
  const time=r=>{const t=Date.parse(r?.date||r?.updatedAt||'');return Number.isFinite(t)?t:0};
  [...a,...b].forEach(r=>{if(!r?.id)return;const old=map.get(r.id);if(!old||time(r)>=time(old))map.set(r.id,r)});
  return [...map.values()].sort((x,y)=>(x.year-y.year)||(x.cw-y.cw));
}

function createUI(){
  const history=document.getElementById('history');
  if(!history||document.getElementById('cloudSyncCard'))return;
  const card=document.createElement('div');
  card.className='card';
  card.id='cloudSyncCard';
  card.style.marginBottom='14px';
  card.innerHTML=`
    <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap">
      <div><h3 style="margin-top:0">☁ Synchronizacja między urządzeniami</h3>
      <p class="micro" style="max-width:760px">Raporty są przechowywane w prywatnym magazynie Netlify Blobs. Na komputerze i telefonie wpisujesz ten sam klucz synchronizacji. Sam klucz jest zapisywany tylko lokalnie na danym urządzeniu.</p></div>
      <span id="cloudStatus" class="tag">Niepołączono</span>
    </div>
    <div style="display:grid;grid-template-columns:minmax(220px,1fr) auto auto;gap:10px;align-items:end">
      <div><span class="micro">Klucz synchronizacji</span><input id="cloudKey" type="password" autocomplete="current-password" placeholder="Ten sam klucz na każdym urządzeniu" style="width:100%"></div>
      <button class="btn" id="saveCloudKey">Zapisz klucz</button>
      <button class="btn" id="syncCloudNow">Synchronizuj teraz</button>
    </div>
    <div class="actions">
      <button class="btn" id="pullCloud">Pobierz z chmury</button>
      <label class="btn" style="display:flex;gap:8px;align-items:center"><input id="autoCloudSync" type="checkbox"> Auto-sync</label>
      <button class="btn danger" id="forgetCloudKey">Usuń klucz z urządzenia</button>
    </div>
    <p id="cloudMessage" class="micro" style="margin-bottom:0">Po zapisaniu poprawnego klucza nowe raporty będą automatycznie łączone z historią w chmurze.</p>`;
  const lead=history.querySelector('.lead');
  if(lead)lead.insertAdjacentElement('afterend',card);else history.prepend(card);

  const saved=localStorage.getItem(KEY_STORAGE)||'';
  document.getElementById('cloudKey').value=saved;
  document.getElementById('autoCloudSync').checked=localStorage.getItem(AUTO_STORAGE)!=='0';

  document.getElementById('saveCloudKey').onclick=()=>{
    const key=document.getElementById('cloudKey').value.trim();
    if(key.length<12){setStatus('Klucz za krótki','warn','Użyj co najmniej 12 znaków, najlepiej długiego losowego hasła.');return;}
    localStorage.setItem(KEY_STORAGE,key);setStatus('Klucz zapisany','good','Klucz zapisano na tym urządzeniu. Możesz teraz uruchomić synchronizację.');
  };
  document.getElementById('syncCloudNow').onclick=()=>syncCloud('sync',true);
  document.getElementById('pullCloud').onclick=()=>syncCloud('pull',true);
  document.getElementById('autoCloudSync').onchange=e=>localStorage.setItem(AUTO_STORAGE,e.target.checked?'1':'0');
  document.getElementById('forgetCloudKey').onclick=()=>{
    localStorage.removeItem(KEY_STORAGE);document.getElementById('cloudKey').value='';setStatus('Klucz usunięty','muted','To urządzenie nie będzie synchronizować raportów, dopóki ponownie nie wpiszesz klucza.');
  };
}

function setStatus(text,cls='muted',detail=''){
  const s=document.getElementById('cloudStatus'),m=document.getElementById('cloudMessage');
  if(s){s.textContent=text;s.className='tag '+cls}
  if(m&&detail)m.textContent=detail;
}

function getKey(){
  const input=document.getElementById('cloudKey');
  return (input?.value||localStorage.getItem(KEY_STORAGE)||'').trim();
}

async function callCloud(payload){
  const key=getKey();
  if(!key)throw new Error('Najpierw wpisz i zapisz klucz synchronizacji.');
  localStorage.setItem(KEY_STORAGE,key);
  const res=await fetch(ENDPOINT,{method:'POST',headers:{'content-type':'application/json','x-forma-sync-key':key},body:JSON.stringify(payload)});
  let data={};try{data=await res.json()}catch{}
  if(!res.ok){
    if(data.code==='NOT_CONFIGURED')throw new Error('Synchronizacja w chmurze nie jest jeszcze aktywowana w ustawieniach Netlify.');
    if(res.status===401)throw new Error('Nieprawidłowy klucz synchronizacji.');
    throw new Error(data.error||`Błąd synchronizacji (${res.status}).`);
  }
  return data;
}

async function syncCloud(action='sync',manual=false){
  if(syncing)return;
  if(!manual&&localStorage.getItem(AUTO_STORAGE)==='0')return;
  if(!getKey()&&!manual)return;
  syncing=true;setStatus('Synchronizacja…','warn','Łączę dane lokalne z chmurą.');
  try{
    const local=getReports();
    const data=await callCloud({action,reports:action==='sync'?local:[]});
    const merged=mergeReports(local,Array.isArray(data.reports)?data.reports:[]);
    saveReports(merged);
    if(typeof window.renderHistory==='function'&&document.getElementById('history')?.classList.contains('active'))window.renderHistory();
    setStatus('Zsynchronizowano','good',`Chmura i to urządzenie mają teraz ${merged.length} raportów. Ostatnia synchronizacja: ${new Date().toLocaleString('pl-PL')}.`);
  }catch(err){
    setStatus('Błąd','bad',err.message||'Nie udało się zsynchronizować danych.');
  }finally{syncing=false}
}

async function deleteCloudReport(id){
  if(!getKey())return;
  try{
    const data=await callCloud({action:'delete',id});
    saveReports(Array.isArray(data.reports)?data.reports:getReports().filter(r=>r.id!==id));
    if(typeof window.renderHistory==='function')window.renderHistory();
    setStatus('Zsynchronizowano','good',`Raport ${id} usunięto także z chmury.`);
  }catch(err){setStatus('Błąd','bad',`Raport usunięto lokalnie, ale nie udało się usunąć go z chmury: ${err.message}`);}
}

function hookDelete(){
  const original=window.deleteReport;
  if(typeof original!=='function')return;
  window.deleteReport=function(id){
    if(!confirm('Usunąć ten raport lokalnie i z chmury?'))return;
    saveReports(getReports().filter(x=>x.id!==id));
    if(typeof window.renderHistory==='function')window.renderHistory();
    const detail=document.getElementById('historyDetail');if(detail)detail.textContent='Raport usunięty.';
    deleteCloudReport(id);
  };
}

function hookAutoSync(){
  document.getElementById('evaluateBtn')?.addEventListener('click',()=>setTimeout(()=>syncCloud('sync',false),450));
  document.getElementById('importInput')?.addEventListener('change',()=>setTimeout(()=>syncCloud('sync',false),1300));
  window.addEventListener('online',()=>syncCloud('sync',false));
}

createUI();hookAutoSync();hookDelete();
window.formaCloudSync=()=>syncCloud('sync',true);
setTimeout(()=>syncCloud('sync',false),900);
})();
