// 本件由 tools/assemble.py 生成·勿手改：首屏 JS 分片（进这一页那一刻才取），源＝js/ 那些拆分件
const BX_MAX_N = 5;
const BX_CTX_N = 12;
const BX_COOL_REPLY = 60000;
const BX_COOL_MY = 45000;
const BX_FAIL_COOL = 120000;
let _bxBound = false;
let _bxBusy = false;
let _bxDraft = null;
let _bxDesk = null;
let _bxCid = '';
let _bxApiCid = '';
let _bxTab = 'api';
let _bxCool = {};
let _bxFails = 0;
let _bxFailUntil = 0;
let _bxLast = null;
let _bxChkOut = [];
let _bxTryOut = [];
let _bxSaveTimer = 0;
let _bxSkip = { at: 0, why: '' };
const BX_DRAFT_STALE = 10 * 60 * 1000;
function _bxSkipSay(why) { _bxSkip = { at: Date.now(), why: String(why || '') }; }
function _bxObj() {
if (typeof data === 'undefined' || !data) return null;
if (!data.bangxie || typeof data.bangxie !== 'object') data.bangxie = JSON.parse(JSON.stringify(defaults.bangxie));
const b = data.bangxie;
if (!b.api || typeof b.api !== 'object') b.api = JSON.parse(JSON.stringify(defaults.bangxie.api));
if (!b.mates || typeof b.mates !== 'object') b.mates = {};
return b;
}
function _bxNum(v, lo, hi, dflt) {
const n = Number(v);
if (!isFinite(n) || v === '' || v === null || v === undefined) return dflt;
return Math.max(lo, Math.min(hi, Math.round(n)));
}
function _bxDec(v, lo, hi, dflt) {
const n = Number(v);
if (!isFinite(n) || v === '' || v === null || v === undefined) return dflt;
return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}
function _bxNormApi(a) {
const d = { kind: 'openai', base: 'https://api.openai.com/v1', key: '', model: '', temp: 0.9, timeout: 20, group: '', headers: '' };
const x = Object.assign({}, d, (a && typeof a === 'object') ? a : {});
x.kind = x.kind === 'minimax' ? 'minimax' : 'openai';
x.base = String(x.base == null ? '' : x.base).trim() || d.base;
x.key = String(x.key == null ? '' : x.key);
x.model = String(x.model == null ? '' : x.model).trim();
x.group = String(x.group == null ? '' : x.group).trim();
x.headers = String(x.headers == null ? '' : x.headers).slice(0, 2000);
x.temp = _bxDec(x.temp, 0, 2, 0.9);
x.timeout = _bxNum(x.timeout, 5, 60, 20);
return x;
}
function bxCfg() {
const b = _bxObj();
if (!b) return { on: false, api: _bxNormApi({}), world: '', onReply: true, probReply: 8, onMyCard: false, probMyCard: 4, review: true, autoSave: false, autoGroup: true, maxLen: 40, mates: {} };
const _api = _bxNormApi(b.api);
Object.keys(_api).forEach(k => { b.api[k] = _api[k]; });
b.probReply = _bxNum(b.probReply, 0, 100, 8);
b.probMyCard = _bxNum(b.probMyCard, 0, 100, 4);
b.maxLen = _bxNum(b.maxLen, 6, 80, 40);
b.world = String(b.world == null ? '' : b.world);
b.on = b.on === true;
b.onReply = b.onReply !== false;
b.onMyCard = b.onMyCard === true;
b.review = b.review !== false;
b.autoSave = b.autoSave === true;
b.autoGroup = b.autoGroup !== false;
return b;
}
function bxMate(cid) {
const b = bxCfg();
const m = (cid && b.mates && b.mates[cid] && typeof b.mates[cid] === 'object') ? b.mates[cid] : null;
return {
persona: m && typeof m.persona === 'string' ? m.persona : '',
habit: m && typeof m.habit === 'string' ? m.habit : '',
off: !!(m && m.off)
};
}
function _bxMateW(cid) {
const b = bxCfg();
if (!cid) return { persona: '', habit: '', off: false };
if (!b.mates[cid] || typeof b.mates[cid] !== 'object') b.mates[cid] = { persona: '', habit: '', off: false };
return b.mates[cid];
}
function _bxApiOwnOf(cid) {
const b = bxCfg();
const m = (cid && b.mates && b.mates[cid] && typeof b.mates[cid] === 'object') ? b.mates[cid] : null;
return !!(m && m.api && typeof m.api === 'object');
}
function bxApiFor(cid) {
const b = bxCfg();
const m = (cid && b.mates && b.mates[cid] && typeof b.mates[cid] === 'object') ? b.mates[cid] : null;
if (!m || !m.api || typeof m.api !== 'object') return b.api;
const own = Object.assign({}, b.api);
const src = m.api;
if (src.kind === 'minimax' || src.kind === 'openai') own.kind = src.kind;
['base', 'model', 'group', 'headers'].forEach(k => {
if (typeof src[k] === 'string' && src[k].trim()) own[k] = src[k];
});
if (typeof src.key === 'string' && (src.key || String(src.base || '').trim())) own.key = src.key;
if (src.temp !== undefined && src.temp !== null && src.temp !== '') own.temp = src.temp;
if (src.timeout !== undefined && src.timeout !== null && src.timeout !== '') own.timeout = src.timeout;
return _bxNormApi(own);
}
function _bxNameOf(cid) {
try {
if (typeof chatNameOf === 'function') { const n = chatNameOf(cid); if (n) return n; }
} catch (e) {}
const c = (data.contacts || []).find(x => x && x.id === cid);
return (c && (c.name || c.fixedName)) || 'TA';
}
function _bxWho() {
const contacts = (data.contacts || []).filter(c => c && c.kind !== 'group');
if (_bxCid && contacts.some(c => c.id === _bxCid)) return _bxCid;
if (data.activeChat && contacts.some(c => c.id === data.activeChat)) _bxCid = data.activeChat;
else _bxCid = contacts[0] ? contacts[0].id : '';
return _bxCid;
}
const BX_API_WHO_KEY = 'ordinal-bx-apiwho';
let _bxApiWhoRead = false;
function _bxApiWhoRemember(cid) {
_bxApiCid = cid || '';
try {
if (_bxApiCid) localStorage.setItem(BX_API_WHO_KEY, _bxApiCid);
else localStorage.removeItem(BX_API_WHO_KEY);
} catch (e) {}
}
function _bxApiEditCid() {
const contacts = (data.contacts || []).filter(c => c && c.kind !== 'group');
if (!_bxApiWhoRead) {
_bxApiWhoRead = true;
try {
const saved = String(localStorage.getItem(BX_API_WHO_KEY) || '');
if (saved && contacts.some(c => c.id === saved)) _bxApiCid = saved;
else if (saved) localStorage.removeItem(BX_API_WHO_KEY);
} catch (e) {}
}
if (_bxApiCid && !contacts.some(c => c.id === _bxApiCid)) _bxApiWhoRemember('');
return _bxApiCid;
}
function _bxApiEditCfg() { return bxApiFor(_bxApiEditCid()); }
function _bxApiWriteTarget() {
const cid = _bxApiEditCid();
if (!cid) return bxCfg().api;
if (!_bxApiOwnOf(cid)) return null;
return _bxMateW(cid).api;
}
function _bxEnsureApiOwn() {
const cid = _bxApiEditCid();
if (!cid || _bxApiOwnOf(cid)) return;
_bxMateW(cid).api = JSON.parse(JSON.stringify(bxCfg().api));
_bxSaveNow();
}
function _bxApiDisable(on) {
['bxBase', 'bxKey', 'bxModel', 'bxTemp', 'bxTimeout', 'bxGroup', 'bxHeaders'].forEach(id => {
const el = document.getElementById(id);
if (el) el.disabled = !!on;
});
}
function _bxSaveNow() {
try { save(); if (typeof flushSave === 'function') flushSave(); } catch (e) {}
}
function _bxGrowPersona() {
['bxWorld', 'bxPersona', 'bxHabit'].forEach(function (id) {
const el = document.getElementById(id);
if (!el) return;
try {
el.style.height = 'auto';
const need = el.scrollHeight || 0;
el.style.height = Math.min(400, Math.max(112, need + 2)) + 'px';
el.style.overflowY = need > 400 ? 'auto' : 'hidden';
} catch (e) {}
});
}
function _bxSaveSoon() {
clearTimeout(_bxSaveTimer);
_bxSaveTimer = setTimeout(_bxSaveNow, 500);
}
function _bxPaintStatus() {
const st = document.getElementById('bxStatus');
if (!st) return;
const b = bxCfg();
const whoId = _bxWho();
const api = bxApiFor(whoId);
const own = !!(whoId && _bxApiOwnOf(whoId));
const hasBase = !!String(api.base || '').trim();
const hasKey = !!String(api.key || '').trim();
const hasModel = !!String(api.model || '').trim();
const ready = hasBase && hasModel;
const missing = [];
if (!hasBase) missing.push('地址');
if (!hasModel) missing.push('模型');
const editId = _bxApiEditCid();
const editOther = !!(editId && editId !== whoId);
st.classList.toggle('bad', b.on && !ready);
st.classList.toggle('live', b.on && ready);
st.innerHTML = (b.on ? '开着' : '没开')
+ ' · ' + (ready ? '接口已配置' : '<span class="bad">接口未配置</span>')
+ (missing.length ? ' · 还差' + missing.join('／') : (hasKey ? '' : ' · 没填 Key（有的接口不要）'))
+ (own ? ' · ' + escapeHTML(_bxNameOf(whoId)) + ' 单独一套' : '')
+ (b.on && b.review ? ' · 写卡前先给你看一眼' : '')
+ (!b.on && ready ? ' · 勾上面的【启用】才会写卡' : '')
+ (_bxSkip.at && _bxSkip.why ? '<div class="bx-status-sub">自动触发：' + escapeHTML(_bxSkip.why) + '</div>' : '')
+ (editOther ? '<div class="bx-status-sub">接口那一档正开着 ' + escapeHTML(_bxNameOf(editId)) + ' 那套（上面说的是聊天里这一位真正会用的）</div>' : '');
}
function _bxAutoOn() {
try {
const b = bxCfg();
const api = _bxApiEditCfg();
if (!String(api.base || '').trim() || !String(api.model || '').trim()) return false;
const done = b.autoTrig === true;
if (b.on && done) return false;
b.on = true;
if (!done) {
b.onReply = true;
b.onMyCard = true;
b.autoTrig = true;
}
_bxSaveNow();
const _bxSync = (id, v) => { const el = document.getElementById(id); if (el) el.checked = v; };
_bxSync('bxOn', true);
_bxSync('bxOnReply', b.onReply);
_bxSync('bxOnMyCard', b.onMyCard);
_bxPaintStatus();
bxSettingsSum();
try { showToast(done ? '接口已填好，帮写字卡已自动启用' : '接口已填好：帮写已启用，两条自动触发已默认打开'); } catch (e) {}
return true;
} catch (e) { return false; }
}
function _bxApiOf(api) { return (api && typeof api === 'object') ? _bxNormApi(api) : bxCfg().api; }
function _bxBase(api) {
let b = String(_bxApiOf(api).base || '').trim().replace(/\/+$/, '');
if (!b) b = 'https://api.openai.com/v1';
return b;
}
function _bxKind(api) { return _bxApiOf(api).kind === 'minimax' ? 'minimax' : 'openai'; }
function _bxUrlParts(u) {
const raw = String(u || '');
const i = raw.indexOf('?');
return i < 0 ? { p: raw, q: '' } : { p: raw.slice(0, i), q: raw.slice(i) };
}
function _bxWithGroup(u, api) {
if (_bxKind(api) !== 'minimax') return u;
if (!/api\.minimax(i)?\.chat(\/|$)/i.test(u)) return u;
const g = String(_bxApiOf(api).group || '').trim();
if (!g || /(?:[?&])GroupId=/i.test(u)) return u;
return u + (u.indexOf('?') >= 0 ? '&' : '?') + 'GroupId=' + encodeURIComponent(g);
}
function _bxChatURLs(api) {
const { p, q } = _bxUrlParts(_bxBase(api));
const b = p.replace(/\/+$/, '');
const out = [];
const push = u => { const x = _bxWithGroup(u + q, api); if (x && out.indexOf(x) < 0) out.push(x); };
if (_bxKind(api) === 'minimax') {
if (/\/text\/chatcompletion_v2$/i.test(b)) {
push(b);
push(b.replace(/\/text\/chatcompletion_v2$/i, '') + '/v1/text/chatcompletion_v2');
} else if (/\/v\d+$/i.test(b)) {
push(b + '/text/chatcompletion_v2');
push(b + '/chat/completions');
push(b.replace(/\/v\d+$/i, '') + '/v1/text/chatcompletion_v2');
} else {
push(b + '/v1/text/chatcompletion_v2');
push(b + '/v1/chat/completions');
push(b + '/text/chatcompletion_v2');
}
return out;
}
if (/\/chat\/completions$/i.test(b)) {
push(b);
} else if (/\/compatible-mode\/v\d+$/i.test(b) || /\/v\d+$/i.test(b)) {
push(b + '/chat/completions');
push(b.replace(/\/v\d+$/i, '') + '/chat/completions');
} else {
push(b + '/v1/chat/completions');
push(b + '/chat/completions');
}
return out;
}
function _bxChatURL(api) { return _bxChatURLs(api)[0]; }
function _bxModelsURLs(api) {
const { p, q } = _bxUrlParts(_bxBase(api));
let b = p.replace(/\/+$/, '');
if (/\/chat\/completions$/i.test(b)) b = b.replace(/\/chat\/completions$/i, '');
else if (/\/text\/chatcompletion_v2$/i.test(b)) b = b.replace(/\/text\/chatcompletion_v2$/i, '');
const root = b.replace(/\/v\d+$/i, '');
const out = [];
const push = u => { const x = _bxWithGroup(u + q, api); if (x && out.indexOf(x) < 0) out.push(x); };
push(/\/v\d+$/i.test(b) ? b + '/models' : b + '/v1/models');
if (root !== b) push(root + '/v1/models');
push(root + '/models');
if (_bxKind(api) === 'minimax') push(root + '/v1/model/list');
return out;
}
function _bxModelsURL(api) { return _bxModelsURLs(api)[0]; }
function _bxHeaderLines(api) {
const out = {};
String((_bxApiOf(api) || {}).headers || '').split(/\r?\n/).forEach(line => {
const s = line.trim();
if (!s || s.charAt(0) === '#') return;
const i = s.indexOf(':');
if (i <= 0) return;
const k = s.slice(0, i).trim(), v = s.slice(i + 1).trim();
if (k && v) out[k] = v;
});
return out;
}
function _bxWhy(e, api) {
const s = String((e && e.message) || e || '');
const cfg = _bxApiOf(api);
const isMM = cfg.kind === 'minimax';
const where = (e && e.url) ? ('（这一发打的是 ' + String(e.url).slice(0, 96) + '）') : '';
if (e && e.timeout) return s + where;
if (e && e.mmCode) {
const c = Number(e.mmCode);
if (c === 1004 || c === 2049) return 'MiniMax 没认下这个 Key/账户组（' + c + '）：检查 Key 是不是新平台的；旧域名还要在「高级」里填 GroupId。';
if (c === 1008) return 'MiniMax 账户余额不足（1008）。';
if (c === 1026 || c === 1027) return '内容被 MiniMax 风控拦下了（' + c + '）：换一句更平实的写法。';
if (c === 2013) return 'MiniMax 参数不对（2013）：检查模型名、温度与字数上限。';
return 'MiniMax 报错（' + c + '）：' + (e.message || '没有说明');
}
if (e && (e.status === 401 || e.status === 403)) {
return 'Key 没被这个接口认下来（401/403）：检查 Key、账户余额与模型权限。' + (isMM ? ' MiniMax 旧域名还要在「高级」里填账户组 GroupId。' : '') + where;
}
if (e && e.status === 404) {
if (isMM || /api\.minimax(i)?\.chat/i.test(String((cfg.api || {}).base || ''))) {
return '这个 MiniMax 地址没通（404）：新版用 https://api.minimaxi.com（会自动试 /v1/text/chatcompletion_v2 与兼容口）；旧域名要填 GroupId。';
}
return '地址或模型不对（404）：Base URL 要指到 /v1；中转站可填完整的 .../chat/completions，或换一条它给的路径再试。' + where;
}
if (e && e.status === 429) return '额度或频率被限制（429）：过一会儿再试，或换一个 Key。';
if (e && e.status >= 500) return '接口那头出错了（HTTP ' + e.status + '）：不是你的设置问题，稍后再试。' + where;
if (/failed to fetch|networkerror|load failed|fetch failed/i.test(s)) {
return '连不上这个地址：没网、接口不允许网页直接请求（CORS），或这一页需要用 https 打开。中转站若要求自定义请求头，展开「高级」填上。' + where;
}
return s || '没有拿到结果';
}
async function _bxFetchJSON(url, body, opt) {
const cfg = _bxApiOf(opt && opt.api);
const sec = Math.max(5, Math.min(60, Number(cfg.timeout) || 20));
const ctrl = new AbortController();
const ext = opt && opt.signal;
const onAbort = () => { try { ctrl.abort(); } catch (e) {} };
if (ext) {
if (ext.aborted) onAbort();
else if (typeof ext.addEventListener === 'function') ext.addEventListener('abort', onAbort);
}
const timer = setTimeout(() => ctrl.abort(), sec * 1000);
const headers = Object.assign({ 'Content-Type': 'application/json' }, _bxHeaderLines(opt && opt.api));
const _hasAuth = Object.keys(headers).some(k => /^authorization$/i.test(k));
if (cfg.key && !_hasAuth) headers.Authorization = 'Bearer ' + cfg.key.trim();
try {
const res = await fetch(url, {
method: body ? 'POST' : 'GET',
headers,
body: body ? JSON.stringify(body) : undefined,
signal: ctrl.signal
});
const txt = await res.text();
let j = null;
try { j = JSON.parse(txt); } catch (e) {}
if (!res.ok) {
const _br = j && j.base_resp;
const msg = (j && ((_br && _br.status_msg) || (j.error && (j.error.message || j.error.code)) || j.message)) || ('HTTP ' + res.status);
const err = new Error(msg);
err.status = res.status;
if (_br && _br.status_code !== undefined) err.mmCode = Number(_br.status_code);
throw err;
}
if (!j) { const err = new Error('接口没返回 JSON（中转站可能返回了网页或错误页）'); err.status = res.status; throw err; }
if (j.base_resp && j.base_resp.status_code !== undefined && Number(j.base_resp.status_code) !== 0) {
const err = new Error(j.base_resp.status_msg || ('MiniMax 错误码 ' + j.base_resp.status_code));
err.status = res.status;
err.mmCode = Number(j.base_resp.status_code);
throw err;
}
if (j.error && !j.choices) {
const err = new Error(j.error.message || j.error.code || '接口返回了一个错误');
err.status = res.status;
throw err;
}
try { Object.defineProperty(j, '__bxUrl', { value: url, enumerable: false, configurable: true }); } catch (e0) {}
return j;
} catch (e) {
if (e && e.name === 'AbortError') {
if (ext && ext.aborted) { const err = new Error('你停下了'); err.aborted = true; throw err; }
const err = new Error('超时（' + sec + ' 秒没有回话）');
err.timeout = true;
err.url = url;
throw err;
}
if (e && e.url === undefined) { try { e.url = url; } catch (e1) {} }
throw e;
} finally {
clearTimeout(timer);
if (ext && typeof ext.removeEventListener === 'function') ext.removeEventListener('abort', onAbort);
}
}
async function _bxFetchStream(url, body, opt) {
const onDelta = opt && typeof opt.onDelta === 'function' ? opt.onDelta : null;
const cfg = _bxApiOf(opt && opt.api);
const sec = Math.max(5, Math.min(60, Number(cfg.timeout) || 20));
const ctrl = new AbortController();
const ext = opt && opt.signal;
const onAbort = () => { try { ctrl.abort(); } catch (e) {} };
if (ext) {
if (ext.aborted) onAbort();
else if (typeof ext.addEventListener === 'function') ext.addEventListener('abort', onAbort);
}
let timer = setTimeout(() => ctrl.abort(), sec * 1000);
const kick = () => { clearTimeout(timer); timer = setTimeout(() => ctrl.abort(), sec * 1000); };
const headers = Object.assign({ 'Content-Type': 'application/json' }, _bxHeaderLines(opt && opt.api));
const _hasAuth = Object.keys(headers).some(k => /^authorization$/i.test(k));
if (cfg.key && !_hasAuth) headers.Authorization = 'Bearer ' + cfg.key.trim();
let streamed = false, acc = '';
const _fail = (msg, extra) => { const e = new Error(msg); if (extra) Object.assign(e, extra); e.streamed = streamed; return e; };
try {
const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body), signal: ctrl.signal });
const ct = String(res.headers.get('content-type') || '');
if (!res.ok || /application\/json/i.test(ct)) {
const txt = await res.text();
let j = null;
try { j = JSON.parse(txt); } catch (e) {}
if (!res.ok) {
const _br = j && j.base_resp;
const msg = (j && ((_br && _br.status_msg) || (j.error && (j.error.message || j.error.code)) || j.message)) || ('HTTP ' + res.status);
throw _fail(msg, { status: res.status, mmCode: _br && _br.status_code !== undefined ? Number(_br.status_code) : undefined });
}
if (!j) throw _fail('接口没返回 JSON（中转站可能返回了网页或错误页）', { status: res.status });
if (j.base_resp && j.base_resp.status_code !== undefined && Number(j.base_resp.status_code) !== 0)
throw _fail(j.base_resp.status_msg || ('MiniMax 错误码 ' + j.base_resp.status_code), { status: res.status, mmCode: Number(j.base_resp.status_code) });
if (j.error && !j.choices) throw _fail(j.error.message || j.error.code || '接口返回了一个错误', { status: res.status });
try { Object.defineProperty(j, '__bxUrl', { value: url, enumerable: false, configurable: true }); } catch (e0) {}
return j;
}
if (!res.body || typeof res.body.getReader !== 'function') throw _fail('这一边不支持流式');
const rd = res.body.getReader();
const dec = new TextDecoder('utf-8');
let buf = '';
for (;;) {
const chunk = await rd.read();
if (chunk.done) break;
kick();
buf += dec.decode(chunk.value, { stream: true });
let nl;
while ((nl = buf.indexOf('\n')) >= 0) {
const line = buf.slice(0, nl).trim();
buf = buf.slice(nl + 1);
if (!line || line.charAt(0) === ':') continue;
if (!/^data:/i.test(line)) continue;
const payload = line.replace(/^data:\s*/i, '');
if (payload === '[DONE]') { buf = ''; break; }
let ev = null;
try { ev = JSON.parse(payload); } catch (e) { continue; }
if (ev.base_resp && ev.base_resp.status_code !== undefined && Number(ev.base_resp.status_code) !== 0)
throw _fail(ev.base_resp.status_msg || ('MiniMax 错误码 ' + ev.base_resp.status_code), { mmCode: Number(ev.base_resp.status_code) });
if (ev.error && !ev.choices) throw _fail(ev.error.message || ev.error.code || '接口返回了一个错误');
const ch = ev.choices && ev.choices[0];
const piece = ch ? _bxMsgText(ch.delta || ch.message || { text: ch.text }).text : '';
if (piece) { acc += piece; streamed = true; if (onDelta) { try { onDelta(acc, 'write'); } catch (e) {} } }
}
}
if (!acc.trim()) throw _fail('流式没读到内容');
return { choices: [{ message: { content: acc } }], usage: null, __bxUrl: url };
} catch (e) {
if (e && e.name === 'AbortError') {
if (ext && ext.aborted) throw _fail('你停下了', { aborted: true });
throw _fail('超时（' + sec + ' 秒没有新字）', { timeout: true });
}
if (e && e.streamed === undefined) e.streamed = streamed;
if (e && e.url === undefined) { try { e.url = url; } catch (e1) {} }
throw e;
} finally {
clearTimeout(timer);
if (ext && typeof ext.removeEventListener === 'function') ext.removeEventListener('abort', onAbort);
}
}
function _bxPartialCards(raw) {
const s = String(raw || '');
const m = s.match(/"cards"\s*:\s*\[/);
if (!m) return [];
const rest = s.slice(m.index + m[0].length);
const re = /"((?:[^"\\]|\\.)*)"/g;
const out = [];
let mm, lastEnd = 0;
while ((mm = re.exec(rest))) {
let t = '';
try { t = String(JSON.parse('"' + mm[1] + '"')); } catch (e) { t = mm[1]; }
out.push({ text: t, done: true });
lastEnd = re.lastIndex;
if (out.length >= BX_MAX_N) return out;
}
const open = rest.slice(lastEnd).match(/^\s*(?:,\s*)?"((?:[^"\\]|\\.)*)$/);
if (open) {
const frag = open[1].replace(/\\$/, '');
let t = '';
try { t = String(JSON.parse('"' + frag + '"')); } catch (e) { t = frag.replace(/\\n/g, ' ').replace(/\\"/g, '"'); }
if (t) out.push({ text: t, done: false });
}
return out;
}
const BX_PRESETS = [
{ id: 'openai', kind: 'openai', name: 'OpenAI', base: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
{ id: 'deepseek', kind: 'openai', name: 'DeepSeek', base: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
{ id: 'zhipu', kind: 'openai', name: '智谱', base: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4-flash' },
{ id: 'qwen', kind: 'openai', name: '通义', base: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus' },
{ id: 'minimax', kind: 'minimax', name: 'MiniMax', base: 'https://api.minimaxi.com/v1', model: 'MiniMax-Text-01' },
{ id: 'relay', kind: 'openai', name: '中转站', base: '', model: '' }
];
const BX_MM_MODELS = ['MiniMax-M2', 'MiniMax-M1', 'MiniMax-Text-01', 'abab6.5s-chat', 'abab6.5g-chat'];
const BX_TPLS = [
{ id: 'day', name: '日常', text: '写几句日常的、像随口发过来的话。' },
{ id: 'night', name: '晚安', text: '写几句睡前会说的话，语气亲近但不要腻。' },
{ id: 'miss', name: '想念', text: '写几句想念对方、但不直接说「想你」的话。' },
{ id: 'sorry', name: '道歉', text: '写几句在闹别扭后先软下来的话，别解释太多。' },
{ id: 'ask', name: '邀约', text: '写几句约对方一起做点什么的话，具体一点。' },
{ id: 'care', name: '关心', text: '写几句问对方今天怎么样的话，别像查岗。' }
];
const BX_STYLES = [
{ id: 'soft', name: '更软', text: '语气再软一点，别硬邦邦的。' },
{ id: 'short', name: '更短', text: '尽量短，一句别超过十个字（和字数上限取小的那个）。' },
{ id: 'oral', name: '更口语', text: '像随口说出来的，不要书面语。' },
{ id: 'cool', name: '更冷', text: '克制一点，别黏人。' },
{ id: 'tease', name: '更撒娇', text: '可以撒娇，但别用力过猛。' },
{ id: 'plain', name: '别用感叹号', text: '不要用感叹号。' }
];
const BX_PERSONA_WIZ = ['身份／职业：', '跟我的关系：', '性格：', '在意什么：', '有过什么经历：'];
const BX_HABIT_WIZ = ['怎么称呼我：', '说话的口癖：', '常用语气：', '绝不会说的话：'];
const BX_HIST_KEY = 'ordinal-bx-history';
const BX_HIST_MAX = 30;
const BX_CMP_MAX = 4;
function _bxProfs() {
const b = _bxObj();
if (!Array.isArray(b.profiles)) b.profiles = [];
return b.profiles;
}
function _bxProfObj(p) {
return {
name: String(p.name || '').trim().slice(0, 16) || '接口',
kind: p.kind === 'minimax' ? 'minimax' : 'openai',
base: String(p.base || ''), key: String(p.key || ''), model: String(p.model || ''),
temp: Number(p.temp), timeout: Number(p.timeout),
group: String(p.group || ''), headers: String(p.headers || '')
};
}
function _bxProfIsCur(p) {
const a = (typeof _bxApiEditCfg === 'function') ? _bxApiEditCfg() : bxCfg().api;
const q = _bxProfObj(p);
return q.kind === a.kind && q.base === a.base && q.key === a.key && q.model === a.model
&& q.temp === Number(a.temp) && q.timeout === Number(a.timeout)
&& q.group === a.group && q.headers === a.headers;
}
function _bxProfApply(i) {
const p = _bxProfs()[i];
if (!p) return;
if (typeof _bxEnsureApiOwn === 'function') _bxEnsureApiOwn();
const t = (typeof _bxApiWriteTarget === 'function') ? _bxApiWriteTarget() : bxCfg().api;
if (!t) { showToast('这一位正跟着全站走：先打开「这一位单独用一套接口」再换'); return; }
const q = _bxProfObj(p);
['kind', 'base', 'key', 'model', 'temp', 'timeout', 'group', 'headers'].forEach(k => { t[k] = q[k]; });
_bxSaveNow();
renderBangxiePage();
showToast('已换上「' + q.name + '」');
}
function _bxProfSave() {
const list = _bxProfs();
if (list.length >= 12) { showToast('最多存 12 套，先删一套'); return; }
if (list.some(p => _bxProfIsCur(p))) { showToast('这一套已经在名单里了'); return; }
const src = (typeof _bxApiEditCfg === 'function') ? _bxApiEditCfg() : bxCfg().api;
const cur = _bxProfObj(Object.assign({}, src, { name: '' }));
if (typeof openModal !== 'function') { cur.name = '接口 ' + (list.length + 1); list.push(cur); _bxSaveNow(); renderBangxiePage(); return; }
openModal('给这套接口起个名字', '例：DeepSeek ∶ 便宜中转', v => {
cur.name = String(v || '').trim().slice(0, 16) || ('接口 ' + (list.length + 1));
list.push(cur);
_bxSaveNow();
renderBangxiePage();
showToast('存好了：换接口就在这儿点一行');
});
}
function _bxProfOver(i) {
const p = _bxProfs()[i];
if (!p) return;
const src = (typeof _bxApiEditCfg === 'function') ? _bxApiEditCfg() : bxCfg().api;
const cur = _bxProfObj(Object.assign({}, src, { name: p.name }));
Object.assign(p, cur);
_bxSaveNow();
renderBangxiePage();
showToast('已把现在的值覆盖进「' + p.name + '」');
}
function _bxProfDel(i) {
const list = _bxProfs();
if (!list[i]) return;
const name = list[i].name;
list.splice(i, 1);
_bxSaveNow();
renderBangxiePage();
showToast('删掉了「' + name + '」；现在用的这套没动');
}
function _bxProfPaint() {
const el = document.getElementById('bxProfList');
if (!el) return;
el.innerHTML = _bxProfs().map((p, i) => {
const q = _bxProfObj(p), cur = _bxProfIsCur(p);
return '<div class="ap-pv-row' + (cur ? ' on' : '') + '">'
+ '<button type="button" class="ap-pv-main" data-bx-prof-main="' + i + '">'
+ '<span class="ap-pv-tx"><span class="ap-pv-nm">' + escapeHTML(q.name) + '</span>'
+ '<span class="ap-pv-meta">' + escapeHTML((q.kind === 'minimax' ? 'MiniMax · ' : '') + q.base + (q.model ? ' · ' + q.model : '')) + '</span></span>'
+ '</button>'
+ '<span class="ap-pv-cur">' + (cur ? '当前' : '') + '</span>'
+ '<span class="ap-pv-acts"><button type="button" class="ap-pv-a" data-bx-prof-over="' + i + '">覆盖</button>'
+ '<button type="button" class="ap-pv-a" data-bx-prof-del="' + i + '">删</button></span></div>';
}).join('');
}
function _bxUsageAdd(u, n) {
try {
const b = _bxObj();
if (!b.usage || typeof b.usage !== 'object') b.usage = { n: 0, tin: 0, tout: 0, all: 0 };
const num = v => { const x = Math.round(Number(v)); return isFinite(x) && x > 0 ? x : 0; };
b.usage.n += Number(n) || 1;
if (u) {
b.usage.tin += num(u.in !== undefined ? u.in : u.prompt_tokens);
b.usage.tout += num(u.out !== undefined ? u.out : u.completion_tokens);
b.usage.all += num(u.all !== undefined ? u.all : u.total_tokens);
}
_bxSaveSoon();
} catch (e) {}
}
function _bxPaintUsage() {
const el = document.getElementById('bxUsageLine');
if (!el) return;
let u = { n: 0, tin: 0, tout: 0, all: 0 };
try { const b = _bxObj(); if (b.usage && typeof b.usage === 'object') u = b.usage; } catch (e) {}
el.textContent = u.n ? ('共发 ' + u.n + ' 次 · 输入 ' + u.tin + ' ∶ 输出 ' + u.tout + ' tokens' + (u.all ? '（合计 ' + u.all + '）' : ''))
: '还没发过。只记次数与 tokens，不记内容。';
}
function _bxUsageClear() {
try { const b = _bxObj(); b.usage = { n: 0, tin: 0, tout: 0, all: 0 }; } catch (e) {}
_bxSaveNow();
_bxPaintUsage();
showToast('用量读数清零了（接口那边自己的账不受影响）');
}
const BX_MODELS_KEY = 'ordinal-bx-models';
function _bxModelsKey() {
const a = (typeof _bxApiEditCfg === 'function') ? _bxApiEditCfg() : bxCfg().api;
return String(a.base || '').trim() + '|' + (a.kind === 'minimax' ? 'minimax' : 'openai');
}
function _bxModelsGet() {
try {
const j = JSON.parse(localStorage.getItem(BX_MODELS_KEY) || 'null');
if (!j || !Array.isArray(j.ids) || !j.ids.length) return null;
if (j.key !== _bxModelsKey()) return null;
return j.ids;
} catch (e) { return null; }
}
function _bxModelsRemember(ids) {
try { localStorage.setItem(BX_MODELS_KEY, JSON.stringify({ key: _bxModelsKey(), ids: ids.slice(0, 80) })); } catch (e) {}
}
function _bxModelIds(j) {
const arr = (j && (j.data || j.models || j.model_list || j.modelList)) || [];
if (!Array.isArray(arr)) return [];
return arr.map(x => (typeof x === 'string' ? x : (x && (x.id || x.model || x.model_id || x.name)))).filter(Boolean);
}
function _bxSaidSamples(cid, limit) {
const n = Math.max(0, Math.min(12, Number(limit) || 0));
if (!cid || !n) return [];
const out = [], seen = {};
(data.groups || []).forEach(g => {
if (!g || g.preset) return;
if ((typeof cardScope === 'function' ? cardScope(g) : 'own') !== 'own') return;
if (g.contactId !== cid) return;
(g.cards || []).forEach(c => {
let t = '';
try { t = String((typeof cardText === 'function') ? cardText(c) : (typeof c === 'string' ? c : '')); } catch (e) { return; }
t = t.replace(/\s+/g, ' ').trim();
if (!t || t === '[表情包]' || seen[t]) return;
if (Array.from(t).length > 40) return;
seen[t] = 1;
out.push(t);
});
});
return out.slice(0, n);
}
function _bxPersonaState(cid) {
const b = bxCfg();
const m = bxMate(cid);
const world = !!String(b.world || '').trim();
const persona = !!String(m.persona || '').trim();
const habit = !!String(m.habit || '').trim();
return {
world: world, persona: persona, habit: habit,
said: _bxSaidSamples(cid, 12).length,
bare: !world && !persona && !habit
};
}
function _bxFitOf(cid, text) {
const said = _bxSaidSamples(cid, 12);
if (!said.length) return { n: 0, why: '这一位库里还没有用过卡，评不了' };
const t = String(text || '').replace(/\s+/g, '');
if (!t) return { n: 0, why: '这张是空的' };
const grams = s => {
const m = {}, a = Array.from(s);
for (let i = 0; i + 1 < a.length; i++) m[a[i] + a[i + 1]] = 1;
return m;
};
const tg = grams(t), pool = {};
let hit = 0;
said.forEach(s => {
const g = grams(String(s).replace(/\s+/g, ''));
Object.keys(g).forEach(k => {
if (pool[k] !== undefined) return;
pool[k] = 1;
if (tg[k]) hit++;
});
});
const cover = Object.keys(tg).length ? hit / Object.keys(tg).length : 0;
const lens = said.map(s => Array.from(String(s).replace(/\s+/g, '')).length);
const avg = lens.reduce((a, b) => a + b, 0) / lens.length;
const tl = Array.from(t).length;
const lenNear = Math.abs(tl - avg) <= Math.max(2, avg * 0.5);
const n = Math.max(1, Math.min(10, 3 + Math.round(cover * 5) + (lenNear ? 2 : 0)));
const why = (hit ? ('和他平时的卡有 ' + hit + ' 处用词重合') : '用词和他平时的卡几乎不重合')
+ ' · ' + (lenNear ? ('句长接近，他平均 ' + Math.round(avg) + ' 字') : ('句长差得多，他平均 ' + Math.round(avg) + ' 字'))
+ '（按他库里 ' + said.length + ' 张卡估的）';
return { n: n, why: why };
}
function _bxCtxLines(cid, limit) {
const n = Number(limit);
if (!n) return [];
const ch = data.chats && data.chats[cid];
const msgs = (ch && ch.msgs) || [];
const out = [];
for (let i = msgs.length - 1; i >= 0 && out.length < n; i--) {
const m = msgs[i];
if (!m || m.recalled || m.bx) continue;
if (m.from === 'system') continue;
if (!m.text || m.text === '[表情包]') continue;
if (m.sticker || m.imgs || m.voice || m.tts || m.video || m.deal || m.dv || m.ask || m.taAsk || m.game || m.cal || m.wcard || m.fav || m.lyr || m.co) continue;
const t = String(m.text).replace(/\s+/g, ' ').trim();
if (!t) continue;
const who = m.from === 'me' ? '我' : (m.sender || _bxNameOf(cid));
out.push(who + '：' + Array.from(t).slice(0, 60).join(''));
}
return out.reverse();
}
function bxBuildPrompt(cid, opts) {
const o = opts || {};
const cfg = bxCfg();
const mate = bxMate(cid);
const who = _bxNameOf(cid);
const n = Math.max(1, Math.min(BX_MAX_N, Number(o.n) || 1));
const maxLen = _bxNum(o.maxLen, 6, 80, cfg.maxLen);
const L = [];
L.push('你是「言字卡」的写卡助手。只输出 JSON，不要 Markdown 代码块，不要解释。');
L.push('言字卡是一款用字卡传讯的应用：用户和一位虚拟联系人互发短句字卡。你只帮用户想「下一张字卡写什么」，不参与聊天系统的回复调度。');
L.push('【世界观】\n' + (cfg.world.trim() || '（用户没填：不要自己发明时代、地点、身份或关系阶段；只从下面的口吻样本与最近对话里推断。）'));
const said = _bxSaidSamples(cid, 8);
const _p = mate.persona.trim(), _h = mate.habit.trim();
const _emptyP = said.length
? '（用户没填。只照下面口吻样本学：句长、称呼、用词、标点习惯；不许自己发明身份、职业、经历或关系阶段。）'
: '（用户没填，也没有他用过的卡。就写日常、克制、留白的话：不点明关系、不写甜宠套路、不用放到谁身上都成立的通用情话。）';
const _emptyH = said.length
? '（用户没填：照下面口吻样本的句长、称呼与用词来。）'
: '（用户没填，也没有样本：短句、少感叹号、别用昵称，像随手发的一条消息。）';
L.push('【' + who + ' 的人设】\n' + (_p || _emptyP)
+ (_p ? '\n（从这段里找：身份 ∶ 与我的关系 ∶ 性格 ∶ 在意什么 ∶ 怎么称呼我 ∶ 绝不会说的话；没写到的项不许补。）' : ''));
L.push('【' + who + ' 的说话习惯】\n' + (_h || _emptyH));
if (said.length) L.push('【' + who + ' 以前真的用过的卡（口吻样本：只学语气、句长与用词，别照抄原句）】\n' + said.map(x => '· ' + x).join('\n'));
L.push('【这次要写】' + who + ' 可能会说的一张字卡' + (o.myLine ? '——必须接得住【我刚刚说的】那一句，像平时回消息那样' : '') + '。');
const ctx = _bxCtxLines(cid, o.ctxN === 0 ? 0 : BX_CTX_N);
if (ctx.length) L.push('【最近对话】\n' + ctx.join('\n'));
if (o.myLine) L.push('【我刚刚说的】\n我：' + Array.from(String(o.myLine).trim()).slice(0, 120).join(''));
if (o.card) L.push('【刚刚发出的那张卡】\n' + who + '：' + Array.from(String(o.card)).slice(0, 120).join(''));
if (o.req) L.push('【这次的要求】\n' + String(o.req).trim());
if (o.prev && o.prev.length) L.push('【上一版】\n' + o.prev.map((x, i) => (i + 1) + '. ' + x).join('\n'));
if (o.fix) L.push('【哪儿不对，按这个改】\n' + String(o.fix).trim());
L.push('【写法】');
L.push('1. 贴人优先：先按【世界观】与【' + who + ' 的人设／说话习惯】判断「这像不像这一个人会说的」；宁可具体、笨拙，也不要放到谁身上都成立的万能甜话。称呼、口癖、句长必须与设定和口吻样本一致。');
L.push('2. 一句一张卡：口语、自然、像真的会发出去的话；不要旁白、不要引号、不要解释、不要表情符号堆叠。');
L.push('3. 每张不超过 ' + maxLen + ' 个字；不要使用「|||」；不要重复【最近对话】里已有的句子。');
L.push('4. 这次写 ' + n + ' 张，彼此不重样。');
L.push('5. 设定里没写的东西不要凭空补：昵称、职业、经历、地点、身体状况都不许自己发明；不要提到 AI、模型、字卡、系统、设定这些词，也不要写动作或场景旁白。');
L.push('【输出】只输出这一种 JSON：{"cards":["第一张","第二张"]}');
return L.join('\n\n');
}
function _bxCleanGroup(v) {
let s = String(v == null ? '' : v).replace(/[【】\[\]「」『』"'“”‘’]/g, '').replace(/\s+/g, '').trim();
if (!s) return '';
const arr = Array.from(s);
if (arr.length > 12) s = arr.slice(0, 12).join('');
return s;
}
function _bxCleanCard(v, maxLen) {
let s = String(v == null ? '' : v).replace(/\r?\n/g, ' ').replace(/\|\|\|/g, '').replace(/\s+/g, ' ').trim();
s = s.replace(/^(?:TA|ta|我|他|她|对方)\s*[：:]\s*/, '');
s = s.replace(/^["'“”‘’「」『』]+|["'“”‘’「」『』]+$/g, '').trim();
if (!s || s === '[表情包]') return '';
const lim = _bxNum(maxLen, 6, 80, 40);
const arr = Array.from(s);
if (arr.length > lim) s = arr.slice(0, lim).join('');
return s;
}
function _bxMsgText(msg) {
const m = msg || {};
const flat = v => {
if (Array.isArray(v)) return v.map(x => (x && (x.text || x.content)) || '').join('');
return (typeof v === 'string') ? v : (v == null ? '' : String(v));
};
const text = flat(m.content != null ? m.content : m.text);
const reasoning = flat(m.reasoning_content || m.reasoning);
return { text: String(text || ''), reasoning: String(reasoning || '') };
}
function _bxNoTextErr(msg, url, extra) {
const r = _bxMsgText(msg);
const who = url ? '（这一发打的是 ' + String(url).slice(0, 80) + '）' : '';
const e = new Error(r.reasoning.trim()
? '这个模型只回了推理过程（reasoning_content），正文是空的：换一个普通对话模型，或把模型名改成不带 reasoner／thinking 的那个' + who
: '接口应了但正文是空的：多半是模型名填成了不做对话的模型（embedding／rerank），或这一发被中转站吞了' + who);
if (extra) Object.assign(e, extra);
if (url) e.url = url;
return e;
}
function _bxParse(text, n, maxLen) {
let raw = String(text || '').trim();
raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
let obj = null;
const a = raw.indexOf('{'), b = raw.lastIndexOf('}');
if (a >= 0 && b > a) { try { obj = JSON.parse(raw.slice(a, b + 1)); } catch (e) {} }
if (!obj) {
const c = raw.indexOf('['), d = raw.lastIndexOf(']');
if (c >= 0 && d > c) { try { obj = JSON.parse(raw.slice(c, d + 1)); } catch (e) {} }
}
let group = '', cards = [];
if (Array.isArray(obj)) cards = obj;
else if (obj && typeof obj === 'object') {
group = String(obj.group || obj.category || '');
cards = Array.isArray(obj.cards) ? obj.cards : (obj.card ? [obj.card] : []);
}
if (!cards.length) {
cards = raw.split(/\n+/).map(s => s.replace(/^\s*(?:[-*•]|\d+[.、)])\s*/, '').trim()).filter(Boolean);
}
const want = Math.max(1, Math.min(BX_MAX_N, Number(n) || 1));
const out = [];
const seen = {};
for (const c of cards) {
const s = _bxCleanCard(c, maxLen);
if (!s || seen[s]) continue;
seen[s] = 1;
out.push(s);
if (out.length >= want) break;
}
return { group: _bxCleanGroup(group), cards: out };
}
function _bxTransient(e) {
if (!e || e.aborted || e.canceled) return false;
if (e.timeout) return true;
return !e.status && /failed to fetch|networkerror|load failed|fetch failed/i.test(String(e.message || ''));
}
let _bxJob = null, _bxJobToken = 0;
function _bxCancelErr() { const e = new Error('已取消'); e.canceled = true; return e; }
function bxCancel() {
_bxJobToken++;
if (_bxJob) { try { _bxJob.abort(); } catch (e) {} }
_bxJob = null;
_bxBusy = false;
if (_bxDesk) {
_bxDesk.busy = false;
_bxDeskNote('已取消');
_bxDeskPaint();
}
try { showToast('已取消'); } catch (e) {}
}
async function _bxGenerate(cid, opts) {
const o = opts || {};
const api = (o.api && typeof o.api === 'object') ? _bxNormApi(o.api) : bxApiFor(cid);
if (!api.model) throw new Error('模型名空着：地址有、模型没填，这一发发不出去。去「帮写字卡 → 接口」把「模型」填上（多数接口要填模型的 id，不是显示名）');
const n = Math.max(1, Math.min(BX_MAX_N, Number(o.n) || 1));
const sysPrompt = bxBuildPrompt(cid, o);
const mkBody = stream => ({
model: api.model,
messages: [
{ role: 'system', content: sysPrompt },
{ role: 'user', content: o.req ? String(o.req) : '按上面的设定写。' }
],
temperature: api.temp,
max_tokens: Math.min(900, 160 + n * 130),
stream
});
const urls = _bxChatURLs(api);
const token = ++_bxJobToken;
const onDelta = typeof o.onDelta === 'function' ? o.onDelta : null;
let j = null, lastErr = null;
outer:
for (let i = 0; i < urls.length; i++) {
for (let attempt = 0; attempt < 2; attempt++) {
if (token !== _bxJobToken) throw _bxCancelErr();
const ctrl = new AbortController();
_bxJob = ctrl;
try {
if (onDelta) {
try {
j = await _bxFetchStream(urls[i], mkBody(true), { api, signal: ctrl.signal, onDelta });
lastErr = null; break outer;
} catch (es) {
if (token !== _bxJobToken || (es && (es.aborted || es.canceled))) throw _bxCancelErr();
lastErr = es;
if (es && es.streamed) throw es;
if (es && (es.status === 404 || es.status === 405)) throw es;
}
}
j = await _bxFetchJSON(urls[i], mkBody(false), { api, signal: ctrl.signal });
lastErr = null; break outer;
}
catch (e) {
if (token !== _bxJobToken || (e && (e.aborted || e.canceled))) throw _bxCancelErr();
lastErr = e;
if (attempt === 0 && _bxTransient(e)) {
await new Promise(r => setTimeout(r, 600));
if (token !== _bxJobToken) throw _bxCancelErr();
continue;
}
if (e && (e.status === 404 || e.status === 405)) break;
throw e;
} finally {
if (_bxJob === ctrl) _bxJob = null;
}
}
}
if (lastErr) throw lastErr;
const _msg0 = (j && j.choices && j.choices[0]) ? (j.choices[0].message || { text: j.choices[0].text }) : null;
const _got = _bxMsgText(_msg0 || {});
if (!_got.text.trim()) throw _bxNoTextErr(_msg0 || {}, j && j.__bxUrl);
const c = _got.text;
const out = _bxParse(c, n, api.maxLen);
if (o.autoGroup && out.cards.length) {
if (token !== _bxJobToken) throw _bxCancelErr();
if (onDelta) { try { onDelta('', 'group'); } catch (e2) {} }
let g = '';
try { g = await _bxGroupNameAsk(cid, out.cards, { groups: _bxGroupsOf(cid).map(x => x.name) }); }
catch (e2) {
if (e2 && (e2.canceled || e2.aborted)) throw e2;
}
out.group = g || _bxGroupGuessLocal(cid, out.cards);
} else {
out.group = '';
}
const u = j && j.usage;
out.usage = u ? {
in: Number(u.prompt_tokens) || 0,
out: Number(u.completion_tokens) || 0,
all: Number(u.total_tokens) || 0
} : null;
out.promptChars = Array.from(sysPrompt).length + Array.from(o.req ? String(o.req) : '').length;
try { _bxUsageAdd(out.usage, 1); } catch (e) {}
return out;
}
function _bxGroupsOf(cid) {
return (data.groups || []).filter(g => g && !g.preset && g.category === '帮写字卡' && cardScope(g) === 'own' && g.contactId === cid);
}
function _bxUniqueGroupName(name, cid) {
const base = _bxCleanGroup(name) || '未分组';
let out = base, i = 1;
while (_bxGroupsOf(cid).some(g => g.name === out)) out = base + (++i);
return out;
}
async function bxSaveCards(cid, cards, groupName) {
const contact = (data.contacts || []).find(c => c && c.id === cid && c.kind !== 'group');
if (!contact) return { added: 0, dup: 0, skip: 0, group: '' };
const list = (cards || []).map(s => _bxCleanCard(s, bxCfg().maxLen)).filter(Boolean);
if (!list.length) return { added: 0, dup: 0, skip: 0, group: '' };
const seen = {};
_bxGroupsOf(cid).forEach(g => (g.cards || []).forEach(c => {
const t = (typeof cardText === 'function') ? cardText(c) : '';
if (t) seen[t] = 1;
}));
const fresh = [];
let dup = 0;
list.forEach(s => { if (seen[s]) { dup++; return; } seen[s] = 1; fresh.push(s); });
if (!fresh.length) return { added: 0, dup: dup, skip: 0, group: '' };
const name = _bxCleanGroup(groupName) || '未分组';
let g = _bxGroupsOf(cid).find(x => x.name === name);
if (!g) {
g = { name: _bxUniqueGroupName(name, cid), category: '帮写字卡', scope: 'own', contactId: cid, cards: [] };
data.groups.push(g);
}
if (!Array.isArray(g.cards)) g.cards = [];
let r = { added: 0, dup: 0, skip: 0 };
if (typeof _cardsAbsorbLines === 'function') r = _cardsAbsorbLines(g, fresh);
else {
fresh.forEach(s => { if (g.cards.includes(s)) r.dup++; else { g.cards.push(s); r.added++; } });
}
try { await save(); } catch (e) {}
try { if (typeof renderGroups === 'function') renderGroups(); } catch (e) {}
return { added: r.added, dup: dup + r.dup, skip: r.skip, group: g.name };
}
function _bxRand(p) { return (Math.random() * 100) < (Number(p) || 0); }
function bxEligible(cid, timing) {
try {
const cfg = bxCfg();
if (!cfg.on) { _bxSkipSay('帮写总开关关着'); return false; }
if (!cid || !data.chats || !data.chats[cid]) { _bxSkipSay('这一本会话不在'); return false; }
if (typeof _chatIsGroup === 'function' && _chatIsGroup(cid)) { _bxSkipSay('群聊不触发'); return false; }
if (typeof vcInCall === 'function' && vcInCall(cid)) { _bxSkipSay('视频通话里不触发'); return false; }
if (typeof vcCardNarrow === 'function' && vcCardNarrow(cid)) { _bxSkipSay('视频通话里不触发'); return false; }
if (bxMate(cid).off) { _bxSkipSay('这一位设了不自动帮写'); return false; }
const api = bxApiFor(cid);
if (!String(api.base || '').trim() || !String(api.model || '').trim()) {
_bxSkipSay(!String(api.model || '').trim()
? (_bxNameOf(cid) + ' 这一位的接口没填模型名（地址有、模型空着）')
: (_bxNameOf(cid) + ' 这一位的接口没填地址'));
return false;
}
if (timing === 'mycard') { if (!cfg.onMyCard || !(cfg.probMyCard > 0)) { _bxSkipSay('「我发出字卡后」这一条没开'); return false; } }
else { if (!cfg.onReply || !(cfg.probReply > 0)) { _bxSkipSay('「TA 说完一轮后」这一条没开'); return false; } }
if (_bxBusy) { _bxSkipSay('上一次还在写，等它回来'); return false; }
if (_bxDraft && !document.getElementById('bxDraftMask')) _bxDraft = null;
if (_bxDraft && Date.now() - (_bxDraft.at || 0) > BX_DRAFT_STALE) _bxDraft = null;
if (_bxDraft) { _bxSkipSay('还有一张帮写草稿没处理'); return false; }
if (Date.now() < _bxFailUntil) {
const hm = new Date(_bxFailUntil).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
_bxSkipSay('连续失败，冷却到 ' + hm);
return false;
}
const cool = (_bxCool[cid] || 0) + (timing === 'mycard' ? BX_COOL_MY : BX_COOL_REPLY);
if (Date.now() < cool) { _bxSkipSay('刚写过，冷却中'); return false; }
const prob = timing === 'mycard' ? cfg.probMyCard : cfg.probReply;
if (!_bxRand(prob)) { _bxSkipSay('这次没掷中（' + prob + '%）'); return false; }
_bxSkipSay('这一轮掷中了，正在写');
return true;
} catch (e) { return false; }
}
function bxMaybeSend(cid, opts) {
const o = opts || {};
const timing = o.timing || 'reply';
if (!bxEligible(cid, timing)) return false;
const cfg = bxCfg();
_bxCool[cid] = Date.now();
_bxBusy = true;
setTimeout(async () => {
const onChat = data.activeChat === cid && document.body && document.body.dataset.view === 'chat';
let dd = null;
if (cfg.review && onChat) {
dd = _bxDraftOpen({ cid, text: '', group: '', timing, from: 'partner', original: '', busy: true });
_bxSkipSay('');
}
try {
const r = await _bxGenerate(cid, {
n: 1, req: '', card: o.card, autoGroup: cfg.autoGroup,
onDelta: dd ? (raw, ph) => dd._applyStream(raw, ph) : null
});
const text = r.cards[0];
if (!text) throw new Error('这次没写出来（模型返回空）');
_bxFails = 0;
_bxLast = { at: Date.now(), ok: true, why: '', text, usage: r.usage || null };
const histAt = _bxHistAdd({ cid, req: '', group: r.group, cards: [text] });
if (timing === 'active' && !cfg.review) {
if ((typeof nightOn === 'function' && nightOn()) ||
(typeof chatSilentOn === 'function' && chatSilentOn(cid)) ||
(typeof soloBlocksProactive === 'function' && soloBlocksProactive(cid))) return;
}
if (dd) {
if (_bxDraft === dd && document.getElementById('bxDraftMask')) _bxDraftFill(dd, text, r.group, histAt);
} else if (cfg.autoSave && !onChat) {
_bxSkipSay('');
bxSaveCards(cid, [text], cfg.autoGroup ? r.group : '未分组')
.then(x => { if (x && x.added) { try { showToast('帮写字卡写好一句，已存进「' + x.group + '」'); } catch (e) {} } })
.catch(() => {});
} else if (cfg.review && !onChat) {
_bxSkipSay('');
try { showToast('帮写字卡写好一句，已放进「最近写过」'); } catch (e) {}
} else {
_bxSkipSay('');
_bxSendNow(cid, text, r.group, { timing, from: 'partner', original: text });
}
} catch (e) {
if (dd) {
if (_bxDraft === dd && document.getElementById('bxDraftMask')) _bxDraftFail(dd, e);
if (!(e && (e.canceled || e.aborted))) { _bxSkipSay('上次没写成：' + _bxWhy(e)); _bxFail(e); }
} else {
_bxSkipSay('上次没写成：' + _bxWhy(e));
_bxFail(e);
}
} finally {
_bxBusy = false;
}
}, 600);
return true;
}
function bxAfterMyCard(cid, msg) {
try {
if (!cid || !msg || msg.from !== 'me' || msg.bx) return false;
if (msg.voice || msg.tts || msg.video || msg.sticker || msg.imgs) return false;
const t = String(msg.text || '').trim();
if (!t || t === '[表情包]' || (typeof imageSrcOf === 'function' && imageSrcOf(t))) return false;
return bxMaybeSend(cid, { timing: 'mycard', card: t });
} catch (e) { return false; }
}
function _bxManualSend() {
const d = _bxDesk;
if (!d) return;
const list = _bxManualList();
if (!list.length) { showToast('先写一句'); return; }
const cid = d.cid;
list.forEach(function (t) {
_bxSendNow(cid, t, d.mGroup, { timing: 'manual', from: 'partner', original: t, noAutoSave: true });
});
const at = _bxHistAdd({ cid: cid, req: '（我直接写）', group: d.mGroup || '', cards: list, sat: (d.manualSat || []).slice() });
if (at) {
d.cards = list.slice();
d.sel = list.map(function () { return true; });
d.sat = (d.manualSat || []).slice(0, list.length);
}
bxDeskClose(true);
bxGoChat(cid);
try { showToast('已发进聊天（TA 的字卡）'); } catch (e) {}
}
function _bxDeskModeApply(d) {
const root = document.getElementById('bxDeskMask');
if (!root || !d) return;
root.querySelectorAll('[data-bx-mode]').forEach(function (b) { b.classList.toggle('on', b.dataset.bxMode === d.mode); });
const ai = root.querySelector('[data-bx-ai]');
if (ai) ai.hidden = d.mode === 'manual';
const manual = document.getElementById('bxDeskManual');
if (manual) manual.hidden = d.mode !== 'manual';
if (d.mode === 'manual') _bxManualSatPaint();
}
function _bxSendNow(cid, text, group, meta) {
const cfg = bxCfg();
const o = meta || {};
const m = {
id: (typeof nextId === 'function' ? nextId() : Date.now()),
from: o.from || 'partner',
text,
src: 'bangxie',
bx: { at: Date.now(), model: cfg.api.model, timing: o.timing || '', group: group || '', original: o.original || text }
};
if (m.from === 'partner') m.unread = true;
if (o.sender) m.sender = o.sender;
let handled = false;
if (typeof _deliverToChat === 'function') {
try { _deliverToChat(m, cid); handled = true; } catch (e) {}
}
if (!handled) {
const ch = data.chats && data.chats[cid];
if (!ch) return null;
ch.msgs.push(m);
if (m.from === 'partner') ch.unread = (ch.unread || 0) + 1;
try { save(); } catch (e) {}
try { if (typeof renderMessages === 'function') renderMessages(); } catch (e) {}
}
if (cfg.autoSave && !o.noAutoSave) {
bxSaveCards(cid, [text], cfg.autoGroup ? group : '未分组')
.then(r => { if (r && r.added) { try { showToast('顺手存进「' + r.group + '」'); } catch (e) {} } })
.catch(() => {});
}
return m;
}
function _bxFail(e, quiet) {
const why = _bxWhy(e);
_bxFails++;
if (_bxFails >= 2) _bxFailUntil = Date.now() + BX_FAIL_COOL;
_bxLast = { at: Date.now(), ok: false, why, text: '' };
if (!quiet) { try { showToast('帮写字卡：' + why); } catch (err) {} }
if (document.body && document.body.dataset.view === 'bangxie') { try { _bxPaintLast(); } catch (err) {} }
}
function _bxDraftOpen(d) {
_bxDraft = d;
d.at = Date.now();
const prev = document.getElementById('bxDraftMask');
if (prev) prev.remove();
const mask = document.createElement('div');
mask.className = 'fs-sheet-mask';
mask.id = 'bxDraftMask';
const name = _bxNameOf(d.cid);
const auto = bxCfg().autoSave ? '按设置，发出时会顺手存进字卡库。' : '';
mask.innerHTML = '<div class="fs-sheet"><div class="fs-sheet-bar"><div class="fs-sheet-t"><span class="fs-sheet-ti">帮写的一张 · 给 ' + escapeHTML(name) + '</span></div><button type="button" class="fs-sheet-close" id="bxDraftX" aria-label="关闭">×</button></div>'
+ '<div class="fs-sheet-body">'
+ '<div class="bx-draft-hd"><span class="bx-card-no">第 1 张</span><span class="bx-card-no bx-sat" id="bxDraftSatTag" hidden></span></div>'
+ '<textarea id="bxDraftTa" class="fs-sheet-ta bx-draft-ta" rows="4" aria-label="帮写的字卡"></textarea>'
+ '<div class="bx-cap">存到哪个分组</div>'
+ '<div class="bx-chips" id="bxDraftGroupRow"></div>'
+ '<div class="bx-draft-note" id="bxDraftNote">这张是 AI 结合上下文写的；发出去以后仍是一张普通字卡，可以撤回、可以再改。' + auto + ' AI 自动分组＝写完后另发一小发，按写出来的内容归组。</div>'
+ '<div class="bx-draft-acts bx-draft-main"><button type="button" class="soft-btn" id="bxDraftSend">发进聊天</button><button type="button" class="soft-btn" id="bxDraftSave">存进字卡库</button></div>'
+ '<div class="bx-draft-acts bx-draft-sub"><button type="button" class="soft-btn" id="bxDraftEdit">编辑</button><button type="button" class="soft-btn" id="bxDraftSat">TA的满意度</button><button type="button" class="soft-btn" id="bxDraftAgain">换一张</button><button type="button" class="soft-btn" id="bxDraftFixBtn">哪儿不对，改着重写</button></div>'
+ '<div class="bx-draft-acts bx-draft-no"><button type="button" class="soft-btn" id="bxDraftNo">不发了</button></div>'
+ '<div class="bx-draft-fix" id="bxDraftFixWrap" hidden><textarea id="bxDraftFixTa" class="bx-ta" rows="2" placeholder="哪儿不对？例：太腻了；别用感叹号；换个话题。"></textarea><button type="button" class="soft-btn" id="bxDraftFixGo">照这个重写</button><span class="bx-draft-note">带着现在这张与这句纠正重写，不是从零再来。</span></div>'
+ '</div></div>';
document.body.appendChild(mask);
const ta = mask.querySelector('#bxDraftTa');
ta.value = d.text || '';
if (!Array.isArray(d.sat)) d.sat = [];
if (!d.storeGroup) {
const ai = (d.group && d.group !== '未分组') ? d.group : '';
d.storeGroup = (bxCfg().autoGroup && ai) ? '__ai__' : '未分组';
}
const satTag = mask.querySelector('#bxDraftSatTag');
if (satTag && d.sat[0] != null) { satTag.hidden = false; satTag.textContent = '满意度 ' + d.sat[0] + '/10'; }
_bxDraftGroupPaint();
const grpRow = mask.querySelector('#bxDraftGroupRow');
if (grpRow) grpRow.addEventListener('click', e => {
if (e.target.closest('[data-bx-draft-ai]')) { _bxDraftAiGroup(); return; }
const g = e.target.closest('[data-bx-draft-group]');
if (!g) return;
const dd = _bxDraft || d;
dd.storeGroup = g.dataset.bxDraftGroup || '未分组';
_bxDraftGroupPaint();
});
if (d.busy) {
ta.readOnly = true;
ta.placeholder = '正在写…';
['bxDraftSend', 'bxDraftSave', 'bxDraftEdit', 'bxDraftSat', 'bxDraftAgain', 'bxDraftFixBtn'].forEach(id => {
const b = mask.querySelector('#' + id); if (b) b.disabled = true;
});
d.t0 = Date.now();
const noteEl = mask.querySelector('#bxDraftNote');
const setNote = t => { if (noteEl) noteEl.textContent = t; };
setNote('正在写…');
d._tick = setInterval(() => {
if (_bxDraft !== d) { clearInterval(d._tick); d._tick = null; return; }
if (d.groupPhase === 'group') { setNote('内容写好了，正在按内容归组…'); return; }
setNote('正在写… ' + Math.round((Date.now() - d.t0) / 1000) + ' 秒');
}, 500);
d._applyStream = (raw, ph) => {
if (_bxDraft !== d || !d.busy) return;
d.groupPhase = ph === 'group' ? 'group' : '';
const p = _bxPartialCards(raw)[0];
if (p && p.text && document.activeElement !== ta) ta.value = p.text;
};
}
const close = () => {
if (d.busy) { try { bxCancel(); } catch (e) {} }
if (d._tick) { clearInterval(d._tick); d._tick = null; }
_bxDraft = null;
try { mask.remove(); } catch (e) {}
};
mask.addEventListener('click', e => { if (e.target === mask) close(); });
mask.querySelector('#bxDraftX').addEventListener('click', close);
mask.querySelector('#bxDraftNo').addEventListener('click', close);
mask.querySelector('#bxDraftEdit').addEventListener('click', () => {
try {
ta.focus();
const L = String(ta.value || '').length;
ta.setSelectionRange(L, L);
} catch (e) {}
showToast('直接在这张上改，改完再发或存');
});
mask.querySelector('#bxDraftSat').addEventListener('click', () => _bxDraftSat());
mask.querySelector('#bxDraftSend').addEventListener('click', () => {
const text = _bxCleanCard(ta.value, bxCfg().maxLen);
if (!text) { showToast('这张是空的'); return; }
const dd = _bxDraft || d;
close();
_bxSendNow(dd.cid, text, _bxDraftGroupOf(dd), { timing: dd.timing, from: dd.from || 'partner', original: dd.original });
showToast('已发进聊天');
});
mask.querySelector('#bxDraftSave').addEventListener('click', () => {
const text = _bxCleanCard(ta.value, bxCfg().maxLen);
if (!text) { showToast('这张是空的'); return; }
const dd = _bxDraft || d;
bxSaveCards(dd.cid, [text], _bxDraftGroupOf(dd)).then(r => {
showToast('存进「' + (r.group || '未分组') + '」· 新增 ' + r.added + ' 张' + (r.dup ? '，跳过重复 ' + r.dup : ''));
if (dd.histAt) _bxHistSetGroup(dd.histAt, r.group || '');
}).catch(e => showToast('没存进去：' + _bxWhy(e)));
});
mask.querySelector('#bxDraftAgain').addEventListener('click', () => {
const btn = mask.querySelector('#bxDraftAgain');
if (btn.disabled) return;
btn.disabled = true;
btn.textContent = '再写…';
const dd = _bxDraft || d;
_bxBusy = true;
dd.busy = true;
if (ta) ta.readOnly = true;
const note2 = mask.querySelector('#bxDraftNote');
if (note2) note2.textContent = '正在写…';
_bxGenerate(dd.cid, {
n: 1, card: '', autoGroup: bxCfg().autoGroup,
onDelta: raw => { if (dd.busy && ta) { const p = _bxPartialCards(raw)[0]; if (p && p.text) ta.value = p.text; } }
})
.then(r => {
const t = r.cards[0];
if (!t) throw new Error('这次没写出来');
dd.text = t;
dd.group = r.group;
dd.original = t;
dd.sat = [];
dd.storeGroup = (bxCfg().autoGroup && r.group && r.group !== '未分组') ? '__ai__' : '未分组';
ta.value = t;
const tag2 = mask.querySelector('#bxDraftSatTag');
if (tag2) { tag2.hidden = true; tag2.textContent = ''; }
_bxDraftGroupPaint();
dd.histAt = _bxHistAdd({ cid: dd.cid, req: '', group: r.group, cards: [t] });
_bxLast = { at: Date.now(), ok: true, why: '', text: t, usage: r.usage || null };
})
.catch(e => { showToast('没写出来：' + _bxWhy(e)); })
.finally(() => {
_bxBusy = false;
dd.busy = false;
if (ta) ta.readOnly = false;
if (note2) note2.textContent = '';
btn.disabled = false; btn.textContent = '换一张';
});
});
mask.querySelector('#bxDraftFixBtn').addEventListener('click', () => {
const wrap = mask.querySelector('#bxDraftFixWrap');
wrap.hidden = !wrap.hidden;
if (!wrap.hidden) { try { mask.querySelector('#bxDraftFixTa').focus(); } catch (e) {} }
});
mask.querySelector('#bxDraftFixGo').addEventListener('click', () => {
const btn = mask.querySelector('#bxDraftFixGo');
if (btn.disabled) return;
const fix = String(mask.querySelector('#bxDraftFixTa').value || '').trim();
if (!fix) { showToast('先写一句哪儿不对'); return; }
btn.disabled = true;
btn.textContent = '重写…';
const dd = _bxDraft || d;
const prevText = String(ta.value || dd.text || '').trim();
_bxBusy = true;
dd.busy = true;
if (ta) ta.readOnly = true;
const note3 = mask.querySelector('#bxDraftNote');
if (note3) note3.textContent = '正在照这个重写…';
_bxGenerate(dd.cid, {
n: 1, card: '', autoGroup: bxCfg().autoGroup, prev: prevText ? [prevText] : [], fix: fix,
onDelta: raw => { if (dd.busy && ta) { const p = _bxPartialCards(raw)[0]; if (p && p.text) ta.value = p.text; } }
})
.then(r => {
const t = r.cards[0];
if (!t) throw new Error('这次没写出来');
dd.text = t;
dd.group = r.group;
dd.original = t;
dd.sat = [];
dd.storeGroup = (bxCfg().autoGroup && r.group && r.group !== '未分组') ? '__ai__' : '未分组';
ta.value = t;
mask.querySelector('#bxDraftFixWrap').hidden = true;
const tag2 = mask.querySelector('#bxDraftSatTag');
if (tag2) { tag2.hidden = true; tag2.textContent = ''; }
_bxDraftGroupPaint();
dd.histAt = _bxHistAdd({ cid: dd.cid, req: '', group: r.group, cards: [t] });
_bxLast = { at: Date.now(), ok: true, why: '', text: t, usage: r.usage || null };
})
.catch(e => { showToast('没重写成：' + _bxWhy(e)); })
.finally(() => {
_bxBusy = false;
dd.busy = false;
if (ta) ta.readOnly = false;
if (note3) note3.textContent = '';
btn.disabled = false; btn.textContent = '照这个重写';
});
});
if (!d.busy) setTimeout(() => { try { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); } catch (e) {} }, 60);
return d;
}
function _bxDraftFill(d, text, group, histAt) {
d.busy = false;
d.groupPhase = '';
d.text = text;
d.original = text;
d.group = group || '';
d.histAt = histAt || 0;
d.sat = [];
const ai = (d.group && d.group !== '未分组') ? d.group : '';
d.storeGroup = (bxCfg().autoGroup && ai) ? '__ai__' : '未分组';
if (d._tick) { clearInterval(d._tick); d._tick = null; }
const mask = document.getElementById('bxDraftMask');
if (!mask || _bxDraft !== d) return;
const ta = mask.querySelector('#bxDraftTa');
if (ta) { ta.readOnly = false; ta.placeholder = ''; ta.value = text; }
const note = mask.querySelector('#bxDraftNote');
if (note) note.textContent = '写好了。发出去以后仍是一张普通字卡，可以撤回、可以再改。';
const st = mask.querySelector('#bxDraftSatTag');
if (st) { st.hidden = true; st.textContent = ''; }
['bxDraftSend', 'bxDraftSave', 'bxDraftEdit', 'bxDraftSat', 'bxDraftAgain', 'bxDraftFixBtn'].forEach(id => {
const b = mask.querySelector('#' + id); if (b) b.disabled = false;
});
_bxDraftGroupPaint();
try { if (ta) ta.focus(); } catch (e) {}
}
function _bxDraftFail(d, e) {
d.busy = false;
d.groupPhase = '';
if (d._tick) { clearInterval(d._tick); d._tick = null; }
const mask = document.getElementById('bxDraftMask');
if (!mask || _bxDraft !== d) return;
const ta = mask.querySelector('#bxDraftTa');
if (ta) { ta.readOnly = false; ta.placeholder = ''; }
const note = mask.querySelector('#bxDraftNote');
if (note) note.textContent = '没写成：' + _bxWhy(e) + '。上面有半截就接着改，或点「换一张」重来。';
['bxDraftSend', 'bxDraftSave', 'bxDraftEdit', 'bxDraftSat', 'bxDraftAgain', 'bxDraftFixBtn'].forEach(id => {
const b = mask.querySelector('#' + id); if (b) b.disabled = false;
});
_bxDraftGroupPaint();
}
function _bxDraftGroupOf(d) {
if (!d) return '未分组';
if (d.storeGroup === '__ai__') return (d.group && d.group !== '未分组') ? d.group : '未分组';
return d.storeGroup || '未分组';
}
function _bxDraftGroupPaint() {
const d = _bxDraft;
const row = document.getElementById('bxDraftGroupRow');
if (!d || !row) return;
const ai = (d.group && d.group !== '未分组') ? d.group : '';
const opts = ['未分组'];
_bxGroupsOf(d.cid).forEach(g => { if (g.name && g.name !== '未分组' && g.name !== ai) opts.push(g.name); });
row.innerHTML = '<button type="button" class="contact-chip' + (d.storeGroup === '__ai__' ? ' active' : '') + '" data-bx-draft-ai>'
+ (d.aiGroupBusy ? 'AI 拟着…' : ('AI 自动分组' + (ai ? '「' + escapeHTML(ai) + '」' : ''))) + '</button>'
+ opts.map(x => '<button type="button" class="contact-chip' + (d.storeGroup === x ? ' active' : '') + '" data-bx-draft-group="' + escapeHTML(x) + '">' + escapeHTML(x) + '</button>').join('');
}
async function _bxDraftAiGroup() {
const d = _bxDraft;
if (!d || d.aiGroupBusy) return;
if (d.group && d.group !== '未分组') {
d.storeGroup = '__ai__';
_bxDraftGroupPaint();
showToast('存库时按「' + d.group + '」落');
return;
}
if (!bxApiFor(d.cid).model) {
d.storeGroup = '未分组';
_bxDraftGroupPaint();
showToast('接口还没填模型，先按「未分组」存；补好模型再点这枚可以拟组名');
return;
}
const ta = document.getElementById('bxDraftTa');
const text = _bxCleanCard(ta ? ta.value : d.text, bxCfg().maxLen);
if (!text) { showToast('这张是空的'); return; }
d.aiGroupBusy = true;
_bxDraftGroupPaint();
try {
const name = await _bxGroupNameAsk(d.cid, [text]);
if (name) {
d.group = name;
d.storeGroup = '__ai__';
showToast('AI 拟的组名：「' + name + '」，存库时按它落');
} else showToast('这次没拟出来，再点一次试试');
} catch (e) {
try { showToast('没拟出来：' + _bxWhy(e, bxApiFor(d.cid))); } catch (e2) {}
} finally {
d.aiGroupBusy = false;
_bxDraftGroupPaint();
}
}
function _bxDraftSat() {
const d = _bxDraft;
if (!d || d.satBusy) return;
d.satBusy = true;
const tag = document.getElementById('bxDraftSatTag');
let n = 0, last = 0;
const iv = setInterval(() => {
last = 1 + Math.floor(Math.random() * 10);
if (tag) { tag.hidden = false; tag.textContent = '满意度 ' + last + '/10'; }
if (++n >= 9) {
clearInterval(iv);
d.satBusy = false;
d.sat = [last];
if (d.histAt && typeof _bxHistSetSat === 'function') _bxHistSetSat(d.histAt, d.sat);
try { showToast('TA 的满意度：' + last + '/10'); } catch (e) {}
}
}, 80);
}
let _bxDeskKeep = null;
function bxDeskOpen(opts) {
const o = opts || {};
const contacts = (data.contacts || []).filter(c => c && c.kind !== 'group');
if (!contacts.length) { showToast('先在首页建一位联系人'); return; }
let keep = (!o.cid && !o.seed) ? _bxDeskKeep : null;
_bxDeskKeep = null;
let cid = (keep && keep.cid) || o.cid || _bxWho();
if (!cid || !contacts.some(c => c.id === cid)) cid = contacts[0].id;
const _seed = String(o.seed || '').replace(/\s+/g, ' ').trim();
const _req = keep ? String(keep.req || '')
: (_seed ? ('接着 TA 这句「' + Array.from(_seed).slice(0, 40).join('') + '」写一句，像平时回消息那样。') : '');
const _kCards = (keep && Array.isArray(keep.cards)) ? keep.cards.slice(0, BX_MAX_N) : [];
_bxDesk = {
cid, req: _req, n: (keep && keep.n) || 3, ctx: keep ? !!keep.ctx : true, autoGroup: keep ? !!keep.autoGroup : true,
myLine: (keep && keep.myLine) || '',
group: (keep && keep.group) || o.group || '', groupPick: (keep && keep.groupPick) || '',
cards: _kCards,
sel: _kCards.map(function (c, i) { return keep && Array.isArray(keep.sel) ? !!keep.sel[i] : true; }),
sat: (keep && Array.isArray(keep.sat)) ? keep.sat.slice(0, _kCards.length) : [],
cmp: [], picks: {}, histAt: (keep && keep.histAt) || 0, busy: false, lastFix: '', from: o.from || 'page',
inReq: {}, softOK: !!(keep && keep.softOK), personaDraft: '',
mode: (keep && keep.mode === 'manual') ? 'manual' : 'ai',
manualText: (keep && keep.manualText) || '',
manualSat: (keep && Array.isArray(keep.manualSat)) ? keep.manualSat.slice() : [],
mGroup: (keep && keep.mGroup) || '',
satManualBusy: false
};
const mask = document.getElementById('bxDeskMask');
if (!mask) return;
mask.hidden = false;
_bxDeskPaint(true);
if (_kCards.length || (_bxDesk.mode === 'manual' && _bxDesk.manualText)) {
_bxDeskNote('上次没发出去的内容还在这儿；接着改、发或者存都行，不要了就把这几张丢掉、手写那格清空。');
}
}
function bxDeskClose(skipStash) {
const mask = document.getElementById('bxDeskMask');
if (mask) mask.hidden = true;
const d = _bxDesk;
if (d && !skipStash) _bxDeskStash(d);
else if (skipStash) _bxDeskKeep = null;
_bxDesk = null;
}
function _bxDeskStash(d) {
if (!d) return;
_bxDeskKeep = {
cid: d.cid, mode: d.mode || 'ai', req: d.req || '', n: d.n || 3,
myLine: d.myLine || '',
ctx: !!d.ctx, autoGroup: !!d.autoGroup, group: d.group || '', groupPick: d.groupPick || '',
manualText: d.manualText || '', manualSat: (d.manualSat || []).slice(),
mGroup: d.mGroup || '',
cards: (d.cards || []).slice(), sel: (d.sel || []).slice(), sat: (d.sat || []).slice(),
histAt: d.histAt || 0, softOK: !!d.softOK
};
if (d.cards && d.cards.length) {
if (d.histAt) _bxHistSync();
else d.histAt = _bxHistAdd({ cid: d.cid, req: d.req || '', group: d.group || '', cards: d.cards.slice() });
}
if (d.mode === 'manual') {
const list = _bxManualList();
if (list.length) _bxHistAdd({ cid: d.cid, req: '（我直接写）', group: d.mGroup || '', cards: list, sat: (d.manualSat || []).slice() });
}
}
function bxGoChat(targetId) {
const cid = targetId || _bxWho();
if (!cid) { try { if (typeof showView === 'function') showView('chats'); } catch (e) {} return; }
try {
if (typeof switchChat === 'function') switchChat(cid);
else if (typeof showView === 'function') showView('chat');
if (typeof enterChatAtLatest === 'function') enterChatAtLatest();
} catch (e) {}
}
function _bxDeskNote(t) {
const el = document.getElementById('bxDeskNote');
if (el) el.innerHTML = t ? '<div class="bx-line">' + escapeHTML(t) + '</div>' : '';
}
function _bxDeskNoteHTML(html) {
const el = document.getElementById('bxDeskNote');
if (el) el.innerHTML = html || '';
}
function _bxDeskChipEcho() {
const el = document.getElementById('bxDeskTplEcho');
const d = _bxDesk;
if (!el || !d) return;
const all = BX_TPLS.map(x => ({ k: 'tpl:' + x.id, t: x.text })).concat(BX_STYLES.map(x => ({ k: 'sty:' + x.id, t: x.text })));
const picked = all.filter(x => d.inReq && d.inReq[x.k]);
if (!picked.length) { el.hidden = true; el.innerHTML = ''; return; }
const last = picked[picked.length - 1];
el.hidden = false;
el.innerHTML = '已拼入：<b>' + escapeHTML(last.t) + '</b>'
+ '（' + (picked.length > 1 ? '共 ' + picked.length + ' 条，' : '') + '再点同一枚可撤）';
}
const BX_PERSONA_FIELDS = [
{ key: 'world', name: '世界观', hint: '例：现代都市，一起三年。' },
{ key: 'persona', name: '人设', hint: '例：急诊科医生，嘴硬心软。' },
{ key: 'habit', name: '说话习惯', hint: '例：喊我「宝」，句子短。' }
];
function _bxDeskPersonaPaint() {
const el = document.getElementById('bxDeskPersona');
const d = _bxDesk;
if (!el || !d) return;
const st = _bxPersonaState(d.cid);
const miss = [];
if (!st.world) miss.push('世界观');
if (!st.persona) miss.push('人设');
if (!st.habit) miss.push('说话习惯');
let html = '<div class="bx-pa-line">'
+ '<span class="' + (st.world ? 'ok' : 'no') + '">世界观' + (st.world ? ' ✓' : ' ✗') + '</span>'
+ '<span class="' + (st.persona ? 'ok' : 'no') + '">人设' + (st.persona ? ' ✓' : ' ✗') + '</span>'
+ '<span class="' + (st.habit ? 'ok' : 'no') + '">说话习惯' + (st.habit ? ' ✓' : ' ✗') + '</span>'
+ '<span class="bx-pa-said">' + (st.said ? ('口吻样本 ' + st.said + ' 张') : '还没有口吻样本') + '</span></div>';
if (miss.length) {
html += '<p class="bx-pa-miss">' + (miss.length === 3
? '这三样都还空着：写出来容易像谁都能用的通用情话。'
: ('把「' + miss.join('」「') + '」补一句，写出来才像他。')) + '</p>';
const need = BX_PERSONA_FIELDS.filter(function (f) { return !st[f.key]; })[0];
const prev = el.querySelector('#bxDeskPersonaFill');
const draft = prev ? prev.value : (d.personaDraft || '');
html += '<div class="bx-pa-fill"><input type="text" id="bxDeskPersonaFill" data-bx-fill-field="' + need.key + '" placeholder="' + escapeHTML(need.hint) + '" value="' + escapeHTML(draft) + '"><button type="button" class="pri" data-bx-fillpersona>补上</button>'
+ '<button type="button" class="quiet" data-bx-gopersona>完整设置 ›</button></div>';
}
el.innerHTML = html;
}
function _fillPersonaField() {
const d = _bxDesk;
const inp = document.getElementById('bxDeskPersonaFill');
if (!d || !inp) return;
const field = inp.dataset.bxFillField;
const v = String(inp.value || '').trim();
if (!v) { showToast('先写一句'); return; }
if (field === 'world') bxCfg().world = v;
else _bxMateW(d.cid)[field] = v;
d.personaDraft = '';
_bxSaveNow();
_bxDeskPaint();
_bxDeskNote('补好了，接着写。');
}
function _bxDeskToPersona() {
const d = _bxDesk;
if (d) {
_bxDeskKeep = {
cid: d.cid, req: d.req, n: d.n, ctx: d.ctx, myLine: d.myLine || '',
autoGroup: d.autoGroup, group: d.group || ''
};
}
bxDeskClose();
if (typeof bxJumpTab === 'function') bxJumpTab('persona');
else if (typeof showView === 'function') showView('bangxie');
}
function _bxManualList() {
const d = _bxDesk;
if (!d) return [];
const maxLen = bxCfg().maxLen;
const out = [], seen = {};
String(d.manualText || '').split(/\r?\n+/).forEach(function (line) {
const t = _bxCleanCard(line, maxLen);
if (!t || seen[t]) return;
seen[t] = 1;
out.push(t);
});
return out.slice(0, BX_MAX_N);
}
function _bxManualGroupPaint() {
const d = _bxDesk;
const row = document.getElementById('bxManualGroupRow');
if (!row || !d) return;
const opts = _bxGroupsOf(d.cid).map(g => g.name);
if (opts.indexOf('未分组') < 0) opts.push('未分组');
const cur = d.mGroup || '未分组';
row.innerHTML = opts.map(x => '<button type="button" class="contact-chip' + (cur === x ? ' active' : '') + '" data-bx-mgroup="' + escapeHTML(x) + '">' + escapeHTML(x) + '</button>').join('')
+ '<button type="button" class="contact-chip' + (_bxMgBusy ? ' active' : '') + '" data-bx-mgai>' + (_bxMgBusy ? '拟着…' : 'AI 拟组名') + '</button>';
}
let _bxMgBusy = false;
async function _bxManualGroupAsk() {
const d = _bxDesk;
if (!d || _bxMgBusy) return;
const list = _bxManualList();
if (!list.length) { showToast('先写一句'); return; }
if (!bxApiFor(d.cid).model) { showToast('「接口」那一档还没填模型'); return; }
_bxMgBusy = true;
_bxManualGroupPaint();
try {
const name = await _bxGroupNameAsk(d.cid, list);
if (name) {
d.mGroup = name;
try { showToast('AI 拟的组名：「' + name + '」，存库时按它落'); } catch (e) {}
} else try { showToast('这次没拟出来，再点一次试试'); } catch (e) {}
} catch (e) { try { showToast('没拟出来：' + _bxWhy(e, bxApiFor(d.cid))); } catch (e2) {} }
finally { _bxMgBusy = false; _bxManualGroupPaint(); }
}
async function _bxGroupNameAsk(cid, lines, opts) {
const api = bxApiFor(cid);
if (!api.model) throw new Error('模型名空着：去「帮写字卡 → 接口」把「模型」填上再让 AI 拟组名');
const gs = (opts && Array.isArray(opts.groups)) ? opts.groups.filter(Boolean).slice(0, 12) : [];
const sys = '根据下面这几张字卡的实际内容，给它们归一个组。只返回分组名本身：2~6 个字，不带标点、不带引号、不要解释。'
+ (gs.length ? ' 优先从这些已有分组里选（内容确实贴得上才选；都不贴就起一个新名字）：' + gs.map(x => '「' + x + '」').join('、') : '');
const body = {
model: api.model,
messages: [
{ role: 'system', content: sys },
{ role: 'user', content: '这几张字卡归一个组，起个组名：\n' + lines.join('\n') }
],
temperature: 0.4,
max_tokens: 24,
stream: false
};
const urls = _bxChatURLs(api);
const token = ++_bxJobToken;
let j = null, lastErr = null;
outer:
for (let i = 0; i < urls.length; i++) {
for (let attempt = 0; attempt < 2; attempt++) {
if (token !== _bxJobToken) throw _bxCancelErr();
const ctrl = new AbortController();
_bxJob = ctrl;
try { j = await _bxFetchJSON(urls[i], body, { api, signal: ctrl.signal }); lastErr = null; break outer; }
catch (e) {
if (token !== _bxJobToken || (e && (e.aborted || e.canceled))) throw _bxCancelErr();
lastErr = e;
if (attempt === 0 && _bxTransient(e)) {
await new Promise(r => setTimeout(r, 600));
if (token !== _bxJobToken) throw _bxCancelErr();
continue;
}
if (e && (e.status === 404 || e.status === 405)) break;
throw e;
} finally {
if (_bxJob === ctrl) _bxJob = null;
}
}
}
if (lastErr) throw lastErr;
const c = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
try { _bxUsageAdd(j && j.usage, 1); } catch (e) {}
if (!c) return '';
return _bxCleanGroup(String(c).split(/\r?\n/)[0]);
}
function _bxGroupGuessLocal(cid, cards) {
const gs = _bxGroupsOf(cid).filter(g => g.name && g.name !== '未分组');
if (!gs.length) return '';
const txt = (cards || []).join('\n');
const grams = s => {
const set = new Set();
const a = Array.from(String(s || ''));
for (let i = 0; i < a.length - 1; i++) set.add(a[i] + a[i + 1]);
return set;
};
const cg = grams(txt);
let best = '', bestScore = 0;
gs.forEach(g => {
const gg = grams(g.name);
if (!gg.size) return;
let hit = 0;
gg.forEach(x => { if (cg.has(x)) hit++; });
const score = hit / gg.size;
if (score > bestScore) { bestScore = score; best = g.name; }
});
return bestScore >= 0.5 ? best : '';
}
function _bxManualSatPaint() {
const box = document.getElementById('bxManualSatOut');
const d = _bxDesk;
if (!box || !d) return;
const list = _bxManualList();
if (!list.length) {
box.innerHTML = '<div class="bx-line">写一句就能评：点「TA的满意度」，从 1~10 里随机落一个。</div>';
return;
}
box.innerHTML = list.map(function (t, i) {
const v = (d.manualSat || [])[i];
return '<div class="bx-line"><span class="bx-card-no">第 ' + (i + 1) + ' 张</span> · <span class="bx-card-no bx-sat" data-bx-msat="' + i + '" title="点一下重掷这张">' + (v != null ? '满意度 ' + v + '/10' : '还没评 · 点这评') + '</span></div>'
+ '<div class="bx-line">' + escapeHTML(t) + '</div>';
}).join('');
}
function _bxManualRate() {
const d = _bxDesk;
if (!d) return;
const list = _bxManualList();
if (!list.length) { showToast('先写一句'); return; }
if (d.satManualBusy) return;
d.satManualBusy = true;
d.manualSat = list.map(function () { return null; });
let n = 0;
const iv = setInterval(function () {
d.manualSat = list.map(function () { return 1 + Math.floor(Math.random() * 10); });
_bxManualSatPaint();
if (++n >= 9) {
clearInterval(iv);
d.satManualBusy = false;
try { showToast('TA 的满意度出来了'); } catch (e) {}
_bxHistAdd({ cid: d.cid, req: '（我直接写）', group: d.mGroup || '', cards: list, sat: d.manualSat.slice() });
}
}, 80);
}
function _bxManualRateOne(i) {
const d = _bxDesk;
if (!d || d.satManualBusy) return;
if (!d._mSatBusy) d._mSatBusy = {};
if (d._mSatBusy[i]) return;
const list = _bxManualList();
if (!list[i]) return;
d._mSatBusy[i] = true;
const tag = document.querySelector('[data-bx-msat="' + i + '"]');
let n = 0;
const iv = setInterval(function () {
const last = 1 + Math.floor(Math.random() * 10);
if (tag) tag.textContent = '满意度 ' + last + '/10';
if (++n >= 9) {
clearInterval(iv);
d._mSatBusy[i] = false;
if (!d.manualSat) d.manualSat = [];
d.manualSat[i] = last;
_bxManualSatPaint();
_bxHistAdd({ cid: d.cid, req: '（我直接写）', group: d.mGroup || '', cards: _bxManualList(), sat: d.manualSat.slice() });
}
}, 80);
}
async function _bxManualSave() {
const d = _bxDesk;
if (!d) return;
const list = _bxManualList();
if (!list.length) { showToast('先写一句'); return; }
const group = d.mGroup || '未分组';
try {
const r = await bxSaveCards(d.cid, list, group);
showToast('存进「' + (r.group || '未分组') + '」· 新增 ' + r.added + ' 张' + (r.dup ? '，跳过重复 ' + r.dup : ''));
_bxHistAdd({ cid: d.cid, req: '（我直接写）', group: r.group || group, cards: list, sat: (d.manualSat || []).slice() });
} catch (e) { showToast('没存进去：' + _bxWhy(e)); }
}
function _bxDeskPaint(full) {
const d = _bxDesk;
const mask = document.getElementById('bxDeskMask');
if (!d || !mask) return;
const contacts = (data.contacts || []).filter(c => c && c.kind !== 'group');
const who = document.getElementById('bxDeskWho');
if (who) who.innerHTML = contacts.map(c => '<button type="button" class="contact-chip' + (c.id === d.cid ? ' active' : '') + '" data-bx-dwho="' + escapeHTML(c.id) + '">' + escapeHTML(c.name || 'TA') + '</button>').join('');
if (full) {
const req = document.getElementById('bxDeskReq');
if (req && document.activeElement !== req) req.value = d.req || '';
const ml = document.getElementById('bxDeskMyLine');
if (ml && document.activeElement !== ml) ml.value = d.myLine || '';
const n = document.getElementById('bxDeskN');
if (n && document.activeElement !== n) n.value = d.n;
const ctx = document.getElementById('bxDeskCtx');
if (ctx) ctx.checked = !!d.ctx;
const ag = document.getElementById('bxDeskAutoGroup');
if (ag) ag.checked = !!d.autoGroup;
const mt = document.getElementById('bxManualText');
if (mt && document.activeElement !== mt) mt.value = d.manualText || '';
}
const _on = (kind, id) => !!(d.inReq && d.inReq[kind + ':' + id]);
const tp = document.getElementById('bxDeskTpl');
if (tp) tp.innerHTML = BX_TPLS.map(x => '<button type="button" class="contact-chip' + (_on('tpl', x.id) ? ' active' : '') + '" data-bx-tpl="' + x.id + '">' + escapeHTML(x.name) + '</button>').join('');
const st = document.getElementById('bxDeskStyle');
if (st) st.innerHTML = BX_STYLES.map(x => '<button type="button" class="contact-chip' + (_on('sty', x.id) ? ' active' : '') + '" data-bx-style="' + x.id + '">' + escapeHTML(x.name) + '</button>').join('');
_bxDeskChipEcho();
_bxDeskPersonaPaint();
const empty = document.getElementById('bxDeskEmpty');
if (empty) empty.hidden = !!d.cards.length || !!d.busy;
const rs = document.getElementById('bxDeskResultSec');
if (rs) rs.hidden = !d.cards.length;
const gen = document.getElementById('bxDeskGen');
if (gen) gen.disabled = !!d.busy;
const cancel = document.getElementById('bxDeskCancel');
if (cancel) cancel.hidden = !d.busy;
const gr = document.getElementById('bxDeskGroupRow');
if (gr) {
gr.hidden = false;
const ai = (d.group && d.group !== '未分组') ? d.group : '';
const opts = _bxGroupsOf(d.cid).map(g => g.name).filter(n => n && n !== '未分组' && n !== ai);
if (opts.indexOf('未分组') < 0) opts.push('未分组');
const cur = d.groupPick || '未分组';
gr.innerHTML = '<button type="button" class="contact-chip' + (d.autoGroup ? ' active' : '') + '" data-bx-dgroup-ai>AI 自动分组' + (d.aiNameBusy ? ' · 拟着…' : (ai ? '「' + escapeHTML(ai) + '」' : '')) + '</button>'
+ opts.map(x => '<button type="button" class="contact-chip' + (!d.autoGroup && cur === x ? ' active' : '') + '" data-bx-dgroup="' + escapeHTML(x) + '">' + escapeHTML(x) + '</button>').join('');
}
const list = document.getElementById('bxDeskList');
if (list) {
if (!d.cards.length) list.innerHTML = '';
else list.innerHTML = d.cards.map((c, i) => {
const satv = (d.sat || [])[i];
const satTag = '<span class="bx-card-no bx-sat" data-bx-dsattag="' + i + '"' + (satv != null ? '' : ' hidden') + '>' + (satv != null ? '满意度 ' + satv + '/10' : '') + '</span>';
return '<div class="bx-card" data-bx-card="' + i + '"><div class="bx-card-hd"><span class="bx-card-no">第 ' + (i + 1) + ' 张</span>' + satTag
+ '<div class="bx-card-acts"><button type="button" class="bx-act" data-bx-dsend="' + i + '">发到聊天</button><button type="button" class="bx-act" data-bx-dedit="' + i + '">编辑</button><button type="button" class="bx-act" data-bx-dsat="' + i + '">TA的满意度</button><button type="button" class="bx-act" data-bx-ddrop="' + i + '">丢掉</button></div></div>'
+ '<textarea class="bx-ta" data-bx-dtext="' + i + '" rows="2" aria-label="第 ' + (i + 1) + ' 张（可直接改）">' + escapeHTML(c) + '</textarea><label class="bx-card-sel"><input type="checkbox" data-bx-dsel="' + i + '"' + (d.sel[i] ? ' checked' : '') + '> 存这张</label></div>';
}).join('');
}
const cnt = document.getElementById('bxDeskCount');
if (cnt) cnt.textContent = d.cards.length ? d.cards.length + ' 张' : '';
_bxDeskModeApply(d);
_bxManualGroupPaint();
_bxCmpRender(d);
_bxHistRender();
}
function _bxAutoReq(d) {
if (!d) return BX_TPLS[0].text;
if (String(d.myLine || '').trim()) return '接住我刚刚说的那句，写 TA 会怎么回。';
let ctx = [];
if (d.ctx) { try { ctx = _bxCtxLines(d.cid, 3); } catch (e) {} }
return ctx.length ? '接着最近的聊天，写几张 TA 接下来可能会说的话。' : BX_TPLS[0].text;
}
async function _bxDeskAutoStore(cid, cards, autoGroup, group) {
if (!bxCfg().autoSave) return null;
try { return await bxSaveCards(cid, (cards || []).slice(), autoGroup ? (group || '') : '未分组'); }
catch (e) { return null; }
}
async function _bxDeskGen() {
const d = _bxDesk;
if (!d || d.busy) return;
const myCid = d.cid;
const myAutoGroup = !!d.autoGroup;
const reqEl = document.getElementById('bxDeskReq');
const req = String(reqEl ? reqEl.value : d.req || '').trim();
d.req = req;
const mlEl = document.getElementById('bxDeskMyLine');
d.myLine = String(mlEl ? mlEl.value : d.myLine || '').trim();
const useReq = req || _bxAutoReq(d);
const nEl = document.getElementById('bxDeskN');
d.n = _bxNum(nEl ? nEl.value : d.n, 1, BX_MAX_N, 3);
const ctxEl = document.getElementById('bxDeskCtx');
if (ctxEl) d.ctx = !!ctxEl.checked;
const agEl = document.getElementById('bxDeskAutoGroup');
if (agEl) d.autoGroup = !!agEl.checked;
const pst = _bxPersonaState(d.cid);
if (pst.bare && !pst.said && !d.softOK) {
_bxDeskNoteHTML('<div class="bx-line">这位 TA 还没写过人设，也没有他用过的卡当样本——写出来多半是放到谁身上都成立的通用情话。</div>'
+ '<div class="bx-line-acts"><button type="button" class="ap-btn pri" data-bx-gopersona>去补人设</button>'
+ '<button type="button" class="ap-btn" data-bx-softok>就这样写</button></div>');
try { showToast('先看一眼人设，写出来才像他'); } catch (e) {}
return;
}
d.busy = true;
_bxBusy = true;
d.t0 = Date.now();
d.streamRaw = '';
_bxDeskNote(req ? '生成中…' : '没写要求，照最近聊天来写…');
_bxDeskPaint();
const tick = setInterval(() => {
if (_bxDesk !== d) { clearInterval(tick); return; }
const s = Math.round((Date.now() - d.t0) / 1000);
_bxDeskNote(d.phase === 'group' ? '内容写好了，正在按内容归组…'
: ('生成中… ' + s + ' 秒' + (d.streamRaw ? ' · 已写 ' + Array.from(d.streamRaw).length + ' 字' : '')));
_bxDeskStreamPaint();
}, 500);
const onDelta = (raw, ph) => {
if (_bxDesk !== d) return;
d.streamRaw = String(raw || '');
d.phase = ph === 'group' ? 'group' : 'write';
if (d.phase === 'group') { d.streamRaw = ''; _bxDeskNote('内容写好了，正在按内容归组…'); }
_bxDeskStreamPaint();
};
try {
const r = await _bxGenerate(myCid, {
n: d.n, req: useReq, autoGroup: d.autoGroup, myLine: d.myLine,
ctxN: d.ctx ? BX_CTX_N : 0, prev: d.cards.slice(), fix: d.lastFix, onDelta
});
if (!r.cards.length) throw new Error('这次没写出来（模型返回空）');
if (_bxDesk !== d || d.cid !== myCid) {
_bxHistAdd({ cid: myCid, req: useReq, group: r.group, cards: r.cards.slice() });
const st = await _bxDeskAutoStore(myCid, r.cards, myAutoGroup, r.group);
try {
showToast(st && st.added
? ('这一批写好了 ' + r.cards.length + ' 张，已自动存进「' + st.group + '」')
: ('这一批写好了 ' + r.cards.length + ' 张，已放进「最近写过」'));
} catch (e) {}
return;
}
_bxCmpAutoPrev(d);
d.cards = r.cards;
d.sel = r.cards.map(() => true);
d.sat = [];
d.group = r.group;
d.lastFix = '';
_bxFails = 0;
_bxLast = { at: Date.now(), ok: true, why: '', text: r.cards[0], usage: r.usage || null };
d.histAt = _bxHistAdd({ cid: d.cid, req: useReq, group: r.group, cards: r.cards.slice() });
const st = await _bxDeskAutoStore(d.cid, r.cards, myAutoGroup, r.group);
_bxDeskNote('写好了 ' + r.cards.length + ' 张' + (r.group ? ' · 建议分组「' + r.group + '」' : '') + _bxUsageText(r.usage)
+ (r.promptChars ? ' · 带了 ' + r.promptChars + ' 字上下文' : '')
+ (st ? (st.added ? ' · 已自动存进「' + st.group + '」' + st.added + ' 张' : ' · 库里已经有了，没有新增') : ''));
} catch (e) {
if (e && (e.canceled || e.aborted)) {
if (_bxDesk === d && d.cid === myCid) _bxDeskNote('已取消');
} else if (_bxDesk === d && d.cid === myCid) {
_bxDeskNote(_bxWhy(e, bxApiFor(d.cid)));
_bxFail(e, true);
} else {
try { showToast('帮写字卡：' + _bxWhy(e, bxApiFor(myCid))); } catch (e2) {}
}
} finally {
clearInterval(tick);
d.busy = false;
d.phase = '';
d.streamRaw = '';
_bxBusy = false;
_bxDeskStreamPaint();
}
if (_bxDesk === d && d.cid === myCid) _bxDeskPaint();
}
function _bxDeskStreamPaint() {
const el = document.getElementById('bxDeskStream');
const d = _bxDesk;
if (!el) return;
if (!d || !d.busy || d.phase === 'group' || !d.streamRaw) { el.hidden = true; el.innerHTML = ''; return; }
const parts = _bxPartialCards(d.streamRaw);
if (!parts.length) { el.hidden = false; el.innerHTML = '<div class="bx-st-line wip">在想开头…</div>'; return; }
el.hidden = false;
el.innerHTML = parts.map((p, i) => {
const wip = !p.done;
return '<div class="bx-st-line' + (wip ? ' wip' : '') + '"><span class="bx-st-no">第 ' + (i + 1) + ' 张' + (wip ? ' · 正在写' : '') + '</span>' + escapeHTML(p.text || '') + '</div>';
}).join('');
}
function _bxDeskRedo() {
const d = _bxDesk;
if (!d || d.busy) return;
const el = document.getElementById('bxDeskFix');
const fix = String(el ? el.value : '').trim();
if (!fix) { showToast('先写一句哪儿不对'); return; }
d.lastFix = fix;
_bxDeskGen();
}
async function _bxDeskSave(all) {
const d = _bxDesk;
if (!d || !d.cards.length) { showToast('先让 AI 写几张'); return; }
const picks = d.cards.filter((c, i) => all || d.sel[i]);
if (!picks.length) { showToast('没勾选要存的卡'); return; }
const group = d.autoGroup ? d.group : (d.groupPick || '未分组');
try {
const r = await bxSaveCards(d.cid, picks, group);
showToast('存进「' + (r.group || '未分组') + '」· 新增 ' + r.added + ' 张' + (r.dup ? '，跳过重复 ' + r.dup : ''));
_bxDeskPaint();
} catch (e) { showToast('没存进去：' + _bxWhy(e)); }
}
function _bxCmpHas(d, key) { return !!(d && (d.cmp || []).some(v => v.key === key)); }
function _bxCmpLibSet(cid) {
const set = {};
try {
_bxGroupsOf(cid).forEach(g => (g.cards || []).forEach(c => {
const t = String((typeof cardText === 'function') ? cardText(c) : '').replace(/\s+/g, ' ').trim();
if (t) set[t] = 1;
}));
} catch (e) {}
return set;
}
function _bxCmpStable(cmp) {
const cnt = {};
(cmp || []).forEach(v => {
const seen = {};
(v.cards || []).forEach(c => { if (seen[c]) return; seen[c] = 1; cnt[c] = (cnt[c] || 0) + 1; });
});
return cnt;
}
function _bxCmpPickList(d) {
const out = [];
if (!d || !d.picks) return out;
(d.cmp || []).forEach((v, vi) => {
(v.cards || []).forEach((c, ci) => {
if (d.picks[v.key + '|' + c]) out.push({ vi: vi, ci: ci, text: c });
});
});
return out;
}
function _bxCmpAdd(key) {
const d = _bxDesk;
if (!d) return;
if (!d.cmp) d.cmp = [];
const k = Number(key) || 0;
if (k > 0) {
if (_bxCmpHas(d, k)) {
d.cmp = d.cmp.filter(v => v.key !== k);
const keep = {};
d.cmp.forEach(v => (v.cards || []).forEach(c => { if (d.picks && d.picks[v.key + '|' + c]) keep[v.key + '|' + c] = 1; }));
d.picks = keep;
_bxCmpRender(d);
return;
}
if (d.cmp.length >= BX_CMP_MAX) { showToast('最多并排 ' + BX_CMP_MAX + ' 版，先撤一版'); return; }
const x = _bxHistLoad().filter(e => Number(e.at) === k)[0];
if (!x) { showToast('这一版已经不在「最近写过」里了'); return; }
const snap = { key: k, at: k, group: x.group, cards: (x.cards || []).slice(), sat: (x.sat || []).slice() };
d.cmp.push(snap);
_bxCmpDefaultPicks(d, k, snap);
_bxCmpRender(d);
const sec = document.getElementById('bxCmpSec');
if (sec) { try { sec.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {} }
return;
}
if (!d.cards.length) { showToast('这一批还没写出来'); return; }
if (d.cmp.length >= BX_CMP_MAX) { showToast('最多并排 ' + BX_CMP_MAX + ' 版，先撤一版'); return; }
const at = Date.now();
const snap = { key: -at, at: at, group: d.group, cards: d.cards.slice(), sat: (d.sat || []).slice() };
d.cmp.push(snap);
_bxCmpDefaultPicks(d, snap.key, snap);
_bxCmpRender(d);
const sec = document.getElementById('bxCmpSec');
if (sec) { try { sec.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {} }
}
function _bxCmpDefaultPicks(d, k, snap) {
const stable = _bxCmpStable(d.cmp);
const lib = _bxCmpLibSet(d.cid);
if (!d.picks) d.picks = {};
Object.keys(stable).forEach(t => { if (stable[t] > 1 && !lib[t]) d.picks[k + '|' + t] = 1; });
}
function _bxCmpAddManual() {
const d = _bxDesk;
if (!d) return;
const list = _bxManualList();
if (!list.length) { showToast('先写一句'); return; }
if ((d.cmp || []).length >= BX_CMP_MAX) { showToast('最多并排 ' + BX_CMP_MAX + ' 版，先撤一版'); return; }
const at = Date.now();
const snap = { key: -at, at: at, group: d.mGroup || '', cards: list.slice(), sat: (d.manualSat || []).slice() };
d.cmp.push(snap);
_bxCmpDefaultPicks(d, snap.key, snap);
_bxCmpRender(d);
const sec = document.getElementById('bxCmpSec');
if (sec) { try { sec.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {} }
}
function _bxCmpAutoPrev(d) {
if (!d || !d.cards || !d.cards.length) return;
if (!Array.isArray(d.cmp)) d.cmp = [];
const sig = d.cards.join('|');
if (d.cmp.some(v => (v.cards || []).join('|') === sig)) return;
while (d.cmp.length >= BX_CMP_MAX) d.cmp.shift();
const at = Date.now();
const snap = { key: -at, at: at, group: d.group || '', cards: d.cards.slice(), sat: (d.sat || []).slice() };
d.cmp.push(snap);
_bxCmpDefaultPicks(d, snap.key, snap);
}
function _bxCmpRender(d) {
const sec = document.getElementById('bxCmpSec');
if (!sec) return;
const cmp = (d && d.cmp) || [];
sec.hidden = !cmp.length;
const addBtn = document.getElementById('bxCmpAddNow');
if (addBtn) addBtn.textContent = '加入对比';
if (!cmp.length) return;
const cnt = document.getElementById('bxCmpCount');
if (cnt) cnt.textContent = cmp.length + ' 版';
const stable = _bxCmpStable(cmp);
const lib = _bxCmpLibSet(d.cid);
const box = document.getElementById('bxCmpList');
if (box) {
box.innerHTML = cmp.map((v, vi) => {
const when = (v.key < 0 ? '台面那批 ' : '') + new Date(v.at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
const rows = (v.cards || []).map((c, ci) => {
const on = !!(d.picks && d.picks[v.key + '|' + c]);
const satv = (v.sat || [])[ci];
return '<label class="bx-cmp-row' + (lib[c] ? ' inlib' : '') + '">'
+ '<input type="checkbox" data-bx-cmppick="' + vi + ':' + ci + '"' + (on ? ' checked' : '') + '>'
+ '<span class="bx-cmp-tx">' + escapeHTML(c) + '</span>'
+ (stable[c] > 1 ? '<i class="bx-cmp-tag">稳</i>' : '')
+ (lib[c] ? '<i class="bx-cmp-tag lib">在库</i>' : '')
+ (satv != null ? '<i class="bx-cmp-sat">' + escapeHTML(String(satv)) + '</i>' : '')
+ '</label>';
}).join('');
return '<div class="bx-cmp-col"><div class="bx-cmp-hd"><b>第 ' + (vi + 1) + ' 版</b><span>' + escapeHTML(when) + '</span>'
+ '<button type="button" class="bx-cmp-x" data-bx-cmprm="' + vi + '" aria-label="撤下这一版">×</button></div>' + rows + '</div>';
}).join('');
}
const btn = document.getElementById('bxCmpSave');
if (btn) btn.textContent = '存下选中的 ' + _bxCmpPickList(d).length + ' 张';
}
async function _bxCmpSave() {
const d = _bxDesk;
if (!d) return;
const texts = [];
_bxCmpPickList(d).forEach(p => { if (texts.indexOf(p.text) < 0) texts.push(p.text); });
if (!texts.length) { showToast('先勾要留的卡'); return; }
const group = d.autoGroup ? d.group : (d.groupPick || '未分组');
try {
const r = await bxSaveCards(d.cid, texts, group);
showToast('存进「' + (r.group || '未分组') + '」· 新增 ' + r.added + ' 张' + (r.dup ? '，跳过重复 ' + r.dup : ''));
d.picks = {};
_bxCmpRender(d);
} catch (e) { showToast('没存进去：' + _bxWhy(e)); }
}
function _bxCmpClear() {
const d = _bxDesk;
if (!d) return;
d.cmp = [];
d.picks = {};
_bxCmpRender(d);
}
function _bxDeskSend(i) {
const d = _bxDesk;
if (!d || !d.cards[i]) return;
const text = _bxCleanCard(d.cards[i], bxCfg().maxLen);
if (!text) { showToast('这张是空的'); return; }
_bxSendNow(d.cid, text, d.group, { timing: 'desk', from: 'partner', original: text, noAutoSave: true });
showToast('已发进聊天');
}
function _bxHistLoad() {
try {
const a = JSON.parse(localStorage.getItem(BX_HIST_KEY) || '[]');
return Array.isArray(a) ? a.filter(x => x && Array.isArray(x.cards) && x.cards.length) : [];
} catch (e) { return []; }
}
function _bxHistSave(list) {
try { localStorage.setItem(BX_HIST_KEY, JSON.stringify((list || []).slice(0, BX_HIST_MAX))); } catch (e) {}
}
function _bxHistAdd(entry) {
if (!entry || !entry.cards || !entry.cards.length) return 0;
const cards = entry.cards.map(x => _bxCleanCard(x, bxCfg().maxLen)).filter(Boolean).slice(0, BX_MAX_N);
if (!cards.length) return 0;
const list = _bxHistLoad();
const sig = (entry.cid || '') + '|' + cards.join('|');
const rest = list.filter(x => ((x.cid || '') + '|' + (x.cards || []).join('|')) !== sig);
const at = Date.now();
const rec = { at: at, cid: entry.cid || '', req: String(entry.req || '').slice(0, 300), group: String(entry.group || ''), cards: cards };
const _sat = Array.isArray(entry.sat) ? entry.sat.slice(0, cards.length) : [];
if (_sat.some(v => v != null)) rec.sat = _sat;
rest.unshift(rec);
_bxHistSave(rest);
_bxHistRender();
return at;
}
let _bxHistSyncT = 0;
function _bxHistSync() {
const d = _bxDesk;
if (!d || !d.histAt || !d.cards.length) return;
const list = _bxHistLoad();
const x = list.filter(e => e.at === d.histAt)[0];
if (!x) return;
const cards = d.cards.map(c => _bxCleanCard(c, bxCfg().maxLen));
if (cards.join('|') !== (x.cards || []).join('|')) x.ed = 1;
x.cards = cards;
const sat = (d.sat || []).slice(0, cards.length);
if (sat.some(v => v != null)) x.sat = sat;
_bxHistSave(list);
_bxHistRender();
}
function _bxHistSetSat(at, sat) {
if (!at) return;
const list = _bxHistLoad();
const x = list.filter(e => e.at === Number(at))[0];
if (!x) return;
const vals = (sat || []).slice(0, (x.cards || []).length);
if (vals.some(v => v != null)) x.sat = vals;
_bxHistSave(list);
_bxHistRender();
}
function _bxHistSetGroup(at, group) {
if (!at) return;
const list = _bxHistLoad();
const x = list.filter(e => e.at === Number(at))[0];
if (!x) return;
x.group = String(group || '');
_bxHistSave(list);
_bxHistRender();
}
function _bxHistRender() {
const box = document.getElementById('bxHistList');
if (!box) return;
const list = _bxHistLoad();
const cnt = document.getElementById('bxHistCount');
if (cnt) cnt.textContent = list.length ? list.length + ' 批' : '';
if (!list.length) {
box.innerHTML = '<div class="bx-hist-empty">还没有。生成过的几批会留在这里，之后改过的字与当时掷的满意度也记在同一批里；只在这台设备上，不进备份。</div>';
return;
}
box.innerHTML = list.map((x, i) => {
const t = new Date(x.at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
const who = _bxNameOf(x.cid);
const first = String((x.cards || [])[0] || '').replace(/\s+/g, ' ');
const satVals = (x.sat || []).filter(v => v != null);
const inCmp = _bxCmpHas(_bxDesk, x.at);
return '<button type="button" class="bx-hist-row" data-bx-hist="' + i + '"><span class="bx-hist-tx"><b>' + escapeHTML(who + ' · ' + t) + (x.ed ? ' · 已改' : '') + '</b><small>' + escapeHTML(first) + '</small>'
+ (satVals.length ? '<small class="bx-hist-sat">满意度 ' + satVals.map(v => v + '/10').join(' · ') + '</small>' : '')
+ '</span><span class="bx-hist-cmp' + (inCmp ? ' on' : '') + '" data-bx-cmpadd="' + x.at + '">' + (inCmp ? '撤下' : '对比') + '</span><span class="bx-hist-n">' + x.cards.length + ' 张</span></button>';
}).join('');
}
function _bxHistUse(i) {
const x = _bxHistLoad()[i];
const d = _bxDesk;
if (!x || !d) return;
_bxCmpAutoPrev(d);
d.cid = x.cid || d.cid;
d.req = x.req || '';
d.group = x.group || '';
d.cards = (x.cards || []).slice();
d.sel = d.cards.map(() => true);
d.sat = (x.sat || []).slice();
d.histAt = x.at || 0;
d.lastFix = '';
_bxDeskPaint(true);
_bxDeskNote('从「最近写过」载入 ' + d.cards.length + ' 张' + ((x.sat || []).some(v => v != null) ? '（含当时的满意度）' : '') + '；可以改、发或存。');
}
function _bxHistClear() {
try { localStorage.removeItem(BX_HIST_KEY); } catch (e) {}
_bxHistRender();
showToast('已清空最近写过');
}
let _bxPersonaJob = null, _bxPersonaToken = 0, _bxPersonaPrev = null, _bxPersonaBusy = false;
function _bxPersonaPullNote(t, bad) {
const el = document.getElementById('bxPersonaPullOut');
if (el) el.innerHTML = t ? '<div class="bx-line' + (bad ? ' bad' : '') + '">' + escapeHTML(t) + '</div>' : '';
}
function _bxParsePersonaJson(text) {
const raw = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
let obj = null;
const a = raw.indexOf('{'), b = raw.lastIndexOf('}');
if (a >= 0 && b > a) { try { obj = JSON.parse(raw.slice(a, b + 1)); } catch (e) {} }
if (!obj || typeof obj !== 'object') return null;
const p = String(obj.persona || '').replace(/\s+/g, ' ').trim().slice(0, 600);
const h = String(obj.habit || '').replace(/\s+/g, ' ').trim().slice(0, 400);
if (!p && !h) return null;
return { persona: p, habit: h };
}
function bxCancelPersona() {
_bxPersonaToken++;
if (_bxPersonaJob) { try { _bxPersonaJob.abort(); } catch (e) {} }
_bxPersonaJob = null;
_bxPersonaBusy = false;
const btn = document.getElementById('bxPersonaPull');
if (btn) btn.textContent = '从最近聊天总结一份';
}
async function _bxPullPersona() {
const cid = _bxWho();
if (!cid) { showToast('先在首页建一位联系人'); return; }
if (_bxPersonaBusy) { bxCancelPersona(); _bxPersonaPullNote('已取消'); return; }
const ctx = _bxCtxLines(cid, 40);
const said = _bxSaidSamples(cid, 12);
if (ctx.length < 4 && said.length < 3) { showToast('这一位的聊天还太少，先聊几句再来总结'); return; }
const api = bxApiFor(cid);
if (!api.model) { showToast('先把这一位用的接口与模型填好'); return; }
const sys = [
'你在帮用户整理一位虚拟联系人的档案。只根据下面给的「最近对话」和「他用过的卡」归纳，不许编造没出现过的身份、职业、经历、地点或关系阶段。',
'输出一个 JSON 对象，不要 Markdown、不要解释：{"persona":"...","habit":"..."}',
'persona：120~200 字，写身份／职业、与对方的关系、性格、在意什么、怎么称呼对方。',
'habit：80~150 字，写句长、口癖、常用语气、会不会用感叹号、绝不会说的话。',
'任何一项在材料里找不到，就写「不确定」，不要猜。'
].join('\n');
const body = {
model: api.model,
messages: [
{ role: 'system', content: sys },
{
role: 'user',
content: '【最近对话】\n' + (ctx.length ? ctx.join('\n') : '（没有）')
+ '\n\n【他用过的卡】\n' + (said.length ? said.map(x => '· ' + x).join('\n') : '（没有）')
}
],
temperature: 0.3,
max_tokens: 700,
stream: false
};
const token = ++_bxPersonaToken;
const btn = document.getElementById('bxPersonaPull');
_bxPersonaBusy = true;
if (btn) btn.textContent = '总结中…（再点取消）';
_bxPersonaPullNote('正在读这一位的最近聊天…');
const ctrl = new AbortController();
_bxPersonaJob = ctrl;
try {
let j = null, lastErr = null;
const urls = _bxChatURLs(api);
for (let i = 0; i < urls.length; i++) {
try {
j = await _bxFetchJSON(urls[i], body, { api, signal: ctrl.signal });
lastErr = null;
break;
} catch (e) {
if (token !== _bxPersonaToken || (e && (e.aborted || e.canceled))) throw _bxCancelErr();
lastErr = e;
if (!(e && (e.status === 404 || e.status === 405))) throw e;
}
}
if (lastErr) throw lastErr;
if (token !== _bxPersonaToken) throw _bxCancelErr();
const _pm = (j && j.choices && j.choices[0]) ? (j.choices[0].message || { text: j.choices[0].text }) : null;
const c = _bxMsgText(_pm || {}).text;
if (!String(c || '').trim()) throw _bxNoTextErr(_pm || {}, j && j.__bxUrl);
const r = _bxParsePersonaJson(c);
if (!r) throw new Error('没能读成一份人设，再点一次试试');
const mate = bxMate(cid);
_bxPersonaPrev = { cid: cid, persona: mate.persona, habit: mate.habit };
const w = _bxMateW(cid);
if (r.persona) w.persona = r.persona;
if (r.habit) w.habit = r.habit;
_bxSaveNow();
renderBangxiePage();
_bxAutoOn();
const undo = document.getElementById('bxPersonaUndo');
if (undo) undo.hidden = false;
_bxPersonaPullNote('已填进上面两格。觉得不对点「撤回刚才的」退回上一版，也可以直接在框里改。');
try { showToast('总结好了，先看一眼对不对'); } catch (e) {}
} catch (e) {
if (token !== _bxPersonaToken || (e && (e.canceled || e.aborted))) _bxPersonaPullNote('已取消');
else _bxPersonaPullNote(_bxWhy(e, api), true);
} finally {
if (_bxPersonaJob === ctrl) _bxPersonaJob = null;
_bxPersonaBusy = false;
if (btn) btn.textContent = '从最近聊天总结一份';
}
}
function _bxPersonaUndoRun() {
const p = _bxPersonaPrev;
if (!p) return;
const w = _bxMateW(p.cid);
w.persona = p.persona || '';
w.habit = p.habit || '';
_bxPersonaPrev = null;
_bxSaveNow();
renderBangxiePage();
const undo = document.getElementById('bxPersonaUndo');
if (undo) undo.hidden = true;
_bxPersonaPullNote('已退回总结之前那一版。');
}
function _bxWizTail(id, prefix) {
const el = document.getElementById(id);
if (!el) return;
const v = String(el.value || '');
el.value = (v ? v.replace(/\s+$/, '') + '\n' : '') + prefix;
try {
el.focus();
el.setSelectionRange(el.value.length, el.value.length);
el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
} catch (e) {}
if (id === 'bxPersona') _bxMateW(_bxWho()).persona = el.value;
else if (id === 'bxHabit') _bxMateW(_bxWho()).habit = el.value;
_bxSaveSoon();
}
function _bxUsageText(u) {
if (!u || !u.all) return '';
return ' · 用量 ' + u.in + '/' + u.out + ' tok';
}
function _bxPaintLast() {
const el = document.getElementById('bxLast');
if (!el) return;
if (!_bxLast) { el.innerHTML = '<div class="bx-line">还没写过。</div>'; return; }
const t = new Date(_bxLast.at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
el.innerHTML = '<div class="bx-line ' + (_bxLast.ok ? 'ok' : 'bad') + '">' + escapeHTML(t + ' · ' + (_bxLast.ok ? ('写好了一句：' + (_bxLast.text || '') + _bxUsageText(_bxLast.usage)) : ('没写成：' + _bxLast.why))) + '</div>';
}
function _bxPaintCheck() {
const html = (_bxChkOut || []).map(x => '<div class="bx-line ' + (x.k || '') + '">' + escapeHTML(x.t) + '</div>').join('');
const el = document.getElementById('bxCheckOut');
if (el) el.innerHTML = html;
const dv = document.getElementById('aidvCheckOut');
if (dv && dv.innerHTML !== html) dv.innerHTML = html;
}
function _bxPaintTry() {
const el = document.getElementById('bxTryOut');
if (!el) return;
el.innerHTML = (_bxTryOut || []).map(x => '<div class="bx-line ' + (x.k || '') + '">' + escapeHTML(x.t) + '</div>').join('');
}
function _bxPaintEndpoint() {
const el = document.getElementById('bxEndpoint');
if (!el) return;
let u = '';
try { u = _bxChatURL(_bxApiEditCfg()); } catch (e) {}
el.textContent = u ? ('实际请求：' + u) : '';
}
function bxJumpTab(t) {
_bxTab = t || 'api';
if (typeof showView === 'function') showView('bangxie');
setTimeout(() => { try { _bxTabApply(); } catch (e) {} }, 0);
}
function _bxTabApply() {
const root = document.getElementById('bangxieView');
if (!root) return;
root.querySelectorAll('[data-bx-tab]').forEach(b => b.classList.toggle('on', b.dataset.bxTab === _bxTab));
root.querySelectorAll('[data-bx-pane]').forEach(p => { p.hidden = p.dataset.bxPane !== _bxTab; });
_bxGrowPersona();
}
function bxSettingsSum() {
const el = document.getElementById('sumBxSet');
if (!el) return;
const b = bxCfg();
const contacts = (data && data.contacts) || [];
const cid = (data && data.activeChat && contacts.some(c => c && c.id === data.activeChat && c.kind !== 'group'))
? data.activeChat : '';
const api = bxApiFor(cid);
const own = !!(cid && _bxApiOwnOf(cid));
const ready = !!(api.base && api.model);
const tail = own ? (' · ' + _bxNameOf(cid) + ' 单独一套') : '';
el.textContent = (b.on
? (ready ? '开着 · 接口已填好' : '开着 · 接口还没填全，进去补上')
: (ready ? '没开 · 接口已填好，打开就能用' : '没开 · 进去填好接口与模型')) + tail;
}
function renderBangxiePage() {
const root = document.getElementById('bangxieView');
if (!root) return;
const b = bxCfg();
const cid = _bxWho();
const mate = bxMate(cid);
const setV = (id, v) => { const el = document.getElementById(id); if (el && document.activeElement !== el) el.value = v; };
const setC = (id, v) => { const el = document.getElementById(id); if (el) el.checked = !!v; };
setC('bxOn', b.on);
const apiCid = _bxApiEditCid();
const api = bxApiFor(apiCid);
const ownOn = !!apiCid && _bxApiOwnOf(apiCid);
setV('bxBase', api.base);
setV('bxKey', api.key);
setV('bxModel', api.model);
setV('bxTemp', api.temp);
setV('bxTimeout', api.timeout);
setV('bxGroup', api.group);
setV('bxHeaders', api.headers);
setC('bxApiOwn', ownOn);
_bxApiDisable(!!apiCid && !ownOn);
setV('bxWorld', b.world);
setV('bxPersona', mate.persona);
setV('bxHabit', mate.habit);
setC('bxMateOff', mate.off);
setC('bxOnReply', b.onReply);
setV('bxProbReply', b.probReply);
setC('bxOnMyCard', b.onMyCard);
setV('bxProbMyCard', b.probMyCard);
setC('bxReview', b.review);
setC('bxAutoSave', b.autoSave);
setC('bxAutoGroup', b.autoGroup);
setV('bxMaxLen', b.maxLen);
const contacts = (data.contacts || []).filter(c => c && c.kind !== 'group');
const row = document.getElementById('bxWhoRow');
if (row) {
row.innerHTML = contacts.length
? contacts.map(c => '<button type="button" class="contact-chip' + (c.id === cid ? ' active' : '') + '" data-bx-who="' + escapeHTML(c.id) + '">' + escapeHTML(c.name || 'TA') + '</button>').join('')
: '<span class="bx-hint">先在首页建一位联系人。</span>';
}
const apiWho = document.getElementById('bxApiWhoRow');
if (apiWho) {
apiWho.innerHTML = '<button type="button" class="contact-chip' + (apiCid ? '' : ' active') + '" data-bx-apiwho="">全站默认</button>'
+ contacts.map(c => '<button type="button" class="contact-chip' + (c.id === apiCid ? ' active' : '') + '" data-bx-apiwho="' + escapeHTML(c.id) + '">' + escapeHTML(c.name || 'TA') + (_bxApiOwnOf(c.id) ? ' · 单独' : '') + '</button>').join('');
}
const ownRow = document.getElementById('bxApiOwnRow');
if (ownRow) ownRow.hidden = !apiCid;
const apiHint = document.getElementById('bxApiHint');
if (apiHint) {
apiHint.textContent = !apiCid
? '全站默认：没单独设过的 TA 都用这一套。'
: (ownOn
? '只对「' + _bxNameOf(apiCid) + '」生效；关掉上面的开关＝回到全站默认。'
: '「' + _bxNameOf(apiCid) + '」现在跟随全站默认；打开上面的开关才会单独一套（会先把全站这套复制过来）。');
}
_bxPaintStatus();
const pre = document.getElementById('bxPresetRow');
if (pre) {
const _curBase = String(api.base || '').replace(/\/+$/, '');
const _active = (BX_PRESETS.filter(x => x.base && x.base.replace(/\/+$/, '') === _curBase && (x.kind || 'openai') === api.kind)[0] || {}).id || '';
pre.innerHTML = BX_PRESETS.map(x => '<button type="button" class="contact-chip' + (x.id === _active ? ' active' : '') + '" data-bx-preset="' + x.id + '">' + escapeHTML(x.name) + '</button>').join('');
}
_bxPaintEndpoint();
const mmBtn = document.getElementById('bxKeyFromMm');
if (mmBtn) {
const mmRow = mmBtn.closest('.bx-actrow');
const hasMm = !!(data.minimax && data.minimax.key);
mmBtn.hidden = !hasMm;
if (mmRow) mmRow.hidden = !hasMm;
}
_bxProfPaint();
_bxPaintUsage();
const _memIds = _bxModelsGet();
if (_memIds && _memIds.length) {
const mchips = document.getElementById('bxModelChips');
if (mchips && !mchips.childElementCount) {
mchips.innerHTML = _memIds.map(id => '<button type="button" class="contact-chip" data-bx-model="' + escapeHTML(id) + '">' + escapeHTML(id) + '</button>').join('');
const mnote = document.getElementById('bxModelNote');
if (mnote && !mnote.textContent) mnote.textContent = '上次拉到的 ' + _memIds.length + ' 个；「拉取模型名单」会重新问接口。';
}
}
_bxTabApply();
_bxPaintCheck();
_bxPaintTry();
_bxPaintLast();
bxSettingsSum();
}
async function _bxPullModels() {
const note = document.getElementById('bxModelNote');
if (note) note.textContent = '正在问…';
const api = _bxApiEditCfg();
const isMM = _bxKind(api) === 'minimax';
const box = document.getElementById('bxModelChips');
const paint = ids => { if (box) box.innerHTML = ids.slice(0, 80).map(id => '<button type="button" class="contact-chip" data-bx-model="' + escapeHTML(id) + '">' + escapeHTML(id) + '</button>').join(''); };
let ids = [], lastErr = null;
for (const u of _bxModelsURLs(api)) {
try {
const got = _bxModelIds(await _bxFetchJSON(u, null, { api }));
if (got.length) { ids = got; break; }
} catch (e) { lastErr = e; }
}
if (ids.length) {
if (isMM) BX_MM_MODELS.forEach(id => { if (ids.indexOf(id) < 0) ids.push(id); });
paint(ids);
if (note) {
if (lastErr) note.textContent = '候选名单口里只有一条认了其余没通（' + (lastErr.message || '没说明') + '）；' + (isMM ? '内置候选已补在后面，' : '') + '点一枚填上去。';
else note.textContent = '拿到 ' + ids.length + ' 个' + (isMM ? '（接口名单在前，内置候选补在后面）' : '') + '，点一枚填上去。';
}
_bxModelsRemember(ids);
return;
}
if (isMM) {
paint(BX_MM_MODELS.slice());
if (note) note.textContent = '这个接口没给模型名单（不判失败）；下面是内置候选，也可以手填。';
return;
}
if (note) note.textContent = _bxWhy(lastErr, api);
}
async function bxCheck(forDivine) {
const cfg = bxCfg();
const api = _bxApiEditCfg();
const out = [];
out.push(forDivine
? ((typeof aidvCfg === 'function' && aidvCfg().on)
? { k: 'ok', t: 'AI 解读总闸已开。' }
: { k: 'bad', t: 'AI 解读总闸没开：接口通了也读不了，回占卜页勾上「在占卜里能用 AI 读牌」。' })
: (cfg.on ? { k: 'ok', t: '总开关已开。' } : { k: '', t: '总开关关着：下面只验接口，不会触发任何生成。' }));
out.push(api.model ? { k: 'ok', t: '模型：' + api.model } : { k: 'bad', t: '模型还没填。' });
out.push({ k: '', t: '实际请求：' + _bxChatURL(api) });
if (api.kind === 'minimax') out.push({ k: '', t: 'MiniMax：先走 /v1/text/chatcompletion_v2，没这个口再退 OpenAI 兼容口；旧域名要填账户组。' });
if (location.protocol === 'file:') out.push({ k: '', t: '现在是 file:// 打开：很多接口不允许网页直接跨域请求；要真连，先把站点部署成 https。' });
_bxChkOut = out;
_bxPaintCheck();
try {
let ids = [], lastErr = null;
for (const u of _bxModelsURLs(api)) {
try {
const got = _bxModelIds(await _bxFetchJSON(u, null, { api }));
if (got.length) { ids = got; break; }
} catch (e) {
if (!(api.kind === 'minimax' && (e.status === 404 || e.status === 405))) throw e;
lastErr = e;
}
}
if (ids.length) out.push({ k: 'ok', t: '连上了，Key 被这个接口认下来；它报了 ' + ids.length + ' 个模型。' });
else if (lastErr && api.kind === 'minimax') out.push({ k: '', t: '连了几个名单口都没有（最后：' + lastErr.message + '）；不判失败，模型照内置候选填，直接试写一张。' });
else out.push({ k: '', t: '连上了，但没读到模型名单（这一条不判失败）；可以直接试写一张。' });
} catch (e) {
if (api.kind === 'minimax' && e && (e.status === 404 || e.status === 405)) {
out.push({ k: '', t: '这个 MiniMax 接口没给模型名单（不判失败）；模型照内置候选填，直接试写一张。' });
} else {
out.push({ k: 'bad', t: _bxWhy(e, api) });
}
}
if (forDivine) {
out.push({ k: '', t: '真的发一发解读那一口（1 次极小请求，只讨一个字）…' });
_bxChkOut = out; _bxPaintCheck();
let okTx = '', saw200 = false, lastChatErr = null;
for (const u of _bxChatURLs(api)) {
try {
const j = await _bxFetchJSON(u, { model: api.model, messages: [{ role: 'user', content: '只回一个字：通' }], max_tokens: 16 }, { api });
saw200 = true;
const c = j && j.choices && j.choices[0];
okTx = (c && c.message) ? (typeof c.message.content === 'string' ? c.message.content
: Array.isArray(c.message.content) ? c.message.content.map(x => (x && (x.text || x.content)) || '').join('') : '') : '';
if (okTx && String(okTx).replace(/\s/g, '').length) break;
} catch (e3) {
lastChatErr = e3;
if (!(e3 && (e3.status === 404 || e3.status === 405))) break;
}
}
if (okTx && String(okTx).replace(/\s/g, '').length) {
out.push({ k: 'ok', t: '对话口通了（回：「' + String(okTx).replace(/\s/g, '').slice(0, 6) + '」）——解读走的就是这一条，能读牌。' });
} else if (lastChatErr && !saw200) {
out.push({ k: 'bad', t: '名单口通、对话口没通——解读走的就是对话口，按了也读不出。' + _bxWhy(lastChatErr, api) });
} else {
out.push({ k: 'bad', t: '对话口应了但没有吐内容：解读时多半也读不出东西——先换一个模型名再测。' });
}
}
_bxChkOut = out;
_bxPaintCheck();
_bxAutoOn();
}
function bxCheckForAidv() {
const keep = _bxApiEditCid();
_bxApiWhoRead = true;
_bxApiCid = '';
try { _bxApiDisable(false); } catch (e) {}
const back = () => { try { _bxApiWhoRemember(keep); renderBangxiePage(); } catch (e) {} };
return bxCheck(true).then(r => { back(); return r; }, e => { back(); throw e; });
}
async function bxTryOne() {
if (_bxBusy) { showToast('上一个请求还没回来'); return; }
_bxBusy = true;
_bxTryOut = [{ k: '', t: '正在写…（这一次会花一次额度）' }];
_bxPaintTry();
const api = _bxApiEditCfg();
try {
const r = await _bxGenerate(_bxWho(), { n: 1, req: '写一句日常问候，像平时发消息那样。', autoGroup: false, api });
const t = r.cards[0];
if (!t) throw new Error('模型没写出可用的一张');
_bxFails = 0;
_bxLast = { at: Date.now(), ok: true, why: '', text: t, usage: r.usage || null };
_bxTryOut = [{ k: 'ok', t: '写出来了：' + t + _bxUsageText(r.usage) }];
} catch (e) {
if (e && (e.canceled || e.aborted)) {
_bxTryOut = [{ k: '', t: '已取消。' }];
} else {
_bxLast = { at: Date.now(), ok: false, why: _bxWhy(e, api), text: '' };
_bxTryOut = [{ k: 'bad', t: _bxWhy(e, api) }];
}
} finally {
_bxBusy = false;
}
_bxPaintTry();
if (document.body && document.body.dataset.view === 'bangxie') _bxPaintLast();
}
async function bxTryQuiet(opts) {
if (_bxBusy) { const e = new Error('帮写那边正有一个请求在跑，等它回来再试'); e.busy = true; throw e; }
_bxBusy = true;
const api = _bxApiEditCfg();
try {
const r = await _bxGenerate(_bxWho(), {
n: 1, req: '写一句日常问候，像平时发消息那样。', autoGroup: false, api,
onDelta: (opts && typeof opts.onDelta === 'function') ? opts.onDelta : null
});
const t = r.cards[0];
if (!t) throw new Error('接口通了，但没写出可用的一张（模型返回空）：换一句要求或换个模型再试');
_bxFails = 0;
_bxLast = { at: Date.now(), ok: true, why: '', text: t, usage: r.usage || null };
return { text: t, usage: r.usage || null };
} finally {
_bxBusy = false;
}
}
function _bxPageInput(e) {
const id = e.target && e.target.id;
if (!id) return;
const b = bxCfg();
const t = _bxApiWriteTarget();
switch (id) {
case 'bxBase': if (!t) return; t.base = e.target.value; break;
case 'bxKey': if (!t) return; t.key = e.target.value; break;
case 'bxGroup': if (!t) return; t.group = e.target.value.trim(); break;
case 'bxHeaders': if (!t) return; t.headers = e.target.value.slice(0, 2000); break;
case 'bxModel': if (!t) return; t.model = e.target.value.trim(); break;
case 'bxTemp': if (!t) return; t.temp = _bxDec(e.target.value, 0, 2, 0.9); break;
case 'bxTimeout': if (!t) return; t.timeout = _bxNum(e.target.value, 5, 60, 20); break;
case 'bxProbReply': b.probReply = _bxNum(e.target.value, 0, 100, 8); break;
case 'bxProbMyCard': b.probMyCard = _bxNum(e.target.value, 0, 100, 4); break;
case 'bxMaxLen': b.maxLen = _bxNum(e.target.value, 6, 80, 40); break;
case 'bxWorld': b.world = e.target.value; break;
case 'bxPersona': _bxMateW(_bxWho()).persona = e.target.value; break;
case 'bxHabit': _bxMateW(_bxWho()).habit = e.target.value; break;
default: return;
}
_bxSaveSoon();
if (id === 'bxBase' || id === 'bxGroup') _bxPaintEndpoint();
if (id === 'bxWorld' || id === 'bxPersona' || id === 'bxHabit') _bxGrowPersona();
if (id === 'bxBase' || id === 'bxKey' || id === 'bxModel') _bxAutoOn();
}
function _bxPageChange(e) {
const id = e.target && e.target.id;
if (!id) return;
const b = bxCfg();
switch (id) {
case 'bxOn': b.on = !!e.target.checked; break;
case 'bxOnReply': b.onReply = !!e.target.checked; break;
case 'bxOnMyCard': b.onMyCard = !!e.target.checked; break;
case 'bxReview': b.review = !!e.target.checked; break;
case 'bxAutoSave': b.autoSave = !!e.target.checked; break;
case 'bxAutoGroup': b.autoGroup = !!e.target.checked; break;
case 'bxMateOff': _bxMateW(_bxWho()).off = !!e.target.checked; break;
case 'bxApiOwn': {
const cid = _bxApiEditCid();
if (!cid) break;
if (e.target.checked) _bxMateW(cid).api = JSON.parse(JSON.stringify(bxCfg().api));
else delete _bxMateW(cid).api;
break;
}
case 'bxBase':
case 'bxKey':
case 'bxModel': {
const t = _bxApiWriteTarget();
if (t) {
if (id === 'bxBase') t.base = e.target.value;
else if (id === 'bxKey') t.key = e.target.value;
else t.model = e.target.value.trim();
_bxSaveNow();
}
_bxAutoOn();
return;
}
default: return;
}
_bxSaveNow();
renderBangxiePage();
}
function _bxPageClick(e) {
if (e.target.closest('#bxHeadChat')) { bxGoChat(); return; }
const tab = e.target.closest('[data-bx-tab]');
if (tab) { _bxTab = tab.dataset.bxTab; _bxTabApply(); return; }
const who = e.target.closest('[data-bx-who]');
if (who) { _bxCid = who.dataset.bxWho; renderBangxiePage(); return; }
const apiWho = e.target.closest('[data-bx-apiwho]');
if (apiWho) { _bxApiWhoRemember(apiWho.dataset.bxApiwho || ''); renderBangxiePage(); return; }
const preset = e.target.closest('[data-bx-preset]');
if (preset) {
const x = BX_PRESETS.filter(z => z.id === preset.dataset.bxPreset)[0];
if (!x) return;
if (!x.base) { showToast('把中转站给你的地址原样贴到 Base URL，带不带 /v1 都行；它要自定义请求头就展开「高级」'); const b = document.getElementById('bxBase'); if (b) b.focus(); return; }
_bxEnsureApiOwn();
const t = _bxApiWriteTarget();
if (!t) return;
t.kind = x.kind === 'minimax' ? 'minimax' : 'openai';
t.base = x.base;
if (!t.model || x.model) t.model = x.model;
if (t.kind !== 'minimax') t.group = '';
_bxSaveNow();
_bxAutoOn();
renderBangxiePage();
showToast(x.name + ' 的地址已填上' + (t.key ? '' : '，还差 Key'));
return;
}
if (e.target.id === 'bxKeyFromMm') {
const mm = (data.minimax && typeof data.minimax === 'object') ? data.minimax : {};
const k = String(mm.key || '');
if (!k) return;
_bxEnsureApiOwn();
const t = _bxApiWriteTarget();
if (!t) return;
t.kind = 'minimax';
t.key = k;
if (!t.base || /api\.openai\.com/i.test(t.base)) t.base = String(mm.host || 'https://api.minimaxi.com/v1');
t.group = String(mm.group || t.group || '');
if (!t.model) t.model = 'MiniMax-Text-01';
_bxSaveNow();
_bxAutoOn();
renderBangxiePage();
showToast('MiniMax 的 Key 与域名已经带入（同一个账户才有用）');
return;
}
const model = e.target.closest('[data-bx-model]');
if (model) {
_bxEnsureApiOwn();
const t = _bxApiWriteTarget();
if (!t) return;
t.model = model.dataset.bxModel;
_bxSaveNow();
_bxAutoOn();
renderBangxiePage();
return;
}
if (e.target.closest('[data-bx-key-x]')) {
if (_bxApiEditCid() && !_bxApiOwnOf(_bxApiEditCid())) { showToast('先打开「这一位单独用一套接口」'); return; }
const t = _bxApiWriteTarget();
if (!t) return;
t.key = '';
_bxSaveNow();
renderBangxiePage();
showToast('已清空 Key');
return;
}
if (e.target.id === 'bxModelPull') { _bxPullModels(); return; }
if (e.target.id === 'bxCheckBtn') { bxCheck(); return; }
if (e.target.id === 'bxTryBtn') { bxTryOne(); return; }
if (e.target.closest('#bxPersonaPull')) { _bxPullPersona(); return; }
if (e.target.closest('#bxPersonaUndo')) { _bxPersonaUndoRun(); return; }
if (e.target.id === 'bxDeskBtn') { bxDeskOpen({ cid: _bxWho() }); return; }
if (e.target.id === 'bxProfSave') { _bxProfSave(); return; }
if (e.target.id === 'bxUsageClear') { _bxUsageClear(); return; }
const pmain = e.target.closest('[data-bx-prof-main]');
if (pmain) { _bxProfApply(Number(pmain.dataset.bxProfMain)); return; }
const pover = e.target.closest('[data-bx-prof-over]');
if (pover) { _bxProfOver(Number(pover.dataset.bxProfOver)); return; }
const pdel = e.target.closest('[data-bx-prof-del]');
if (pdel) { _bxProfDel(Number(pdel.dataset.bxProfDel)); return; }
}
function _bxDeskClick(e) {
const mask = e.currentTarget;
if (e.target === mask) { bxDeskClose(); return; }
if (e.target.closest('#bxDeskClose')) { bxDeskClose(); return; }
if (e.target.closest('#bxDeskSet')) { bxDeskClose(); if (typeof showView === 'function') showView('bangxie'); return; }
const d = _bxDesk;
if (!d) return;
const mode = e.target.closest('[data-bx-mode]');
if (mode) { d.mode = mode.dataset.bxMode === 'manual' ? 'manual' : 'ai'; _bxDeskPaint(); return; }
if (e.target.closest('#bxDeskChat')) { const goId = d.cid; bxDeskClose(); bxGoChat(goId); return; }
if (e.target.closest('[data-bx-msat]')) { _bxManualRateOne(Number(e.target.closest('[data-bx-msat]').dataset.bxMsat)); return; }
const mg = e.target.closest('[data-bx-mgroup]');
if (mg) { d.mGroup = mg.dataset.bxMgroup; _bxManualGroupPaint(); return; }
if (e.target.closest('[data-bx-mgai]')) { _bxManualGroupAsk(); return; }
if (e.target.closest('#bxManualRate')) { _bxManualRate(); return; }
if (e.target.closest('#bxManualCmp')) { _bxCmpAddManual(); return; }
if (e.target.closest('#bxManualSave')) { _bxManualSave(); return; }
if (e.target.closest('#bxManualSend')) { _bxManualSend(); return; }
if (e.target.closest('[data-bx-fillpersona]')) { _fillPersonaField(); return; }
const who = e.target.closest('[data-bx-dwho]');
if (who) { d.cid = who.dataset.bxDwho; _bxCid = d.cid; d.cards = []; d.sel = []; d.sat = []; d.cmp = []; d.picks = {}; d.lastFix = ''; d.groupPick = ''; d.inReq = {}; d.softOK = false; d.mGroup = ''; d.manualSat = []; _bxDeskPaint(true); return; }
if (e.target.closest('[data-bx-gopersona]')) { _bxDeskToPersona(); return; }
if (e.target.closest('[data-bx-softok]')) { d.softOK = true; _bxDeskGen(); return; }
const _applyChip = (kind, x) => {
const key = kind + ':' + x.id;
if (!d.inReq) d.inReq = {};
const cur = String(d.req || '');
if (d.inReq[key]) {
const lit = d.inReq[key];
const i = cur.indexOf(lit);
d.req = i >= 0 ? (cur.slice(0, i) + cur.slice(i + lit.length)).replace(/\n{2,}/g, '\n').replace(/^\n+|\n+$/g, '') : cur;
delete d.inReq[key];
} else {
d.req = (cur ? cur.replace(/\s+$/, '') + '\n' : '') + x.text;
d.inReq[key] = x.text;
}
const r = document.getElementById('bxDeskReq');
if (r) {
r.value = d.req;
try {
r.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
r.focus({ preventScroll: true });
r.setSelectionRange(d.req.length, d.req.length);
} catch (e2) {}
}
_bxDeskPaint();
};
const tpl = e.target.closest('[data-bx-tpl]');
if (tpl) {
const x = BX_TPLS.filter(z => z.id === tpl.dataset.bxTpl)[0];
if (x) _applyChip('tpl', x);
return;
}
const sty = e.target.closest('[data-bx-style]');
if (sty) {
const x = BX_STYLES.filter(z => z.id === sty.dataset.bxStyle)[0];
if (x) _applyChip('sty', x);
return;
}
const cmpAdd = e.target.closest('[data-bx-cmpadd]');
if (cmpAdd) { _bxCmpAdd(Number(cmpAdd.dataset.bxCmpadd)); return; }
const cmpRm = e.target.closest('[data-bx-cmprm]');
if (cmpRm) {
const vi = Number(cmpRm.dataset.bxCmprm);
const v = (d.cmp || [])[vi];
if (v) { _bxCmpAdd(v.key); }
return;
}
if (e.target.closest('#bxCmpAddNow')) { _bxCmpAdd(0); return; }
if (e.target.closest('#bxCmpSave')) { _bxCmpSave(); return; }
if (e.target.closest('#bxCmpClear')) { _bxCmpClear(); return; }
const hi = e.target.closest('[data-bx-hist]');
if (hi) { _bxHistUse(Number(hi.dataset.bxHist)); return; }
if (e.target.closest('#bxHistClear')) { _bxHistClear(); return; }
const gpAI = e.target.closest('[data-bx-dgroup-ai]');
if (gpAI) {
d.autoGroup = true;
d.groupPick = '';
const ag = document.getElementById('bxDeskAutoGroup');
if (ag) ag.checked = true;
if (!d.group && d.cards.length && !d.aiNameBusy) {
d.aiNameBusy = true;
_bxDeskPaint();
showToast('正在按这一批的内容拟组名…');
const cards = d.cards.slice();
const cid = d.cid;
_bxGroupNameAsk(cid, cards, { groups: _bxGroupsOf(cid).map(x => x.name) })
.then(name => {
if (_bxDesk === d && d.cid === cid && d.cards.length === cards.length) {
if (name) { d.group = name; showToast('AI 拟的组名：「' + name + '」，存库时按它落'); }
else showToast('这次没拟出来，再点一次试试');
}
})
.catch(e => { try { showToast('没拟出来：' + _bxWhy(e, bxApiFor(cid))); } catch (e2) {} })
.finally(() => { d.aiNameBusy = false; if (_bxDesk === d) _bxDeskPaint(); });
} else {
_bxDeskPaint();
showToast(d.group ? ('存库时按 AI 拟的「' + d.group + '」落') : '存库时让 AI 拟组名');
}
return;
}
const gp = e.target.closest('[data-bx-dgroup]');
if (gp) {
d.autoGroup = false;
d.groupPick = gp.dataset.bxDgroup;
_bxDeskPaint();
const picks = d.cards.filter((c, i) => d.sel[i]);
if (!picks.length) { showToast('先勾选要存的卡'); return; }
bxSaveCards(d.cid, picks, d.groupPick)
.then(r => {
if (r && r.added) showToast('已存进「' + r.group + '」· 新增 ' + r.added + ' 张');
else if (r && r.dup) showToast('这几张字卡库里已经有了');
})
.catch(() => {});
return;
}
if (e.target.closest('#bxDeskGen')) { _bxDeskGen(); return; }
if (e.target.closest('#bxDeskCancel')) { bxCancel(); return; }
if (e.target.closest('#bxDeskRedo')) { _bxDeskRedo(); return; }
if (e.target.closest('#bxDeskSaveAll')) { _bxDeskSave(true); return; }
if (e.target.closest('#bxDeskSaveSel')) { _bxDeskSave(false); return; }
const send = e.target.closest('[data-bx-dsend]');
if (send) { _bxDeskSend(Number(send.dataset.bxDsend)); return; }
const ed = e.target.closest('[data-bx-dedit]');
if (ed) {
const i = Number(ed.dataset.bxDedit);
const ta = document.querySelector('[data-bx-dtext="' + i + '"]');
if (ta) {
try { ta.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e2) {}
setTimeout(() => {
try {
ta.focus();
const L = String(ta.value || '').length;
ta.setSelectionRange(L, L);
} catch (e2) {}
}, 260);
}
return;
}
const sat = e.target.closest('[data-bx-dsat]');
if (sat) { _bxDeskSat(Number(sat.dataset.bxDsat)); return; }
const drop = e.target.closest('[data-bx-ddrop]');
if (drop) {
const i = Number(drop.dataset.bxDdrop);
d.cards.splice(i, 1); d.sel.splice(i, 1);
if (d.sat) d.sat.splice(i, 1);
_bxDeskPaint();
_bxHistSync();
return;
}
}
function _bxDeskSat(i) {
const d = _bxDesk;
if (!d || !d.cards[i] || d.busy) return;
if (!d.sat) d.sat = [];
if (!d._satBusy) d._satBusy = [];
if (d._satBusy[i]) return;
d._satBusy[i] = true;
const tag = document.querySelector('[data-bx-dsattag="' + i + '"]');
const txt = d.cards[i];
let n = 0, last = 0;
const iv = setInterval(() => {
last = 1 + Math.floor(Math.random() * 10);
if (tag) { tag.hidden = false; tag.textContent = '满意度 ' + last + '/10'; }
if (++n >= 9) {
clearInterval(iv);
d._satBusy[i] = false;
if (d.cards[i] === txt) {
d.sat[i] = last;
_bxDeskPaint();
_bxHistSync();
}
}
}, 80);
}
function _bxDeskInput(e) {
const d = _bxDesk;
if (!d) return;
const t = e.target;
if (t.id === 'bxDeskReq') { d.req = t.value; return; }
if (t.id === 'bxDeskMyLine') { d.myLine = t.value; return; }
if (t.id === 'bxManualText') {
d.manualText = t.value;
d.manualSat = [];
d.satManualBusy = false;
_bxManualSatPaint();
return;
}
if (t.id === 'bxDeskPersonaFill') { d.personaDraft = t.value; return; }
if (t.hasAttribute && t.hasAttribute('data-bx-dtext')) {
const i = Number(t.dataset.bxDtext);
if (d.cards[i] !== undefined) {
d.cards[i] = t.value;
clearTimeout(_bxHistSyncT);
_bxHistSyncT = setTimeout(_bxHistSync, 500);
}
}
}
function _bxDeskChange(e) {
const d = _bxDesk;
if (!d) return;
const t = e.target;
if (t.id === 'bxDeskCtx') { d.ctx = !!t.checked; return; }
if (t.id === 'bxDeskAutoGroup') { d.autoGroup = !!t.checked; _bxDeskPaint(); return; }
if (t.hasAttribute && t.hasAttribute('data-bx-dsel')) {
const i = Number(t.dataset.bxDsel);
d.sel[i] = !!t.checked;
return;
}
if (t.hasAttribute && t.hasAttribute('data-bx-cmppick')) {
const pair = String(t.dataset.bxCmppick).split(':');
const v = (d.cmp || [])[Number(pair[0])];
const c = v && (v.cards || [])[Number(pair[1])];
if (!v || c === undefined) return;
if (!d.picks) d.picks = {};
const pk = v.key + '|' + c;
if (t.checked) d.picks[pk] = 1; else delete d.picks[pk];
const btn = document.getElementById('bxCmpSave');
if (btn) btn.textContent = '存下选中的 ' + _bxCmpPickList(d).length + ' 张';
}
}
function _bxBindOnce() {
if (_bxBound) return;
const root = document.getElementById('bangxieView');
if (!root) return;
_bxBound = true;
root.addEventListener('click', _bxPageClick);
root.addEventListener('input', _bxPageInput);
root.addEventListener('change', _bxPageChange);
const desk = document.getElementById('bxDeskMask');
if (desk) {
desk.addEventListener('click', _bxDeskClick);
desk.addEventListener('input', _bxDeskInput);
desk.addEventListener('change', _bxDeskChange);
}
const cb = document.getElementById('cardsBxBtn');
if (cb) cb.addEventListener('click', () => bxDeskOpen({ from: 'cards' }));
const hb = document.getElementById('bxHeadDesk');
if (hb) hb.addEventListener('click', () => bxDeskOpen({ cid: _bxWho() }));
const ce = document.getElementById('cardsBxEntry');
if (ce) ce.addEventListener('click', () => bxDeskOpen({ from: 'cards' }));
const cm = document.getElementById('cardsBxDesk');
if (cm) cm.addEventListener('click', () => {
const more = document.getElementById('cardsMoreMask');
if (more) more.hidden = true;
bxDeskOpen({ from: 'cards' });
});
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _bxBindOnce);
else _bxBindOnce();
(window.__CHUNK_OK__ = window.__CHUNK_OK__ || {})['bangxie'] = true;
