// Completar estos datos antes de recibir pedidos reales.
export const config = {
  name: 'Distrito Caps', currency: 'COP', locale: 'es-CO',
  whatsapp: '573238305353', 
  instagram: '', facebook: '',
  shipping: 'El costo y el tiempo de envío se confirman por WhatsApp según tu ciudad.',
};
export const money = value => new Intl.NumberFormat(config.locale, {style:'currency',currency:config.currency,maximumFractionDigits:0}).format(value);
