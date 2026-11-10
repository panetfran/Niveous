// 本件由 tools/assemble.py 生成·勿手改：首屏 JS 分片（进这一页那一刻才取），源＝js/ 那些拆分件
(function () {
const btn = document.querySelector('#coupleView .lo-setbtn');
const topbar = document.querySelector('header.topbar');
if (btn && topbar) topbar.appendChild(btn);
})();
const LO_CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 12.5l5 5 10-11"/></svg>';
const LO_NOTE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V6l10-2v11"/><circle cx="6.5" cy="18" r="2.6"/><circle cx="16.5" cy="15" r="2.6"/></svg>';
const LO_EDIT_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l4.4-1.1L19.8 7.5a2 2 0 0 0 0-2.8l-1.5-1.5a2 2 0 0 0-2.8 0L4.1 14.6 3 19z"/></svg>';
const LO_SET_TABS = [['face', '门面'], ['bg', '背景'], ['stk', '贴纸'], ['font', '字体'], ['plan', '方案']];
const LO_SET_TAB_KEY = 'ordinal-couple-set-tab';
let _loSetTab = '';
function _loSetTabOf() {
if (!_loSetTab) {
let v = '';
try { v = localStorage.getItem(LO_SET_TAB_KEY) || ''; } catch (e) {}
_loSetTab = LO_SET_TABS.some(t => t[0] === v) ? v : 'bg';
}
return _loSetTab;
}
function _loSetPaintTabs() {
const host = document.getElementById('loSetBody');
if (!host) return;
const cur = _loSetTabOf();
const tabs = host.querySelectorAll('[data-setab]');
for (let i = 0; i < tabs.length; i++) tabs[i].classList.toggle('on', tabs[i].dataset.setab === cur);
const secs = host.querySelectorAll('[data-lo-sec]');
for (let i = 0; i < secs.length; i++) secs[i].hidden = secs[i].dataset.loSec !== cur;
}
function _loSetTabSet(t) {
if (!LO_SET_TABS.some(x => x[0] === t) || t === _loSetTabOf()) return;
_loSetTab = t;
try { localStorage.setItem(LO_SET_TAB_KEY, t); } catch (e) {}
_loSetPaintTabs();
}
let _loAdding = false;
let _loPlanAdding = false;
let _loMoodPick = false;
let _loEditId = '';
let _loHeroEdit = '';
let _loDoneOpen = false;
let _loLedOpen = false;
let _loLedDel = -1;
let _loLpAt = 0;
let _loLpTimer = null, _loLpX = 0, _loLpY = 0;
function _loLpClear() { if (_loLpTimer) { clearTimeout(_loLpTimer); _loLpTimer = null; } }
function _loCid() { const c = currentContact(); return (c && c.kind !== 'group') ? c.id : ''; }
function _loContact() { const c = currentContact(); return (c && c.kind !== 'group') ? c : null; }
function coupleOf(cid) {
return (data.couple && data.couple[cid] && typeof data.couple[cid] === 'object' && !Array.isArray(data.couple[cid])) ? data.couple[cid] : null;
}
function _coupleEnsure(cid) {
if (!data.couple || typeof data.couple !== 'object') data.couple = {};
let o = data.couple[cid];
if (!o || typeof o !== 'object' || Array.isArray(o)) {
o = { name: '', sign: '', list: [], ledger: [], ledgerDay: '', look: _loLookDefault() };
data.couple[cid] = o;
}
return o;
}
function _loLookDefault() {
return { bg: '', bgLuma: null, bgFollow: true, bgFx: '', paper: '', glow: 0, font: '', heroLy: '', avFrame: '', stkFam: '', stkOn: true, dz: null, dzDay: '' };
}
let _loLumaAt = { src: '', v: null };
function _loInheritLuma(src) {
if (!src || typeof _imgLuma !== 'function') return;
if (_loLumaAt.src === src) return;
_loLumaAt = { src: src, v: null };
try {
_imgLuma(src).then(v => {
if (_loLumaAt.src !== src || typeof v !== 'number' || !isFinite(v)) return;
_loLumaAt.v = Math.round(v * 1000) / 1000;
if (document.body.dataset.view === 'couple') _loApplyLook();
}).catch(() => {});
} catch (e) {}
}
function _loApplyLook() {
const view = document.getElementById('coupleView');
if (!view) return;
const cid = _loCid();
const o = coupleOf(cid);
const look = (o && o.look) || {};
let bgSrc = look.bg || '';
let bgLuma = (typeof look.bgLuma === 'number' && isFinite(look.bgLuma)) ? look.bgLuma : null;
if (!bgSrc && look.bgFollow !== false) {
const ca = (data.chatAppearance || {})[cid];
if (ca && typeof ca.chatBg === 'string' && ca.chatBg) {
bgSrc = ca.chatBg;
bgLuma = (typeof ca.chatBgLuma === 'number' && isFinite(ca.chatBgLuma)) ? ca.chatBgLuma : null;
if (bgLuma === null) { _loInheritLuma(bgSrc); bgLuma = (_loLumaAt.src === bgSrc) ? _loLumaAt.v : null; }
}
}
if (bgSrc) {
view.style.setProperty('--lo-bg', 'url("' + bgSrc + '")');
const cover = (bgLuma === null) ? true : (bgLuma < 0.72);
if (cover) view.setAttribute('data-lo-cover', 'on');
else view.removeAttribute('data-lo-cover');
const l = bgLuma;
const a = l === null ? 0.55 : (l <= 0.28 ? 0.72 : (l >= 0.72 ? 0.42 : 0.55));
view.style.setProperty('--lo-veils', 'linear-gradient(rgba(255,255,255,' + a + '),rgba(255,255,255,' + Math.max(0.35, a - 0.12) + '))');
} else {
view.style.removeProperty('--lo-bg');
view.style.removeProperty('--lo-veils');
view.removeAttribute('data-lo-cover');
}
view.style.removeProperty('--lo-accent');
if (look.paper === 'paper') view.setAttribute('data-lo-paper', 'paper');
else view.removeAttribute('data-lo-paper');
if (bgSrc && look.bgFx === 'blur') view.setAttribute('data-lo-bgfx', 'blur');
else view.removeAttribute('data-lo-bgfx');
if (bgSrc && look.bgFx === 'dim') view.style.setProperty('--lo-dim', 'linear-gradient(rgba(22,18,14,.32),rgba(22,18,14,.32))');
else view.style.removeProperty('--lo-dim');
const glow = (typeof look.glow === 'number' && isFinite(look.glow)) ? Math.min(30, Math.max(0, look.glow)) : 0;
if (glow > 0) view.style.setProperty('--lo-glow-a', String(glow / 30));
else view.style.removeProperty('--lo-glow-a');
if (look.heroLy === 'tilt' || look.heroLy === 'stamp') view.setAttribute('data-lo-heroly', look.heroLy);
else view.removeAttribute('data-lo-heroly');
if (look.avFrame === 'squircle' || look.avFrame === 'frame') view.setAttribute('data-lo-av', look.avFrame);
else view.removeAttribute('data-lo-av');
_loFontApply(look);
}
function _loSwap(fn) {
if (typeof apSwapFade === 'function') { try { apSwapFade(fn); return; } catch (e) {} }
fn();
}
function _loFontApply(look) {
const view = document.getElementById('coupleView');
if (!view) return;
let faces = '', fam = '';
const id = look && typeof look.font === 'string' ? look.font : '';
const lib = (data.apAssets && data.apAssets.font) || {};
if (id && lib[id] && typeof lib[id].css === 'string') {
const raw = lib[id].css;
faces = (raw.match(/@font-face\s*\{[^}]*\}/g) || []).join('\n');
const m = faces.match(/font-family:\s*([^;}]+)/);
if (m) fam = m[1].trim().replace(/^["']|["']$/g, '');
}
let st = document.getElementById('loFontStyle');
if (!st) { st = document.createElement('style'); st.id = 'loFontStyle'; document.head.appendChild(st); }
st.textContent = faces;
if (fam) view.style.setProperty('--lo-font', '"' + fam + '"');
else view.style.removeProperty('--lo-font');
}
const LO_PLAN_KEYS = ['bg', 'bgLuma', 'bgFx', 'paper', 'glow', 'font', 'heroLy', 'avFrame'];
function _loPlanSnap(look) {
const out = {};
LO_PLAN_KEYS.forEach(k => { out[k] = look[k]; });
return out;
}
function _loPlanLib() {
if (!Array.isArray(data.couplePlans)) data.couplePlans = [];
return data.couplePlans;
}
function _loStkPoolText(cid) {
const sel = (data.apRand && data.apRand.by && data.apRand.by[cid] && Array.isArray(data.apRand.by[cid].stk)) ? data.apRand.by[cid].stk.filter(x => typeof x === 'string' && x).length : 0;
return sel ? ('已勾 ' + sel + ' 枚——只从勾的这一份里掷（在美化库改）') : '全池随机：自带的 emoji ＋ 美化库里传过的图';
}
function _loStkTick(cid, force) {
const o = _coupleEnsure(cid);
const look = o.look;
if (!force && look.stkOn === false) return false;
const dk = (typeof dressDayKey === 'function') ? dressDayKey() : new Date().toLocaleDateString('zh-CN');
if (!force && look.dzDay === dk) return false;
if (typeof dzPoolIds !== 'function' || typeof dzRollPlan !== 'function' || dzPoolIds(cid).length < 2) return false;
if (!force && Math.random() >= 0.45) { look.dzDay = dk; save(); return false; }
let wave = null;
if (look.stkFam && typeof DZ_FAMILIES !== 'undefined') {
const fam = DZ_FAMILIES.find(f => f.key === look.stkFam);
const pool = dzPoolIds(cid);
const ids = fam ? fam.list.map(e => DZ_EM_PREFIX + e).filter(id => pool.indexOf(id) >= 0) : [];
if (ids.length >= 2) wave = ids;
}
const plan = dzRollPlan('chat', look.dz && look.dz.tpl ? look.dz.tpl : '', '', cid, wave);
look.dzDay = dk;
if (plan) look.dz = { tpl: plan.tpl, items: plan.items, at: plan.at };
save();
return !!plan;
}
function _loHearts(x, y) {
for (let i = 0; i < 3; i++) {
const s = document.createElement('span');
s.className = 'lo-fly';
s.textContent = '♥';
s.style.left = (x + (i - 1) * 16 + Math.round(Math.random() * 10 - 5)) + 'px';
s.style.top = (y - 6) + 'px';
s.style.animationDelay = (i * 90) + 'ms';
s.addEventListener('animationend', () => s.remove());
document.body.appendChild(s);
}
}
function _loSecHd(t, n, act, cmd, sub) {
return '<div class="lo-sec-hd"><span class="lo-sec-t">' + t + '</span>' + (n ? '<span class="lo-sec-n">' + n + '</span>' : '')
+ (act ? '<button type="button" class="lo-sec-act" data-locmd="' + cmd + '">' + act + '</button>' : '') + '</div>'
+ (sub ? '<p class="lo-sec-sub">' + sub + '</p>' : '');
}
const LO_SEEN_KEY = 'ordinal-couple-seen';
function _loFirstLook() {
let seen = true;
try { seen = !!localStorage.getItem(LO_SEEN_KEY); } catch (e) { return false; }
if (seen) return false;
try { localStorage.setItem(LO_SEEN_KEY, '1'); } catch (e) {}
return true;
}
function _loDaysIntro(host) {
const dEl = host.querySelector('.lo-days b');
const n = dEl ? (Number(dEl.textContent) || 0) : 0;
if (!(n > 0) || !_loFirstLook()) return false;
host.classList.add('lo-anim');
_loCountUp(dEl, n);
return true;
}
function _loCountUp(el, n) {
if (!el) return;
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = n; return; }
const t0 = performance.now(), D = 800;
const step = t => {
const k = Math.max(0, Math.min(1, (t - t0) / D)), e = 1 - Math.pow(1 - k, 3);
el.textContent = Math.round(n * e);
if (k < 1) requestAnimationFrame(step); else el.textContent = n;
};
requestAnimationFrame(step);
}
function _loNextHTML(main) {
if (!main || typeof _annNext !== 'function') return '';
const nx = _annNext(main.date);
if (!nx || !(nx.date instanceof Date) || !(nx.cd >= 0)) return '';
const gone = nx.cd === 0 ? 100 : Math.min(98, Math.max(2, Math.round((1 - nx.cd / 365) * 100)));
return '<div class="lo-next"><span class="t">' + escapeHTML(main.name || '纪念日') + ' · '
+ (nx.date.getMonth() + 1) + '月' + nx.date.getDate() + '日'
+ (nx.cd === 0 ? ' · 就是今天' : ' · 还有 ' + nx.cd + ' 天') + '</span>'
+ '<span class="bar"><i style="width:' + gone + '%"></i></span></div>';
}
var _loAnnYm = null;
var _loAnnSel = null;
function _loAnnSelText(ds) {
const d = new Date(ds + 'T00:00:00');
if (isNaN(d.getTime())) return '选一天';
const wd = '日一二三四五六'[d.getDay()];
const n = (typeof _annDays === 'function') ? _annDays(ds) : 0;
return d.getFullYear() + ' 年 ' + (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日 · 周' + wd
+ (n > 0 ? ' · 在一起第 ' + n + ' 天' : '');
}
function _loAnnBodyHTML() {
return '<div class="lo-ann">'
+ '<p class="lo-ann-tip">选你们在一起的第一天 · 今天的和更早的都能选</p>'
+ '<div class="lo-ann-sel" id="loAnnSelText"></div>'
+ _ANN_CAL_NAV + _ANN_CAL_MONTHS + '<div class="ann-cal-grid"></div>'
+ '<p class="lo-ann-warn" id="loAnnWarn" hidden></p>'
+ '<div class="ann-panel-foot">'
+ '<button type="button" class="soft-btn" data-locmd="annquit">取消</button>'
+ '<button type="button" class="soft-btn ann-ok" data-locmd="annok">存下</button>'
+ '</div></div>';
}
function _loAnnPaint() {
const host = document.getElementById('loAnnBody');
const panel = host && host.querySelector('.lo-ann');
if (!panel || !_loAnnSel || !_loAnnYm) return;
_annCalPaint(panel, _loAnnYm, _loAnnSel.v);
const today = _annToday();
const cells = panel.querySelectorAll('.ann-cal-cell[data-d]');
for (let i = 0; i < cells.length; i++) cells[i].classList.toggle('off', cells[i].dataset.d > today);
const tx = document.getElementById('loAnnSelText');
if (tx) tx.textContent = _loAnnSelText(_loAnnSel.v);
const warn = document.getElementById('loAnnWarn');
if (warn) warn.hidden = true;
}
function _loAnnSheet(cid) {
const go = () => {
const m = document.getElementById('loAnnMask');
const host = document.getElementById('loAnnBody');
if (!m || !host || typeof _annCalPaint !== 'function') return;
const main = (typeof annMainFor === 'function') ? annMainFor(cid) : null;
const d0 = (main && !main.yearly && typeof _annNormDate === 'function' && _annNormDate(main.date)) || _annToday();
_loAnnSel = { v: d0 };
const p = d0.split('-');
_loAnnYm = { y: +p[0], m: +p[1] - 1 };
host.innerHTML = _loAnnBodyHTML();
m.hidden = false;
_loAnnPaint();
const panel = host.querySelector('.lo-ann');
_annCalNavBind(panel, _loAnnYm, _loAnnPaint);
_annCalMonthBind(panel, _loAnnYm, _loAnnPaint);
panel.querySelector('.ann-cal-grid').onclick = e => {
const cell = e.target.closest('.ann-cal-cell[data-d]');
if (!cell) return;
if (cell.dataset.d > _annToday()) {
const w = document.getElementById('loAnnWarn');
if (w) { w.textContent = '在一起的第一个日子不能是以后——选今天或更早的一天'; w.hidden = false; }
return;
}
_loAnnSel.v = cell.dataset.d;
_loAnnPaint();
};
m.onclick = e => {
if (e.target === m) { m.hidden = true; return; }
const cmd = e.target.closest('[data-locmd]');
if (!cmd) return;
if (cmd.dataset.locmd === 'annquit') { m.hidden = true; return; }
if (cmd.dataset.locmd === 'annok') _loAnnCommit(cid);
};
};
if (typeof _annCalPaint === 'function' && typeof _ANN_CAL_NAV === 'string') { go(); return; }
if (typeof ensureChunk === 'function') { ensureChunk('anniv').then(ok => { if (ok) go(); else showView('anniversary'); }); return; }
showView('anniversary');
}
function _loAnnCommit(cid) {
const m = document.getElementById('loAnnMask');
const ds = _loAnnSel && _loAnnSel.v;
if (!ds) return;
const rec = (typeof annSetTogether === 'function') ? annSetTogether(cid, ds) : null;
if (!rec) {
const w = document.getElementById('loAnnWarn');
if (w) { w.textContent = '这个日子记不下来——选今天或更早的一天'; w.hidden = false; }
return;
}
save();
if (m) m.hidden = true;
if (typeof _annRefreshChat === 'function') _annRefreshChat();
if (document.body.dataset.view === 'couple' && _loCid() === cid) _loRepaint(cid);
showToast('记下了 · 在一起第 ' + ((typeof _annDays === 'function') ? _annDays(ds) : 1) + ' 天');
}
function _loHeroHTML(ta, cid) {
const o = coupleOf(cid) || {};
const taName = fixedNameOf(ta) || chatNameOf(ta) || 'TA';
const nm = o.name || (taName + ' 和我');
const sign = o.sign || '愿所有平淡的日子都有回响';
const main = (typeof annMainFor === 'function') ? annMainFor(cid) : null;
let days = '';
if (main && !main.yearly && typeof _annDays === 'function') {
const d = _annDays(main.date);
if (d > 0) days = '<b>' + d + '</b><i>天</i>';
}
const nxt = (main && main.yearly) ? _loNextHTML(main) : '';
const nameHtml = (_loHeroEdit === 'name')
? '<input class="lo-hero-inp" id="loHeroInp" data-lohero="name" maxlength="16" value="' + escapeHTML(o.name || '') + '" placeholder="默认＝「' + escapeHTML(taName) + ' 和我」">'
: '<div class="lo-name" data-loedit="name" title="长按改空间名">' + escapeHTML(nm) + '</div>';
const signHtml = (_loHeroEdit === 'sign')
? '<input class="lo-hero-inp lo-hero-inp-sign" id="loHeroInp" data-lohero="sign" maxlength="30" value="' + escapeHTML(o.sign || '') + '" placeholder="写一句挂在门上">'
: '<span class="lo-sign" data-loedit="sign" title="长按改这一句">' + escapeHTML(sign) + '</span>';
return '<div class="lo-hero">'
+ '<span class="cl-en mono">COUPLE</span>'
+ '<div class="lo-avs"><span class="lo-av">' + avatarHTML(chatAvatarOf(ta)) + '</span>'
+ '<span class="lo-av me">' + avatarHTML(chatMyAvatar()) + '</span></div>'
+ nameHtml
+ signHtml
+ (days ? '<button type="button" class="lo-days-btn" data-locmd="annedit" title="点一下改这一天"><span class="lo-days">' + days + '</span></button>' : '')
+ nxt
+ (!main
? '<button type="button" class="lo-hero-empty" data-locmd="annset">'
+ '<span class="e" aria-hidden="true">＋</span>'
+ '<span class="tx"><span class="t">立一个「在一起」的日子</span>'
+ '<span class="s">点一下选日期，这里就开始数你们在一起的天数</span></span></button>'
: (main.yearly
? '<button type="button" class="lo-hero-empty thin" data-locmd="annset">'
+ '<span class="e" aria-hidden="true">＋</span>'
+ '<span class="tx"><span class="t">这条是每年重复的日子</span>'
+ '<span class="s">数不出天数——点一下，改成你们在一起的第一天</span></span></button>'
: ''))
+ (function () {
const rows = (typeof annList === 'function')
? annList().filter(a => a && a.date && (a.contactId === cid || !a.contactId)).slice(0, 2) : [];
if (!rows.length) return '';
const items = rows.map(a => {
const md = (typeof _annNormDate === 'function' && _annNormDate(a.date)) || a.date || '';
const p = String(md).split('-');
const mdCN = p.length >= 3 ? (+p[1]) + '月' + (+p[2]) + '日' : escapeHTML(md);
return '<span class="lo-ann-it">' + escapeHTML(a.name || (a.main ? '在一起的日子' : '纪念日')) + ' ' + mdCN + '</span>';
}).join('<i class="lo-ann-dot" aria-hidden="true">·</i>');
return '<div class="lo-ann-row">' + items
+ '<button type="button" class="lo-ann-all" data-locmd="annlist">全部日子</button></div>';
})()
+ '</div>';
}
function _loMoodsHTML(ta, cid) {
const key = (typeof calTodayKey === 'function') ? calTodayKey() : '';
const day = (key && typeof calDayPeek === 'function') ? calDayPeek(key) : null;
const has = m => !!(m && (m.k || m.e || m.t));
const taM = (day && day.ta && has(day.ta[cid])) ? day.ta[cid] : null;
const myM = (day && has(day.my)) ? day.my : null;
const taName = fixedNameOf(ta) || chatNameOf(ta) || 'TA';
const catOf = m => (m && CAL_MOOD_OF && CAL_MOOD_OF[m.k]) ? (CAL_MOOD_OF[m.k].cat || '') : '';
const box = (m, who, isMe) => {
const cmd = isMe ? 'mypick' : 'calday';
const tip = isMe ? (m ? '改一下今天的心情' : '记一下今天的心情') : '去日历看这一天';
const pencil = isMe ? '<span class="lo-mood-edit" aria-hidden="true">' + LO_EDIT_SVG + '</span>' : '';
return m
? '<button type="button" class="lo-mood' + (isMe ? ' is-me' : '') + '" data-cat="' + catOf(m) + '" data-locmd="' + cmd + '" title="' + tip + '" aria-label="' + tip + '">' + pencil + '<span class="e">' + escapeHTML(m.e || '🤍') + '</span><span class="t">' + escapeHTML(m.t || '') + '</span><span class="w">' + who + '</span></button>'
: '<button type="button" class="lo-mood empty' + (isMe ? ' is-me' : '') + '" data-locmd="' + cmd + '" title="' + tip + '" aria-label="' + tip + '">' + pencil + '<span class="e">🤍</span><span class="t">今天还没记</span><span class="w">' + who + '</span></button>';
};
return '<div class="lo-sec" id="loMoods">' + _loSecHd('今天我们记下的心情', '', '去日历', 'cal', '只记你们自己写下的 · TA 此刻的状态在家园')
+ '<div class="lo-moods">' + box(taM, taName, false) + box(myM, '我', true) + '</div>'
+ (_loMoodPick ? _loMoodPickHTML() : '')
+ '</div>';
}
function _loMoodPickHTML() {
const key = (typeof calTodayKey === 'function') ? calTodayKey() : '';
const cur = (key && typeof calDayPeek === 'function') ? (calDayPeek(key) || {}).my : null;
const list = (typeof CAL_MOODS !== 'undefined') ? CAL_MOODS : [];
return '<div class="lo-pick">'
+ '<div class="lo-pick-hd"><span>选一个心情</span><button type="button" class="lo-pick-x" data-locmd="mypickclose">收起</button></div>'
+ '<div class="lo-pick-grid">' + list.map(m =>
'<button type="button" class="lo-mpick' + (cur && cur.k === m.k ? ' on' : '') + '" data-mpick="' + m.k + '"><span class="e">' + m.e + '</span><span class="t">' + m.t + '</span></button>').join('') + '</div>'
+ '<p class="lo-pick-note">记下之后，日历那一格也会跟着变。</p>'
+ '</div>';
}
function _loMoodsRepaint(cid) {
const el = document.getElementById('loMoods');
const ta = _loContact();
if (el && ta) el.outerHTML = _loMoodsHTML(ta, cid);
}
function _loListenHTML(cid) {
const t = (typeof plCur === 'function') ? plCur() : null;
const playing = !!window.__plPlaying;
const together = (typeof _plWith === 'function') && _plWith() === cid;
let body;
if (!t) {
body = '<button type="button" class="lo-listen" data-locmd="player"><span class="lo-cover">' + LO_NOTE_SVG + '</span>'
+ '<span class="lo-lmain"><span class="lo-lname">还没在放歌</span><span class="lo-lart">去播放器挑一首，这里就亮起来</span></span></button>';
} else {
const state = together ? (playing ? '正在一起听' : '一起听 · 暂停中') : (playing ? '正在播放' : '一起听');
const pic = t.pic ? '<img src="' + escapeHTML(t.pic) + '" alt="" decoding="async">' : LO_NOTE_SVG;
const prog = (playing && typeof _plProgNow === 'function') ? '<i class="lo-lprog" id="loLprog"></i>' : '';
const recN = (typeof _plRoot === 'function' && _plRoot() && Array.isArray(_plRoot().recent)) ? _plRoot().recent.length : 0;
const num = recN ? '<span class="lo-lnum">曲库已播过 ' + recN + ' 首</span>' : '';
body = '<button type="button" class="lo-listen" data-locmd="player"><span class="lo-cover' + (playing && t.pic ? ' spin' : '') + '">' + pic + '</span>'
+ '<span class="lo-lmain"><span class="lo-lname">' + escapeHTML(t.name || '未命名') + '</span>'
+ '<span class="lo-lart">' + escapeHTML(t.artist || '') + '</span>' + num + '</span>'
+ '<span class="lo-lstate' + (together && playing ? ' on' : '') + '">' + state + '</span>' + prog + '</button>';
}
return '<div class="lo-sec" id="loListen">' + _loSecHd('一起听', '', '', '') + body + '</div>';
}
function _loRing(done, total) {
const C = 47.1, off = C * (1 - (total ? done / total : 0));
return '<svg class="lo-ring" viewBox="0 0 20 20" width="15" height="15" aria-hidden="true">'
+ '<circle cx="10" cy="10" r="7.5" fill="none" stroke="color-mix(in srgb,currentColor 30%,transparent)" stroke-width="2.3"/>'
+ '<circle cx="10" cy="10" r="7.5" fill="none" stroke="var(--lo-accent,var(--ink))" stroke-width="2.3" stroke-linecap="round"'
+ ' stroke-dasharray="' + C + '" stroke-dashoffset="' + Math.round(off * 100) / 100 + '" transform="rotate(-90 10 10)"/>'
+ '</svg>';
}
function _loListProgHTML(items) {
const doneN = items.filter(it => it.done).length;
return items.length ? ('<span class="lo-sec-n">' + _loRing(doneN, items.length) + doneN + '/' + items.length + '</span>') : '';
}
function _loListHTML(cid) {
const o = coupleOf(cid);
const items = (o && o.list) || [];
const rowHTML = it => {
if (_loEditId === it.id) {
return '<div class="lo-newrow lo-editrow"><input id="loEditTx" data-loeid="' + escapeHTML(it.id) + '" maxlength="60" value="' + escapeHTML(it.tx) + '" placeholder="想改成什么…">'
+ '<button type="button" class="ok" data-loeditok="' + escapeHTML(it.id) + '">改好</button>'
+ '<button type="button" class="lo-pdel" data-loeditx="1" aria-label="算了">×</button></div>';
}
const at = it.done && it.at ? _loMD(it.at) : '';
return '<div class="lo-item' + (it.done ? ' done' : '') + '">'
+ '<button type="button" class="lo-itoggle" data-litgl="' + it.id + '"><span class="lo-tick">' + LO_CHECK_SVG + '</span>'
+ '<span class="lo-itx">' + escapeHTML(it.tx) + '</span>' + (at ? '<span class="lo-iat">' + at + '</span>' : '') + '</button>'
+ '<button type="button" class="lo-iedit" data-liedit="' + it.id + '" aria-label="改这一条">改</button>'
+ '<button type="button" class="lo-idel" data-lidel="' + it.id + '" aria-label="删掉这一条">×</button></div>';
};
const add = _loAdding
? '<div class="lo-newrow"><input id="loNewTx" maxlength="60" placeholder="想一起做的一件事…"><button type="button" class="ok" data-locmd="addok">记下</button></div>'
: (items.length ? '<button type="button" class="lo-addrow" data-locmd="add">添一件想一起做的</button>' : '');
const doneN = items.filter(it => it.done).length;
const active = items.filter(it => !it.done);
const done = items.filter(it => it.done);
let rows;
if (!items.length) {
rows = _loAdding ? add : '<button type="button" class="lo-empty-card" data-locmd="add">'
+ '<span class="e" aria-hidden="true">＋</span>'
+ '<span class="tx"><span class="t">还没有一起想做的事</span>'
+ '<span class="s">写下一件——勾掉的时候 TA 会在聊天里提一句</span></span></button>';
} else {
rows = active.map(rowHTML).join('') + add;
if (doneN >= 2) {
rows += '<button type="button" class="lo-donefold" data-lodonefold="' + (_loDoneOpen ? 'close' : 'open')
+ '" aria-expanded="' + (_loDoneOpen ? 'true' : 'false') + '">'
+ '<span class="lo-donefold-ck" aria-hidden="true">✓</span>'
+ '<span>已完成 ' + doneN + ' 件</span>'
+ '<span class="lo-donefold-x">' + (_loDoneOpen ? '收起' : '展开') + '</span></button>';
if (_loDoneOpen) rows += '<div class="lo-done-box">' + done.map(rowHTML).join('') + '</div>';
} else if (doneN) {
rows += done.map(rowHTML).join('');
}
}
return '<div class="lo-sec" id="loList">'
+ '<div class="lo-sec-hd"><span class="lo-sec-t">一起做的</span><span id="loListProg">' + _loListProgHTML(items) + '</span></div>'
+ rows + '</div>';
}
function _loListRepaint(cid) {
const el = document.getElementById('loList');
const ta = _loContact();
if (el && ta) el.outerHTML = _loListHTML(cid);
}
function _loLedgerHTML(cid) {
const o = coupleOf(cid);
const led = (o && o.ledger) || [];
const total = led.length;
const rev = led.map((it, i) => ({ it: it, i: i })).reverse();
let rows;
if (_loLedOpen && rev.length) {
rows = '';
let curDay = '';
rev.forEach(({ it, i }) => {
const day = _loDayCN(it.day || it.at);
if (day !== curDay) { curDay = day; rows += '<div class="lo-led-dayh">' + day + '</div>'; }
if (_loLedDel === i) {
rows += '<div class="lo-led-it lo-led-confirm" data-loled="' + i + '">'
+ '<div class="lo-led-tx">' + escapeHTML(it.tx) + '</div>'
+ '<div class="lo-led-confirm-row"><span class="lo-led-confirm-q">删掉这条？</span>'
+ '<button type="button" class="lo-led-del" data-loldedok="' + i + '">删掉</button>'
+ '<button type="button" class="lo-led-cancel" data-loldedx="1">算了</button></div></div>';
return;
}
rows += '<div class="lo-led-it" data-loled="' + i + '"><div class="lo-led-tx">' + escapeHTML(it.tx) + '</div>'
+ '<button type="button" class="lo-led-re" data-lore="' + i + '" title="把这句带回聊天">回一句</button></div>';
});
} else {
rows = rev.slice(0, _loLedOpen ? rev.length : 3).map(({ it, i }) => {
if (_loLedDel === i) {
return '<div class="lo-led-it lo-led-confirm" data-loled="' + i + '">'
+ '<div class="lo-led-tx">' + escapeHTML(it.tx) + '</div>'
+ '<div class="lo-led-confirm-row"><span class="lo-led-confirm-q">删掉这条？</span>'
+ '<button type="button" class="lo-led-del" data-loldedok="' + i + '">删掉</button>'
+ '<button type="button" class="lo-led-cancel" data-loldedx="1">算了</button></div></div>';
}
return '<div class="lo-led-it" data-loled="' + i + '"><div class="lo-led-tx">' + escapeHTML(it.tx) + '</div>'
+ '<span class="lo-led-day">' + _loDayCN(it.day || it.at) + '</span>'
+ '<button type="button" class="lo-led-re" data-lore="' + i + '" title="把这句带回聊天">回一句</button></div>';
}).join('');
}
if (!total) rows = '<div class="lo-led-empty">TA 还没记下什么。你随口说过的话，TA 偶尔会悄悄记一条在这里——一天至多一笔。</div>';
const more = (total > 5)
? '<button type="button" class="lo-led-more" data-loledmore="1">' + (_loLedOpen ? '收起' : '看全部 ' + total + ' 笔') + '</button>'
: '';
return '<div class="lo-sec" id="loLed">' + _loSecHd('TA 记得的事', total ? total + ' 笔' : '', '', '')
+ '<div class="lo-led' + (total ? ' has' : '') + '">' + rows + more + '</div></div>';
}
function _loLedgerRepaint(cid) {
const el = document.getElementById('loLed');
const ta = _loContact();
if (el && ta) el.outerHTML = _loLedgerHTML(cid);
}
function _loDressHTML(cid) {
const o = coupleOf(cid) || {};
const look = o.look || {};
const plans = _loPlanLib();
const bgLib = (data.apAssets && data.apAssets.bg) || {};
const bgLibChips = Object.keys(bgLib).map(id =>
'<button type="button" class="lo-chip' + (look.bg === bgLib[id].img ? ' on' : '') + '" data-bgid="' + escapeHTML(id) + '">' + escapeHTML(bgLib[id].name || '未命名') + '</button>').join('');
const fontLib = (data.apAssets && data.apAssets.font) || {};
const fontChips = Object.keys(fontLib).map(id =>
'<button type="button" class="lo-chip' + (look.font === id ? ' on' : '') + '" data-font="' + escapeHTML(id) + '">' + escapeHTML(fontLib[id].name || '未命名') + '</button>').join('');
const cur = _loSetTabOf();
const tabs = '<div class="mate-subtabs lo-set-tabs">' + LO_SET_TABS.map(t =>
'<button type="button" class="mate-subtab' + (cur === t[0] ? ' on' : '') + '" data-setab="' + t[0] + '">' + t[1] + '</button>').join('') + '</div>';
const sec = (k, html) => '<div class="lo-set-sec" data-lo-sec="' + k + '"' + (cur === k ? '' : ' hidden') + '>' + html + '</div>';
const face = '<p class="lo-set-tip">这一页叫什么、说什么，两张脸怎么摆。</p>'
+ '<div class="lo-dress-row"><span class="lo-dress-cap">空间名</span><div class="lo-dress-main"><input id="loName" maxlength="16" placeholder="默认＝「TA 和我」" style="flex:1;min-width:0;border:1px solid var(--line);border-radius:11px;background:var(--surface);color:var(--ink);padding:9px 12px;font-size:13px;outline:none" value="' + escapeHTML(o.name || '') + '"></div></div>'
+ '<div class="lo-dress-row"><span class="lo-dress-cap">一句话</span><div class="lo-dress-main"><input id="loSign" maxlength="30" placeholder="写一句挂在门上" style="flex:1;min-width:0;border:1px solid var(--line);border-radius:11px;background:var(--surface);color:var(--ink);padding:9px 12px;font-size:13px;outline:none" value="' + escapeHTML(o.sign || '') + '"></div></div>'
+ '<div class="lo-dress-row"><span class="lo-dress-cap">版式</span><div class="lo-dress-main">'
+ '<button type="button" class="lo-chip' + (!look.heroLy ? ' on' : '') + '" data-ly="">并排</button>'
+ '<button type="button" class="lo-chip' + (look.heroLy === 'tilt' ? ' on' : '') + '" data-ly="tilt">拍立得</button>'
+ '<button type="button" class="lo-chip' + (look.heroLy === 'stamp' ? ' on' : '') + '" data-ly="stamp">邮票</button>'
+ '</div></div>'
+ '<div class="lo-dress-row"><span class="lo-dress-cap">头像框</span><div class="lo-dress-main">'
+ '<button type="button" class="lo-chip' + (!look.avFrame ? ' on' : '') + '" data-av="">圆</button>'
+ '<button type="button" class="lo-chip' + (look.avFrame === 'squircle' ? ' on' : '') + '" data-av="squircle">方圆</button>'
+ '<button type="button" class="lo-chip' + (look.avFrame === 'frame' ? ' on' : '') + '" data-av="frame">相框</button>'
+ '</div></div>'
+ '<p class="lo-dress-note">这两张脸取自 TA 的联系人资料与「我的」设置——这里只管它们怎么摆，不换脸。</p>';
const chatBgHere = (function () { const ca = (data.chatAppearance || {})[cid]; return (ca && typeof ca.chatBg === 'string') ? ca.chatBg : ''; })();
const bgSec = '<p class="lo-set-tip">铺一张图；字始终压在纱上面。</p>'
+ (chatBgHere
? (look.bg
? '<p class="lo-dress-note">现在铺的是上面自己那张；点「摘掉」就回到聊天页那张。</p>'
: '<div class="lo-dress-row"><span class="lo-dress-cap">垫底</span><div class="lo-dress-main">'
+ '<button type="button" class="lo-chip' + (look.bgFollow !== false ? ' on' : '') + '" data-bgfollow="on">跟聊天页</button>'
+ '<button type="button" class="lo-chip' + (look.bgFollow === false ? ' on' : '') + '" data-bgfollow="off">不跟</button>'
+ '</div></div><p class="lo-dress-note">跟聊天页＝聊天里那张壁纸也铺到这一页；下面自己传一张，就以自己那张为准。</p>')
: '')
+ '<div class="lo-dress-row"><span class="lo-dress-cap">背景</span><div class="lo-dress-main">'
+ (look.bg ? '<img class="lo-thumb" src="' + escapeHTML(look.bg) + '" alt="">' : '')
+ '<button type="button" class="lo-btn" data-locmd="bgpick">' + (look.bg ? '换一张' : '传一张图') + '</button>'
+ (look.bg ? '<button type="button" class="lo-btn" data-locmd="bgclear">摘掉</button>' : '')
+ '</div></div>'
+ '<div class="lo-dress-row"><span class="lo-dress-cap">图库</span><div class="lo-dress-main lo-font-chips">'
+ (bgLibChips || '<span class="lo-dress-note" style="margin:0">库里还没有背景图——先在上面传一张，之后它就在这儿，可以随时换回来。</span>')
+ '</div></div>'
+ '<div class="lo-dress-row"><span class="lo-dress-cap">处理</span><div class="lo-dress-main">'
+ '<button type="button" class="lo-chip' + (!look.bgFx ? ' on' : '') + '" data-bgfx="">原图</button>'
+ '<button type="button" class="lo-chip' + (look.bgFx === 'blur' ? ' on' : '') + '" data-bgfx="blur">磨砂</button>'
+ '<button type="button" class="lo-chip' + (look.bgFx === 'dim' ? ' on' : '') + '" data-bgfx="dim">压暗</button>'
+ '</div></div>'
+ '<div class="lo-dress-row"><span class="lo-dress-cap">暖光</span><div class="lo-dress-main">'
+ '<input type="range" id="loGlow" min="0" max="30" step="1" value="' + (typeof look.glow === 'number' ? look.glow : 0) + '" style="flex:1;min-width:0;accent-color:var(--lo-accent,var(--ink))">'
+ '</div></div>'
+ '<div class="lo-dress-row"><span class="lo-dress-cap">质感</span><div class="lo-dress-main">'
+ '<button type="button" class="lo-chip' + (look.paper === 'paper' ? '' : ' on') + '" data-paper="">玻璃</button>'
+ '<button type="button" class="lo-chip' + (look.paper === 'paper' ? ' on' : '') + '" data-paper="paper">米纸</button>'
+ '</div></div>';
const stk = '<p class="lo-set-tip">TA 隔天来贴一次（只贴这一页；全站那张总闸在美化库「每天随机装修」卡里）。想马上就有一张，点「现在贴一张」。</p>'
+ '<div class="lo-dress-row"><span class="lo-dress-cap">谁来贴</span><div class="lo-dress-main">'
+ '<button type="button" class="lo-chip' + (look.stkOn !== false ? ' on' : '') + '" data-stk="on">TA 隔天来贴</button>'
+ '<button type="button" class="lo-chip' + (look.stkOn === false ? ' on' : '') + '" data-stk="off">不贴</button>'
+ '</div></div>'
+ '<div class="lo-dress-row"><span class="lo-dress-cap">动手</span><div class="lo-dress-main">'
+ '<button type="button" class="lo-btn" data-locmd="stkroll">现在贴一张</button>'
+ (look.dz ? '<button type="button" class="lo-btn" data-locmd="stkclear">撕掉</button>' : '')
+ '</div></div>'
+ '<div class="lo-dress-row"><span class="lo-dress-cap">口味</span><div class="lo-dress-main lo-font-chips">'
+ '<button type="button" class="lo-chip' + (!look.stkFam ? ' on' : '') + '" data-fam="">全部</button>'
+ (typeof DZ_FAMILIES !== 'undefined' ? DZ_FAMILIES.map(f => '<button type="button" class="lo-chip' + (look.stkFam === f.key ? ' on' : '') + '" data-fam="' + f.key + '">' + f.name + '</button>').join('') : '')
+ '</div></div>'
+ '<div class="lo-dress-row"><span class="lo-dress-cap">池子</span><div class="lo-dress-main"><span class="lo-dress-note" style="margin:0">' + _loStkPoolText(cid) + '</span>'
+ '<button type="button" class="lo-btn" data-locmd="stkgolib">去美化库挑贴纸</button></div></div>'
+ '<p class="lo-dress-note">贴纸与聊天页、单人框用的是<b>同一本素材、同一份勾选池</b>（美化库 → 贴纸）；TA 贴的那一套跟着白天黑夜走，没掷中也算它来过（一天最多一发）。</p>';
const fontSec = '<p class="lo-set-tip">只换这一页的字，别处不动。</p>'
+ '<div class="lo-dress-row"><span class="lo-dress-cap">这一页</span><div class="lo-dress-main lo-font-chips">'
+ '<button type="button" class="lo-chip' + (!look.font ? ' on' : '') + '" data-font="">跟全站</button>' + fontChips
+ '</div></div>'
+ (!Object.keys(fontLib).length ? '<p class="lo-dress-note">库里还没有字体——去「美化库 → 字体样式」传一份，这里就能单给这一页挑。</p>' : '');
const planSec = '<p class="lo-set-tip">九格长相打包存一份，可以套给别的 TA。</p>'
+ (_loPlanAdding
? '<div class="lo-newrow"><input id="loPlanName" maxlength="16" placeholder="这套装修叫什么…"><button type="button" class="ok" data-locmd="planok">存下</button></div>'
: '<div class="lo-dress-row"><span class="lo-dress-cap">存这套</span><div class="lo-dress-main"><button type="button" class="lo-btn" data-locmd="plansave">把现在这套存起来</button></div></div>')
+ (plans.length
? '<div class="lo-dress-row"><span class="lo-dress-cap">套一份</span><div class="lo-dress-main lo-font-chips">'
+ plans.map(pl => '<span class="lo-plan"><button type="button" class="lo-chip" data-cpid="' + escapeHTML(pl.id) + '">' + escapeHTML(pl.name) + '</button>'
+ '<button type="button" class="lo-pdel" data-cpdel="' + escapeHTML(pl.id) + '" aria-label="删掉这份方案">×</button></span>').join('')
+ '</div></div>'
: '<p class="lo-dress-note">还没存过方案。存一份＝九格长相打包；去别的 TA 的空间面板点同一份＝整套搬过去。</p>')
+ '<p class="lo-dress-note">这些按这一位各存一份，改动当场生效。背景铺上来时会按明暗自动垫一层纱，字永远看得清。</p>';
return '<div class="lo-dress">' + tabs + _loPrevHTML(cid)
+ sec('face', face) + sec('bg', bgSec) + sec('stk', stk) + sec('font', fontSec) + sec('plan', planSec)
+ '<p class="lo-dress-foot">改动当场生效，不用保存——上面那条预览就是页面上现在长什么样。</p>'
+ '<input type="file" id="loFile" class="lo-file" accept="image/*">'
+ '</div>';
}
let _loProgT = 0;
function _loProgTick() {
if (document.body.dataset.view !== 'couple') {
if (_loProgT) { clearInterval(_loProgT); _loProgT = 0; }
return;
}
const el = document.getElementById('loLprog');
if (!el) return;
if (!window.__plPlaying || typeof _plProgNow !== 'function') { el.style.width = '0%'; return; }
try {
const g = _plProgNow();
el.style.width = (g && g.dur ? Math.max(0, Math.min(100, g.pct)) : 0) + '%';
} catch (e) {}
}
function _loMD(at) {
const d = new Date(at);
return (d.getMonth() + 1) + '月' + d.getDate() + '日';
}
function _loDayCN(v) {
if (typeof v === 'number' && v) return _loMD(v) + ' 记下的';
if (typeof v === 'string' && v) {
const p = v.split('-');
if (p.length === 3) return (+p[1]) + '月' + (+p[2]) + '日 记下的';
}
return '某一天记下的';
}
function renderCouplePage() {
const page = document.getElementById('loPage');
if (!page) return;
const host = document.getElementById('loBody') || page;
const cid = _loCid();
const ta = _loContact();
const st = page.scrollTop;
_loAdding = false; _loPlanAdding = false;
_loDoneOpen = false; _loLedOpen = false; _loLedDel = -1;
if (!cid || !ta) {
_loApplyLook();
_loPaintStk('');
host.innerHTML = '<div class="lo-none"><span class="e">♡</span><p>「我们的空间」按联系人一份。<br>从一位联系人（单聊）的聊天页右滑进来，或回首页长按那一位会话、在动作单里点「我们的空间」。</p></div>';
return;
}
_loApplyLook();
const cidLock = cid;
host.classList.remove('lo-anim');
host.innerHTML = _loHeroHTML(ta, cidLock)
+ _loMoodsHTML(ta, cidLock)
+ _loListenHTML(cidLock)
+ _loListHTML(cidLock)
+ _loLedgerHTML(cidLock)
+ _loFootHTML();
_loPaintDress(cidLock);
_loBind(host, cidLock);
page.scrollTop = st;
if (!_loProgT) _loProgT = setInterval(_loProgTick, 1000);
_loDaysIntro(host);
if (_loStkTick(cidLock, false)) _loSwap(() => _loPaintStk(cidLock));
else _loPaintStk(cidLock);
const mainHere = (typeof annMainFor === 'function') ? annMainFor(cidLock) : null;
if (mainHere && typeof _annDays !== 'function' && typeof ensureChunk === 'function') {
ensureChunk('anniv').then(ok => { if (ok && typeof _annDays === 'function') _loRepaint(cidLock); });
}
}
function _loRepaint(cid) {
const page = document.getElementById('loPage');
if (!page || document.body.dataset.view !== 'couple') return;
const host = document.getElementById('loBody') || page;
const st = page.scrollTop;
const ta = _loContact();
if (!ta || ta.id !== cid) return;
_loLedDel = -1;
host.classList.remove('lo-anim');
host.innerHTML = _loHeroHTML(ta, cid) + _loMoodsHTML(ta, cid) + _loListenHTML(cid) + _loListHTML(cid) + _loLedgerHTML(cid) + _loFootHTML();
_loPaintDress(cid);
_loPaintStk(cid);
_loBind(host, cid);
page.scrollTop = st;
_loDaysIntro(host);
}
function _loBindDressInputs(cid) {
const nameInp = document.getElementById('loName');
const signInp = document.getElementById('loSign');
let loRaf = 0;
const _loEcho = () => {
if (loRaf) return;
loRaf = requestAnimationFrame(() => {
loRaf = 0;
const o = _coupleEnsure(cid);
if (nameInp) o.name = nameInp.value.trim().slice(0, 16);
if (signInp) o.sign = signInp.value.trim().slice(0, 30);
save();
const nm = document.querySelector('#loPage .lo-name'), sg = document.querySelector('#loPage .lo-sign');
const taName = fixedNameOf(_loContact()) || chatNameOf(_loContact()) || 'TA';
if (nm) nm.textContent = o.name || (taName + ' 和我');
if (sg) sg.textContent = o.sign || '愿所有平淡的日子都有回响';
});
};
if (nameInp) nameInp.oninput = _loEcho;
if (signInp) signInp.oninput = _loEcho;
const glowInp = document.getElementById('loGlow');
if (glowInp) glowInp.oninput = () => {
const o = _coupleEnsure(cid);
const v = Number(glowInp.value);
o.look.glow = (isFinite(v) ? Math.min(30, Math.max(0, Math.round(v))) : 0);
save(); _loApplyLook();
};
const fileInp = document.getElementById('loFile');
if (fileInp) fileInp.onchange = () => {
const f = fileInp.files && fileInp.files[0];
fileInp.value = '';
if (!f) return;
const r = new FileReader();
r.onload = () => {
const put = img => {
const o = _coupleEnsure(cid);
o.look.bg = img;
save(); _loApplyLook(); _loPaintDress(cid);
if (typeof _imgLuma === 'function') {
try { _imgLuma(img).then(l => { o.look.bgLuma = (typeof l === 'number' && isFinite(l)) ? Math.round(l * 1000) / 1000 : null; save(); _loApplyLook(); }).catch(() => {}); } catch (e) {}
}
};
if (typeof compressImageDataURL === 'function') compressImageDataURL(String(r.result), 1600, 0.85).then(put);
else put(String(r.result));
};
r.readAsDataURL(f);
};
}
function _loPrevHTML(cid) {
const o = coupleOf(cid) || {};
const ta = _loContact();
const taName = ta ? (fixedNameOf(ta) || chatNameOf(ta) || 'TA') : 'TA';
const nm = o.name || (taName + ' 和我');
const main = (typeof annMainFor === 'function') ? annMainFor(cid) : null;
let d = 0;
if (main && !main.yearly && typeof _annDays === 'function') { const v = _annDays(main.date); if (v > 0) d = v; }
return '<div class="lo-prev" id="loPrev">'
+ '<div class="lo-prev-bg"></div>'
+ '<div class="lo-prev-in">'
+ '<div class="lo-prev-avs"><span class="lo-prev-av">' + (ta ? avatarHTML(chatAvatarOf(ta)) : '') + '</span>'
+ '<span class="lo-prev-av me">' + avatarHTML(chatMyAvatar()) + '</span></div>'
+ '<div class="lo-prev-nm">' + escapeHTML(nm) + '</div>'
+ (d ? '<div class="lo-prev-d"><b>' + d + '</b><i>天</i></div>' : '')
+ '</div>'
+ '<span class="lo-prev-tag">预览</span>'
+ '</div>';
}
function _loPrevSync() {
const p = document.getElementById('loPrev'), v = document.getElementById('coupleView');
if (!p || !v) return;
p.style.cssText = v.style.cssText;
['data-lo-paper', 'data-lo-av', 'data-lo-heroly'].forEach(k => {
const val = v.getAttribute(k);
if (val) p.setAttribute(k, val); else p.removeAttribute(k);
});
}
function _loPaintDress(cid) {
const body = document.getElementById('loSetBody');
if (!body) return;
const sc = body.closest('.fs-sheet-body');
const st = sc ? sc.scrollTop : 0;
body.innerHTML = _loDressHTML(cid);
_loSetPaintTabs();
_loPrevSync();
if (sc) sc.scrollTop = st;
_loBindDressInputs(cid);
}
function _loPaintStk(cid) {
const host = document.getElementById('loDz');
if (!host) return;
const o = coupleOf(cid);
const html = (o && o.look && o.look.dz && typeof dzItemsHTML === 'function') ? dzItemsHTML(o.look.dz, 'chat') : '';
if (host.innerHTML !== html) host.innerHTML = html;
_loStkAvoidHd(host);
host.querySelectorAll('img.dz-i').forEach(img => {
if (!img.complete) img.addEventListener('load', () => _loStkAvoidHd(host), { once: true });
});
}
function _loStkAvoidHd(host) {
const body = document.getElementById('loBody');
if (!host || !body || !host.childNodes.length) return;
const hr = host.getBoundingClientRect();
if (!(hr.height > 0 && hr.width > 0)) return;
const bands = [];
body.querySelectorAll('.lo-sec-hd, .lo-sec-sub, .lo-hero .lo-name, .lo-hero .lo-sign, .lo-days-btn,'
+ ' .lo-itx, .lo-iat, .lo-idel, .lo-led-tx, .lo-led-day, .lo-led-re, .lo-addrow, .lo-empty-card .tx,'
+ ' .lo-donefold, .lo-led-more, .lo-lname, .lo-lart, .lo-mood .e, .lo-mood .t, .lo-mood .w').forEach(el => {
const r = el.getBoundingClientRect();
if (!r.height) return;
bands.push({
top: (r.top - hr.top) / hr.height * 100, bottom: (r.bottom - hr.top) / hr.height * 100,
left: (r.left - hr.left) / hr.width * 100, right: (r.right - hr.left) / hr.width * 100
});
});
if (!bands.length) return;
host.querySelectorAll('.dz-i').forEach(el => {
if (!el.dataset.loTop) el.dataset.loTop = el.style.top;
const base = parseFloat(el.dataset.loTop), baseX = parseFloat(el.style.left);
if (!(base >= 0) || !(baseX >= 0)) return;
el.style.top = el.dataset.loTop;
const box = el.getBoundingClientRect();
const half = (box.height / hr.height) * 50, halfW = (box.width / hr.width) * 50;
let y = base;
for (let pass = 0; pass < 8; pass++) {
const hit = bands.find(b => y + half > b.top - 1.5 && y - half < b.bottom + 1.5
&& baseX + halfW > b.left - 1.5 && baseX - halfW < b.right + 1.5);
if (!hit) break;
y = hit.bottom + half + 2;
}
if (y !== base) el.style.top = Math.min(94, y).toFixed(1) + '%';
});
}
function _loSetOpen() {
const m = document.getElementById('loSetMask');
if (m) { _loAdding = false; _loPaintDress(_loCid()); _loBind(document.getElementById('loPage'), _loCid()); m.hidden = false; }
}
function _loSetClose() { const m = document.getElementById('loSetMask'); if (m) m.hidden = true; }
function _loFootHTML() {
return '<div class="lo-foot"><span>到这儿，日子还长</span></div>';
}
function _loBind(page, cid) {
const host = document.getElementById('loBody') || page;
const _loClick = e => {
if (e.currentTarget && e.currentTarget.id === 'loSetMask' && e.target === e.currentTarget) { _loSetClose(); return; }
const mp = e.target.closest('[data-mpick]');
if (mp) {
const m = (typeof CAL_MOOD_OF !== 'undefined') ? CAL_MOOD_OF[mp.dataset.mpick] : null;
const key = (typeof calTodayKey === 'function') ? calTodayKey() : '';
if (!m || !key || typeof calDayOf !== 'function') return;
const d = calDayOf(key);
d.my = { k: m.k, e: m.e, t: m.t, note: (d.my && d.my.note) || '' };
save();
_loMoodPick = false;
_loMoodsRepaint(cid);
return;
}
const lmore = e.target.closest('[data-loledmore]');
if (lmore) { _loLedOpen = !_loLedOpen; _loLedDel = -1; _loLedgerRepaint(cid); return; }
const lok = e.target.closest('[data-loldedok]');
if (lok) {
const o = coupleOf(cid);
const i = Number(lok.dataset.loldedok);
if (o && Array.isArray(o.ledger) && i >= 0) { o.ledger.splice(i, 1); save(); }
_loLedDel = -1; _loLedgerRepaint(cid);
return;
}
const lx = e.target.closest('[data-loldedx]');
if (lx) { _loLedDel = -1; _loLedgerRepaint(cid); return; }
const df = e.target.closest('[data-lodonefold]');
if (df) { _loDoneOpen = !_loDoneOpen; _loListRepaint(cid); return; }
const lore = e.target.closest('[data-lore]');
if (lore) {
if (Date.now() - _loLpAt < 800) { _loLpAt = 0; return; }
const o = coupleOf(cid);
const it = o && (o.ledger || [])[Number(lore.dataset.lore)];
if (it && it.tx) _loReplyToChat(it.tx);
return;
}
const eok = e.target.closest('[data-loeditok]');
if (eok) {
const id = eok.dataset.loeditok;
const inp = document.getElementById('loEditTx');
const tx = (inp && inp.value.trim().slice(0, 60)) || '';
const o = coupleOf(cid);
const it = o && (o.list || []).find(x => x.id === id);
if (o && it) {
if (tx) it.tx = tx;
else o.list = o.list.filter(x => x.id !== id);
save();
}
_loEditId = ''; _loListRepaint(cid);
return;
}
const ex = e.target.closest('[data-loeditx]');
if (ex) { _loEditId = ''; _loListRepaint(cid); return; }
const tgl = e.target.closest('[data-litgl]');
if (tgl) {
if (Date.now() - _loLpAt < 800) { _loLpAt = 0; return; }
const o = coupleOf(cid);
const it = o && (o.list || []).find(x => x.id === tgl.dataset.litgl);
if (!it) return;
if (!it.done) {
it.done = 1; it.at = Date.now(); save();
_loHearts(e.clientX || 0, e.clientY || 0);
if (typeof coupleCheckReply === 'function') coupleCheckReply(cid, it.tx);
} else { it.done = 0; it.at = 0; save(); }
_loListRepaint(cid);
return;
}
const del = e.target.closest('[data-lidel]');
if (del) {
const o = coupleOf(cid);
if (o && Array.isArray(o.list)) {
o.list = o.list.filter(x => x.id !== del.dataset.lidel);
save(); _loListRepaint(cid);
}
return;
}
const ied = e.target.closest('[data-liedit]');
if (ied) {
_loEditId = ied.dataset.liedit || '';
_loListRepaint(cid);
const inp = document.getElementById('loEditTx');
if (inp) inp.focus();
return;
}
const pp = e.target.closest('[data-paper]');
if (pp) {
const o = _coupleEnsure(cid);
o.look.paper = pp.dataset.paper || '';
save(); _loSwap(() => { _loApplyLook(); _loPaintDress(cid); });
return;
}
const ly = e.target.closest('[data-ly]');
if (ly) {
const o = _coupleEnsure(cid);
o.look.heroLy = ly.dataset.ly || '';
save(); _loSwap(() => { _loApplyLook(); _loPaintDress(cid); });
return;
}
const av = e.target.closest('[data-av]');
if (av) {
const o = _coupleEnsure(cid);
o.look.avFrame = av.dataset.av || '';
save(); _loSwap(() => { _loApplyLook(); _loPaintDress(cid); });
return;
}
const bgf = e.target.closest('[data-bgfx]');
if (bgf) {
const o = _coupleEnsure(cid);
o.look.bgFx = bgf.dataset.bgfx || '';
save(); _loSwap(() => { _loApplyLook(); _loPaintDress(cid); });
return;
}
const bgFollow = e.target.closest('[data-bgfollow]');
if (bgFollow) {
const o = _coupleEnsure(cid);
o.look.bgFollow = bgFollow.dataset.bgfollow !== 'off';
save(); _loSwap(() => { _loApplyLook(); _loPaintDress(cid); });
return;
}
const bgid = e.target.closest('[data-bgid]');
if (bgid) {
const lib = (data.apAssets && data.apAssets.bg) || {};
const it = lib[bgid.dataset.bgid];
if (!it || !it.img) return;
const o = _coupleEnsure(cid);
o.look.bg = it.img;
o.look.bgLuma = (typeof it.luma === 'number' && isFinite(it.luma)) ? it.luma : null;
save(); _loSwap(() => { _loApplyLook(); _loPaintDress(cid); });
if (o.look.bgLuma === null && typeof _imgLuma === 'function') {
try { _imgLuma(it.img).then(l => { o.look.bgLuma = (typeof l === 'number' && isFinite(l)) ? Math.round(l * 1000) / 1000 : null; it.luma = o.look.bgLuma; save(); _loApplyLook(); }).catch(() => {}); } catch (e) {}
}
return;
}
const ft = e.target.closest('[data-font]');
if (ft) {
const o = _coupleEnsure(cid);
o.look.font = ft.dataset.font || '';
save(); _loSwap(() => { _loApplyLook(); _loPaintDress(cid); });
return;
}
const fam = e.target.closest('[data-fam]');
if (fam) {
const o = _coupleEnsure(cid);
o.look.stkFam = fam.dataset.fam || '';
save(); _loPaintDress(cid);
return;
}
const cpApp = e.target.closest('[data-cpid]');
if (cpApp) {
const pl = _loPlanLib().find(x => x.id === cpApp.dataset.cpid);
if (!pl) return;
const o = _coupleEnsure(cid);
_loSwap(() => {
LO_PLAN_KEYS.forEach(k => { o.look[k] = pl.look[k]; });
save(); _loApplyLook(); _loPaintDress(cid);
});
return;
}
const cpDel = e.target.closest('[data-cpdel]');
if (cpDel) {
data.couplePlans = _loPlanLib().filter(x => x.id !== cpDel.dataset.cpdel);
save(); _loPaintDress(cid); _loBind(document.getElementById('loPage'), cid);
return;
}
const st = e.target.closest('[data-stk]');
if (st) {
const o = _coupleEnsure(cid);
o.look.stkOn = st.dataset.stk !== 'off';
save(); _loPaintDress(cid);
return;
}
const sb = e.target.closest('[data-setab]');
if (sb) { _loSetTabSet(sb.dataset.setab); return; }
const cmd = e.target.closest('[data-locmd]');
if (!cmd) return;
const c = cmd.dataset.locmd;
if (c === 'annset' || c === 'annedit') { _loAnnSheet(cid); return; }
if (c === 'cal') { showView('calendar'); return; }
if (c === 'mypick') { _loMoodPick = !_loMoodPick; _loMoodsRepaint(cid); return; }
if (c === 'mypickclose') { _loMoodPick = false; _loMoodsRepaint(cid); return; }
if (c === 'calday') {
if (typeof calJumpToDay === 'function' && typeof calTodayKey === 'function') calJumpToDay(calTodayKey());
else showView('calendar');
return;
}
if (c === 'stkgolib') {
showView('looklib');
if (typeof ensureChunk === 'function') ensureChunk('beauty').then(ok => { if (ok && typeof _llTabSet === 'function') _llTabSet('stk'); });
return;
}
if (c === 'player') { showView('player'); return; }
if (c === 'annlist') { showView('anniversary'); return; }
if (c === 'add') { _loAdding = true; _loRepaint(cid); const inp = document.getElementById('loNewTx'); if (inp) inp.focus(); return; }
if (c === 'addok') {
const inp = document.getElementById('loNewTx');
const tx = (inp && inp.value.trim().slice(0, 60)) || '';
if (tx) {
const o = _coupleEnsure(cid);
o.list.push({ id: 'cp' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), tx, done: 0, at: 0 });
save();
}
_loAdding = false; _loRepaint(cid);
return;
}
if (c === 'bgpick') { const f = document.getElementById('loFile'); if (f) f.click(); return; }
if (c === 'bgclear') {
const o = _coupleEnsure(cid);
o.look.bg = ''; o.look.bgLuma = null; save(); _loSwap(() => { _loApplyLook(); _loPaintDress(cid); });
return;
}
if (c === 'plansave') { _loPlanAdding = true; _loPaintDress(cid); const inp = document.getElementById('loPlanName'); if (inp) inp.focus(); return; }
if (c === 'planok') {
const inp = document.getElementById('loPlanName');
const nm = (inp && inp.value.trim().slice(0, 16)) || '';
const o = coupleOf(cid);
if (o) {
const lib = _loPlanLib();
lib.push({ id: 'pl' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name: nm || ('方案 ' + _loMD(Date.now())), look: _loPlanSnap(o.look), at: Date.now() });
if (lib.length > 12) lib.splice(0, lib.length - 12);
save();
}
_loPlanAdding = false; _loPaintDress(cid); _loBind(document.getElementById('loPage'), cid);
return;
}
if (c === 'stkroll') {
_loStkTick(cid, true);
_loSwap(() => { _loPaintStk(cid); _loPaintDress(cid); });
return;
}
if (c === 'stkclear') {
const o = _coupleEnsure(cid);
o.look.dz = null; o.look.dzDay = ''; save();
_loSwap(() => { _loPaintStk(cid); _loPaintDress(cid); });
return;
}
};
host.onclick = _loClick;
const _loPress = e => {
if (e.target.closest('.lo-led-re,[data-loldedok],[data-loldedx],.lo-led-confirm')) return;
const t = e.target.closest('[data-litgl],[data-loedit],[data-loled]');
if (!t) return;
_loLpClear();
_loLpX = e.clientX || 0; _loLpY = e.clientY || 0;
_loLpTimer = setTimeout(() => {
_loLpTimer = null; _loLpAt = Date.now();
if (t.hasAttribute('data-loled')) {
_loLedDel = Number(t.getAttribute('data-loled'));
_loLedgerRepaint(cid);
} else if (t.hasAttribute('data-loedit')) { _loHeroEdit = t.getAttribute('data-loedit') || ''; _loRepaint(cid); }
else {
_loEditId = t.getAttribute('data-litgl') || '';
_loListRepaint(cid);
const inp = document.getElementById('loEditTx');
if (inp) { try { inp.focus(); const n = inp.value.length; inp.setSelectionRange(n, n); } catch (er) {} }
}
}, 460);
};
const _loPressMove = e => {
if (!_loLpTimer) return;
if (Math.abs((e.clientX || 0) - _loLpX) > 9 || Math.abs((e.clientY || 0) - _loLpY) > 9) _loLpClear();
};
host.onpointerdown = _loPress;
host.onpointermove = _loPressMove;
host.onpointerup = _loLpClear;
host.onpointercancel = _loLpClear;
host.onpointerleave = _loLpClear;
const setMask = document.getElementById('loSetMask');
if (setMask) setMask.onclick = _loClick;
const setBtn = document.getElementById('loSetBtn');
if (setBtn) setBtn.onclick = () => _loSetOpen();
const setClose = document.getElementById('loSetClose');
if (setClose) setClose.onclick = () => _loSetClose();
const annClose = document.getElementById('loAnnClose');
if (annClose) annClose.onclick = () => { const m = document.getElementById('loAnnMask'); if (m) m.hidden = true; };
_loBindDressInputs(cid);
_loBindInlineEdits(cid);
}
function _loBindInlineEdits(cid) {
const inp = document.getElementById('loHeroInp');
if (inp) {
const done = () => {
const k = _loHeroEdit;
if (!k) return;
_loHeroEdit = '';
const o = _coupleEnsure(cid);
const v = inp.value.trim();
if (k === 'name') o.name = v.slice(0, 16);
else o.sign = v.slice(0, 30);
save();
_loRepaint(cid);
};
inp.onblur = done;
inp.onkeydown = ev => {
if (ev.key === 'Enter') { ev.preventDefault(); inp.blur(); }
else if (ev.key === 'Escape') { _loHeroEdit = ''; _loRepaint(cid); }
};
try { inp.focus(); const n = inp.value.length; inp.setSelectionRange(n, n); } catch (e) {}
}
const li = document.getElementById('loEditTx');
if (li) {
li.onkeydown = ev => {
if (ev.key === 'Enter') {
ev.preventDefault();
const b = document.querySelector('[data-loeditok]');
if (b) b.click();
} else if (ev.key === 'Escape') { _loEditId = ''; _loListRepaint(cid); }
};
}
}
function _loReplyToChat(tx) {
const q = '「' + String(tx).slice(0, 120) + '」';
showView('chat');
const fill = () => {
const inp = document.getElementById('messageInput');
if (!inp) return;
if (inp.value.indexOf(q) >= 0) return;
const pre = inp.value ? (inp.value.replace(/\s+$/, '') + ' ') : '';
inp.value = pre + q;
try { inp.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
try { inp.focus(); const n = inp.value.length; inp.setSelectionRange(n, n); } catch (e) {}
};
setTimeout(fill, 160);
setTimeout(fill, 520);
}
(window.__CHUNK_OK__ = window.__CHUNK_OK__ || {})['couple'] = true;
