(function(){
'use strict';
const $=id=>document.getElementById(id);
const spanish=()=>{try{return localStorage.getItem('deepdive-language')==='es'}catch(e){return false}};
const msg=(en,es)=>spanish()?es:en;
/* Rebuild the atlas interaction surface to remove the previous conflicting pointer listeners.
   Pan and zoom modify the SVG viewBox, not CSS transforms. */
const original=$('v9MapCanvas');if(original){const fresh=original.cloneNode(true);original.replaceWith(fresh);fresh.id='v9MapCanvas';
const base={x:0,y:0,w:1000,h:720},state={...base},active=new Map();let pinch=null,drag=null,gesture=false,suppress=false;
function svg(){return fresh.querySelector('svg')}
function apply(){const el=svg();if(el)el.setAttribute('viewBox',[state.x,state.y,state.w,state.h].join(' '))}
function limit(){state.w=Math.max(180,Math.min(1700,state.w));state.h=state.w*base.h/base.w;state.x=Math.max(-350,Math.min(1350-state.w,state.x));state.y=Math.max(-250,Math.min(970-state.h,state.y))}
function position(e){const rect=fresh.getBoundingClientRect();return {x:(e.clientX-rect.left)/Math.max(1,rect.width),y:(e.clientY-rect.top)/Math.max(1,rect.height)}}
function zoom(f,at={x:.5,y:.5}){const oldW=state.w,oldH=state.h;state.w/=f;state.h/=f;state.x+=(oldW-state.w)*at.x;state.y+=(oldH-state.h)*at.y;limit();apply()}
function reset(){Object.assign(state,base);apply()}
const zoomIn=$('v18Plus'),zoomOut=$('v18Minus'),resetBtn=$('v18Reset'),full=$('v18Full'),atlas=document.querySelector('.v18-atlas');
if(zoomIn)zoomIn.onclick=()=>zoom(1.3);if(zoomOut)zoomOut.onclick=()=>zoom(1/1.3);if(resetBtn)resetBtn.onclick=reset;
function fullLabel(){if(full)full.textContent=(document.fullscreenElement||atlas.classList.contains('v19-fullscreen'))?msg('⤢ Exit full screen','⤢ Salir de pantalla completa'):msg('⛶ Full screen','⛶ Pantalla completa')}
if(full)full.onclick=async()=>{if(document.fullscreenElement){try{await document.exitFullscreen()}catch(e){}atlas.classList.remove('v19-fullscreen')}else if(atlas.classList.contains('v19-fullscreen')){atlas.classList.remove('v19-fullscreen')}else{try{if(atlas.requestFullscreen)await atlas.requestFullscreen();else atlas.classList.add('v19-fullscreen')}catch(e){atlas.classList.add('v19-fullscreen')}}fullLabel();apply()};
document.addEventListener('fullscreenchange',()=>{fullLabel();apply()});
fresh.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;const p=position(e);active.set(e.pointerId,p);try{fresh.setPointerCapture(e.pointerId)}catch(err){}gesture=false;if(active.size===1){drag={p,x:state.x,y:state.y};pinch=null}else if(active.size===2){const pts=[...active.values()];pinch={dist:Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y),w:state.w,h:state.h,x:state.x,y:state.y,mid:{x:(pts[0].x+pts[1].x)/2,y:(pts[0].y+pts[1].y)/2}};drag=null}});
fresh.addEventListener('pointermove',e=>{if(!active.has(e.pointerId))return;const p=position(e);active.set(e.pointerId,p);if(active.size>=2&&pinch){const pts=[...active.values()];const d=Math.max(.005,Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y)),mid={x:(pts[0].x+pts[1].x)/2,y:(pts[0].y+pts[1].y)/2};state.w=pinch.w*pinch.dist/d;state.h=pinch.h*pinch.dist/d;state.x=pinch.x+pinch.w*pinch.mid.x-state.w*mid.x;state.y=pinch.y+pinch.h*pinch.mid.y-state.h*mid.y;gesture=true;limit();apply()}else if(drag&&active.size===1){const dx=p.x-drag.p.x,dy=p.y-drag.p.y;if(Math.abs(dx)+Math.abs(dy)>.008)gesture=true;state.x=drag.x-dx*state.w;state.y=drag.y-dy*state.h;limit();apply()}});
function end(e){active.delete(e.pointerId);if(gesture){suppress=true;setTimeout(()=>suppress=false,110)}if(active.size===1){const p=[...active.values()][0];drag={p,x:state.x,y:state.y};pinch=null}else if(!active.size){drag=null;pinch=null}}
fresh.addEventListener('pointerup',end);fresh.addEventListener('pointercancel',end);fresh.addEventListener('lostpointercapture',end);
fresh.addEventListener('click',e=>{if(suppress){e.preventDefault();e.stopImmediatePropagation()}},true);
fresh.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?1.14:1/1.14,position(e))},{passive:false});
fresh.setAttribute('tabindex','0');fresh.addEventListener('keydown',e=>{if(e.key==='+'||e.key==='='){zoom(1.2);e.preventDefault()}if(e.key==='-'){zoom(1/1.2);e.preventDefault()}if(e.key==='0'){reset();e.preventDefault()}});
const observer=new MutationObserver(()=>apply());observer.observe(fresh,{childList:true});reset();fullLabel();
}
/* Progressive workspace: one primary task first, optional secondary material folded away. */
const guides={
explore:['1 · Choose a topic → 2 · Read the passages → 3 · Reflect','1 · Elige un tema → 2 · Lee los pasajes → 3 · Reflexiona'],
map:['Choose a doctrine, explore its constellation, then read the connection notes below.','Elige una doctrina, explora su constelación y lee las conexiones debajo.'],
builder:['Select topics → Build a route → Read each stop → Save your reflections.','Selecciona temas → Crea una ruta → Lee cada etapa → Guarda tus reflexiones.'],
research:['Choose a topic and perspective first. Open comparisons and questions only when needed.','Primero elige un tema y una perspectiva. Abre las comparaciones y preguntas cuando las necesites.'],
linguistic:['Choose a prophetic voice, then explore its passages and language patterns.','Elige una voz profética y explora sus pasajes y patrones lingüísticos.'],
zion:['Select a social theme to examine its scripture, interpretation, and reflection.','Selecciona un tema social para estudiar su escritura, interpretación y reflexión.'],
imperfection:['Choose a theme about human limitation, then read its context and questions.','Elige un tema sobre las limitaciones humanas y lee su contexto y preguntas.'],
search:['Search first, then examine results in their scriptural context.','Primero busca y luego examina los resultados en su contexto.'],
path:['Follow one stage at a time.','Sigue una etapa a la vez.'],
quiz:['Choose a topic, then answer one question at a time.','Elige un tema y responde una pregunta a la vez.'],
journal:['Write and save one reflection at a time.','Escribe y guarda una reflexión a la vez.']
};
Object.entries(guides).forEach(([id,pair])=>{const section=$(id),panel=section?.querySelector('.panel'),h=panel?.querySelector('h2');if(!h)return;const box=document.createElement('div');box.className='v19-section-guide';box.dataset.en=pair[0];box.dataset.es=pair[1];box.innerHTML='<strong>'+msg('Your study flow','Tu recorrido de estudio')+'</strong><p>'+msg(pair[0],pair[1])+'</p>';h.after(box)});
function fold(id,labelEn,labelEs,ids){const section=$(id);if(!section)return;const nodes=ids.map($).filter(Boolean);if(!nodes.length)return;const details=document.createElement('details');details.className='v19-disclosure';details.dataset.en=labelEn;details.dataset.es=labelEs;const summary=document.createElement('summary');summary.textContent=msg(labelEn,labelEs);details.appendChild(summary);nodes[0].parentNode.insertBefore(details,nodes[0]);nodes.forEach(n=>details.appendChild(n))}
fold('explore','Next: connections and reflection','Siguiente: conexiones y reflexión',['connections','questions']);
fold('research','Compare passages and explore difficult questions','Comparar pasajes y explorar preguntas difíciles',['v10CompareA','v10CompareB','v10CompareBtn','v10CompareOutput','v10Questions']);
/* Replace repeated English-only dynamic explanations with curated Spanish study content. */
const edgeTranslations=[
'La obligación de compartir se entiende mejor al contrastarla con la condena profética de la indiferencia.',
'El cuidado práctico del prójimo ayuda a comprender los bienes compartidos de 4 Nefi.',
'Mosíah 18 relaciona el convenio bautismal con llevar las cargas de otras personas.',
'Jacob y Moroni relacionan el abandono social con el orgullo por las riquezas.',
'La unidad de 4 Nefi cuestiona las divisiones heredadas y las jerarquías económicas.',
'La invitación universal y la caridad ofrecen un marco moral para examinar la exclusión.',
'La comunidad de 4 Nefi relaciona los bienes compartidos con el amor de Dios.',
'Los relatos muestran distintas maneras de buscar y reconocer la guía divina.',
'Las experiencias personales de revelación pueden compararse con las enseñanzas sobre el Espíritu.',
'El desarrollo espiritual individual puede incluir incertidumbre, vulnerabilidad y crecimiento gradual.',
'Éter 12 y Moroni 10 relacionan la debilidad humana con la gracia de Cristo.',
'Nefi y Alma describen lucha interior y transformación sin glorificar las malas acciones.',
'La semilla de Alma y la búsqueda de Nefi muestran la relación entre fe y aprendizaje.',
'El ministerio y la obra redentora de Cristo están en el centro de estas enseñanzas.',
'El bautismo inicia obligaciones hacia Dios y otras personas.',
'El servicio de Benjamín muestra un liderazgo que alivia cargas.',
'La paz de 4 Nefi va más allá de los conflictos defensivos anteriores.',
'Saría y Abish invitan a prestar atención a voces y acciones espirituales poco representadas.',
'Alma y las enseñanzas de Cristo exploran responsabilidad y compasión juntas.',
'Los conflictos familiares invitan a reflexionar con cuidado sobre reconciliación y límites.'
];
if(typeof V9_EDGES!=='undefined'){V9_EDGES.forEach((e,i)=>{e[3]=edgeTranslations[i]||e[2]})}
const oldRelated=v9Related;v9Related=function(t){const r=oldRelated(t);if(!spanish())return r;return r.map(x=>{const edge=V9_EDGES.find(e=>(e[0]===t&&e[1]===x.topic)||(e[1]===t&&e[0]===x.topic));return {...x,why:edge?.[3]||'Explora cómo estos temas se relacionan en distintos pasajes.'}})};
/* Stable, reversible UI translations. Preserve data values, journal text and scripture references. */
const dictionary={
'Explore the connections':'Explora las conexiones','Trace theological and narrative connections between study topics. Select any node to follow another thread.':'Explora las conexiones teológicas y narrativas entre los temas. Toca una estrella para seguir otra idea.','Connections are curated interpretive relationships, not claims that every passage explicitly equates the topics.':'Estas conexiones son interpretaciones seleccionadas; no significan que los pasajes equiparen explícitamente los temas.',
'Start with a topic':'Comienza con un tema','Build your own study journey':'Crea tu propio recorrido de estudio','Choose at least two topics. DeepDive will order them by shared passages and curated connections, then create a guided sequence of readings and reflection prompts. Your selection and progress stay on this device.':'Elige al menos dos temas. DeepDive los organiza según pasajes y conexiones compartidos para crear lecturas y reflexiones. Tus avances se guardan en este dispositivo.',
'Search the complete Book of Mormon':'Busca en todo el Libro de Mormón','One God, unique voices, unfinished people':'Un Dios, voces únicas, personas en proceso','A heart softened in its own way':'Un corazón ablandado a su manera','A voice that invites attention':'Una voz que invita a escuchar','The honest voice of an imperfect disciple':'La voz sincera de un discípulo imperfecto',
'Research Studio':'Estudio de investigación','Scripture Comparison Studio':'Estudio comparativo de escrituras','Difficult questions':'Preguntas difíciles','Linguistic DeepDive':'Análisis lingüístico','Phrase and motif explorer':'Explorador de frases y motivos','Zion & Social Justice Observatory':'Observatorio de Sion y justicia social','Theology of Imperfection Lab':'Laboratorio de la teología de la imperfección','Study topic':'Tema de estudio','Interpretation lens':'Perspectiva de interpretación','Text and narrative':'Texto y narración','Theological':'Teológica','Historical and cultural questions':'Preguntas históricas y culturales','Ethical and social':'Ética y social','Personal reflection':'Reflexión personal','Choose two references to examine their shared themes, distinct contexts, and potential tensions.':'Elige dos referencias para examinar temas compartidos, contextos distintos y posibles tensiones.',
'Compare passages':'Comparar pasajes','Read in context':'Leer en contexto','Narrative context':'Contexto narrativo','Theological reflection':'Reflexión teológica','Question to explore':'Pregunta para explorar','Explore meaning ▾':'Explorar significado ▾','Close commentary ▴':'Cerrar comentario ▴','Topic overview':'Resumen del tema','Deeper interpretation and connections':'Interpretación y conexiones más profundas','Questions for deeper study':'Preguntas para profundizar','Follow another thread':'Seguir otra conexión','Read scripture ↗':'Leer escritura ↗','Add to journal':'Añadir al diario','Study this topic':'Estudiar este tema','Add to my study path':'Añadir a mi ruta','Connected ideas':'Ideas relacionadas','Connected constellations':'Constelaciones relacionadas','Your study journal':'Tu diario de estudio','Save reflection':'Guardar reflexión','Export journal':'Exportar diario','Import journal':'Importar diario','New question':'Nueva pregunta','Previous':'Anterior','Next →':'Siguiente →','Restart path':'Reiniciar ruta','Reflect':'Reflexionar','Read and explore':'Leer y explorar','Build my path ✦':'Crear mi ruta ✦','Clear selection':'Borrar selección','Select a topic and begin.':'Selecciona un tema para comenzar.','Topic challenge':'Desafío de temas','Save reflection to journal':'Guardar reflexión en el diario','Communal ideal':'Ideal comunitario','Prophetic warning':'Advertencia profética','Human limitation':'Limitación humana','Moral wrongdoing and harm':'Faltas morales y daño','Distinguish the ideas':'Distinguir las ideas','Representative passages':'Pasajes representativos','Interpretive question':'Pregunta interpretativa','Study question':'Pregunta de estudio','Shared thematic context':'Contexto temático compartido','Possible tension or distinction':'Posible tensión o diferencia','Side-by-side comparison':'Comparación paralela','Primary passages':'Pasajes principales','Search related terms in the full text':'Buscar términos relacionados en el texto completo','Explore topic':'Explorar tema','What do you want to study?':'¿Qué deseas estudiar?','Choose a topic to begin':'Elige un tema para comenzar','Drag to explore · Pinch or use + / − to zoom':'Arrastra para explorar · Pellizca o usa + / − para ampliar'
};
const reverse=Object.fromEntries(Object.entries(dictionary).map(([a,b])=>[b,a]));
const attrs=new WeakMap();const textOriginal=new WeakMap();
function translate(){const es=spanish();document.querySelectorAll('.v19-section-guide').forEach(el=>{el.querySelector('strong').textContent=es?'Tu recorrido de estudio':'Your study flow';el.querySelector('p').textContent=es?el.dataset.es:el.dataset.en});document.querySelectorAll('.v19-disclosure').forEach(el=>{el.querySelector('summary').textContent=es?el.dataset.es:el.dataset.en});
const root=document.querySelector('main');if(!root)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){if(node.parentElement?.closest('textarea,input,script,style,[contenteditable]'))continue;const raw=node.nodeValue,trim=raw.trim();if(!trim)continue;const original=reverse[trim]||trim;const next=es?(dictionary[original]||original):original;if(next!==trim)node.nodeValue=raw.replace(trim,next)}
document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el=>{if(!attrs.has(el))attrs.set(el,el.placeholder);const original=attrs.get(el);const pairs={'Enter a word or exact phrase':'Escribe una palabra o frase exacta','Study title or scripture reference':'Título del estudio o referencia','Your notes on this study stop...':'Tus notas sobre esta etapa...','Write your reflection here; save it to your journal to keep it.':'Escribe tu reflexión y guárdala en el diario.'};el.placeholder=es?(pairs[original]||original):original});
}
let timer;const observe=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(translate,160)});observe.observe(document.querySelector('main'),{childList:true,subtree:true});$('v12Language')?.addEventListener('click',()=>setTimeout(translate,90));translate();
})();