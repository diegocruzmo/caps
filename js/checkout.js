import {cart} from './cart.js';
import {products} from './data/products.js';
import {config,money} from './config.js';
export function orderMessage(data){
 return [`Hola, ${config.name}. Me gustaría hacer este pedido:`, '', ...cart.items.map(x=>{const p=products.find(p=>p.id===x.id);return `• ${p.name} | ${x.variant}\n  ${x.quantity} × ${money(p.price)} = ${money(p.price*x.quantity)}`;}),'',`Total de productos: ${money(cart.total)}`,'Envío por confirmar.','',`Nombre: ${data.name}`,`Contacto: ${data.phone}`,`Ciudad: ${data.city}`,`Entrega: ${data.address}`,`Notas: ${data.notes || 'Sin notas'}`].join('\n');
}
export function bindCheckout(){
 document.querySelector('#checkout-form')?.addEventListener('submit',e=>{
  e.preventDefault();const form=e.currentTarget;const status=document.querySelector('#checkout-status');
  if(!cart.count){status.textContent='Agrega productos antes de continuar.';return;}
  const data=Object.fromEntries([...new FormData(form)].map(([k,v])=>[k,String(v).trim()]));
  if(!data.name || !data.city || !data.address || !/^[+\d\s()-]{7,20}$/.test(data.phone)){status.textContent='Revisa tu nombre, teléfono, ciudad y dirección.';return;}
  if(!/^\d{10,15}$/.test(config.whatsapp)){status.textContent='Falta configurar el WhatsApp de la tienda. Edita whatsapp en js/config.js antes de recibir pedidos.';return;}
  const url=`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(orderMessage(data))}`;
  window.open(url,'_blank','noopener,noreferrer');status.textContent='Se abrió WhatsApp. Presiona Enviar allí para compartir tu pedido; la disponibilidad y el envío se confirman con la tienda.';
 });
}
