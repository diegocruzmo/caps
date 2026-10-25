import {products} from './data/products.js';
const key = 'distrito-cart-v1';
function restore() {
  try { const data = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(data) ? data.filter(x => products.some(p=>p.id===x.id && p.available && p.variants.includes(x.variant)) && Number.isInteger(x.quantity) && x.quantity>0 && x.quantity<=99).map(({id,variant,quantity})=>({id,variant,quantity})) : []; } catch { return []; }
}
let items = restore();
export const cart = {
  get items(){ return items.map(x=>({...x})); },
  get count(){ return items.reduce((n,x)=>n+x.quantity,0); },
  get total(){ return items.reduce((n,x)=>n+products.find(p=>p.id===x.id).price*x.quantity,0); },
  add(id,variant,quantity=1){ const p=products.find(p=>p.id===id); if(!p?.available || !p.variants.includes(variant) || !Number.isInteger(quantity) || quantity<1 || quantity>99) return; const existing=items.find(x=>x.id===id&&x.variant===variant); if(existing) existing.quantity=Math.min(99,existing.quantity+quantity); else items.push({id,variant,quantity}); this.save(); },
  update(index,quantity){if(!items[index] || !Number.isInteger(quantity) || quantity<1 || quantity>99)return;items[index].quantity=quantity;this.save();},
  remove(index){items.splice(index,1);this.save();},
  save(){try{localStorage.setItem(key,JSON.stringify(items));}catch{} window.dispatchEvent(new Event('cartchange'));},
};
