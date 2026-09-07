(function(){
  const week=document.getElementById('week');
  const grid=document.getElementById('weekGrid');
  const recipes=window.FORMA_DATA?.recipes||[];
  if(!week||!grid||!recipes.length)return;
  const byId=Object.fromEntries(recipes.map(r=>[r.id,r]));
  const catLabel={breakfast:'Śniadanie',lunch:'Obiad',snack:'Przekąska',dinner:'Kolacja'};
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  const style=document.createElement('style');
  style.id='weekRecipeStyles';
  style.textContent=`
    #week .week-meal{grid-template-columns:96px minmax(0,1fr) auto!important}
    #week .week-meal .week-recipe-btn{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.025);color:#d5dce2;border-radius:11px;padding:8px 10px;cursor:pointer;font-weight:800;font-size:.72rem;white-space:nowrap}
    #week .week-meal .week-recipe-btn:hover{border-color:rgba(116,240,167,.35);color:#74f0a7}
    .week-recipe-modal[hidden]{display:none!important}.week-recipe-modal{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:22px;background:rgba(2,5,8,.72);backdrop-filter:blur(12px)}
    .week-recipe-dialog{width:min(760px,100%);max-height:min(82vh,780px);overflow:auto;border:1px solid rgba(255,255,255,.11);border-radius:26px;background:#0b1016;box-shadow:0 40px 120px rgba(0,0,0,.5)}
    .week-recipe-top{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:24px 24px 18px;border-bottom:1px solid rgba(255,255,255,.08)}
    .week-recipe-kicker{display:block;color:#74f0a7;font-size:.68rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase;margin-bottom:5px}.week-recipe-top h3{font-size:1.75rem;margin:0;letter-spacing:-.04em}
    .week-recipe-x{border:1px solid rgba(255,255,255,.11);background:rgba(255,255,255,.03);color:#fff;border-radius:999px;width:38px;height:38px;cursor:pointer;font-size:1.05rem}
    .week-recipe-macros{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:18px 24px}.week-recipe-macros div{border:1px solid rgba(255,255,255,.075);background:rgba(255,255,255,.02);border-radius:15px;padding:12px}.week-recipe-macros span{display:block;color:#788591;font-size:.65rem;text-transform:uppercase;letter-spacing:.08em;font-weight:850}.week-recipe-macros strong{display:block;margin-top:3px;font-size:1.05rem}
    .week-recipe-content{display:grid;grid-template-columns:1fr 1fr;gap:28px;padding:4px 24px 26px}.week-recipe-content h4{margin:0 0 10px;font-size:.75rem;text-transform:uppercase;letter-spacing:.11em;color:#7e8a96}.week-recipe-content ul,.week-recipe-content ol{margin:0;padding-left:21px;color:#bbc4cc;line-height:1.75}
    @media(max-width:700px){#week .week-meal{grid-template-columns:1fr!important;gap:6px!important}#week .week-meal span{margin-top:8px}.week-recipe-btn{justify-self:start}.week-recipe-macros{grid-template-columns:1fr 1fr}.week-recipe-content{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const modal=document.createElement('div');
  modal.className='week-recipe-modal'; modal.hidden=true;
  modal.innerHTML='<div class="week-recipe-dialog" role="dialog" aria-modal="true"><div id="weekRecipeBody"></div></div>';
  document.body.appendChild(modal);
  const body=modal.querySelector('#weekRecipeBody');

  function showRecipe(id){
    const r=byId[id]; if(!r)return;
    body.innerHTML=`<div class="week-recipe-top"><div><span class="week-recipe-kicker">${catLabel[r.cat]||'Posiłek'}</span><h3>${esc(r.name)}</h3></div><button class="week-recipe-x" type="button" aria-label="Zamknij">×</button></div><div class="week-recipe-macros"><div><span>Kalorie</span><strong>${r.kcal} kcal</strong></div><div><span>Białko</span><strong>${r.p} g</strong></div><div><span>Tłuszcz</span><strong>${r.f} g</strong></div><div><span>Węgle</span><strong>${r.c} g</strong></div></div><div class="week-recipe-content"><div><h4>Ile czego użyć</h4><ul>${r.ingredients.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><h4>Jak przygotować</h4><ol>${r.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div></div>`;
    modal.hidden=false; document.body.style.overflow='hidden';
    body.querySelector('.week-recipe-x').onclick=closeModal;
  }
  function closeModal(){modal.hidden=true;document.body.style.overflow='';}
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeModal();});

  function enhance(){
    grid.querySelectorAll('.week-meal').forEach(label=>{
      if(label.querySelector('.week-recipe-btn'))return;
      const select=label.querySelector('select'); if(!select)return;
      const btn=document.createElement('button'); btn.type='button'; btn.className='week-recipe-btn'; btn.textContent='Przepis';
      btn.onclick=()=>showRecipe(select.value);
      label.appendChild(btn);
    });
  }
  enhance();
  new MutationObserver(enhance).observe(grid,{childList:true,subtree:true});
})();