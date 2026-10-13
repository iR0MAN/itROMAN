import * as T from './vendor/three.module.min.js';
import {TYPES,WORLD,Terrain} from './core.mjs';
export {T};
const mats=new Map();
export const mat=(color,extra={})=>{const key=color+JSON.stringify(extra);if(!mats.has(key))mats.set(key,new T.MeshStandardMaterial({color,roughness:.9,...extra}));return mats.get(key);};
const boxG=new T.BoxGeometry(1,1,1),sphereG=new T.IcosahedronGeometry(1,1),coneG=new T.ConeGeometry(1,1,7),cylG=new T.CylinderGeometry(1,1,1,8);
export function piece(parent,geo,color,x,y,z,sx,sy,sz,extra={}){const m=new T.Mesh(geo,mat(color,extra));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
export function humanoid(color=0x6a7b6e,scale=1){const g=new T.Group();const body=piece(g,boxG,color,0,1.35,0,.85,1,.5);piece(g,boxG,0xd4b49a,0,2.15,0,.5,.52,.5);piece(g,boxG,0x302b28,0,2.45,0,.53,.15,.53);piece(g,boxG,0x342e23,0,1,0,1,.13,.6);const arms=[],legs=[];for(const s of [-1,1]){const a=new T.Group();a.position.set(s*.57,1.75,0);piece(a,boxG,color,0,-.35,0,.26,.8,.28);piece(a,boxG,0xd4b49a,0,-.8,0,.23,.2,.24);g.add(a);arms.push(a);const l=new T.Group();l.position.set(s*.23,.92,0);piece(l,boxG,0x303b39,0,-.4,0,.31,.85,.34);piece(l,boxG,0x242928,0,-.84,.11,.36,.18,.6);g.add(l);legs.push(l);}
 const sword=new T.Group();sword.position.set(0,-.9,.12);piece(sword,boxG,0xd6d9ca,0,0,.65,.12,.09,1.25);piece(sword,boxG,0xb29956,0,0,.06,.42,.16,.1);arms[1].add(sword);g.scale.setScalar(scale);g.userData={arms,legs,sword,body};return g;}
function beast(type){if(['bandit','clan','boss'].includes(type.id))return humanoid(type.color,type.id==='boss'?2:1.05);const g=new T.Group();if(type.id==='stone'){piece(g,sphereG,type.color,0,1.6,0,1.2,2,1.2,{emissive:0x441e4b,emissiveIntensity:.65});for(let i=0;i<4;i++)piece(g,coneG,0xc393cc,Math.cos(i*2)*.65,1.6,Math.sin(i*2)*.65,.35,2,.35);return g;}const scale=type.id==='bear'?1.7:type.id==='boar'?1.3:1;piece(g,boxG,type.color,0,.85,0,.65,.7,1.4);piece(g,boxG,type.color,0,1.12,.85,.55,.55,.6);piece(g,boxG,0x2e302e,0,1.08,1.16,.31,.25,.26);for(const s of [-1,1]){piece(g,coneG,type.color,s*.2,1.5,.77,.19,.35,.19);piece(g,boxG,0xc9cc93,s*.2,1.23,1.1,.06,.07,.04);}const legs=[];for(const x of [-.25,.25])for(const z of [-.48,.5]){const l=piece(g,boxG,type.color,x,.35,z,.19,.7,.21);legs.push(l);}const tail=piece(g,coneG,type.color,0,1,-.92,.16,.6,.16);tail.rotation.x=-1;g.scale.setScalar(scale);g.userData={legs,beast:true};return g;}
export class World{
 constructor(canvas){this.renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));this.renderer.shadowMap.enabled=!matchMedia('(pointer:coarse)').matches;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.setClearColor(0x9dbbb2);this.scene=new T.Scene();this.scene.background=new T.Color(0x9dbbb2);this.scene.fog=new T.Fog(0x9dbbb2,50,115);this.scene.add(new T.HemisphereLight(0xd9eee7,0x486343,2.3));const sun=new T.DirectionalLight(0xffebcb,2.8);sun.position.set(-30,65,20);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-45;sun.shadow.camera.right=45;sun.shadow.camera.top=45;sun.shadow.camera.bottom=-45;sun.shadow.bias=-.001;this.scene.add(sun);this.sun=sun;this.scene.add(sun.target);this.camera=new T.PerspectiveCamera(45,1,.1,240);this.zoom=26;this.terrain=new Terrain();this.mobs=[];this.npcs=[];this.pickables=[];this.effects=[];this.player=humanoid(0x647567);this.scene.add(this.player);this.ray=new T.Raycaster();this.pointer=new T.Vector2();this.build();this.resize();}
 resize(){this.renderer.setSize(innerWidth,innerHeight,false);this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();}
 build(){const terrain=this.terrain,scene=this.scene;let seed=130;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};const ground=piece(scene,boxG,0x718b54,WORLD/2,-.25,WORLD/2,WORLD,.5,WORLD);ground.userData.ground=true;this.ground=ground;
 const patches=new T.InstancedMesh(new T.PlaneGeometry(1,1),mat(0x829b61),450);for(let i=0;i<450;i++){const m=new T.Matrix4().compose(new T.Vector3(rand()*WORLD,.025,rand()*WORLD),new T.Quaternion().setFromEuler(new T.Euler(-Math.PI/2,0,rand()*6.28)),new T.Vector3(2+rand()*6,2+rand()*6,1));patches.setMatrixAt(i,m);}scene.add(patches);
 const road=(x,z,w,d)=>piece(scene,boxG,0xb2a17a,x,.04,z,w,.06,d);road(18,18,28,26);road(67,32,100,5);road(20,55,5,70);road(124,78,5,94);road(103,114,48,6);road(142,140,5,50);
 const river=piece(scene,boxG,0x649d9a,100.5,.05,90,9,.12,180,{metalness:.15,roughness:.35});river.userData.water=true;for(const z of [32,114]){piece(scene,boxG,0x8b7250,100.5,.22,z,12,.35,12);for(const x of [96,105])piece(scene,boxG,0x493e2d,x,1,z,.25,1.4,12);}
 const house=(x,z,w,d)=>{const g=new T.Group();g.position.set(x,0,z);piece(g,boxG,0xd0ba95,0,2.1,0,w,4.2,d);piece(g,boxG,0x594b37,0,.25,0,w+.2,.5,d+.2);const roof=piece(g,coneG,0x485b52,0,5.25,0,w*.82,2.6,d*.82);roof.rotation.y=Math.PI/4;piece(g,boxG,0x62503b,0,1.2,d/2+.02,1.2,2.4,.1);for(const s of [-1,1])piece(g,boxG,0x3f615b,s*w*.28,2.3,d/2+.04,.8,.9,.11);scene.add(g);terrain.blocks.push({x,z,w:w+.3,d:d+.3});};house(6,7,6,7);house(29,7,7,7);house(6,24,6,7);house(31,24,7,7);
 // Oriental gateway, lanterns and forge.
 for(const z of [35,2]){for(const x of [14,22])piece(scene,boxG,0x794b37,x,2.5,z,.7,5,.7);piece(scene,boxG,0x493e32,18,5,z,11,.5,1.4);piece(scene,boxG,0x875d45,18,4.1,z,9,.3,.6);}
 for(const [x,z]of [[12,13],[24,15],[12,25],[24,27]]){piece(scene,cylG,0x493e2b,x,1.6,z,.12,3.2,.12);piece(scene,boxG,0xe6ae65,x,3.2,z,.7,.8,.7,{emissive:0xd29342,emissiveIntensity:.4});piece(scene,coneG,0x414b3a,x,3.8,z,.6,.35,.6);}
 piece(scene,boxG,0x4e4b45,25,1,21,1.4,.5,.7);piece(scene,cylG,0x5f6054,25,.55,21,.4,.8,.4);piece(scene,boxG,0xbb682d,28,.4,20,1,.8,1,{emissive:0xd76019,emissiveIntensity:.9});
 for(let i=0;i<230;i++){const x=rand()*WORLD,z=rand()*WORLD;if((x<39&&z<40)||Math.abs(x-100.5)<12||Math.abs(z-32)<6||Math.abs(z-114)<6||Math.abs(x-20)<5||Math.abs(x-124)<5||Math.abs(x-142)<5||TYPES.some(t=>Math.hypot(x-t.x,z-t.z)<t.range*.8+3))continue;const s=.8+rand()*1.3;const g=new T.Group();g.position.set(x,0,z);piece(g,cylG,0x68563c,0,1.3*s,0,.2*s,2.6*s,.2*s);for(let j=0;j<3;j++)piece(g,coneG,[0x3d6546,0x4e7751,0x5a8155][j],0,(2+j*.7)*s,0,(1.6-j*.25)*s,2.1*s,(1.6-j*.25)*s);scene.add(g);terrain.blocks.push({x,z,w:s*1.4,d:s*1.4});}
 for(let i=0;i<45;i++){const x=rand()*180,z=rand()*180;if((x<40&&z<40)||Math.abs(x-100)<13||Math.abs(z-32)<7||Math.abs(z-114)<7||TYPES.some(t=>Math.hypot(x-t.x,z-t.z)<5))continue;const s=1+rand()*1.5;piece(scene,sphereG,0x7c8377,x,s*.45,z,s,s*.8,s);terrain.blocks.push({x,z,w:s*1.6,d:s*1.6});}
 const defs=[['guard','Strażnik Han',18,22,0x456477],['smith','Kowal Ryo',25,18,0x866049],['merchant','Handlarka Mei',10,16,0x6c597b],['herbal','Zielarz Lin',23,10,0x63815a]];for(const [id,name,x,z,color]of defs){const mesh=humanoid(color);mesh.position.set(x,0,z);scene.add(mesh);const npc={id,name,x,z,mesh};mesh.traverse(m=>m.userData.entity=npc);this.npcs.push(npc);this.pickables.push(mesh);}
 for(const type of TYPES)for(let i=0;i<type.n;i++){let x,z;for(let j=0;j<50;j++){x=type.x+(rand()-.5)*type.range*2;z=type.z+(rand()-.5)*type.range*2;if(!terrain.blocked(x,z,1.1))break;}const mesh=beast(type);mesh.position.set(x,0,z);scene.add(mesh);const mob={id:`${type.id}-${i}`,type,x,z,homeX:x,homeZ:z,hp:type.hp,alive:true,respawn:0,aggro:false,nextHit:0,path:[],repath:0,mesh};mesh.traverse(m=>m.userData.entity=mob);this.mobs.push(mob);this.pickables.push(mesh);}
 const ring=new T.Mesh(new T.RingGeometry(.8,1,32),new T.MeshBasicMaterial({color:0xe9c978,side:T.DoubleSide,transparent:true,opacity:.8}));ring.rotation.x=-Math.PI/2;ring.position.y=.1;scene.add(ring);this.selection=ring;ring.visible=false;
 const cursor=new T.Mesh(new T.RingGeometry(.3,.5,24),new T.MeshBasicMaterial({color:0xe4d7ad,side:T.DoubleSide}));cursor.rotation.x=-Math.PI/2;scene.add(cursor);cursor.visible=false;this.cursor=cursor;
 }
 pick(clientX,clientY){this.pointer.set(clientX/innerWidth*2-1,-clientY/innerHeight*2+1);this.ray.setFromCamera(this.pointer,this.camera);const hits=this.ray.intersectObjects(this.pickables,true).filter(h=>h.object.userData.entity?.alive!==false);if(hits.length)return {entity:hits[0].object.userData.entity};const h=this.ray.intersectObject(this.ground);if(h.length)return {point:h[0].point};return null;}
 animate(mesh,moving,time,attack=0){const d=mesh.userData;if(d.arms){d.legs.forEach((l,i)=>l.rotation.x=moving?Math.sin(time*11+i*Math.PI)*.55:0);d.arms.forEach((l,i)=>l.rotation.x=moving?Math.sin(time*11+i*Math.PI+Math.PI)*.35:0);if(attack>0){d.arms[1].rotation.x=-1.4+Math.sin(attack*16)*.8;d.arms[1].rotation.z=-Math.sin(attack*16)*.8;}else d.arms[1].rotation.z=0;}else if(d.legs)d.legs.forEach((l,i)=>l.rotation.x=moving?Math.sin(time*12+i*Math.PI)*.25:0);}
 project(x,y,z){const p=new T.Vector3(x,y,z).project(this.camera);return {x:(p.x+1)/2*innerWidth,y:(1-p.y)/2*innerHeight,visible:p.z<1&&Math.abs(p.x)<1.2&&Math.abs(p.y)<1.2};}
 effect(x,z,color=0xf1cd86,size=1){const m=new T.Mesh(new T.RingGeometry(.1,.25,24),new T.MeshBasicMaterial({color,transparent:true,opacity:.8,side:T.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.set(x,.2,z);this.scene.add(m);this.effects.push({mesh:m,life:0,size});}
 skillEffect(kind,x,z,fromX=x,fromZ=z){
  const colors={slash:0x4ad9ff,whirl:0xb47aff,charge:0xffa34a,buff:0x55ef91};
  const color=colors[kind]||0xffffff;
  const group=new T.Group();group.position.set(x,0,z);this.scene.add(group);
  const ring=(radius,thickness,y,opacity=.9)=>{
    const mesh=new T.Mesh(new T.RingGeometry(Math.max(.01,radius-thickness),radius,48),
      new T.MeshBasicMaterial({color,transparent:true,opacity,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}));
    mesh.rotation.x=-Math.PI/2;mesh.position.y=y;group.add(mesh);return mesh;
  };
  const parts=[];
  if(kind==='slash'){
    for(let i=0;i<3;i++){const m=new T.Mesh(new T.TorusGeometry(1.6+i*.18,.065,6,38,Math.PI*.95),
      new T.MeshBasicMaterial({color:i===0?0xffffff:color,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false}));
      m.rotation.set(.2+i*.4,.15,i*.35);m.position.y=1.8+i*.35;group.add(m);parts.push(m);}
    ring(1.1,.22,.16);
  }else if(kind==='whirl'){
    for(let i=0;i<4;i++){const m=ring(2+i*.63,.15,.25+i*.22,.8);parts.push(m);}
    for(let i=0;i<3;i++){const torus=new T.Mesh(new T.TorusGeometry(2.1+i*.45,.09,6,48,Math.PI*1.6),
      new T.MeshBasicMaterial({color:i===0?0xf5d4ff:color,transparent:true,opacity:.85,side:T.DoubleSide,blending:T.AdditiveBlending,depthWrite:false}));
      torus.rotation.x=Math.PI/2.7;torus.position.y=1+i*.55;group.add(torus);parts.push(torus);}
  }else if(kind==='charge'){
    ring(1.3,.32,.18);
    const dx=x-fromX,dz=z-fromZ,dist=Math.hypot(dx,dz);
    const beam=new T.Mesh(new T.CylinderGeometry(.13,.45,Math.max(.5,dist),10,1,true),
      new T.MeshBasicMaterial({color,transparent:true,opacity:.6,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide}));
    beam.position.set(-dx/2,1.1,-dz/2);beam.rotation.z=0;
    beam.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3(dx,0,dz).normalize());group.add(beam);parts.push(beam);
  }else{
    for(let i=0;i<3;i++){const m=ring(1+i*.43,.13,.2+i*.75,.85);parts.push(m);}
    const glow=new T.Mesh(new T.SphereGeometry(1.25,16,12),
      new T.MeshBasicMaterial({color,transparent:true,opacity:.14,blending:T.AdditiveBlending,depthWrite:false}));
    glow.position.y=1.5;group.add(glow);parts.push(glow);
  }
  const count=kind==='whirl'?46:kind==='buff'?34:28;
  const geo=new T.BufferGeometry(),pos=new Float32Array(count*3),vel=[];
  for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,r=Math.random()*(kind==='whirl'?3.2:1.5),h=Math.random()*2.3+.25;
    pos[i*3]=Math.cos(a)*r;pos[i*3+1]=h;pos[i*3+2]=Math.sin(a)*r;
    vel.push({a,r,h,s:.6+Math.random()*2.5});}
  geo.setAttribute('position',new T.BufferAttribute(pos,3));
  const points=new T.Points(geo,new T.PointsMaterial({color,size:kind==='buff'?.35:.28,transparent:true,opacity:1,depthWrite:false,blending:T.AdditiveBlending,sizeAttenuation:true}));
  group.add(points);
  this.effects.push({group,parts,points,vel,life:0,duration:kind==='buff'?1.45:kind==='whirl'?1.05:.75,kind});
 }
 setBuffVisual(active,time=0){
 const d=this.player.userData,sword=d.sword,blade=sword.children[0];
 if(!d.aura){const group=new T.Group();const glowing=new T.Mesh(new T.BoxGeometry(.27,.25,1.85),new T.MeshBasicMaterial({color:0x54edff,transparent:true,opacity:.48,blending:T.AdditiveBlending,depthWrite:false}));glowing.position.set(0,0,.85);group.add(glowing);
 const core=new T.Mesh(new T.BoxGeometry(.17,.15,1.8),new T.MeshBasicMaterial({color:0xf5ffff,transparent:true,opacity:.65,blending:T.AdditiveBlending,depthWrite:false}));core.position.set(0,0,.85);group.add(core);
 const halo=new T.Mesh(new T.SphereGeometry(.28,10,8),new T.MeshBasicMaterial({color:0x6fffc7,transparent:true,opacity:.35,blending:T.AdditiveBlending,depthWrite:false}));halo.position.set(0,0,1.55);group.add(halo);sword.add(group);d.aura={group,glowing,core,halo};}
 const aura=d.aura;aura.group.visible=!!active&&d.sword.visible;
 if(active){const p=Math.sin(time*11);aura.glowing.material.opacity=.42+p*.16;aura.core.material.opacity=.65+p*.12;aura.halo.material.opacity=.4+p*.18;aura.halo.scale.setScalar(1.3+Math.sin(time*8)*.3);}
 }

 setShamanAuras(bless,aid,time){
  const d=this.player.userData;
  if(!d.shamanFX){
   const ring=new T.Mesh(new T.RingGeometry(1.13,1.37,64),new T.MeshBasicMaterial({color:0x69d9ff,transparent:true,opacity:.8,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}));
   ring.rotation.x=-Math.PI/2;ring.position.y=.08;this.player.add(ring);
   const cylinder=new T.Mesh(new T.CylinderGeometry(.88,1.08,2.6,32,1,true),new T.MeshBasicMaterial({color:0x4faaff,transparent:true,opacity:.18,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}));
   cylinder.position.y=1.32;this.player.add(cylinder);
   const orbGroup=new T.Group();orbGroup.position.set(.05,-.77,.48);d.arms[1].add(orbGroup);
   const orb=new T.Mesh(new T.SphereGeometry(.28,16,12),new T.MeshBasicMaterial({color:0xffa83e,transparent:true,opacity:.65,depthWrite:false,blending:T.AdditiveBlending}));orbGroup.add(orb);
   const core=new T.Mesh(new T.SphereGeometry(.16,12,10),new T.MeshBasicMaterial({color:0xfff5bd,transparent:true,opacity:.9,depthWrite:false,blending:T.AdditiveBlending}));orbGroup.add(core);
   const halo=new T.Mesh(new T.TorusGeometry(.39,.045,8,36),new T.MeshBasicMaterial({color:0xffd36d,transparent:true,opacity:.75,depthWrite:false,blending:T.AdditiveBlending}));orbGroup.add(halo);
   d.shamanFX={ring,cylinder,orbGroup,orb,core,halo};
  }
  const fx=d.shamanFX;const shaman=this.currentClassId==='shaman';
  fx.ring.visible=fx.cylinder.visible=shaman&&!!bless;
  fx.orbGroup.visible=shaman&&!!aid;
  if(fx.ring.visible){fx.ring.scale.setScalar(1+Math.sin(time*5)*.07);fx.ring.material.opacity=.63+Math.sin(time*6)*.15;fx.cylinder.material.opacity=.10+Math.sin(time*4)*.05;}
  if(fx.orbGroup.visible){fx.orb.scale.setScalar(1+Math.sin(time*8)*.17);fx.halo.rotation.z=time*3;fx.halo.rotation.y=time*2;fx.core.material.opacity=.78+Math.sin(time*10)*.15;}
 }
 dragonHowl(x,z){
  const group=new T.Group();group.position.set(x,0,z);this.scene.add(group);
  const fire=(radius,height,color,opacity)=>new T.Mesh(new T.SphereGeometry(radius,9,7),new T.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,blending:T.AdditiveBlending}));
  const segments=[];
  for(let i=0;i<14;i++){const m=fire(.48*(1-i/23),1, i%3===0?0xffed9a:i%3===1?0xffa33d:0xff642a,.8);group.add(m);segments.push(m);}
  const head=fire(.66,1,0xffcf57,.95);group.add(head);
  const horns=[];for(const side of [-1,1]){const horn=new T.Mesh(new T.ConeGeometry(.19,.85,7),new T.MeshBasicMaterial({color:0xffe9a8,transparent:true,opacity:.85,blending:T.AdditiveBlending,depthWrite:false}));group.add(horn);horns.push({horn,side});}
  const ring=new T.Mesh(new T.RingGeometry(4.7,5.15,64),new T.MeshBasicMaterial({color:0x75dfff,transparent:true,opacity:.8,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}));ring.rotation.x=-Math.PI/2;ring.position.y=.12;group.add(ring);
  const flames=[];for(let j=0;j<28;j++){const a=j*Math.PI*2/28,radius=1+Math.random()*3.8;const flame=new T.Mesh(new T.ConeGeometry(.16+Math.random()*.14,1+Math.random()*1.3,6),new T.MeshBasicMaterial({color:j%2?0xffab36:0xffe886,transparent:true,opacity:.8,depthWrite:false,blending:T.AdditiveBlending}));flame.position.set(Math.cos(a)*radius,.7,Math.sin(a)*radius);group.add(flame);flames.push(flame);}
  this.dragonEffects??=[];this.dragonEffects.push({group,segments,head,horns,ring,flames,age:0});
 }
 animateDragons(dt){
  if(!this.dragonEffects)return;
  for(let i=this.dragonEffects.length-1;i>=0;i--){const e=this.dragonEffects[i];e.age+=dt;const t=e.age,fade=Math.min(1,(2.1-t)*1.8);
   for(let j=0;j<e.segments.length;j++){const m=e.segments[j],phase=j*.38;m.position.set(Math.sin(t*8-phase)*(.22+j*.033),.65+t*3+j*.39,Math.cos(t*6-phase)*(.18+j*.025));m.material.opacity=Math.max(0,fade*.72);}
   e.head.position.set(Math.sin(t*8)*.26,1.2+t*3.2+14*.39,Math.cos(t*6)*.25);
   for(const h of e.horns)h.horn.position.set(e.head.position.x+h.side*.36,e.head.position.y+.42,e.head.position.z);
   e.ring.scale.setScalar(1+Math.min(t,1)*.35);e.ring.material.opacity=Math.max(0,fade*.7);
   for(const f of e.flames){f.position.y=.5+Math.sin(t*7+f.position.x)*.35+Math.min(t,1)*.6;f.material.opacity=Math.max(0,fade*.55);}
   if(t>2.1){this.scene.remove(e.group);e.group.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});this.dragonEffects.splice(i,1);}
  }
 }
 render(s,dt,time){this.player.position.set(s.x,0,s.z);const target=new T.Vector3(s.x,this.zoom*.95,s.z+this.zoom*.8);this.camera.position.lerp(target,1-Math.exp(-dt*8));this.camera.lookAt(s.x,0,s.z-2);this.sun.position.set(s.x-25,55,s.z+20);this.sun.target.position.set(s.x,0,s.z);for(let i=this.effects.length-1;i>=0;i--){const e=this.effects[i];if(e.group){
 e.life+=dt;const p=Math.min(1,e.life/e.duration),fade=Math.pow(1-p,1.3);
 e.group.scale.setScalar(.65+p*(e.kind==='whirl'?1.1:.55));
 e.group.rotation.y+=dt*(e.kind==='whirl'?7:e.kind==='buff'?2.5:3);
 for(const m of e.parts){m.material.opacity=Math.min(m.material.opacity,fade*.85);if(e.kind==='buff'&&m.geometry.type==='RingGeometry')m.position.y+=dt*2;}
 const pos=e.points.geometry.attributes.position;
 for(let j=0;j<e.vel.length;j++){const v=e.vel[j],a=v.a+e.life*(e.kind==='whirl'?7:2);pos.setXYZ(j,Math.cos(a)*v.r, v.h+(e.kind==='buff'?1:-.25)*e.life*v.s,Math.sin(a)*v.r);}
 pos.needsUpdate=true;e.points.material.opacity=fade;
 if(p>=1){this.scene.remove(e.group);e.group.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});this.effects.splice(i,1);}continue;}
 e.life+=dt;e.mesh.scale.setScalar(1+e.life*e.size*8);e.mesh.material.opacity=Math.max(0,.8-e.life*1.3);if(e.life>.6){this.scene.remove(e.mesh);e.mesh.geometry.dispose();e.mesh.material.dispose();this.effects.splice(i,1);}}this.setBuffVisual(time<this.buffUntil,time);this.setShamanAuras(time<(this.blessingUntil||0),time<(this.dragonAidUntil||0),time);this.animateDragons(dt);this.renderer.render(this.scene,this.camera);}
 configureClassWeapons(classId){
 const d=this.player.userData;if(!d.classWeapons){
  const fan=new T.Group();fan.position.copy(d.sword.position);
  const handle=piece(fan,boxG,0x9c7945,0,0,.26,.11,.1,.75);
  const fanBlade=new T.Mesh(new T.SphereGeometry(.66,18,10,0,Math.PI,0,Math.PI),new T.MeshStandardMaterial({color:0x9673bf,metalness:.45,roughness:.45,side:T.DoubleSide,emissive:0x3e226a,emissiveIntensity:.5}));
  fanBlade.rotation.set(Math.PI/2,0,0);fanBlade.scale.set(.9,.1,.65);fanBlade.position.z=.85;fan.add(fanBlade);
  for(let i=0;i<7;i++){const a=-Math.PI/2+i*Math.PI/6;const rib=piece(fan,boxG,0xe8c77a,Math.sin(a)*.34,0,.65+Math.cos(a)*.3,.035,.07,.57);rib.rotation.y=a*.5;}
  d.arms[1].add(fan);
  const dagger=new T.Group();dagger.position.copy(d.sword.position);piece(dagger,boxG,0x4e3b31,0,0,.28,.12,.12,.58);piece(dagger,boxG,0xe1f4f1,0,0,.79,.2,.075,.65,{metalness:.7,roughness:.2});piece(dagger,boxG,0xcaa55d,0,0,.49,.43,.11,.13);d.arms[1].add(dagger);
  const offhand=new T.Group();offhand.position.set(0,-.9,.12);piece(offhand,boxG,0x5a3b2a,0,0,.2,.11,.1,.5);piece(offhand,boxG,0xc6edf1,0,0,.65,.18,.08,.63,{metalness:.65});piece(offhand,boxG,0xe3b67e,0,0,.38,.36,.1,.12);d.arms[0].add(offhand);
  d.classWeapons={fan,dagger,offhand};
 }
 const shaman=classId==='shaman',ninja=classId==='ninja';d.sword.visible=!shaman&&!ninja;d.classWeapons.fan.visible=shaman;d.classWeapons.dagger.visible=ninja;d.classWeapons.offhand.visible=ninja;
 if(d.aura)d.aura.group.visible=!shaman&&!ninja&&d.aura.group.visible;
 }
 setEquipment(s){this.currentClassId=s.classId||'warrior';const d=this.player.userData,t=s.equipped.armor.tier;d.body.material=mat(s.classId==='shaman'?0x755c99:s.classId==='ninja'?0x333f53:[0x647567,0x80634a,0x577e8e,0x766393,0x886646][t]);this.configureClassWeapons(s.classId);const w=s.equipped.weapon;d.sword.children[0].scale.z=(s.classId==='ninja'?.65:s.classId==='shaman'?.9:1.25)+w.tier*.2;d.sword.children[0].material=mat(w.plus>=7?0xe6c68a:0xd6d9ca,{emissive:w.plus>=7?0xe4ab31:0x000000,emissiveIntensity:w.plus>=7?(w.plus-6)*.65:0});}
}
