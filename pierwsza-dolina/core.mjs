export const SAVE_KEY='pierwsza-dolina-v1';
export const WORLD=180;
export const TYPES=[
 {id:'dog',name:'Dziki pies',lv:1,hp:65,atk:7,def:1,xp:24,gold:18,color:0x927563,x:25,z:45,n:12,range:7},
 {id:'wolf',name:'Szary wilk',lv:4,hp:125,atk:13,def:3,xp:48,gold:27,color:0x627681,x:53,z:32,n:12,range:16},
 {id:'boar',name:'Dzik',lv:7,hp:240,atk:21,def:7,xp:82,gold:40,color:0x614639,x:30,z:67,n:10,range:15},
 {id:'bear',name:'Niedźwiedź',lv:11,hp:440,atk:33,def:12,xp:145,gold:65,color:0x4c362d,x:73,z:75,n:9,range:14},
 {id:'bandit',name:'Bandyta',lv:15,hp:650,atk:48,def:17,xp:230,gold:90,color:0x923f3c,x:126,z:38,n:10,range:17},
 {id:'clan',name:'Wojownik klanu',lv:20,hp:960,atk:66,def:25,xp:360,gold:130,color:0x4b526c,x:131,z:116,n:10,range:18},
 {id:'stone',name:'Kamień zniszczenia',lv:10,hp:850,atk:0,def:10,xp:230,gold:180,color:0x8c4894,x:92,z:52,n:4,range:17},
 {id:'boss',name:'Wódz Doliny',lv:25,hp:5200,atk:90,def:33,xp:2000,gold:1200,color:0x983539,x:157,z:155,n:1,range:0}
];
export const QUESTS=[
 {name:'Pierwszy patrol',text:'Psy zagrażają wiosce. Pokonaj 5 dzikich psów.',type:'kill',target:'dog',need:5,xp:100,gold:100,npc:'guard'},
 {name:'Wilcze ścieżki',text:'Pokonaj 7 szarych wilków na wschodniej łące.',type:'kill',target:'wolf',need:7,xp:240,gold:180,npc:'guard'},
 {name:'Zioła dla zielarza',text:'Zbierz 4 zioła z łupów dzików. Zachowaj je w plecaku.',type:'item',target:'herb',need:4,xp:350,gold:220,npc:'herbal'},
 {name:'Sztuka kowalstwa',text:'Porozmawiaj z kowalem w wiosce.',type:'visit',target:'smith',need:1,xp:150,gold:200,npc:'guard'},
 {name:'Ostrze wojownika',text:'Ulepsz dowolną broń do +3.',type:'upgrade',target:'weapon',need:3,xp:400,gold:300,npc:'smith'},
 {name:'Leśny olbrzym',text:'Pokonaj 8 niedźwiedzi w lesie.',type:'kill',target:'bear',need:8,xp:700,gold:400,npc:'guard'},
 {name:'Pęknięcie ciemności',text:'Rozbij jeden kamień zniszczenia.',type:'kill',target:'stone',need:1,xp:600,gold:400,npc:'guard'},
 {name:'Rozbój na trakcie',text:'Pokonaj 10 bandytów za rzeką.',type:'kill',target:'bandit',need:10,xp:1100,gold:650,npc:'guard'},
 {name:'Zaopatrzenie straży',text:'Zbierz i dostarcz strażnikowi 12 rud z potworów.',type:'item',target:'ore',need:12,xp:900,gold:700,npc:'guard'},
 {name:'Droga mistrza',text:'Osiągnij poziom 15.',type:'level',need:15,xp:1000,gold:800,npc:'guard'},
 {name:'Zapomniany klan',text:'Pokonaj 12 wojowników klanu na południowym wschodzie.',type:'kill',target:'clan',need:12,xp:1800,gold:1000,npc:'guard'},
 {name:'Władca Pierwszej Doliny',text:'Pokonaj Wodza Doliny. Przygotuj ekwipunek i mikstury!',type:'kill',target:'boss',need:1,xp:3000,gold:2200,npc:'guard'}
];
export const ITEMS={hp:{name:'Mikstura życia',icon:'♥',price:25},mp:{name:'Mikstura energii',icon:'◆',price:20},ore:{name:'Ruda żelaza',icon:'⬡',price:12},herb:{name:'Zioło doliny',icon:'✿',price:15},scroll:{name:'Zwój ochronny',icon:'▤',price:300}};
export const SLOTS={weapon:'Broń',armor:'Zbroja',helmet:'Hełm',boots:'Buty',shield:'Tarcza',necklace:'Naszyjnik',bracelet:'Bransoleta'};
const WEAPONS=['Miecz podróżnika','Żelazne ostrze','Szabla doliny','Miecz tygrysa','Smocze ostrze'];
const ARMORS=['Szata podróżnika','Skórzana zbroja','Pancerz łuskowy','Zbroja wojownika','Smoczy pancerz'];
export const CHANCES=[1,.95,.9,.8,.7,.6,.45,.3,.2];
let serial=0;
export function gear(slot='weapon',tier=0,plus=0){return {uid:`${Date.now()}-${serial++}`,slot,tier,plus,name:slot==='weapon'?WEAPONS[tier]:slot==='armor'?ARMORS[tier]:`${SLOTS[slot]} ${['podróżnika','żelazna','doliny','tygrysa','smocza'][tier]}`,lv:[1,5,10,15,20][tier],icon:{weapon:'⚔',armor:'♜',helmet:'♛',boots:'♟',shield:'◈',necklace:'◇',bracelet:'◎'}[slot]};}
export function gearValue(g){return Math.round((g.slot==='weapon'?14+g.tier*13:g.slot==='armor'?5+g.tier*9:2+g.tier*3)*(1+g.plus*.2)+g.plus*2);}
export function fresh(){return {version:1,name:'Wojownik',x:17,z:12,lv:1,xp:0,gold:120,hp:200,mp:100,points:0,stats:{str:0,vit:0,dex:0,int:0},bag:[{id:'hp',qty:8},{id:'mp',qty:5},{id:'ore',qty:5}],equipped:{weapon:gear(),armor:gear('armor'),helmet:null,boots:null,shield:null,necklace:null,bracelet:null},quest:{index:0,active:false,count:0},kills:{},visits:{},maxWeaponPlus:0,sound:true};}
export function stats(s,buffed=false){const eq=Object.values(s.equipped).filter(Boolean);return {hp:200+(s.lv-1)*22+s.stats.vit*18,mp:100+(s.lv-1)*8+s.stats.int*12,atk:Math.round((10+s.lv*3+s.stats.str*3+gearValue(s.equipped.weapon))*(buffed?1.35:1)),def:3+s.lv+s.stats.vit+eq.filter(g=>g.slot!=='weapon').reduce((a,g)=>a+gearValue(g),0),crit:.06+s.stats.dex*.006,dodge:Math.min(.25,s.stats.dex*.004)};}
export const xpNeed=lv=>Math.round(80*Math.pow(lv,1.65));
export const quantity=(s,id)=>s.bag.filter(i=>i.id===id).reduce((n,i)=>n+i.qty,0);
export function addItem(s,i){if(i.id){const old=s.bag.find(x=>x.id===i.id);if(old){old.qty+=i.qty;return true;}}if(s.bag.length>=40)return false;s.bag.push({...i});return true;}
export function consume(s,id,n=1){if(quantity(s,id)<n)return false;for(let j=s.bag.length-1;j>=0&&n>0;j--){const i=s.bag[j];if(i.id===id){const take=Math.min(n,i.qty);i.qty-=take;n-=take;if(!i.qty)s.bag.splice(j,1);}}return true;}
export function xp(s,n){s.xp+=n;let levels=0;while(s.lv<30&&s.xp>=xpNeed(s.lv)){s.xp-=xpNeed(s.lv++);s.points+=3;levels++;}if(s.lv===30)s.xp=Math.min(s.xp,xpNeed(30));if(levels){s.hp=stats(s).hp;s.mp=stats(s).mp;}return levels;}
export function progress(s){const q=QUESTS[s.quest.index];if(!q)return 0;switch(q.type){case'kill':return s.quest.count;case'item':return quantity(s,q.target);case'visit':return s.visits[q.target]?1:0;case'upgrade':return s.maxWeaponPlus;case'level':return s.lv;}return 0;}
export function claim(s){const q=QUESTS[s.quest.index];if(!q||!s.quest.active||progress(s)<q.need)return false;if(q.type==='item')consume(s,q.target,q.need);s.gold+=q.gold;xp(s,q.xp);s.quest={index:s.quest.index+1,active:false,count:0};return true;}
export function kill(s,type){s.kills[type]=(s.kills[type]||0)+1;const q=QUESTS[s.quest.index];if(s.quest.active&&q?.type==='kill'&&q.target===type)s.quest.count++;}
export function equip(s,index){const g=s.bag[index];if(!g?.slot||g.lv>s.lv)return false;const prev=s.equipped[g.slot];s.bag.splice(index,1);if(prev)s.bag.push(prev);s.equipped[g.slot]=g;s.maxWeaponPlus=Math.max(s.maxWeaponPlus,g.slot==='weapon'?g.plus:0);return true;}
export function upgradeCost(g){return {gold:50*(g.plus+1)*(g.tier+1),ore:1+Math.floor(g.plus/2),herb:g.plus>=4?g.plus-3:0};}
export function upgrade(s,g,protect=false,rng=Math.random){if(!g||!['weapon','armor'].includes(g.slot)||g.plus>=9)return {ok:false,reason:'Tego przedmiotu nie można ulepszyć.'};const c=upgradeCost(g);if(s.gold<c.gold||quantity(s,'ore')<c.ore||quantity(s,'herb')<c.herb||(protect&&quantity(s,'scroll')<1))return {ok:false,reason:'Brakuje monet lub materiałów.'};s.gold-=c.gold;consume(s,'ore',c.ore);consume(s,'herb',c.herb);if(protect)consume(s,'scroll');const old=g.plus,success=rng()<CHANCES[old];if(success)g.plus++;else if(old>=4&&!protect)g.plus--;if(g.slot==='weapon')s.maxWeaponPlus=Math.max(s.maxWeaponPlus,g.plus);return {ok:true,success,old,plus:g.plus};}
export function potion(s,id){const st=stats(s),key=id==='hp'?'hp':'mp';if(s[key]>=st[key])return false;if(!consume(s,id))return false;s[key]=Math.min(st[key],s[key]+(id==='hp'?130:85));return true;}
export function sell(s,index){const i=s.bag[index];if(!i)return false;const value=i.id?ITEMS[i.id].price:45*(i.tier+1)*(i.plus+1);s.gold+=Math.max(1,Math.floor(value*.4));if(i.id&&i.qty>1)i.qty--;else s.bag.splice(index,1);return true;}
export function loadSave(text){try{const s=JSON.parse(text);if(s.version!==1||!Number.isInteger(s.lv)||s.lv<1||s.lv>30||!Array.isArray(s.bag)||s.bag.length>40||!s.equipped?.weapon||!s.equipped?.armor||!s.stats||!s.quest) return null;for(const k of ['x','z','hp','mp','gold','xp','points'])if(!Number.isFinite(s[k])||s[k]<0)return null;for(const v of Object.values(s.stats))if(!Number.isFinite(v)||v<0)return null;const st=stats(s);s.hp=Math.min(s.hp,st.hp);s.mp=Math.min(s.mp,st.mp);return s;}catch{return null;}}
// Shared collision and grid pathfinding used by player and chasing creatures.
export class Terrain{
 constructor(){this.blocks=[];}
 blocked(x,z,r=.55){if(x<1+r||z<1+r||x>WORLD-1-r||z>WORLD-1-r)return true;if(x>96-r&&x<105+r&&!((z>26+r&&z<38-r)||(z>108+r&&z<120-r)))return true;return this.blocks.some(b=>Math.abs(x-b.x)<b.w/2+r&&Math.abs(z-b.z)<b.d/2+r);}
 path(x,z,tx,tz){const step=2,key=(a,b)=>`${a},${b}`,sx=Math.round(x/step),sz=Math.round(z/step),ex=Math.round(tx/step),ez=Math.round(tz/step);if(this.blocked(tx,tz))return [];const open=[{x:sx,z:sz,g:0,f:0}],seen=new Map([[key(sx,sz),0]]),parent=new Map();let end=null;for(let n=0;n<6500&&open.length;n++){open.sort((a,b)=>a.f-b.f);const c=open.shift();if(Math.abs(c.x-ex)+Math.abs(c.z-ez)<=1){end=c;break;}for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){const nx=c.x+dx,nz=c.z+dz;if(this.blocked(nx*step,nz*step,.65)||(dx&&dz&&(this.blocked(c.x*step,nz*step,.65)||this.blocked(nx*step,c.z*step,.65))))continue;const g=c.g+(dx&&dz?1.414:1),k=key(nx,nz);if(g>=(seen.get(k)??Infinity))continue;seen.set(k,g);parent.set(k,c);open.push({x:nx,z:nz,g,f:g+Math.hypot(nx-ex,nz-ez)});}}
 if(!end)return [];const points=[{x:tx,z:tz}];while(end&&!(end.x===sx&&end.z===sz)){points.unshift({x:end.x*step,z:end.z*step});end=parent.get(key(end.x,end.z));}return points;}
}
