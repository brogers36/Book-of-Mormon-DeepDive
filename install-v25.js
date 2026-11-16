/* DeepDive 25: "Install app" button with instructions for iPhone/iPad, Android and computers. */
(function(){
'use strict';
const SHARE_URL='https://brogers36.github.io/Book-of-Mormon-DeepDive/';
const es=()=>{try{return localStorage.getItem('deepdive-language')==='es'}catch(e){return false}};
const L=(en,sp)=>es()?sp:en;
const ua=navigator.userAgent||'';
const isIOS=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const isAndroid=/Android/i.test(ua);
const installed=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
let deferred=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e});
window.addEventListener('appinstalled',()=>{deferred=null;refresh();close()});

const right=document.querySelector('.v12-nav-right');
const btn=document.createElement('button');btn.type='button';btn.id='ddInstall';btn.className='dd-install-btn';
if(right)right.insertBefore(btn,right.firstChild);
const homeCta=document.createElement('button');homeCta.type='button';homeCta.className='dd-install-cta';
const grid=document.querySelector('#home .v12-choice-grid');if(grid)grid.after(homeCta);

const modal=document.createElement('div');modal.className='dd-modal hidden';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
document.body.appendChild(modal);
let tabSel=isIOS?'ios':isAndroid?'android':'desktop';

function steps(){
 const S={
  ios:[L('Open this page in <b>Safari</b> (Chrome on iPhone works too).','Abre esta página en <b>Safari</b> (también funciona Chrome en iPhone).'),
       L('Tap the <b>Share</b> button <span class="dd-ico">⬆︎</span> (the square with an arrow), at the bottom of the screen or next to the address bar.','Toca el botón <b>Compartir</b> <span class="dd-ico">⬆︎</span> (el cuadrado con una flecha), abajo o junto a la barra de direcciones.'),
       L('Scroll down and tap <b>Add to Home Screen</b>.','Desplázate hacia abajo y toca <b>Agregar a inicio</b>.'),
       L('Tap <b>Add</b>. DeepDive now opens from its icon like any other app.','Toca <b>Agregar</b>. DeepDive se abrirá desde su ícono como cualquier otra app.')],
  android:[L('Open this page in <b>Chrome</b>.','Abre esta página en <b>Chrome</b>.'),
       L('Tap the <b>⋮</b> menu in the top-right corner.','Toca el menú <b>⋮</b> en la esquina superior derecha.'),
       L('Tap <b>Install app</b> (on some phones it says <b>Add to Home screen</b>).','Toca <b>Instalar app</b> (en algunos teléfonos dice <b>Agregar a la pantalla principal</b>).'),
       L('Tap <b>Install</b>. The DeepDive icon appears on your home screen.','Toca <b>Instalar</b>. El ícono de DeepDive aparecerá en tu pantalla principal.')],
  desktop:[L('Open this page in <b>Chrome</b> or <b>Edge</b>.','Abre esta página en <b>Chrome</b> o <b>Edge</b>.'),
       L('Click the install icon <span class="dd-ico">⊕</span> at the right end of the address bar, or open the browser menu and choose <b>Install DeepDive</b>.','Haz clic en el ícono de instalación <span class="dd-ico">⊕</span> al final de la barra de direcciones, o abre el menú del navegador y elige <b>Instalar DeepDive</b>.'),
       L('Click <b>Install</b>. On a Mac with Safari, use <b>File → Add to Dock</b>.','Haz clic en <b>Instalar</b>. En una Mac con Safari, usa <b>Archivo → Agregar al Dock</b>.')]
 };
 return S[tabSel].map(s=>'<li>'+s+'</li>').join('');
}
function render(){
 const tabs=[['ios',L('iPhone / iPad','iPhone / iPad')],['android','Android'],['desktop',L('Computer','Computadora')]];
 modal.innerHTML='<div class="dd-modal-card"><button type="button" class="dd-modal-x" aria-label="'+L('Close','Cerrar')+'">✕</button>'+
 '<img src="./icon-192.png" alt="" class="dd-modal-icon"><h2>'+L('Install DeepDive','Instalar DeepDive')+'</h2>'+
 '<p class="dd-modal-sub">'+L('Add DeepDive to your home screen. It opens full screen, and your journal and study paths stay on your device.','Agrega DeepDive a tu pantalla de inicio. Se abre en pantalla completa y tu diario y tus rutas se guardan en tu dispositivo.')+'</p>'+
 (deferred?'<button type="button" class="primary dd-install-now">⤓ '+L('Install now','Instalar ahora')+'</button>':'')+
 '<div class="dd-tabs" role="tablist">'+tabs.map(([k,t])=>'<button type="button" role="tab" data-dd-tab="'+k+'" aria-selected="'+(k===tabSel)+'" class="'+(k===tabSel?'active':'')+'">'+t+'</button>').join('')+'</div>'+
 '<ol class="dd-steps">'+steps()+'</ol>'+
 '<div class="dd-share"><span>'+L('Share the app','Compartir la app')+'</span><div class="dd-share-row"><input readonly value="'+SHARE_URL+'" aria-label="Link"><button type="button" class="dd-copy">'+L('Copy link','Copiar enlace')+'</button>'+(navigator.share?'<button type="button" class="dd-sharebtn">'+L('Share…','Compartir…')+'</button>':'')+'</div></div></div>';
 modal.querySelector('.dd-modal-x').onclick=close;
 modal.querySelectorAll('[data-dd-tab]').forEach(b=>b.onclick=()=>{tabSel=b.dataset.ddTab;render()});
 const now=modal.querySelector('.dd-install-now');if(now)now.onclick=async()=>{const p=deferred;deferred=null;try{await p.prompt();await p.userChoice}catch(e){}render();refresh()};
 const copy=modal.querySelector('.dd-copy');copy.onclick=async()=>{try{await navigator.clipboard.writeText(SHARE_URL)}catch(e){const i=modal.querySelector('.dd-share input');i.select();try{document.execCommand('copy')}catch(_){}}copy.textContent=L('Copied ✓','Copiado ✓')};
 const sh=modal.querySelector('.dd-sharebtn');if(sh)sh.onclick=()=>navigator.share({title:'Book of Mormon DeepDive',url:SHARE_URL}).catch(()=>{});
}
function open(){render();modal.classList.remove('hidden');document.body.classList.add('dd-modal-open');modal.querySelector('.dd-modal-x').focus()}
function close(){modal.classList.add('hidden');document.body.classList.remove('dd-modal-open')}
modal.addEventListener('click',e=>{if(e.target===modal)close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.classList.contains('hidden'))close()});
function refresh(){
 const hide=installed();btn.hidden=hide;homeCta.hidden=hide;
 btn.innerHTML='⤓ <span>'+L('Install app','Instalar app')+'</span>';btn.setAttribute('aria-label',L('Install app','Instalar app'));
 homeCta.innerHTML='📱 '+L('Install DeepDive on your phone or computer','Instala DeepDive en tu teléfono o computadora');
 if(!modal.classList.contains('hidden'))render();
}
btn.onclick=open;homeCta.onclick=open;
document.getElementById('v12Language')?.addEventListener('click',()=>setTimeout(refresh,40));
refresh();
})();
