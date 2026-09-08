(function(){
  if(document.getElementById('formaOrchidTheme')) return;

  const style=document.createElement('style');
  style.id='formaOrchidTheme';
  style.textContent=`
  :root{
    --bg:#070a0f;
    --panel:#0d1219;
    --panel2:#111821;
    --text:#f5f7f9;
    --muted:#8e9aa8;
    --line:rgba(255,255,255,.10);
    --accent:#74f0a7;
    --accent2:#8aa8ff;
    --warn:#ffd47a;
    --bad:#ff8a8a;
  }
  html{background:var(--bg)}
  body{
    background:
      radial-gradient(circle at 12% 8%,rgba(116,240,167,.08),transparent 25rem),
      radial-gradient(circle at 88% 16%,rgba(138,168,255,.09),transparent 28rem),
      #070a0f;
    color:var(--text);
    letter-spacing:-.01em;
  }
  .wrap{width:min(1220px,calc(100% - 40px))}
  .top{
    background:rgba(7,10,15,.78);
    backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);
    border-bottom:1px solid rgba(255,255,255,.075);
  }
  .nav{padding:14px 0;gap:3px}
  .brand{
    font-size:.86rem;
    letter-spacing:.09em;
    margin-right:auto;
    padding-right:20px;
  }
  .nav button,.nav .btn{
    background:transparent;
    border:0;
    border-radius:999px;
    color:#a8b2bf;
    padding:9px 13px;
    transition:background .2s ease,color .2s ease,transform .2s ease;
  }
  .nav button:hover,.nav .btn:hover{background:rgba(255,255,255,.055);color:#fff}
  .nav button.active{
    background:#f3f5f7;
    color:#090c11;
  }
  .nav .btn{margin-left:10px;border:1px solid var(--line)}

  .hero{padding:38px 0 12px}
  .hero-orchid{
    position:relative;
    overflow:hidden;
    min-height:520px;
    border:1px solid rgba(255,255,255,.09);
    border-radius:34px;
    background:
      linear-gradient(135deg,rgba(255,255,255,.035),rgba(255,255,255,.012)),
      #0a0f15;
    box-shadow:0 30px 90px rgba(0,0,0,.32);
  }
  .hero-orchid:before{
    content:"";
    position:absolute;
    width:520px;height:520px;
    right:-160px;top:-210px;
    border-radius:50%;
    background:radial-gradient(circle,rgba(116,240,167,.18),rgba(116,240,167,0) 68%);
    pointer-events:none;
  }
  .hero-orchid:after{
    content:"";
    position:absolute;inset:0;
    background-image:linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px);
    background-size:56px 56px;
    mask-image:linear-gradient(to bottom,rgba(0,0,0,.7),transparent 80%);
    pointer-events:none;
  }
  .hero-main{
    position:relative;z-index:2;
    display:grid;
    grid-template-columns:minmax(0,1.05fr) minmax(390px,.95fr);
    gap:54px;
    align-items:center;
    min-height:400px;
    padding:58px 58px 36px;
  }
  .hero-kicker,.section-kicker{
    display:inline-flex;align-items:center;gap:9px;
    color:#b8c2cc;
    font-size:.76rem;font-weight:850;letter-spacing:.12em;text-transform:uppercase;
  }
  .hero-kicker:before,.section-kicker:before{
    content:"";width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 18px rgba(116,240,167,.7)
  }
  .hero-copy h1{
    max-width:650px;
    margin:18px 0 20px;
    font-size:clamp(3.25rem,6.4vw,6.4rem);
    line-height:.88;
    letter-spacing:-.065em;
    font-weight:780;
  }
  .hero-copy h1 span{color:#778391}
  .hero-copy .lead{max-width:610px;font-size:1.06rem;line-height:1.65;margin:0}
  .hero-minirow{display:flex;gap:24px;align-items:center;flex-wrap:wrap;margin-top:32px}
  .hero-status{display:flex;align-items:center;gap:9px;color:#cfd6dc;font-size:.9rem}
  .hero-status i{display:block;width:8px;height:8px;border-radius:50%;background:var(--accent)}
  .hero-link{
    border:0;background:transparent;color:#fff;font:inherit;font-weight:800;cursor:pointer;padding:0;
    border-bottom:1px solid rgba(255,255,255,.35)
  }

  /* Native vector brand mark: steel, graphite and slow orbital motion. */
  .hero-visual{position:relative;min-height:300px;display:grid;place-items:center;isolation:isolate}
  .hero-visual svg{width:100%;max-width:520px;height:auto;position:relative;z-index:2;overflow:visible}
  .hero-orbit{display:none}
  .hero-glow{position:absolute;width:90%;aspect-ratio:1;border-radius:50%;background:radial-gradient(ellipse,rgba(111,177,201,.12),rgba(116,240,167,.025) 45%,transparent 68%);pointer-events:none}
  .forma-orbit-system{transform-origin:260px 160px;animation:forma-orbit-drift 24s ease-in-out infinite alternate}
  .forma-orbit-system.second{animation-duration:31s;animation-direction:alternate-reverse}
  .forma-planet{offset-path:path('M 480 160 A 220 108 0 1 1 40 160 A 220 108 0 1 1 480 160');offset-rotate:0deg;animation:forma-revolve 26s linear infinite;filter:drop-shadow(0 0 5px #74f0a7)}
  .forma-planet.blue{offset-path:path('M 460 160 A 200 138 0 1 1 60 160 A 200 138 0 1 1 460 160');animation-duration:38s;animation-direction:reverse;animation-delay:-12s;filter:drop-shadow(0 0 5px #8aa8ff)}
  .forma-planet.small{animation-duration:26s;animation-delay:-13s;opacity:.65}
  @keyframes forma-revolve{from{offset-distance:0%}to{offset-distance:100%}}
  @keyframes forma-orbit-drift{from{transform:rotate(-12deg)}to{transform:rotate(4deg)}}
  @media(prefers-reduced-motion:reduce){
    .forma-orbit-system,.forma-planet{animation:none}
    .forma-planet{offset-distance:18%}.forma-planet.blue{offset-distance:64%}.forma-planet.small{offset-distance:82%}
  }

  .hero-stats{
    position:relative;z-index:3;
    display:grid;grid-template-columns:repeat(6,1fr);
    border-top:1px solid rgba(255,255,255,.09);
    background:rgba(255,255,255,.012);
  }
  .hero-stat{padding:23px 24px;min-width:0}
  .hero-stat+.hero-stat{border-left:1px solid rgba(255,255,255,.075)}
  .hero-stat strong{display:block;font-size:1.45rem;letter-spacing:-.035em}
  .hero-stat span{display:block;margin-top:3px;color:#84909c;font-size:.78rem}

  .section{padding:56px 0 76px}
  .section>h2{font-size:clamp(2rem,4vw,3.7rem);line-height:1;letter-spacing:-.045em;margin:0 0 16px}
  .section>.lead{font-size:1rem;max-width:760px;line-height:1.7}

  .start-shell{padding-top:58px}
  .start-heading{display:grid;grid-template-columns:.8fr 1.2fr;gap:70px;align-items:end;margin-bottom:34px}
  .start-heading h2{font-size:clamp(2.3rem,4.5vw,4.8rem);line-height:.96;letter-spacing:-.055em;margin:10px 0 0}
  .start-heading p{color:var(--muted);font-size:1rem;line-height:1.7;max-width:590px;margin:0 0 7px}
  .principles{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .principle{
    position:relative;overflow:hidden;min-height:310px;
    border:1px solid rgba(255,255,255,.085);
    border-radius:26px;
    padding:28px;
    background:linear-gradient(155deg,rgba(255,255,255,.035),rgba(255,255,255,.012));
  }
  .principle:after{content:"";position:absolute;width:190px;height:190px;border-radius:50%;right:-85px;bottom:-100px;background:radial-gradient(circle,rgba(116,240,167,.09),transparent 70%)}
  .principle-num{color:#6e7985;font-size:.78rem;font-weight:900;letter-spacing:.12em}
  .principle h3{font-size:1.75rem;letter-spacing:-.035em;margin:70px 0 18px}
  .principle p{color:#8995a2;line-height:1.65}
  .principle-list{display:grid;gap:10px;margin-top:22px}
  .principle-row{display:flex;justify-content:space-between;gap:16px;padding-top:10px;border-top:1px solid rgba(255,255,255,.075);font-size:.9rem}
  .principle-row span{color:#84909c}.principle-row b{font-weight:800}
  .decision-band{
    margin-top:14px;border:1px solid rgba(255,255,255,.085);border-radius:26px;padding:28px 30px;
    display:grid;grid-template-columns:1.3fr .7fr;gap:36px;align-items:center;
    background:linear-gradient(90deg,rgba(116,240,167,.05),rgba(138,168,255,.04));
  }
  .decision-band h3{font-size:1.45rem;margin:0 0 7px;letter-spacing:-.025em}
  .decision-band p{margin:0;color:#8793a0;line-height:1.6}
  .decision-rule{justify-self:end;text-align:right;font-size:.86rem;color:#aab4be}
  .decision-rule b{display:block;color:#fff;font-size:1.05rem;margin-bottom:4px}

  .card{
    background:linear-gradient(160deg,rgba(255,255,255,.034),rgba(255,255,255,.014));
    border-color:rgba(255,255,255,.085);
    border-radius:22px;
    box-shadow:none;
  }
  .card h3{letter-spacing:-.025em}
  .wday,.history-item,.verdict,.filters button{
    background:rgba(255,255,255,.018);
    border-color:rgba(255,255,255,.08);
  }
  .filters button.active{background:rgba(116,240,167,.08);border-color:rgba(116,240,167,.4)}
  .btn,select,input,textarea{
    background:#0d131b;
    border-color:rgba(255,255,255,.10);
    border-radius:13px;
  }
  input:focus,select:focus,textarea:focus{outline:1px solid rgba(116,240,167,.5);border-color:rgba(116,240,167,.5)}
  .footer{border-color:rgba(255,255,255,.075);padding-top:30px}

  @media(max-width:1000px){
    .hero-main{grid-template-columns:1fr;padding:44px 34px 30px;gap:14px}
    .hero-visual{min-height:230px}.hero-visual svg{max-width:430px}
    .hero-stats{grid-template-columns:repeat(3,1fr)}
    .hero-stat:nth-child(4){border-left:0}.hero-stat:nth-child(n+4){border-top:1px solid rgba(255,255,255,.075)}
    .start-heading{grid-template-columns:1fr;gap:20px}.principles{grid-template-columns:1fr}.principle{min-height:0}.principle h3{margin-top:38px}
  }
  @media(max-width:650px){
    .wrap{width:min(100% - 24px,1220px)}
    .nav{padding:10px 0}.brand{margin-right:8px}.nav .btn{margin-left:4px}
    .hero{padding-top:18px}.hero-orchid{border-radius:24px;min-height:0}
    .hero-main{padding:32px 22px 20px}.hero-copy h1{font-size:clamp(2.8rem,16vw,4.4rem)}
    .hero-copy .lead{font-size:.94rem}.hero-visual{min-height:190px}.hero-visual svg{max-width:330px}
    .hero-stats{grid-template-columns:repeat(2,1fr)}
    .hero-stat:nth-child(odd){border-left:0}.hero-stat:nth-child(n+3){border-top:1px solid rgba(255,255,255,.075)}
    .hero-stat{padding:18px}.hero-stat strong{font-size:1.2rem}
    .section{padding:38px 0 54px}.start-shell{padding-top:38px}.start-heading h2{font-size:2.65rem}
    .principle{padding:23px}.decision-band{grid-template-columns:1fr}.decision-rule{justify-self:start;text-align:left}
  }
  `;
  document.head.appendChild(style);
  document.documentElement.classList.add('forma-orchid');

  const hero=document.querySelector('.hero');
  if(hero){
    hero.innerHTML=`
      <div class="hero-orchid">
        <div class="hero-main">
          <div class="hero-copy">
            <div class="hero-kicker">Redukcja · etap 1</div>
            <h1>Budujemy formę.<br><span>Mierzymy progres.</span></h1>
            <p class="lead">2400 kcal, wysoki poziom białka, trzy treningi siłowe i aktywność, którą da się utrzymać. Zmieniamy plan dopiero wtedy, kiedy dane dają ku temu powód.</p>
            <div class="hero-minirow">
              <div class="hero-status"><i></i> Plan aktywny</div>
              <button class="hero-link" type="button" data-hero-tab="workouts">Otwórz dziennik treningów →</button>
            </div>
          </div>
          <div class="hero-visual" aria-hidden="true">
            <div class="hero-glow"></div><div class="hero-orbit"></div><div class="hero-orbit two"></div>
            <svg viewBox="0 0 520 320" xmlns="http://www.w3.org/2000/svg" focusable="false">
              <defs>
                <linearGradient id="formaBar"><stop stop-color="#74f0a7"/><stop offset="1" stop-color="#8aa8ff"/></linearGradient>
                <linearGradient id="formaSteel" x1="0" y1="0" x2="0" y2="1">
                  <stop stop-color="#34424f"/><stop offset=".18" stop-color="#93a9b6"/><stop offset=".38" stop-color="#e2eaf0"/><stop offset=".48" stop-color="#a0b4c0"/><stop offset=".56" stop-color="#566775"/><stop offset="1" stop-color="#222e38"/>
                </linearGradient>
                <linearGradient id="formaPlate" x1="0" y1="0" x2="1" y2=".35">
                  <stop stop-color="#141d26"/><stop offset=".18" stop-color="#607180"/><stop offset=".3" stop-color="#303e4b"/><stop offset=".72" stop-color="#18222d"/><stop offset="1" stop-color="#080f17"/>
                </linearGradient>
                <linearGradient id="formaEdge" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#9fb8c7" stop-opacity=".7"/><stop offset=".5" stop-color="#526776" stop-opacity=".25"/><stop offset="1" stop-color="#131d26"/></linearGradient>
                <radialGradient id="formaHub" cx=".3" cy=".18" r=".9"><stop stop-color="#263440"/><stop offset=".5" stop-color="#111c25"/><stop offset="1" stop-color="#080e15"/></radialGradient>
                <pattern id="formaKnurl" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 0L5 5M5 0L0 5" stroke="#0a1721" stroke-width=".6" opacity=".35"/></pattern>
                <filter id="formaShadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000" flood-opacity=".6"/></filter>
              </defs>
              <g transform="rotate(18 260 160)">
                <g class="forma-orbit-system">
                  <ellipse cx="260" cy="160" rx="220" ry="108" fill="none" stroke="#74f0a7" stroke-opacity=".17" stroke-width=".8"/>
                  <circle class="forma-planet" r="3.6" fill="#a3ffd0"/>
                  <circle class="forma-planet small" r="1.8" fill="#a3ffd0"/>
                </g>
              </g>
              <g transform="rotate(-24 260 160)">
                <g class="forma-orbit-system second">
                  <ellipse cx="260" cy="160" rx="200" ry="138" fill="none" stroke="#a5bbf0" stroke-opacity=".16" stroke-width=".8"/>
                  <circle class="forma-planet blue" r="4" fill="#acc5ff"/>
                </g>
              </g>
              <g filter="url(#formaShadow)">
                <rect x="31" y="153" width="458" height="14" rx="4" fill="url(#formaSteel)" stroke="#b3cad7" stroke-opacity=".2"/>
                <rect x="147" y="154" width="226" height="12" rx="2" fill="url(#formaKnurl)"/>
                <path d="M154 155H366" stroke="#d3e8f0" stroke-opacity=".4"/>
                <g id="formaPlateStack">
                  <rect x="53" y="128" width="11" height="64" rx="3" fill="url(#formaSteel)" stroke="#7c939f" stroke-opacity=".3"/>
                  <rect x="66" y="115" width="15" height="90" rx="5" fill="url(#formaPlate)" stroke="url(#formaEdge)"/>
                  <rect x="81" y="100" width="23" height="120" rx="7" fill="url(#formaPlate)" stroke="url(#formaEdge)"/>
                  <rect x="104" y="86" width="30" height="148" rx="9" fill="url(#formaPlate)" stroke="url(#formaEdge)"/>
                  <path d="M110 96V224" stroke="#b5ccd5" stroke-opacity=".22"/>
                  <path d="M128 96V224" stroke="#030a12" stroke-width="2"/>
                  <rect x="137" y="145" width="9" height="30" rx="2" fill="url(#formaSteel)"/>
                  <path d="M112 102V128" stroke="#91e9c1" stroke-width="2" stroke-linecap="round" opacity=".7"/>
                  <path d="M86 110V140M71 124V146" stroke="#8cb4b7" stroke-opacity=".25"/>
                </g>
                <use href="#formaPlateStack" transform="translate(520 0) scale(-1 1)"/>
                <circle cx="260" cy="160" r="48" fill="url(#formaHub)" stroke="url(#formaEdge)" stroke-width="1.5"/>
                <circle cx="260" cy="160" r="41" fill="none" stroke="#b2c9da" stroke-opacity=".09"/>
                <path d="M229 132A42 42 0 0 1 283 125" fill="none" stroke="url(#formaBar)" stroke-opacity=".5" stroke-linecap="round"/>
                <path d="M245 175L260 140L275 175M250 165H270" fill="none" stroke="url(#formaBar)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="260" cy="195" r="1.4" fill="#8eabbc" opacity=".6"/>
              </g>
            </svg>
          </div>
        </div>
        <div class="hero-stats">
          <div class="hero-stat"><strong>79,44 kg</strong><span>średnia startowa</span></div>
          <div class="hero-stat"><strong>~94 cm</strong><span>pas</span></div>
          <div class="hero-stat"><strong>2400 kcal</strong><span>cel dzienny</span></div>
          <div class="hero-stat"><strong>170 g</strong><span>białko</span></div>
          <div class="hero-stat"><strong>3×</strong><span>siłownia / tydzień</span></div>
          <div class="hero-stat"><strong>8–10k</strong><span>kroki / dzień</span></div>
        </div>
      </div>`;
    hero.querySelector('[data-hero-tab="workouts"]')?.addEventListener('click',()=>{
      if(typeof window.setTab==='function') window.setTab('workouts');
      else document.querySelector('[data-tab="workouts"]')?.click();
    });
  }

  const start=document.getElementById('start');
  if(start){
    start.innerHTML=`
      <div class="start-shell">
        <div class="start-heading">
          <div><div class="section-kicker">Plan na teraz</div><h2>Mało zasad.<br>Wszystkie mają znaczenie.</h2></div>
          <p>Najpierw robimy pełne dwa tygodnie zgodnie z planem. Potem patrzymy na średnią wagę, pas, siłę, kroki i regenerację. Jeżeli trend jest dobry — niczego nie poprawiamy na siłę.</p>
        </div>
        <div class="principles">
          <article class="principle">
            <div class="principle-num">01 / DIETA</div>
            <h3>Kontrolowana redukcja</h3>
            <p>Deficyt ma zdejmować tłuszcz, ale zostawić paliwo do treningu i utrzymania mięśni.</p>
            <div class="principle-list">
              <div class="principle-row"><span>Kalorie</span><b>2350–2450</b></div>
              <div class="principle-row"><span>Białko</span><b>160–170 g</b></div>
              <div class="principle-row"><span>Tłuszcz</span><b>60–80 g</b></div>
            </div>
          </article>
          <article class="principle">
            <div class="principle-num">02 / AKTYWNOŚĆ</div>
            <h3>Ruch bez zajeżdżania</h3>
            <p>Kroki są bazą. Cardio dokładamy w stałej, przewidywalnej dawce zamiast nadrabiać chaotycznie.</p>
            <div class="principle-list">
              <div class="principle-row"><span>Kroki</span><b>8–10k / dzień</b></div>
              <div class="principle-row"><span>Cardio</span><b>2 × 25–30 min</b></div>
              <div class="principle-row"><span>Bieżnia</span><b>8–12% nachylenia</b></div>
            </div>
          </article>
          <article class="principle">
            <div class="principle-num">03 / TRENING</div>
            <h3>Siła ma zostać</h3>
            <p>Trzy sesje Full Body, kontrolowane RIR i progres wtedy, kiedy technika oraz regeneracja na to pozwalają.</p>
            <div class="principle-list">
              <div class="principle-row"><span>Siłownia</span><b>3 × / tydzień</b></div>
              <div class="principle-row"><span>Serie robocze</span><b>głównie 1–2 RIR</b></div>
              <div class="principle-row"><span>Priorytet</span><b>progres jakościowy</b></div>
            </div>
          </article>
        </div>
        <div class="decision-band">
          <div><h3>Nie zmieniamy planu po jednym słabszym dniu.</h3><p>Decyzję o kalorii, cardio albo objętości treningowej podejmujemy z trendu z 1–4 tygodni, a nie z pojedynczej wagi czy jednego gorszego treningu.</p></div>
          <div class="decision-rule"><b>Reguła prowadzenia</b>Jeśli progres jest dobry — kontynuujemy.</div>
        </div>
      </div>`;
  }
})();