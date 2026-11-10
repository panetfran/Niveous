// 本件由 tools/assemble.py 生成·勿手改：首屏 JS 分片（进这一页那一刻才取），源＝js/ 那些拆分件
const TAQ_MIN_OPTS = 2;
const TAQ_MAX_OPTS = 4;
function _taAskParse(raw) {
const parts = String(raw == null ? '' : raw).split('||');
const q = String(parts[0] || '').trim();
const opts = String(parts[1] || '').split('|').map(s => s.trim()).filter(Boolean).slice(0, TAQ_MAX_OPTS);
return (q && opts.length >= TAQ_MIN_OPTS) ? { q, opts } : null;
}
function _taAskPresetGroup() {
return (data.groups || []).find(x => (x.name || '') === 'TA的问题' && (x.category || '主字卡') === 'TA心里话') || null;
}
function _taAskOwn() {
if (!Array.isArray(data.taAskCards)) data.taAskCards = [];
return data.taAskCards;
}
function _taqNewId() { return 'taq' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function _taqClean(s) { return String(s == null ? '' : s).replace(/[|｜]/g, ' ').replace(/\s+/g, ' ').trim(); }
function _taqOptsOf(c) { return (Array.isArray(c && c.opts) ? c.opts : []).map(_taqClean).filter(Boolean).slice(0, TAQ_MAX_OPTS); }
function _taqSanitizeList(list) {
if (!Array.isArray(list)) return [];
const out = [];
list.forEach(c => {
if (!c || typeof c !== 'object') return;
const q = _taqClean(c.q);
const opts = [];
(Array.isArray(c.opts) ? c.opts : []).forEach(x => {
const v = _taqClean(x);
if (v && opts.indexOf(v) < 0 && opts.length < TAQ_MAX_OPTS) opts.push(v);
});
if (!q || opts.length < TAQ_MIN_OPTS) return;
const rec = { id: (typeof c.id === 'string' && c.id) ? c.id : _taqNewId(), q: q, opts: opts, scope: c.scope === 'own' ? 'own' : 'public', cid: '' };
if (rec.scope === 'own' && typeof c.cid === 'string') rec.cid = c.cid;
if (c.off) rec.off = 1;
out.push(rec);
});
return out;
}
function _taAskPool(cid) {
const out = [];
const g = _taAskPresetGroup();
if (g && !g.off) (g.cards || []).forEach(c => {
if (cardIsOff(g, c)) return;
const p = _taAskParse(c);
if (p) out.push(p);
});
_taAskOwn().forEach(c => {
if (!c || c.off) return;
if (c.scope === 'own' && (!c.cid || c.cid !== cid)) return;
const q = _taqClean(c.q), opts = _taqOptsOf(c);
if (q && opts.length >= TAQ_MIN_OPTS) out.push({ q, opts });
});
return out;
}
function _taAskPick(cid) {
const pool = _taAskPool(cid);
return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}
const _TAQ_ICO_ASK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3 8.6 8.6 0 0 1-3.8-.9L3 21l2-5.5a8.3 8.3 0 0 1-.9-3.8A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/><path d="M9.6 9.6a2.5 2.5 0 0 1 4.8 .9c0 1.6-2.4 1.9-2.4 3.3"/><path d="M12 16.4h.01"/></svg>';
const _TAQ_ICO_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l16-7-7 16-2.2-6.8z"/></svg>';
let _taqEdit = null;
let _taqTab = 'preset';
function _taqTabReset() { _taqTab = 'preset'; }
const _TAQ_SCOPE_LABEL = { public: '公用', own: '专属' };
function _taqOwnerName(cid) {
const c = (data.contacts || []).find(x => x.id === cid);
return c ? (fixedNameOf(c) || 'TA') : '';
}
function _taqScopeTag(c) {
if (c.scope !== 'own') return '<em class="taq-tag">公用</em>';
const nm = _taqOwnerName(c.cid);
return '<em class="taq-tag own">' + (c.cid ? (nm ? '专属 · ' + escapeHTML(nm) : '专属 · 已不在通讯录') : '专属 · 未绑定') + '</em>';
}
function renderTaAskPage() {
const box = $('#taqList');
if (!box) return;
const g = _taAskPresetGroup();
const preset = g ? (g.cards || []) : [];
const own = _taAskOwn();
const on = data.taAskOn !== false;
const pubN = own.filter(c => c && c.scope !== 'own').length;
const lockAll = !!(g && g.off);
const tab = _taqTab === 'own' ? 'own' : 'preset';
let h = `<div class="taq-hero${on ? '' : ' off'}">
      <button type="button" class="taq-master" data-taq-master="1" aria-pressed="${on ? 'true' : 'false'}">
        <span class="taq-hero-ico" aria-hidden="true">${_TAQ_ICO_ASK}</span>
        <span class="taq-hero-tx"><b class="taq-hero-t">TA 会主动问你</b><small class="taq-hero-sub">${on ? '隔几小时挑一条发到聊天里，你选一个，TA 接一句' : '现在关着 —— 打开以后 TA 才会挑一条发给你'}</small></span>
        <span class="hub-tg${on ? '' : ' off'}"></span>
      </button>
      <button type="button" class="taq-now" data-taq-now="1">${_TAQ_ICO_SEND}<span>让 TA 现在问一次</span></button>
    </div>`;
h += `<div class="taq-tabs" role="tablist">
      <button type="button" class="taq-tab${tab === 'preset' ? ' on' : ''}" data-taq-tab="preset" role="tab" aria-selected="${tab === 'preset' ? 'true' : 'false'}">出厂问题 <b>${preset.length}</b></button>
      <button type="button" class="taq-tab${tab === 'own' ? ' on' : ''}" data-taq-tab="own" role="tab" aria-selected="${tab === 'own' ? 'true' : 'false'}">我加的 <b>${own.length}</b></button>
    </div>`;
if (tab === 'preset') {
h += `<div class="taq-sec"><div class="taq-sec-h"><span class="taq-sec-t">出厂问题</span><span class="taq-sec-sub">${preset.length} 条 · 可以停用，不能删除</span></div>`;
if (!preset.length) h += '<div class="taq-empty">出厂那一池不在了（「系统预设字卡」里也看不到「TA的问题」这一组）。</div>';
else {
if (lockAll) h += '<div class="taq-empty">这一组在「系统预设字卡 → TA问我」里被整组停用了，下面几条暂时都取不到；回那一页点一下眼睛就恢复。</div>';
h += preset.map((c, i) => _taqPresetRowHTML(c, i, g, lockAll)).join('');
}
h += '<button type="button" class="taq-add" data-taq-add="1">＋ 加一条自己的问题</button></div>';
} else {
h += `<div class="taq-sec"><div class="taq-sec-h"><span class="taq-sec-t">我加的问题</span><span class="taq-sec-sub">${own.length} 条 · 公用 ${pubN} / 专属 ${own.length - pubN}</span></div>`;
h += own.length
? `<p class="taq-sec-tip">点一条可以改它，右边那枚开关只管「问不问」。</p>` + own.map(c => _taqOwnRowHTML(c)).join('')
: `<div class="taq-empty taq-empty-own"><b>还没有自己加的问题</b><span>出厂的八条之外，你可以加只属于你们的（比如「今天想我了吗」）。公用谁都能抽到，专属只给某一位。</span></div>`;
h += '<button type="button" class="taq-add" data-taq-add="1">＋ 加一条自己的问题</button></div>';
}
h += '<p class="taq-foot">TA 每隔几小时挑一条发到聊天里；屏上还挂着一张没答完的，就不会再问第二条。一条问题配两到四个选项，你选完 TA 会接一句。</p>';
box.innerHTML = h;
}
function _taqOffTag(off) { return off ? '<em class="taq-off">已停用</em>' : ''; }
function _taqChips(opts) {
return '<span class="taq-opts">' + opts.map(x => `<em class="taq-chip">${escapeHTML(x)}</em>`).join('') + '</span>';
}
function _taqSw(attr, off) {
const lb = off ? '恢复这一条' : '停用这一条';
return `<button type="button" class="taq-sw${off ? ' off' : ''}" ${attr} aria-pressed="${off ? 'false' : 'true'}" aria-label="${lb}" title="${lb}"><i></i></button>`;
}
function _taqPresetRowHTML(c, i, g, lockAll) {
const p = _taAskParse(c);
const off = cardIsOff(g, c) || !!lockAll;
const body = p
? `<b class="taq-q">${escapeHTML(p.q)}</b>${_taqOffTag(off)}${_taqChips(p.opts)}`
: `<b class="taq-q">${escapeHTML(String(c))}</b>${_taqOffTag(off)}<small class="taq-opts-line bad">这一行读不出题面与选项（要写成「问题||选项|选项」）</small>`;
const acts = lockAll ? '' : `<div class="taq-acts">${_taqSw('data-taq-poff="' + i + '"', off)}</div>`;
return `<div class="taq-row${off ? ' off' : ''}"><div class="taq-tx">${body}</div>${acts}</div>`;
}
function _taqOwnRowHTML(c) {
const opts = _taqOptsOf(c);
const q = _taqClean(c.q);
const off = !!c.off;
const good = !!(q && opts.length >= TAQ_MIN_OPTS);
const head = `<b class="taq-q">${escapeHTML(good ? q : (q || '（没有题面）'))}</b>${_taqScopeTag(c)}${_taqOffTag(off)}`;
const body = head + (good
? _taqChips(opts)
: '<small class="taq-opts-line bad">选项不足两个，这条抽不到（点这一条补上）</small>');
return `<div class="taq-row own${off ? ' off' : ''}" data-taq-edit="${escapeHTML(c.id)}"><div class="taq-tx">${body}</div>
    <div class="taq-acts">${_taqSw('data-taq-off="' + escapeHTML(c.id) + '"', off)}</div></div>`;
}
function _taqSetOpts(opts, focusLast) {
const box = $('#taqOpts');
if (!box) return;
box.innerHTML = opts.map((v, i) => `<div class="taq-opt-row"><span class="taq-opt-i">${i + 1}</span><input class="taq-input" type="text" maxlength="12" placeholder="选项，比如：要" value="${escapeHTML(v || '')}" data-taq-optin="${i}"><button type="button" class="taq-opt-x" data-taq-optx="${i}" aria-label="删掉这个选项">×</button></div>`).join('');
_taqPaintOpts();
if (focusLast) { const ins = $$('#taqOpts [data-taq-optin]'); if (ins.length) ins[ins.length - 1].focus(); }
}
function _taqPaintOpts() {
const add = $('#taqOptAdd');
if (add) add.hidden = _taqReadOpts().length >= TAQ_MAX_OPTS;
}
function _taqReadOpts() { return Array.from($$('#taqOpts [data-taq-optin]')).map(el => el.value); }
function _taqPaintScope() {
const scope = (_taqEdit && _taqEdit.scope === 'own') ? 'own' : 'public';
$$('#taqScopes [data-taq-scope]').forEach(b => b.classList.toggle('on', b.dataset.taqScope === scope));
const wrap = $('#taqOwners');
if (!wrap) return;
wrap.hidden = scope !== 'own';
if (scope !== 'own') return;
const singles = (data.contacts || []).filter(c => c && c.kind !== 'group');
wrap.innerHTML = singles.length
? singles.map(c => `<button type="button" class="av-chip cj-ow${_taqEdit && _taqEdit.cid === c.id ? ' on' : ''}" data-taq-owner="${escapeHTML(c.id)}"><span class="av-chip-name">${escapeHTML(fixedNameOf(c) || 'TA')}</span></button>`).join('')
: '<div class="taq-empty">还没有联系人，先去首页加一个 TA。</div>';
}
function openTaAskEditor(id) {
const mask = $('#taqEditMask');
if (!mask) return;
const card = id ? _taAskOwn().find(c => c && c.id === id) : null;
_taqEdit = {
id: card ? card.id : '',
scope: (card && card.scope === 'own') ? 'own' : 'public',
cid: (card && card.cid) || ''
};
const ti = $('#taqEditTitle');
if (ti) ti.textContent = card ? '改这条问题' : '加一条问题';
const del = $('#taqEditDel');
if (del) {
if (card) del.setAttribute('data-taq-del', card.id); else del.removeAttribute('data-taq-del');
del.hidden = !card;
}
const q = $('#taqQ');
if (q) q.value = card ? _taqClean(card.q) : '';
let opts = card ? _taqOptsOf(card) : [];
while (opts.length < TAQ_MIN_OPTS) opts.push('');
_taqSetOpts(opts, false);
_taqPaintScope();
mask.hidden = false;
setTimeout(() => { const el = $('#taqQ'); if (el) el.focus(); }, 60);
}
function closeTaAskEditor() { const m = $('#taqEditMask'); if (m) m.hidden = true; _taqEdit = null; }
function _taqAddOpt() {
const vals = _taqReadOpts();
if (vals.length >= TAQ_MAX_OPTS) return;
vals.push('');
_taqSetOpts(vals, true);
}
function _taqDropOpt(i) {
const vals = _taqReadOpts();
if (vals.length <= TAQ_MIN_OPTS) vals[i] = ''; else vals.splice(i, 1);
_taqSetOpts(vals, false);
}
function _taqCommit() {
if (!_taqEdit) return;
const q = _taqClean($('#taqQ') ? $('#taqQ').value : '');
if (!q) { showToast('先写问题'); return; }
const raw = _taqReadOpts().map(_taqClean).filter(Boolean);
const opts = raw.filter((x, i) => raw.indexOf(x) === i).slice(0, TAQ_MAX_OPTS);
if (opts.length < TAQ_MIN_OPTS) { showToast('至少两个不一样的选项'); return; }
const own = _taqEdit.scope === 'own';
if (own && !_taqEdit.cid) { showToast('选一位联系人'); return; }
const list = _taAskOwn();
const hit = _taqEdit.id ? list.find(c => c && c.id === _taqEdit.id) : null;
const rec = hit || { id: _taqNewId(), off: 0 };
rec.q = q; rec.opts = opts;
rec.scope = own ? 'own' : 'public';
rec.cid = own ? _taqEdit.cid : '';
if (!hit) list.push(rec);
save();
closeTaAskEditor();
_taqTab = 'own';
renderTaAskPage();
showToast(hit ? '改好了' : '加好了');
}
function _taqToggleScope(scope) { if (_taqEdit) { _taqEdit.scope = scope === 'own' ? 'own' : 'public'; _taqPaintScope(); } }
function _taqPickOwner(cid) { if (_taqEdit) { _taqEdit.cid = cid || ''; _taqPaintScope(); } }
function _taqTogglePreset(i) {
const g = _taAskPresetGroup();
if (!g) return;
const c = (g.cards || [])[Number(i)];
if (c == null) return;
const nowOff = !cardIsOff(g, c);
cardSetOff(g, c, nowOff);
save();
renderTaAskPage();
showToast(nowOff ? '这一条停用了' : '这一条恢复了');
}
function _taqToggleOwn(id) {
const c = _taAskOwn().find(x => x && x.id === id);
if (!c) return;
const nowOff = !c.off;
if (nowOff) c.off = 1; else delete c.off;
save();
renderTaAskPage();
showToast(nowOff ? '这一条停用了' : '这一条恢复了');
}
function _taqDelete(id) {
const c = _taAskOwn().find(x => x && x.id === id);
if (!c) return;
const show = _taqClean(c.q);
openModal('删掉这条问题', '', () => {
data.taAskCards = _taAskOwn().filter(x => !x || x.id !== id);
save();
renderTaAskPage();
showToast('已删掉');
}, { noInput: true, staticText: `删除「${show.length > 24 ? show.slice(0, 24) + '…' : show}」？删了不可恢复（出厂那几条删不掉，只能停用）。`, okText: '删除', danger: true });
}
function _taqDeleteFromPanel(id) {
closeTaAskEditor();
_taqDelete(id);
}
function _taqAskNow() {
if (data.taAskOn === false) { showToast('先打开上面那个开关'); return; }
const cid = (typeof mainChatId === 'function') ? mainChatId() : '';
if (!cid) { showToast('先去首页加一个 TA'); return; }
if (typeof _cjAskWaiting === 'function' && _cjAskWaiting(cid)) { showToast('上一张还没答，先去聊天里回它'); return; }
const tc = (typeof _taAskPick === 'function') ? _taAskPick(cid) : null;
if (!tc || !tc.q) { showToast('这里还没有题，先去「我加的」加一条'); return; }
if (typeof _cjDeliver !== 'function' || typeof nextId !== 'function') { showToast('这张卡没发出去，等 TA 自己问吧'); return; }
if (!data.chats || typeof data.chats !== 'object') data.chats = {};
if (!data.chats[cid] || !Array.isArray(data.chats[cid].msgs)) data.chats[cid] = { msgs: [], unread: 0, draft: '' };
try {
_cjDeliver({ id: nextId(), from: 'partner', text: tc.q, unread: true, taAsk: { opts: tc.opts, status: 'waiting' } }, cid, 'ask');
save();
showToast('问出去了，去聊天里看');
} catch (e) { showToast('这张卡没发出去，等 TA 自己问吧'); }
}
document.addEventListener('click', e => {
const t = e.target;
if (!t || !t.closest) return;
const tabBtn = t.closest('[data-taq-tab]');
if (tabBtn) { _taqTab = tabBtn.dataset.taqTab === 'own' ? 'own' : 'preset'; renderTaAskPage(); return; }
if (t.closest('[data-taq-now]')) { _taqAskNow(); return; }
if (t.closest('[data-taq-master]')) {
data.taAskOn = (data.taAskOn === false);
save();
renderTaAskPage();
return;
}
const poff = t.closest('[data-taq-poff]');
if (poff) { _taqTogglePreset(poff.dataset.taqPoff); return; }
const off = t.closest('[data-taq-off]');
if (off) { _taqToggleOwn(off.dataset.taqOff); return; }
const edit = t.closest('[data-taq-edit]');
if (edit) { openTaAskEditor(edit.dataset.taqEdit); return; }
const del = t.closest('[data-taq-del]');
if (del) { _taqDeleteFromPanel(del.getAttribute('data-taq-del')); return; }
if (t.closest('[data-taq-add]')) { openTaAskEditor(''); return; }
if (t.closest('#taqEditOk')) { _taqCommit(); return; }
if (t.closest('#taqEditCancel') || t === $('#taqEditMask')) { closeTaAskEditor(); return; }
const sc = t.closest('[data-taq-scope]');
if (sc) { _taqToggleScope(sc.dataset.taqScope); return; }
const ow = t.closest('[data-taq-owner]');
if (ow) { _taqPickOwner(ow.dataset.taqOwner); return; }
if (t.closest('#taqOptAdd')) { _taqAddOpt(); return; }
const ox = t.closest('[data-taq-optx]');
if (ox) { _taqDropOpt(Number(ox.dataset.taqOptx)); return; }
});
(window.__CHUNK_OK__ = window.__CHUNK_OK__ || {})['taask'] = true;
