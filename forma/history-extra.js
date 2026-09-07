(function(){
function monthKey(r){const d=r.date?new Date(r.date):null;if(d&&!isNaN(d))return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;return `${r.year}-00`;}
function monthLabel(key){if(key.endsWith('-00'))return key.slice(0,4);const [y,m]=key.split('-');return new Intl.DateTimeFormat('pl-PL',{month:'long',year:'numeric'}).format(new Date(Number(y),Number(m)-1,1));}
function buildTrend(reports){const box=document.getElementById('autoTrend');if(!box)return;if(reports.length<2){box.className='verdict muted';box.innerHTML='<h3>Automatyczny trend</h3><p>Potrzebuję co najmniej 2 zapisanych tygodni, żeby ocenić kierunek.</p>';return;}const recent=reports.slice(-4),first=recent[0],last=recent.at(-1);const dw=Number.isFinite(first.avgWeight)&&Number.isFinite(last.avgWeight)?last.avgWeight-first.avgWeight:null;const dp=Number.isFinite(first.waist)&&Number.isFinite(last.waist)?last.waist-first.waist:null;const weeks=Math.max(1,recent.length-1);const rate=Number.isFinite(dw)?dw/weeks:null;let cls='warn',title='Trend mieszany',text='Patrz na kolejne tygodnie i jakość realizacji planu.';
if(Number.isFinite(dw)&&Number.isFinite(dp)&&dw<0&&dp<0){cls='good';title='Trend redukcji jest dobry';text=`W ostatnich ${recent.length} raportach masa zmieniła się o ${dw.toFixed(2)} kg, a pas o ${dp.toFixed(1)} cm.`;if(rate<-0.7)text+=' Tempo masy jest dość szybkie — kontroluj siłę, sen i regenerację.';else if(rate>-0.15)text+=' Spadek jest wolny, ale jeśli pas schodzi i siła wraca, nie ma powodu ciąć kalorii.';else text+=' Tempo jest rozsądne — nie zmieniaj planu bez powodu.';}
else if(Number.isFinite(dw)&&Number.isFinite(dp)&&dw>=0&&dp>=0){cls='bad';title='Trend nie idzie w stronę redukcji';text=`W ostatnich ${recent.length} raportach masa zmieniła się o ${dw.toFixed(2)} kg, a pas o ${dp.toFixed(1)} cm. Jeśli realizacja była dobra przez 2 pełne tygodnie, trzeba będzie skorygować kalorie lub aktywność.`;}
else if(Number.isFinite(dw)&&dw<0){cls='good';title='Masa spada, pas wymaga dalszej obserwacji';text=`Zmiana masy: ${dw.toFixed(2)} kg. Nie reaguj na jeden nietypowy pomiar pasa — oceń kolejny tydzień.`;}
box.className='verdict '+cls;box.innerHTML=`<h3>${title}</h3><p>${text}</p>`;}
const originalRender=window.renderHistory||renderHistory;
window.renderHistory=function(){originalRender();const all=getReports();const filter=document.getElementById('monthFilter');if(!filter)return;const current=filter.value||'all';const keys=[...new Set(all.map(monthKey))].sort().reverse();filter.innerHTML='<option value="all">Wszystkie miesiące</option>'+keys.map(k=>`<option value="${k}">${monthLabel(k)}</option>`).join('');filter.value=keys.includes(current)?current:'all';const selected=filter.value==='all'?all:all.filter(r=>monthKey(r)===filter.value);document.getElementById('historyList').innerHTML=selected.length?[...selected].reverse().map(r=>`<div class="history-item"><b>${r.year} · CW ${String(r.cw).padStart(2,'0')}</b><span>${r.avgWeight?.toFixed(2)||'—'} kg</span><span>${r.waist||'—'} cm</span><span>${r.steps||'—'} kroków</span><span class="score">${r.score}/6</span><button class="btn" onclick="showReport('${r.id}')">Pokaż</button></div>`).join(''):'<p class="muted">Brak raportów w wybranym miesiącu.</p>';drawCombined(selected);drawLine('weightChart',selected,'avgWeight','kg','#63d58a');drawLine('waistChart',selected,'waist','cm','#66a9ff');buildTrend(all);};
document.getElementById('monthFilter')?.addEventListener('change',()=>window.renderHistory());
})();

// The large intro/metrics block belongs only to the Start tab.
(function(){
  const hero=document.querySelector('.hero');
  const nav=document.querySelector('.nav');
  if(!hero||!nav)return;
  function syncHero(tab){hero.hidden=tab!=='start';}
  nav.addEventListener('click',event=>{
    const button=event.target.closest('.navbtn');
    if(button)syncHero(button.dataset.tab);
  });
  syncHero(document.querySelector('.navbtn.active')?.dataset.tab||'start');
})();

// Premium gym artwork replaces the text hero title on Start.
(function(){
  const title=document.querySelector('.hero h1');
  if(!title)return;
  title.setAttribute('aria-label','Motyw siłowni — sztanga i progres');
  title.style.width='min(760px,100%)';
  title.style.margin='.45rem 0 1rem';
  title.innerHTML=`
  <svg class="hero-gym-graphic" viewBox="0 0 760 138" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gymGlow" x1="70" y1="30" x2="690" y2="108" gradientUnits="userSpaceOnUse">
        <stop stop-color="#63d58a"/>
        <stop offset="1" stop-color="#66a9ff"/>
      </linearGradient>
      <linearGradient id="gymPanel" x1="0" y1="0" x2="760" y2="138" gradientUnits="userSpaceOnUse">
        <stop stop-color="#101720"/>
        <stop offset="1" stop-color="#131c28"/>
      </linearGradient>
      <filter id="softGlow" x="-30%" y="-60%" width="160%" height="220%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect x="1" y="1" width="758" height="136" rx="26" fill="url(#gymPanel)" stroke="#263242"/>
    <path d="M52 103 C130 102 159 90 214 88 C278 85 294 67 346 66 C410 64 439 80 492 70 C550 60 580 38 708 34" fill="none" stroke="url(#gymGlow)" stroke-width="3" stroke-linecap="round" opacity=".38"/>
    <path d="M58 111 H704" stroke="#263242" stroke-width="2" stroke-linecap="round"/>
    <g filter="url(#softGlow)">
      <rect x="171" y="63" width="418" height="12" rx="6" fill="url(#gymGlow)"/>
      <rect x="139" y="47" width="30" height="44" rx="7" fill="#dce6ef"/>
      <rect x="119" y="39" width="18" height="60" rx="7" fill="#8fa2b6"/>
      <rect x="99" y="31" width="17" height="76" rx="7" fill="#56687a"/>
      <rect x="591" y="47" width="30" height="44" rx="7" fill="#dce6ef"/>
      <rect x="623" y="39" width="18" height="60" rx="7" fill="#8fa2b6"/>
      <rect x="644" y="31" width="17" height="76" rx="7" fill="#56687a"/>
    </g>
    <circle cx="380" cy="69" r="28" fill="#0b0f14" stroke="#2d3949" stroke-width="2"/>
    <path d="M367 78 L380 48 L393 78 M371 68 H389" fill="none" stroke="url(#gymGlow)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="68" cy="101" r="4" fill="#63d58a"/>
    <circle cx="707" cy="34" r="4" fill="#66a9ff"/>
    <path d="M676 35 L693 35 L693 52" fill="none" stroke="#66a9ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>
  </svg>`;
  if(!document.getElementById('heroGymGraphicStyle')){
    const style=document.createElement('style');
    style.id='heroGymGraphicStyle';
    style.textContent=`.hero-gym-graphic{display:block;width:100%;height:auto;max-height:138px}.hero h1:has(.hero-gym-graphic){line-height:0}@media(max-width:580px){.hero-gym-graphic{max-height:116px}}`;
    document.head.appendChild(style);
  }
})();

// Cloud sync is kept in a separate module so the local dashboard remains usable offline.
if(!window.formaCloudSync&&!document.getElementById('cloudSyncCard')){
  const cloudSyncScript=document.createElement('script');
  cloudSyncScript.src='sync.js';
  cloudSyncScript.defer=true;
  document.body.appendChild(cloudSyncScript);
}

// Editable weekly menu + aggregated shopping list.
if(!document.getElementById('shoppingCard')){
  const shoppingScript=document.createElement('script');
  shoppingScript.src='shopping.js';
  shoppingScript.defer=true;
  document.body.appendChild(shoppingScript);
}

// Workout history + live training log.
if(!window.formaWorkoutTracker&&!document.getElementById('workouts')){
  const workoutTrackerScript=document.createElement('script');
  workoutTrackerScript.src='workout-tracker.js';
  workoutTrackerScript.defer=true;
  document.body.appendChild(workoutTrackerScript);
}
