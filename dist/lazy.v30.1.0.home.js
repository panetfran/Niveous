// 本件由 tools/assemble.py 生成·勿手改：首屏 JS 分片（进这一页那一刻才取），源＝js/ 那些拆分件
var HM_SCENES = {
free:    '窗户开着，屋里亮堂，什么都是慢慢来的样子。',
busy:    '桌上那盏台灯亮着，TA 在忙手头的事。',
rushed:  '屋子里的动静有点急，脚步声一趟一趟的。',
rest:    '灯暗了一半，TA 在里屋歇着。',
sleep:   '灯全灭了，门虚掩着，屋里只剩钟走的声音。',
unknown: '屋里静悄悄的，看不出动静。'
};
var HM_ART_ATTR = 'viewBox="0 0 240 120" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
var HM_WIN_FRAME = '<rect class="hm-win-pane" x="16" y="10" width="208" height="84" rx="4"/>'
+ '<circle class="hm-sky-sun" cx="186" cy="34" r="9"/>'
+ '<path class="hm-sky-moon" d="M190 24a12 12 0 1 0 9 20 14 14 0 0 1-9-20z"/>'
+ '<path class="hm-sky-cloud" d="M42 44c0-5 4-9 9-8 2-4 9-5 12-1 5-1 9 2 9 6 0 3-2 5-6 5H46c-3 0-4-2-4-2z"/>'
+ '<path class="hm-sky-hill" d="M16 94c20-24 40-28 62-12 16-18 40-20 62-6 20-14 46-12 70 4v14H16z"/>'
+ '<rect class="hm-sill" x="5" y="94" width="230" height="8" rx="2"/>'
+ '<path d="M120 10v84M16 52h208" stroke="#a8845f" stroke-width="5"/>'
+ '<rect x="16" y="10" width="208" height="84" rx="4" fill="none" stroke="#8a6a4a" stroke-width="6"/>';
var HM_SCENE_SVG = {
free:    '<svg ' + HM_ART_ATTR + '>' + HM_WIN_FRAME + '<path d="M176 96v-10" stroke="#5d8a52" stroke-width="2"/><path d="M176 88c-8-2-12-8-12-14 7 0 11 5 12 11z" fill="#7ea86f" stroke="none"/><path d="M176 84c7-2 10-7 10-13-6 0-9 5-10 10z" fill="#5d8a52" stroke="none"/><path d="M168 96h17l-2-9h-13z" fill="#c98d6b" stroke="none"/></svg>',
busy:    '<svg ' + HM_ART_ATTR + '>' + HM_WIN_FRAME + '<rect x="34" y="78" width="78" height="6" rx="2" fill="#a8845f" stroke="none"/><rect x="40" y="84" width="5" height="12" fill="#8a6a4a" stroke="none"/><rect x="100" y="84" width="5" height="12" fill="#8a6a4a" stroke="none"/><rect x="46" y="70" width="15" height="8" rx="1" fill="#f2ede2" stroke="#c9bfa8" stroke-width="1"/><path d="M104 78h-17l4-13h9z" fill="#f0c87e" stroke="none"/><rect x="92" y="78" width="4" height="5" fill="#8a6a4a" stroke="none"/></svg>',
rushed:  '<svg ' + HM_ART_ATTR + '>' + HM_WIN_FRAME + '<circle cx="96" cy="38" r="14" fill="#f2ede2" stroke="#8a6a4a" stroke-width="3"/><path d="M96 38V28M96 38l7 5" stroke="#5a4a3a" stroke-width="2"/><circle cx="96" cy="38" r="1.5" fill="#5a4a3a" stroke="none"/></svg>',
rest:    '<svg ' + HM_ART_ATTR + '>' + HM_WIN_FRAME + '<rect x="150" y="56" width="8" height="38" fill="#8a6a4a" stroke="none"/><rect x="204" y="70" width="8" height="24" fill="#8a6a4a" stroke="none"/><rect x="150" y="68" width="62" height="8" rx="2" fill="#a8845f" stroke="none"/><rect x="156" y="58" width="24" height="12" rx="3" fill="#9fb4c2" stroke="none"/><path d="M162 56c9-2 15 0 17 7l-19 4z" fill="#d8b8a8" stroke="none"/></svg>',
sleep:   '<svg ' + HM_ART_ATTR + '>' + HM_WIN_FRAME + '<rect x="146" y="58" width="8" height="36" fill="#8a6a4a" stroke="none"/><rect x="206" y="72" width="8" height="22" fill="#8a6a4a" stroke="none"/><rect x="146" y="70" width="68" height="10" rx="2" fill="#a8845f" stroke="none"/><rect x="152" y="60" width="24" height="11" rx="3" fill="#f2ede2" stroke="none"/><rect x="150" y="56" width="62" height="16" rx="3" fill="#9fb4c2" stroke="none"/></svg>',
unknown: '<svg ' + HM_ART_ATTR + '>' + HM_WIN_FRAME + '<path d="M120 10v16" stroke="#8a6a4a" stroke-width="2"/><path d="M106 26h28l-7 12h-14z" fill="#9fb4c2" stroke="none"/></svg>',
away:    '<svg ' + HM_ART_ATTR + '>' + HM_WIN_FRAME + '<circle cx="176" cy="82" r="5" stroke="#c9a06b" stroke-width="2.5"/><path d="M181 82h13M189 82v5" stroke="#c9a06b" stroke-width="2.5"/></svg>'
};
var HM_HELLOS = {
wee:       ['TA 那边还是凌晨，屋里静得很。', 'TA 那边的夜还长着，脚步放轻一点。', '凌晨了，窗外的黑还没退。', '这个点屋里最安静，连钟声都轻。', 'TA 那边正是夜里最沉的时候。'],
dawn:      ['TA 那边天刚亮，屋里泛着一点白。', '清晨的光斜进屋里，TA 该起了。', '天边刚亮，屋里还留着夜的凉。', '一早的屋子，窗子还没全打开。', 'TA 那边的早晨，安安静静的。'],
morning:   ['TA 那边是上午，屋里亮堂。', '上午的屋子，什么都慢慢来。', '日头升起来了，屋里一片亮。', '上午的光正好，落在桌角。', 'TA 那边的上午，事情一件件来。'],
noon:      ['TA 那边的午后，屋里有点暖。', '午后阳光正好，屋里安静。', '日头偏了一点，屋里暖起来。', '这个点屋里最容易犯困。', 'TA 那边的午后，慢得很。'],
afternoon: ['TA 那边是下午，屋里一切照旧。', '下午的屋子，光线正好。', '日头往西挪了，屋里还是静的。', '下午了，桌边的影子长了一截。', 'TA 那边的下午，不紧不慢。'],
evening:   ['TA 那边天擦黑，屋里点着灯。', '傍晚了，屋子慢慢暗下来。', '天色沉下去，屋里先亮了一盏。', '傍晚的风从窗缝里进来。', 'TA 那边的傍晚，灯刚点上。'],
night:     ['TA 那边是夜里，屋里亮着一盏灯。', '夜里的屋子，灯还亮着。', '天全黑了，屋里留着一圈光。', '夜里了，屋里比外面暖。', 'TA 那边的夜，慢慢静下来。']
};
var HM_HELLOS_BACK = {
wee:       ['又回来了。屋里还黑着，轻一点。'],
dawn:      ['又回来了。天刚亮，屋里还凉。'],
morning:   ['又回来了。上午的屋子，还是老样子。'],
noon:      ['又回来了。午后屋里暖着，坐一会儿吧。'],
afternoon: ['又回来了。下午的光还在，屋里没变。'],
evening:   ['又回来了。灯还亮着，屋里等你。'],
night:     ['又回来了。夜里的灯没灭。']
};
var HM_SKINS = [
{ k: '',       n: '素白', wall: '#f5f5f6', tone: '',        glow: 0,  props: ['shelf', 'books'] },
{ k: 'wood',   n: '木屋', wall: '#f2e9dc', tone: '#8a6d5b', glow: 10, props: ['shelf', 'plant'] },
{ k: 'lamp',   n: '夜灯', wall: '#f7ecdf', tone: '#a06d84', glow: 20, props: ['lamp', 'books'] },
{ k: 'rain',   n: '雨天', wall: '#e9eef3', tone: '#5e7d8c', glow: 4,  props: ['umbrella', 'rug'] },
{ k: 'winter', n: '冬日', wall: '#f3f4f7', tone: '#7a6ba0', glow: 6,  props: ['shelf', 'rug'] },
{ k: 'fest',   n: '节日', wall: '#f8eee6', tone: '#a06d84', glow: 16, props: ['cat', 'lamp'] }
];
var HM_PROPS = {
shelf:    { n: '书架', svg: '<svg viewBox="0 0 72 104"><rect x="8" y="8" width="56" height="90" rx="3" fill="#dcc9a8"/><rect x="13" y="16" width="7" height="16" fill="#b57373"/><rect x="21" y="14" width="6" height="18" fill="#8fa5b8"/><rect x="28" y="17" width="7" height="15" fill="#a8b88a"/><rect x="36" y="15" width="6" height="17" fill="#c9a06b"/><rect x="43" y="16" width="7" height="16" fill="#9b8bb0"/><circle cx="56" cy="26" r="4" fill="#9fb4c2"/><rect x="8" y="34" width="56" height="4" fill="#a8845f"/><rect x="13" y="44" width="7" height="16" fill="#a8b88a"/><rect x="21" y="42" width="6" height="18" fill="#c9a06b"/><rect x="28" y="45" width="7" height="15" fill="#b57373"/><rect x="36" y="43" width="6" height="17" fill="#8fa5b8"/><rect x="47" y="44" width="9" height="16" fill="#f2ede2"/><rect x="8" y="60" width="56" height="4" fill="#a8845f"/><rect x="13" y="70" width="7" height="16" fill="#9b8bb0"/><rect x="21" y="68" width="6" height="18" fill="#c9a06b"/><rect x="28" y="71" width="7" height="15" fill="#8fa5b8"/><rect x="36" y="69" width="6" height="17" fill="#b57373"/><rect x="43" y="70" width="7" height="16" fill="#a8b88a"/><rect x="8" y="8" width="56" height="90" rx="3" fill="none" stroke="#8a6a4a" stroke-width="4"/></svg>' },
plant:    { n: '落地绿植', svg: '<svg viewBox="0 0 72 104"><path d="M36 74V40" stroke="#5d8a52" stroke-width="2.5" fill="none"/><path d="M36 60c-11-3-16-11-16-20 10 1 15 9 16 16z" fill="#7ea86f"/><path d="M36 52c10-3 15-11 15-19-9 1-14 8-15 15z" fill="#5d8a52"/><path d="M36 44c-7-2-10-8-10-13 6 1 9 6 10 10z" fill="#8fbf83"/><path d="M24 96h24l-4-24H28z" fill="#c98d6b"/><rect x="22" y="94" width="28" height="5" rx="2" fill="#b0714f"/><rect x="26" y="70" width="20" height="4" fill="#b0714f"/></svg>' },
cat:      { n: '猫', svg: '<svg viewBox="0 0 72 104"><path d="M50 86c9-3 13-9 13-17" stroke="#c98d5a" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M20 90c0-20 7-36 16-36s16 16 16 36z" fill="#d9a066"/><path d="M27 46l5 10-10 2z" fill="#d9a066"/><path d="M45 46l-5 10 10 2z" fill="#d9a066"/><path d="M28 49l3 6-7 1z" fill="#e8b8a8"/><path d="M44 49l-3 6 7 1z" fill="#e8b8a8"/><circle cx="36" cy="60" r="16" fill="#d9a066"/><ellipse cx="36" cy="69" rx="9" ry="7" fill="#f4ecdd"/><circle cx="30" cy="57" r="2" fill="#3a3228"/><circle cx="42" cy="57" r="2" fill="#3a3228"/><path d="M34 63h4l-2 3z" fill="#c47a6e"/><rect x="17" y="88" width="38" height="4" rx="2" fill="#b0714f"/></svg>' },
rug:      { n: '地毯', svg: '<svg viewBox="0 0 72 104"><ellipse cx="36" cy="78" rx="31" ry="15" fill="#b57373"/><ellipse cx="36" cy="78" rx="23" ry="10" fill="#d8b8a8"/><path d="M24 78h24M36 70v16" stroke="#b57373" stroke-width="2"/><path d="M4 78l-3 1M9 85l-2 3M63 85l2 3M68 78l3 1" stroke="#e8dcc8" stroke-width="2" stroke-linecap="round"/></svg>' },
lamp:     { n: '落地灯', svg: '<svg viewBox="0 0 72 104"><circle cx="36" cy="38" r="17" fill="#f0c87e" opacity=".2"/><path d="M20 44h32l-8-22H28z" fill="#f0c87e"/><rect x="19" y="42" width="34" height="3" rx="1.5" fill="#c9a06b"/><path d="M36 45v48" stroke="#8a6a4a" stroke-width="4"/><ellipse cx="36" cy="95" rx="15" ry="4" fill="#8a6a4a"/></svg>' },
books:    { n: '书堆', svg: '<svg viewBox="0 0 72 104"><rect x="14" y="82" width="44" height="11" rx="2" fill="#b57373"/><rect x="14" y="82" width="44" height="3" fill="#d8a5a5"/><rect x="18" y="72" width="38" height="10" rx="2" fill="#8fa5b8"/><rect x="18" y="72" width="38" height="3" fill="#b8c8d4"/><path d="M22 62l34-5 2 10-34 5z" fill="#a8b88a"/><rect x="23" y="61" width="34" height="3" fill="#c8d4bc"/></svg>' },
umbrella: { n: '伞', svg: '<svg viewBox="0 0 72 104"><path d="M8 42C15 26 25 18 36 18s21 8 28 24c-5-4-10-4-14 0-4-4-9-4-14 0-4-4-9-4-14 0-4-4-9-4-14 0z" fill="#c47a6e"/><path d="M36 18v-7" stroke="#8a6a4a" stroke-width="3" stroke-linecap="round"/><path d="M36 42v42c0 7 9 7 9 0" stroke="#8a6a4a" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M22 41c0-3 2-6 5-8M50 41c0-3-2-6-5-8" stroke="#b56b60" stroke-width="2" fill="none"/></svg>' },
vase:     { n: '瓶花', svg: '<svg viewBox="0 0 72 104"><path d="M36 62V40" stroke="#5d8a52" stroke-width="2" fill="none"/><path d="M36 50c-8-2-12-8-12-14 7 1 11 6 12 10z" fill="#7ea86f"/><circle cx="36" cy="34" r="6" fill="#d98a8a"/><circle cx="30" cy="30" r="4.5" fill="#c9a06b"/><circle cx="42" cy="30" r="4.5" fill="#9b8bb0"/><path d="M28 92h16l-3-26h-10z" fill="#9fb4c2"/><rect x="26" y="92" width="20" height="4" rx="2" fill="#7d92a2"/></svg>' },
doormat:  { n: '门垫', svg: '<svg viewBox="0 0 72 104"><rect x="8" y="76" width="56" height="18" rx="4" fill="#a8845f"/><rect x="12" y="80" width="48" height="10" rx="2" fill="none" stroke="#8a6a4a" stroke-width="1.5"/><path d="M18 85h36" stroke="#8a6a4a" stroke-width="2" stroke-dasharray="4 3"/></svg>' }
};
var HM_SEASON_DECOR = {
spring: { n: '春天', svg: '<svg viewBox="0 0 40 40"><path d="M7 35c9 0 15-7 19-15"/><path d="M17 27c-3-1-5-3-5-6 3 0 4 2 5 4"/><path d="M23 21c3-1 5-3 5-6-3 0-4 2-5 4"/><circle cx="13" cy="17" r="2.2"/><circle cx="27" cy="12" r="2.2"/></svg>' },
summer: { n: '夏天', svg: '<svg viewBox="0 0 40 40"><path d="M13 31l13-17"/><path d="M22 34a11 11 0 0 0 9-15l-2-3-7 18z"/></svg>' },
autumn: { n: '秋天', svg: '<svg viewBox="0 0 40 40"><path d="M20 34V13"/><path d="M20 19c-6-2-9-6-9-11 5 0 8 4 9 8"/><path d="M20 24c6-3 8-7 8-12-4 1-7 5-8 9"/></svg>' },
winter: { n: '冬天', svg: '<svg viewBox="0 0 40 40"><path d="M20 7v26M9 13l22 14M31 13L9 27"/><path d="M17 9l3 3 3-3M17 31l3-3 3 3"/></svg>' }
};
var HM_ACT_OBJ = {
free:    { n: '桌上摊着一本书', svg: '<svg viewBox="0 0 40 40"><path d="M9 24h22v9H9z"/><path d="M20 24v9"/><path d="M12 19h16v5H12z"/></svg>' },
busy:    { n: '桌上一杯水', svg: '<svg viewBox="0 0 40 40"><path d="M13 20h11v11H13z"/><path d="M24 22h3a3 3 0 0 1 0 6h-3"/><path d="M16 13c0-2 2-2 2-4M21 13c0-2 2-2 2-4"/></svg>' },
rushed:  { n: '几张纸散着', svg: '<svg viewBox="0 0 40 40"><path d="M9 13h22M9 19h17M9 25h22M9 31h13"/></svg>' },
rest:    { n: '一条毯子搭着', svg: '<svg viewBox="0 0 40 40"><path d="M8 20c6-4 18-4 24 0v10c-6 3-18 3-24 0z"/><path d="M13 22c4 2 10 2 14 0"/></svg>' },
sleep:   { n: '毯子铺好了', svg: '<svg viewBox="0 0 40 40"><path d="M8 22c6-4 18-4 24 0v10c-6 3-18 3-24 0z"/><path d="M30 9a5 5 0 1 0 3 8 6 6 0 0 1-3-8z"/></svg>' },
unknown: { n: '灯没开', svg: '<svg viewBox="0 0 40 40"><path d="M20 7v7"/><path d="M14 14h12l-3 9h-6z"/><path d="M11 34h18"/></svg>' },
away:    { n: '椅子空着', svg: '<svg viewBox="0 0 40 40"><path d="M12 17v16M28 17v16M12 24h16M12 17h16"/></svg>' }
};
var HM_KNOCK_LINES = [
'门开了一条缝，TA 探出头来。',
'门开了。TA 站在门里，像是刚听见。',
'TA 来开门了，屋里透出一点光。',
'门响了一下，TA 在里面应了一声。',
'TA 把门拉开，没说话，侧身让你进。',
'门后传来脚步声，TA 到了门口。'
];
var HM_NOTE_LINES = [
'门口那张纸条我看见了。',
'纸条收下了。',
'你塞的那张，我读过了。',
'门缝里那张纸，我捡起来了。'
];
var HM_WATER_LINES = [
'花喝饱了，叶子精神了一点。',
'浇过了，土是湿的。',
'这盆花又长高了一点。'
];
var _hmVisit = null;
function _hmCid() { const c = currentContact(); return (c && c.kind !== 'group') ? c.id : ''; }
function _hmContact() { const c = currentContact(); return (c && c.kind !== 'group') ? c : null; }
function homeOf(cid) {
return (data.home && data.home[cid] && typeof data.home[cid] === 'object' && !Array.isArray(data.home[cid])) ? data.home[cid] : null;
}
function _hmLookDefault() {
return {
bg: '', bgLuma: null, tone: '', glow: 0, skin: '', stkOn: true, dz: null, dzDay: '',
props: null,
photos: [],
photoFrame: '',
photoNote: '',
lampOn: true,
winOpen: false,
plant: { n: 0, day: '', at: 0, nm: '', born: '', kind: '' },
propTone: '',
card: null
};
}
function _hmEnsure(cid) {
if (!data.home || typeof data.home !== 'object') data.home = {};
let o = data.home[cid];
if (!o || typeof o !== 'object' || Array.isArray(o)) { o = { look: _hmLookDefault(), notes: [] }; data.home[cid] = o; }
if (!o.look || typeof o.look !== 'object' || Array.isArray(o.look)) o.look = _hmLookDefault();
const d = _hmLookDefault();
for (const k of Object.keys(d)) if (!(k in o.look)) o.look[k] = d[k];
if (!Array.isArray(o.notes)) o.notes = [];
return o;
}
function _hmApplyLook() {
const view = document.getElementById('hmView');
if (!view) return;
const o = homeOf(_hmCid());
const look = (o && o.look) || {};
if (look.bg) {
view.style.setProperty('--hm-bg', 'url("' + look.bg + '")');
const l = (typeof look.bgLuma === 'number' && isFinite(look.bgLuma)) ? look.bgLuma : null;
const a = l === null ? 0.55 : (l <= 0.28 ? 0.72 : (l >= 0.72 ? 0.42 : 0.55));
view.style.setProperty('--hm-veils', 'linear-gradient(rgba(255,255,255,' + a + '),rgba(255,255,255,' + Math.max(0.35, a - 0.12) + '))');
} else {
view.style.removeProperty('--hm-bg');
view.style.removeProperty('--hm-veils');
}
if (look.tone && /^#[0-9a-fA-F]{6}$/.test(look.tone)) view.style.setProperty('--hm-accent', look.tone);
else view.style.removeProperty('--hm-accent');
const glow = (typeof look.glow === 'number' && isFinite(look.glow)) ? Math.min(30, Math.max(0, look.glow)) : 0;
if (glow > 0) view.style.setProperty('--hm-glow-a', String(glow / 30));
else view.style.removeProperty('--hm-glow-a');
const skin = (typeof look.skin === 'string') ? look.skin : '';
const sk = skin ? HM_SKINS.find(x => x.k === skin) : null;
if (skin && sk) {
view.setAttribute('data-hm-skin', skin);
view.style.setProperty('--hm-room', sk.wall);
} else {
view.removeAttribute('data-hm-skin');
view.style.removeProperty('--hm-room');
}
if (look.lampOn === false) view.setAttribute('data-hm-lamp', 'off');
else view.removeAttribute('data-hm-lamp');
if (look.winOpen === true) view.setAttribute('data-hm-win', 'open');
else view.removeAttribute('data-hm-win');
}
function _hmWorldClock(en) {
if (!en) return '';
if ((!en.world || !en.world.last) && typeof _cjRollWorld === 'function') en.world = _cjRollWorld(en, Date.now());
if (!en.world) return '';
return _cjPad(en.world.hh) + ':' + _cjPad(en.world.mm);
}
function _hmNightAttr(en) {
const view = document.getElementById('hmView');
if (!view || !en || !en.world) { if (view) view.removeAttribute('data-hm-night'); return; }
const hh = en.world.hh;
if (hh >= 22 || hh < 6) view.setAttribute('data-hm-night', '1');
else view.removeAttribute('data-hm-night');
}
function _hmWxAttr(cid) {
const view = document.getElementById('hmView');
if (!view) return;
let k = '';
if (cid && typeof cjSkyFor === 'function') {
try { const s = cjSkyFor(cid); k = (s && s.weather) ? String(s.weather) : ''; } catch (e) {}
}
const prev = view.getAttribute('data-hm-wx') || '';
if (k) view.setAttribute('data-hm-wx', k);
else view.removeAttribute('data-hm-wx');
if (k !== prev) {
const wx = view.querySelector('.hm-wx');
if (wx) { wx.style.opacity = '0'; void wx.offsetWidth; wx.style.opacity = '1'; }
}
}
function _hmAnnToday(cid) {
if (!cid || typeof annMainFor !== 'function') return null;
let a = null;
try { a = annMainFor(cid); } catch (e) { return null; }
if (!a || !a.date) return null;
const p = String(a.date).split('-');
if (p.length < 2) return null;
const mo = +p[p.length - 2], d = +p[p.length - 1];
if (!(mo >= 1 && mo <= 12 && d >= 1 && d <= 31)) return null;
const now = new Date();
return (now.getMonth() + 1 === mo && now.getDate() === d) ? a : null;
}
function _hmAnnAttr(cid) {
const view = document.getElementById('hmView');
if (!view) return;
if (_hmAnnToday(cid)) view.setAttribute('data-hm-ann', '1');
else view.removeAttribute('data-hm-ann');
}
function _hmAnnPaint(cid) {
const el = document.getElementById('hmAnnTop');
if (!el) return;
const a = _hmAnnToday(cid);
if (a) { el.textContent = '今天 · ' + (a.name || '纪念日'); el.hidden = false; }
else { el.textContent = ''; el.hidden = true; }
}
function _hmPageAttrs(en, cid) {
_hmNightAttr(en);
_hmWxAttr(cid);
_hmAnnAttr(cid);
_hmAnnPaint(cid);
const view = document.getElementById('hmView');
if (view) view.setAttribute('data-hm-season', _hmSeason());
if (view) {
let tp = '';
try { if (en && typeof _cjTimePartOf === 'function') tp = _cjTimePartOf(en) || ''; } catch (e) {}
if (tp) view.setAttribute('data-hm-tp', tp);
else view.removeAttribute('data-hm-tp');
}
if (view) {
if (typeof _cjHiding === 'function' && _cjHiding(en)) view.setAttribute('data-hm-away', '1');
else view.removeAttribute('data-hm-away');
}
}
function _hmVisitBump(cid) {
const dk = (typeof dressDayKey === 'function') ? dressDayKey() : new Date().toLocaleDateString('zh-CN');
const key = cid + '|' + dk;
if (!_hmVisit || _hmVisit.key !== key) _hmVisit = { key: key, n: 0 };
_hmVisit.n++;
return _hmVisit.n;
}
function _hmHelloOf(cid, en, n) {
let tp = '';
if (en && typeof _cjTimePartOf === 'function') tp = _cjTimePartOf(en) || '';
const back = (typeof n === 'number' && n >= 2 && HM_HELLOS_BACK[tp]) ? HM_HELLOS_BACK[tp] : null;
const pool = back || HM_HELLOS[tp] || HM_HELLOS.morning;
const dk = (typeof dressDayKey === 'function') ? dressDayKey() : new Date().toLocaleDateString('zh-CN');
let h = 0; const s = cid + '|' + dk + '|' + tp + (back ? '|b' : '|a');
for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
return pool[h % pool.length];
}
function _hmLookOf(cid) { const o = homeOf(cid); return (o && o.look && typeof o.look === 'object') ? o.look : null; }
function _hmToday() { return (typeof dressDayKey === 'function') ? dressDayKey() : new Date().toLocaleDateString('zh-CN'); }
function _hmSeason() {
const m = new Date().getMonth() + 1;
if (m >= 3 && m <= 5) return 'spring';
if (m >= 6 && m <= 8) return 'summer';
if (m >= 9 && m <= 11) return 'autumn';
return 'winter';
}
var HM_FEST_DECOR = [
{ md: '01-01', n: '元旦', svg: '<svg viewBox="0 0 40 40"><path d="M6 11c9 3 19 3 28 0"/><path d="M10 12l2 6 3-5M18 13l1 6 3-5M26 13l-1 6 3-5"/></svg>' },
{ md: '02-14', n: '情人节', svg: '<svg viewBox="0 0 40 40"><path d="M20 32C12 26 8 21 8 16c0-4 3-6 6-6 3 0 5 2 6 4 1-2 3-4 6-4 3 0 6 2 6 6 0 5-4 10-12 16z"/></svg>' },
{ md: '06-01', n: '儿童节', svg: '<svg viewBox="0 0 40 40"><ellipse cx="14" cy="13" rx="6" ry="7"/><ellipse cx="26" cy="10" rx="5" ry="6"/><path d="M14 20c-1 4-1 8 0 14M26 16c1 5 1 11-2 18"/></svg>' },
{ md: '10-31', n: '万圣前夜', svg: '<svg viewBox="0 0 40 40"><path d="M12 26c0-8 4-13 8-13s8 5 8 13c-5 2-11 2-16 0z"/><path d="M20 13v-5"/><path d="M17 22h.01M23 22h.01M20 25v2"/></svg>' },
{ md: '12-25', n: '圣诞节', svg: '<svg viewBox="0 0 40 40"><path d="M20 6l9 12h-18z"/><path d="M20 14l10 13H10z"/><path d="M20 27v7M16 34h8"/></svg>' }
];
function _hmFestOf() {
const d = new Date();
const md = ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
return HM_FEST_DECOR.find(f => f.md === md) || null;
}
var HM_UNLOCK = [
{ id: 'vase', key: 'water', n: 3, hint: '给花浇 3 次水' },
{ id: 'doormat', key: 'knock', n: 5, hint: '敲 5 次门' }
];
function _hmStatsOf(cid) {
const o = _hmEnsure(cid);
if (!o.stats || typeof o.stats !== 'object' || Array.isArray(o.stats)) o.stats = { water: 0, knock: 0 };
return o.stats;
}
function _hmUnlocked(id, cid) {
const u = HM_UNLOCK.find(x => x.id === id);
if (!u) return true;
return (+_hmStatsOf(cid)[u.key] || 0) >= u.n;
}
function _hmStatsBump(cid, key) {
const st = _hmStatsOf(cid);
const before = +st[key] || 0;
st[key] = Math.min(9999, before + 1);
save();
const u = HM_UNLOCK.find(x => x.key === key && x.n > before && x.n <= st[key]);
if (u && HM_PROPS[u.id]) showToast('解锁了新摆件：' + HM_PROPS[u.id].n + '（去装扮面板看看）');
}
var HM_PROP_WHERE = { shelf: 'wall', lamp: 'floor', vase: 'wall', umbrella: 'wall', plant: 'floor', cat: 'floor', rug: 'floor', books: 'floor', doormat: 'floor' };
var _HM_PROP_SLOTS = {
wall:  [{ x: 14, y: 18 }, { x: 86, y: 20 }, { x: 50, y: 14 }],
floor: [{ x: 14, y: 74 }, { x: 86, y: 76 }, { x: 50, y: 70 }]
};
var HM_PROP_BAND = { wall: [8, 38], floor: [58, 90] };
function _hmPropsNormalize(cid) {
const look = _hmLookOf(cid);
if (!look || !Array.isArray(look.props)) return false;
let changed = false;
const out = []; const used = { wall: 0, floor: 0 };
for (let i = 0; i < look.props.length && out.length < 3; i++) {
const it = look.props[i];
if (!it || typeof it !== 'object' || typeof it.id !== 'string' || !HM_PROPS[it.id]) { out.push(it); continue; }
const where = HM_PROP_WHERE[it.id] === 'wall' ? 'wall' : 'floor';
const band = HM_PROP_BAND[where];
const slot = _HM_PROP_SLOTS[where][used[where]++ % 3];
let x = (typeof it.x === 'number' && isFinite(it.x)) ? it.x : slot.x;
let y = (typeof it.y === 'number' && isFinite(it.y)) ? it.y : slot.y;
x = Math.round(Math.min(96, Math.max(2, x)) * 10) / 10;
if (y < band[0] || y > band[1]) { y = slot.y; changed = true; }
y = Math.round(Math.min(94, Math.max(2, y)) * 10) / 10;
out.push({ id: it.id, x: x, y: y });
}
if (changed) { look.props = out; if (typeof save === 'function') save(); }
return changed;
}
function _hmPropsOf(cid) {
const look = _hmLookOf(cid) || {};
const def = HM_SKINS.find(x => x.k === (look.skin || ''));
const base = Array.isArray(look.props) ? look.props : ((def && def.props) || []);
const out = []; const seen = {}; const used = { wall: 0, floor: 0 };
for (let i = 0; i < base.length && out.length < 3; i++) {
const it = base[i];
const id = (typeof it === 'string') ? it : (it && typeof it === 'object' ? it.id : '');
if (!HM_PROPS[id] || seen[id]) continue;
seen[id] = 1;
const where = HM_PROP_WHERE[id] === 'wall' ? 'wall' : 'floor';
const slot = _HM_PROP_SLOTS[where][used[where]++ % 3];
const band = HM_PROP_BAND[where];
const x = (it && typeof it === 'object' && typeof it.x === 'number' && isFinite(it.x)) ? Math.min(96, Math.max(2, it.x)) : slot.x;
let y = (it && typeof it === 'object' && typeof it.y === 'number' && isFinite(it.y)) ? it.y : slot.y;
if (y < band[0] || y > band[1]) y = slot.y;
y = Math.min(94, Math.max(2, y));
out.push({ id: id, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
}
return out;
}
function _hmPlantOf(cid) {
const look = _hmLookOf(cid) || {};
const p = (look.plant && typeof look.plant === 'object') ? look.plant : {};
return {
n: Math.max(0, Math.floor(+p.n || 0)),
day: (typeof p.day === 'string') ? p.day : '',
at: +p.at || 0,
nm: (typeof p.nm === 'string') ? p.nm : '',
born: (typeof p.born === 'string') ? p.born : '',
kind: (typeof p.kind === 'string' && HM_FLOWER[p.kind]) ? p.kind : ''
};
}
function _hmDayGap(a, b) {
const pa = String(a || '').split('-').map(Number), pb = String(b || '').split('-').map(Number);
if (pa.length < 3 || pb.length < 3 || !pa[0] || !pb[0]) return 0;
return Math.round((Date.UTC(pb[0], pb[1] - 1, pb[2]) - Date.UTC(pa[0], pa[1] - 1, pa[2])) / 86400000);
}
function _hmPlantThirst(p) {
if (!p.day) return 0;
const d = _hmDayGap(p.day, _hmToday());
if (d <= 1) return 0;
if (d === 2) return 2;
return 3;
}
var HM_FLOWER = {
'':      { n: '一盆花', lang: '没起名字，也好好长着。' },
daisy:   { n: '雏菊',   lang: '雏菊的花语是「藏在心里的喜欢」。' },
bell:    { n: '铃兰',   lang: '铃兰的花语是「幸福回来」。' },
rose:    { n: '小玫瑰', lang: '小玫瑰的花语是「慢慢喜欢你」。' }
};
var HM_FLOWER_HABIT = {
'':    { top3: 64, top7: 52, leafW: 1,    drop: 0 },
daisy: { top3: 54, top7: 40, leafW: 0.78, drop: -2 },
bell:  { top3: 70, top7: 52, leafW: 1,    drop: 7 },
rose:  { top3: 76, top7: 64, leafW: 1.28, drop: 2 }
};
function _hmFlowerSVG(kind, cy) {
const c = (typeof cy === 'number') ? cy : 44;
if (kind === 'daisy') {
let s = '';
for (let i = 0; i < 12; i++) {
const a = (i * 30) * Math.PI / 180;
const x = 60 + Math.cos(a) * 13, y = c + Math.sin(a) * 13;
s += '<ellipse class="hm-petal" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="4.6" ry="2.4"'
+ ' transform="rotate(' + (i * 30) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"/>';
}
return s + '<circle class="hm-flower-c" cx="60" cy="' + c + '" r="5"/>';
}
if (kind === 'bell') {
const d = c - 44;
return '<path class="hm-bell" d="M60 ' + (40 + d) + 'c0 6-7 8-7 14 0 4 3 6 7 6s7-2 7-6c0-6-7-8-7-14z"/>'
+ '<path class="hm-bell" d="M46 ' + (50 + d) + 'c0 5-5 7-5 11 0 3 2 5 5 5s5-2 5-5c0-4-5-6-5-11z"/>'
+ '<path class="hm-bell" d="M74 ' + (52 + d) + 'c0 5-5 7-5 11 0 3 2 5 5 5s5-2 5-5c0-4-5-6-5-11z"/>';
}
if (kind === 'rose') {
const d = c - 44;
return '<circle class="hm-rose" cx="60" cy="' + c + '" r="12"/>'
+ '<path class="hm-rose" d="M60 ' + (53 + d) + 'c-5 0-8-4-8-9s4-8 8-8 7 3 7 7-3 7-6 7"/>'
+ '<path class="hm-rose" d="M60 ' + (49 + d) + 'c-3 0-4-2-4-5s2-4 4-4 4 1 4 3-1 4-3 4"/>';
}
const d = c - 44;
return '<circle class="hm-flower-p" cx="60" cy="' + (30 + d) + '" r="7.5"/><circle class="hm-flower-p" cx="74" cy="' + (44 + d) + '" r="7.5"/>'
+ '<circle class="hm-flower-p" cx="60" cy="' + (58 + d) + '" r="7.5"/><circle class="hm-flower-p" cx="46" cy="' + (44 + d) + '" r="7.5"/>'
+ '<circle class="hm-flower" cx="60" cy="' + c + '" r="7.5"/><circle class="hm-flower-c" cx="60" cy="' + c + '" r="3.2"/>';
}
function _hmPlantSVG(p) {
const n = p.n || 0;
const kind = HM_FLOWER[p.kind] ? p.kind : '';
const hb = HM_FLOWER_HABIT[kind] || HM_FLOWER_HABIT[''];
const cy = hb.top7 - 8;
const pot = '<path d="M38 118h44l-5 30H43z"/><path d="M35 112h50"/><path class="hm-soil" d="M44 120h32"/>';
let grow = '';
if (n >= 7) {
grow = '<path class="hm-stem" d="M60 112V' + hb.top7 + '"/>'
+ '<path class="hm-leaf" d="M60 94c-14-4-20-13-20-23 12 1 18 10 20 18"/>'
+ '<path class="hm-leaf" d="M60 86c13-4 19-13 19-23-11 1-17 10-19 18"/>'
+ '<path class="hm-leaf" d="M60 72c-9-2-13-9-13-16 8 1 12 7 13 12"/>'
+ _hmFlowerSVG(kind, cy);
} else if (n >= 3) {
grow = '<path class="hm-stem" d="M60 112V' + hb.top3 + '"/>'
+ '<path class="hm-leaf" d="M60 98c-13-4-18-12-18-21 11 1 16 9 18 16"/>'
+ '<path class="hm-leaf" d="M60 90c12-4 17-12 17-21-10 1-15 9-17 16"/>'
+ '<path class="hm-leaf" d="M60 78c-8-2-12-8-12-14 7 1 11 6 12 10"/>'
+ '<path class="hm-leaf" d="M60 70c8-2 11-8 11-13-6 1-10 5-11 9"/>';
} else {
grow = '<path class="hm-stem" d="M60 112V88"/>'
+ '<path class="hm-leaf" d="M60 104c-10-3-14-9-14-16 9 1 13 7 14 12"/>'
+ '<path class="hm-leaf" d="M60 98c9-3 13-9 13-16-8 1-12 7-13 12"/>';
}
return '<svg viewBox="0 0 120 156" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
+ '<g class="hm-leaves"><g class="hm-plant-habit" style="--leaf-w:' + hb.leafW + ';--leaf-drop:' + hb.drop + 'px"><g class="hm-plant-body">' + grow + '</g></g></g>' + pot + '</svg>';
}
function _hmFlowerLangHTML(p) {
const kind = (p.kind && HM_FLOWER[p.kind]) ? p.kind : '';
const fl = HM_FLOWER[kind] || HM_FLOWER[''];
return '<details class="hm-flower-lang"><summary>花语 · ' + (kind ? fl.n : '还没选品种') + '</summary><span>' + fl.lang + '</span></details>';
}
function _hmPlantHTML(cid) {
const p = _hmPlantOf(cid);
const watered = (p.day === _hmToday());
const th = _hmPlantThirst(p);
const step = p.n >= 7 ? '开花了，屋里多了一点颜色' : (p.n >= 3 ? '长高了，叶子密了一层' : (p.n > 0 ? '冒出了新芽' : '刚栽下，还等着第一口水'));
const nm = p.nm ? ' · 它叫「' + escapeHTML(p.nm) + '」' : ((HM_FLOWER[p.kind] && p.kind) ? ' · 这是盆' + HM_FLOWER[p.kind].n : '');
const thTxt = th >= 3 ? ' · 土都发白了，该浇水了' : (th === 2 ? ' · 叶尖有点垂，两天没喝水了' : '');
return '<div class="hm-sec hm-plant-sec" id="hmPlantSec">'
+ '<div class="hm-sec-hd"><span class="hm-sec-t">窗台那盆花</span>'
+ '<span class="hm-plant-st" id="hmPlantSt">浇过 ' + p.n + ' 次 · ' + (watered ? '今天浇过了' : '今天还没浇') + '</span></div>'
+ '<button type="button" class="hm-plant-big hm-plant' + (watered ? ' is-watered' : '') + '" data-hmwater="1" data-hmplant="1" data-hm-thirst="' + th + '" data-hm-flower="' + (HM_FLOWER[p.kind] ? p.kind : '') + '" aria-label="给花浇水" title="' + (watered ? '今天已经浇过水了' : '浇点水') + '">'
+ _hmPlantSVG(p) + '<span class="hm-water-drops" aria-hidden="true"><i></i><i></i><i></i></span></button>'
+ '<p class="hm-plant-note" id="hmPlantNote">' + step + nm + thTxt + '。'
+ '<span class="hm-plant-hint">点一下浇点水，一天一次。</span>'
+ '<button type="button" class="hm-plant-info" data-hmdo="plantcard">看它的成长记录</button></p>'
+ _hmFlowerLangHTML(p)
+ '</div>';
}
function _hmPlantCard(cid) {
if (typeof openModal !== 'function') return;
const p = _hmPlantOf(cid);
const th = _hmPlantThirst(p);
const stage = p.n >= 7 ? '开了花' : (p.n >= 3 ? '长高、叶子密了' : (p.n ? '冒出了新芽' : '还是小苗'));
const thirst = th >= 3 ? '很渴了——土都发白了' : (th === 2 ? '有点渴了——叶尖垂着' : '不渴，喝饱了');
const fl = HM_FLOWER[p.kind] || HM_FLOWER[''];
const lines = [
'名字：' + (p.nm || '还没起名'),
'品种：' + fl.n,
'种下：' + (p.born || '还没浇过第一口水'),
'浇过：' + p.n + ' 次',
'现在：' + stage,
'此刻：' + thirst,
'花语：' + fl.lang
];
openModal('这盆花', '', () => {}, { noInput: true, staticText: lines.join('　·　'), okText: '知道了' });
}
function _hmNotesOf(cid) { const o = homeOf(cid); return (o && Array.isArray(o.notes)) ? o.notes : []; }
function _hmWxObjHTML(cid) {
let wx = '';
const season = _hmSeason();
if (typeof cjSkyFor === 'function') { const s = cjSkyFor(cid); if (s) wx = s.weather || ''; }
let o = null;
if (wx === 'rain') {
o = { n: '门口放着一把伞', svg: '<svg viewBox="0 0 40 40"><path fill="#c47a6e" stroke="#8a4f47" stroke-width="1.3" d="M6 19c4-6 8-9 14-9s10 3 14 9"/><path fill="none" stroke="#8a4f47" stroke-width="1.2" d="M6 19c3-3 5-3 7 0 2-3 4-3 7 0 3-3 5-3 7 0 2-3 4-3 7 0"/><path fill="none" stroke="#8a4f47" stroke-width="1.5" d="M20 19v12c0 3 4 3 4 0"/></svg>' };
} else if (wx === 'snow') {
o = { n: '窗台外堆了个小雪人', svg: '<svg viewBox="0 0 40 40"><circle cx="20" cy="28" r="7" fill="#e8eef2" stroke="#b8c4cc" stroke-width="1.2"/><circle cx="20" cy="16" r="5" fill="#fff" stroke="#b8c4cc" stroke-width="1.2"/><path fill="none" stroke="#5b6a74" stroke-width="1.2" d="M20 11V9M12 26H9M28 26h3"/></svg>' };
} else if (season === 'winter') {
o = { n: '椅背上搭着毯子', svg: '<svg viewBox="0 0 40 40"><path fill="#9fb4c2" stroke="#6f8492" stroke-width="1.2" d="M8 12h24v18H8z"/><path fill="none" stroke="#6f8492" stroke-width="1" opacity=".7" d="M8 18h24M8 24h24"/></svg>' };
} else if (season === 'summer') {
o = { n: '窗台晾着一只杯子', svg: '<svg viewBox="0 0 40 40"><path fill="#e8ddc8" stroke="#9a8b72" stroke-width="1.2" d="M11 14h16v11a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6z"/><path fill="none" stroke="#9a8b72" stroke-width="1.3" d="M27 18h3a3 3 0 0 1 0 6h-3"/></svg>' };
} else if (wx === 'wind') {
o = { n: '窗边挂了一串风铃', svg: '<svg viewBox="0 0 40 40"><path fill="none" stroke="#7c8a94" stroke-width="1.3" d="M20 6v6M13 13h14"/><path fill="#dfe8d4" stroke="#7c8a94" stroke-width="1.1" d="M15 14h4v7h-4zM21 14h4v9h-4zM14 23h4v6h-4z"/></svg>' };
}
return o ? '<span class="hm-decor-i hm-wxobj" title="' + o.n + '">' + o.svg + '</span>' : '';
}
function _hmDecorHTML(cid, en) {
const season = _hmSeason();
const fest = _hmFestOf();
const away = (typeof _cjHiding === 'function' && _cjHiding(en));
const act = away ? 'away' : ((en && en.a && HM_ACT_OBJ[en.a]) ? en.a : 'unknown');
const obj = HM_ACT_OBJ[act] || HM_ACT_OBJ.unknown;
const ta = _hmContact();
const frame = ta ? '<span class="hm-decor-i hm-frame" title="TA 的照片"><span class="hm-frame-in">'
+ avatarHTML(chatAvatarOf(ta)) + '</span></span>' : '';
return '<div class="hm-decor" aria-label="屋里的陈设">'
+ '<span class="hm-decor-i hm-season" title="' + HM_SEASON_DECOR[season].n + '">' + HM_SEASON_DECOR[season].svg + '</span>'
+ (fest ? '<span class="hm-decor-i hm-fest" title="' + fest.n + '">' + fest.svg + '</span>' : '')
+ frame
+ _hmWxObjHTML(cid)
+ '<button type="button" class="hm-decor-i hm-actobj" data-hmobj="1" title="' + obj.n + '">' + obj.svg + '</button>'
+ '</div>';
}
var HM_FURN_TONE = {
ink:  'color-mix(in srgb,var(--ink) 58%,transparent)',
wood: '#8b7355',
warm: '#a07850'
};
function _hmFurnToneOf(cid) {
const o = _hmLookOf(cid) || {};
if (o.propTone === 'wood' || o.propTone === 'ink' || o.propTone === 'warm') return o.propTone;
if (o.skin === 'wood') return 'wood';
if (o.skin === 'lamp') return 'warm';
return 'ink';
}
function _hmFurnInkApply(cid) {
const layer = document.getElementById('hmFurn');
if (!layer) return;
layer.style.setProperty('--hm-furn-ink', HM_FURN_TONE[_hmFurnToneOf(cid)] || HM_FURN_TONE.ink);
}
function _hmFurnHTML(cid) {
const props = _hmPropsOf(cid);
if (!props.length) return '';
const ink = HM_FURN_TONE[_hmFurnToneOf(cid)] || HM_FURN_TONE.ink;
return '<div class="hm-furn" id="hmFurn" style="--hm-furn-ink:' + ink + '">'
+ props.map((p, i) => '<button type="button" class="hm-furn-i" data-hmfurn="' + i + '" title="' + HM_PROPS[p.id].n + '" aria-label="' + HM_PROPS[p.id].n + '" style="left:' + p.x + '%;top:' + p.y + '%">' + HM_PROPS[p.id].svg + '</button>').join('')
+ '</div>';
}
var _hmFurnOn = false;
function _hmSnapProp(where, x, y) {
const band = HM_PROP_BAND[where === 'wall' ? 'wall' : 'floor'];
const nx = Math.round(Math.min(92, Math.max(6, x)));
let ny = y;
let snapped = false;
if (ny < band[0]) { ny = band[0]; snapped = true; }
else if (ny > band[1]) { ny = band[1]; snapped = true; }
ny = Math.round(Math.min(94, Math.max(2, ny)));
return { x: nx, y: ny, snapped: snapped };
}
function _hmFurnDrag(cid) {
const layer = document.getElementById('hmFurn');
if (!layer || layer._furnBound) return;
layer._furnBound = 1;
layer.addEventListener('pointerdown', e => {
const el = e.target.closest('[data-hmfurn]');
if (!el || !el.dataset) return;
const idx = +el.dataset.hmfurn;
const rect = layer.getBoundingClientRect();
const cur0 = _hmPropsOf(cid);
const where = (cur0[idx] && HM_PROP_WHERE[cur0[idx].id] === 'wall') ? 'wall' : 'floor';
const ghost = document.createElement('span');
ghost.className = 'hm-furn-ghost';
layer.appendChild(ghost);
let dragging = false;
const move = ev => {
if (!dragging) return;
ev.preventDefault();
const x = Math.min(96, Math.max(2, ((ev.clientX - rect.left) / rect.width) * 100));
const y = Math.min(94, Math.max(2, ((ev.clientY - rect.top) / rect.height) * 100));
el.style.left = x.toFixed(1) + '%';
el.style.top = y.toFixed(1) + '%';
el._hmPos = { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
const gs = _hmSnapProp(where, el._hmPos.x, el._hmPos.y);
ghost.style.left = gs.x + '%';
ghost.style.top = gs.y + '%';
};
const up = () => {
document.removeEventListener('pointermove', move);
document.removeEventListener('pointerup', up);
document.removeEventListener('pointercancel', up);
clearTimeout(hold);
ghost.remove();
if (!dragging) return;
dragging = false;
_hmFurnOn = false;
layer.classList.remove('hm-furn-on');
if (el._hmPos) {
const o = _hmEnsure(cid);
const cur = _hmPropsOf(cid);
if (cur[idx]) {
const snap = _hmSnapProp(HM_PROP_WHERE[cur[idx].id] === 'wall' ? 'wall' : 'floor', el._hmPos.x, el._hmPos.y);
cur[idx].x = snap.x; cur[idx].y = snap.y;
o.look.props = cur; save();
el.style.left = snap.x + '%';
el.style.top = snap.y + '%';
showToast(snap.snapped ? (HM_PROP_WHERE[cur[idx].id] === 'wall' ? '摆好了，贴在墙上。' : '摆好了，落在地上。') : '摆好了。');
}
el._hmPos = null;
}
};
const hold = setTimeout(() => {
dragging = true;
_hmFurnOn = true;
layer.classList.add('hm-furn-on');
showToast('拖着摆件放到喜欢的位置');
}, 500);
if (e.pointerType === 'mouse') { clearTimeout(hold); dragging = true; _hmFurnOn = true; layer.classList.add('hm-furn-on'); }
document.addEventListener('pointermove', move);
document.addEventListener('pointerup', up);
document.addEventListener('pointercancel', up);
});
}
function _hmPhotosHTML(cid) {
const look = _hmLookOf(cid) || {};
const ps = Array.isArray(look.photos) ? look.photos.filter(x => typeof x === 'string' && x).slice(0, 3) : [];
if (!ps.length) return '';
const pf = (look.photoFrame === 'wood' || look.photoFrame === 'polaroid') ? look.photoFrame : '';
const note = (typeof look.photoNote === 'string') ? look.photoNote : '';
return '<div class="hm-photos" data-hm-pframe="' + pf + '">' + ps.map((s, i) => '<button type="button" class="hm-photo hm-photo-' + i + '" data-hmphoto="' + i + '" aria-label="看这张照片"><img src="' + escapeHTML(s) + '" alt=""></button>').join('')
+ ((pf === 'polaroid' && note) ? '<span class="hm-photo-note">' + escapeHTML(note) + '</span>' : '')
+ '</div>';
}
function _hmDoHTML(cid, en) {
const notes = _hmNotesOf(cid);
const look = _hmLookOf(cid) || {};
const card = (look.card && typeof look.card.text === 'string' && look.card.text) ? look.card : null;
const away = (typeof _cjHiding === 'function' && _cjHiding(en));
return '<div class="hm-sec hm-do"><div class="hm-sec-hd"><span class="hm-sec-t">一起做点什么</span></div>'
+ '<div class="hm-do-row">'
+ '<button type="button" class="hm-chip" data-hmdo="deal">递一张牌</button>'
+ '<button type="button" class="hm-chip" data-hmdo="card">放一张字卡</button>'
+ '<button type="button" class="hm-chip hm-chip-go" data-hmgo="couple">一起听 · 在我们的空间</button>'
+ '</div>'
+ '<div class="hm-do-row">'
+ '<button type="button" class="hm-chip" data-hmdo="knock"' + (away ? ' disabled' : '') + '>敲敲门</button>'
+ '<button type="button" class="hm-chip" data-hmdo="sit"' + (_hmSitOn ? ' hidden' : '') + '>坐一会儿</button>'
+ '<button type="button" class="hm-chip" data-hmdo="note">留一张纸条</button>'
+ (notes.length ? '<button type="button" class="hm-note-pin" data-hmdo="notes" aria-label="看门口的纸条"><i>门口</i><span>' + escapeHTML(notes[notes.length - 1].t.slice(0, 26)) + (notes[notes.length - 1].t.length > 26 ? '…' : '') + '</span><em>' + notes.length + ' 张</em></button>' : '')
+ '</div>'
+ (card ? '<button type="button" class="hm-tablecard" data-hmdo="readcard"><i>桌上</i><span>' + escapeHTML(card.text.slice(0, 30)) + (card.text.length > 30 ? '…' : '') + '</span></button>' : '')
+ (away ? '<p class="hm-do-hint">TA 出门了，今天不敲门。</p>' : '<p class="hm-do-hint">一起听、心情记录、清单和账本都在「我们的空间」——这一页只管这间屋。</p>')
+ '</div>';
}
function _hmSayTA(cid, text) {
if (!cid || !text || typeof _deliverToChat !== 'function' || typeof nextId !== 'function') return false;
try { return _deliverToChat({ id: nextId(), from: 'partner', text: String(text), unread: true, src: 'cjian', cjLine: 'home' }, cid); } catch (e) { return false; }
}
function _hmDailyFlag(key) {
const k = 'ordinal-hm-said-' + key;
const dk = _hmToday();
let last = '';
try { last = localStorage.getItem(k) || ''; } catch (e) {}
if (last === dk) return false;
try { localStorage.setItem(k, dk); } catch (e) {}
return true;
}
var HM_SIT_LINES = [
'（椅子挪过来一点）……坐着吧。',
'（很轻）今天这屋里挺安静的。',
'（小声）茶在桌上，凉了自己倒。',
'（头也没抬）你坐着，我一会儿就好。',
'（窗外有风）……就坐一会儿吧。'
];
var _hmSitOn = false, _hmSitT = null, _hmSitSaid = 0, _hmSitLast = 0;
var _hmRoomSound = '';
function _hmAmbStop() {
if (_hmRoomSound) {
try {
if (typeof window.__srRoomAmbient === 'function') { window.__srRoomAmbient('rain', false); window.__srRoomAmbient('fire', false); }
} catch (e) {}
_hmRoomSound = '';
}
const host = document.querySelector('#hmView .hm-sit-sound');
if (host) {
const bs = host.querySelectorAll('[data-hmamb]');
for (let i = 0; i < bs.length; i++) bs[i].classList.toggle('on', !bs[i].getAttribute('data-hmamb'));
}
}
function _hmAmbSet(cid, kind) {
kind = (kind === 'rain' || kind === 'fire') ? kind : '';
if (kind && kind === _hmRoomSound) kind = '';
const apply = () => {
if (typeof window.__srRoomAmbient !== 'function') { showToast('屋里的声音还没准备好。'); return; }
try { window.__srRoomAmbient('rain', false); window.__srRoomAmbient('fire', false); } catch (e) {}
_hmRoomSound = kind;
if (kind) { try { window.__srRoomAmbient(kind, true); } catch (e) {} }
const host = document.querySelector('#hmView .hm-sit-sound');
if (host) {
const bs = host.querySelectorAll('[data-hmamb]');
for (let i = 0; i < bs.length; i++) bs[i].classList.toggle('on', (bs[i].getAttribute('data-hmamb') || '') === kind);
}
showToast(kind ? (kind === 'rain' ? '开了一点雨声。' : '开了一点炉火声。') : '屋里的声音关了。');
};
if (typeof window.__srRoomAmbient !== 'function' && typeof ensureChunk === 'function') {
ensureChunk('sleeproom', 12000).then(ok => { if (!ok) { showToast('声音还没准备好。'); return; } apply(); });
} else apply();
}
function _hmSitStart(cid) {
const view = document.getElementById('hmView');
if (!view || _hmSitOn) return;
_hmSitOn = true; _hmSitSaid = 0; _hmSitLast = Date.now();
view.setAttribute('data-hm-sit', '1');
const amb = view.querySelector('.hm-sit-sound');
if (amb) amb.hidden = false;
showToast('你坐了下来。');
if (Math.random() < 0.3) setTimeout(() => { if (_hmSitOn) _hmSitSay(cid); }, 2500);
_hmSitT = setInterval(() => _hmSitTick(cid), 45000);
}
function _hmSitEnd(quiet) {
const view = document.getElementById('hmView');
if (view) {
view.removeAttribute('data-hm-sit');
const amb = view.querySelector('.hm-sit-sound');
if (amb) amb.hidden = true;
}
_hmAmbStop();
if (_hmSitT) { clearInterval(_hmSitT); _hmSitT = null; }
if (_hmSitOn && quiet !== true) showToast('你起身了。');
_hmSitOn = false;
}
function _hmSitSay(cid) {
if (!_hmSitOn || _hmSitSaid >= 2) return;
_hmSitSaid++;
_hmSitLast = Date.now();
_hmSayTA(cid, HM_SIT_LINES[Math.floor(Math.random() * HM_SIT_LINES.length)]);
}
function _hmSitTick(cid) {
if (!_hmSitOn || document.body.dataset.view !== 'home') { _hmSitEnd(true); return; }
if (Date.now() - _hmSitLast < 45000 || _hmSitSaid >= 2) return;
if (Math.random() < 0.25) _hmSitSay(cid);
}
var HM_DAY_LINES = {
free:    ['屋里摊着几本书，翻到一半就停在那儿。', 'TA 把窗开了一条缝，让风进来。', '桌上多了两只杯子，一只没动。', '椅子斜对着窗，像刚有人坐过。', '屋里一切照旧，安静得很。'],
busy:    ['桌上那杯水没动过，笔却没停。', '纸摊了一桌，TA 没抬头。', '台灯亮着，屋里只有翻页声。', '屋里很静，只有笔尖在响。', '门虚掩着，能听见写字的声音。'],
rushed:  ['椅子拖出了声响，纸散了一桌。', '屋里脚步来来回回，没停过。', '杯子挪了位置，纸折了一半。', '门开了又关，屋里一阵风。', '桌上乱糟糟的，像刚翻过一遍。'],
rest:    ['毯子搭在椅背上，屋里暖烘烘的。', 'TA 靠在椅子里，窗外的光正好。', '茶还温着，屋里慢慢悠悠。', '屋里光线软下来，什么也不急。', '坐垫挪到了窗边，晒着太阳。'],
sleep:   ['屋里灯留了一盏，被子盖得好好。', '月牙挂在窗角，屋里没声音。', '毯子铺好了，门轻轻带上了。', '屋里只剩钟表的走针声。', '灯暗着，窗外夜色正沉。'],
unknown: ['屋里没开灯，家具都在老位置。', '窗帘拉着，屋里静悄悄。', '屋里安静，像在等人回来。', '桌上的东西都没动过。', '屋里黑着，只有窗透进一点光。']
};
function _hmDayLogPush(store, cid, dk, line) {
const log = Array.isArray(store._log) ? store._log : [];
const others = log.filter(x => x && x.cid !== cid);
let mine = log.filter(x => x && x.cid === cid);
if (!mine.some(x => x.dk === dk)) mine.push({ cid: cid, dk: dk, line: line });
store._log = others.concat(mine.slice(-7)).slice(-60);
}
function _hmDayLog(cid) {
let store = {};
try { store = JSON.parse(localStorage.getItem('ordinal-hm-day') || '{}') || {}; } catch (e) { store = {}; }
const log = Array.isArray(store._log) ? store._log : [];
return log.filter(x => x && x.cid === cid).slice(-7).reverse();
}
function _hmDayLogOpen(cid) {
if (typeof openModal !== 'function') return;
const log = _hmDayLog(cid);
const lines = log.length ? log.map(x => {
const p = String(x.dk || '').split('-');
const d = (p.length === 3) ? (p[1] + '月' + p[2] + '日') : x.dk;
return d + ' · ' + x.line;
}) : ['还没有留下几天，明天再来看看。'];
openModal('小屋日志', '', () => {}, { noInput: true, staticText: lines.join('　·　'), okText: '知道了' });
}
function _hmDayLine(cid, en) {
let store = {};
try { store = JSON.parse(localStorage.getItem('ordinal-hm-day') || '{}') || {}; } catch (e) { store = {}; }
const dk = _hmToday();
const hit = store[cid] && store[cid].dk === dk ? store[cid].line : '';
if (hit) return hit;
const act = (en && en.a && HM_DAY_LINES[en.a]) ? en.a : 'free';
let tp = '';
try { if (en && typeof _cjTimePartOf === 'function') tp = _cjTimePartOf(en) || ''; } catch (e) {}
const pool = HM_DAY_LINES[act];
let h = 0; const s = cid + '|' + dk + '|' + act + '|' + tp;
for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
const line = pool[h % pool.length];
store[cid] = { dk, line };
_hmDayLogPush(store, cid, dk, line);
try { localStorage.setItem('ordinal-hm-day', JSON.stringify(store)); } catch (e) {}
return line;
}
function _hmDayHTML(cid, en) {
return '<p class="hm-day" data-hmdo="daylog" aria-label="看最近七天">'
+ '<i>今天屋里的事</i><span>' + escapeHTML(_hmDayLine(cid, en)) + '</span>'
+ '<em class="hm-day-more">最近七天 ›</em></p>';
}
function _hmCalNoteHTML(cid) {
if (typeof calDayPeek !== 'function' || typeof calTodayKey !== 'function') return '';
let day = null;
try { day = calDayPeek(calTodayKey()); } catch (e) { return ''; }
const items = (day && Array.isArray(day.items)) ? day.items.filter(x => x && x.text) : [];
if (!items.length) return '';
const top = items[0];
const kn = { trip: '行程', memo: '备忘', event: '事件' }[top.kind] || '今天';
const tm = top.tm ? ' · ' + top.tm : '';
const more = items.length > 1 ? ' · 还有 ' + (items.length - 1) + ' 件' : '';
return '<button type="button" class="hm-cal-note" data-hmcalgo="1" title="打开日历看今天">'
+ '<span class="hm-cal-note-k">' + kn + tm + '</span>'
+ '<span class="hm-cal-note-t">' + escapeHTML(String(top.text).slice(0, 40)) + more + '</span>'
+ '</button>';
}
var HM_OBJ_LINES = {
free:    ['你碰了碰桌上的杯子，水纹晃了一下。', '你翻了翻摊开的书，还停在原来那页。', '你把椅子挪了挪，TA 抬头看了你一眼。'],
busy:    ['你碰了碰那支笔，TA 没抬头，只嗯了一声。', '你把杯子往 TA 手边推了推。', '你顺手把散开的纸叠好，TA 点了下头。'],
rushed:  ['你按住那张要被风吹走的纸。', '你把椅子往旁边让了让。', '你碰了碰杯子，才发现水早凉了。'],
rest:    ['你把毯子往 TA 那边拉了拉。', '你碰了碰茶沿，还温着。', '你在坐垫边坐下来，屋里很静。'],
sleep:   ['你把被角掖好，没出声。', '你把灯调暗了一点。', '你碰了碰杯子，又轻轻放下。'],
unknown: ['你碰了碰桌上的东西，屋里没什么动静。', '你随手翻了翻桌上的纸。', '你把杯子摆正了一点。'],
away:    ['屋里没人，你碰了碰桌上的东西。']
};
function _hmObjTalk(cid) {
const now = Date.now();
let last = 0; try { last = +localStorage.getItem('ordinal-hm-obj') || 0; } catch (e) {}
if (now - last < 60000) { showToast('刚碰过了，等一等。'); return; }
try { localStorage.setItem('ordinal-hm-obj', String(now)); } catch (e) {}
const en = (typeof _cjEntry === 'function') ? _cjEntry(cid) : null;
const away = (typeof _cjHiding === 'function' && _cjHiding(en));
const act = away ? 'away' : ((en && en.a && HM_ACT_OBJ[en.a]) ? en.a : 'unknown');
const pool = HM_OBJ_LINES[act] || HM_OBJ_LINES.unknown;
if (Math.random() < 0.5 && _hmDailyFlag('obj')) _hmSayTA(cid, pool[Math.floor(Math.random() * pool.length)]);
else showToast(pool[Math.floor(Math.random() * pool.length)]);
}
function _hmPlantNoteText(p) {
const th = _hmPlantThirst(p);
const step = p.n >= 7 ? '开花了，屋里多了一点颜色' : (p.n >= 3 ? '长高了，叶子密了一层' : (p.n > 0 ? '冒出了新芽' : '刚栽下，还等着第一口水'));
const nm = p.nm ? ' · 它叫「' + escapeHTML(p.nm) + '」' : ((HM_FLOWER[p.kind] && p.kind) ? ' · 这是盆' + HM_FLOWER[p.kind].n : '');
const thTxt = th >= 3 ? ' · 土都发白了，该浇水了' : (th === 2 ? ' · 叶尖有点垂，两天没喝水了' : '');
return step + nm + thTxt;
}
function _hmWaterPaint(cid, p) {
const dk = _hmToday();
const watered = (p.day === dk);
const th = _hmPlantThirst(p);
const paint = sec => {
if (!sec) return;
const btn = sec.querySelector('.hm-plant-big');
if (btn) {
btn.innerHTML = _hmPlantSVG(p) + '<span class="hm-water-drops" aria-hidden="true"><i></i><i></i><i></i></span>';
btn.classList.toggle('is-watered', watered);
btn.setAttribute('data-hm-thirst', String(th));
btn.title = watered ? '今天已经浇过水了' : '浇点水';
btn.classList.remove('hm-watering');
void btn.offsetWidth;
btn.classList.add('hm-watering');
setTimeout(() => { if (btn) btn.classList.remove('hm-watering'); }, 1500);
}
const st = sec.querySelector('.hm-plant-st');
if (st) {
const short = '浇过 ' + p.n + ' 次 · ' + (watered ? '今天浇过了' : '今天还没浇');
st.textContent = (sec.id === 'hmSetPlant')
? ((p.n >= 7 ? '开花了' : (p.n >= 3 ? '长高了' : (p.n > 0 ? '冒出新芽' : '刚栽下'))) + ' · ' + short)
: short;
}
const nt = sec.querySelector('.hm-plant-note');
if (nt) nt.innerHTML = _hmPlantNoteText(p) + '。<span class="hm-plant-hint">点一下浇点水，一天一次。</span>'
+ '<button type="button" class="hm-plant-info" data-hmdo="plantcard">看它的成长记录</button>';
};
paint(document.getElementById('hmPlantSec'));
paint(document.getElementById('hmSetPlant'));
}
function _hmWater(cid) {
const o = _hmEnsure(cid);
const p = _hmPlantOf(cid);
const dk = _hmToday();
if (p.day === dk) { showToast('今天已经浇过水了。'); return; }
p.n = Math.min(999, p.n + 1); p.day = dk; p.at = Date.now();
if (!p.born) p.born = dk;
o.look.plant = p; save();
_hmWaterPaint(cid, p);
_hmStatsBump(cid, 'water');
showToast(p.n === 3 ? '花长出新叶了。' : (p.n === 7 ? '花开了。' : '浇过水了。'));
if (Math.random() < 0.12 && _hmDailyFlag('water')) _hmSayTA(cid, HM_WATER_LINES[Math.floor(Math.random() * HM_WATER_LINES.length)]);
}
var _hmDoorT = 0;
function _hmDoorNote(t) {
const el = document.getElementById('hmDoorNote');
if (!el) return;
el.textContent = t;
clearTimeout(_hmDoorT);
_hmDoorT = setTimeout(() => {
const e2 = document.getElementById('hmDoorNote');
if (e2) {
const v = document.getElementById('hmView');
e2.textContent = (v && v.getAttribute('data-hm-away')) ? 'TA 出门了，门铃没人应。' : '按一下，看看 TA 在不在。';
}
}, 3500);
}
function _hmKnock(cid) {
const en = (typeof _cjEntry === 'function') ? _cjEntry(cid) : null;
if (typeof _cjHiding === 'function' && _cjHiding(en)) { showToast('屋里没人应门。'); _hmDoorNote('TA 出门了，门铃没人应。'); return; }
const now = Date.now();
let last = 0; try { last = +localStorage.getItem('ordinal-hm-knock') || 0; } catch (e) {}
if (now - last < 60000) { showToast('刚敲过，等一等。'); _hmDoorNote('刚敲过，过一会儿再来。'); return; }
try { localStorage.setItem('ordinal-hm-knock', String(now)); } catch (e) {}
_hmStatsBump(cid, 'knock');
if (Math.random() < 0.35) {
_hmSayTA(cid, HM_KNOCK_LINES[Math.floor(Math.random() * HM_KNOCK_LINES.length)]);
_hmDoorNote('门开了，TA 来应门。');
} else {
showToast('敲了两下，屋里没动静。');
_hmDoorNote('屋里没动静。');
}
}
function _hmNoteOpen(cid) {
if (typeof openModal !== 'function') return;
openModal('留一张纸条', '', v => {
const t = String(v || '').trim().slice(0, 80);
if (!t) return;
const o = _hmEnsure(cid);
if (!Array.isArray(o.notes)) o.notes = [];
if (o.notes.length >= 20) o.notes.shift();
o.notes.push({ t, at: Date.now(), replied: 0 });
save(); _hmRepaint(cid);
showToast('纸条塞进门缝了。');
}, { okText: '塞进门缝' });
}
function _hmNotesOpen(cid) {
const notes = _hmNotesOf(cid);
if (!notes.length || typeof openModal !== 'function') return;
openModal('门口的纸条', '', () => {}, { noInput: true, staticText: notes.map((n, i) => (i + 1) + '. ' + n.t).join('　·　'), okText: '知道了' });
}
function _hmNoteReplyTick(cid) {
const o = homeOf(cid);
if (!o || !Array.isArray(o.notes) || !o.notes.length) return;
const pending = o.notes.filter(n => n && !n.replied && Date.now() - (+n.at || 0) > 30 * 60000);
if (!pending.length) return;
if (Math.random() >= 0.4) return;
if (!_hmDailyFlag('note')) return;
pending[0].replied = 1; save();
_hmSayTA(cid, HM_NOTE_LINES[Math.floor(Math.random() * HM_NOTE_LINES.length)]);
}
function _hmDoListen(cid) {
const go = ok => {
if (!ok) { showToast('播放器还没准备好。'); return; }
if (typeof plCoAutoBind === 'function') plCoAutoBind();
if (typeof plCur === 'function' && !plCur()) { showToast('曲库还空着，先去收一首。'); return; }
if (window.__plPlaying === false && typeof plToggle === 'function') plToggle();
if (typeof showView === 'function') showView('player');
};
if (typeof ensureChunk === 'function') ensureChunk('player', 12000).then(go);
else go(true);
}
function _hmDoDeal(cid) {
const go = ok => {
if (!ok) { showToast('牌桌还没准备好。'); return; }
if (typeof showView === 'function') showView('chat');
setTimeout(() => { try { if (typeof dealEnter === 'function') dealEnter(); } catch (e) {} }, 80);
};
if (typeof ensureChunk === 'function') ensureChunk('deal', 12000).then(go);
else go(true);
}
function _hmPickOpen(cid, mode) {
const mask = document.getElementById('hmPickMask');
const body = document.getElementById('hmPickBody');
const title = document.getElementById('hmPickTitle');
if (!mask || !body) return;
mode = (mode === 'fav' || mode === 'favphoto') ? mode : 'card';
body._mode = mode;
body._pool = null;
const favSnaps = () => {
const raw = (typeof collectGet === 'function') ? collectGet(cid) : [];
return raw.map(f => (typeof _favSnapOf === 'function') ? _favSnapOf(f) : null).filter(Boolean);
};
if (mode === 'fav') {
const list = favSnaps().filter(s => s.text).slice(0, 60);
if (!list.length) { showToast('收藏里还没有摘句。'); return; }
if (title) title.textContent = '从收藏放一句';
body._pool = list;
body.innerHTML = '<div class="hm-picklist">' + list.map((s, i) => '<button type="button" class="hm-pick" data-cardpick="' + i + '">' + escapeHTML(String(s.text).slice(0, 40)) + '</button>').join('') + '</div>';
mask.hidden = false;
return;
}
if (mode === 'favphoto') {
const list = favSnaps().filter(s => s.imgs && s.imgs.length).slice(0, 60);
if (!list.length) { showToast('收藏里还没有图。'); return; }
if (title) title.textContent = '从收藏挑一张图';
body._pool = list;
body.innerHTML = '<div class="hm-picklist hm-pickimgs">' + list.map((s, i) => '<button type="button" class="hm-pick-img" data-favimg="' + i + '"><img src="' + escapeHTML(s.imgs[0]) + '" alt="" decoding="async"></button>').join('') + '</div>';
mask.hidden = false;
return;
}
const pool = (typeof _categoryCards === 'function') ? _categoryCards('主字卡', cid).slice(0, 60) : [];
if (!pool.length) { showToast('这一位还没有字卡。'); return; }
if (title) title.textContent = '放一张字卡';
body._pool = pool;
body.innerHTML = '<div class="hm-picklist">' + pool.map((t, i) => '<button type="button" class="hm-pick" data-cardpick="' + i + '">' + escapeHTML(t.slice(0, 40)) + '</button>').join('') + '</div>';
mask.hidden = false;
}
function _hmPickClose() { const m = document.getElementById('hmPickMask'); if (m) m.hidden = true; }
function _hmSvgImg(svg) {
return new Promise(resolve => {
try {
const b = svg.getBoundingClientRect();
if (!b.width || !b.height) return resolve(null);
const c = svg.cloneNode(true);
c.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
c.setAttribute('width', String(Math.round(b.width)));
c.setAttribute('height', String(Math.round(b.height)));
const host = svg.closest('.hm-plant-big,.hm-furn-i,.hm-decor-i,.hm-scene-art') || svg;
const cs = getComputedStyle(host);
const color = cs.color || '#333';
const fl = cs.getPropertyValue('--hm-flower') || '';
c.setAttribute('style', 'color:' + color + (fl ? ';--hm-flower:' + fl : ''));
const str = new XMLSerializer().serializeToString(c);
const img = new Image();
img.onload = () => resolve(img);
img.onerror = () => resolve(null);
img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(str);
} catch (e) { resolve(null); }
});
}
async function _hmShotRoom(cid, mode) {
const pageMode = (mode === 'page');
const room = document.querySelector('#hmBody .hm-room');
const view = document.getElementById('hmView');
if (!room || !view) { showToast('屋子还没画好。'); return; }
const r = room.getBoundingClientRect();
const TOP = pageMode ? 104 : 58;
const W = Math.max(280, Math.round(r.width));
const H = Math.max(360, Math.round(r.height)) + TOP;
const cv = document.createElement('canvas');
cv.width = W * 2; cv.height = H * 2;
const g = cv.getContext('2d');
if (!g) { showToast('这张图没画成。'); return; }
g.scale(2, 2);
const vcs = getComputedStyle(view);
const wall = vcs.getPropertyValue('--hm-room').trim() || '#f2efe9';
g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, TOP);
g.fillStyle = wall; g.fillRect(0, TOP, W, H - TOP);
g.fillStyle = 'rgba(168,132,95,.30)'; g.fillRect(0, H - 24, W, 24);
const svgs = room.querySelectorAll('svg');
for (let i = 0; i < svgs.length; i++) {
const svg = svgs[i];
if (!svg.closest('.hm-plant-big,.hm-furn-i,.hm-decor-i,.hm-scene-art')) continue;
const b = svg.getBoundingClientRect();
const img = await _hmSvgImg(svg);
if (img) g.drawImage(img, b.left - r.left, TOP + (b.top - r.top), b.width, b.height);
}
const phs = room.querySelectorAll('.hm-photo img');
for (let i = 0; i < phs.length; i++) {
const b = phs[i].getBoundingClientRect();
try {
const im = new Image();
im.src = phs[i].src;
if (im.decode) await im.decode(); else await new Promise(ok => { im.onload = ok; im.onerror = ok; });
g.drawImage(im, b.left - r.left, TOP + (b.top - r.top), b.width, b.height);
} catch (e) {}
}
const ta = _hmContact();
g.fillStyle = 'rgba(30,26,22,.88)';
g.font = '700 17px "Microsoft YaHei", system-ui, sans-serif';
g.fillText('我们的家', 16, 28);
g.fillStyle = 'rgba(30,26,22,.55)';
g.font = '400 11px "Microsoft YaHei", system-ui, sans-serif';
g.fillText((ta ? (fixedNameOf(ta) || chatNameOf(ta) || 'TA') : 'TA') + ' · ' + _hmToday(), 16, 47);
if (pageMode) {
const en = (typeof _cjEntry === 'function') ? _cjEntry(cid) : null;
let hello = '';
try { hello = _hmHelloOf(cid, en, 1) || ''; } catch (e) {}
let day = '';
try { day = _hmDayLine(cid, en) || ''; } catch (e) {}
const clip = (s, n) => (String(s).length > n ? String(s).slice(0, n) + '…' : String(s));
g.fillStyle = 'rgba(30,26,22,.74)';
g.font = '400 12px "Microsoft YaHei", system-ui, sans-serif';
g.fillText(clip(hello, 24), 16, 70);
g.fillStyle = 'rgba(30,26,22,.52)';
g.font = '400 11px "Microsoft YaHei", system-ui, sans-serif';
g.fillText(clip(day, 28), 16, 90);
}
try {
_hmShotShow(cv.toDataURL('image/png'));
} catch (e) { showToast('这张图没画成。'); }
}
var _hmShotUrl = '';
function _hmDataUrlBlob(url) {
const h = String(url || '');
const cut = h.indexOf(',');
if (cut < 0) return null;
const mime = (h.slice(0, cut).match(/data:([^;]+)/) || [])[1] || 'image/png';
const bin = atob(h.slice(cut + 1));
const u8 = new Uint8Array(bin.length);
for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
return new Blob([u8], { type: mime });
}
function _hmShotBind() {
const mask = document.getElementById('hmShotMask');
if (!mask || mask._bound) return;
mask._bound = 1;
const close = () => { mask.hidden = true; _hmShotUrl = ''; const img = document.getElementById('hmShotPrev'); if (img) img.removeAttribute('src'); };
const cl = document.getElementById('hmShotClose'), cn = document.getElementById('hmShotCancel');
if (cl) cl.onclick = close;
if (cn) cn.onclick = close;
mask.addEventListener('click', e => { if (e.target === mask) close(); });
const sv = document.getElementById('hmShotSave');
if (sv) sv.onclick = () => _hmShotSave();
const sh = document.getElementById('hmShotShare');
if (sh) sh.onclick = () => _hmShotShare();
}
function _hmShotShow(url) {
if (!url) { showToast('这张图没画成。'); return; }
_hmShotUrl = url;
_hmShotBind();
const img = document.getElementById('hmShotPrev');
if (img) img.src = url;
const mask = document.getElementById('hmShotMask');
if (mask) mask.hidden = false;
}
function _hmShotSave() {
if (!_hmShotUrl) return;
try {
const a = document.createElement('a');
a.href = _hmShotUrl;
a.download = '我们的家.png';
document.body.appendChild(a); a.click(); a.remove();
showToast('存好了。');
} catch (e) { showToast('这张图没画成。'); }
}
async function _hmShotShare() {
if (!_hmShotUrl) return;
try {
const blob = _hmDataUrlBlob(_hmShotUrl);
const file = blob ? new File([blob], '我们的家.png', { type: blob.type || 'image/png' }) : null;
if (file && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
await navigator.share({ files: [file], title: '我们的家' });
return;
}
} catch (e) {}
_hmShotSave();
showToast('这台设备不能直接分享，已经存下来了。');
}
function _hmPhotoPick(cid) {
if (typeof mochiFilePick !== 'function') return;
const o = _hmEnsure(cid);
if (!Array.isArray(o.look.photos)) o.look.photos = [];
if (o.look.photos.length >= 3) { showToast('最多三张。'); return; }
mochiFilePick({
id: 'hmphoto', accept: 'image/*',
onFiles: files => {
const f = files && files[0];
if (!f) return;
const rd = new FileReader();
rd.onload = () => {
const put = img => {
const o2 = _hmEnsure(cid);
if (!Array.isArray(o2.look.photos)) o2.look.photos = [];
o2.look.photos.push(String(img));
o2.look.photos = o2.look.photos.slice(-3);
save(); _hmRepaint(cid); _hmPaintDress(cid);
showToast('照片挂上墙了。');
};
if (typeof compressImageDataURL === 'function') compressImageDataURL(String(rd.result), 900, 0.82).then(put).catch(() => showToast('这张图读不出来。'));
else put(String(rd.result));
};
rd.readAsDataURL(f);
}
});
}
function _hmHeroHTML(ta, cid, en, visitN) {
const clock = _hmWorldClock(en);
let clockHTML = '';
if (clock && typeof cjTimeOnOf === 'function' && cjTimeOnOf(cid)) {
const hideClock = (typeof cjHideTimeOnOf === 'function' && cjHideTimeOnOf() && typeof _cjHiding === 'function' && _cjHiding(en));
if (!hideClock) {
const pct = (en && en.world) ? ((en.world.hh * 60 + en.world.mm) / 1440) * 100 : 0;
clockHTML = '<span class="hm-clock">TA那边 ' + clock + '</span>'
+ '<span class="hm-daybar" aria-hidden="true"><i style="left:' + pct.toFixed(2) + '%"></i></span>';
}
}
const hello = _hmHelloOf(cid, en, visitN);
return '<div class="hm-hero">'
+ '<div class="hm-card">'
+ '<span class="hm-av">' + avatarHTML(chatAvatarOf(ta)) + '</span>'
+ '<div class="hm-id"><b class="hm-name">我们的家</b>'
+ '<span class="hm-hello">' + escapeHTML(hello) + '</span></div>'
+ '</div>'
+ (clockHTML ? '<div class="hm-meta">' + clockHTML + '</div>' : '')
+ '<button type="button" class="hm-door" data-hmdo="knock" aria-label="按门铃">'
+ '<span class="hm-door-bell"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4.2a5 5 0 0 0-5 5v3.1l-1.7 2.6h13.4L17 12.3V9.2a5 5 0 0 0-5-5z"/><path d="M9.9 18.4a2.2 2.2 0 0 0 4.2 0"/><path d="M12 2.6v1.6"/></svg></span>'
+ '<span class="hm-door-note" id="hmDoorNote">' + ((typeof _cjHiding === 'function' && _cjHiding(en)) ? 'TA 出门了，门铃没人应。' : '按一下，看看 TA 在不在。') + '</span>'
+ '</button>'
+ '</div>';
}
function _hmLiveHTML(en, cid) {
if (typeof _cjHiding === 'function' && _cjHiding(en)) {
return '<div class="hm-sec" id="hmLiveSec"><div class="hm-sec-hd"><span class="hm-sec-t">TA 正在…</span></div>'
+ '<span class="hm-scene-art">' + (HM_SCENE_SVG.away || '') + '</span>'
+ '<p class="hm-away">TA 出门了，屋里没人。等 TA 回来再说吧。</p></div>';
}
if (!en || typeof CJ_ACTIVITY === 'undefined') {
return '<div class="hm-sec" id="hmLiveSec"><div class="hm-sec-hd"><span class="hm-sec-t">TA 正在…</span></div>'
+ '<p class="hm-away">……</p></div>';
}
const act = (en.a && CJ_ACTIVITY[en.a]) ? en.a : 'free';
const actLbl = (typeof _cjActLabelOf === 'function') ? _cjActLabelOf(en) : CJ_ACTIVITY[act].label;
const doing = (typeof _cjDoText === 'function') ? _cjDoText(en) : '';
const mood = (data.cjian && data.cjian.moodOn !== false && typeof _cjMoodPairLabel === 'function') ? _cjMoodPairLabel(en.mo, '') : '';
let sky = '', wxK = '';
if (typeof cjSkyFor === 'function') { const s = cjSkyFor(cid); if (s) { sky = s.weatherName || ''; wxK = s.weather || ''; } }
const pres = (en.p && CJ_PRESENCE[en.p]) ? CJ_PRESENCE[en.p].label : '';
const scene = HM_SCENES[act] || HM_SCENES.unknown;
const nowTx = actLbl + (doing ? ' · ' + doing : '');
const fact = (k, v) => v ? '<span class="hm-fact"><i>' + k + '</i>' + escapeHTML(v) + '</span>' : '';
const wxExtra = (sky && typeof _cjWxSVG === 'function' && wxK) ? _cjWxSVG(wxK) : '';
const wxFact = sky ? '<span class="hm-fact"><i>那边的天</i><span class="hm-wx-line">' + wxExtra + escapeHTML(sky) + '</span></span>' : '';
let visits = 0;
try {
const dkToday = _hmToday();
const hx = (en && Array.isArray(en.hist)) ? en.hist : [];
hx.forEach(h => {
if (h && h.k === 'n' && /我们的家/.test(h.t || '') && typeof h.ts === 'number'
&& (typeof dressDayKey === 'function' ? new Date(h.ts).toLocaleDateString('zh-CN') === dkToday
: new Date(h.ts).toDateString() === new Date().toDateString())) visits++;
});
} catch (e) {}
const visitFact = visits ? fact('TA 察觉', '你今天来过 ' + visits + ' 次') : '';
const facts = fact('状态', en.status) + fact('心情', mood) + wxFact + fact('离你', pres) + visitFact;
return '<div class="hm-sec" id="hmLiveSec"><div class="hm-sec-hd"><span class="hm-sec-t">TA 正在…</span></div>'
+ '<span class="hm-scene-art">' + (HM_SCENE_SVG[act] || HM_SCENE_SVG.unknown) + '</span>'
+ '<button type="button" class="hm-sit-exit" data-hmdo="stand" hidden>起身 · 回到屋里</button>'
+ '<div class="hm-sit-sound" hidden>'
+ '<span class="hm-sit-sound-t">屋里的声音</span>'
+ '<button type="button" class="hm-sound-chip' + (_hmRoomSound === 'rain' ? ' on' : '') + '" data-hmamb="rain">雨声</button>'
+ '<button type="button" class="hm-sound-chip' + (_hmRoomSound === 'fire' ? ' on' : '') + '" data-hmamb="fire">炉火</button>'
+ '<button type="button" class="hm-sound-chip' + (_hmRoomSound ? '' : ' on') + '" data-hmamb="">关</button>'
+ '</div>'
+ '<p class="hm-now"><span class="hm-now-cap">TA 正在</span><b class="hm-now-tx">' + escapeHTML(nowTx) + '</b></p>'
+ (facts ? '<div class="hm-facts">' + facts + '</div>' : '')
+ '<p class="hm-scene">' + escapeHTML(scene) + '</p>'
+ '</div>';
}
function _hmPaintStk(cid) {
const host = document.getElementById('hmDz');
if (!host) return;
const o = homeOf(cid);
const html = (o && o.look && o.look.dz && typeof dzItemsHTML === 'function') ? dzItemsHTML(o.look.dz, 'chat') : '';
if (host.innerHTML !== html) host.innerHTML = html;
_hmStkAvoidWin(host);
}
function _hmStkAvoidWin(host) {
const scene = document.querySelector('#hmBody .hm-scene-art');
if (!scene || !host.childNodes.length) return;
const hr = host.getBoundingClientRect();
const sr = scene.getBoundingClientRect();
if (sr.bottom <= hr.top) return;
const winBottom = Math.min(88, ((sr.bottom - hr.top) / hr.height) * 100 + 2);
host.querySelectorAll('.dz-i').forEach(el => {
const y = parseFloat(el.style.top);
if (!(y >= 0) || y >= winBottom) return;
el.style.top = Math.min(90, winBottom + 2 + (y % 10)).toFixed(1) + '%';
});
}
function _hmStkTick(cid, force) {
const o = _hmEnsure(cid);
const look = o.look;
const cfg = (typeof dressCfgOf === 'function') ? dressCfgOf(cid) : null;
const gate = cfg ? cfg.on !== false : true;
const prob = (cfg && typeof cfg.prob === 'number' && isFinite(cfg.prob)) ? Math.min(100, Math.max(0, cfg.prob)) : 45;
if (!force && (look.stkOn === false || !gate)) return false;
const dk = (typeof dressDayKey === 'function') ? dressDayKey() : new Date().toLocaleDateString('zh-CN');
if (!force && look.dzDay === dk) return false;
if (typeof dzPoolIds !== 'function' || typeof dzRollPlan !== 'function' || dzPoolIds(cid).length < 2) return false;
if (!force && Math.random() * 100 >= prob) { look.dzDay = dk; save(); return false; }
const plan = dzRollPlan('chat', look.dz && look.dz.tpl ? look.dz.tpl : '', '', cid, null);
look.dzDay = dk;
if (plan) look.dz = { tpl: plan.tpl, items: plan.items, at: plan.at };
save();
return !!plan;
}
var HM_TONES = ['', '#8a6d5b', '#7a6ba0', '#5e7d8c', '#a06d84', '#5f7d5a', '#4a4a4a'];
function _hmSwap(fn) {
if (typeof apSwapFade === 'function') { try { apSwapFade(fn); return; } catch (e) {} }
fn();
}
function _hmDressHTML(cid) {
const o = homeOf(cid) || {};
const look = o.look || {};
const skinOn = (typeof look.skin === 'string') ? look.skin : '';
const cfg = (typeof dressCfgOf === 'function') ? dressCfgOf(cid) : null;
const prob = (cfg && typeof cfg.prob === 'number' && isFinite(cfg.prob)) ? Math.min(100, Math.max(0, cfg.prob)) : 45;
const skinSw = s => '<button type="button" class="hm-skin' + (skinOn === s.k ? ' on' : '') + '" data-skin="' + s.k + '" aria-label="' + s.n + '"'
+ ' style="--sk-wall:' + s.wall + ';--sk-tone:' + (s.tone || 'transparent') + ';--sk-glow:' + (s.glow / 30).toFixed(2) + '">'
+ '<span class="hm-skin-sw" aria-hidden="true"></span><span class="hm-skin-n">' + s.n + '</span></button>';
const propOn = k => _hmPropsOf(cid).some(p => p.id === k);
const propRow = Object.keys(HM_PROPS).map(k => {
const ok = _hmUnlocked(k, cid);
return '<button type="button" class="hm-chip hm-prop-chip' + (propOn(k) ? ' on' : '') + (ok ? '' : ' lock') + '" data-prop="' + k + '"' + (ok ? '' : ' title="还没解锁"') + '>' + HM_PROPS[k].n + (ok ? '' : '<i class="lk">未解锁</i>') + '</button>';
}).join('');
const ps = Array.isArray(look.photos) ? look.photos.filter(x => typeof x === 'string' && x).slice(0, 3) : [];
const psRow = '<div class="hm-photos-set">'
+ [0, 1, 2].map(i => ps[i]
? '<span class="hm-photo-slot"><img src="' + escapeHTML(ps[i]) + '" alt=""><button type="button" class="hm-photo-x" data-hmcmd="photoclear" data-i="' + i + '" aria-label="摘掉这张">×</button></span>'
: '<span class="hm-photo-slot hm-empty"><i>空</i></span>').join('')
+ (ps.length < 3 ? '<button type="button" class="hm-btn" data-hmcmd="photopick">' + (ps.length ? '再传一张' : '传一张') + '</button>'
+ '<button type="button" class="hm-btn" data-hmcmd="favphoto">从收藏</button>' : '')
+ '</div>';
const plant = _hmPlantOf(cid);
const watered = (plant.day === _hmToday());
const plantStep = plant.n >= 7 ? '开花了' : (plant.n >= 3 ? '长高了' : (plant.n > 0 ? '冒出新芽' : '刚栽下'));
return '<div class="hm-dress">'
+ '<p class="hm-set-cap">屋子</p>'
+ '<div class="hm-dress-row"><span class="hm-dress-cap">样子</span><div class="hm-dress-main"><div class="hm-skins">'
+ HM_SKINS.map(skinSw).join('')
+ '</div></div></div>'
+ '<p class="hm-dress-note">一套会改主色调和暖光，不动背景图。</p>'
+ '<div class="hm-dress-row"><span class="hm-dress-cap">摆件</span><div class="hm-dress-main">' + propRow + '</div></div>'
+ '<p class="hm-dress-note">最多三件，点一下放、再点一下收；书架与瓶花挂墙，其余落地，长按可拖。</p>'
+ '<div class="hm-dress-row"><span class="hm-dress-cap">家具色</span><div class="hm-dress-main">'
+ [['', '跟屋子'], ['wood', '木色'], ['ink', '墨色'], ['warm', '暖色']].map(t =>
'<button type="button" class="hm-chip' + ((look.propTone || '') === t[0] ? ' on' : '') + '" data-proptone="' + t[0] + '">' + t[1] + '</button>').join('')
+ '</div></div>'
+ '<div class="hm-dress-row"><span class="hm-dress-cap">装修</span><div class="hm-dress-main">'
+ '<button type="button" class="hm-btn" data-hmgo="couple">去「我们的空间」换背景 · 暖光 · 字体</button>'
+ '</div></div>'
+ '<p class="hm-set-cap">灯与窗</p>'
+ '<div class="hm-dress-row"><span class="hm-dress-cap">灯</span><div class="hm-dress-main">'
+ '<button type="button" class="hm-chip' + (look.lampOn !== false ? ' on' : '') + '" data-lamp="on">开</button>'
+ '<button type="button" class="hm-chip' + (look.lampOn === false ? ' on' : '') + '" data-lamp="off">关</button>'
+ '</div></div>'
+ '<div class="hm-dress-row"><span class="hm-dress-cap">窗</span><div class="hm-dress-main">'
+ '<button type="button" class="hm-chip' + (look.winOpen === true ? ' on' : '') + '" data-win="open">开</button>'
+ '<button type="button" class="hm-chip' + (look.winOpen !== true ? ' on' : '') + '" data-win="closed">拉帘</button>'
+ '</div></div>'
+ '<p class="hm-dress-note">灯关掉＝夜里不再有灯晕、白天暖光也收掉；拉上帘子窗外就隔一层纱。</p>'
+ '<p class="hm-set-cap">窗台那盆花</p>'
+ '<div class="hm-dress-row" id="hmSetPlant"><span class="hm-dress-cap">花</span><div class="hm-dress-main">'
+ '<button type="button" class="hm-plant-big hm-plant small' + (watered ? ' is-watered' : '') + '" data-hmwater="1" data-hmplant="1" data-hm-thirst="' + _hmPlantThirst(plant) + '" data-hm-flower="' + (HM_FLOWER[plant.kind] ? plant.kind : '') + '" aria-label="给花浇水" title="' + (watered ? '今天已经浇过水了' : '浇点水') + '">'
+ _hmPlantSVG(plant) + '<span class="hm-water-drops" aria-hidden="true"><i></i><i></i><i></i></span></button>'
+ '<span class="hm-plant-st">' + plantStep + ' · 浇过 ' + plant.n + ' 次 · ' + (watered ? '今天浇过了' : '今天还没浇') + '</span>'
+ '</div></div>'
+ '<div class="hm-dress-row"><span class="hm-dress-cap">名字</span><div class="hm-dress-main">'
+ '<input class="hm-name-inp" id="hmPlantName" maxlength="12" placeholder="给它起个名字" value="' + escapeHTML(plant.nm || '') + '">'
+ '<button type="button" class="hm-btn" data-hmdo="plantcard">看记录</button>'
+ '</div></div>'
+ '<div class="hm-dress-row"><span class="hm-dress-cap">品种</span><div class="hm-dress-main">'
+ [['', '一盆花'], ['daisy', '雏菊'], ['bell', '铃兰'], ['rose', '小玫瑰']].map(t =>
'<button type="button" class="hm-chip' + ((plant.kind || '') === t[0] ? ' on' : '') + '" data-flower="' + t[0] + '">' + t[1] + '</button>').join('')
+ '</div></div>'
+ '<p class="hm-dress-note">点花就浇水，一天一次；浇 3 次长叶、7 次开花。两天没浇叶尖会垂，浇一次就回来。</p>'
+ '<p class="hm-set-cap">照片墙</p>'
+ '<div class="hm-dress-row"><span class="hm-dress-cap">墙上的照片</span><div class="hm-dress-main">' + psRow + '</div></div>'
+ '<p class="hm-dress-note">最多三张；会跟着备份走，别放太满。</p>'
+ '<div class="hm-dress-row"><span class="hm-dress-cap">相框</span><div class="hm-dress-main">'
+ [['', '白边'], ['wood', '木框'], ['polaroid', '拍立得']].map(t =>
'<button type="button" class="hm-chip' + (((look.photoFrame || '') === t[0]) ? ' on' : '') + '" data-pframe="' + t[0] + '">' + t[1] + '</button>').join('')
+ '<button type="button" class="hm-btn" data-hmcmd="photoswap">换位</button>'
+ '</div></div>'
+ '<div class="hm-dress-row"><span class="hm-dress-cap">那行字</span><div class="hm-dress-main">'
+ '<input class="hm-name-inp" id="hmPhotoNote" maxlength="16" placeholder="拍立得下面写一句" value="' + escapeHTML(look.photoNote || '') + '">'
+ '</div></div>'
+ '<p class="hm-set-cap">桌上</p>'
+ '<div class="hm-dress-row"><span class="hm-dress-cap">那张卡</span><div class="hm-dress-main">'
+ (look.card ? '<span class="hm-card-cut">' + escapeHTML(String(look.card.text).slice(0, 22)) + '</span>' : '<span class="hm-plant-hint">桌上空着</span>')
+ '<button type="button" class="hm-btn" data-hmdo="card">放一张字卡</button>'
+ '<button type="button" class="hm-btn" data-hmcmd="favcard">从收藏放一句</button>'
+ '</div></div>'
+ '<p class="hm-dress-note">' + (look.card && look.card.fav ? '这一句来自收藏，点桌上那张卡能回去看。' : '字卡与收藏摘句都行；桌上只放一张。') + '</p>'
+ '<p class="hm-set-cap">贴纸</p>'
+ '<div class="hm-dress-row"><span class="hm-dress-cap">TA 自己贴</span><div class="hm-dress-main">'
+ '<button type="button" class="hm-chip' + (look.stkOn === false ? '' : ' on') + '" data-stk="on">开</button>'
+ '<button type="button" class="hm-chip' + (look.stkOn === false ? ' on' : '') + '" data-stk="off">关</button>'
+ '<span class="hm-plant-hint">素材与每天那一掷在美化库</span>'
+ '</div></div>'
+ '<p class="hm-dress-note">这里只是这一间屋的总闸；贴哪一套、多久换一次，去美化库 → 贴纸／随机换装调（约 ' + prob + '%）。</p>'
+ '<p class="hm-set-cap">其他</p>'
+ '<div class="hm-dress-row"><span class="hm-dress-cap">存一张</span><div class="hm-dress-main">'
+ '<button type="button" class="hm-btn" data-hmcmd="shot">只存屋子</button>'
+ '<button type="button" class="hm-btn" data-hmcmd="shotpage">连门口一起</button>'
+ '</div></div>'
+ '<div class="hm-dress-row"><span class="hm-dress-cap">恢复出厂</span><div class="hm-dress-main">'
+ '<button type="button" class="hm-btn" data-hmcmd="hmreset">整间屋子回出厂</button>'
+ '</div></div>'
+ '<p class="hm-dress-note">恢复出厂只清这间屋的长相（背景/主色调/暖光/样子/摆件/照片/灯窗/贴纸/花），不动纸条、聊天与「我们的空间」那边。</p>'
+ '</div>';
}
function _hmPaintDress(cid) {
const body = document.getElementById('hmSetBody');
if (body) body.innerHTML = _hmDressHTML(cid);
_hmBindPlantInput(cid);
_hmBindPhotoNote(cid);
}
function _hmBindPlantInput(cid) {
const inp = document.getElementById('hmPlantName');
if (!inp) return;
inp.oninput = () => {
const o = _hmEnsure(cid);
const p = _hmPlantOf(cid);
p.nm = inp.value.trim().slice(0, 12);
o.look.plant = p;
save();
const nt = document.getElementById('hmPlantNote');
if (nt) nt.innerHTML = _hmPlantNoteText(p) + '。<span class="hm-plant-hint">点一下浇点水，一天一次。</span>'
+ '<button type="button" class="hm-plant-info" data-hmdo="plantcard">看它的成长记录</button>';
};
}
function _hmBindPhotoNote(cid) {
const inp = document.getElementById('hmPhotoNote');
if (!inp) return;
inp.oninput = () => {
const o = _hmEnsure(cid);
const v = inp.value.replace(/\s+/g, ' ').slice(0, 16);
o.look.photoNote = v;
save();
const box = document.querySelector('#hmBody .hm-photos');
if (!box) return;
let n = box.querySelector('.hm-photo-note');
const want = (box.getAttribute('data-hm-pframe') === 'polaroid' && v);
if (want && !n) { n = document.createElement('span'); n.className = 'hm-photo-note'; box.appendChild(n); }
if (want) n.textContent = v;
else if (n) n.remove();
};
}
function _hmSetOpen() {
const m = document.getElementById('hmSetMask');
if (!m) return;
const cid = _hmCid();
if (!cid) return;
_hmPaintDress(cid);
_hmBind(document.getElementById('hmPage'), cid);
m.hidden = false;
}
function _hmSetClose() { const m = document.getElementById('hmSetMask'); if (m) m.hidden = true; }
function _hmCommand(e, cid) {
if (e.currentTarget && e.currentTarget.id === 'hmSetMask' && e.target === e.currentTarget) { _hmSetClose(); return; }
const go = e.target.closest('[data-hmgo]');
if (go) {
const to = go.dataset.hmgo || '';
if (to && typeof showView === 'function') showView(to);
return;
}
if (!cid) return;
const du = e.target.closest('[data-hmdo]');
if (du) {
const a = du.dataset.hmdo || '';
if (a === 'listen') _hmDoListen(cid);
else if (a === 'deal') _hmDoDeal(cid);
else if (a === 'card') _hmPickOpen(cid);
else if (a === 'knock') _hmKnock(cid);
else if (a === 'note') _hmNoteOpen(cid);
else if (a === 'notes') _hmNotesOpen(cid);
else if (a === 'sit') _hmSitStart(cid);
else if (a === 'stand') _hmSitEnd(cid);
else if (a === 'plantcard') _hmPlantCard(cid);
else if (a === 'daylog') _hmDayLogOpen(cid);
else if (a === 'readcard') {
const cd = (_hmLookOf(cid) || {}).card;
if (cd && typeof openModal === 'function') openModal('桌上那张字卡', '', () => {}, { noInput: true, staticText: cd.text, okText: '知道了' });
}
return;
}
if (e.target.closest('[data-hmplant]')) { _hmWater(cid); return; }
const amb = e.target.closest('[data-hmamb]');
if (amb) { _hmAmbSet(cid, amb.getAttribute('data-hmamb') || ''); return; }
if (e.target.closest('[data-hmcalgo]')) {
if (typeof calJumpToDay === 'function' && typeof calTodayKey === 'function') calJumpToDay(calTodayKey());
else if (typeof showView === 'function') showView('calendar');
return;
}
if (e.target.closest('[data-hmobj]')) { _hmObjTalk(cid); return; }
const phv = e.target.closest('[data-hmphoto]');
if (phv) {
const ps = (_hmLookOf(cid) || {}).photos || [];
const s = ps[+phv.dataset.hmphoto];
if (s && typeof openLightbox === 'function') openLightbox(s);
return;
}
const cp = e.target.closest('[data-cardpick]');
if (cp) {
const body = document.getElementById('hmPickBody');
const isFav = !!(body && body._mode === 'fav');
const it = (body && body._pool) ? body._pool[+cp.dataset.cardpick] : null;
const t = isFav ? (it && it.text) : it;
if (t) {
const o = _hmEnsure(cid);
o.look.card = { id: '', text: String(t).slice(0, 200), cat: isFav ? '收藏摘句' : '主字卡', at: Date.now(), fav: isFav ? 1 : 0 };
save(); _hmPickClose(); _hmRepaint(cid); _hmPaintDress(cid);
showToast(isFav ? '从收藏放到桌上了。' : '放到桌上了。');
}
return;
}
const fimg = e.target.closest('[data-favimg]');
if (fimg) {
const body = document.getElementById('hmPickBody');
const s = (body && body._pool) ? body._pool[+fimg.dataset.favimg] : null;
const img = s && s.imgs && s.imgs[0];
if (img) {
const o = _hmEnsure(cid);
if (!Array.isArray(o.look.photos)) o.look.photos = [];
if (o.look.photos.length >= 3) { showToast('最多三张，先摘一张。'); return; }
o.look.photos.push(String(img));
o.look.photos = o.look.photos.slice(-3);
save(); _hmPickClose(); _hmRepaint(cid); _hmPaintDress(cid);
showToast('挂到墙上了。');
}
return;
}
if (e.target.closest('#hmPickMask') && e.target.id === 'hmPickMask') { _hmPickClose(); return; }
const pr = e.target.closest('[data-prop]');
if (pr) {
const k = pr.dataset.prop || '';
if (!HM_PROPS[k]) return;
if (!_hmUnlocked(k, cid)) {
const u = HM_UNLOCK.find(x => x.id === k);
showToast(u ? '还没解锁：' + u.hint : '');
return;
}
const o = _hmEnsure(cid);
const cur = _hmPropsOf(cid).slice();
const i = cur.findIndex(p => p.id === k);
if (i >= 0) cur.splice(i, 1);
else {
if (cur.length >= 3) { showToast('最多三件，先收一件。'); return; }
cur.push({ id: k });
}
o.look.props = cur;
save(); _hmRepaint(cid); _hmPaintDress(cid);
return;
}
const pf = e.target.closest('[data-pframe]');
if (pf) {
const o = _hmEnsure(cid);
const k = pf.getAttribute('data-pframe') || '';
o.look.photoFrame = (k === 'wood' || k === 'polaroid') ? k : '';
save(); _hmRepaint(cid); _hmPaintDress(cid);
return;
}
const flw = e.target.closest('[data-flower]');
if (flw) {
const o = _hmEnsure(cid);
if (!o.look.plant || typeof o.look.plant !== 'object') o.look.plant = _hmPlantOf(cid);
const k = flw.getAttribute('data-flower') || '';
o.look.plant.kind = HM_FLOWER[k] ? k : '';
save(); _hmRepaint(cid); _hmPaintDress(cid);
return;
}
const pt = e.target.closest('[data-proptone]');
if (pt) {
const o = _hmEnsure(cid);
o.look.propTone = pt.getAttribute('data-proptone') || '';
save(); _hmFurnInkApply(cid); _hmPaintDress(cid);
return;
}
const lm = e.target.closest('[data-lamp]');
if (lm) {
const o = _hmEnsure(cid);
o.look.lampOn = lm.dataset.lamp !== 'off';
save(); _hmApplyLook(); _hmPaintDress(cid);
return;
}
const wn = e.target.closest('[data-win]');
if (wn) {
const o = _hmEnsure(cid);
o.look.winOpen = wn.dataset.win === 'open';
save(); _hmApplyLook(); _hmPaintDress(cid);
return;
}
const sk = e.target.closest('[data-skin]');
if (sk) {
const k = sk.dataset.skin || '';
const def = HM_SKINS.find(x => x.k === k) || HM_SKINS[0];
const o = _hmEnsure(cid);
o.look.skin = def.k; o.look.tone = def.tone; o.look.glow = def.glow;
save(); _hmSwap(() => { _hmApplyLook(); _hmRepaint(cid); _hmPaintDress(cid); });
return;
}
const tn = e.target.closest('[data-tone]');
if (tn) {
const o = _hmEnsure(cid);
o.look.tone = tn.dataset.tone || '';
save(); _hmSwap(() => { _hmApplyLook(); _hmRepaint(cid); _hmPaintDress(cid); });
return;
}
const st = e.target.closest('[data-stk]');
if (st) {
const o = _hmEnsure(cid);
o.look.stkOn = st.dataset.stk !== 'off';
save(); _hmRepaint(cid); _hmPaintDress(cid);
return;
}
const cmd = e.target.closest('[data-hmcmd]');
if (!cmd) return;
const c = cmd.dataset.hmcmd;
if (c === 'shot') { try { _hmShotRoom(cid, 'room'); } catch (e) {} return; }
if (c === 'shotpage') { try { _hmShotRoom(cid, 'page'); } catch (e) {} return; }
if (c === 'photoswap') {
const o = _hmEnsure(cid);
const ps = Array.isArray(o.look.photos) ? o.look.photos.slice() : [];
if (ps.length < 2) { showToast('至少两张才能换位。'); return; }
ps.push(ps.shift());
o.look.photos = ps; save(); _hmRepaint(cid); _hmPaintDress(cid);
const box = document.querySelector('#hmBody .hm-photos');
if (box) { box.classList.add('is-swap'); setTimeout(() => { if (box) box.classList.remove('is-swap'); }, 340); }
showToast('换了个位置。');
return;
}
if (c === 'photopick') { _hmPhotoPick(cid); return; }
if (c === 'favcard') { _hmPickOpen(cid, 'fav'); return; }
if (c === 'favphoto') { _hmPickOpen(cid, 'favphoto'); return; }
if (c === 'photoclear') {
const o = _hmEnsure(cid);
const i = Math.max(0, +cmd.dataset.i || 0);
if (Array.isArray(o.look.photos) && i < o.look.photos.length) {
o.look.photos.splice(i, 1);
save(); _hmRepaint(cid); _hmPaintDress(cid);
showToast('照片摘下来了。');
}
return;
}
if (c === 'bgpick') { const f = document.getElementById('hmFile'); if (f) f.click(); return; }
if (c === 'bgclear') {
const o = _hmEnsure(cid);
o.look.bg = ''; o.look.bgLuma = null;
save(); _hmSwap(() => { _hmApplyLook(); _hmRepaint(cid); _hmPaintDress(cid); });
return;
}
if (c === 'stkroll') {
_hmStkTick(cid, true);
_hmSwap(() => { _hmPaintStk(cid); _hmPaintDress(cid); });
return;
}
if (c === 'stkclear') {
const o = _hmEnsure(cid);
o.look.dz = null;
save(); _hmPaintStk(cid); _hmPaintDress(cid);
return;
}
if (c === 'hmreset') {
const o = _hmEnsure(cid);
o.look = _hmLookDefault();
save(); _hmSwap(() => { _hmApplyLook(); _hmPaintStk(cid); _hmRepaint(cid); _hmPaintDress(cid); });
return;
}
}
function _hmBind(page, cid) {
if (!page || !cid) return;
const _hmClick = e => _hmCommand(e, cid);
page.onclick = _hmClick;
const setMask = document.getElementById('hmSetMask');
if (setMask) setMask.onclick = _hmClick;
const pickMask = document.getElementById('hmPickMask');
if (pickMask) pickMask.onclick = _hmClick;
const pickClose = document.getElementById('hmPickClose');
if (pickClose) pickClose.onclick = () => _hmPickClose();
const setBtn = document.getElementById('hmSetBtn');
if (setBtn) setBtn.onclick = () => _hmSetOpen();
const setClose = document.getElementById('hmSetClose');
if (setClose) setClose.onclick = () => _hmSetClose();
_hmBindPlantInput(cid);
_hmBindPhotoNote(cid);
const toneInp = document.getElementById('hmTone');
if (toneInp && !toneInp._hmBound) {
toneInp._hmBound = 1;
toneInp.addEventListener('input', () => {
if (!/^#[0-9a-fA-F]{6}$/.test(toneInp.value)) return;
const o = _hmEnsure(cid);
o.look.tone = toneInp.value;
save(); _hmApplyLook();
});
}
const glowInp = document.getElementById('hmGlow');
if (glowInp && !glowInp._hmBound) {
glowInp._hmBound = 1;
glowInp.addEventListener('input', () => {
const o = _hmEnsure(cid);
const v = Number(glowInp.value);
o.look.glow = isFinite(v) ? Math.min(30, Math.max(0, Math.round(v))) : 0;
save(); _hmApplyLook();
});
}
const fileInp = document.getElementById('hmFile');
if (fileInp && !fileInp._hmBound) {
fileInp._hmBound = 1;
fileInp.addEventListener('change', () => {
const f = fileInp.files && fileInp.files[0];
fileInp.value = '';
if (!f) return;
const rd = new FileReader();
rd.onload = () => {
const put = img => {
const o = _hmEnsure(cid);
o.look.bg = img;
save(); _hmSwap(() => { _hmApplyLook(); _hmRepaint(cid); _hmPaintDress(cid); });
if (typeof _imgLuma === 'function') {
try {
_imgLuma(img).then(l => {
o.look.bgLuma = (typeof l === 'number' && isFinite(l)) ? Math.round(l * 1000) / 1000 : null;
save(); _hmApplyLook();
}).catch(() => {});
} catch (e) {}
}
};
if (typeof compressImageDataURL === 'function') compressImageDataURL(String(rd.result), 1600, 0.85).then(put);
else put(String(rd.result));
};
rd.readAsDataURL(f);
});
}
}
function homeApproach(cid) {
if (!cid || typeof _cjEntry !== 'function' || typeof _cjHist !== 'function' || typeof _cjHiding !== 'function') return;
const c = (data.contacts || []).find(x => x.id === cid);
if (!c || c.kind === 'group') return;
const root = (data.cjian && typeof data.cjian === 'object') ? data.cjian : null;
if (!root || root.enabled === false) return;
const en = _cjEntry(cid);
if (_cjHiding(en)) return;
const now = Date.now();
if (en.p !== 'near') {
en.p = 'near'; en.sinceP = now;
if (typeof _cjRollDir === 'function') { en.dir = _cjRollDir('near'); en.sinceD = now; }
}
const hist = Array.isArray(en.hist) ? en.hist : [];
let lastN = null;
for (let i = hist.length - 1; i >= 0; i--) { if (hist[i] && hist[i].k === 'n') { lastN = hist[i]; break; } }
if (!lastN || now - (lastN.ts || 0) >= 30 * 60000) {
_cjHist(cid, { k: 'n', t: '……你来到了我们的家。', ts: now });
save();
}
}
function _hmFootHTML() {
return '<div class="hm-foot">'
+ '<button type="button" class="hm-go" data-hmgo="chat">回聊天</button>'
+ '<span class="hm-dot" aria-hidden="true">·</span>'
+ '<button type="button" class="hm-go" data-hmgo="couple">去我们的空间</button>'
+ '</div>';
}
function renderHomePage() {
const page = document.getElementById('hmPage');
if (!page) return;
const host = document.getElementById('hmBody') || page;
const cid = _hmCid();
const ta = _hmContact();
const st = page.scrollTop;
if (!cid || !ta) {
_hmApplyLook();
_hmPaintStk('');
_hmPageAttrs(null, '');
host.classList.remove('hm-anim');
host.innerHTML = '<div class="hm-none"><span class="e">'
+ '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="16" cy="24" r="6"/><path d="M22 24h18M34 24v6M40 24v4"/></svg>'
+ '</span><p>我们的家按联系人一份。<br>从一位联系人（单聊）的聊天页左滑进来，或回首页长按那一位会话、在动作单里点「我们的家」。</p>'
+ '<button type="button" class="hm-btn hm-none-go" data-hmgo="chats">去聊天页</button></div>';
page.onclick = e => _hmCommand(e, '');
const sb0 = document.getElementById('hmSetBtn');
if (sb0) sb0.hidden = true;
page.scrollTop = st;
return;
}
_hmApplyLook();
_hmPropsNormalize(cid);
const sb1 = document.getElementById('hmSetBtn');
if (sb1) sb1.hidden = false;
if (typeof _cjEntry !== 'function' && typeof ensureChunk === 'function') {
ensureChunk('cjian', 9000).then(ok => { if (ok && typeof _cjEntry === 'function') _hmRepaint(cid); });
}
const visitN = _hmVisitBump(cid);
const en = (typeof _cjEntry === 'function') ? _cjEntry(cid) : null;
_hmPageAttrs(en, cid);
host.innerHTML = _hmHeroHTML(ta, cid, en, visitN)
+ '<div class="hm-room">'
+ _hmFurnHTML(cid) + _hmLiveHTML(en, cid) + _hmPhotosHTML(cid) + _hmPlantHTML(cid) + _hmDecorHTML(cid, en)
+ '</div>'
+ _hmDayHTML(cid, en) + _hmCalNoteHTML(cid) + _hmDoHTML(cid, en) + _hmFootHTML();
host.classList.add('hm-anim');
if (_hmStkTick(cid, false)) _hmPaintStk(cid);
else _hmPaintStk(cid);
_hmPaintDress(cid);
_hmBind(page, cid);
_hmShotBind();
homeApproach(cid);
_hmNoteReplyTick(cid);
_hmFurnDrag(cid);
page.scrollTop = st;
if (!_hmLiveT) _hmLiveT = setInterval(_hmLiveTick, 30000);
}
var _hmLiveT = null;
function _hmLiveTick() {
if (document.body.dataset.view !== 'home') {
if (_hmLiveT) { clearInterval(_hmLiveT); _hmLiveT = 0; }
_hmSitEnd(true);
return;
}
const cid = _hmCid();
if (!cid) return;
const en = (typeof _cjEntry === 'function') ? _cjEntry(cid) : null;
_hmPageAttrs(en, cid);
const host = document.getElementById('hmLiveSec');
if (!host) return;
const wrap = document.createElement('div');
wrap.innerHTML = _hmLiveHTML(en, cid);
const fresh = wrap.firstChild;
if (fresh && host.innerHTML !== fresh.innerHTML) {
host.innerHTML = fresh.innerHTML;
host.classList.remove('hm-fade');
void host.offsetWidth;
host.classList.add('hm-fade');
}
const actObj = document.querySelector('.hm-decor .hm-actobj');
if (actObj) {
const away = (typeof _cjHiding === 'function' && _cjHiding(en));
const act = away ? 'away' : ((en && en.a && HM_ACT_OBJ[en.a]) ? en.a : 'unknown');
const obj = HM_ACT_OBJ[act] || HM_ACT_OBJ.unknown;
if (actObj.title !== obj.n) { actObj.innerHTML = obj.svg; actObj.title = obj.n; }
}
}
function _hmRepaint(cid) {
const page = document.getElementById('hmPage');
if (!page || document.body.dataset.view !== 'home') return;
const ta = _hmContact();
if (!ta || ta.id !== cid) return;
const host = document.getElementById('hmBody') || page;
const st = page.scrollTop;
host.classList.remove('hm-anim');
const en = (typeof _cjEntry === 'function') ? _cjEntry(cid) : null;
_hmPageAttrs(en, cid);
_hmPropsNormalize(cid);
host.innerHTML = _hmHeroHTML(ta, cid, en, (_hmVisit && _hmVisit.n) || 1)
+ '<div class="hm-room">'
+ _hmFurnHTML(cid) + _hmLiveHTML(en, cid) + _hmPhotosHTML(cid) + _hmPlantHTML(cid) + _hmDecorHTML(cid, en)
+ '</div>'
+ _hmDayHTML(cid, en) + _hmCalNoteHTML(cid) + _hmDoHTML(cid, en) + _hmFootHTML();
_hmPaintStk(cid);
_hmPaintDress(cid);
_hmBind(page, cid);
_hmShotBind();
page.scrollTop = st;
}
(window.__CHUNK_OK__ = window.__CHUNK_OK__ || {})['home'] = true;
