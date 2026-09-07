(function(){
  const root=document.getElementById('recipes');
  const grid=document.getElementById('recipeGrid');
  const data=window.FORMA_DATA?.recipes||[];
  if(!root||!grid||!data.length)return;

  const catNames={breakfast:'Śniadanie',lunch:'Obiad',snack:'Przekąska',dinner:'Kolacja'};
  const photo=id=>`/forma/images/recipes/${encodeURIComponent(id)}.webp`;
  const meta={
    b1:['10 min','Łatwe'],b2:['15 min','Łatwe'],b3:['5 min','Bardzo łatwe'],b4:['10 min','Łatwe'],b5:['20 min','Średnie'],
    l1:['30 min','Średnie'],l2:['30 min','Średnie'],l3:['35 min','Łatwe'],l4:['30 min','Średnie'],l5:['30 min','Średnie'],l6:['25 min','Średnie'],
    s1:['3 min','Bardzo łatwe'],s2:['3 min','Bardzo łatwe'],s3:['3 min','Bardzo łatwe'],s4:['4 min','Bardzo łatwe'],s5:['8 min','Łatwe'],
    d1:['25 min','Średnie'],d2:['20 min','Łatwe'],d3:['25 min','Łatwe'],d4:['30 min','Średnie'],d5:['25 min','Średnie'],d6:['25 min','Średnie']
  };

  function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]));}
  function renderCard(r){
    const [time,diff]=meta[r.id]||['—','—'];
    return `<article class="recipe-pro" data-id="${r.id}" data-cat="${r.cat}" data-name="${esc(r.name.toLowerCase())}" data-kcal="${r.kcal}">
      <div class="recipe-pro-main">
        <img class="recipe-pro-photo" src="${photo(r.id)}" alt="${esc(r.name)}" loading="lazy" decoding="async">
        <div class="recipe-pro-shade"></div>
        <div class="recipe-pro-copy">
          <span class="recipe-pro-cat">${catNames[r.cat]}</span>
          <h3>${esc(r.name)}</h3>
          <div class="recipe-pro-macro">${r.kcal} kcal · B ${r.p} g · T ${r.f} g · W ${r.c} g</div>
          <div class="recipe-pro-meta"><span>◷ ${time}</span><span>▥ ${diff}</span></div>
        </div>
        <button class="recipe-pro-open" type="button" aria-expanded="false" aria-label="Pokaż przepis na ${esc(r.name)}">→</button>
      </div>
      <div class="recipe-pro-detail" hidden>
        <div class="recipe-detail-head"><div><span class="recipe-detail-kicker">Przepis</span><h4>${esc(r.name)}</h4></div><button class="recipe-pro-close" type="button">Zwiń ×</button></div>
        <div class="recipe-detail-grid">
          <div><h5>Składniki</h5><ul>${r.ingredients.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
          <div><h5>Przygotowanie</h5><ol>${r.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div>
        </div>
      </div>
    </article>`;
  }

  const style=document.createElement('style');
  style.id='recipesProStyles';
  style.textContent=`
    #recipes .recipes{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:14px!important}
    .recipe-pro{border:1px solid rgba(255,255,255,.09);border-radius:22px;overflow:hidden;background:#0b1016;box-shadow:0 18px 50px rgba(0,0,0,.18);transition:transform .22s ease,border-color .22s ease}
    .recipe-pro:hover{transform:translateY(-2px);border-color:rgba(116,240,167,.22)}
    .recipe-pro-main{position:relative;min-height:255px;overflow:hidden;background:#0b1016}
    .recipe-pro-photo{position:absolute;inset:0 0 0 auto;width:64%;height:100%;object-fit:cover;object-position:center;transition:transform .35s ease,filter .35s ease;background:#10161d}
    .recipe-pro:hover .recipe-pro-photo{transform:scale(1.035);filter:saturate(1.05) contrast(1.03)}
    .recipe-pro-shade{position:absolute;inset:0;background:linear-gradient(90deg,#0b1016 0%,#0b1016 34%,rgba(11,16,22,.91) 48%,rgba(11,16,22,.35) 70%,rgba(11,16,22,.05) 100%),linear-gradient(0deg,rgba(5,8,12,.36),transparent 52%)}
    .recipe-pro-copy{position:relative;z-index:2;width:60%;min-height:255px;padding:23px 22px;display:flex;flex-direction:column;justify-content:center}
    .recipe-pro-cat{align-self:flex-start;padding:5px 9px;border:1px solid rgba(255,255,255,.11);border-radius:999px;color:#9ba7b2;font-size:.68rem;font-weight:700;background:rgba(14,22,30,.7);backdrop-filter:blur(8px)}
    .recipe-pro h3{font-size:1.38rem!important;line-height:1.08!important;letter-spacing:-.035em!important;margin:12px 0 11px!important;max-width:350px!important;color:#f5f7f9}
    .recipe-pro-macro{color:#74f0a7;font-size:.87rem;font-weight:900;letter-spacing:.01em}
    .recipe-pro-meta{display:flex;gap:18px;margin-top:17px;color:#aab4be;font-size:.78rem;font-weight:650}
    .recipe-pro-open{position:absolute;z-index:3;right:14px;bottom:14px;width:46px;height:46px;border-radius:50%;border:1px solid rgba(116,240,167,.52);background:rgba(8,15,20,.82);color:#fff;font-size:1.35rem;cursor:pointer;backdrop-filter:blur(8px);transition:transform .2s ease,background .2s ease}
    .recipe-pro-open:hover{transform:translateX(3px);background:rgba(116,240,167,.12)}
    .recipe-pro-detail{border-top:1px solid rgba(255,255,255,.08);padding:24px;background:linear-gradient(155deg,rgba(255,255,255,.025),rgba(255,255,255,.009))}
    .recipe-pro.open{grid-column:1/-1}
    .recipe-pro.open .recipe-pro-main{min-height:290px}
    .recipe-pro.open .recipe-pro-copy{min-height:290px;width:48%}
    .recipe-pro.open .recipe-pro-photo{width:60%}
    .recipe-detail-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:20px}
    .recipe-detail-kicker{display:block;color:#72dca0;text-transform:uppercase;letter-spacing:.12em;font-size:.66rem;font-weight:900;margin-bottom:4px}
    .recipe-detail-head h4{font-size:1.45rem;margin:0;letter-spacing:-.03em}
    .recipe-pro-close{border:1px solid rgba(255,255,255,.11);background:rgba(255,255,255,.03);color:#dce2e7;border-radius:999px;padding:8px 12px;cursor:pointer;font-weight:800}
    .recipe-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:30px}
    .recipe-detail-grid h5{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:#7f8b96;margin:0 0 10px}
    .recipe-detail-grid ul,.recipe-detail-grid ol{margin:0;padding-left:20px;color:#b8c1c9;line-height:1.72;font-size:.9rem}
    #recipes .filter{transition:all .18s ease!important}
    #recipes .filter.active{background:#f1f4f5!important;color:#0b0e12!important;box-shadow:none!important}
    .recipe-empty{grid-column:1/-1;border:1px dashed rgba(255,255,255,.12);border-radius:20px;padding:30px;text-align:center;color:#8e9aa8}
    @media(max-width:900px){#recipes .recipes{grid-template-columns:1fr!important}.recipe-pro.open{grid-column:auto}.recipe-pro-main{min-height:240px}.recipe-pro-copy{min-height:240px;width:64%}.recipe-pro-photo{width:62%}}
    @media(max-width:620px){.recipe-pro-main{min-height:330px}.recipe-pro-photo{inset:0 0 auto 0;width:100%!important;height:55%;object-position:center}.recipe-pro-shade{background:linear-gradient(0deg,#0b1016 0%,#0b1016 41%,rgba(11,16,22,.32) 73%,rgba(11,16,22,.06) 100%)}.recipe-pro-copy,.recipe-pro.open .recipe-pro-copy{width:100%;min-height:330px!important;padding:155px 18px 20px;justify-content:flex-end}.recipe-pro-open{right:12px;bottom:12px}.recipe-detail-grid{grid-template-columns:1fr}.recipe-pro.open .recipe-pro-main{min-height:330px}}
  `;
  document.head.appendChild(style);

  let activeCat='all',query='';
  function draw(){
    const items=data.filter(r=>(activeCat==='all'||r.cat===activeCat)&&(!query||r.name.toLowerCase().includes(query)));
    grid.innerHTML=items.length?items.map(renderCard).join(''):'<div class="recipe-empty">Brak przepisów dla wybranego filtra.</div>';
  }
  draw();

  root.querySelectorAll('.filter').forEach(btn=>{
    btn.onclick=e=>{
      e.preventDefault();
      activeCat=btn.dataset.cat||'all';
      root.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===btn));
      draw();
    };
  });

  const search=root.querySelector('input[type="search"], input[placeholder*="Szukaj"]');
  if(search){search.oninput=()=>{query=search.value.trim().toLowerCase();draw();};}

  const sort=root.querySelector('select');
  if(sort && !sort.dataset.recipeBound){
    sort.dataset.recipeBound='1';
    sort.onchange=()=>{
      const v=sort.value;
      if(v==='kcal-asc')data.sort((a,b)=>a.kcal-b.kcal);
      else if(v==='kcal-desc')data.sort((a,b)=>b.kcal-a.kcal);
      else if(v==='protein-desc')data.sort((a,b)=>b.p-a.p);
      draw();
    };
  }

  grid.addEventListener('click',e=>{
    const open=e.target.closest('.recipe-pro-open');
    const close=e.target.closest('.recipe-pro-close');
    if(!open&&!close)return;
    const card=e.target.closest('.recipe-pro');
    if(!card)return;
    const detail=card.querySelector('.recipe-pro-detail');
    const btn=card.querySelector('.recipe-pro-open');
    const shouldOpen=!!open && !card.classList.contains('open');
    card.classList.toggle('open',shouldOpen);
    detail.hidden=!shouldOpen;
    btn.setAttribute('aria-expanded',String(shouldOpen));
    btn.textContent=shouldOpen?'↓':'→';
    if(close)card.scrollIntoView({behavior:'smooth',block:'center'});
  });
})();