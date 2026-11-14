/* NIGHTVIS LAB — common utilities. Everything runs locally in the browser. */
const NV = (()=>{
  const APPS=[
    {id:'ark',file:'ark.html',name:'ARK Command Center',short:'Control de dinosaurios, bases y crianza.',emoji:'🦖',color:'#73e2bb'},
    {id:'ego',file:'ego.html',name:'EGO Tracker',short:'Tus estadísticas de torneos.',emoji:'🏆',color:'#64d6ff'},
    {id:'rewards',file:'rewards.html',name:'Rewards Quest',short:'Puntos, metas y fechas estimadas.',emoji:'💎',color:'#b3a1ff'},
    {id:'gamehub',file:'gamehub.html',name:'GameHub',short:'Biblioteca, logros y juegos favoritos.',emoji:'🎮',color:'#8dd0ff'}
  ];
  const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const fmt=n=>Number(n||0).toLocaleString('es-MX');
  const money=n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(Number(n)||0);
  const percent=(a,b)=>b?Math.max(0,Math.min(100,Math.round(100*a/b))):0;
  const dateISO=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const dateLabel=s=>{if(!s)return '—';const [y,m,d]=s.split('-').map(Number);const dt=new Date(y,m-1,d);return isNaN(dt)?'—':dt.toLocaleDateString('es-MX',{day:'numeric',month:'short',year:'numeric'});};
  const id=()=>typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(36).slice(2);
  const read=(type,fallback)=>{try{const t=localStorage.getItem('nv_lab_'+type);return t?JSON.parse(t):structuredClone(fallback);}catch(e){return JSON.parse(JSON.stringify(fallback));}};
  const write=(type,data)=>{try{localStorage.setItem('nv_lab_'+type,JSON.stringify(data));return true;}catch(e){alert('No se pudo guardar. Revisa si el navegador está en modo privado o sin espacio.');return false;}};
  const stat=(label,value,hint='')=>`<div class="stat"><div class="label">${esc(label)}</div><div class="value">${esc(value)}</div><div class="hint">${esc(hint)}</div></div>`;
  const empty=(icon,title,tip='')=>`<div class="empty"><div class="big">${icon}</div><strong>${esc(title)}</strong>${tip?`<div>${esc(tip)}</div>`:''}</div>`;
  const progress=(v,max)=>`<div class="progress"><div style="width:${percent(v,max)}%"></div></div>`;
  const nav=(active)=>APPS.map(a=>`<a href="${a.file}" class="${active===a.id?'active':''}"><span class="nav-icon">${a.emoji}</span>${esc(a.name)}</a>`).join('');
  const layout=(type,title,subtitle,emoji,inner)=>{const selected=APPS.find(a=>a.id===type);return `<div class="app-shell"><aside class="sidebar"><a class="logo" href="index.html"><span class="logo-badge">⚡</span><span>NIGHTVIS <span class="text-accent">LAB</span></span></a><nav class="nav"><a href="index.html" class="${type==='home'?'active':''}"><span class="nav-icon">⌂</span>Inicio</a>${nav(type)}</nav><div class="side-bottom"><div class="eyebrow">MODO CREATIVO</div><p class="small muted" style="margin-top:8px">4 apps · Sin cuentas · Guardado local</p><p class="mono small" style="margin-top:10px">BUILD // 02</p></div></aside><main class="main"><div class="topbar"><div class="small muted">NIGHTVIS LAB <span style="opacity:.5">/</span> ${esc(type==='home'?'CENTRO DE APPS':title.toUpperCase())}</div><div class="topright"><span class="chip">● OFFLINE READY</span></div></div>${type==='home'?'':`<header class="hero"><div><p class="eyebrow">PROYECTO // ${esc((selected?.name||'').toUpperCase())}</p><h1>${esc(title)}</h1><p class="subtitle">${esc(subtitle)}</p></div><div class="hero-emoji">${emoji}</div></header>`}${inner}<footer class="footer"><span>Hecho para NIGHTVIS · Tus datos se quedan en este navegador.</span>${type==='home'?'':`<div class="footer-actions"><button type="button" class="btn ghost sm" data-common="export">↓ Exportar respaldo</button><button type="button" class="btn ghost sm" data-common="import">↑ Importar respaldo</button><input id="import-file" type="file" accept="application/json,.json" class="hide"></div>`}</footer></main></div>`;};
  const formValues=f=>Object.fromEntries(new FormData(f).entries());
  const num=(v,min=0,max=Infinity)=>Math.min(max,Math.max(min,Number(v)||0));
  const toast=msg=>{document.querySelector('.toast')?.remove();const el=document.createElement('div');el.className='toast';el.textContent=msg;document.body.append(el);setTimeout(()=>el.remove(),3300);};
  const backup=(type,data)=>{const blob=new Blob([JSON.stringify({app:type,version:1,exportedAt:new Date().toISOString(),data},null,2)],{type:'application/json'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`nightvis-${type}-respaldo.json`;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),2000);};
  const start=(type,defaults,module)=>{
    let data=read(type,defaults),ui={edit:null,filter:'todos',compare:null,battle:null,mapPoint:null};
    const root=document.getElementById('app');
    const paint=()=>{root.innerHTML=layout(type,module.title,module.subtitle,module.emoji,module.render(data,ui));module.afterPaint?.(data,ui);};
    root.addEventListener('click',e=>{
      const common=e.target.closest('[data-common]');
      if(common){if(common.dataset.common==='export')backup(type,data);if(common.dataset.common==='import')root.querySelector('#import-file')?.click();return;}
      const act=e.target.closest('[data-act]');
      if(act){e.preventDefault();const ans=module.action?.(act.dataset.act,act,data,ui);if(ans!==false){write(type,data);paint();}return;}
      const board=e.target.closest('[data-map-board]');
      if(board&&module.mapClick){const rect=board.getBoundingClientRect();ui.mapPoint={x:num(Math.round((e.clientX-rect.left)/rect.width*100),0,100),y:num(Math.round((e.clientY-rect.top)/rect.height*100),0,100)};paint();}
    });
    root.addEventListener('submit',e=>{const f=e.target.closest('form[data-submit]');if(!f)return;e.preventDefault();if(!f.reportValidity())return;const result=module.submit?.(f.dataset.submit,formValues(f),data,ui);if(result===false)return;write(type,data);paint();toast('Guardado correctamente ✓');});
    root.addEventListener('change',async e=>{
      if(e.target.matches('#cmd-search,#cmd-category')){module.change?.('commandFilter',e.target,data,ui);paint();return;}
      if(e.target.id==='import-file'){
        const file=e.target.files?.[0];if(!file)return;
        try{if(file.size>4_000_000)throw Error('El archivo es demasiado grande.');const text=await file.text();const obj=JSON.parse(text);if(obj.app!==type||!obj.data||typeof obj.data!=='object'||Array.isArray(obj.data))throw Error('Este respaldo no corresponde a esta app.');if(!confirm('¿Reemplazar los datos de esta app con los del archivo?'))return;data=obj.data;write(type,data);ui={edit:null,filter:'todos',compare:null,battle:null,mapPoint:null};paint();toast('Respaldo importado ✓');}catch(err){alert(err.message||'Archivo no válido.');}
        return;
      }
      if(e.target.dataset.change){const ans=module.change?.(e.target.dataset.change,e.target,data,ui);if(ans!==false){write(type,data);paint();}}
    });
    paint();
    return {paint};
  };
  const options=(items,selected,labelProp='name')=>items.map(o=>`<option value="${esc(o.id)}" ${selected===o.id?'selected':''}>${esc(o[labelProp])}</option>`).join('');
  const find=(arr,id)=>arr.find(x=>x.id===id);
  const remove=(arr,id)=>{const index=arr.findIndex(x=>x.id===id);if(index>=0)arr.splice(index,1);};
  const field=(name,label,type='text',value='',extra='')=>`<label class="field">${esc(label)}<input name="${esc(name)}" type="${type}" value="${esc(value)}" ${extra}></label>`;
  const select=(name,label,values,selected)=>`<label class="field">${esc(label)}<select name="${esc(name)}">${values.map(v=>{const [val,lab]=Array.isArray(v)?v:[v,v];return `<option value="${esc(val)}" ${String(selected)===String(val)?'selected':''}>${esc(lab)}</option>`;}).join('')}</select></label>`;
  const buttons=(isEdit)=>`<div class="form-actions"><button class="btn primary" type="submit">${isEdit?'Guardar cambios':'＋ Añadir registro'}</button>${isEdit?'<button class="btn ghost" type="button" data-act="cancel">Cancelar</button>':''}</div>`;
  const shade=(str)=>({ark:'#8bd56b',ego:'#a6f21b',rewards:'#ffd45b',gamehub:'#64c9ff'}[str]||'#53d9ff');
  return {APPS,esc,fmt,money,percent,dateISO,dateLabel,id,read,write,stat,empty,progress,layout,start,toast,num,options,find,remove,field,select,buttons,shade};
})();
// On GitHub Pages (HTTPS), pre-cache the entire suite after the first online visit.
if('serviceWorker' in navigator && location.protocol==='https:'){
 window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
