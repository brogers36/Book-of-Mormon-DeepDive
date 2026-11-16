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
