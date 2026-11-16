/* DeepDive 22: one consistent layout. Persistent section navigation, tidy page headers,
   and grouped optional tools. Presentation only; study logic and data are unchanged. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const es=()=>{try{return localStorage.getItem('deepdive-language')==='es'}catch(e){return false}};
const L=(en,sp)=>es()?sp:en;
const NAV=[
 ['Discover','Descubrir',[['explore','Topics','Temas'],['map','Connection map','Mapa de conexiones'],['search','Search','Buscar']]],
 ['Go deeper','Profundizar',[['research','Research','Investigación'],['linguistic','Voices & language','Voces y lenguaje'],['zion','Zion & justice','Sion y justicia'],['imperfection','Imperfection','Imperfección']]],
 ['My study','Mi estudio',[['path','Guided paths','Rutas guiadas'],['builder','Build a path','Crear una ruta'],['quiz','Quiz','Cuestionario'],['journal','Journal','Diario']]]
];
const topNav=document.querySelector('.v12-nav');
if(!topNav||typeof tab!=='function')return;
document.body.classList.add('dd22');

/* Brand inside the sticky bar (the separate banner header is hidden by CSS). */
const brand=document.createElement('button');brand.type='button';brand.className='dd-brand';brand.innerHTML='✦ <span>DeepDive</span>';
brand.onclick=()=>$('v12Home')?.click();
topNav.insertBefore(brand,topNav.firstChild);

/* Persistent section navigation. */
const sections=document.createElement('nav');sections.className='dd-sections';sections.setAttribute('aria-label','Sections');
topNav.appendChild(sections);
function renderNav(){
 sections.innerHTML=NAV.map(([gEn,gEs,items])=>'<div class="dd-group"><span class="dd-group-label">'+L(gEn,gEs)+'</span>'+
  items.map(([id,en,sp])=>'<button type="button" data-dd-go="'+id+'">'+L(en,sp)+'</button>').join('')+'</div>').join('');
 sections.querySelectorAll('[data-dd-go]').forEach(b=>b.onclick=()=>{tab(b.dataset.ddGo);window.scrollTo({top:0,behavior:'smooth'})});
 markActive();
}
function current(){const s=[...document.querySelectorAll('main>section')].find(x=>!x.classList.contains('hidden'));return s?s.id:'home'}
function markActive(){
 const id=current();document.body.classList.toggle('dd-home',id==='home');
 sections.querySelectorAll('[data-dd-go]').forEach(b=>{const on=b.dataset.ddGo===id;b.classList.toggle('active',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 const active=sections.querySelector('.active');if(active&&active.scrollIntoView&&window.innerWidth<760)active.scrollIntoView({block:'nearest',inline:'center'});
}
const oldTab=tab;window.tab=function(id){const r=oldTab.apply(this,arguments);markActive();return r};
new MutationObserver(markActive).observe(document.querySelector('main'),{subtree:false,childList:false,attributes:true,attributeFilter:['class']});
document.querySelectorAll('main>section').forEach(s=>new MutationObserver(markActive).observe(s,{attributes:true,attributeFilter:['class']}));
$('v12Language')?.addEventListener('click',()=>setTimeout(renderNav,30));
renderNav();


/* Home: choosing Discover / Go deeper / My study opens its own screen instead of a list below the cards. */
const DESC={explore:['Pick a theme and read curated passages','Elige un tema y lee pasajes seleccionados'],map:['See how topics connect in a constellation','Mira cómo se conectan los temas en una constelación'],search:['Search the full text for a word or phrase','Busca una palabra o frase en todo el texto'],research:['Study one topic through different lenses','Estudia un tema desde distintos enfoques'],linguistic:['Compare the voices of Nephi, Jacob, Alma, Mormon and Moroni','Compara las voces de Nefi, Jacob, Alma, Mormón y Moroni'],zion:['Wealth, poverty, prejudice and community','Riqueza, pobreza, prejuicios y comunidad'],imperfection:['Weakness, grace and growth','Debilidad, gracia y crecimiento'],path:['Follow a ready-made path step by step','Sigue paso a paso una ruta preparada'],builder:['Choose topics and build your own path','Elige temas y crea tu propia ruta'],quiz:['Match scriptures to their topics','Relaciona escrituras con sus temas'],journal:['Write and save your reflections','Escribe y guarda tus reflexiones']};
const groupPanel=$('v12GroupPanel');
function decorate(){if(!groupPanel)return;groupPanel.querySelectorAll('[data-v12-go]').forEach(b=>{const d=DESC[b.dataset.v12Go],span=b.querySelector('span');if(d&&span){const t=L(d[0],d[1])+' →';if(span.textContent!==t)span.textContent=t}})}
function openGroup(g){document.body.classList.add('dd-group-open');document.body.dataset.ddGroup=g||'';decorate();window.scrollTo({top:0});try{if(!history.state||!history.state.ddGroup)history.pushState({ddGroup:g},'')}catch(e){}}
function closeGroup(fromPop){if(!document.body.classList.contains('dd-group-open'))return;document.body.classList.remove('dd-group-open');groupPanel?.classList.add('hidden');document.querySelector('.v12-choice-grid')?.classList.remove('hidden');window.scrollTo({top:0});if(!fromPop){try{if(history.state&&history.state.ddGroup)history.back()}catch(e){}}}
document.querySelectorAll('[data-v12-group]').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>openGroup(b.dataset.v12Group),0)));
groupPanel?.addEventListener('click',e=>{if(e.target.closest('#v12Back'))closeGroup(false);else if(e.target.closest('[data-v12-go]')){document.body.classList.remove('dd-group-open')}});
$('v12Home')?.addEventListener('click',()=>closeGroup(false));
brand.addEventListener('click',()=>closeGroup(false));
window.addEventListener('popstate',()=>closeGroup(true));
if(groupPanel)new MutationObserver(decorate).observe(groupPanel,{childList:true,subtree:true,characterData:true});

/* Research: put each optional tool in its own clearly labelled fold. */
const research=document.querySelector('#research .panel');
if(research){
 const heads=[...research.querySelectorAll(':scope>h3')];
 const compareHead=heads[0],questionsHead=heads[1];
 const compareIntro=compareHead&&compareHead.nextElementSibling&&compareHead.nextElementSibling.matches('p')?compareHead.nextElementSibling:null;
 function fold(head){const d=document.createElement('details');d.className='dd-fold';const s=document.createElement('summary');if(head)s.appendChild(head);d.appendChild(s);return d}
 if(compareHead&&$('v10CompareA')){
  const d1=fold(compareHead);
  if(compareIntro)d1.appendChild(compareIntro);
  const row=document.createElement('div');row.className='dd-compare-row';
  ['v10CompareA','v10CompareB','v10CompareBtn'].forEach(id=>{const el=$(id);if(el)row.appendChild(el)});
  d1.appendChild(row);if($('v10CompareOutput'))d1.appendChild($('v10CompareOutput'));
  research.appendChild(d1);
 }
 if(questionsHead&&$('v10Questions')){const d2=fold(questionsHead);d2.appendChild($('v10Questions'));research.appendChild(d2)}
 research.querySelectorAll('details.v19-disclosure').forEach(d=>{if(!d.querySelector('select,button,#v10Questions,#v10CompareOutput'))d.remove()});
 research.querySelectorAll('.v10-two').forEach(x=>{if(!x.querySelector('select,div,p,button'))x.remove()});
}
})();
