/* ============ Hải Chi Bakery — logic trang ============ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = (n) => Math.round(n).toLocaleString('vi-VN') + 'đ';
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* bỏ qua */ } },
};
const prod = (id) => PRODUCTS.find((p) => p.id === id);
const pic = (p) => (p.img ? `<img src="${p.img}" alt="${esc(p.name)}" loading="lazy">` : Art.render(p.art));
const rid = () => Math.random().toString(36).slice(2, 9);

/* ---------- State ---------- */
let cart = store.get('hc_cart', []);          // {uid,id,qty,tops:[],opts:{},note}
let users = store.get('hc_users', {});        // theo SĐT
let session = store.get('hc_session', null);
let reviews = store.get('hc_reviews', SEED_REVIEWS);
let voucherSel = '';                          // 'wallet:<id>' | 'code:<CODE>' | ''
const user = () => (session && users[session]) || null;
const saveCart = () => store.set('hc_cart', cart);
const saveUsers = () => store.set('hc_users', users);

/* ---------- Tiện ích UI ---------- */
let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600);
}
function openModal(html) {
  $('#modalBox').innerHTML = `<button class="icon-btn modal-close" aria-label="Đóng" data-close>✕</button>${html}`;
  $('#modal').hidden = false; document.body.style.overflow = 'hidden';
}
function closeModal() { $('#modal').hidden = true; document.body.style.overflow = ''; }
$('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal' || e.target.closest('[data-close]')) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); closeCart(); } });

/* ---------- Hạng thành viên ---------- */
function tierOf(u) { return [...TIERS].reverse().find((t) => u.lifetime >= t.min) || TIERS[0]; }
function nextTier(u) { return TIERS.find((t) => t.min > u.lifetime); }

/* ---------- Render thực đơn ---------- */
function productCard(p) {
  return `<article class="card product ${p.cat}" data-id="${p.id}">
    <div class="p-img ${p.img ? 'photo' : ''}">${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ''}${pic(p)}</div>
    <div class="p-body">
      <h3>${esc(p.name)}</h3>
      <div class="flavor">${esc(p.flavor)}</div>
      <p class="story">${esc(p.story)}</p>
      <button class="more" data-act="detail" data-id="${p.id}">Đọc câu chuyện</button>
      <div class="p-foot"><span class="price">${fmt(p.price)}</span>
        <button class="btn small" data-act="order" data-id="${p.id}">+ Order</button></div>
    </div></article>`;
}
function renderMenu() {
  $('#gridBanh').innerHTML = PRODUCTS.filter((p) => p.cat === 'banh').map(productCard).join('');
  $('#gridDrink').innerHTML = PRODUCTS.filter((p) => p.cat === 'drink').map(productCard).join('');
  $('#heroArt1').innerHTML = Art.render(prod('macaron').art);
  $('#heroArt2').innerHTML = Art.render(prod('sukem').art);
  $('#heroArt3').innerHTML = Art.render(prod('cheesecake').art);
  const sel = $('#reviewForm select[name=item]');
  PRODUCTS.forEach((p) => sel.insertAdjacentHTML('beforeend', `<option>${esc(p.name)}</option>`));
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  if (b.dataset.act === 'order') openOrder(b.dataset.id);
  if (b.dataset.act === 'detail') openOrder(b.dataset.id, true);
});

/* ---------- Modal chọn món ---------- */
function openOrder(id, showStory = false) {
  const p = prod(id), tops = TOPPINGS[p.cat];
  const isDrink = p.cat === 'drink';
  openModal(`<form id="orderForm" class="${p.cat}">
    <div class="m-top"><div class="m-img ${p.img ? 'photo' : ''}">${pic(p)}</div>
      <div><h3>${esc(p.name)}</h3><div class="flavor">${esc(p.flavor)}</div><div class="price">${fmt(p.price)}</div></div></div>
    <p class="m-story">${esc(p.story)}</p>
    ${isDrink ? `
      <div class="opt-title">Độ ngọt</div><div class="chips">${['100%', '70%', '50%', '30%'].map((v, i) => `<label class="chip"><input type="radio" name="sugar" value="${v}" ${i === 1 ? 'checked' : ''}><span>${v}</span></label>`).join('')}</div>
      <div class="opt-title">Lượng đá</div><div class="chips">${['Bình thường', 'Ít đá', 'Không đá'].map((v, i) => `<label class="chip"><input type="radio" name="ice" value="${v}" ${i === 0 ? 'checked' : ''}><span>${v}</span></label>`).join('')}</div>` : ''}
    <div class="opt-title">Topping gợi ý</div>
    <div class="chips">${tops.map((t) => `<label class="chip"><input type="checkbox" name="top" value="${t.id}"><span>${esc(t.name)} <small>+${fmt(t.price)}</small></span></label>`).join('')}</div>
    <div class="opt-title">Ghi chú cho tiệm</div>
    <textarea name="note" rows="2" maxlength="200" placeholder="${isDrink ? 'VD: ít kem, mang đi…' : 'VD: viết chữ “Happy Birthday”, ít ngọt…'}"></textarea>
    <div class="m-foot"><div class="qty"><button type="button" data-q="-1">−</button><span id="mq">1</span><button type="button" data-q="1">+</button></div>
      <button class="btn" type="submit">Thêm vào giỏ · <span id="mTotal">${fmt(p.price)}</span></button></div>
  </form>`);
  const f = $('#orderForm'); let q = 1;
  const recalc = () => {
    const add = $$('input[name=top]:checked', f).reduce((s, i) => s + tops.find((t) => t.id === i.value).price, 0);
    $('#mTotal').textContent = fmt((p.price + add) * q); $('#mq').textContent = q;
  };
  f.addEventListener('change', recalc);
  f.addEventListener('click', (e) => { const b = e.target.closest('[data-q]'); if (b) { q = Math.max(1, Math.min(20, q + +b.dataset.q)); recalc(); } });
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    addToCart({
      id, qty: q, tops: $$('input[name=top]:checked', f).map((i) => i.value),
      opts: isDrink ? { sugar: f.sugar.value, ice: f.ice.value } : {}, note: f.note.value.trim(),
    });
    closeModal(); toast(`Đã thêm ${p.name} vào giỏ 🛍️`);
  });
}

/* ---------- Giỏ hàng ---------- */
const unit = (l) => { const p = prod(l.id); return p.price + l.tops.reduce((s, t) => s + TOPPINGS[p.cat].find((x) => x.id === t).price, 0); };
function addToCart(item) {
  const key = (l) => JSON.stringify([l.id, l.tops.slice().sort(), l.opts, l.note]);
  const same = cart.find((l) => key(l) === key(item));
  if (same) same.qty = Math.min(50, same.qty + item.qty); else cart.push({ uid: rid(), ...item });
  saveCart(); renderCart(); bump();
}
function bump() { const b = $('#cartCount'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
function openCart() { renderCart(); $('#drawer').classList.add('open'); $('#drawer').setAttribute('aria-hidden', 'false'); $('#overlay').hidden = false; }
function closeCart() { $('#drawer').classList.remove('open'); $('#drawer').setAttribute('aria-hidden', 'true'); $('#overlay').hidden = true; }
$('#btnCart').onclick = openCart; $('#closeCart').onclick = closeCart; $('#overlay').onclick = closeCart;

/* Voucher: trả về {label, disc, err} */
function walletList() { const u = user(); return u ? u.vouchers : []; }
function resolveVoucher() {
  if (!voucherSel) return null;
  const [src, key] = voucherSel.split(':');
  if (src === 'wallet') { const v = walletList().find((x) => x.id === key); return v ? { ...v, src } : null; }
  if (src === 'code') { const c = PUBLIC_CODES[key]; return c ? { ...c, src, code: key } : null; }
  return null;
}
function calc() {
  const u = user();
  const sub = cart.reduce((s, l) => s + unit(l) * l.qty, 0);
  const tier = u ? tierOf(u) : null;
  const tierDisc = tier ? Math.round(sub * tier.disc) : 0;
  const base = sub - tierDisc;
  let vDisc = 0, vErr = '', v = resolveVoucher();
  if (v) {
    const cakes = cart.filter((l) => prod(l.id).cat === 'banh').map((l) => prod(l.id).price);
    const drinks = cart.filter((l) => prod(l.id).cat === 'drink').flatMap((l) => Array(l.qty).fill(prod(l.id).price));
    if (v.min && base < v.min) vErr = `Cần đơn tối thiểu ${fmt(v.min)}`;
    else if (v.type === 'percent') vDisc = Math.min(Math.round(base * v.value), v.max || Infinity);
    else if (v.type === 'amount') vDisc = Math.min(v.value, base);
    else if (v.type === 'freecake') { if (cakes.length) vDisc = Math.min(Math.min(...cakes), 55000); else vErr = 'Cần có ít nhất 1 bánh trong giỏ'; }
    else if (v.type === 'b1g1') { if (drinks.length >= 2) vDisc = Math.min(...drinks); else vErr = 'Cần ít nhất 2 thức uống trong giỏ'; }
    vDisc = Math.min(vDisc, base);
  }
  const total = Math.max(0, base - vDisc);
  return { sub, tier, tierDisc, v, vDisc, vErr, total, points: Math.floor(total / 10000) };
}

function suggestions() {
  const hasCake = cart.some((l) => prod(l.id).cat === 'banh'), hasDrink = cart.some((l) => prod(l.id).cat === 'drink');
  const inCart = new Set(cart.map((l) => l.id));
  if (!cart.length) return '';
  let pool = [];
  if (hasCake && !hasDrink) pool = ['cfmuoi', 'tstc', 'daocamsa'];
  else if (hasDrink && !hasCake) pool = ['sukem', 'cookie', 'croissant'];
  else pool = ['macaron', 'cookie', 'tranchau'].filter((x) => prod(x));
  pool = pool.filter((id) => prod(id) && !inCart.has(id)).slice(0, 3);
  const topSug = cart.some((l) => prod(l.id).cat === 'drink' && !l.tops.length) ? '<div class="hint">💡 Thức uống chưa có topping — thử thêm trân châu hoặc kem cheese cho đã nhé!</div>' : '';
  if (!pool.length && !topSug) return '';
  return `<div class="suggest"><h5>Hải Chi gợi ý ăn kèm</h5>
    <div class="sug-row">${pool.map((id) => { const p = prod(id); return `<button class="sug" data-sug="${id}">${pic(p)}<span>${esc(p.name)} · ${fmt(p.price)}</span></button>`; }).join('')}</div>${topSug}</div>`;
}

function renderCart() {
  const count = cart.reduce((s, l) => s + l.qty, 0);
  $('#cartCount').textContent = count;
  const body = $('#cartBody'), foot = $('#cartFoot');
  if (!cart.length) {
    body.innerHTML = `<div class="empty"><div class="big">🧺</div><p>Giỏ hàng đang trống.<br>Chọn một chiếc bánh xinh nào đó nhé!</p></div>`;
    foot.innerHTML = ''; return;
  }
  body.innerHTML = cart.map((l) => {
    const p = prod(l.id);
    const meta = [...Object.values(l.opts), ...l.tops.map((t) => '+ ' + TOPPINGS[p.cat].find((x) => x.id === t).name)].join(' · ');
    return `<div class="line ${p.cat}" data-uid="${l.uid}">
      <div class="thumb ${p.img ? 'photo' : ''}">${pic(p)}</div>
      <div><h4>${esc(p.name)}</h4>${meta ? `<div class="meta">${esc(meta)}</div>` : ''}
        <input class="note" data-note placeholder="Ghi chú cho món này…" maxlength="200" value="${esc(l.note)}"></div>
      <div class="line-right"><span class="price">${fmt(unit(l) * l.qty)}</span>
        <div class="qty"><button data-q="-1" aria-label="Giảm">−</button><span>${l.qty}</span><button data-q="1" aria-label="Tăng">+</button></div>
        <button class="rm" data-rm>Xóa</button></div></div>`;
  }).join('') + suggestions();

  const c = calc(), u = user();
  const opts = [`<option value="">— Không dùng voucher —</option>`,
    ...walletList().map((v) => `<option value="wallet:${v.id}" ${voucherSel === 'wallet:' + v.id ? 'selected' : ''}>🎟️ ${esc(v.label)}</option>`),
    ...Object.entries(PUBLIC_CODES).map(([k, v]) => `<option value="code:${k}" ${voucherSel === 'code:' + k ? 'selected' : ''}>🏷️ ${k} – ${esc(v.label)}</option>`)].join('');
  foot.innerHTML = `
    <div class="voucher-row"><select id="vSel" aria-label="Chọn voucher">${opts}</select></div>
    ${c.vErr ? `<div class="hint" style="color:#c4504a">⚠️ ${esc(c.vErr)}</div>` : ''}
    <div class="sum-row"><span>Tạm tính</span><span>${fmt(c.sub)}</span></div>
    ${c.tierDisc ? `<div class="sum-row disc"><span>${c.tier.icon} Ưu đãi hạng ${esc(c.tier.name)} (-${Math.round(c.tier.disc * 100)}%)</span><span>-${fmt(c.tierDisc)}</span></div>` : ''}
    ${c.vDisc ? `<div class="sum-row disc"><span>Voucher</span><span>-${fmt(c.vDisc)}</span></div>` : ''}
    <div class="sum-row total"><span>Tổng cộng</span><span>${fmt(c.total)}</span></div>
    <div class="pts-hint">${u ? `⭐ Đơn này tích <b>+${c.points} điểm</b> cho tài khoản ${esc(u.name)}.` : '⭐ <a href="#" id="loginHint" style="text-decoration:underline">Đăng nhập</a> để tích điểm &amp; nhận ưu đãi cho đơn này.'}</div>
    <button class="btn block" id="btnCheckout">Đặt hàng</button>`;
}
$('#drawer').addEventListener('click', (e) => {
  const line = e.target.closest('.line');
  if (line) {
    const l = cart.find((x) => x.uid === line.dataset.uid);
    const q = e.target.closest('[data-q]');
    if (q) { l.qty += +q.dataset.q; if (l.qty < 1) cart = cart.filter((x) => x !== l); saveCart(); renderCart(); }
    if (e.target.closest('[data-rm]')) { cart = cart.filter((x) => x !== l); saveCart(); renderCart(); }
  }
  const s = e.target.closest('[data-sug]');
  if (s) { addToCart({ id: s.dataset.sug, qty: 1, tops: [], opts: prod(s.dataset.sug).cat === 'drink' ? { sugar: '70%', ice: 'Bình thường' } : {}, note: '' }); toast('Đã thêm món gợi ý 💗'); }
  if (e.target.id === 'loginHint') { e.preventDefault(); closeCart(); openAccount(); }
  if (e.target.id === 'btnCheckout') openCheckout();
});
$('#drawer').addEventListener('input', (e) => {
  if (e.target.matches('[data-note]')) { const l = cart.find((x) => x.uid === e.target.closest('.line').dataset.uid); l.note = e.target.value; saveCart(); }
});
$('#drawer').addEventListener('change', (e) => { if (e.target.id === 'vSel') { voucherSel = e.target.value; renderCart(); } });

/* ---------- Thanh toán (demo — chưa có máy chủ) ---------- */
function openCheckout() {
  const u = user(), c = calc();
  if (c.vErr) { toast(c.vErr); return; }
  openModal(`<form id="coForm"><h3>Xác nhận đặt hàng</h3>
    <p class="hint">Tổng thanh toán: <b>${fmt(c.total)}</b></p>
    <div class="opt-title">Hình thức nhận</div>
    <div class="chips">${['Tại quán', 'Mang đi', 'Giao tận nơi'].map((v, i) => `<label class="chip"><input type="radio" name="mode" value="${v}" ${i === 1 ? 'checked' : ''}><span>${v}</span></label>`).join('')}</div>
    <div class="opt-title">Thông tin liên hệ</div>
    <div style="display:grid;gap:8px">
      <input name="name" required placeholder="Họ tên" value="${esc(u?.name || '')}" maxlength="50">
      <input name="phone" type="tel" required placeholder="Số điện thoại" pattern="0[0-9]{9}" title="SĐT gồm 10 số, bắt đầu bằng 0" value="${esc(u?.phone || '')}">
      <input name="addr" placeholder="Địa chỉ giao hàng (nếu chọn Giao tận nơi)" maxlength="150"></div>
    <div class="m-foot"><button type="button" class="btn ghost" data-close>Quay lại</button><button class="btn" type="submit">Gửi đơn hàng</button></div></form>`);
  $('#coForm').addEventListener('submit', (e) => {
    e.preventDefault(); const f = e.target;
    if (f.mode.value === 'Giao tận nơi' && !f.addr.value.trim()) { toast('Vui lòng nhập địa chỉ giao hàng'); return; }
    finishOrder({ mode: f.mode.value, name: f.name.value.trim(), phone: f.phone.value.trim(), addr: f.addr.value.trim() });
  });
}
function finishOrder(info) {
  const c = calc(), u = user(), code = 'HC' + Date.now().toString(36).toUpperCase().slice(-5);
  let msgs = [];
  if (u) {
    const before = tierOf(u);
    u.points += c.points; u.lifetime += c.points;
    const cakes = cart.filter((l) => prod(l.id).cat === 'banh').reduce((s, l) => s + l.qty, 0);
    const drinks = cart.filter((l) => prod(l.id).cat === 'drink').reduce((s, l) => s + l.qty, 0);
    if (c.v?.src === 'wallet') u.vouchers = u.vouchers.filter((v) => v.id !== c.v.id);
    // free cake / b1g1 đã dùng: trừ số lượng đã được tặng khỏi tem
    const freeCake = c.v?.type === 'freecake' && c.vDisc ? 1 : 0, freeDrink = c.v?.type === 'b1g1' && c.vDisc ? 1 : 0;
    u.stamps.banh += Math.max(0, cakes - freeCake); u.stamps.drink += Math.max(0, drinks - freeDrink);
    for (const k of ['banh', 'drink']) {
      while (u.stamps[k] >= STAMP_RULES[k].need) {
        u.stamps[k] -= STAMP_RULES[k].need;
        u.vouchers.push({ id: rid(), ...STAMP_RULES[k].reward }); msgs.push('🎁 ' + STAMP_RULES[k].reward.label);
      }
    }
    u.orders.unshift({ code, ts: Date.now(), total: c.total, n: cart.reduce((s, l) => s + l.qty, 0) });
    u.orders = u.orders.slice(0, 20);
    const after = tierOf(u);
    if (after.id !== before.id) msgs.push(`${after.icon} Chúc mừng! Bạn lên hạng ${after.name}`);
    saveUsers();
  }
  const sumTxt = `${cart.reduce((s, l) => s + l.qty, 0)} món`;
  cart = []; voucherSel = ''; saveCart(); renderCart(); renderLoyalty();
  openModal(`<div class="empty"><div class="big">🎉</div><h3>Cảm ơn ${esc(info.name)}!</h3>
    <p>Đơn <b>${code}</b> (${sumTxt}, ${fmt(c.total)}) – ${esc(info.mode)}.<br>Hải Chi sẽ gọi xác nhận qua số ${esc(info.phone)}.</p>
    ${u ? `<p style="margin-top:10px">⭐ Bạn được cộng <b>+${c.points} điểm</b>.</p>` : '<p class="hint" style="margin-top:10px">Đăng nhập để tích điểm cho những đơn sau nhé!</p>'}
    ${msgs.map((m) => `<p style="margin-top:6px;font-weight:600;color:var(--pink-d)">${esc(m)}</p>`).join('')}
    <p class="hint" style="margin-top:12px">(Đây là bản demo — đơn chưa được gửi đến hệ thống thật.)</p>
    <button class="btn" data-close style="margin-top:14px">Đóng</button></div>`);
  closeCart();
}

/* ---------- Tài khoản & tích điểm ---------- */
function newUser(name, phone, extra = {}) {
  return { name, phone, points: 0, lifetime: 0, joined: Date.now(), stamps: { banh: 0, drink: 0 }, vouchers: [{ id: rid(), label: 'Chào bạn mới – giảm 10% (tối đa 30k)', type: 'percent', value: 0.1, max: 30000 }], orders: [], monthClaimed: '', ...extra };
}
function openAccount() {
  const u = user();
  if (u) {
    openModal(`<h3>Xin chào, ${esc(u.name)} 💗</h3><p class="hint">SĐT ${esc(u.phone)} · thành viên từ ${new Date(u.joined).getFullYear()}</p>
      <div class="m-foot"><a class="btn ghost" href="#tich-diem" data-close>Xem tích điểm</a><button class="btn" id="logout">Đăng xuất</button></div>`);
    $('#logout').onclick = () => { session = null; store.set('hc_session', null); voucherSel = ''; closeModal(); refreshAll(); toast('Đã đăng xuất'); };
    return;
  }
  openModal(`<form id="loginForm"><h3>Đăng nhập / Đăng ký</h3>
    <p class="hint">Chỉ cần tên và số điện thoại. Dữ liệu lưu ngay trên trình duyệt này (bản demo).</p>
    <div style="display:grid;gap:8px;margin-top:10px"><input name="name" required placeholder="Họ tên" maxlength="50">
    <input name="phone" type="tel" required placeholder="Số điện thoại (10 số)" pattern="0[0-9]{9}" title="SĐT gồm 10 số, bắt đầu bằng 0"></div>
    <div class="m-foot"><button type="button" class="btn ghost small" id="demoVip">Dùng tài khoản VIP mẫu</button><button class="btn" type="submit">Tiếp tục</button></div></form>`);
  $('#loginForm').addEventListener('submit', (e) => {
    e.preventDefault(); const f = e.target, phone = f.phone.value.trim();
    if (!users[phone]) { users[phone] = newUser(f.name.value.trim(), phone); toast('Chào mừng bạn! Đã tặng voucher thành viên mới 🎟️'); }
    else toast('Chào mừng bạn quay lại 💗');
    session = phone; store.set('hc_session', phone); saveUsers(); closeModal(); refreshAll();
  });
  $('#demoVip').onclick = () => {
    const phone = '0900000001';
    users[phone] = users[phone] || newUser('Khách VIP mẫu', phone, { points: 140, lifetime: 850, joined: new Date('2021-03-01').getTime(), stamps: { banh: 4, drink: 3 }, vouchers: [{ id: rid(), label: 'Tặng 1 bánh miễn phí', type: 'freecake' }] });
    session = phone; store.set('hc_session', phone); saveUsers(); closeModal(); refreshAll(); toast('Đã đăng nhập tài khoản VIP mẫu 👑');
  };
}
$('#btnAccount').onclick = openAccount;

function renderLoyalty() {
  const el = $('#loyalty'), u = user();
  $('#btnAccount').textContent = u ? '👤 ' + u.name.split(' ').slice(-1)[0] : 'Đăng nhập';
  if (!u) {
    el.innerHTML = `<div class="loyal-grid">
      <div class="card how"><div class="ic">⭐</div><h3>Tích điểm mỗi đơn</h3><p>Mỗi 10.000đ = 1 điểm. Đổi điểm lấy voucher, bánh miễn phí và nâng hạng thành viên.</p></div>
      <div class="card how"><div class="ic">🍰</div><h3>Mua 6 bánh – tặng 1 bánh</h3><p>Thẻ tích bánh: đủ 6 bánh bất kỳ, chiếc tiếp theo (đến 55.000đ) Hải Chi tặng bạn.</p></div>
      <div class="card how"><div class="ic">🧋</div><h3>Mua 5 ly – mua 1 tặng 1</h3><p>Thẻ tích nước: đủ 5 thức uống, nhận voucher 1+1 cho ly rẻ hơn.</p></div></div>
      <div class="cta-center"><button class="btn" id="joinNow">Tham gia miễn phí – nhận voucher -10%</button></div>`;
    $('#joinNow').onclick = openAccount; return;
  }
  const t = tierOf(u), nx = nextTier(u);
  const pct = nx ? Math.min(100, ((u.lifetime - t.min) / (nx.min - t.min)) * 100) : 100;
  const stamps = (k, icon) => `<div class="stamps">${[...Array(STAMP_RULES[k].need)].map((_, i) => `<div class="stamp ${i < u.stamps[k] ? 'on' : ''}">${i < u.stamps[k] ? icon : ''}</div>`).join('')}<div class="stamp gift">🎁</div></div>`;
  const month = new Date().toISOString().slice(0, 7);
  const canMonthly = (t.id === 'vip' || t.id === 'kc') && u.monthClaimed !== month;
  el.innerHTML = `<div class="me">
    <div class="me-head"><div><h3>${esc(u.name)}</h3><span class="tier-pill">${t.icon} Hạng ${esc(t.name)}</span>
      <div style="font-size:.82rem;margin-top:6px;opacity:.9">Khách từ ${new Date(u.joined).getFullYear()} · SĐT ${esc(u.phone)}</div></div>
      <div class="pts"><b>${u.points}</b>điểm khả dụng<div class="progress"><i style="width:${pct}%"></i></div>
      <div style="font-size:.78rem;margin-top:4px">${nx ? `Còn ${nx.min - u.lifetime} điểm nữa lên ${esc(nx.name)}` : 'Bạn đã đạt hạng cao nhất 🎉'}</div></div></div>
    <div class="card"><h4>🍰 Thẻ tích bánh</h4><p class="hint">Mua đủ ${STAMP_RULES.banh.need} bánh – tặng 1 bánh miễn phí (${u.stamps.banh}/${STAMP_RULES.banh.need})</p>${stamps('banh', '🍰')}
      <h4 style="margin-top:18px">🧋 Thẻ tích nước</h4><p class="hint">Mua đủ ${STAMP_RULES.drink.need} ly – mua 1 tặng 1 (${u.stamps.drink}/${STAMP_RULES.drink.need})</p>${stamps('drink', '🧋')}</div>
    <div class="card"><h4>🎟️ Ví voucher (${u.vouchers.length})</h4>
      <div class="wallet">${u.vouchers.length ? u.vouchers.map((v) => `<div class="v"><span>${esc(v.label)}</span><button class="btn small" data-use="${v.id}">Dùng</button></div>`).join('') : '<p class="hint">Chưa có voucher. Mua thêm để nhận quà nhé!</p>'}</div>
      ${canMonthly ? `<button class="btn mint block" id="claimMonthly" style="margin-top:12px">🎁 Nhận voucher ${esc(t.name)} tháng này</button>` : ''}</div>
    <div class="card"><h4>⭐ Đổi điểm lấy quà</h4>
      ${REDEEMS.map((r, i) => `<div class="redeem"><span>${esc(r.label)}<br><small class="hint">${r.cost} điểm</small></span><button class="btn small ${u.points >= r.cost ? '' : 'ghost'}" data-redeem="${i}" ${u.points >= r.cost ? '' : 'disabled'}>Đổi</button></div>`).join('')}</div>
    <div class="card"><h4>🧾 Đơn gần đây</h4><ul class="orders">${u.orders.length ? u.orders.map((o) => `<li>${new Date(o.ts).toLocaleDateString('vi-VN')} · ${o.code} · ${o.n} món · ${fmt(o.total)}</li>`).join('') : '<li>Chưa có đơn nào.</li>'}</ul></div></div>`;
}
$('#loyalty').addEventListener('click', (e) => {
  const u = user(); if (!u) return;
  const use = e.target.closest('[data-use]');
  if (use) { voucherSel = 'wallet:' + use.dataset.use; openCart(); toast('Đã chọn voucher cho giỏ hàng'); }
  const rd = e.target.closest('[data-redeem]');
  if (rd) {
    const r = REDEEMS[+rd.dataset.redeem]; if (u.points < r.cost) return;
    u.points -= r.cost; u.vouchers.push({ id: rid(), ...r.v }); saveUsers(); renderLoyalty(); toast('Đổi quà thành công 🎁');
  }
  if (e.target.id === 'claimMonthly') {
    const t = tierOf(u);
    u.vouchers.push({ id: rid(), ...(t.id === 'kc' ? { label: 'Kim Cương: -40.000đ (đơn từ 100k)', type: 'amount', value: 40000, min: 100000 } : { label: 'VIP: -20.000đ (đơn từ 80k)', type: 'amount', value: 20000, min: 80000 }) });
    if (t.id === 'kc') u.vouchers.push({ id: rid(), label: 'Kim Cương: tặng 1 bánh miễn phí', type: 'freecake' });
    u.monthClaimed = new Date().toISOString().slice(0, 7); saveUsers(); renderLoyalty(); toast('Đã thêm voucher vào ví 🎟️');
  }
});

/* ---------- Hạng VIP ---------- */
function renderTiers() {
  const u = user(), cur = u ? tierOf(u).id : null;
  $('#tiers').innerHTML = TIERS.map((t) => `<div class="card tier ${t.id === cur ? 'current' : ''}">
    <div class="ic">${t.icon}</div><h3>${esc(t.name)}</h3><div class="min">${t.min ? `Từ ${t.min} điểm tích lũy` : 'Đăng ký là có'}</div>
    <div class="disc">${t.disc ? `-${Math.round(t.disc * 100)}%` : 'Quà chào mừng'}</div>
    <ul>${t.perks.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>`).join('');
}

/* ---------- Đánh giá ---------- */
function renderReviews() {
  const n = reviews.length, avg = n ? reviews.reduce((s, r) => s + r.stars, 0) / n : 0;
  const star = (k) => '★'.repeat(k) + '☆'.repeat(5 - k);
  $('#reviewSummary').className = 'card review-summary';
  $('#reviewSummary').innerHTML = `<div class="avg">${avg.toFixed(1)}</div><div class="stars">${star(Math.round(avg))}</div><p class="hint">${n} đánh giá</p>` +
    [5, 4, 3, 2, 1].map((k) => { const c = reviews.filter((r) => r.stars === k).length; return `<div class="bar"><span>${k}★</span><i><b style="width:${n ? (c / n) * 100 : 0}%"></b></i><span>${c}</span></div>`; }).join('');
  $('#reviewList').innerHTML = [...reviews].sort((a, b) => b.ts - a.ts).map((r) => `<article class="card review">
    <header><div class="r-who"><span class="avatar">${esc(r.name.trim()[0]?.toUpperCase() || '?')}</span><div><b>${esc(r.name)}</b><small>${esc(r.item || 'Chung về tiệm')} · ${new Date(r.ts).toLocaleDateString('vi-VN')}</small></div></div>
    <span class="stars">${star(r.stars)}</span></header><p>${esc(r.text)}</p></article>`).join('');
}
function setStars(v) {
  $('#reviewForm input[name=stars]').value = v;
  $$('#starsInput button').forEach((b, i) => b.classList.toggle('on', i < v));
}
$('#starsInput').innerHTML += [1, 2, 3, 4, 5].map((i) => `<button type="button" data-s="${i}" aria-label="${i} sao">★</button>`).join('');
$('#starsInput').addEventListener('click', (e) => { const b = e.target.closest('[data-s]'); if (b) setStars(+b.dataset.s); });
setStars(5);
$('#reviewForm').addEventListener('submit', (e) => {
  e.preventDefault(); const f = e.target;
  reviews.unshift({ name: f.name.value.trim(), stars: +f.stars.value, item: f.item.value, text: f.text.value.trim(), ts: Date.now() });
  store.set('hc_reviews', reviews); f.reset(); setStars(5); renderReviews(); toast('Cảm ơn bạn đã đánh giá 💗');
});

/* ---------- Hỏi đáp ---------- */
function renderFaq(q = '') {
  const k = q.trim().toLowerCase();
  const list = FAQS.filter((f) => !k || (f.q + ' ' + f.a).toLowerCase().includes(k));
  $('#faqList').innerHTML = list.length ? list.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('') : '<p class="hint">Chưa có câu trả lời phù hợp — hãy gửi câu hỏi bên dưới nhé.</p>';
}
$('#faqSearch').addEventListener('input', (e) => renderFaq(e.target.value));
$('#askForm').addEventListener('submit', (e) => {
  e.preventDefault(); const f = e.target, qs = store.get('hc_questions', []);
  qs.push({ q: f.q.value.trim(), contact: f.contact.value.trim(), ts: Date.now() }); store.set('hc_questions', qs);
  f.reset(); toast('Đã gửi câu hỏi! Tiệm sẽ phản hồi sớm 💌');
});

/* ---------- Khởi tạo ---------- */
function refreshAll() { renderCart(); renderLoyalty(); renderTiers(); }
$('#cAddr').textContent = CONFIG.address; $('#cHours').textContent = CONFIG.hours;
$('#cPhone').textContent = CONFIG.phone; $('#cMail').textContent = CONFIG.email;
$('#year').textContent = new Date().getFullYear();
$('#burger').onclick = () => { const o = $('#menu').classList.toggle('open'); $('#burger').setAttribute('aria-expanded', o); };
$('#menu').addEventListener('click', (e) => { if (e.target.tagName === 'A') $('#menu').classList.remove('open'); });
renderMenu(); renderReviews(); renderFaq(); refreshAll();
