async function getSettings(){
  const {data,error}=await supabaseClient.from('site_settings').select('*').limit(1).maybeSingle();
  if(error) console.error(error); return data||{};
}
async function getProducts(category='all'){
  let q=supabaseClient.from('products').select('*').eq('active',true).order('sort_order',{ascending:true}).order('id',{ascending:true});
  if(category!=='all') q=q.eq('category',category);
  const {data,error}=await q; if(error) console.error(error); return data||[];
}
async function getPromotions(){
  const {data,error}=await supabaseClient.from('promotions').select('*').eq('active',true).order('id',{ascending:true});
  if(error) console.error(error); return data||[];
}
function waLink(number,text){
  const n=(number||'51944845342').replace(/\D/g,'');
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}
function productCard(p,settings){
  const media=p.image_url ? `<img class="product-image" src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}">` : `<div class="bottle"><div class="bottle-shape ${p.size_ml>=50?'circle':''}"></div></div>`;
  const old=p.old_price ? `<span class="old">Antes S/${Number(p.old_price).toFixed(2)}</span>` : '';
  return `<article class="card">${media}<div class="info"><h3>${escapeHtml(p.name)}</h3>${p.inspiration?`<p>Inspirado en ${escapeHtml(p.inspiration)}</p>`:''}<p>${p.size_ml} ml</p><div class="price">${old}<span class="${p.old_price?'offer':''}">S/${Number(p.price).toFixed(2)}</span></div><a class="wa" target="_blank" href="${waLink(settings.whatsapp,'Hola, quiero consultar/pedir: '+p.name+' ('+p.size_ml+' ml)')}">Pedir por WhatsApp</a></div></article>`;
}
function escapeHtml(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function applySettings(s){
  document.querySelectorAll('[data-store-name]').forEach(e=>e.textContent=s.store_name||'VELORIA Perfumería');
  document.querySelectorAll('[data-slogan]').forEach(e=>e.textContent=s.slogan||'Esencia que deja huella');
  document.querySelectorAll('[data-hero-title]').forEach(e=>e.textContent=s.hero_title||'Más que un aroma, una actitud.');
  document.querySelectorAll('[data-hero-text]').forEach(e=>e.textContent=s.hero_text||'Fragancias que definen tu esencia.');
}
