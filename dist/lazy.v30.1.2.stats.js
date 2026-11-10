// 本件由 tools/assemble.py 生成·勿手改：首屏 JS 分片（进这一页那一刻才取），源＝js/ 那些拆分件
var statsScope = 'all';
var STATS_TABS = [
{ k: 'overview', name: '概览' },
{ k: 'hours', name: '时段' },
{ k: 'cards', name: '字卡' },
{ k: 'calls', name: '通话' },
{ k: 'listen', name: '听歌' },
{ k: 'timeline', name: '时光线' },
];
var STATS_TAB_KEY = 'ordinal-stats-tab';
var statsTab = 'overview';
var _statsTabLoaded = false;
function _statsTabLoad() {
if (_statsTabLoaded) return;
_statsTabLoaded = true;
let v = null;
try { v = localStorage.getItem(STATS_TAB_KEY); } catch (e) { }
statsTab = STATS_TABS.some(x => x.k === v) ? v : 'overview';
}
function _statsTabSet(k) {
if (!STATS_TABS.some(x => x.k === k) || k === statsTab) return;
statsTab = k;
try { localStorage.setItem(STATS_TAB_KEY, k); } catch (e) { }
}
function _statsScopeMsgs() {
if (statsScope !== 'all' && data.chats && data.chats[statsScope]) return data.chats[statsScope].msgs || [];
let all = [];
for (const c of data.contacts || []) { const ch = data.chats && data.chats[c.id]; if (ch && ch.msgs) all = all.concat(ch.msgs); }
return all;
}
function _statsNum(n) {
const v = Math.max(0, Math.round(Number(n) || 0));
return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function _statsStreak(daySet) {
const dayNo = [];
for (const k of daySet) {
const d = new Date(String(k).replace(/-/g, '/'));
if (isNaN(d.getTime())) continue;
dayNo.push(Math.round(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 86400000));
}
if (!dayNo.length) return 0;
const uniq = [...new Set(dayNo)].sort((a, b) => a - b);
let best = 1, run = 1;
for (let i = 1; i < uniq.length; i++) {
if (uniq[i] === uniq[i - 1] + 1) { run++; if (run > best) best = run; }
else run = 1;
}
return best;
}
function _statsBarsHTML(cnt, opts) {
const o = opts || {};
const max = cnt.length ? Math.max(...cnt) : 0;
const bars = cnt.map((v, i) => `<div class="stats-hour${max > 0 && v === max ? ' hi' : ''}"${o.tip ? ` title="${escapeHTML(o.tip(v, i))}"` : ''}><i style="height:${max ? Math.max(Math.round(v / max * 100), 1) : 1}%"></i></div>`).join('');
const x = (o.labels || []).map(s => `<span>${escapeHTML(String(s))}</span>`).join('');
const note = max ? (o.peak ? `<p class="stats-note">${escapeHTML(o.peak)}</p>` : '') : '<p class="stats-note">这一项还没有记录。</p>';
return `<div class="stats-hours${o.sm ? ' sm' : ''}">${bars}</div>` + (x ? `<div class="stats-hours-x">${x}</div>` : '') + note;
}
function _statsMonthCells(tsList) {
let firstTs = 0;
tsList.forEach(ts => { if (ts && (!firstTs || ts < firstTs)) firstTs = ts; });
const now = new Date();
const cur = { y: now.getFullYear(), m: now.getMonth() };
if (!firstTs) return { cells: [], cut: 0, cur };
const f = new Date(firstTs);
let span = (cur.y - f.getFullYear()) * 12 + (cur.m - f.getMonth()) + 1;
const cut = Math.max(0, span - 24);
span = Math.min(span, 24);
const cells = [];
for (let i = 0; i < span; i++) {
const d = new Date(cur.y, cur.m - (span - 1 - i), 1);
cells.push({ y: d.getFullYear(), m: d.getMonth(), n: 0 });
}
tsList.forEach(ts => {
const d = new Date(ts);
const c = cells.find(x => x.y === d.getFullYear() && x.m === d.getMonth());
if (c) c.n++;
});
return { cells, cut, cur };
}
function _statsMonthLabel(c, cur) {
return (c.y === cur.y ? '' : c.y + '年') + (c.m + 1) + '月';
}
function _statsTrendHTML(tsList) {
const buckets = _statsMonthCells(tsList);
const cells = buckets.cells;
const cur = buckets.cur;
if (cells.length < 2) {
const only = cells.length ? cells[0].n : 0;
return `<p class="stats-note">记录还在第一个月里 · 本月 ${only} 句</p>`;
}
const max = Math.max(...cells.map(c => c.n)) || 1;
const pts = cells.map((c, i) => `${(i / (cells.length - 1) * 300).toFixed(1)},${(56 - c.n / max * 46).toFixed(1)}`);
const thisM = cells[cells.length - 1], lastM = cells[cells.length - 2];
let right = '本月 ' + thisM.n + ' 句';
if (lastM.n > 0) {
const diff = Math.round((thisM.n - lastM.n) / lastM.n * 100);
right = '本月 ' + thisM.n + ' 句 · ' + (diff === 0 ? '与上月持平' : (diff > 0 ? '↑' : '↓') + Math.abs(diff) + '%');
}
return `<svg class="stats-trend" viewBox="0 0 300 64" aria-hidden="true"><polyline points="${pts.join(' ')}"/><circle cx="300" cy="${(56 - thisM.n / max * 46).toFixed(1)}" r="3"/></svg>` +
`<div class="stats-trend-x"><span>${escapeHTML(_statsMonthLabel(cells[0], cur))}</span><span>${escapeHTML(right)}</span></div>`;
}
var _statsAggCache = { key: '', full: false, v: null };
function _statsAgg(msgs, scope, full) {
const today = new Date().toLocaleDateString('zh-CN');
const key = scope + '|' + today + '|' + (data._rev || 0) + '|' + msgs.length;
if (_statsAggCache.key === key && (_statsAggCache.full || !full)) return _statsAggCache.v;
const total = msgs.length;
let mine = 0, partner = 0, sys = 0;
const typeCnt = { text: 0, sticker: 0, cardParts: 0, ask: 0, quote: 0, recall: 0, game: 0 };
const days = new Set();
const hourCnt = new Array(24).fill(0);
let first = null, last = null;
const classify = m => {
if (m.recalled) return 'recall';
if (m.ask) return 'ask';
if (m.game) return 'game';
if (m.sticker) return 'sticker';
if (Array.isArray(m.cardParts) && m.cardParts.length) return 'cardParts';
if (m.quote || m.quoteImg) return 'quote';
return 'text';
};
const dayCnt = [];
for (let i = 6; i >= 0; i--) { const x = new Date(); x.setDate(x.getDate() - i); dayCnt.push({ label: (x.getMonth() + 1) + '/' + x.getDate(), key: x.toLocaleDateString('zh-CN'), n: 0 }); }
const dayCntByKey = {};
dayCnt.forEach(x => { dayCntByKey[x.key] = x; });
if (full) {
for (const m of msgs) {
if (m.from === 'system') sys++;
else if (m.from === 'me') mine++;
else partner++;
const cat = m.from === 'system' ? null : classify(m);
if (cat) typeCnt[cat]++;
if (m.date) { days.add(m.date); const _dc = dayCntByKey[m.date]; if (_dc) _dc.n++; }
const t = m.time || '';
if (t) {
const h = parseInt(String(t).split(':')[0], 10);
if (h >= 0 && h <= 23) hourCnt[h]++;
const stamp = (m.date ? m.date + ' ' : '') + t;
if (!first || stamp < first) first = stamp;
if (!last || stamp > last) last = stamp;
}
}
} else {
for (const m of msgs) { if (m && m.date) days.add(m.date); }
}
const dayCount = days.size;
const avg = dayCount ? (total / dayCount).toFixed(1) : '0';
const streak = _statsStreak(days);
const v = { total, mine, partner, sys, typeCnt, hourCnt, first, last, dayCount, avg, streak, dayCnt };
_statsAggCache = { key, full: !!full, v };
return v;
}
function renderStats() {
const el = $('#statsOutput'); if (!el) return;
const msgs = _statsScopeMsgs();
const A = _statsAgg(msgs, statsScope, statsTab === 'overview');
const total = A.total, mine = A.mine, partner = A.partner, sys = A.sys;
const typeCnt = A.typeCnt, hourCnt = A.hourCnt, first = A.first, last = A.last;
const dayCount = A.dayCount, avg = A.avg, streak = A.streak, dayCnt = A.dayCnt;
const allTs = [];
if (statsTab === 'timeline') {
for (const cid of Object.keys(data.chats || {})) {
const ms = (data.chats[cid] && Array.isArray(data.chats[cid].msgs)) ? data.chats[cid].msgs : [];
for (const m of ms) { const t = _tsOf(m.date, m.time); if (t) allTs.push(t); }
}
}
const typeNames = { text: '文字', sticker: '表情包 / 图片', cardParts: '多字卡', ask: '问问TA', quote: '引用', recall: '撤回', game: '游戏卡' };
const maxType = Math.max(1, ...Object.values(typeCnt));
const typeBars = Object.keys(typeNames).map(k => {
const n = typeCnt[k];
const w = n ? Math.round(n / maxType * 100) : 0;
const pct = total ? Math.round(n / total * 100) : 0;
return `<div class="stats-bar-row"><span class="stats-bar-label">${typeNames[k]}</span><div class="stats-bar-track"><i style="width:${w}%"></i></div><b>${n}<em>${pct}%</em></b></div>`;
}).join('');
const hourMax = hourCnt.length ? Math.max(...hourCnt) : 0;
const peakHour = hourCnt.findIndex(v => hourMax > 0 && v === hourMax);
const hourBars = _statsBarsHTML(hourCnt, {
labels: ['0', '6', '12', '18', '24'],
tip: (v, i) => i + ':00 共 ' + v + ' 条',
peak: '最热闹的是 ' + peakHour + ' 点 · 说了 ' + hourCnt[peakHour] + ' 句'
});
const _annMain = (typeof annMainFor === 'function') ? annMainFor(statsScope !== 'all' ? statsScope : '') : null;
const _annDated = (_annMain && !_annMain.yearly) ? _annMain : null;
let accompany;
if (_annDated) {
const d = Math.max(0, Math.floor((Date.now() - new Date(_annDated.date + 'T00:00:00').getTime()) / 86400000));
const who = _annDated.contactId ? `（和 ${escapeHTML(annContactName(_annDated.contactId))}）` : '';
accompany = `自${who}纪念日 <b>${d}</b> 天以来，「${escapeHTML(partnerName())}」一直陪在你身边`;
} else if (first) {
const _firstTs = new Date(String(first).replace(/-/g, '/')).getTime();
const _days = Math.floor((Date.now() - _firstTs) / 86400000);
accompany = Number.isFinite(_days) && _days >= 0
? `从第一条消息（<b>${escapeHTML(first)}</b>）收录的 <b>${_days}</b> 天前起，「${escapeHTML(partnerName())}」被你收进心里了`
: `从第一条消息（<b>${escapeHTML(first)}</b>）起，「${escapeHTML(partnerName())}」被你收进心里了`;
} else {
accompany = `还没有聊天记录，去和「${escapeHTML(partnerName())}」聊聊天吧`;
}
const weekMax = dayCnt.reduce((mx, x) => Math.max(mx, x.n), 0);
const peakDay = dayCnt.find(x => x.n === weekMax);
const weekBars = _statsBarsHTML(dayCnt.map(x => x.n), {
sm: true,
labels: dayCnt.map(x => x.label),
tip: (v, i) => dayCnt[i].label + ' 共 ' + v + ' 条',
peak: '这七天里 ' + (peakDay ? peakDay.label : '') + ' 说得最多 · ' + (peakDay ? peakDay.n : 0) + ' 条'
});
_statsTabLoad();
let lTotal = 0, lTracks = 0, lWeek = 0;
try {
const lplx = _plRoot();
const playsAll = (lplx && lplx.plays && typeof lplx.plays === 'object' && !Array.isArray(lplx.plays)) ? lplx.plays : {};
const weekAgo = Date.now() - 7 * 86400000;
Object.keys(playsAll).forEach(k => {
const v = playsAll[k] || {};
const n = Math.max(0, Math.floor(Number(v.n) || 0));
if (!n) return;
lTotal += n; lTracks++;
if (Number(v.last) >= weekAgo) lWeek++;
});
} catch (e) {}
let lsn = null;
try { lsn = (typeof plListenStat === 'function') ? plListenStat() : null; } catch (e) {}
const durText = (typeof plDurText === 'function') ? plDurText : (n => String(Math.max(0, Math.floor(Number(n) || 0))) + ' 秒');
const panels = {
overview: `<div class="stats-sec">
      <div class="stats-accompany">${accompany}</div>
      <div class="stats-hour-label">说得多少</div>
      <div class="stats-lines">
        <div><span>我发送</span><b>${_statsNum(mine)} 条</b></div>
        <div><span>对方发送</span><b>${_statsNum(partner)} 条</b></div>
        <div><span>系统消息</span><b>${_statsNum(sys)} 条</b></div>
        <div><span>平均每天</span><b>${avg} 条</b></div>
        <div><span>最早互动</span><b>${first ? escapeHTML(first) : '—'}</b></div>
        <div><span>最近互动</span><b>${last ? escapeHTML(last) : '—'}</b></div>
      </div>
      <div class="stats-hour-label">说是哪种消息</div>
      <div class="stats-bars">${typeBars}</div>
      <p class="stats-note">共 ${total} 条消息：含 ${typeCnt.sticker} 张表情包/图片、${typeCnt.quote} 次引用、${typeCnt.recall} 条撤回、${typeCnt.ask} 张问问TA卡片、${typeCnt.cardParts} 次一句话由多张字卡拼成的回复、${typeCnt.game} 张游戏卡。</p>
    </div>`,
hours: `<div class="stats-sec"><div class="stats-hour-label">一天里哪几个钟头说得最多</div>${hourBars}<div class="stats-hour-label">近 7 天每天条数</div>${weekBars}</div>`,
cards: `<div class="stats-sec">
      <div class="stats-switch" id="statsCardSwitch"><button class="stats-switch-btn" data-side="partner">联系人</button><button class="stats-switch-btn" data-side="me">我的</button></div>
      <div id="statsCardRank"></div>
    </div>`,
calls: `<div class="stats-sec">${statsTab === 'calls' ? callStatsHTML() : ''}</div>`,
listen: `<div class="stats-sec">
      <div class="stats-grid">
        <div class="stats-tile"><b>${_statsNum(lTotal)}</b><span>总播放次数</span></div>
        <div class="stats-tile"><b>${_statsNum(lTracks)}</b><span>听过的曲目</span></div>
        <div class="stats-tile"><b>${_statsNum(lWeek)}</b><span>近 7 天听过</span></div>
      </div>
      <div id="statsListenRank"></div>
      <div class="stats-hour-label">一起听时长</div>
      <div class="stats-grid">
        <div class="stats-tile"><b>${escapeHTML(durText(lsn ? lsn.todayCo : 0))}</b><span>今日一起听</span></div>
        <div class="stats-tile"><b>${escapeHTML(durText(lsn ? lsn.totalCo : 0))}</b><span>累计一起听</span></div>
        <div class="stats-tile"><b>${escapeHTML(durText(lsn ? lsn.totalAll : 0))}</b><span>累计总听歌</span></div>
      </div>
      <p class="stats-note">只数「开播」：切歌、单曲循环重放都算一次，一首听到一半停掉也算一次。听歌次数是整个应用合在一起算的，不分是哪一位。时长只记音频真在往前走的那一段；拖动进度条／跳段不计时。</p>
    </div>`,
timeline: `<div class="stats-sec">${statsTab === 'timeline' ? _statsTimelineHTML(allTs) : ''}</div>`,
};
const listenOnly = statsTab === 'listen';
el.innerHTML = `
    ${listenOnly ? '' : '<div class="stats-scope" id="statsScope"></div>'}
    ${listenOnly ? '' : `<div class="stats-grid">
      <div class="stats-tile"><b>${_statsNum(total)}</b><span>消息条数</span></div>
      <div class="stats-tile"><b>${_statsNum(dayCount)}</b><span>聊天天数</span></div>
      <div class="stats-tile"><b>${_statsNum(streak)}</b><span>连续天数</span></div>
    </div>`}
    <div class="stats-tabs" id="statsTabs">${STATS_TABS.map(t => `<button type="button" class="stats-tab${statsTab === t.k ? ' active' : ''}" data-stats-tab="${t.k}">${t.name}</button>`).join('')}</div>
    <div class="stats-panel" data-tab="${statsTab}">${panels[statsTab]}</div>
  `;
const tabsEl = $('#statsTabs');
if (tabsEl) tabsEl.onclick = e => {
const b = e.target.closest('.stats-tab'); if (!b) return;
_statsTabSet(b.dataset.statsTab);
renderStats();
};
const scopeEl = el.querySelector('#statsScope');
if (scopeEl) {
const chips = [{ id: 'all', label: '全部' }]
.concat((data.contacts || []).map(c => ({ id: c.id, label: (c.kind === 'group' ? '群·' : '') + c.name })));
scopeEl.innerHTML = chips.map(c => `<button type="button" class="scope-chip${statsScope === c.id ? ' on' : ''}" data-scope="${escapeHTML(c.id)}">${escapeHTML(c.label)}</button>`).join('');
scopeEl.onclick = function (e) {
const b = e.target.closest('.scope-chip'); if (!b) return;
statsScope = b.dataset.scope;
renderStats();
};
}
const sw = $('#statsCardSwitch');
if (sw) {
sw.querySelector('[data-side="' + statsCardSide + '"]').classList.add('on');
sw.onclick = function (e) {
const b = e.target.closest('.stats-switch-btn'); if (!b) return;
statsCardSide = b.dataset.side;
sw.querySelectorAll('.stats-switch-btn').forEach(x => x.classList.remove('on'));
b.classList.add('on');
buildCardRank(statsCardSide);
};
}
if (statsTab === 'cards') buildCardRank(statsCardSide);
if (statsTab === 'listen') _statsListenFill();
}
function _statsListenFill() {
const el = document.getElementById('statsListenRank'); if (!el) return;
let playsAll = {};
try { const p = _plRoot(); if (p && p.plays && typeof p.plays === 'object') playsAll = p.plays; } catch (e) {}
const tracks = Object.keys(playsAll)
.map(id => { const t = plById(id); return t ? { t, n: Math.max(0, Math.floor(Number(playsAll[id] && playsAll[id].n) || 0)) } : null; })
.filter(x => x && x.n > 0);
if (!tracks.length) { el.innerHTML = '<div class="stats-empty">还没有听过歌 · 在播放器里放一首就有了</div>'; return; }
tracks.sort((a, b) => b.n - a.n);
const libTag = {};
const rows = tracks.slice(0, 50).map(x => {
const k = x.t.name + (x.t.artist ? ' · ' + x.t.artist : '');
libTag[k] = (typeof _plSrcLabel === 'function') ? _plSrcLabel(x.t) : '';
return [k, x.n];
});
const moreNote = tracks.length > rows.length ? `<div class="stats-empty">仅显示前 ${rows.length} 首，共听过 ${tracks.length} 首</div>` : '';
_statsRankFill(el, rows, libTag, moreNote);
}
var statsCardSide = 'partner';
function callStatsHTML() {
const all = data.calls || [];
const calls = statsScope === 'all' ? all : all.filter(c => (c && c.cid) === statsScope);
const legacy = statsScope === 'all' ? all.filter(c => !c || !c.cid).length : 0;
const total = calls.length;
if (!total) return '<p class="stats-note">' + (statsScope === 'all' ? '还没有通话记录。' : '这位还没有通话记录。') + '</p>';
const cnt = { answer: 0, reject: 0, miss: 0, busy: 0, cancel: 0 };
let durMs = 0;
for (const c of calls) { cnt[c.outcome] = (cnt[c.outcome] || 0) + 1; if (c.durationMs) durMs += c.durationMs; }
const answered = cnt.answer;
const unconnected = total - answered;
const min = Math.floor(durMs / 60000), sec = Math.round((durMs % 60000) / 1000);
const durStr = min + ':' + String(sec).padStart(2, '0');
const parts = [];
parts.push(`接通 ${answered} 通`);
parts.push(`未接 ${cnt.miss} 通`);
parts.push(`忙线 ${cnt.busy} 通`);
parts.push(`拒绝 ${cnt.reject} 通`);
if (cnt.cancel) parts.push(`取消 ${cnt.cancel} 通`);
const vidN = calls.filter(c => c && c.kind === 'video').length;
const voiN = calls.filter(c => c && c.kind === 'voice').length;
const legacyK = total - vidN - voiN;
const kindNote = (vidN || voiN) ? ` 其中视频 ${vidN} 通、语音 ${voiN} 通${legacyK ? '（另有 ' + legacyK + ' 通更早的没记类型）' : ''}。` : '';
return `
    <div class="stats-grid">
      <div class="stats-tile"><b>${_statsNum(total)}</b><span>总通话</span></div>
      <div class="stats-tile"><b>${_statsNum(answered)}</b><span>已接通</span></div>
      <div class="stats-tile"><b>${durStr}</b><span>累计时长</span></div>
    </div>
    <p class="stats-note">未接通 ${unconnected} 通。共 ${total} 通：${parts.join('、')}。${kindNote}${legacy ? '另有更早的 ' + legacy + ' 通 · 那时还没记下是谁。' : ''}</p>`;
}
function _statsRankFill(el, rows, libTag, moreNote) {
const maxN = Math.max(1, rows.length ? rows[0][1] : 1);
const totalN = rows.reduce((s, [, n]) => s + n, 0);
const rankTop = 10;
el.innerHTML = rows.map(([k, n], i) => {
const cat = libTag[k];
const w = Math.max(1, Math.round(n / maxN * 100));
const pct = totalN ? Math.round(n / totalN * 100) : 0;
const tag = cat ? `<span class="ck-tag">${escapeHTML(cat)}</span>` : '<span class="ck-tag hist">历史</span>';
const row = `<div class="ck-row"${i < rankTop ? '' : ' hidden'}><span class="ck-rk">${i + 1}</span><div class="ck-head">${tag}<b class="ck-text">${escapeHTML(k)}</b></div><div class="ck-track"><i style="width:${w}%"></i></div><em class="ck-cnt">${n}<i>${pct}%</i></em></div>`;
if (i === rankTop - 1 && rows.length > rankTop) {
return row + `<button type="button" class="stats-more" data-rank-more>展开其余 ${rows.length - rankTop} 张</button>`;
}
return row;
}).join('') + (moreNote || '');
const more = el.querySelector('[data-rank-more]');
if (more) more.onclick = () => {
el.querySelectorAll('.ck-row[hidden]').forEach(r => { r.hidden = false; });
more.remove();
};
}
function buildCardRank(side) {
const el = $('#statsCardRank'); if (!el) return;
const who = side === 'me' ? '我的' : '联系人';
const lib = cardLibIndex();
const freq = {};
for (const m of _statsScopeMsgs()) {
if (!m || m.from !== side) continue;
if (m.sticker) continue;
let frags = [];
if (Array.isArray(m.cardParts) && m.cardParts.length) frags = m.cardParts;
else if (typeof msgLiveText === 'function' ? msgLiveText(m) : m.text) frags = [msgLiveText(m)];
else continue;
for (const f of frags) {
const k = String(f).trim();
if (k) freq[k] = (freq[k] || 0) + 1;
}
}
const rows = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 50);
if (!rows.length) { el.innerHTML = `<div class="stats-empty">「${who}」还没有字卡记录</div>`; return; }
const kinds = Object.keys(freq).length;
_statsRankFill(el, rows, lib, kinds > rows.length ? `<div class="stats-empty">仅显示前 ${rows.length} 张，共 ${kinds} 种</div>` : '');
}
function _tsOf(dateStr, timeStr) {
const t = new Date(`${dateStr || ''} ${timeStr || ''}`).getTime();
return isFinite(t) ? t : 0;
}
function _statsTimelineHTML(tsList) {
const items = [];
const push = (ts, label, detail) => { if (ts) items.push({ ts, label, detail: detail || '' }); };
let firstMsg = 0, totalMsgs = 0;
for (const cid of Object.keys(data.chats || {})) {
const ms = (data.chats[cid] && Array.isArray(data.chats[cid].msgs)) ? data.chats[cid].msgs : [];
totalMsgs += ms.length;
}
(tsList || []).forEach(t => { if (t && (!firstMsg || t < firstMsg)) firstMsg = t; });
if (firstMsg) {
const d = new Date(firstMsg);
push(firstMsg, '第一次对话', `${d.getFullYear()} 年 ${d.getMonth() + 1} 月的一切从这里开始`);
}
let firstCall = null;
for (const c of (data.calls || [])) { const t = _tsOf(c.date, c.time || '00:00:00'); if (t && (!firstCall || t < firstCall.ts)) firstCall = { ts: t, c }; }
if (firstCall) push(firstCall.ts, '第一次通话', (firstCall.c.duration || '00:00') + ' · ' + (firstCall.c.date || ''));
let firstRecv = null, firstSent = null;
for (const m of (data.receivedLetters || [])) {
const t = _tsOf(m.postmark, m.time || '12:00:00');
if (t && (!firstRecv || t < firstRecv.ts)) firstRecv = { ts: t, m };
}
for (const m of (data.sentLetters || [])) {
const t = _tsOf(m.postmark, m.time || '12:00:00');
if (t && (!firstSent || t < firstSent.ts)) firstSent = { ts: t, m };
}
if (firstRecv) push(firstRecv.ts, '收到第一封来信', (firstRecv.m.text || '').slice(0, 24) + '…');
if (firstSent) push(firstSent.ts, '寄出第一封信', (firstSent.m.text || '').slice(0, 24) + '…');
let firstFav = null, firstTaFav = null;
try {
for (const b of collectBooks()) {
for (const f of collectBookAt(b.key)) {
if (!f || !f.ts) continue;
if ((f.by || 'me') === 'ta') { if (!firstTaFav || f.ts < firstTaFav.ts) firstTaFav = f; }
if (!firstFav || f.ts < firstFav.ts) firstFav = f;
}
}
} catch (e) {}
if (firstFav) { const d = new Date(firstFav.ts); push(firstFav.ts, '第一次收藏', `「${(firstFav.text || '').slice(0, 18)}」`); }
if (firstTaFav) { const d = new Date(firstTaFav.ts); push(firstTaFav.ts, partnerName() + ' 第一次收藏你的话', `「${(firstTaFav.text || '').slice(0, 18)}」`); }
let firstNear = null, firstDream = null;
for (const cid of Object.keys((data.cjian || {}).by || {})) {
for (const e of ((data.cjian.by[cid] || {}).hist || [])) {
if (e.k === 'n' && (!firstNear || e.ts < firstNear.ts)) firstNear = e;
if (e.k === 'd' && (!firstDream || e.ts < firstDream.ts)) firstDream = e;
}
}
if (firstNear) push(firstNear.ts, '第一次「好像有什么靠近了」', '');
if (firstDream) push(firstDream.ts, '第一个梦', `「${(firstDream.t || '').slice(0, 18)}」`);
const MSG_MILE = [100, 500, 1000, 2000, 5000];
const reached = MSG_MILE.filter(n => totalMsgs >= n);
for (const a of (data.anniversaries || [])) {
if (!a || !a.date) continue;
let t, detail = a.date;
if (a.yearly) {
const p = a.date.split('-');
const now = new Date();
t = new Date(now.getFullYear(), +p[0] - 1, +p[1]).getTime();
detail = '每年 ' + (+p[0]) + '.' + (+p[1]);
} else {
t = new Date(a.date + 'T00:00:00').getTime();
}
if (t) push(t, '纪念日 · ' + (a.name || '那一天'), detail);
}
items.sort((a, b) => a.ts - b.ts);
const fmt = ts => { const d = new Date(ts); return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`; };
const days = firstMsg ? Math.floor((Date.now() - firstMsg) / 86400000) + 1 : 0;
let html = _statsTrendHTML(tsList || []) + `<div class="tl-head">相伴第 <b>${days}</b> 天 · 说过 <b>${totalMsgs}</b> 句${reached.length ? ' · 已跨过 ' + reached.join('/') + ' 句' : ''}</div>`;
if (!items.length) return html + '<div class="tl-empty">时间线会随着你们的记录慢慢长出来</div>';
html += '<div class="stats-tl">' + items.map(it => `<div class="tl-item"><span class="tl-dot"></span><div class="tl-main"><div class="tl-date">${fmt(it.ts)}</div><div class="tl-label">${it.label}</div>${it.detail ? `<div class="tl-detail">${escapeHTML(it.detail)}</div>` : ''}</div></div>`).join('') + '</div>';
return html;
}
(window.__CHUNK_OK__ = window.__CHUNK_OK__ || {})['stats'] = true;
