// 本件由 tools/assemble.py 生成·勿手改：首屏 JS 分片（进这一页那一刻才取），源＝js/ 那些拆分件
var lsScope = 'all';
var LS_TABS = [
{ k: 'overview', name: '概览' },
{ k: 'cards', name: '字卡' },
{ k: 'months', name: '按月' },
{ k: 'hours', name: '时段' },
{ k: 'types', name: '类型' },
];
var LS_TAB_KEY = 'ordinal-letterstats-tab';
var lsTab = 'overview';
var _lsTabLoaded = false;
function _lsTabLoad() {
if (_lsTabLoaded) return;
_lsTabLoaded = true;
let v = null;
try { v = localStorage.getItem(LS_TAB_KEY); } catch (e) { }
lsTab = LS_TABS.some(x => x.k === v) ? v : 'overview';
}
function _lsTabSet(k) {
if (!LS_TABS.some(x => x.k === k) || k === lsTab) return;
lsTab = k;
try { localStorage.setItem(LS_TAB_KEY, k); } catch (e) { }
}
function _lsRows() {
const out = [];
(data.sentLetters || []).forEach(m => { if (m) out.push({ m, sent: true, cid: m.cid || mainChatId() }); });
(data.receivedLetters || []).forEach(m => { if (m) out.push({ m, sent: false, cid: m.cid || mainChatId() }); });
return lsScope === 'all' ? out : out.filter(r => r.cid === lsScope);
}
function _lsTs(m) {
const p = _mbParsePostmark(m && m.postmark);
if (!p) return 0;
const t = /(\d{1,2}):(\d{2})/.exec((m && m.time) || '');
return new Date(p.y, p.m - 1, p.d, t ? +t[1] : 0, t ? +t[2] : 0).getTime() || 0;
}
function _lsCards(rows) {
const freq = {}, catCnt = {}, libTag = {};
const cache = {};
let hits = 0, miss = 0, taLetters = 0, perN = 0, perSum = 0, perMax = 0;
rows.filter(r => !r.sent).forEach(r => {
const segs = cardSegs(r.m.text || '');
if (!segs.length) return;
taLetters++;
const key = lsScope === 'all' ? '' : r.cid;
if (!cache[key]) cache[key] = cardLibIndex(key || undefined);
const lib = cache[key];
let n = 0;
segs.forEach(s => {
const cat = lib[s];
if (cat === undefined) { miss++; return; }
if (libTag[s] === undefined) libTag[s] = cat;
freq[s] = (freq[s] || 0) + 1;
catCnt[cat] = (catCnt[cat] || 0) + 1;
hits++; n++;
});
perN++; perSum += n; if (n > perMax) perMax = n;
});
return { freq, catCnt, libTag, hits, miss, taLetters, kinds: Object.keys(freq).length, perN, perSum, perMax };
}
function _lsBarRow(label, n, max, total) {
const w = n ? Math.round(n / Math.max(1, max) * 100) : 0;
const pct = total ? Math.round(n / total * 100) : 0;
return `<div class="stats-bar-row"><span class="stats-bar-label">${escapeHTML(label)}</span><div class="stats-bar-track"><i style="width:${w}%"></i></div><b>${n}<em>${pct}%</em></b></div>`;
}
function renderLetterStats() {
const el = $('#lsOutput'); if (!el) return;
const rows = _lsRows();
const sent = rows.filter(r => r.sent), recv = rows.filter(r => !r.sent);
const card = _lsCards(rows);
const wordsOf = list => list.reduce((s, r) => s + String(r.m.text || '').length, 0);
const sentWords = wordsOf(sent), recvWords = wordsOf(recv);
const perAvg = card.perN ? (Math.round(card.perSum / card.perN * 10) / 10) : 0;
const days = new Set(), hourCnt = new Array(24).fill(0), tsList = [];
let first = 0, last = 0;
rows.forEach(r => {
const ts = _lsTs(r.m);
if (ts) {
days.add(new Date(ts).toLocaleDateString('zh-CN'));
tsList.push(ts);
if (!first || ts < first) first = ts;
if (ts > last) last = ts;
const hm = /(\d{1,2}):(\d{2})/.exec(r.m.time || '');
if (hm) { const h = +hm[1]; if (h >= 0 && h <= 23) hourCnt[h]++; }
}
});
const fmt = ts => { if (!ts) return '—'; const d = new Date(ts); return d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate(); };
const dayCnt = [];
for (let i = 6; i >= 0; i--) {
const d = new Date(); d.setDate(d.getDate() - i);
const key = d.toLocaleDateString('zh-CN');
let n = 0; rows.forEach(r => { const ts = _lsTs(r.m); if (ts && new Date(ts).toLocaleDateString('zh-CN') === key) n++; });
dayCnt.push({ label: (d.getMonth() + 1) + '/' + d.getDate(), n });
}
const hourMax = Math.max(...hourCnt);
const peakHour = hourCnt.findIndex(v => hourMax > 0 && v === hourMax);
const hourBars = _statsBarsHTML(hourCnt, {
labels: ['0', '6', '12', '18', '24'],
tip: (v, i) => i + ':00 共 ' + v + ' 封',
peak: '最热闹的是 ' + peakHour + ' 点 · 写了 ' + hourCnt[peakHour] + ' 封'
});
const weekMax = Math.max(...dayCnt.map(x => x.n));
const peakDay = dayCnt.find(x => weekMax > 0 && x.n === weekMax);
const weekBars = _statsBarsHTML(dayCnt.map(x => x.n), {
sm: true,
labels: dayCnt.map(x => x.label),
tip: (v, i) => dayCnt[i].label + ' 写了 ' + v + ' 封',
peak: '这七天里 ' + (peakDay ? peakDay.label : '') + ' 写得最多 · ' + (peakDay ? peakDay.n : 0) + ' 封'
});
const mo = _statsMonthCells(tsList);
const moLabelsAll = mo.cells.map(c => _statsMonthLabel(c, mo.cur));
const moLabels = moLabelsAll.length > 8
? [moLabelsAll[0], moLabelsAll[Math.floor((moLabelsAll.length - 1) / 2)], moLabelsAll[moLabelsAll.length - 1]]
: moLabelsAll;
const moMax = Math.max(0, ...mo.cells.map(c => c.n));
const moPeak = mo.cells.find(c => moMax > 0 && c.n === moMax);
const monthBars = tsList.length
? _statsBarsHTML(mo.cells.map(c => c.n), {
sm: true,
labels: moLabels,
tip: (v, i) => _statsMonthLabel(mo.cells[i], mo.cur) + ' 写了 ' + v + ' 封',
peak: '写得最多的是 ' + (moPeak ? _statsMonthLabel(moPeak, mo.cur) : '') + ' · ' + (moPeak ? moPeak.n : 0) + ' 封'
+ (mo.cut ? '（更早的 ' + mo.cut + ' 个月没有显示在这里）' : '')
})
: `<p class="stats-note">${rows.length ? '这些信的邮戳拆不出年月日（旧档那种只写「9/28」的），按月这一节量不出来。' : '还没有信，按月这一节没有东西可画。'}</p>`;
const kindCnt = {
'TA 主动写的': recv.filter(r => (r.m.kind || 'proactive') !== 'reply').length,
'TA 回你的': recv.filter(r => r.m.kind === 'reply').length,
'你寄出的': sent.length,
'夹了图的': rows.filter(r => !!r.m.img).length
};
const kindMax = Math.max(1, ...Object.values(kindCnt));
const kindBars = Object.keys(kindCnt).map(k => _lsBarRow(k, kindCnt[k], kindMax, sent.length + recv.length)).join('');
const catKeys = Object.keys(card.catCnt).sort((a, b) => card.catCnt[b] - card.catCnt[a]);
const catMax = Math.max(1, ...catKeys.map(k => card.catCnt[k]));
const catBars = catKeys.length
? catKeys.map(k => _lsBarRow(k, card.catCnt[k], catMax, card.hits)).join('')
: '<div class="stats-empty">TA 的信里还没比到库里的字卡</div>';
const rankRows = Object.entries(card.freq).sort((a, b) => b[1] - a[1]).slice(0, 50);
_lsTabLoad();
const panels = {
overview: `<div class="stats-sec">
      <div class="stats-lines">
        <div><span>TA 的信共</span><b>${_statsNum(recvWords)} 字</b></div>
        <div><span>你写的信共</span><b>${_statsNum(sentWords)} 字</b></div>
        <div><span>写信天数</span><b>${days.size} 天</b></div>
        <div><span>最早一封</span><b>${fmt(first)}</b></div>
        <div><span>最近一封</span><b>${fmt(last)}</b></div>
      </div>
    </div>`,
cards: `<div class="stats-sec">
      <div class="stats-hour-label">用了多少张卡</div>
      <div class="stats-lines">
        <div><span>用掉字卡</span><b>${_statsNum(card.hits)} 张</b></div>
        <div><span>TA 一封平均几张</span><b>${perAvg} 张</b></div>
        <div><span>一封最多几张</span><b>${card.perMax} 张</b></div>
        <div><span>出现过的卡</span><b>${card.kinds} 种 · ${catKeys.length} 类</b></div>
      </div>
      <div class="stats-hour-label">哪几句被抽到最多</div>
      <div id="lsRank"></div>
      <p class="stats-note">「用掉字卡」是把 TA 信里的句子和你现在的字卡库比对出来的，另有 ${card.miss} 段没比对上——你删过或改过的句子、以及绑给别人的专属卡，都算在这一段里）。你寄出去的是你自己打的字，不算进抽卡这一格。</p>
    </div>`,
months: `<div class="stats-sec">${monthBars}</div>`,
hours: `<div class="stats-sec"><div class="stats-hour-label">一天里哪几个钟头写得最多</div>${hourBars}<div class="stats-hour-label">近 7 天每天封数</div>${weekBars}</div>`,
types: `<div class="stats-sec">
      <div class="stats-hour-label">信是哪一类</div>
      <div class="stats-bars">${kindBars}</div>
      <div class="stats-hour-label">信里的卡是哪一类</div>
      <div class="stats-bars">${catBars}</div>
      <p class="stats-note">「夹了图」是同一批信里的另一件事（一封主动信也可能夹着图），所以这一行的百分比不按封数归一。</p>
    </div>`,
};
el.innerHTML = `
    <div class="stats-scope" id="lsScope"></div>
    <div class="stats-grid">
      <div class="stats-tile"><b>${_statsNum(recv.length)}</b><span>收到的信</span></div>
      <div class="stats-tile"><b>${_statsNum(sent.length)}</b><span>寄出的信</span></div>
      <div class="stats-tile"><b>${_statsNum(sentWords + recvWords)}</b><span>总字数</span></div>
    </div>
    <div class="stats-tabs" id="lsTabs">${LS_TABS.map(t => `<button type="button" class="stats-tab${lsTab === t.k ? ' active' : ''}" data-ls-tab="${t.k}">${t.name}</button>`).join('')}</div>
    <div class="stats-panel" data-tab="${lsTab}">${panels[lsTab]}</div>
  `;
const tabsEl = $('#lsTabs');
if (tabsEl) tabsEl.onclick = e => {
const b = e.target.closest('.stats-tab'); if (!b) return;
_lsTabSet(b.dataset.lsTab);
renderLetterStats();
};
const scopeEl = el.querySelector('#lsScope');
if (scopeEl) {
const chips = [{ id: 'all', label: '全部' }].concat((data.contacts || []).map(c => ({ id: c.id, label: fixedNameOf(c) })));
scopeEl.innerHTML = chips.map(c => `<button type="button" class="scope-chip${lsScope === c.id ? ' on' : ''}" data-scope="${escapeHTML(c.id)}">${escapeHTML(c.label)}</button>`).join('');
scopeEl.onclick = e => {
const b = e.target.closest('.scope-chip'); if (!b) return;
lsScope = b.dataset.scope;
renderLetterStats();
};
}
const rankEl = $('#lsRank');
if (rankEl) {
if (!rankRows.length) {
rankEl.innerHTML = '<div class="stats-empty">TA 还没有写信，或信里的句子都没比到库里的卡</div>';
} else {
_statsRankFill(rankEl, rankRows, card.libTag,
card.kinds > rankRows.length ? `<div class="stats-empty">仅显示前 ${rankRows.length} 张，共 ${card.kinds} 种</div>` : '');
}
}
}
(window.__CHUNK_OK__ = window.__CHUNK_OK__ || {})['lstats'] = true;
