// 本件由 tools/assemble.py 生成·勿手改：首屏 JS 分片（进这一页那一刻才取），源＝js/ 那些拆分件
let _ctTab = 'dup';
let _ctFilter = 'all';
let _ctScope = 'public';
let _ctWho = 'all';
let _ctPlan = null;
let _ctSel = new Set();
let _ctToken = 0;
let _ctBound = false;
let _ctAi = { busy: false, ctrl: null, kind: '', msg: '', err: '', handle: null };
let _ctMerges = null;
let _ctUndo = null;
let _ctMoves = null;
let _ctWant = null;
let _ctWantCid = '';
let _ctScatterSel = new Set();
let _ctScatterMarks = [];
function _ctBook() {
let b = data && data.cardTidy;
if (!b || typeof b !== 'object' || Array.isArray(b)) b = {};
b.at = Number(b.at) || 0;
b.scope = b.scope === 'own' ? 'own' : 'public';
b.who = (typeof b.who === 'string' && b.who) ? b.who : 'all';
b.sig = typeof b.sig === 'string' ? b.sig : '';
if (!Array.isArray(b.plan)) b.plan = [];
b.tab = ['dup', 'group', 'want'].indexOf(b.tab) >= 0 ? b.tab : 'dup';
b.filter = ['all', 'same', 'contain', 'near'].indexOf(b.filter) >= 0 ? b.filter : 'all';
b.lastRemoved = Number(b.lastRemoved) || 0;
if (!Array.isArray(b.merges)) b.merges = [];
if (!Array.isArray(b.moves)) b.moves = [];
if (!Array.isArray(b.scatterMarks)) b.scatterMarks = [];
b.wantCid = typeof b.wantCid === 'string' ? b.wantCid : '';
if (!b.want || typeof b.want !== 'object' || Array.isArray(b.want)) b.want = null;
return b;
}
function _ctCandidates() {
const out = [];
const groups = (data && data.groups) || [];
for (let gi = 0; gi < groups.length; gi++) {
const g = groups[gi];
if (!g || g.preset || g.system) continue;
if ((g.category || '主字卡') !== '主字卡') continue;
if (cardScope(g) !== _ctScope) continue;
if (_ctScope === 'own' && _ctWho !== 'all' && (g.contactId || '_none') !== _ctWho) continue;
const cards = Array.isArray(g.cards) ? g.cards : [];
for (let ci = 0; ci < cards.length; ci++) {
const t = cardText(cards[ci]);
if (!t) continue;
out.push({ gi, ci, t, g, off: cardIsOff(g, cards[ci]) });
}
}
return out;
}
function _ctSig(items) {
let h = 2166136261;
for (const it of items) {
const s = it.gi + ':' + it.ci + ':' + it.t.length;
for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
}
return items.length + '-' + (h >>> 0).toString(36);
}
function _ctNorm(s) {
return String(s == null ? '' : s)
.replace(/[\uFF01-\uFF5E]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
.toLowerCase()
.replace(/[\s\u3000.,!?;:'"“”‘’、。！？；：…—\-~·（）()【】\[\]《》<>]/g, '');
}
function _ctFindDups(items) {
const n = items.length;
if (n < 2) return [];
const parent = new Int32Array(n);
for (let i = 0; i < n; i++) parent[i] = i;
const find = x => { let r = x; while (parent[r] !== r) r = parent[r]; while (parent[x] !== r) { const p = parent[x]; parent[x] = r; x = p; } return r; };
const rank = { near: 1, contain: 2, same: 3 };
const why = new Map();
const mark = (root, r) => { if ((rank[r] || 0) > (rank[why.get(root)] || 0)) why.set(root, r); };
const uni = (a, b, r) => {
a = find(a); b = find(b);
if (a !== b) {
parent[b] = a;
const old = why.get(b);
if (old) mark(a, old);
if (r) mark(a, r);
} else if (r) mark(a, r);
};
const norm = new Array(n);
const byNorm = new Map();
for (let i = 0; i < n; i++) {
norm[i] = _ctNorm(items[i].t);
const k = norm[i];
if (!k) continue;
if (byNorm.has(k)) uni(byNorm.get(k), i, 'same'); else byNorm.set(k, i);
}
const bgs = new Array(n);
const inv = new Map();
for (let i = 0; i < n; i++) {
const s = norm[i];
if (s.length < 4) { bgs[i] = null; continue; }
const set = new Set();
for (let k = 0; k < s.length - 1; k++) set.add(s.slice(k, k + 2));
bgs[i] = set;
for (const bg of set) {
let arr = inv.get(bg);
if (!arr) { arr = []; inv.set(bg, arr); }
if (arr.length <= 320) arr.push(i);
}
}
const seen = new Set();
for (let i = 0; i < n; i++) {
const a = bgs[i];
if (!a) continue;
const cand = new Set();
for (const bg of a) {
const arr = inv.get(bg);
if (!arr || arr.length > 320) continue;
for (const j of arr) if (j > i) cand.add(j);
}
for (const j of cand) {
const key = i + ':' + j;
if (seen.has(key)) continue;
seen.add(key);
const b = bgs[j];
if (!b) continue;
const la = norm[i].length, lb = norm[j].length;
if (Math.min(la, lb) / Math.max(la, lb) < 0.5) continue;
if (la >= 4 && lb >= 4) {
const s = la <= lb ? norm[i] : norm[j];
const l = la <= lb ? norm[j] : norm[i];
if (l.indexOf(s) >= 0 && (l.length - s.length) / l.length <= 0.5) { uni(i, j, 'contain'); continue; }
}
let inter = 0;
for (const x of a) if (b.has(x)) inter++;
const jac = inter / (a.size + b.size - inter);
if (jac >= 0.75) uni(i, j, 'near');
}
}
const buckets = new Map();
for (let i = 0; i < n; i++) {
const r = find(i);
let arr = buckets.get(r);
if (!arr) { arr = []; buckets.set(r, arr); }
arr.push(i);
}
const groups = [];
for (const arr of buckets.values()) {
if (arr.length < 2) continue;
arr.sort((x, y) => (items[x].off ? 1 : 0) - (items[y].off ? 1 : 0) || norm[y].length - norm[x].length || x - y);
groups.push({
ids: arr.map(i => [items[i].gi, items[i].ci]),
keep: [items[arr[0]].gi, items[arr[0]].ci],
reason: why.get(find(arr[0])) || 'near'
});
}
groups.sort((a, b) => b.ids.length - a.ids.length || a.ids[0][0] - b.ids[0][0] || a.ids[0][1] - b.ids[0][1]);
return groups.slice(0, 600);
}
function _ctOkId(p) {
if (!Array.isArray(p) || p.length !== 2) return false;
const gi = +p[0], ci = +p[1];
const g = ((data && data.groups) || [])[gi];
if (!g || g.preset || g.system || (g.category || '主字卡') !== '主字卡') return false;
const cards = Array.isArray(g.cards) ? g.cards : [];
return ci >= 0 && ci < cards.length && !!cardText(cards[ci]);
}
function _ctCleanPlan(plan) {
return (Array.isArray(plan) ? plan : []).map(g => {
const ids = (g && Array.isArray(g.ids) ? g.ids : []).filter(_ctOkId);
const keep = g && Array.isArray(g.keep) && _ctOkId(g.keep) ? [+g.keep[0], +g.keep[1]] : null;
const reason = g && ['same', 'contain', 'near'].indexOf(g.reason) >= 0 ? g.reason : 'near';
return { ids, keep, reason };
}).filter(g => g.ids.length >= 2);
}
function _ctPersist() {
const b = _ctBook();
b.at = _ctPlan ? _ctPlan.at : b.at;
b.scope = _ctScope;
b.who = _ctWho;
b.tab = _ctTab;
b.filter = _ctFilter;
b.sig = _ctPlan ? _ctPlan.sig : '';
b.plan = _ctPlan ? _ctPlan.groups.map(g => ({ ids: g.ids.map(p => [p[0], p[1]]), keep: g.keep ? [g.keep[0], g.keep[1]] : null, reason: g.reason || 'near' })) : [];
b.merges = Array.isArray(_ctMerges) ? _ctMerges.slice(0, 500).map(m => ({ owner: String(m.owner || ''), into: String(m.into || '').slice(0, 24), from: (m.from || []).slice(0, 30), on: m.on !== false })) : [];
b.moves = Array.isArray(_ctMoves) ? _ctMoves.slice(0, 6000).map(m => ({ gi: +m.gi || 0, gname: String(m.gname || '').slice(0, 24), owner: String(m.owner || '').slice(0, 40), text: String(m.text || '').slice(0, 400), into: String(m.into || '').slice(0, 24), on: m.on !== false, src: m.src ? 1 : 0 })) : [];
b.scatterMarks = Array.isArray(_ctScatterMarks) ? _ctScatterMarks.slice(0, 300).map(m => ({ name: String(m.name || '').slice(0, 24), owner: String(m.owner || '') })) : [];
b.wantCid = _ctWantCid || '';
b.want = _ctWant && _ctWant.report ? { cid: _ctWant.cid, at: +_ctWant.at || 0, report: _ctWant.report } : null;
try { save(); } catch (e) {}
}
function _ctPaintTabs() {
$$('#ctTabs [data-ct-tab]').forEach(b => b.classList.toggle('on', b.dataset.ctTab === _ctTab));
const rs = $('#ctRescan');
if (rs) rs.hidden = _ctTab !== 'dup';
const fr = $('#ctFilterRow');
if (fr) fr.hidden = _ctTab !== 'dup';
$$('#ctFilterRow [data-ct-filter]').forEach(b => b.classList.toggle('on', b.dataset.ctFilter === _ctFilter));
const sr = $('#ctScopeRow');
if (sr) sr.hidden = _ctTab === 'want';
const wr = $('#ctWhoRow');
if (wr && _ctTab === 'want') wr.hidden = true;
if (wr && _ctTab !== 'want') wr.hidden = _ctScope !== 'own' || !wr.innerHTML;
}
function _ctPaintScope() {
$$('#ctScopeRow [data-ct-scope]').forEach(b => b.classList.toggle('on', b.dataset.ctScope === _ctScope));
}
function _ctPaintWho() {
const row = $('#ctWhoRow');
if (!row) return;
if (_ctScope !== 'own') { row.hidden = true; row.innerHTML = ''; return; }
row.hidden = false;
const cs = ((data && data.contacts) || []).filter(c => c && c.kind !== 'group');
if (_ctWho !== 'all' && !cs.some(c => c.id === _ctWho)) _ctWho = 'all';
row.innerHTML = `<button type="button" class="contact-chip${_ctWho === 'all' ? ' active' : ''}" data-ct-who="all">全部专属</button>` +
cs.map(c => `<button type="button" class="contact-chip${_ctWho === c.id ? ' active' : ''}" data-ct-who="${escapeHTML(c.id)}">${escapeHTML(fixedNameOf(c) || '未命名')}</button>`).join('');
}
function _ctScan() {
const token = ++_ctToken;
_ctSel.clear();
const sum = $('#ctSum'), body = $('#ctBody'), bar = $('#ctBar');
if (bar) bar.hidden = true;
if (sum) sum.textContent = '正在扫这一本…';
if (body) body.innerHTML = '<p class="ct-empty">正在比对，几千张大概一两秒。</p>';
requestAnimationFrame(() => setTimeout(() => {
if (token !== _ctToken) return;
const items = _ctCandidates();
const sig = _ctSig(items);
const groups = _ctFindDups(items);
if (token !== _ctToken) return;
_ctPlan = { sig, at: Date.now(), groups };
_ctPersist();
if (_ctTab !== 'dup') return;
_ctRender();
}, 0));
}
function _ctRowHTML(p, keep) {
const gi = +p[0], ci = +p[1];
const g = data.groups[gi];
if (!g) return '';
const c = (g.cards || [])[ci];
const t = cardText(c);
if (!t) return '';
const key = gi + ':' + ci;
const own = cardScope(g) === 'own';
const ct = own ? ((data.contacts || []).find(x => x.id === g.contactId) || null) : null;
const where = (g.name || '未分组') + ' · ' + (own ? (ct ? (fixedNameOf(ct) || '未命名') : '未绑定') : '公用');
const off = cardIsOff(g, c);
const isKeep = Array.isArray(keep) && keep[0] === gi && keep[1] === ci;
return `<label class="ct-row">` +
`<input type="checkbox" class="ct-check" data-ct-k="${key}"${_ctSel.has(key) ? ' checked' : ''}>` +
`<span class="ct-main"><span class="ct-tx">${escapeHTML(t)}</span>` +
`<span class="ct-meta">${escapeHTML(where)}${off ? ' · 已停用' : ''}</span></span>` +
(isKeep ? '<span class="ct-keep">建议留</span>' : '') +
`</label>`;
}
function _ctBarPaint() {
const bar = $('#ctBar'), n = $('#ctBarN'), del = $('#ctDelete');
if (!bar) return;
const show = _ctTab === 'dup' && !!_ctPlan;
bar.hidden = !show;
if (!show) return;
if (n) n.textContent = `已勾 ${_ctSel.size} 张`;
if (del) del.disabled = !_ctSel.size;
}
function _ctRender() {
_ctPaintLead();
const sum = $('#ctSum'), body = $('#ctBody'), foot = $('#ctFoot');
if (!body) return;
if (!_ctPlan) { if (sum) sum.textContent = ''; body.innerHTML = ''; _ctBarPaint(); return; }
let groups = _ctPlan.groups || [];
if (_ctFilter !== 'all') groups = groups.filter(g => g.reason === _ctFilter);
const all = _ctPlan.groups || [];
const allTotal = all.reduce((a, g) => a + g.ids.length, 0);
if (sum) {
sum.innerHTML = all.length
? `找到 <b>${all.length}</b> 组 · <b>${allTotal}</b> 张很接近的卡；一张都还没删。` +
(groups.length !== all.length ? `（筛出 ${groups.length} 组）` : '') +
(_ctBook().lastRemoved ? ` · 上次整理删了 ${_ctBook().lastRemoved} 张` : '')
: '这一本里没有几乎一样的卡。';
}
if (!groups.length) {
body.innerHTML = all.length
? '<p class="ct-empty">这一档没有符合的组。<br>点上面的「全部」看看别的。</p>'
: '<p class="ct-empty">换 公用／专属、或换一位联系人再看看。<br>「重新分组」那一页还能把乱组名归并、给未分组的卡找组。</p>';
_ctBarPaint();
return;
}
body.innerHTML = groups.map((g, idx) => {
const label = g.reason === 'same' ? '完全一样' : (g.reason === 'contain' ? '一张包含另一张' : '字面很像');
return `<div class="ct-group"><div class="ct-group-hd"><b>第 ${idx + 1} 组</b><span>${g.ids.length} 张 · ${label}</span>` +
`<button type="button" class="ct-keepall" data-ct-keep="${idx}">只留这张</button></div>` +
g.ids.map(p => _ctRowHTML(p, g.keep)).join('') +
'</div>';
}).join('');
_ctBarPaint();
}
function _ctKeepOnly(idx) {
let groups = (_ctPlan && _ctPlan.groups) || [];
if (_ctFilter !== 'all') groups = groups.filter(g => g.reason === _ctFilter);
const g = groups[idx];
if (!g) return;
_ctSel.clear();
const keep = g.keep || g.ids[0];
for (const p of g.ids) if (!(keep && p[0] === keep[0] && p[1] === keep[1])) _ctSel.add(p[0] + ':' + p[1]);
_ctRender();
}
function _ctDelete() {
if (!_ctSel.size) { showToast('先勾选要删除的字卡'); return; }
if (!_ctPlan) return;
const now = _ctSig(_ctCandidates());
if (now !== _ctPlan.sig) { showToast('字卡库有变动，先点「重新扫一遍」'); return; }
const n = _ctSel.size;
openModal('删除字卡', '', async () => {
const byG = {};
for (const k of _ctSel) {
const p = k.split(':');
const gi = +p[0], ci = +p[1];
if (!(gi >= 0) || !(ci >= 0)) continue;
(byG[gi] = byG[gi] || []).push(ci);
}
let removed = 0;
for (const gi of Object.keys(byG).map(Number)) {
const g = data.groups[gi];
if (!g || g.preset || g.system || (g.category || '主字卡') !== '主字卡') continue;
const cards = Array.isArray(g.cards) ? g.cards : [];
const cis = byG[gi].slice().sort((a, b) => b - a);
for (const ci of cis) if (ci >= 0 && ci < cards.length) { cards.splice(ci, 1); removed++; }
}
_ctSel.clear();
_ctPlan = null;
const b = _ctBook();
b.lastRemoved = (Number(b.lastRemoved) || 0) + removed;
_ctPersist();
await save();
if (typeof renderGroups === 'function') renderGroups();
showToast(`已删掉 ${removed} 张字卡`);
_ctScan();
}, { noInput: true, staticText: `删除勾选的 ${n} 张字卡？删除后不可恢复。`, okText: '删除', danger: true });
}
function _ctEnsureAi() {
if (typeof bxCfg === 'function') return Promise.resolve(true);
if (typeof ensureChunk !== 'function') return Promise.resolve(false);
return Promise.resolve(ensureChunk('bangxie')).then(() => typeof bxCfg === 'function').catch(() => false);
}
function _ctBusyOpen(label) {
try {
if (typeof aibusyOpen !== 'function') return null;
const h = aibusyOpen('#ctAiBusy', {
label: label || '正在写…',
onStop: function () { _ctAiAbort(); }
});
_ctAi.handle = h;
return h;
} catch (e) { _ctAi.handle = null; return null; }
}
function _ctBusyClose() {
try {
if (_ctAi.handle && typeof aibusyClose === 'function') aibusyClose(_ctAi.handle);
} catch (e) {}
_ctAi.handle = null;
}
function _ctBusyDelta(busy, metaFn) {
if (!busy) return null;
let last = 0;
return function (raw) {
const now = Date.now();
if (now - last < 200) return;
last = now;
const n = String(raw || '').length;
const pre = metaFn ? String(metaFn() || '') : '';
busy.setMeta((pre ? pre + ' · ' : '') + '已收 ' + n + ' 字');
busy.setLive(_ctPartialText(raw));
};
}
function _ctPartialText(raw) {
const s = String(raw || '');
const re = /"((?:[^"\\]|\\.)*)"/g;
const out = [];
let m;
while ((m = re.exec(s))) {
if (/^\s*:/.test(s.slice(re.lastIndex))) continue;
let t = m[1];
try { t = JSON.parse('"' + t + '"'); } catch (e) {}
t = String(t == null ? '' : t).trim();
if (t) out.push(t);
}
const joined = out.join(' · ');
return joined.length > 140 ? (joined.slice(0, 140) + '…') : joined;
}
function _ctApiReady() {
try {
const a = bxCfg().api;
return !!(String(a.base || '').trim() && String(a.model || '').trim());
} catch (e) { return false; }
}
function _ctApiHint() {
return _ctApiReady() ? '' : '先去「设置 → AI 接口」把地址和模型填好；没接接口也能用第一段。';
}
async function _ctAsk(system, user, maxTokens, onDelta) {
if (!_ctApiReady()) throw new Error('还没接 AI 接口');
const api = bxCfg().api;
const body = {
model: api.model,
messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
temperature: 0.3,
max_tokens: Math.max(4096, Number(maxTokens) || 1200)
};
const urls = (typeof _bxChatURLs === 'function') ? _bxChatURLs() : [];
if (!urls.length) throw new Error('没有可用的对话地址');
const signal = _ctAi.ctrl ? _ctAi.ctrl.signal : undefined;
const streamBody = Object.assign({}, body, { stream: true });
const slowApi = Object.assign({}, api, { timeout: 60 });
let j = null, lastErr = null;
for (const u of urls) {
try {
if (typeof _bxFetchStream === 'function') {
try {
j = await _bxFetchStream(u, streamBody, {
api: api,
signal: signal,
onDelta: typeof onDelta === 'function' ? onDelta : null
});
break;
} catch (es) {
if (es && es.aborted) throw es;
if (es && es.streamed) throw es;
if (es && (es.status === 404 || es.status === 405)) throw es;
lastErr = es;
}
}
j = await _bxFetchJSON(u, body, { api: slowApi, signal: signal });
break;
} catch (e) {
lastErr = e;
if (e && (e.status === 404 || e.status === 405)) continue;
throw e;
}
}
if (!j) throw lastErr || new Error('没有可用的对话地址');
const c = j && j.choices && j.choices[0];
let text = '';
if (c && c.message) {
if (typeof c.message.content === 'string') text = c.message.content;
else if (Array.isArray(c.message.content)) text = c.message.content.map(x => (x && (x.text || x.content)) || '').join('');
}
if (!text && c && typeof c.text === 'string') text = c.text;
text = String(text || '').trim();
if (!text) {
const seg = _ctReasonJson(_ctMsgReasoning(c));
if (seg) return seg;
const e = new Error('这一发没读出东西'); e.empty = true; throw e;
}
return text;
}
function _ctMsgReasoning(c) {
const m = (c && c.message) || c || {};
if (typeof _bxMsgText === 'function') { try { return _bxMsgText(m).reasoning; } catch (e) {} }
return String((m.reasoning_content != null ? m.reasoning_content : m.reasoning) || '');
}
function _ctReasonJson(rg) {
const s = String(rg || '').replace(/^```[a-z]*\s*/i, '').replace(/```\s*$/, '').trim();
const trySeg = (a, b) => {
if (a < 0 || b <= a) return '';
const seg = s.slice(a, b + 1);
try { JSON.parse(seg); return seg; } catch (e) { return ''; }
};
return trySeg(s.indexOf('{'), s.lastIndexOf('}')) || trySeg(s.indexOf('['), s.lastIndexOf(']'));
}
function _ctJson(text) {
let s = String(text || '').trim().replace(/^```[a-z]*\s*/i, '').replace(/```\s*$/, '').trim();
const a = s.indexOf('{'), b = s.lastIndexOf('}');
if (a >= 0 && b > a) s = s.slice(a, b + 1);
return JSON.parse(s);
}
function _ctWhy(e) {
try { return typeof _bxWhy === 'function' ? _bxWhy(e, bxCfg().api) : String((e && e.message) || e); }
catch (x) { return String((e && e.message) || e); }
}
function _ctAiSay(msg, bad) {
_ctAi.msg = msg || '';
const el = document.getElementById('ctAiState');
if (el) {
el.textContent = _ctAi.msg;
el.classList.toggle('bad', !!bad);
el.classList.toggle('ok', !bad && !!_ctAi.msg);
}
}
function _ctAiStart(kind) {
_ctAi.busy = true;
_ctAi.kind = kind;
_ctAi.msg = '';
_ctAi.err = '';
try { _ctAi.ctrl = new AbortController(); } catch (e) { _ctAi.ctrl = null; }
}
function _ctAiEnd() {
_ctAi.busy = false;
_ctAi.kind = '';
_ctAi.ctrl = null;
}
function _ctAiAbort() {
if (!_ctAi.busy) return;
try { if (_ctAi.ctrl) _ctAi.ctrl.abort(); } catch (e) {}
_ctAiSay('已取消这一发；已经回来的结果留着。');
_ctBusyClose();
_ctAiEnd();
_ctGroupRender();
}
function _ctGroupBuckets() {
const map = new Map();
for (let gi = 0; gi < (data.groups || []).length; gi++) {
const g = data.groups[gi];
if (!g || g.preset || g.system) continue;
if ((g.category || '主字卡') !== '主字卡') continue;
if (cardScope(g) !== _ctScope) continue;
if (_ctScope === 'own' && _ctWho !== 'all' && (g.contactId || '_none') !== _ctWho) continue;
const owner = _ctScope === 'own' ? (g.contactId || '_none') : '';
const key = _ctScope + '|' + owner;
let b = map.get(key);
if (!b) { b = { scope: _ctScope, owner, groups: [] }; map.set(key, b); }
b.groups.push({ gi, name: g.name || '未分组' });
}
return Array.from(map.values());
}
function _ctUngroupedCards() {
const out = [];
for (let gi = 0; gi < (data.groups || []).length; gi++) {
const g = data.groups[gi];
if (!g || g.preset || g.system) continue;
if ((g.category || '主字卡') !== '主字卡') continue;
if (cardScope(g) !== _ctScope) continue;
if (_ctScope === 'own' && _ctWho !== 'all' && (g.contactId || '_none') !== _ctWho) continue;
if (g.name && g.name !== '未分组') continue;
const cards = Array.isArray(g.cards) ? g.cards : [];
for (let ci = 0; ci < cards.length; ci++) {
const t = cardText(cards[ci]);
if (t) out.push({ gi, ci, text: t, gname: '未分组', owner: _ctScope === 'own' ? (g.contactId || '_none') : '' });
}
}
return out;
}
function _ctGroupsForScatter() {
const out = [];
for (let gi = 0; gi < (data.groups || []).length; gi++) {
const g = data.groups[gi];
if (!g || g.preset || g.system) continue;
if ((g.category || '主字卡') !== '主字卡') continue;
if (cardScope(g) !== _ctScope) continue;
if (_ctScope === 'own' && _ctWho !== 'all' && (g.contactId || '_none') !== _ctWho) continue;
const nm = g.name || '未分组';
if (nm === '未分组') continue;
const n = (Array.isArray(g.cards) ? g.cards : []).filter(c => !!cardText(c)).length;
if (!n) continue;
out.push({ gi, name: nm, n });
}
out.sort((a, b) => b.n - a.n || a.gi - b.gi);
return out;
}
function _ctScCostText() {
if (!_ctApiReady()) return _ctApiHint();
const groups = _ctGroupsForScatter().filter(g => _ctScatterSel.has(g.gi));
const n = groups.reduce((a, g) => a + g.n, 0);
return groups.length ? `勾了 ${groups.length} 组 · ${n} 张 ≈ ${Math.ceil(n / 40) || 0} 次请求（可分多次跑，随时取消）` : '先勾选要打散的组';
}
function _ctScCostPaint() {
const el = document.getElementById('ctScCost');
if (el) el.textContent = _ctScCostText();
if (_ctAi.busy) return;
const btn = document.querySelector('[data-ct-ai="scatter"]');
if (btn) btn.disabled = !_ctApiReady() || !_ctGroupsForScatter().some(g => _ctScatterSel.has(g.gi));
}
function _ctGroupNames(bucket) {
const seen = new Set();
const out = [];
for (const x of bucket.groups) {
const nm = String(x.name || '').trim();
if (!nm || nm === '未分组' || seen.has(nm)) continue;
seen.add(nm);
out.push(nm);
if (out.length >= 100) break;
}
return out;
}
function _ctOwnerName(owner) {
if (!owner || owner === '_none') return '未绑定';
const c = ((data && data.contacts) || []).find(x => x.id === owner);
return c ? (fixedNameOf(c) || '未命名') : '未绑定';
}
function _ctGroupRender() {
const sum = $('#ctSum'), body = $('#ctBody'), foot = $('#ctFoot');
const buckets = _ctGroupBuckets();
const un = _ctUngroupedCards();
const mergeCount = (Array.isArray(_ctMerges) ? _ctMerges : []).length;
const moveCount = (Array.isArray(_ctMoves) ? _ctMoves : []).length;
const unCount = un.length;
const groupCount = buckets.reduce((a, b) => a + b.groups.length, 0);
if (sum) sum.innerHTML = `这一本有 <b>${groupCount}</b> 组 · 未分组的卡 <b>${unCount}</b> 张。`;
if (foot) {
foot.hidden = false;
foot.textContent = 'AI 只给建议：归并与归类都要你勾选才应用；专属不会跨联系人。';
}
const ready = _ctApiReady();
const hint = _ctApiHint();
const mergeBatches = buckets.reduce((a, b) => a + (Math.ceil(_ctGroupNames(b).length / 100) || 0), 0);
const moveBatches = Math.ceil(unCount / 40);
const mBusy = _ctAi.busy && _ctAi.kind === 'merge';
const mDis = !ready || (!!_ctAi.busy && !mBusy) || mergeBatches === 0;
const xBusy = _ctAi.busy && _ctAi.kind === 'move';
const xDis = !ready || (!!_ctAi.busy && !xBusy) || unCount === 0;
let html = '';
if (_ctUndo) {
html += `<div class="ct-ai-box"><div class="ct-ai-hd"><b>刚才那批已应用</b><span>可撤回</span></div>` +
`<p class="ct-ai-note">刚搬的卡与清掉的组都留着底：按一下整批回到应用前（只记最近一次，本页不关就一直在）。</p>` +
`<div class="ct-ai-acts"><button type="button" class="soft-btn" data-ct-undo>撤销这次应用</button></div></div>`;
}
const cntAll = {};
for (const g of (data.groups || [])) {
if (!g || g.preset || g.system) continue;
if ((g.category || '主字卡') !== '主字卡') continue;
const nm = g.name || '未分组';
if (nm === '未分组') continue;
const k = (cardScope(g) === 'own' ? (g.contactId || '_none') : '') + '|' + nm;
cntAll[k] = (cntAll[k] || 0) + (Array.isArray(g.cards) ? g.cards.reduce((a, c) => a + (cardText(c) ? 1 : 0), 0) : 0);
}
html += `<div class="ct-ai-box"><div class="ct-ai-hd"><b>把乱组名归并成清楚的组</b><span>${groupCount} 组</span></div>` +
`<p class="ct-ai-note">让 AI 读这一本的全部组名，只把意思真正重复的（近义、同一种事的两种叫法）并成一个；主题相近但不是一回事的不并。同一个名字只会并给同一本库、同一位联系人；专属不会串人。</p>` +
`<div class="ct-ai-acts">` +
`<button type="button" class="${mBusy ? 'soft-btn' : 'primary-btn'}" data-ct-ai="merge"${mDis ? ' disabled' : ''}>${mBusy ? '取消这一发' : '让 AI 归并组名'}</button>` +
`<span class="ct-cost">${hint || `会发 ${mergeBatches} 次请求（每 100 个组名一次）`}</span></div>` +
`<div class="ct-ai-state${_ctAi.err ? ' bad' : ''}" id="ctAiState">${escapeHTML(_ctAi.msg || '')}</div>` +
`<div class="ct-progress" id="ctAiProg"></div>` +
`<div class="ct-ai-busy" id="ctAiBusy"></div>`;
if (mergeCount) {
html += '<div class="ct-plan">' + _ctMerges.map((m, i) => {
const mv = (m.from || []).reduce((a, nm) => a + (cntAll[(m.owner || '') + '|' + nm] || 0), 0);
const intoN = cntAll[(m.owner || '') + '|' + m.into] || 0;
return `<label class="ct-plan-row"><input type="checkbox" data-ct-mk="${i}"${m.on !== false ? ' checked' : ''}>` +
`<span class="ct-plan-main"><span class="ct-plan-tx">${escapeHTML((m.from || []).join('、'))}</span>` +
`<span class="ct-plan-to">并进 → <b>${escapeHTML(m.into)}</b>${_ctScope === 'own' ? ' · ' + escapeHTML(_ctOwnerName(m.owner)) : ''}（搬 ${mv} 张 · 并完共 ${intoN + mv} 张）</span></span></label>`;
}).join('') + '</div>';
}
html += '</div>';
html += `<div class="ct-ai-box"><div class="ct-ai-hd"><b>给「未分组」的卡找组</b><span>${unCount} 张</span></div>` +
`<p class="ct-ai-note">只动「未分组」这一组：AI 从现有组名里挑，拿不准就留空；新组名不超过 12 个字。已经分好组的卡不碰。</p>` +
`<div class="ct-ai-acts">` +
`<button type="button" class="${xBusy ? 'soft-btn' : 'primary-btn'}" data-ct-ai="move"${xDis ? ' disabled' : ''}>${xBusy ? '取消这一发' : '让 AI 给它们找组'}</button>` +
`<span class="ct-cost">${hint || `会发 ${moveBatches} 次请求（每 40 张一次）`}</span></div>`;
if (moveCount) {
html += '<div class="ct-plan">' + _ctMoves.map((m, i) => {
const intoN = cntAll[(m.owner || '') + '|' + m.into] || 0;
return `<label class="ct-plan-row"><input type="checkbox" data-ct-cmk="${i}"${m.on !== false ? ' checked' : ''}>` +
`<span class="ct-plan-main"><span class="ct-plan-tx">${escapeHTML(m.text)}</span>` +
`<span class="ct-plan-to">放进 → <b>${escapeHTML(m.into)}</b>（该组现有 ${intoN} 张）</span></span></label>`;
}).join('') + '</div>';
}
html += '</div>';
const scatterGroups = _ctGroupsForScatter();
const scTotal = scatterGroups.reduce((a, g) => a + g.n, 0);
const sBusy = _ctAi.busy && _ctAi.kind === 'scatter';
const sDis = !ready || (!!_ctAi.busy && !sBusy) || !scatterGroups.some(g => _ctScatterSel.has(g.gi));
html += `<div class="ct-ai-box"><div class="ct-ai-hd"><b>打散重归</b><span>${scatterGroups.length} 组 · ${scTotal} 张</span></div>` +
`<p class="ct-ai-note">散在乱组里的卡也重新找组：勾选要重捋的组，这些组里的文字卡全部交给 AI 重新归；应用后搬空了的组会删掉。默认一个都不勾，你自己挑。</p>` +
(scatterGroups.length ? '<div class="ct-plan">' + scatterGroups.map(g =>
`<label class="ct-plan-row"><input type="checkbox" data-ct-sc="${g.gi}"${_ctScatterSel.has(g.gi) ? ' checked' : ''}>` +
`<span class="ct-plan-main"><span class="ct-plan-tx">${escapeHTML(g.name)}</span>` +
`<span class="ct-plan-to">${g.n} 张文字卡</span></span></label>`
).join('') + '</div>' : '<p class="ct-ai-note">这一本还没有可打散的组。</p>') +
`<div class="ct-ai-acts">` +
`<button type="button" class="${sBusy ? 'soft-btn' : 'primary-btn'}" data-ct-ai="scatter"${sDis ? ' disabled' : ''}>${sBusy ? '取消这一发' : '打散勾选的组'}</button>` +
`<span class="ct-cost" id="ctScCost">${escapeHTML(_ctScCostText())}</span></div></div>`;
if (!mergeCount && !moveCount && !_ctAi.busy) {
html += '<p class="ct-empty">还没有计划。<br>先点上面任意一枚，AI 给的建议会列在这里，勾选后才应用。</p>';
}
body.innerHTML = html;
_ctAiBarPaint();
}
function _ctAiBarPaint() {
const bar = $('#ctAiBar'), n = $('#ctAiN'), ap = $('#ctAiApply');
if (!bar) return;
const show = _ctTab === 'group' && (Array.isArray(_ctMerges) && _ctMerges.length || Array.isArray(_ctMoves) && _ctMoves.length);
bar.hidden = !show;
if (!show) return;
const mc = (Array.isArray(_ctMerges) ? _ctMerges : []).filter(m => m.on !== false).length;
const xc = (Array.isArray(_ctMoves) ? _ctMoves : []).filter(m => m.on !== false).length;
if (n) n.textContent = `已勾 ${mc + xc} 条`;
if (ap) ap.disabled = !(mc + xc);
}
async function _ctRunMerge() {
if (_ctAi.busy) { _ctAiAbort(); return; }
if (!await _ctEnsureAi()) { showToast(_ctApiHint() || 'AI 组件还没就绪，稍后再试'); return; }
const buckets = _ctGroupBuckets().filter(b => _ctGroupNames(b).length >= 2);
if (!buckets.length) { showToast('这一本没有可归并的组名'); return; }
_ctAiStart('merge');
_ctAi.err = '';
_ctMerges = [];
_ctGroupRender();
_ctAiSay('正在归并组名…');
const busy = _ctBusyOpen('正在归并组名…');
let done = 0;
try {
for (const b of buckets) {
const names = _ctGroupNames(b);
const cnt = {};
for (const x of b.groups) {
const nm = String(x.name || '').trim();
if (!nm || nm === '未分组') continue;
const g = data.groups[x.gi];
const n = g && Array.isArray(g.cards) ? g.cards.reduce((a, c) => a + (cardText(c) ? 1 : 0), 0) : 0;
cnt[nm] = (cnt[nm] || 0) + n;
}
const disp = batch => batch.map(nm => cnt[nm] ? `${nm}(${cnt[nm]}张)` : nm);
for (let i = 0; i < names.length; i += 100) {
if (!_ctAi.busy) return;
const batch = names.slice(i, i + 100);
done++;
const prog = document.getElementById('ctAiProg');
if (prog) prog.textContent = `第 ${done} / ${Math.max(1, Math.ceil(names.length / 100))} 批 · ${_ctScope === 'own' ? _ctOwnerName(b.owner) : '公用'}`;
const sys = '你在帮用户整理一个私人聊天应用的字卡分组名。只输出 JSON，不输出解释。';
const usr = '下面是一组字卡库的组名（用「|」分隔，括号里是这一组的卡数）。请找出意思基本重复的组名——近义词、同一件事的两种叫法（如「心情卡」和「心绪卡」）——归到其中一个名字下。\n' +
'规则：\n' +
'1. 只并意思基本重复的。只是同属一个大主题、说的却是不同的事，一律不并：例如「dirty talk」和「sweet talk」、「塔罗牌」和「雷诺曼牌」、「味道」和「意象」，都不许并。\n' +
'2. into 必须照抄 from 里的某一个原组名（一般挑卡数最多的那个），禁止发明名单里没有的新名字——「感官意象」「状态与情绪表达」这种新起的大类名一律不合格。\n' +
'3. 宁可不并；一条建议都不出是完全正常的结果。\n' +
'4. 只输出 JSON：{"merges":[{"into":"from 里的原组名","from":["原组名1","原组名2"]}]}；from 至少 2 个、必须照抄名单里括号前的组名，不得编造。\n' +
'5. 不要输出解释，不要用代码块。\n' +
'组名：' + disp(batch).join('|');
const text = await _ctAsk(sys, usr, 1200, _ctBusyDelta(busy, () => `第 ${done} / ${Math.max(1, Math.ceil(names.length / 100))} 批`));
let j = null;
try { j = _ctJson(text); } catch (e) { continue; }
const list = (j && Array.isArray(j.merges)) ? j.merges : [];
for (const m of list) {
const from = (m && Array.isArray(m.from) ? m.from : []).map(x => String(x || '').trim().replace(/[（(]\d+张[）)]$/, '').trim()).filter(x => batch.indexOf(x) >= 0);
if (from.length < 2) continue;
let into = String((m && m.into) || '').trim().slice(0, 24);
if (from.indexOf(into) < 0) into = from.reduce((a, b) => ((cnt[b] || 0) > (cnt[a] || 0) ? b : a));
if (_ctMerges.some(x => x.owner === b.owner && from.some(n => x.from.indexOf(n) >= 0))) continue;
_ctMerges.push({ owner: b.owner, into, from, on: true });
}
}
}
_ctAiSay(`读出 ${_ctMerges.length} 条归并建议；勾选后按「应用勾选的」。`);
} catch (e) {
_ctAi.err = _ctWhy(e);
_ctAiSay(_ctAi.err + '（已经回来的结果留着）', true);
} finally {
_ctBusyClose();
_ctAiEnd();
_ctPersist();
_ctGroupRender();
}
}
async function _ctRunMoves() {
if (_ctAi.busy) { _ctAiAbort(); return; }
if (!await _ctEnsureAi()) { showToast(_ctApiHint() || 'AI 组件还没就绪，稍后再试'); return; }
const cards = _ctUngroupedCards();
if (!cards.length) { showToast('这一本没有未分组的卡'); return; }
const buckets = _ctGroupBuckets();
const names = [];
for (const b of buckets) for (const nm of _ctGroupNames(b)) if (names.indexOf(nm) < 0) names.push(nm);
const nameList = names.slice(0, 80);
_ctAiStart('move');
_ctAi.err = '';
_ctMoves = [];
_ctGroupRender();
_ctAiSay('正在给未分组的卡找组…');
const busy = _ctBusyOpen('正在给未分组的卡找组…');
const total = Math.ceil(cards.length / 40);
let done = 0;
try {
for (let i = 0; i < cards.length; i += 40) {
if (!_ctAi.busy) return;
const batch = cards.slice(i, i + 40);
done++;
const prog = document.getElementById('ctAiProg');
if (prog) prog.textContent = `第 ${done} / ${total} 批`;
const sys = '你在帮用户把没有分组的字卡放进已有的字卡组里。只输出 JSON，不输出解释。';
const usr = '现有组名（只能从这里选，或用一个新的短组名，不超过 12 个字）：' + (nameList.join('|') || '（还没有组）') + '\n' +
'请给每一张卡挑一个合适的组名；拿不准就留空。\n' +
'只输出 JSON：{"items":[{"i":0,"g":"组名"}]}\n' +
'不要输出解释，不要用代码块。\n' +
'卡片（每行「序号. 内容」）：\n' +
batch.map((c, k) => `${k}. ${c.text.slice(0, 60)}`).join('\n');
const text = await _ctAsk(sys, usr, 1200, _ctBusyDelta(busy, () => `第 ${done} / ${total} 批`));
let j = null;
try { j = _ctJson(text); } catch (e) { continue; }
const list = (j && Array.isArray(j.items)) ? j.items : [];
for (const it of list) {
const k = Number(it && it.i);
const g = String((it && it.g) || '').trim().slice(0, 24);
if (!(k >= 0 && k < batch.length) || !g) continue;
const src = batch[k];
if (_ctMoves.some(x => x.gi === src.gi && x.text === src.text)) continue;
_ctMoves.push({ gi: src.gi, gname: src.gname || '未分组', owner: String(src.owner || ''), text: src.text, into: g, on: true });
}
}
_ctAiSay(`读出 ${_ctMoves.length} 条归类建议；勾选后按「应用勾选的」。`);
} catch (e) {
_ctAi.err = _ctWhy(e);
_ctAiSay(_ctAi.err + '（已经回来的结果留着）', true);
} finally {
_ctBusyClose();
_ctAiEnd();
_ctPersist();
_ctGroupRender();
}
}
async function _ctRunScatter() {
if (_ctAi.busy) { _ctAiAbort(); return; }
if (!await _ctEnsureAi()) { showToast(_ctApiHint() || 'AI 组件还没就绪，稍后再试'); return; }
const chosen = _ctGroupsForScatter().filter(g => _ctScatterSel.has(g.gi));
if (!chosen.length) { showToast('先勾选要打散的组'); return; }
const cards = [];
for (const g of chosen) {
const gr = data.groups[g.gi];
if (!gr || gr.preset || gr.system) continue;
const cs = Array.isArray(gr.cards) ? gr.cards : [];
for (let ci = 0; ci < cs.length; ci++) {
const t = cardText(cs[ci]);
if (!t) continue;
if (_ctMoves.some(m => m.gi === g.gi && m.text === t)) continue;
cards.push({ gi: g.gi, gname: gr.name || '未分组', owner: _ctBucketOf(gr), text: t });
}
}
if (!cards.length) { showToast('勾选的组里没有可重捋的文字卡'); return; }
if (_ctMoves.length + cards.length > 6000) { showToast('要重捋的卡太多了：先应用已经回来的建议，再继续打散剩下的'); return; }
const buckets = _ctGroupBuckets();
const names = [];
for (const b of buckets) for (const nm of _ctGroupNames(b)) if (names.indexOf(nm) < 0) names.push(nm);
const nameList = names.slice(0, 80);
for (const g of chosen) {
const gr = data.groups[g.gi];
if (!gr) continue;
const mk = { name: gr.name || '未分组', owner: _ctBucketOf(gr) };
if (!_ctScatterMarks.some(x => x.name === mk.name && x.owner === mk.owner)) _ctScatterMarks.push(mk);
}
_ctAiStart('scatter');
_ctAi.err = '';
_ctGroupRender();
_ctAiSay('正在给勾选组的卡找新组…');
const busy = _ctBusyOpen('正在给勾选组的卡找新组…');
const total = Math.ceil(cards.length / 40);
let done = 0, got = 0;
try {
for (let i = 0; i < cards.length; i += 40) {
if (!_ctAi.busy) return;
const batch = cards.slice(i, i + 40);
done++;
const prog = document.getElementById('ctAiProg');
if (prog) prog.textContent = `第 ${done} / ${total} 批 · 已收 ${got} 条建议`;
const sys = '你在帮用户把没有分组的字卡放进已有的字卡组里。只输出 JSON，不输出解释。';
const usr = '现有组名（只能从这里选，或用一个新的短组名，不超过 12 个字）：' + (nameList.join('|') || '（还没有组）') + '\n' +
'请给每一张卡挑一个合适的组名；拿不准就留空。\n' +
'只输出 JSON：{"items":[{"i":0,"g":"组名"}]}\n' +
'不要输出解释，不要用代码块。\n' +
'卡片（每行「序号. 内容」）：\n' +
batch.map((c, k) => `${k}. ${c.text.slice(0, 60)}`).join('\n');
const text = await _ctAsk(sys, usr, 1200, _ctBusyDelta(busy, () => `第 ${done} / ${total} 批`));
let j = null;
try { j = _ctJson(text); } catch (e) { continue; }
const list = (j && Array.isArray(j.items)) ? j.items : [];
for (const it of list) {
const k = Number(it && it.i);
const g = String((it && it.g) || '').trim().slice(0, 24);
if (!(k >= 0 && k < batch.length) || !g) continue;
const src = batch[k];
if (_ctMoves.some(x => x.gi === src.gi && x.text === src.text)) continue;
_ctMoves.push({ gi: src.gi, gname: src.gname || '未分组', owner: String(src.owner || ''), text: src.text, into: g, on: true, src: 1 });
got++;
}
_ctPersist();
}
_ctAiSay(`读出 ${got} 条建议；勾选后按「应用勾选的」，应用时搬空了的组会删掉。`);
} catch (e) {
_ctAi.err = _ctWhy(e);
_ctAiSay(_ctAi.err + '（已经回来的结果留着）', true);
} finally {
_ctBusyClose();
_ctAiEnd();
_ctPersist();
_ctGroupRender();
}
}
function _ctCardKey(c) {
const t = cardText(c);
if (t) return 't|' + t.length + '|' + t.slice(0, 160);
const img = cardImage(c);
if (img) return 'i|' + img.length + '|' + img.slice(0, 80);
return '';
}
function _ctHasCard(g, c) {
const k = _ctCardKey(c);
if (!k) return false;
return (g.cards || []).some(x => _ctCardKey(x) === k);
}
function _ctFindCard(g, text) {
const cards = Array.isArray(g && g.cards) ? g.cards : [];
for (let i = 0; i < cards.length; i++) if (cardText(cards[i]) === text) return i;
return -1;
}
function _ctBucketOf(g) {
return cardScope(g) === 'own' ? (g.contactId || '_none') : '';
}
function _ctFindGroup(name, owner) {
for (let i = 0; i < (data.groups || []).length; i++) {
const g = data.groups[i];
if (!g || g.preset || g.system) continue;
if ((g.category || '主字卡') !== '主字卡') continue;
if (cardScope(g) !== _ctScope) continue;
if (_ctScope === 'own' && (g.contactId || '_none') !== owner) continue;
if ((g.name || '未分组') === name) return i;
}
return -1;
}
function _ctMakeGroup(name, owner) {
const g = { name: String(name || '').slice(0, 24), category: '主字卡', scope: _ctScope, cards: [] };
if (_ctScope === 'own' && owner && owner !== '_none') g.contactId = owner;
data.groups.push(g);
return data.groups.length - 1;
}
function _ctApplyMove(m) {
let src = null;
if (m.gname) {
const owner = String(m.owner || (_ctScope === 'own' ? '_none' : ''));
for (const g of (data.groups || [])) {
if (!g || g.preset || g.system) continue;
if ((g.category || '主字卡') !== '主字卡') continue;
if (cardScope(g) !== _ctScope) continue;
if (_ctScope === 'own' && (g.contactId || '_none') !== owner) continue;
if ((g.name || '未分组') === m.gname) { src = g; break; }
}
} else {
src = data.groups[m.gi];
}
if (!src || src.preset || src.system || (src.category || '主字卡') !== '主字卡') return 0;
if (cardScope(src) !== _ctScope) return 0;
const owner = _ctBucketOf(src);
const idx = _ctFindCard(src, m.text);
if (idx < 0) return 0;
let ti = _ctFindGroup(m.into, owner);
if (ti < 0) ti = _ctMakeGroup(m.into, owner);
const c = src.cards.splice(idx, 1)[0];
if (!_ctHasCard(data.groups[ti], c)) data.groups[ti].cards.push(c);
return 1;
}
function _ctApplyMerge(m) {
const owner = String(m.owner || '');
const same = g => cardScope(g) === _ctScope && (_ctScope === 'public' || (g.contactId || '_none') === owner);
const valid = g => g && !g.preset && !g.system && (g.category || '主字卡') === '主字卡' && same(g);
let ti = -1;
for (let i = 0; i < data.groups.length; i++) if (valid(data.groups[i]) && (data.groups[i].name || '未分组') === m.into) { ti = i; break; }
if (ti < 0) ti = _ctMakeGroup(m.into, owner);
const target = data.groups[ti];
let moved = 0;
for (const nm of m.from) {
for (let gi = 0; gi < data.groups.length; gi++) {
const g = data.groups[gi];
if (gi === ti || !valid(g) || (g.name || '未分组') !== nm) continue;
for (const c of (g.cards || []).slice()) {
if (_ctHasCard(target, c)) continue;
target.cards.push(c);
moved++;
}
g.cards = [];
}
}
return moved;
}
function _ctSnapUndo() {
_ctUndo = {
arr: data.groups,
arr0: (data.groups || []).slice(),
items: (data.groups || []).map(g => ({ ref: g, cards: Array.isArray(g.cards) ? g.cards.slice() : [] }))
};
}
function _ctUndoApply() {
if (!_ctUndo) return;
if (_ctUndo.arr !== data.groups) { _ctUndo = null; showToast('数据重载过，这一批撤不回了'); return; }
const snapSet = new Set();
for (const it of _ctUndo.items) for (const c of it.cards) snapSet.add(c);
const extra = _ctUndo.items.map(it => (Array.isArray(it.ref.cards) ? it.ref.cards : []).filter(c => !snapSet.has(c)));
_ctUndo.items.forEach((it, k) => { it.ref.cards = it.cards.concat(extra[k]); });
const present = new Set(data.groups);
for (let i = _ctUndo.arr0.length - 1; i >= 0; i--) {
const g = _ctUndo.arr0[i];
if (!present.has(g)) data.groups.splice(Math.min(i, data.groups.length), 0, g);
}
_ctUndo = null;
save();
if (typeof renderGroups === 'function') renderGroups();
showToast('已撤回：组和卡都回到应用前');
_ctGroupRender();
}
function _ctApplyGroupPlan() {
const merges = (Array.isArray(_ctMerges) ? _ctMerges : []).filter(m => m.on !== false);
const moves = (Array.isArray(_ctMoves) ? _ctMoves : []).filter(m => m.on !== false);
if (!merges.length && !moves.length) { showToast('先勾选要应用的条目'); return; }
openModal('应用整理计划', '', async () => {
_ctSnapUndo();
let movedCards = 0, mergedGroups = 0;
for (const m of moves) movedCards += _ctApplyMove(m);
for (const m of merges) { const n = _ctApplyMerge(m); if (n) { movedCards += n; mergedGroups++; } }
const dead = [];
for (const m of merges) {
for (const nm of m.from) {
for (let gi = 0; gi < data.groups.length; gi++) {
const g = data.groups[gi];
if (!g || g.preset || g.system) continue;
if (cardScope(g) !== _ctScope) continue;
if (_ctScope === 'own' && (g.contactId || '_none') !== String(m.owner || '')) continue;
if ((g.name || '未分组') === nm && (!g.cards || !g.cards.length) && dead.indexOf(gi) < 0) dead.push(gi);
}
}
}
dead.sort((a, b) => b - a).forEach(gi => { if (gi >= 0 && gi < data.groups.length) data.groups.splice(gi, 1); });
if (Array.isArray(_ctScatterMarks) && _ctScatterMarks.length) {
const dead2 = [];
for (const mk of _ctScatterMarks) {
for (let gi = 0; gi < data.groups.length; gi++) {
const g = data.groups[gi];
if (!g || g.preset || g.system) continue;
if (cardScope(g) !== _ctScope) continue;
if (_ctScope === 'own' && (g.contactId || '_none') !== String(mk.owner || '_none')) continue;
if ((g.name || '未分组') === mk.name && (!g.cards || !g.cards.length) && dead2.indexOf(gi) < 0) dead2.push(gi);
}
}
dead2.sort((a, b) => b - a).forEach(gi => { if (gi >= 0 && gi < data.groups.length) data.groups.splice(gi, 1); });
_ctScatterMarks = [];
}
_ctScatterSel.clear();
_ctMerges = []; _ctMoves = [];
_ctPlan = null;
_ctAiSay('已应用。');
_ctPersist();
await save();
if (typeof renderGroups === 'function') renderGroups();
showToast(`已挪动 ${movedCards} 张字卡、归并 ${mergedGroups} 组`);
_ctGroupRender();
}, { noInput: true, staticText: `应用勾选的 ${merges.length + moves.length} 条？归并会挪动卡并清掉空的旧组，打散的组搬空后也会删掉；应用后页顶有一枚「撤销这次应用」，整批可回退（只记最近一次）。`, okText: '应用', danger: false });
}
function _ctWantLocal(cid) {
const have = new Map();
const lib = new Map();
for (const g of (data.groups || [])) {
if (!g || g.preset || g.system) continue;
if ((g.category || '主字卡') !== '主字卡') continue;
if (cardScope(g) === 'own' && g.contactId && g.contactId !== cid) continue;
const nm = g.name || '未分组';
const n = (g.cards || []).filter(c => !!cardText(c)).length;
have.set(nm, (have.get(nm) || 0) + n);
for (const c of (g.cards || [])) {
const t = cardText(c);
if (t && !lib.has(t)) lib.set(t, nm);
}
}
const used = new Map();
const msgs = (((data.chats || {})[cid] || {}).msgs) || [];
for (const m of msgs) {
if (!m || m.from !== 'ta') continue;
const t = String(m.text || '').trim();
if (!t || !lib.has(t)) continue;
const nm = lib.get(t);
used.set(nm, (used.get(nm) || 0) + 1);
}
const top = Array.from(used.entries()).sort((a, b) => b[1] - a[1]).slice(0, 12);
const unused = Array.from(have.entries()).filter(([nm, n]) => n > 0 && !used.get(nm)).sort((a, b) => b[1] - a[1]).slice(0, 12);
return { have, used, top, unused, lib };
}
function _ctChatSample(cid, limit) {
const msgs = (((data.chats || {})[cid] || {}).msgs) || [];
const rows = msgs.filter(m => m && m.text && m.from !== 'system').slice(-(limit || 40));
return rows.map(m => (m.from === 'me' ? '我' : 'TA') + '：' + String(m.text).replace(/\s+/g, ' ').slice(0, 60)).join('\n');
}
function _ctWantRender() {
const sum = $('#ctSum'), body = $('#ctBody'), foot = $('#ctFoot');
const cs = ((data && data.contacts) || []).filter(c => c && c.kind !== 'group');
let cid = _ctWantCid;
if (!cid) {
cid = (data && data.activeChat) || '';
if (!cs.some(c => c.id === cid)) cid = cs.length ? cs[0].id : '';
}
if (cid && !cs.some(c => c.id === cid)) cid = cs.length ? cs[0].id : '';
_ctWantCid = cid;
const c = cs.find(x => x.id === cid) || null;
if (!c) {
if (sum) sum.textContent = '';
body.innerHTML = '<p class="ct-empty">还没有联系人。<br>先在会话页添加一位，再回来看看 TA 想要什么类型的话。</p>';
if (foot) foot.hidden = true;
return;
}
const local = _ctWantLocal(cid);
const totalUsed = Array.from(local.used.values()).reduce((a, b) => a + b, 0);
if (sum) sum.innerHTML = `正在看：<b>${escapeHTML(fixedNameOf(c) || '未命名')}</b> · 库里给 TA 的卡 <b>${Array.from(local.have.values()).reduce((a, b) => a + b, 0)}</b> 张 · TA 实际用过 <b>${totalUsed}</b> 次。`;
if (foot) {
foot.hidden = false;
foot.textContent = '这一段只读：报告只是建议，不会改你一张卡；要补哪类，按「建这个空组」只建一个空组，卡还是你自己写。';
}
let html = '<div class="contact-chip-row" data-ct-want-row>' +
cs.map(x => `<button type="button" class="contact-chip${x.id === cid ? ' active' : ''}" data-ct-want-cid="${escapeHTML(x.id)}">${escapeHTML(fixedNameOf(x) || '未命名')}</button>`).join('') +
'</div>';
html += '<div class="ct-ai-box"><div class="ct-ai-hd"><b>TA 实际在用的</b><span>从聊天记录反查</span></div>';
if (local.top.length) {
html += local.top.map(([nm, n]) => `<div class="ct-report-type"><div class="ct-report-type-main"><b>${escapeHTML(nm)}</b><span class="ct-report-count">${n} 次</span></div></div>`).join('');
} else {
html += '<p class="ct-ai-note">还没在聊天里见过 TA 发这些卡；这不等于库里没卡，可能是还没抽到。</p>';
}
html += '</div>';
html += '<div class="ct-ai-box"><div class="ct-ai-hd"><b>有卡但 TA 很少用到</b><span>按张数排</span></div>';
if (local.unused.length) {
html += local.unused.map(([nm, n]) => `<div class="ct-report-type"><div class="ct-report-type-main"><b>${escapeHTML(nm)}</b><span class="ct-report-count">${n} 张</span></div></div>`).join('');
} else {
html += '<p class="ct-ai-note">没有这种组：要么都用到过，要么库里还没有可用的卡。</p>';
}
html += '</div>';
const wBusy = _ctAi.busy && _ctAi.kind === 'want';
const wDis = !_ctApiReady() || (!!_ctAi.busy && !wBusy);
const r = _ctWant && _ctWant.report && _ctWant.cid === cid ? _ctWant.report : null;
html += '<div class="ct-ai-box"><div class="ct-ai-hd"><b>让 AI 读一读这位 TA 缺什么</b><span>人设 + 最近聊天</span></div>' +
`<p class="ct-ai-note">会带上这位 TA 的人设、说话习惯、世界观与最近 40 条聊天，只看「缺哪几类话」；不会自动写卡。</p>` +
`<div class="ct-ai-acts"><button type="button" class="${wBusy ? 'soft-btn' : 'primary-btn'}" data-ct-ai="want"${wDis ? ' disabled' : ''}>${wBusy ? '取消这一发' : '生成报告'}</button>` +
`<span class="ct-cost">${escapeHTML(_ctApiHint() || '会发 1 次请求')}</span></div>` +
`<div class="ct-ai-state${_ctAi.err ? ' bad' : ''}" id="ctAiState">${escapeHTML(_ctAi.msg || '')}</div><div class="ct-progress" id="ctAiProg"></div><div class="ct-ai-busy" id="ctAiBusy"></div>`;
if (r) {
html += '<div class="ct-report">';
if (r.about) html += `<div class="ct-report-sec"><div class="ct-report-hd">这段时间</div><p class="ct-report-p">${escapeHTML(r.about)}</p></div>`;
if (Array.isArray(r.missing) && r.missing.length) {
html += '<div class="ct-report-sec"><div class="ct-report-hd">建议补的几类</div>' +
r.missing.map(m => `<div class="ct-report-type"><div class="ct-report-type-main"><b>${escapeHTML(m.type || '')}</b>` +
(Array.isArray(m.examples) && m.examples.length ? `<div class="ct-report-ex">${m.examples.slice(0, 2).map(x => '「' + escapeHTML(x) + '」').join(' ')}</div>` : '') +
`</div><button type="button" class="soft-btn" data-ct-mkgrp="${escapeHTML(m.type || '')}">建这个空组</button></div>`).join('') + '</div>';
}
if (Array.isArray(r.mismatch) && r.mismatch.length) {
html += '<div class="ct-report-sec"><div class="ct-report-hd">可能不搭的组</div><ul class="ct-report-list">' +
r.mismatch.map(x => `<li>${escapeHTML(x)}</li>`).join('') + '</ul></div>';
}
html += '</div>';
}
html += '</div>';
body.innerHTML = html;
if (_ctTab === 'dup') {   }
const bar = $('#ctBar'); if (bar) bar.hidden = true;
const ai = $('#ctAiBar'); if (ai) ai.hidden = true;
}
async function _ctRunWant() {
if (_ctAi.busy) { _ctAiAbort(); return; }
if (!await _ctEnsureAi()) { showToast(_ctApiHint() || 'AI 组件还没就绪，稍后再试'); return; }
const cid = _ctWantCid;
const c = ((data && data.contacts) || []).find(x => x.id === cid);
if (!cid || !c) { showToast('先选一位联系人'); return; }
const local = _ctWantLocal(cid);
const mate = (typeof bxMate === 'function') ? bxMate(cid) : { persona: '', habit: '' };
let world = '';
try { world = String(bxCfg().world || ''); } catch (e) {}
const rows = [];
const names = Array.from(local.have.keys());
for (const nm of names) rows.push(`${nm}（${local.have.get(nm)} 张 / TA 用过 ${local.used.get(nm) || 0} 次）`);
_ctAiStart('want');
_ctAi.err = '';
_ctAiSay('正在读这位 TA 的聊天与人设…');
_ctWantRender();
const busy = _ctBusyOpen('正在读这位 TA 的聊天与人设…');
try {
const sys = '你在帮用户整理私人聊天应用里给一个角色用的字卡。只输出 JSON，不输出解释。';
const usr = '请判断「' + (fixedNameOf(c) || 'TA') + '」这个角色缺哪几类话。\n' +
'【世界观】' + (world || '（没写）') + '\n' +
'【TA 的人设】' + (mate.persona || '（没写）') + '\n' +
'【说话习惯】' + (mate.habit || '（没写）') + '\n' +
'【最近聊天】\n' + (_ctChatSample(cid, 40) || '（还没有聊天）') + '\n' +
'【现有字卡分组（张数 / TA 用过几次）】\n' + rows.join('\n') + '\n' +
'请只输出 JSON：{"about":"最近主要在聊什么，60 字以内","missing":[{"type":"类型名不超过 8 字","examples":["一句","一句"]}],"mismatch":["组名"]}\n' +
'规则：missing 3~6 类；mismatch 只写名单里明显不搭的组名，没有就空数组；不要编造名单里没有的组名；不要输出解释，不要用代码块。';
const text = await _ctAsk(sys, usr, 1400, _ctBusyDelta(busy));
let j = null;
try { j = _ctJson(text); } catch (e) { throw new Error('这一发没读出 JSON，可以再试一次'); }
const report = {
about: String((j && j.about) || '').slice(0, 240),
missing: (j && Array.isArray(j.missing) ? j.missing : []).slice(0, 8).map(m => ({
type: String((m && m.type) || '').trim().slice(0, 12),
examples: (m && Array.isArray(m.examples) ? m.examples : []).slice(0, 2).map(x => String(x || '').slice(0, 40))
})).filter(m => m.type),
mismatch: (j && Array.isArray(j.mismatch) ? j.mismatch : []).map(x => String(x || '').trim()).filter(x => local.have.has(x)).slice(0, 12)
};
_ctWant = { cid, at: Date.now(), report };
_ctAiSay('报告好了；想补哪类就按「建这个空组」。');
_ctPersist();
} catch (e) {
_ctAi.err = _ctWhy(e);
_ctAiSay(_ctAi.err, true);
} finally {
_ctBusyClose();
_ctAiEnd();
_ctWantRender();
}
}
function _ctWantMakeGroup(name) {
const cid = _ctWantCid;
if (!cid || !name) return;
const nm = String(name).trim().slice(0, 24);
if (!nm) return;
const exists = (data.groups || []).some(g => g && !g.preset && !g.system && (g.category || '主字卡') === '主字卡' &&
(g.scope === 'own' || g.scope !== 'public') && (g.contactId || '') === cid && (g.name || '') === nm);
if (exists) { showToast('这一位名下已经有「' + nm + '」了'); return; }
data.groups.push({ name: nm, category: '主字卡', scope: 'own', contactId: cid, cards: [] });
save();
if (typeof renderGroups === 'function') renderGroups();
showToast('建好了空组「' + nm + '」，卡还是你自己写');
}
function _ctPaintLead() {
const lead = $('#ctLead');
if (lead) lead.textContent = _ctTab === 'dup'
? '只整理「主字卡」。下面每组都是建议——一张都还没删，勾哪张才删哪张。这一段全本地比字，不花钱。'
: (_ctTab === 'group'
? '把乱组名归并成清楚的组，再给「未分组」的卡找组；AI 只给建议，勾选后才应用。这一段走你自己的 AI 接口，要花钱。'
: '看看这位 TA 实际在用什么、库里哪类很少用到，再让 AI 判断缺哪几类话；只读，不改卡。走你自己的 AI 接口，要花钱。');
}
function _ctRenderTab() {
_ctPaintTabs();
_ctPaintScope();
_ctPaintWho();
_ctPaintLead();
const sum = $('#ctSum'); if (sum) sum.textContent = '';
const body = $('#ctBody'); if (body) body.innerHTML = '';
const foot = $('#ctFoot'); if (foot) { foot.hidden = true; foot.textContent = ''; }
const bar = $('#ctBar'); if (bar) bar.hidden = true;
const ai = $('#ctAiBar'); if (ai) ai.hidden = true;
if (_ctTab === 'dup') { if (_ctPlan) _ctRender(); else _ctScan(); }
else if (_ctTab === 'group') _ctGroupRender();
else _ctWantRender();
if (_ctTab !== 'dup' && typeof bxCfg !== 'function' && typeof ensureChunk === 'function') {
ensureChunk('bangxie').then(() => {
if (document.body.dataset.view !== 'cardtidy') return;
if (_ctTab === 'group') _ctGroupRender(); else if (_ctTab === 'want') _ctWantRender();
}).catch(() => {});
}
}
function _ctTabSet(t) {
if (['dup', 'group', 'want'].indexOf(t) < 0 || t === _ctTab) return;
if (_ctAi.busy) { showToast('先等这一发跑完，或点取消'); return; }
_ctTab = t;
_ctBook().tab = t;
_ctPersist();
_ctRenderTab();
}
function _ctFilterSet(f) {
if (['all', 'same', 'contain', 'near'].indexOf(f) < 0 || f === _ctFilter) return;
_ctFilter = f;
_ctBook().filter = f;
_ctPersist();
_ctPaintTabs();
_ctRender();
}
function _ctBind() {
if (_ctBound) return;
_ctBound = true;
const tabs = $('#ctTabs');
if (tabs) tabs.addEventListener('click', e => {
const b = e.target.closest('[data-ct-tab]');
if (b) _ctTabSet(b.dataset.ctTab);
});
const filter = $('#ctFilterRow');
if (filter) filter.addEventListener('click', e => {
const b = e.target.closest('[data-ct-filter]');
if (b) _ctFilterSet(b.dataset.ctFilter);
});
const scopeRow = $('#ctScopeRow');
if (scopeRow) scopeRow.addEventListener('click', e => {
const b = e.target.closest('[data-ct-scope]');
if (!b) return;
if (_ctAi.busy) { showToast('先等这一发跑完，或点取消'); return; }
const s = b.dataset.ctScope;
if ((s !== 'public' && s !== 'own') || s === _ctScope) return;
_ctScope = s;
_ctWho = 'all';
_ctPlan = null;
_ctMerges = [];
_ctMoves = [];
_ctScatterSel.clear();
_ctPaintScope();
_ctPaintWho();
_ctPersist();
_ctRenderTab();
});
const whoRow = $('#ctWhoRow');
if (whoRow) whoRow.addEventListener('click', e => {
const b = e.target.closest('[data-ct-who]');
if (!b) return;
if (_ctAi.busy) { showToast('先等这一发跑完，或点取消'); return; }
const w = b.dataset.ctWho || 'all';
if (w === _ctWho) return;
_ctWho = w;
_ctPlan = null;
_ctMerges = [];
_ctMoves = [];
_ctScatterSel.clear();
_ctPaintWho();
_ctPersist();
_ctRenderTab();
});
const body = $('#ctBody');
if (body) {
body.addEventListener('change', e => {
const cb = e.target.closest('input[data-ct-k]');
if (cb) {
const k = cb.dataset.ctK;
if (cb.checked) _ctSel.add(k); else _ctSel.delete(k);
_ctBarPaint();
return;
}
const mk = e.target.closest('input[data-ct-mk]');
if (mk) {
const i = Number(mk.dataset.ctMk);
if (_ctMerges && _ctMerges[i]) _ctMerges[i].on = !!mk.checked;
_ctAiBarPaint();
_ctPersist();
return;
}
const cmk = e.target.closest('input[data-ct-cmk]');
if (cmk) {
const i = Number(cmk.dataset.ctCmk);
if (_ctMoves && _ctMoves[i]) _ctMoves[i].on = !!cmk.checked;
_ctAiBarPaint();
_ctPersist();
return;
}
const sc = e.target.closest('input[data-ct-sc]');
if (sc) {
const gi = Number(sc.dataset.ctSc);
if (sc.checked) _ctScatterSel.add(gi); else _ctScatterSel.delete(gi);
_ctScCostPaint();
}
});
body.addEventListener('click', e => {
const keep = e.target.closest('[data-ct-keep]');
if (keep) { _ctKeepOnly(Number(keep.dataset.ctKeep)); return; }
if (e.target.closest('[data-ct-undo]')) { _ctUndoApply(); return; }
const ai = e.target.closest('[data-ct-ai]');
if (ai) {
if (ai.dataset.ctAi === 'merge') _ctRunMerge();
else if (ai.dataset.ctAi === 'move') _ctRunMoves();
else if (ai.dataset.ctAi === 'scatter') _ctRunScatter();
else if (ai.dataset.ctAi === 'want') _ctRunWant();
return;
}
const wc = e.target.closest('[data-ct-want-cid]');
if (wc) {
if (_ctAi.busy) { showToast('先等这一发跑完，或点取消'); return; }
_ctWantCid = wc.dataset.ctWantCid;
_ctBook().wantCid = _ctWantCid;
_ctPersist();
_ctWantRender();
return;
}
const mg = e.target.closest('[data-ct-mkgrp]');
if (mg) { _ctWantMakeGroup(mg.dataset.ctMkgrp); return; }
});
}
if ($('#ctRescan')) $('#ctRescan').onclick = () => {
if (_ctAi.busy) { showToast('先等这一发跑完，或点取消'); return; }
_ctPlan = null;
_ctScan();
};
if ($('#ctKeepAll')) $('#ctKeepAll').onclick = () => { _ctSel.clear(); _ctRender(); };
if ($('#ctDelete')) $('#ctDelete').onclick = _ctDelete;
if ($('#ctAiCancel')) $('#ctAiCancel').onclick = () => {
if (_ctAi.busy) { _ctAiAbort(); return; }
if (_ctMerges) _ctMerges.forEach(m => { m.on = false; });
if (_ctMoves) _ctMoves.forEach(m => { m.on = false; });
_ctPersist();
_ctGroupRender();
};
if ($('#ctAiApply')) $('#ctAiApply').onclick = _ctApplyGroupPlan;
}
function renderCardTidyPage() {
_ctBind();
const b = _ctBook();
_ctTab = b.tab || 'dup';
_ctFilter = b.filter || 'all';
_ctScope = b.scope === 'own' ? 'own' : 'public';
_ctWho = b.who || 'all';
_ctWantCid = b.wantCid || '';
_ctSel.clear();
_ctMerges = Array.isArray(b.merges) && b.merges.length ? b.merges.map(m => ({
owner: String(m.owner || ''),
into: String(m.into || ''),
from: (Array.isArray(m.from) ? m.from : []).filter(x => typeof x === 'string'),
on: m.on !== false
})).filter(m => m.into && m.from.length >= 2 && m.from.indexOf(m.into) >= 0) : [];
_ctMoves = Array.isArray(b.moves) && b.moves.length ? b.moves.map(m => ({
gi: +m.gi || 0,
gname: String(m.gname || ''),
owner: String(m.owner || ''),
text: String(m.text || ''),
into: String(m.into || ''),
on: m.on !== false,
src: m.src ? 1 : 0
})).filter(m => m.text && m.into) : [];
_ctWant = b.want && b.want.report ? { cid: String(b.want.cid || ''), at: +b.want.at || 0, report: b.want.report } : null;
_ctScatterSel.clear();
_ctScatterMarks = Array.isArray(b.scatterMarks) && b.scatterMarks.length ? b.scatterMarks.map(m => ({
name: String(m.name || ''),
owner: String(m.owner || '')
})).filter(m => m.name) : [];
_ctAi.busy = false;
_ctAi.msg = '';
_ctAi.err = '';
_ctAi.ctrl = null;
_ctPaintTabs();
_ctPaintScope();
_ctPaintWho();
if (_ctTab === 'dup') {
const items = _ctCandidates();
const sig = _ctSig(items);
if (b.sig && b.sig === sig && Array.isArray(b.plan)) {
_ctPlan = { sig, at: +b.at || 0, groups: _ctCleanPlan(b.plan) };
_ctRender();
} else {
_ctPlan = null;
_ctScan();
}
} else {
_ctRenderTab();
}
}
(function () {
const b = document.getElementById('cardsTidyOpen');
if (b) b.addEventListener('click', () => {
const m = document.getElementById('cardsMoreMask');
if (m) m.hidden = true;
showView('cardtidy');
});
})();
(window.__CHUNK_OK__ = window.__CHUNK_OK__ || {})['cardtidy'] = true;
