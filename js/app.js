import {views} from './views.js';
import {products} from './data/products.js';
import {cart} from './cart.js';
import {money,config} from './config.js';
import {card,toast,escapeHTML as esc} from './ui.js';
import {bindCheckout} from './checkout.js';
const main=document.querySelector('main');
let active='todos',query='',sort='default',limit=16;
function renderCatalog(){
 let list=products.filter(p=>(active==='todos'||p.category===active)&&p.name.toLocaleLowerCase('es').includes(query));
 if(sort!=='default')list.sort((a,b)=>sort==='asc'?a.price-b.price:b.price-a.price);
 document.querySelector('#catalog-grid').innerHTML=list.length?list.slice(0,limit).map(card).join(''):'<p class="empty">No encontramos coincidencias. Prueba con otra búsqueda.</p>';
 document.querySelector('#results-count').textContent=`${list.length} referencias · Mostrando ${Math.min(limit,list.length)}`;
 document.querySelector('#load-more').hidden=limit>=list.length;
 document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.filter===active));
}
function route(){
 if(location.hash==='#main'){main.focus();return;}
 const [path,params]=(location.hash.slice(2)||'').split('?');const name=path||'home';
 document.querySelector('#product-dialog').close();
 main.innerHTML=(views[name]||(()=>'<section class="empty"><h1>Esta página no existe.</h1><a href="#/">Volver al inicio</a></section>'))();
 document.title=`${name==='home'?'Tu estilo empieza arriba':({catalogo:'Colección',categorias:'Categorías',nosotros:'El detalle',opiniones:'Opiniones',contacto:'Contacto',ayuda:'Ayuda',carrito:'Bolsa',checkout:'Pedido'}[name]||'Página')} · ${config.name}`;
 document.querySelectorAll('nav a').forEach(a=>{if(a.hash.split('?')[0]===`#/${name}`)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 if(name==='catalogo'){
  active=new URLSearchParams(params).get('categoria')||'todos';if(!['todos','gorras','sombreros','billeteras'].includes(active))active='todos';query='';sort='default';limit=16;renderCatalog();
  document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{active=b.dataset.filter;limit=16;renderCatalog();});
  document.querySelector('#search').oninput=e=>{query=e.target.value.trim().toLocaleLowerCase('es');limit=16;renderCatalog();};
  document.querySelector('#sort').onchange=e=>{sort=e.target.value;renderCatalog();};
  document.querySelector('#load-more').onclick=()=>{limit+=16;renderCatalog();};
 }
 bindCheckout();window.scrollTo(0,0);main.focus({preventScroll:true});
}
function detail(id){
 const p=products.find(p=>p.id===id);if(!p)return;
 const dialog=document.querySelector('dialog');
 dialog.innerHTML=`<button class="dialog-close" aria-label="Cerrar detalle" autofocus>×</button><div class="detail-grid"><img src="${p.images[0]}" alt="${esc(p.name)}"><form id="detail-form"><p class="eyebrow">${p.category}</p><h2 id="detail-title">${esc(p.name)}</h2><p class="detail-price">${money(p.price)}</p><p>${esc(p.description)}</p><label>Opción<select name="variant" required>${p.variants.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('')}</select></label><label>Cantidad<input name="quantity" type="number" value="1" min="1" max="99" required></label><button class="button lime" ${p.available?'':'disabled'}>${p.available?'Agregar a la bolsa +':'No disponible'}</button><small>Envío y disponibilidad se confirman por WhatsApp.</small></form></div>`;
 dialog.querySelector('.dialog-close').onclick=()=>dialog.close();
 dialog.querySelector('form').onsubmit=e=>{e.preventDefault();const data=new FormData(e.currentTarget);cart.add(p.id,data.get('variant'),Number(data.get('quantity')));dialog.close();toast('Agregado a tu bolsa');};
 dialog.showModal();
}
document.addEventListener('click',e=>{const product=e.target.closest('[data-product]');if(product)detail(product.dataset.product);const remove=e.target.closest('[data-remove]');if(remove){cart.remove(Number(remove.dataset.remove));route();}});
document.addEventListener('change',e=>{if(e.target.matches('[data-quantity]')){cart.update(Number(e.target.dataset.quantity),Number(e.target.value));route();}});
window.addEventListener('cartchange',()=>document.querySelector('#cart-count').textContent=cart.count);
window.addEventListener('hashchange',route);
document.querySelector('#year').textContent=new Date().getFullYear();
document.querySelector('#cart-count').textContent=cart.count;
route();
