(function(){
  const section=document.getElementById('checkin');
  if(!section||section.dataset.redesigned==='1')return;
  section.dataset.redesigned='1';
  section.classList.add('checkin-redesigned');

  const title=section.querySelector(':scope > h2');
  const lead=section.querySelector(':scope > .lead');
  const directCards=[...section.querySelectorAll(':scope > .card')];
  const metaCard=directCards[0];
  const evaluationCard=directCards[1];
  const tracker=document.getElementById('tracker');
  const summaryGrid=section.querySelector(':scope > .tracker-summary');

  if(title){title.textContent='Tygodniowy check-in';}
  if(lead){lead.innerHTML='Zbierz dane z całego tygodnia, zaznacz wykonanie planu i dopiero wtedy oceniaj progres. <b>Jedna gorsza doba nie zmienia decyzji.</b>';}

  // Header: strong hierarchy + current week status.
  if(title&&lead){
    const header=document.createElement('div');
    header.className='checkin-header';
    const copy=document.createElement('div');
    copy.className='checkin-header-copy';
    const kicker=document.createElement('div');
    kicker.className='section-kicker';
    kicker.textContent='Monitoring progresu';
    copy.append(kicker,title,lead);

    const weekBadge=document.createElement('div');
    weekBadge.className='checkin-week-badge';
    weekBadge.innerHTML=`<span>Bieżący raport</span><strong>${document.getElementById('cw')?.value||'CW'}</strong><small>${document.getElementById('year')?.value||''}</small>`;
    header.append(copy,weekBadge);
    section.insertBefore(header,section.firstChild);
  }

  const stepbar=document.createElement('div');
  stepbar.className='checkin-stepbar';
  stepbar.innerHTML=`
    <div class="checkin-step active"><span>01</span><div><b>Pomiary</b><small>waga, pas, kroki</small></div></div>
    <div class="checkin-step"><span>02</span><div><b>Realizacja</b><small>trening, dieta, sen</small></div></div>
    <div class="checkin-step"><span>03</span><div><b>Ocena</b><small>decyzja z trendu</small></div></div>`;
  const anchor=metaCard||tracker||summaryGrid||evaluationCard;
  if(anchor)section.insertBefore(stepbar,anchor);

  function addBlockHeader(parent,number,kickerText,heading,description){
    if(!parent)return;
    const head=document.createElement('div');
    head.className='checkin-block-head';
    head.innerHTML=`<div class="checkin-block-number">${number}</div><div><span>${kickerText}</span><h3>${heading}</h3>${description?`<p>${description}</p>`:''}</div>`;
    parent.insertBefore(head,parent.firstChild);
  }

  // Period + core metrics.
  if(metaCard){
    metaCard.classList.add('checkin-period-card');
    addBlockHeader(metaCard,'01','Punkt startowy','Dane tygodnia','Wpisz pomiary w podobnych warunkach. Nie potrzebujemy idealnej doby — potrzebujemy porównywalnych danych.');
    const labels=metaCard.querySelectorAll('.micro');
    const names=['Tydzień kalendarzowy','Rok','Pas rano','Średnie kroki'];
    labels.forEach((el,i)=>{if(names[i])el.textContent=names[i];});
    metaCard.querySelector('#waist')?.setAttribute('placeholder','np. 93,5');
    metaCard.querySelector('#steps')?.setAttribute('placeholder','np. 8500');
  }

  // Daily weight area gets its own visual card so the 7-column grid never leaks outside layout.
  if(tracker){
    const weightCard=document.createElement('div');
    weightCard.className='card checkin-weight-card';
    const parent=tracker.parentNode;
    parent.insertBefore(weightCard,tracker);
    addBlockHeader(weightCard,'02','Trend masy','Codzienna masa ciała','Wpisuj poranny pomiar. Średnia tygodnia ma znaczenie — pojedyncza liczba nie.');
    weightCard.appendChild(tracker);

    [...tracker.querySelectorAll('.wday')].forEach(day=>{
      const label=day.querySelector('label');
      const input=day.querySelector('input');
      if(!label||!input)return;
      const dayCode=(label.textContent||'').split('—')[0].trim();
      label.innerHTML=`<span class="day-code">${dayCode}</span><span class="day-caption">masa rano</span>`;
      input.placeholder='—';
      input.setAttribute('inputmode','decimal');
      input.setAttribute('aria-label',`${dayCode} — masa ciała w kg`);
      const suffix=document.createElement('span');
      suffix.className='input-suffix';
      suffix.textContent='kg';
      const wrap=document.createElement('div');
      wrap.className='weight-input-wrap';
      input.parentNode.insertBefore(wrap,input);
      wrap.append(input,suffix);
    });
  }

  // Weekly summary card.
  if(summaryGrid){
    const summaryCard=document.createElement('div');
    summaryCard.className='card checkin-summary-card';
    summaryGrid.parentNode.insertBefore(summaryCard,summaryGrid);
    addBlockHeader(summaryCard,'03','Kontekst','Podsumowanie tygodnia','To są dane, które wyjaśniają wynik na wadze: trening, kalorie, sen i regularność.');
    summaryCard.appendChild(summaryGrid);
    const summaryNames=['Średnia masy','Treningi siłowe','Kalorie / dzień','Sen / noc'];
    summaryGrid.querySelectorAll('.micro').forEach((el,i)=>{if(summaryNames[i])el.textContent=summaryNames[i];});
    document.getElementById('gyms')?.setAttribute('placeholder','np. 3');
    document.getElementById('sleep')?.setAttribute('placeholder','np. 7,5');
  }

  // Plan execution / scoring.
  if(evaluationCard){
    evaluationCard.classList.add('checkin-evaluation-card');
    const oldHeading=evaluationCard.querySelector(':scope > h3');
    if(oldHeading)oldHeading.remove();
    addBlockHeader(evaluationCard,'04','Realizacja','Czy plan został wykonany?','Zaznacz tylko to, co faktycznie zostało dowiezione. Ocena planu bez dobrej realizacji nie ma sensu.');

    const checklist=evaluationCard.querySelector('.checklist');
    const descriptions={
      cWeight:['Pomiary masy','Mam regularne pomiary potrzebne do policzenia średniej.'],
      cWaist:['Obwód pasa','Pomiar wykonany rano w porównywalnych warunkach.'],
      cGym:['Trening siłowy','Wykonane 3 zaplanowane sesje siłowe.'],
      cSteps:['Aktywność','Średnia tygodnia wynosi minimum 8 000 kroków.'],
      cKcal:['Dieta','Kalorie były liczone uczciwie przez cały tydzień.'],
      cStrength:['Siła i forma','Siła jest stabilna albo stopniowo wraca.']
    };
    checklist?.querySelectorAll('label').forEach(label=>{
      const input=label.querySelector('input');
      if(!input)return;
      const [name,desc]=descriptions[input.id]||['Realizacja planu',''];
      const text=document.createElement('span');
      text.className='check-item-copy';
      text.innerHTML=`<b>${name}</b><small>${desc}</small>`;
      // Preserve the original checkbox node and its state.
      [...label.childNodes].forEach(node=>{if(node!==input)node.remove();});
      const fake=document.createElement('span');
      fake.className='check-ui';
      fake.setAttribute('aria-hidden','true');
      label.append(fake,text);
    });

    const score=document.createElement('div');
    score.className='checkin-live-score';
    score.innerHTML='<span>Realizacja planu</span><strong id="checkinScore">0/6</strong><div class="score-track"><i id="checkinScoreBar"></i></div><small id="checkinScoreText">Zaznacz wykonane punkty.</small>';
    checklist?.insertAdjacentElement('beforebegin',score);

    const noteLabel=[...evaluationCard.querySelectorAll('label.micro')].find(l=>l.getAttribute('for')==='notes'||l.textContent.includes('Notatka'));
    if(noteLabel){noteLabel.textContent='Notatka trenerska / kontekst tygodnia';noteLabel.classList.add('notes-label');}
    const notes=document.getElementById('notes');
    if(notes){notes.placeholder='Np. słabszy sen przez 3 dni, mocny trening klatki, większy apetyt w weekend, brak bólu / dyskomfortu...';notes.rows=4;}

    const evaluate=document.getElementById('evaluateBtn');
    const clear=document.getElementById('clearForm');
    if(evaluate){evaluate.textContent='Zapisz i oceń tydzień →';evaluate.classList.add('checkin-primary');}
    if(clear){clear.textContent='Wyczyść dane';clear.classList.add('checkin-secondary');}

    function updateScore(){
      const checks=[...evaluationCard.querySelectorAll('.check')];
      const done=checks.filter(c=>c.checked).length;
      const pct=checks.length?done/checks.length*100:0;
      const scoreEl=document.getElementById('checkinScore');
      const bar=document.getElementById('checkinScoreBar');
      const text=document.getElementById('checkinScoreText');
      if(scoreEl)scoreEl.textContent=`${done}/${checks.length}`;
      if(bar)bar.style.width=`${pct}%`;
      if(text)text.textContent=done===checks.length?'Plan wykonany kompletnie — można oceniać trend.':done>=4?'Realizacja niezła, ale zaznacz tylko faktycznie wykonane punkty.':'Za mało danych / realizacji, żeby wyciągać mocne wnioski.';
      checklist?.querySelectorAll('label').forEach(label=>label.classList.toggle('checked',!!label.querySelector('input')?.checked));
    }
    evaluationCard.querySelectorAll('.check').forEach(c=>c.addEventListener('change',updateScore));
    clear?.addEventListener('click',()=>setTimeout(updateScore,0));
    updateScore();
  }

  const style=document.createElement('style');
  style.id='checkinRedesignStyles';
  style.textContent=`
  #checkin.checkin-redesigned{max-width:1180px;margin-inline:auto;padding-top:44px;overflow:hidden}
  #checkin .checkin-header{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:end;margin-bottom:30px}
  #checkin .checkin-header-copy{min-width:0}
  #checkin .checkin-header h2{font-size:clamp(2.7rem,5vw,5rem);line-height:.94;letter-spacing:-.06em;margin:12px 0 18px;max-width:760px}
  #checkin .checkin-header .lead{max-width:760px;margin:0;font-size:1rem;line-height:1.7;color:#8e9aa8}
  #checkin .checkin-header .lead b{color:#cfd6dd;font-weight:650}
  #checkin .checkin-week-badge{min-width:158px;padding:18px 20px;border:1px solid rgba(255,255,255,.09);border-radius:20px;background:rgba(255,255,255,.022)}
  #checkin .checkin-week-badge span,#checkin .checkin-week-badge small{display:block;color:#7f8b97;font-size:.72rem}
  #checkin .checkin-week-badge strong{display:block;font-size:1.65rem;letter-spacing:-.04em;margin:3px 0}

  #checkin .checkin-stepbar{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border:1px solid rgba(255,255,255,.075);border-radius:20px;overflow:hidden;margin-bottom:14px;background:rgba(255,255,255,.012)}
  #checkin .checkin-step{display:flex;gap:12px;align-items:center;padding:16px 18px;min-width:0}
  #checkin .checkin-step+.checkin-step{border-left:1px solid rgba(255,255,255,.075)}
  #checkin .checkin-step>span{display:grid;place-items:center;width:31px;height:31px;flex:0 0 31px;border-radius:50%;border:1px solid rgba(255,255,255,.12);font-size:.7rem;color:#81909c;font-weight:900}
  #checkin .checkin-step.active>span{background:#f4f6f7;color:#090c11;border-color:#f4f6f7}
  #checkin .checkin-step b,#checkin .checkin-step small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #checkin .checkin-step b{font-size:.86rem}#checkin .checkin-step small{font-size:.7rem;color:#75818d;margin-top:1px}

  #checkin>.card,#checkin>.checkin-weight-card,#checkin>.checkin-summary-card{margin-top:14px!important;padding:28px;border-radius:26px;background:linear-gradient(155deg,rgba(255,255,255,.032),rgba(255,255,255,.012));border:1px solid rgba(255,255,255,.085);min-width:0}
  #checkin .checkin-block-head{display:grid;grid-template-columns:42px minmax(0,1fr);gap:15px;align-items:start;margin-bottom:24px}
  #checkin .checkin-block-number{display:grid;place-items:center;width:40px;height:40px;border-radius:13px;background:rgba(116,240,167,.08);border:1px solid rgba(116,240,167,.20);color:#74f0a7;font-size:.72rem;font-weight:900;letter-spacing:.05em}
  #checkin .checkin-block-head span{display:block;color:#76838f;font-size:.68rem;text-transform:uppercase;letter-spacing:.12em;font-weight:850;margin-bottom:4px}
  #checkin .checkin-block-head h3{font-size:1.35rem;line-height:1.15;letter-spacing:-.035em;margin:0}
  #checkin .checkin-block-head p{color:#7f8c98;font-size:.86rem;line-height:1.55;margin:7px 0 0;max-width:690px}

  #checkin .checkin-period-card .tracker-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:0}
  #checkin .checkin-period-card .tracker-summary>div,#checkin .checkin-summary-card .tracker-summary>div{min-width:0;padding:15px;border:1px solid rgba(255,255,255,.07);border-radius:16px;background:rgba(0,0,0,.10)}
  #checkin .micro{display:block;color:#7f8b97;font-size:.72rem;font-weight:700;letter-spacing:.015em;margin-bottom:8px}
  #checkin input,#checkin textarea{width:100%;max-width:100%;min-width:0;box-sizing:border-box;font-size:.95rem}
  #checkin .checkin-period-card input,#checkin .checkin-summary-card input{height:45px;background:rgba(255,255,255,.025)}
  #checkin input[readonly]{color:#aab4be;background:rgba(255,255,255,.014);cursor:default}

  #checkin #tracker.tracker{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px;width:100%;min-width:0}
  #checkin #tracker .wday{min-width:0;padding:12px;border-radius:17px;background:rgba(255,255,255,.018);border:1px solid rgba(255,255,255,.075)}
  #checkin #tracker .wday label{display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:10px}
  #checkin .day-code{display:grid;place-items:center;width:31px;height:31px;border-radius:10px;background:rgba(255,255,255,.055);color:#f0f3f5;font-weight:900;font-size:.78rem}
  #checkin .day-caption{font-size:.64rem;color:#697682;text-align:right;line-height:1.15}
  #checkin .weight-input-wrap{display:flex;align-items:center;gap:4px;border:1px solid rgba(255,255,255,.095);border-radius:12px;background:#0b1016;padding-right:8px;overflow:hidden;min-width:0}
  #checkin .weight-input-wrap:focus-within{border-color:rgba(116,240,167,.50);box-shadow:0 0 0 2px rgba(116,240,167,.06)}
  #checkin .weight-input-wrap input{border:0!important;background:transparent!important;padding:10px 4px 10px 10px;min-width:0;box-shadow:none!important;outline:0!important}
  #checkin .input-suffix{font-size:.65rem;color:#66737f;flex:0 0 auto}

  #checkin .checkin-summary-card .tracker-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:0}
  #checkin .checkin-summary-card #avgWeight{display:flex;align-items:center;height:45px;font-size:1.2rem;letter-spacing:-.035em}

  #checkin .checkin-evaluation-card .checklist{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:16px}
  #checkin .checkin-evaluation-card .checklist label{position:relative;display:grid;grid-template-columns:24px minmax(0,1fr);gap:12px;align-items:start;padding:17px;border-radius:17px;background:rgba(255,255,255,.015);border:1px solid rgba(255,255,255,.075);cursor:pointer;transition:border-color .18s ease,background .18s ease,transform .18s ease;min-width:0}
  #checkin .checkin-evaluation-card .checklist label:hover{border-color:rgba(255,255,255,.15);background:rgba(255,255,255,.025);transform:translateY(-1px)}
  #checkin .checkin-evaluation-card .checklist label.checked{border-color:rgba(116,240,167,.28);background:rgba(116,240,167,.055)}
  #checkin .checklist input[type=checkbox]{position:absolute;opacity:0;pointer-events:none;width:1px;height:1px}
  #checkin .check-ui{width:22px;height:22px;border-radius:7px;border:1px solid rgba(255,255,255,.18);background:#0b1016;position:relative;margin-top:1px}
  #checkin label.checked .check-ui{background:#74f0a7;border-color:#74f0a7}
  #checkin label.checked .check-ui:after{content:'✓';position:absolute;inset:0;display:grid;place-items:center;color:#07100b;font-size:.75rem;font-weight:1000}
  #checkin .check-item-copy{min-width:0}.check-item-copy b{display:block;font-size:.88rem;letter-spacing:-.015em}.check-item-copy small{display:block;margin-top:4px;color:#74818d;font-size:.72rem;line-height:1.4}

  #checkin .checkin-live-score{display:grid;grid-template-columns:1fr auto;gap:5px 20px;align-items:end;padding:17px 18px;border:1px solid rgba(255,255,255,.075);border-radius:17px;background:rgba(0,0,0,.12)}
  #checkin .checkin-live-score>span{font-size:.76rem;color:#7e8a96;font-weight:750}.checkin-live-score strong{font-size:1.25rem;letter-spacing:-.04em}
  #checkin .score-track{grid-column:1/-1;height:5px;border-radius:999px;background:rgba(255,255,255,.07);overflow:hidden;margin-top:5px}
  #checkin .score-track i{display:block;width:0;height:100%;border-radius:inherit;background:linear-gradient(90deg,#74f0a7,#8aa8ff);transition:width .25s ease}
  #checkin .checkin-live-score small{grid-column:1/-1;color:#697682;font-size:.7rem;margin-top:4px}

  #checkin .notes-label{margin-top:24px!important;margin-bottom:8px!important;color:#aab4be!important;font-size:.75rem!important}
  #checkin #notes{resize:vertical;min-height:108px;padding:14px 15px;line-height:1.55;background:rgba(0,0,0,.13)}
  #checkin .actions{display:flex;gap:9px;align-items:center;margin-top:14px}
  #checkin .actions .btn{min-height:46px;padding:0 18px;border-radius:13px}
  #checkin .checkin-primary{background:#f3f5f6!important;color:#080b0f!important;border-color:#f3f5f6!important;font-weight:900!important}
  #checkin .checkin-primary:hover{background:#74f0a7!important;border-color:#74f0a7!important}
  #checkin .checkin-secondary{background:transparent!important;color:#8995a1!important}
  #checkin #verdict.verdict{margin-top:16px;border-radius:17px;padding:18px;line-height:1.55}
  #checkin #verdict h3{margin-top:0}

  @media(max-width:980px){
    #checkin .checkin-period-card .tracker-summary,#checkin .checkin-summary-card .tracker-summary{grid-template-columns:repeat(2,minmax(0,1fr))}
    #checkin #tracker.tracker{grid-template-columns:repeat(4,minmax(0,1fr))}
  }
  @media(max-width:720px){
    #checkin.checkin-redesigned{padding-top:30px}
    #checkin .checkin-header{grid-template-columns:1fr;gap:18px;align-items:start}
    #checkin .checkin-week-badge{display:flex;align-items:baseline;gap:8px;min-width:0;width:max-content;max-width:100%;padding:11px 14px;border-radius:14px}
    #checkin .checkin-week-badge span{display:none}#checkin .checkin-week-badge strong{font-size:1rem;margin:0}#checkin .checkin-week-badge small{font-size:.72rem}
    #checkin .checkin-stepbar{grid-template-columns:1fr}
    #checkin .checkin-step+.checkin-step{border-left:0;border-top:1px solid rgba(255,255,255,.075)}
    #checkin .checkin-step small{white-space:normal}
    #checkin>.card,#checkin>.checkin-weight-card,#checkin>.checkin-summary-card{padding:21px;border-radius:21px}
    #checkin #tracker.tracker{grid-template-columns:repeat(2,minmax(0,1fr))}
    #checkin .checkin-evaluation-card .checklist{grid-template-columns:1fr}
  }
  @media(max-width:460px){
    #checkin .checkin-header h2{font-size:2.65rem}
    #checkin .checkin-period-card .tracker-summary,#checkin .checkin-summary-card .tracker-summary{grid-template-columns:1fr}
    #checkin #tracker.tracker{grid-template-columns:1fr 1fr}
    #checkin .day-caption{display:none}
    #checkin .actions{display:grid;grid-template-columns:1fr}
    #checkin .actions .btn{width:100%}
  }
  `;
  document.head.appendChild(style);
})();