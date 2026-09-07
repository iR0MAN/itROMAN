(function(){
  if(document.getElementById('dashboardRedesignStyles'))return;

  const style=document.createElement('style');
  style.id='dashboardRedesignStyles';
  style.textContent=`
  /* ===== Shared section language ===== */
  .section:not(#start):not(#checkin){padding-top:46px}
  .ui-page-header{display:flex;justify-content:space-between;gap:28px;align-items:flex-end;margin-bottom:28px}
  .ui-page-copy{max-width:760px}
  .ui-page-copy h2,.workout-head h2{font-size:clamp(2.35rem,5vw,4.6rem)!important;line-height:.96!important;letter-spacing:-.055em!important;margin:10px 0 14px!important}
  .ui-page-copy .lead,.workout-head .lead{max-width:720px;margin:0!important;color:#8e9aa8!important;font-size:1rem;line-height:1.7}
  .ui-page-badge{flex:0 0 auto;min-width:150px;padding:14px 17px;border:1px solid rgba(255,255,255,.09);border-radius:17px;background:rgba(255,255,255,.025)}
  .ui-page-badge span{display:block;color:#727e8a;font-size:.68rem;font-weight:850;letter-spacing:.11em;text-transform:uppercase;margin-bottom:4px}
  .ui-page-badge strong{display:block;font-size:.95rem;line-height:1.35}
  .ui-section-label{display:flex;align-items:center;gap:10px;margin:28px 0 14px;color:#788490;font-size:.72rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
  .ui-section-label:after{content:"";height:1px;flex:1;background:rgba(255,255,255,.07)}

  /* ===== Planner ===== */
  #planner .planner{grid-template-columns:minmax(0,1.25fr) minmax(280px,.75fr);gap:16px;align-items:stretch}
  #planner .planner>.card{padding:26px;border-radius:25px}
  #planner .planner>.card:first-child{position:relative;overflow:hidden;background:linear-gradient(145deg,rgba(116,240,167,.045),rgba(255,255,255,.018) 48%,rgba(138,168,255,.025))}
  #planner .planner>.card:first-child:after{content:"";position:absolute;width:280px;height:280px;border-radius:50%;right:-150px;top:-150px;background:radial-gradient(circle,rgba(116,240,167,.09),transparent 70%);pointer-events:none}
  #planner .selectrow{position:relative;z-index:1;grid-template-columns:120px minmax(0,1fr);gap:16px;margin:0;padding:15px 0;border-bottom:1px solid rgba(255,255,255,.065)}
  #planner .selectrow:first-child{padding-top:0}
  #planner .selectrow label{font-size:.77rem;color:#7f8b97;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
  #planner .selectrow select{width:100%;min-width:0;background:#0b1118;border-color:rgba(255,255,255,.10);padding:12px 14px;font-weight:700}
  #planner .totalbar{position:relative;z-index:1;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:20px}
  #planner .totalbar .card{padding:15px!important;border-radius:16px;background:rgba(255,255,255,.026)}
  #planner .totalbar small{color:#72808d;font-size:.68rem;font-weight:850;text-transform:uppercase;letter-spacing:.09em}
  #planner .totalbar strong{display:block;font-size:1.22rem;margin-top:3px}
  #planner #planner-msg{position:relative;z-index:1;margin:14px 0 0;padding:11px 13px;border-radius:13px;background:rgba(255,255,255,.025);color:#b7c0c8;font-size:.88rem;border:1px solid rgba(255,255,255,.06)}
  #planner .planner>.card:nth-child(2){display:flex;flex-direction:column;justify-content:flex-end;background:linear-gradient(160deg,rgba(138,168,255,.055),rgba(255,255,255,.018))}
  #planner .planner>.card:nth-child(2):before{content:"ZASADA PLANERA";font-size:.67rem;letter-spacing:.12em;font-weight:900;color:#73808d;margin-bottom:auto}
  #planner .planner>.card:nth-child(2) h3{font-size:1.85rem;margin:90px 0 10px;letter-spacing:-.04em}
  #planner .planner>.card:nth-child(2) p{color:#8d99a5;line-height:1.65;margin-bottom:0}

  /* ===== Week / menu ===== */
  #week .week-planner{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
  #week .week-day{position:relative;overflow:hidden;padding:24px;border-radius:23px;background:linear-gradient(150deg,rgba(255,255,255,.032),rgba(255,255,255,.013))}
  #week .week-day:before{content:"DZIEŃ";display:block;color:#65717e;font-size:.64rem;font-weight:900;letter-spacing:.12em;margin-bottom:6px}
  #week .week-day h3{font-size:1.8rem;letter-spacing:-.045em;margin:0 0 17px}
  #week .week-meal{grid-template-columns:98px minmax(0,1fr);gap:12px;margin:9px 0}
  #week .week-meal span{font-size:.72rem;text-transform:uppercase;letter-spacing:.065em;font-weight:800;color:#73808c}
  #week .week-meal select{min-width:0;background:#0b1118;padding:11px 12px}
  #week .week-summary{margin:18px 0 0;padding-top:15px;border-top:1px solid rgba(255,255,255,.075);font-size:.82rem;color:#9fe4b9;letter-spacing:.01em}
  #week #shoppingCard{margin-top:20px!important;padding:27px;border-radius:26px}
  #week #shoppingCard>h3{font-size:1.8rem;margin:0 0 5px;letter-spacing:-.04em}
  #week #shoppingCard>.micro{display:block;max-width:720px;line-height:1.6}
  #week .weekly-numbers{grid-template-columns:repeat(4,1fr);gap:8px;margin:20px 0}
  #week .weekly-numbers div{background:rgba(255,255,255,.024);border-color:rgba(255,255,255,.075);border-radius:15px;padding:14px}
  #week .weekly-numbers strong{font-size:1.3rem;margin-top:3px}
  #week .shopping-toolbar{padding:14px 0 18px;margin:0;border-bottom:1px solid rgba(255,255,255,.065)}
  #week .shopping-toolbar .btn{font-size:.78rem;padding:9px 11px}
  #week .shopping-grid{margin-top:18px;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  #week .shopping-category{background:rgba(255,255,255,.018);border-color:rgba(255,255,255,.07);border-radius:18px;padding:16px}
  #week .shopping-category h4{font-size:.87rem;letter-spacing:.02em;margin:0 0 10px}
  #week .shopping-item{border-color:rgba(255,255,255,.055);font-size:.86rem}

  /* ===== Recipes ===== */
  #recipes .filters{display:inline-flex;max-width:100%;overflow:auto;gap:3px;padding:4px;border:1px solid rgba(255,255,255,.075);border-radius:999px;background:rgba(255,255,255,.018);margin:0 0 22px}
  #recipes .filters button{white-space:nowrap;border:0;border-radius:999px;padding:9px 13px;background:transparent;color:#8894a0;font-weight:800}
  #recipes .filters button.active{background:#f1f4f5;color:#0b0e12;box-shadow:none}
  #recipes .recipes{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
  #recipes .recipe{position:relative;overflow:hidden;padding:25px;border-radius:24px;min-height:250px;display:flex;flex-direction:column}
  #recipes .recipe:after{content:"";position:absolute;width:180px;height:180px;border-radius:50%;right:-105px;top:-110px;background:radial-gradient(circle,rgba(116,240,167,.07),transparent 70%);pointer-events:none}
  #recipes .recipe>small{font-size:.66rem;letter-spacing:.11em;text-transform:uppercase;font-weight:900;color:#6f7d89}
  #recipes .recipe h3{font-size:1.65rem;line-height:1.12;letter-spacing:-.04em;margin:12px 0 13px;max-width:90%}
  #recipes .recipe .macro{display:inline-flex;align-self:flex-start;padding:7px 10px;border:1px solid rgba(116,240,167,.15);border-radius:999px;background:rgba(116,240,167,.045);font-size:.76rem;color:#a6e7bd}
  #recipes .recipe details{margin-top:auto;padding-top:24px}
  #recipes .recipe summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:10px;padding-top:14px;border-top:1px solid rgba(255,255,255,.07);font-size:.82rem;font-weight:800;color:#b7c0c8}
  #recipes .recipe summary::-webkit-details-marker{display:none}
  #recipes .recipe summary:after{content:"+";font-size:1.2rem;color:#7d8994}
  #recipes .recipe details[open] summary:after{content:"–"}
  #recipes .recipe details ul,#recipes .recipe details ol{color:#9aa6b1;font-size:.86rem;line-height:1.55;padding-left:20px}

  /* ===== Training plan ===== */
  #training .training-note{position:relative;overflow:hidden;padding:27px;border-radius:25px;background:linear-gradient(120deg,rgba(116,240,167,.045),rgba(138,168,255,.025))}
  #training .training-note:before{content:"JAK PRACUJEMY";display:block;font-size:.67rem;color:#71808c;font-weight:900;letter-spacing:.12em;margin-bottom:10px}
  #training .training-note h3{font-size:1.75rem;margin:0 0 14px}
  #training .training-note ul{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px 24px;padding-left:20px;color:#919da8;line-height:1.55}
  #training .training-note .rule{margin-top:19px;padding:13px 15px;border-left:0;border:1px solid rgba(116,240,167,.13);border-radius:14px;background:rgba(116,240,167,.035);color:#aeb8c1}
  #training .training{grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:16px;counter-reset:trainingday}
  #training .training>.card{counter-increment:trainingday;position:relative;padding:24px;border-radius:24px;overflow:hidden}
  #training .training>.card:before{content:"0" counter(trainingday);display:block;color:#64717d;font-size:.66rem;font-weight:900;letter-spacing:.12em;margin-bottom:7px}
  #training .training>.card h3{font-size:1.6rem;margin:0 0 18px;letter-spacing:-.04em}
  #training .exercise{grid-template-columns:minmax(0,1fr) auto;gap:14px;padding:12px 0;border-color:rgba(255,255,255,.065);align-items:center}
  #training .exercise>span:first-child{font-size:.88rem;font-weight:650}
  #training .exercise>span:last-child{font-size:.74rem;text-align:right;color:#76838f}

  /* ===== Workout journal ===== */
  #workouts .workout-head{display:flex;justify-content:space-between;gap:28px;align-items:flex-end;margin-bottom:24px}
  #workouts .workout-head>div:before{content:"HISTORIA SIŁOWA";display:flex;align-items:center;gap:8px;color:#7d8995;font-size:.69rem;letter-spacing:.12em;font-weight:900;margin-bottom:8px}
  #workouts .workout-head>div:after{content:""}
  #workouts #workoutExportBtn{align-self:center;padding:11px 14px}
  #workouts .workout-stats{grid-template-columns:repeat(4,1fr);gap:8px;margin:0 0 18px}
  #workouts .workout-stats .card{padding:17px;border-radius:17px;background:rgba(255,255,255,.022)}
  #workouts .workout-stats .micro{text-transform:uppercase;letter-spacing:.075em;font-size:.65rem;font-weight:850}
  #workouts .workout-stats strong{font-size:1.35rem;margin-top:3px}
  #workouts .workout-layout{grid-template-columns:minmax(0,1.35fr) minmax(300px,.65fr);gap:16px;align-items:start}
  #workouts .workout-layout>aside{position:sticky;top:90px;padding:24px;border-radius:24px;background:linear-gradient(155deg,rgba(138,168,255,.04),rgba(255,255,255,.015))}
  #workouts .workout-layout>aside:before{content:"NOWY WPIS";display:block;color:#6f7c88;font-size:.66rem;font-weight:900;letter-spacing:.12em;margin-bottom:8px}
  #workouts .workout-layout>aside h3{font-size:1.55rem;margin:0 0 6px}
  #workouts .workout-form{gap:12px;margin-top:18px}
  #workouts .workout-form label{font-size:.69rem;text-transform:uppercase;letter-spacing:.065em;font-weight:800;color:#778490}
  #workouts .workout-form input,#workouts .workout-form textarea{margin-top:4px;text-transform:none;letter-spacing:normal;font-weight:500;color:#f0f3f5;padding:11px 12px}
  #workouts .workout-form button[type=submit]{margin-top:2px;background:#f0f3f4;color:#090c11;border-color:#f0f3f4;padding:12px 14px}
  #workouts .workout-session{position:relative;padding:25px;border-radius:25px;margin-top:0;margin-bottom:14px;overflow:hidden}
  #workouts .workout-session:before{content:"";position:absolute;left:0;top:24px;bottom:24px;width:2px;background:linear-gradient(var(--accent),rgba(116,240,167,0))}
  #workouts .workout-session-head{padding-left:10px}
  #workouts .workout-session-head .eyebrow{font-size:.65rem;color:#71808b}
  #workouts .workout-session-head h3{font-size:1.65rem!important;letter-spacing:-.04em!important}
  #workouts .workout-exercise{margin-left:10px;padding:14px 0;border-color:rgba(255,255,255,.065)}
  #workouts .workout-exercise>b{font-size:.92rem}
  #workouts .set-chip{background:rgba(255,255,255,.025);border-color:rgba(255,255,255,.075);padding:6px 9px;font-size:.78rem}

  /* ===== History / analytics ===== */
  #history>.card{border-radius:25px;padding:25px}
  #history>.card h3{font-size:1.45rem;letter-spacing:-.035em;margin-top:0}
  #history .history-tools{grid-template-columns:minmax(190px,1fr) repeat(4,auto);gap:7px;margin:0 0 16px}
  #history .history-tools .btn{font-size:.76rem;padding:9px 11px}
  #history #historyDetail{margin-top:0;min-height:90px}
  #history .history-filter{grid-template-columns:220px minmax(0,1fr);gap:18px;padding-bottom:17px;border-bottom:1px solid rgba(255,255,255,.06)}
  #history #autoTrend{margin-top:17px}
  #history .compare-tools{grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto;gap:10px}
  #history .compare-tools .micro,#history .history-filter .micro{font-size:.68rem;text-transform:uppercase;letter-spacing:.065em;font-weight:800}
  #history .chart-wrap{height:300px;margin-top:8px;border-radius:16px;background:rgba(255,255,255,.01);overflow:hidden}
  #history .history-list{gap:7px}
  #history .history-item{grid-template-columns:1.05fr repeat(4,.8fr) auto;padding:13px 14px;border-radius:15px;background:rgba(255,255,255,.018);font-size:.83rem}
  #history .history-item b{font-size:.88rem}
  #history .history-item .btn{font-size:.72rem;padding:7px 10px}
  #history .verdict{border-radius:16px;background:rgba(255,255,255,.018);border-color:rgba(255,255,255,.07);line-height:1.6}

  /* ===== Interaction polish ===== */
  .section:not(#checkin) .card{transition:transform .2s ease,border-color .2s ease,background .2s ease}
  @media(hover:hover){.section:not(#checkin) .recipe:hover,.section:not(#checkin) .week-day:hover,.section:not(#checkin) .training>.card:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.14)}}
  .btn{transition:transform .18s ease,background .18s ease,border-color .18s ease}
  @media(hover:hover){.btn:hover{transform:translateY(-1px)}}

  /* ===== Responsive ===== */
  @media(max-width:1000px){
    .ui-page-header{align-items:flex-start}.ui-page-badge{min-width:135px}
    #planner .planner,#workouts .workout-layout{grid-template-columns:1fr}
    #workouts .workout-layout>aside{position:static}
    #training .training{grid-template-columns:1fr}
    #training .training-note ul{grid-template-columns:1fr}
    #history .history-tools{grid-template-columns:1fr 1fr}
    #history .history-tools>select{grid-column:1/-1}
  }
  @media(max-width:760px){
    .section:not(#start):not(#checkin){padding-top:32px}
    .ui-page-header,.workout-head{display:block!important}.ui-page-badge{display:inline-block;margin-top:16px}
    #planner .totalbar,#week .weekly-numbers,#workouts .workout-stats{grid-template-columns:repeat(2,1fr)}
    #week .week-planner,#week .shopping-grid,#recipes .recipes{grid-template-columns:1fr}
    #history .history-filter,#history .compare-tools{grid-template-columns:1fr}
    #history .history-item{grid-template-columns:1fr 1fr;gap:8px}
    #history .chart-wrap{height:260px}
  }
  @media(max-width:520px){
    .ui-page-copy h2,.workout-head h2{font-size:2.6rem!important}
    #planner .selectrow{grid-template-columns:1fr;gap:5px}
    #planner .planner>.card{padding:20px}
    #planner .totalbar,#week .weekly-numbers,#workouts .workout-stats{grid-template-columns:1fr 1fr}
    #week .week-meal{grid-template-columns:1fr;gap:4px}
    #week #shoppingCard{padding:20px}
    #recipes .recipe{padding:21px;min-height:225px}
    #workouts .workout-form .two{grid-template-columns:1fr}
    #history .history-tools{grid-template-columns:1fr}
    #history .history-tools>select{grid-column:auto}
    #history .history-item{grid-template-columns:1fr}
  }
  `;
  document.head.appendChild(style);

  const meta={
    planner:{kicker:'Dieta na dziś',title:'Planer dnia',lead:'Złóż cztery posiłki tak, żeby cały dzień trzymał kalorie i białko. Zmieniaj produkty, nie cel.',badge:'Cel',badgeValue:'2350–2450 kcal'},
    week:{kicker:'Plan na 7 dni',title:'Tydzień',lead:'Ułóż jadłospis na cały tydzień i wygeneruj listę zakupów z wybranych posiłków.',badge:'System',badgeValue:'28 posiłków · 7 dni'},
    recipes:{kicker:'Baza posiłków',title:'Przepisy',lead:'Gotowe posiłki dopasowane do Twojego celu. Filtruj kategorię i podmieniaj przepisy bez rozwalania makro.',badge:'Priorytet',badgeValue:'Prosto · powtarzalnie'},
    training:{kicker:'Plan siłowy',title:'Trening',lead:'Trzy sesje Full Body. Progresujemy wtedy, gdy technika, regeneracja i powtórzenia są na miejscu.',badge:'Częstotliwość',badgeValue:'3× Full Body / tydzień'},
    history:{kicker:'Dane i decyzje',title:'Historia progresu',lead:'Porównuj tygodnie, obserwuj trend masy i pasa oraz podejmuj decyzje na podstawie danych, nie pojedynczego pomiaru.',badge:'Horyzont',badgeValue:'Trend 1–4 tygodni'}
  };

  function makeHeader(section,id){
    if(!section||section.dataset.uiHeader==='1'||id==='checkin'||id==='start')return;
    const m=meta[id];if(!m)return;
    const oldH2=section.querySelector(':scope > h2');
    const oldLead=section.querySelector(':scope > .lead');
    const header=document.createElement('div');header.className='ui-page-header';
    const copy=document.createElement('div');copy.className='ui-page-copy';
    copy.innerHTML=`<div class="section-kicker">${m.kicker}</div><h2>${m.title}</h2><p class="lead">${m.lead}</p>`;
    const badge=document.createElement('div');badge.className='ui-page-badge';badge.innerHTML=`<span>${m.badge}</span><strong>${m.badgeValue}</strong>`;
    header.append(copy,badge);
    section.insertBefore(header,section.firstChild);
    oldH2?.remove();oldLead?.remove();section.dataset.uiHeader='1';
  }

  function decoratePlanner(){
    const s=document.getElementById('planner');if(!s)return;makeHeader(s,'planner');
    const cards=s.querySelectorAll('.planner>.card');cards[0]?.classList.add('planner-builder');cards[1]?.classList.add('planner-guide');
    if(!s.querySelector('.ui-section-label'))s.querySelector('.planner')?.insertAdjacentHTML('beforebegin','<div class="ui-section-label">Kompozycja dnia</div>');
  }
  function decorateWeek(){
    const s=document.getElementById('week');if(!s)return;makeHeader(s,'week');
    if(!s.querySelector('.ui-week-label'))s.querySelector('#weekGrid')?.insertAdjacentHTML('beforebegin','<div class="ui-section-label ui-week-label">Jadłospis</div>');
    const shopping=document.getElementById('shoppingCard');
    if(shopping&&!shopping.dataset.uiDecorated){shopping.dataset.uiDecorated='1';shopping.insertAdjacentHTML('beforebegin','<div class="ui-section-label">Zakupy i średnie makro</div>');}
  }
  function decorateRecipes(){
    const s=document.getElementById('recipes');if(!s)return;makeHeader(s,'recipes');
    if(!s.querySelector('.ui-recipes-label'))s.querySelector('.filters')?.insertAdjacentHTML('beforebegin','<div class="ui-section-label ui-recipes-label">Wybierz kategorię</div>');
  }
  function decorateTraining(){
    const s=document.getElementById('training');if(!s)return;makeHeader(s,'training');
    if(!s.querySelector('.ui-training-label'))s.querySelector('.training-note')?.insertAdjacentHTML('afterend','<div class="ui-section-label ui-training-label">Sesje robocze</div>');
  }
  function decorateHistory(){
    const s=document.getElementById('history');if(!s)return;makeHeader(s,'history');
    const cards=[...s.querySelectorAll(':scope > .card')];
    const labels=['Raport tygodnia','Trend i filtr','Porównanie okresów','Waga + pas','Średnia waga','Obwód pasa','Archiwum'];
    cards.forEach((card,i)=>{if(card.dataset.uiSectionLabel)return;card.dataset.uiSectionLabel='1';const lab=document.createElement('div');lab.className='ui-section-label';lab.textContent=labels[i]||'Analiza';card.parentNode.insertBefore(lab,card);});
  }
  function decorateWorkouts(){
    const s=document.getElementById('workouts');if(!s||s.dataset.uiWorkouts==='1')return;
    s.dataset.uiWorkouts='1';
    const head=s.querySelector('.workout-head');
    if(head){const lead=head.querySelector('.lead');if(lead)lead.textContent='Zapisuj ciężary i powtórzenia. Najważniejszy jest trend jakościowych serii, nie pojedynczy rekord.';}
    s.querySelector('#workoutStats')?.insertAdjacentHTML('afterend','<div class="ui-section-label">Historia sesji i nowy wpis</div>');
  }

  function decorateAll(){decoratePlanner();decorateWeek();decorateRecipes();decorateTraining();decorateHistory();decorateWorkouts();}
  decorateAll();

  let timer=null;
  const observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(decorateAll,40);});
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),8000);
})();