(function(){
  const typeByName={
    'Proteinowa owsianka':'oats','Jajka + tosty + indyk':'eggs','Skyr crunch':'skyr','Tosty z serkiem wiejskim':'toast','Pancake bowl':'pancake',
    'Kurczak + ryż + warzywa':'chickenRice','Beef rice bowl':'beefRice','Kurczak + ziemniaki z airfryera':'chickenPotato','Makaron z kurczakiem':'chickenPasta','Łosoś + ziemniaki':'salmonPotato','Burrito wołowe':'burrito',
    'Skyr + banan + masło orzechowe':'skyrBanana','Serek wiejski + wafle':'cottageWafers','Shake + płatki':'shake','Skyr bowl z miodem':'skyrBerry','Tosty proteinowe':'proteinToast',
    'Quesadilla z kurczakiem':'quesadilla','Bowl z tuńczykiem i ryżem':'tunaRice','Jajka + ziemniaki':'eggsPotato','Makaron wołowy':'beefPasta','Wrapy z kurczakiem':'wraps','Łosoś + ryż':'salmonRice'
  };

  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const dot=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
  const berry=(x,y,c='#365d98')=>`${dot(x,y,11,c)}${dot(x-3,y-4,2,'#fff7')}`;
  const rice=(x,y)=>Array.from({length:22},(_,i)=>`<ellipse cx="${x+(i%6)*11+(i%2)*3}" cy="${y+Math.floor(i/6)*8}" rx="7" ry="4" fill="#f3ead7"/>`).join('');
  const greens=(x,y)=>Array.from({length:7},(_,i)=>`<circle cx="${x+(i%4)*18}" cy="${y+Math.floor(i/4)*18}" r="12" fill="${i%2?'#4a9b55':'#62bb63'}"/>`).join('');
  const potatoes=(x,y)=>Array.from({length:8},(_,i)=>`<path d="M${x+(i%4)*28} ${y+Math.floor(i/4)*24} l20 -8 l8 16 l-20 9z" fill="#d8973b" stroke="#f0bc65" stroke-width="2"/>`).join('');
  const meat=(x,y,color='#a55532')=>Array.from({length:5},(_,i)=>`<rect x="${x+i*25}" y="${y+(i%2)*9}" width="22" height="56" rx="11" fill="${color}" transform="rotate(${i%2?9:-7} ${x+i*25+11} ${y+28})"/>`).join('');
  const pasta=(x,y,color='#e2b24b')=>Array.from({length:8},(_,i)=>`<path d="M${x} ${y+i*11} C${x+34} ${y+i*2},${x+58} ${y+i*20},${x+92} ${y+i*9}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round"/>`).join('');
  const base=(inner,label)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 330"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#111a23"/><stop offset="1" stop-color="#080c11"/></linearGradient><radialGradient id="plate"><stop stop-color="#2b333d"/><stop offset="1" stop-color="#111820"/></radialGradient><filter id="sh"><feDropShadow dx="0" dy="16" stdDeviation="16" flood-opacity=".45"/></filter></defs><rect width="520" height="330" fill="url(#bg)"/><circle cx="426" cy="42" r="115" fill="#74f0a70d"/><circle cx="76" cy="300" r="150" fill="#8aa8ff0d"/><g filter="url(#sh)"><ellipse cx="270" cy="171" rx="177" ry="124" fill="url(#plate)" stroke="#ffffff18" stroke-width="3"/>${inner}</g><text x="22" y="306" fill="#ffffff55" font-family="Arial,sans-serif" font-size="13" font-weight="700">${esc(label)}</text></svg>`;

  function svgFor(name,type){
    let inner='';
    if(type==='oats') inner=`<ellipse cx="270" cy="173" rx="126" ry="86" fill="#d9c09b"/>${berry(230,140)}${berry(263,126,'#633f8a')}${berry(300,145,'#a33b4f')}<g fill="#f1cf69">${dot(208,194,18,'#f2cf68')}${dot(254,204,18,'#f2cf68')}${dot(304,194,18,'#f2cf68')}</g><path d="M323 127 q28 18 7 44 q-26 13-38-8 q0-24 31-36" fill="#b97b49"/>`;
    else if(type==='eggs') inner=`<ellipse cx="218" cy="177" rx="88" ry="62" fill="#f4c84b"/><path d="M150 159 q65-45 130 8" stroke="#fff1b0" stroke-width="9" fill="none"/><rect x="315" y="107" width="104" height="78" rx="8" fill="#bb7a43" transform="rotate(8 367 146)"/><rect x="316" y="206" width="116" height="20" rx="10" fill="#d9a18b" transform="rotate(-7 374 216)"/>`;
    else if(type==='skyr'||type==='skyrBanana'||type==='skyrBerry') inner=`<ellipse cx="270" cy="174" rx="128" ry="84" fill="#f3f1e9"/>${berry(220,139)}${berry(252,129,'#9b3c59')}${berry(300,143,'#375d98')}${dot(327,183,22,'#f0ce6a')}<path d="M178 190 q95 55 183 0" stroke="#c89e56" stroke-width="12" stroke-dasharray="9 7" fill="none"/>`;
    else if(type==='toast'||type==='proteinToast') inner=`<rect x="165" y="108" width="216" height="132" rx="28" fill="#b8763d"/><rect x="178" y="119" width="190" height="109" rx="24" fill="#e0b170"/><path d="M192 162 q70-55 158 0 v48 H192z" fill="#f4f2e8"/>${dot(222,143,11,'#d64735')}${dot(278,147,11,'#d64735')}${dot(329,142,11,'#d64735')}`;
    else if(type==='pancake') inner=`<g fill="#d9a04d"><ellipse cx="271" cy="212" rx="111" ry="35"/><ellipse cx="271" cy="190" rx="105" ry="34" fill="#e2ac58"/><ellipse cx="271" cy="168" rx="99" ry="32" fill="#edbb66"/></g><path d="M236 148 q38-26 70 4 q-22 20-70-4" fill="#b47a34"/>${berry(210,130)}${berry(322,131,'#9b3c59')}`;
    else if(type==='chickenRice') inner=`${rice(145,126)}${greens(333,117)}${meat(212,145,'#bc7040')}`;
    else if(type==='beefRice') inner=`${rice(135,126)}${greens(340,126)}${meat(212,148,'#75412e')}`;
    else if(type==='chickenPotato') inner=`${potatoes(135,145)}${greens(350,122)}${meat(215,132,'#bd7040')}`;
    else if(type==='chickenPasta') inner=`${pasta(150,126)}${meat(260,139,'#bd7040')}${greens(360,126)}`;
    else if(type==='beefPasta') inner=`${pasta(150,126)}${meat(260,139,'#75412e')}${greens(360,126)}`;
    else if(type==='salmonPotato') inner=`${potatoes(145,142)}<path d="M245 126 q95-25 128 40 q-28 59-130 28 q-22-28 2-68" fill="#e98768"/><path d="M265 139 q42 11 79 47" stroke="#ffd3c1" stroke-width="5"/>${greens(353,119)}`;
    else if(type==='salmonRice') inner=`${rice(145,130)}<path d="M250 122 q104-18 128 48 q-39 55-129 23 q-19-35 1-71" fill="#e98768"/><path d="M270 138 q41 13 76 43" stroke="#ffd3c1" stroke-width="5"/>${greens(364,124)}`;
    else if(type==='burrito'||type==='wraps') inner=`<g transform="rotate(-12 270 170)"><rect x="150" y="128" width="244" height="88" rx="44" fill="#dcb66d"/><path d="M178 142 q90 44 186 0" stroke="#ad7a3d" stroke-width="5" fill="none"/><path d="M178 198 q92-46 186 0" stroke="#ad7a3d" stroke-width="5" fill="none"/></g>${greens(362,120)}`;
    else if(type==='quesadilla') inner=`<path d="M156 212 L270 93 L385 212 Z" fill="#e4b95f" stroke="#ad7a3d" stroke-width="5"/><path d="M190 193 L270 113 L351 193 Z" fill="#d28d45"/><path d="M205 178 q65-34 132 0" stroke="#74a957" stroke-width="9"/>`;
    else if(type==='tunaRice') inner=`${rice(145,128)}<ellipse cx="287" cy="169" rx="72" ry="48" fill="#c8a58f"/>${greens(357,122)}${dot(324,198,25,'#87a85a')}`;
    else if(type==='eggsPotato') inner=`${potatoes(155,145)}<ellipse cx="310" cy="156" rx="62" ry="48" fill="#f4f0de"/><circle cx="310" cy="156" r="22" fill="#f1bf32"/>${greens(365,127)}`;
    else if(type==='cottageWafers') inner=`<ellipse cx="250" cy="170" rx="92" ry="66" fill="#f1efe5"/><g fill="#d8cfa8">${dot(340,138,27,'#d7c993')}${dot(370,173,27,'#d7c993')}${dot(340,206,27,'#d7c993')}</g>${dot(212,132,20,'#edcc61')}`;
    else if(type==='shake') inner=`<rect x="195" y="91" width="112" height="158" rx="28" fill="#d9d7c8"/><rect x="207" y="112" width="88" height="118" rx="18" fill="#cbb78e"/><ellipse cx="358" cy="174" rx="75" ry="54" fill="#e0d1a1"/><path d="M320 154 q42 30 77 0" stroke="#f6e6b4" stroke-width="8" fill="none"/>`;
    else inner=`${rice(145,130)}${greens(340,126)}${meat(220,145)}`;
    return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(base(inner,name));
  }

  function installStyles(){
    if(document.getElementById('recipePhotoStyles'))return;
    const s=document.createElement('style');
    s.id='recipePhotoStyles';
    s.textContent=`
      #recipeGrid .recipe.recipe-with-image{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(190px,36%);gap:0;padding:0!important;overflow:hidden;min-height:220px;align-items:stretch}
      #recipeGrid .recipe-copy{padding:24px 24px 22px;min-width:0;position:relative;z-index:2}
      #recipeGrid .recipe-photo-wrap{position:relative;min-height:100%;overflow:hidden;border-left:1px solid rgba(255,255,255,.07);background:#0a0f14}
      #recipeGrid .recipe-photo-wrap:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(9,13,18,.30),transparent 34%);pointer-events:none}
      #recipeGrid .recipe-photo{width:100%;height:100%;min-height:220px;display:block;object-fit:cover;transform:scale(1.01);transition:transform .35s ease,filter .35s ease}
      #recipeGrid .recipe:hover .recipe-photo{transform:scale(1.045);filter:saturate(1.08)}
      #recipeGrid .recipe details{margin-top:8px}
      #recipeGrid .recipe .macro{margin-top:16px}
      @media(max-width:760px){#recipeGrid .recipe.recipe-with-image{grid-template-columns:1fr}#recipeGrid .recipe-photo-wrap{order:-1;border-left:0;border-bottom:1px solid rgba(255,255,255,.07);height:190px;min-height:190px}#recipeGrid .recipe-photo{min-height:190px;height:190px}#recipeGrid .recipe-copy{padding:20px}}
    `;
    document.head.appendChild(s);
  }

  function apply(){
    installStyles();
    document.querySelectorAll('#recipeGrid .recipe').forEach(card=>{
      if(card.classList.contains('recipe-with-image'))return;
      const h3=card.querySelector('h3'); if(!h3)return;
      const name=h3.textContent.trim(),type=typeByName[name]; if(!type)return;
      const copy=document.createElement('div'); copy.className='recipe-copy';
      while(card.firstChild)copy.appendChild(card.firstChild);
      const photo=document.createElement('div'); photo.className='recipe-photo-wrap';
      const img=document.createElement('img'); img.className='recipe-photo'; img.src=svgFor(name,type); img.alt=name; img.loading='lazy'; img.decoding='async';
      photo.appendChild(img); card.append(copy,photo); card.classList.add('recipe-with-image');
    });
  }
  apply();
  const grid=document.getElementById('recipeGrid'); if(grid)new MutationObserver(apply).observe(grid,{childList:true});
})();