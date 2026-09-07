(function(){
  const root=document.getElementById('recipes');
  const grid=document.getElementById('recipeGrid');
  const data=window.FORMA_DATA?.recipes||[];
  if(!root||!grid||!data.length)return;

  const catNames={breakfast:'Śniadanie',lunch:'Obiad',snack:'Przekąska',dinner:'Kolacja'};
  const photo={
    b1:'https://loremflickr.com/900/650/oatmeal,banana,blueberries?lock=101',
    b2:'https://loremflickr.com/900/650/scrambled-eggs,toast,turkey?lock=102',
    b3:'https://loremflickr.com/900/650/yogurt,granola,berries?lock=103',
    b4:'https://loremflickr.com/900/650/cottage-cheese,toast,tomatoes?lock=104',
    b5:'https://loremflickr.com/900/650/pancakes,banana,berries?lock=105',
    l1:'https://loremflickr.com/900/650/grilled-chicken,rice,vegetables?lock=106',
    l2:'https://loremflickr.com/900/650/beef,rice,bowl,vegetables?lock=107',
    l3:'https://loremflickr.com/900/650/chicken,roasted-potatoes,salad?lock=108',
    l4:'https://loremflickr.com/900/650/chicken,pasta,vegetables?lock=109',
    l5:'https://loremflickr.com/900/650/salmon,potatoes,vegetables?lock=110',
    l6:'https://loremflickr.com/900/650/beef,burrito,rice?lock=111',
    s1:'https://loremflickr.com/900/650/yogurt,banana,peanut-butter?lock=112',
    s2:'https://loremflickr.com/900/650/cottage-cheese,rice-cakes,banana?lock=113',
    s3:'https://loremflickr.com/900/650/protein-shake,cereal?lock=114',
    s4:'https://loremflickr.com/900/650/yogurt,berries,honey?lock=115',
    s5:'https://loremflickr.com/900/650/toast,cottage-cheese,turkey?lock=116',
    d1:'https://loremflickr.com/900/650/chicken,quesadilla?lock=117',
    d2:'https://loremflickr.com/900/650/tuna,rice,bowl,avocado?lock=118',
    d3:'https://loremflickr.com/900/650/eggs,potatoes,vegetables?lock=119',
    d4:'https://loremflickr.com/900/650/beef,pasta?lock=120',
    d5:'https://loremflickr.com/900/650/chicken,wraps?lock=121',
    d6:'https://loremflickr.com/900/650/salmon,rice,vegetables?lock=122'
  };
  const meta={
    b1:['10 min','Łatwe'],b2:['15 min','Łatwe'],b3:['5 min','Bardzo łatwe'],b4:['10 min','Łatwe'],b5:['20 min','Średnie'],
    l1:['30 min','Średnie'],l2:['30 min','Średnie'],l3:['35 min','Łatwe'],l4:['30 min','Średnie'],l5:['30 min','Średnie'],l6:['25 min','Średnie'],
    s1:['3 min','Bardzo łatwe'],s2:['3 min','Bardzo łatwe'],s3:['3 min','Bardzo łatwe'],s4:['4 min','Bardzo łatwe'],s5:['8 min','Łatwe'],
    d1:['25 min','Średnie'],d2:['20 min','Łatwe'],d3:['25 min','Łatwe'],d4:['30 min','Średnie'],d5:['25 min','Średnie'],d6:['25 min','Średnie']
  };
  const originalOrder=new Map(data.map((r,i)=>[r.id,i]));
  const esc=(s='')=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function renderCard(r){
    const [time,diff]=meta[r.id]||['—','—'];
    return `<article class="recipe-pro" data-id="${r.id}" data-cat="${r.cat}" data-name="${esc(r.name.toLowerCase())}" data-kcal="${r.kcal}">
      <div class="recipe-pro-main">
        <div class="recipe-photo-box"><img class="recipe-pro-photo" src="${photo[r.id]}" alt="${esc(r.name)}" loading="lazy" decoding="async"></div>
        <div class="recipe-pro-copy">
          <span class="recipe-pro-cat">${catNames[r.cat]}</span>
          <h3>${esc(r.name)}</h3>
          <div class="recipe-macro-grid">
            <div><span class="macro-icon kcal">●</span><strong>${r.kcal}</strong><small>kcal</small></div>
            <div><span class="macro-icon protein">●</span><strong>${r.p} g</strong><small>białko</small></div>
            <div><span class="macro-icon fat">●</span><strong>${r.f} g</strong><small>tłuszcze</small></div>
            <div><span class="macro-icon carbs">●</span><strong>${r.c} g</strong><small>węglowodany</small></div>
          </div>
          <div class="recipe-pro-meta"><span>◷ ${time}</span><span>▥ ${diff}</span></div>
          <button class="recipe-pro-open" type="button" aria-expanded="false">Zobacz przepis <span>→</span></button>
        </div>
      </div>
      <div class="recipe-pro-detail" hidden>
        <div class="recipe-detail-head"><div><span class="recipe-detail-kicker">Przepis</span><h4>${esc(r.name)}</h4></div><button class="recipe-pro-close" type="button">Zwiń ×</button></div>
        <div class="recipe-detail-summary"><b>${r.kcal} kcal</b><span>B ${r.p} g</span><span>T ${r.f} g</span><span>W ${r.c} g</span></div>
        <div class="recipe-detail-grid"><div><h5>Składniki — dokładne ilości</h5><ul>${r.ingredients.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><h5>Przygotowanie krok po kroku</h5><ol>${r.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div></div>
      </div>
    </article>`;
  }

  let style=document.getElementById('recipesProStyles');
  if(!style){style=document.createElement('style');style.id='recipesProStyles';document.head.appendChild(style);}
  style.textContent=`
    #recipes .recipes{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:14px!important}
    .recipe-pro{border:1px solid rgba(255,255,255,.095);border-radius:20px;overflow:hidden;background:#0b1016;box-shadow:0 16px 44px rgba(0,0,0,.16);transition:transform .2s ease,border-color .2s ease}
    .recipe-pro:hover{transform:translateY(-2px);border-color:rgba(116,240,167,.23)}
    .recipe-pro-main{display:grid;grid-template-columns:38% 62%;min-height:238px;overflow:hidden}
    .recipe-photo-box{position:relative;overflow:hidden;min-height:238px;background:#10161d}
    .recipe-photo-box:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent 67%,rgba(11,16,22,.13));pointer-events:none}
    .recipe-pro-photo{width:100%;height:100%;min-height:238px;object-fit:cover;display:block;transition:transform .35s ease,filter .35s ease}
    .recipe-pro:hover .recipe-pro-photo{transform:scale(1.035);filter:saturate(1.07) contrast(1.03)}
    .recipe-pro-copy{padding:19px 19px 16px;min-width:0;display:flex;flex-direction:column}
    .recipe-pro-cat{align-self:flex-start;padding:4px 9px;border:1px solid rgba(255,255,255,.09);border-radius:999px;background:rgba(255,255,255,.035);color:#929eaa;font-size:.66rem;font-weight:750}
    .recipe-pro h3{font-size:1.2rem!important;line-height:1.12!important;letter-spacing:-.035em!important;margin:10px 0 12px!important;color:#f4f6f8!important;max-width:none!important}
    .recipe-macro-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;padding:11px 0 12px;border-top:1px solid rgba(255,255,255,.065);border-bottom:1px solid rgba(255,255,255,.065)}
    .recipe-macro-grid>div{display:grid;grid-template-columns:auto 1fr;column-gap:5px;align-items:center;min-width:0}
    .macro-icon{grid-row:1/3;font-size:.58rem}.macro-icon.kcal{color:#ff9f35}.macro-icon.protein{color:#56efb1}.macro-icon.fat{color:#ffc83d}.macro-icon.carbs{color:#74f0a7}
    .recipe-macro-grid strong{font-size:.76rem;white-space:nowrap;color:#f5f7f8}.recipe-macro-grid small{font-size:.56rem;color:#77838e;white-space:nowrap}
    .recipe-pro-meta{display:flex;gap:18px;margin:10px 0;color:#9aa5af;font-size:.7rem;font-weight:650}
    .recipe-pro-open{margin-top:auto;width:100%;display:flex;justify-content:center;align-items:center;gap:12px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.025);color:#f1f4f6;border-radius:11px;padding:9px 12px;cursor:pointer;font-weight:800;font-size:.72rem;transition:background .18s ease,border-color .18s ease,color .18s ease}
    .recipe-pro-open:hover{border-color:rgba(116,240,167,.35);background:rgba(116,240,167,.06);color:#8df2b1}.recipe-pro-open span{font-size:.95rem}
    .recipe-pro-detail{border-top:1px solid rgba(255,255,255,.08);padding:24px;background:linear-gradient(155deg,rgba(255,255,255,.025),rgba(255,255,255,.009))}
    .recipe-pro.open{grid-column:1/-1}.recipe-pro.open .recipe-pro-main{grid-template-columns:36% 64%;min-height:270px}.recipe-pro.open .recipe-photo-box,.recipe-pro.open .recipe-pro-photo{min-height:270px}
    .recipe-detail-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:15px}.recipe-detail-kicker{display:block;color:#74f0a7;text-transform:uppercase;letter-spacing:.12em;font-size:.65rem;font-weight:900;margin-bottom:4px}.recipe-detail-head h4{font-size:1.45rem;margin:0;letter-spacing:-.03em}
    .recipe-pro-close{border:1px solid rgba(255,255,255,.11);background:rgba(255,255,255,.03);color:#dce2e7;border-radius:999px;padding:8px 12px;cursor:pointer;font-weight:800}.recipe-pro-close:hover{color:#74f0a7;border-color:rgba(116,240,167,.32)}
    .recipe-detail-summary{display:flex;gap:15px;flex-wrap:wrap;padding:11px 13px;margin-bottom:19px;border:1px solid rgba(116,240,167,.12);border-radius:13px;background:rgba(116,240,167,.035);font-size:.8rem;color:#a9b5bf}.recipe-detail-summary b{color:#74f0a7}
    .recipe-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:30px}.recipe-detail-grid h5{font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:#7f8b96;margin:0 0 10px}.recipe-detail-grid ul,.recipe-detail-grid ol{margin:0;padding-left:20px;color:#b8c1c9;line-height:1.72;font-size:.9rem}
    #recipes .filter.active{background:#74f0a7!important;color:#07100b!important;border-color:#74f0a7!important}.recipe-empty{grid-column:1/-1;border:1px dashed rgba(255,255,255,.12);border-radius:20px;padding:30px;text-align:center;color:#8e9aa8}
    @media(max-width:980px){#recipes .recipes{grid-template-columns:1fr!important}.recipe-pro.open{grid-column:auto}}
    @media(max-width:620px){.recipe-pro-main,.recipe-pro.open .recipe-pro-main{grid-template-columns:1fr}.recipe-photo-box,.recipe-pro.open .recipe-photo-box{height:210px;min-height:210px}.recipe-pro-photo,.recipe-pro.open .recipe-pro-photo{height:210px;min-height:210px}.recipe-pro-copy{padding:17px}.recipe-macro-grid{grid-template-columns:repeat(2,1fr);row-gap:9px}.recipe-detail-grid{grid-template-columns:1fr}}
  `;

  let activeCat='all',query='',sortMode='default';
  function currentItems(){
    const items=data.filter(r=>(activeCat==='all'||r.cat===activeCat)&&(!query||r.name.toLowerCase().includes(query)));
    return [...items].sort((a,b)=>sortMode==='kcal-asc'?a.kcal-b.kcal:sortMode==='kcal-desc'?b.kcal-a.kcal:sortMode==='protein-desc'?b.p-a.p:(originalOrder.get(a.id)-originalOrder.get(b.id)));
  }
  function draw(){const items=currentItems();grid.innerHTML=items.length?items.map(renderCard).join(''):'<div class="recipe-empty">Brak przepisów dla wybranego filtra.</div>';}
  draw();

  root.querySelectorAll('.filter').forEach(btn=>{
    btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();activeCat=btn.dataset.cat||'all';root.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===btn));draw();},true);
  });
  const search=root.querySelector('input[type="search"], input[placeholder*="Szukaj"]');if(search)search.addEventListener('input',()=>{query=search.value.trim().toLowerCase();draw();});
  const sort=root.querySelector('select');if(sort)sort.addEventListener('change',()=>{sortMode=sort.value||'default';draw();});

  grid.addEventListener('click',e=>{
    const open=e.target.closest('.recipe-pro-open'),close=e.target.closest('.recipe-pro-close');if(!open&&!close)return;
    const card=e.target.closest('.recipe-pro');if(!card)return;const detail=card.querySelector('.recipe-pro-detail'),btn=card.querySelector('.recipe-pro-open');
    const shouldOpen=open?!card.classList.contains('open'):false;
    card.classList.toggle('open',shouldOpen);detail.hidden=!shouldOpen;btn.setAttribute('aria-expanded',String(shouldOpen));btn.innerHTML=shouldOpen?'Ukryj przepis <span>↑</span>':'Zobacz przepis <span>→</span>';
    if(close||!shouldOpen)card.scrollIntoView({behavior:'smooth',block:'center'});
  });
})();