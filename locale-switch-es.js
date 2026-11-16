(function(){
const root=window.DEEP_FULL_ES;if(!root)return;
const source={details:JSON.parse(JSON.stringify(V9_DETAILS)),v10:JSON.parse(JSON.stringify(V10_DATA))};
const isSpanish=()=>{try{return localStorage.getItem('deepdive-language')==='es'}catch(e){return false}};
function syncData(){const es=isSpanish();for(const key of Object.keys(source.details))V9_DETAILS[key]=(es&&root.details[key]?root.details[key]:source.details[key]).slice();for(const key of Object.keys(source.v10))V10_DATA[key]=(es&&root.v10[key]?root.v10[key]:source.v10[key]).map(x=>x.slice());}
function rerender(){syncData();try{v10Voice(Number(document.querySelector('[data-v10-voice].active')?.dataset.v10Voice||0));v10Zion(Number(document.querySelector('[data-v10-zion].active')?.dataset.v10Zion||0));v10Imperfection(Number(document.querySelector('[data-v10-imperfection].active')?.dataset.v10Imperfection||0));v10Questions()}catch(e){console.warn('Localization refresh',e)}}
document.getElementById('v12Language')?.addEventListener('click',()=>setTimeout(rerender,170));
syncData();
})();