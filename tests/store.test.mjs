import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFileSync} from 'node:fs';
globalThis.localStorage={getItem:()=>JSON.stringify([{id:'missing',quantity:2,variant:'x'}]),setItem:()=>{}};
globalThis.window=new EventTarget();
const {products}=await import('../js/data/products.js');
const {cart}=await import('../js/cart.js');
const {orderMessage}=await import('../js/checkout.js');
test('catalog: unique identifiers and real optimized images',()=>{assert.equal(new Set(products.map(p=>p.id)).size,products.length);assert.equal(products.length,119);for(const p of products){assert(p.price>0);assert(p.images.every(existsSync));}});
test('reviewed photo categories and descriptive names remain aligned',()=>{
 const metadata=JSON.parse(readFileSync('assets/image-metadata.json','utf8'));
 for(const m of metadata){const p=products.find(p=>p.id===m.id);assert.equal(p.name,m.name);assert.equal(p.category,m.category);assert.equal(p.images[0],`assets/products/${m.filename}`);if(m.original.startsWith('28000'))assert.equal(p.category,'gorras');if(m.original.startsWith('30000'))assert.equal(p.category,'billeteras');}
 assert.equal(products.filter(p=>p.category==='gorras').length,83);
 assert.equal(products.filter(p=>p.category==='sombreros').length,8);
 assert.equal(products.filter(p=>p.category==='billeteras').length,28);
});
test('cart: stale entries, quantities, totals and WhatsApp message',()=>{assert.equal(cart.count,0);const p=products[0];cart.add(p.id,p.variants[0],2);cart.add(p.id,p.variants[0],1);assert.equal(cart.items.length,1);assert.equal(cart.total,p.price*3);cart.update(0,-1);assert.equal(cart.count,3);cart.update(0,4);assert.equal(cart.total,p.price*4);const msg=orderMessage({name:'Ana & Luis',phone:'3001234567',city:'Bogotá',address:'Calle 1 # 2',notes:'Sin timbre'});assert(msg.includes('Ana & Luis'));assert(msg.includes(p.name));assert(msg.includes('Envío por confirmar'));assert.equal(decodeURIComponent(encodeURIComponent(msg)),msg);cart.remove(0);assert.equal(cart.total,0);});
