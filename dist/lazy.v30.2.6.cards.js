// 本件由 tools/assemble.py 生成·勿手改：首屏 JS 分片（进这一页那一刻才取），源＝js/ 那些拆分件
var _groupSearchTimer = null;
$('#cardsSearchRow') && $('#cardsSearchRow').addEventListener('input', e => {
if (e.target.id !== 'groupSearchInput') return;
const v = e.target.value;
if (_groupSearchTimer) clearTimeout(_groupSearchTimer);
_groupSearchTimer = setTimeout(() => { _groupSearchTimer = null; groupSearch = v; renderGroups(); }, 220);
});
var _gsToggleFirst = false;
if ($('#cardsSearchToggle')) $('#cardsSearchToggle').onclick = () => {
const inp = $('#groupSearchInput');
if (!inp) return;
if (!_gsToggleFirst) { _gsToggleFirst = true; _bindSearchKbFix(inp); }
const vis = (window.ceBoxOf && ceBoxOf(inp)) || inp;
inp.focus();
try { vis.scrollIntoView({ block: 'nearest' }); } catch {}
};
function _bindSearchKbFix(inp) {
let prev;
inp.addEventListener('focus', () => { prev = document.body.dataset.kbFix; document.body.dataset.kbFix = 'off'; });
inp.addEventListener('blur', () => { if (prev === undefined) delete document.body.dataset.kbFix; else document.body.dataset.kbFix = prev; prev = undefined; });
}
if ($('#cardsMoreBtn')) $('#cardsMoreBtn').onclick = () => { $('#cardsMoreMask').hidden = false; };
if ($('#cardsMoreClose')) $('#cardsMoreClose').onclick = () => { $('#cardsMoreMask').hidden = true; };
$('#cardsMoreMask') && $('#cardsMoreMask').addEventListener('click', e => { if (e.target === $('#cardsMoreMask')) $('#cardsMoreMask').hidden = true; });
$('#cardsMoreMask') && $('#cardsMoreMask').addEventListener('click', e => { if (e.target.closest('.cards-menu-item')) $('#cardsMoreMask').hidden = true; });
var _bindGi = -1;
function _newGroup(name, category) {
return { name, category, scope: currentCardsScope, cards: [] };
}
function _newGroupOwnerOf() {
if (currentCardsScope !== 'own') return '';
if (!currentCardsWho || currentCardsWho === 'all' || currentCardsWho === '_none') return '';
return (data.contacts || []).some(c => c && c.kind !== 'group' && c.id === currentCardsWho) ? currentCardsWho : '';
}
function openCardsBindSheet(gi) {
const g = data.groups[gi];
if (!g || g.system) return;
_bindGi = gi;
const cur = g.contactId || '';
const row = (id, av, label) => `<button class="bind-row" data-bind-id="${escapeHTML(id)}"><span class="bind-av${id ? '' : ' free'}">${av}</span>${escapeHTML(label)}${cur === id ? '<span class="bind-check">✓</span>' : ''}</button>`;
const rest = (data.groups || []).filter(x => x && !x.preset && !x.system && cardScope(x) === 'own' && !x.contactId && x !== g);
const alsoHtml = rest.length
? `<label class="bind-all"><input type="checkbox" id="cardsBindAlso"><span>同时把其余 ${rest.length} 个未绑定分组也绑给 TA</span></label>`
: '';
const owners = (data.contacts || []).filter(c => c && c.kind !== 'group');
const emptyHtml = owners.length
? ''
: '<div class="bind-empty">还没有联系人：先到聊天页右上加一位，再来把字卡绑给 TA。</div>';
$('#cardsBindList').innerHTML =
(cur ? '' : '<div class="bind-note">这组卡现在是「未绑定」＝哪位 TA 都取不到；点下面一位，这组就归 TA 用。</div>') +
row('', '∅', '未绑定（TA 用不到这组字卡）') +
owners.map(c => row(c.id, contactAvatarHTML(c), fixedNameOf(c) || '未命名')).join('') +
emptyHtml + alsoHtml;
$('#cardsBindMask').hidden = false;
}
function _closeCardsBind() {
$('#cardsBindMask').hidden = true;
}
if ($('#cardsBindClose')) $('#cardsBindClose').onclick = _closeCardsBind;
$('#cardsBindMask') && $('#cardsBindMask').addEventListener('click', e => {
if (e.target === $('#cardsBindMask')) { _closeCardsBind(); return; }
const r = e.target.closest('[data-bind-id]');
if (!r || _bindGi < 0 || !data.groups[_bindGi]) return;
const id = r.dataset.bindId;
const also = !!(document.getElementById('cardsBindAlso') && document.getElementById('cardsBindAlso').checked);
_closeCardsBind();
data.groups[_bindGi].contactId = id;
let extra = 0;
if (id && also) {
(data.groups || []).forEach(x => {
if (x && !x.preset && !x.system && x !== data.groups[_bindGi] && cardScope(x) === 'own' && !x.contactId) { x.contactId = id; extra++; }
});
}
save();
renderGroups();
const nm = (data.contacts || []).find(c => c.id === id);
showToast(!id ? '已解绑 · TA 用不到这组字卡'
: '已绑定：' + (fixedNameOf(nm) || '未命名') + (extra ? `（连同另外 ${extra} 组一起给了 TA）` : ''));
});
var _nameOk = null;
function _askGroupName(o) {
_nameOk = typeof o.onOk === 'function' ? o.onOk : null;
$('#cardsNameTitle').textContent = o.title || '新建分组';
$('#cardsNameHint').textContent = o.hint || '名字会显示在分组列表里';
$('#cardsNameOk').textContent = o.okText || '创建';
$('#cardsNameInput').value = o.value || '';
$('#cardsNameMask').hidden = false;
$('#cardsNameInput').focus();
$('#cardsNameInput').select();
}
function _closeNamePanel() { $('#cardsNameMask').hidden = true; _nameOk = null; }
if ($('#cardsNameClose')) $('#cardsNameClose').onclick = _closeNamePanel;
if ($('#cardsNameCancel')) $('#cardsNameCancel').onclick = _closeNamePanel;
$('#cardsNameMask') && $('#cardsNameMask').addEventListener('click', e => { if (e.target === $('#cardsNameMask')) _closeNamePanel(); });
if ($('#cardsNameOk')) $('#cardsNameOk').onclick = () => {
const name = $('#cardsNameInput').value.trim();
if (!name) { showToast('先起个分组名'); return; }
const ok = _nameOk; _closeNamePanel();
if (ok) ok(name);
};
$('#cardsNameInput') && $('#cardsNameInput').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('#cardsNameOk').click(); } });
function _createNewGroup() {
_askGroupName({
value: '新字卡组',
onOk: async name => {
const ng = _newGroup(name, currentCardsTab); ng.contactId = _newGroupOwnerOf();
data.groups.push(ng);
cardsSelectGroup(data.groups.length - 1, name);
groupSearch = '';
await save();
renderGroups();
}
});
}
if ($('#newCardGroup')) $('#newCardGroup').onclick = () => { $('#cardsPlusMask').hidden = false; };
if ($('#cardsPlusClose')) $('#cardsPlusClose').onclick = () => { $('#cardsPlusMask').hidden = true; };
$('#cardsPlusMask') && $('#cardsPlusMask').addEventListener('click', e => { if (e.target === $('#cardsPlusMask')) $('#cardsPlusMask').hidden = true; });
$('#cardsPlusMask') && $('#cardsPlusMask').addEventListener('click', e => { if (e.target.closest('.cards-menu-item')) $('#cardsPlusMask').hidden = true; });
if ($('#plusImportJson')) $('#plusImportJson').onclick = _pickCardsFile;
if ($('#plusImportTxt')) $('#plusImportTxt').onclick = _openCardsImp;
if ($('#plusAddBatch')) $('#plusAddBatch').onclick = () => _openAddCardsBatch();
if ($('#plusNewGroup')) $('#plusNewGroup').onclick = _createNewGroup;
if ($('#plusAddImg')) $('#plusAddImg').onclick = () => _addCardImagesFlow($('#plusAddImg'));
var _groupPickQ = '';
function _paintGroupPick() {
const list = $('#cardsGroupPickList');
if (!list) return;
const q = _groupPickQ.trim().toLowerCase();
const rows = (cardsPickGroups || []).filter(x => !q || String(x.name).toLowerCase().includes(q));
const allRow = q ? '' : `<button type="button" class="cards-pick-row group-pick-row" data-group-pick=""${selectedGroupGi < 0 && !selectedGroupName ? ' data-active="true"' : ''}><span class="gp-name">全部</span><span class="gp-meta">${cardsPickTotal} 张</span></button>`;
list.innerHTML = allRow + (rows.length
? rows.map(x => `<button type="button" class="cards-pick-row group-pick-row" data-group-pick="${escapeHTML(x.key)}" data-group-pick-gi="${x.gi}"${(selectedGroupGi >= 0 ? selectedGroupGi === x.gi : selectedGroupName === x.key) ? ' data-active="true"' : ''}><span class="gp-name">${escapeHTML(x.name)}</span><span class="gp-meta">${x.off ? '<i class="gp-off">停用</i>' : ''}${x.bind ? `<span class="gp-bind${x.bind === '未绑定' ? ' free' : ''}">${escapeHTML(x.bind)}</span>` : ''}${x.n} 张</span></button>`).join('')
: '<div class="bind-empty">没有匹配的分组</div>');
}
function _placeGroupPick() {
const view = $('#cardsView');
const btn = view && view.querySelector('[data-cards-group-all]');
const panel = $('#cardsGroupPickMask .cards-gpick-panel');
if (!view || !btn || !panel) return;
const vr = view.getBoundingClientRect(), br = btn.getBoundingClientRect();
const pad = 20, pw = panel.offsetWidth;
const left = Math.max(pad, Math.min(br.left - vr.left + view.scrollLeft, view.clientWidth - pw - pad));
panel.style.left = left + 'px';
const nav = $('#mainTabbar');
const navTop = (nav && nav.getBoundingClientRect().height > 0) ? nav.getBoundingClientRect().top : window.innerHeight;
const GAP = 8, SAFE = 10, MIN_ROOM = 276;
const roomBelow = navTop - br.bottom - GAP - SAFE;
const roomAbove = br.top - vr.top - GAP - SAFE;
const goUp = roomBelow < MIN_ROOM && roomAbove > roomBelow;
const room = Math.max(0, goUp ? roomAbove : roomBelow);
panel.style.maxHeight = Math.min(360, room) + 'px';
let topPx = goUp
? (br.top - vr.top + view.scrollTop) - GAP - panel.offsetHeight
: (br.bottom - vr.top + view.scrollTop) + GAP;
if (goUp) {
const topCeil = (navTop - vr.top + view.scrollTop) - SAFE - panel.offsetHeight;
topPx = Math.min(topPx, topCeil);
}
panel.style.top = Math.max(8, topPx) + 'px';
}
function _reflowGroupPick() { const m = $('#cardsGroupPickMask'); if (m && !m.hidden) _placeGroupPick(); }
window.addEventListener('resize', _reflowGroupPick);
if (window.visualViewport) window.visualViewport.addEventListener('resize', _reflowGroupPick);
function _closeGroupPick() { const m = $('#cardsGroupPickMask'); if (m) m.hidden = true; }
function _openGroupPick() {
_groupPickQ = '';
const inp = $('#cardsGroupPickSearch');
if (inp) inp.value = '';
_paintGroupPick();
$('#cardsGroupPickMask').hidden = false;
_placeGroupPick();
scrollMemRestore($('#cardsGroupPickList'), 'cardspick');
if (inp && matchMedia('(hover:hover) and (pointer:fine)').matches) inp.focus();
}
scrollMemWatch($('#cardsGroupPickList'), 'cardspick');
if ($('#cardsGroupPickClose')) $('#cardsGroupPickClose').onclick = _closeGroupPick;
document.addEventListener('click', e => {
const m = $('#cardsGroupPickMask');
if (!m || m.hidden) return;
if (e.target.closest('#cardsGroupPickMask') || e.target.closest('[data-cards-group-all]')) return;
m.hidden = true;
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') _closeGroupPick(); });
$('#cardsGroupPickSearch') && $('#cardsGroupPickSearch').addEventListener('input', () => { _groupPickQ = $('#cardsGroupPickSearch').value; _paintGroupPick(); });
$('#cardsGroupPickList') && $('#cardsGroupPickList').addEventListener('click', e => {
const b = e.target.closest('[data-group-pick]');
if (!b) return;
cardsSelectGroup(b.dataset.groupPickGi === undefined ? -1 : Number(b.dataset.groupPickGi), b.dataset.groupPick || '');
$('#cardsGroupPickMask').hidden = true;
renderGroups();
});
function _clearCardsSearch() {
groupSearch = '';
const inp = $('#groupSearchInput');
if (inp) inp.value = '';
}
var _cardsUndo = null, _cardsUndoEl = null, _cardsUndoTimer = null;
function _cardsUndoClose() {
if (_cardsUndoTimer) { clearTimeout(_cardsUndoTimer); _cardsUndoTimer = null; }
if (_cardsUndoEl) { _cardsUndoEl.remove(); _cardsUndoEl = null; }
_cardsUndo = null;
}
function _cardsUndoShow(label, stash, paint) {
_cardsUndoClose();
_cardsUndo = { stash: stash, paint: paint };
const el = document.createElement('div');
el.className = 'cards-undo-toast';
el.innerHTML = `<span class="cards-undo-tx">${escapeHTML(label)}</span><button type="button" class="cards-undo-btn">撤销</button>`;
el.querySelector('.cards-undo-btn').onclick = async () => {
const st = _cardsUndo && _cardsUndo.stash, pt = _cardsUndo && _cardsUndo.paint;
_cardsUndoClose();
if (!st) return;
(st.groups || []).forEach(({ gi, g }) => { if (gi >= data.groups.length) data.groups.push(g); else data.groups.splice(gi, 0, g); });
(st.items || []).forEach(({ gi, ci, card, off }) => {
const g = data.groups[gi];
if (!g || !g.cards) return;
if (ci >= g.cards.length) g.cards.push(card); else g.cards.splice(ci, 0, card);
if (off) cardSetOff(g, card, true);
});
cardsSelectGroup(-1, '');
await save();
if (typeof pt === 'function') pt();
};
document.body.appendChild(el);
_cardsUndoEl = el;
void el.offsetWidth;
el.className = 'cards-undo-toast show';
_cardsUndoTimer = setTimeout(_cardsUndoClose, 6000);
}
async function _cardsListClick(e) {
if (_lpFired) { _lpFired = false; return; }
const root = e.currentTarget;
const presetOnly = root.id === 'sysCardList';
const paint = () => renderGroups('#' + root.id, presetOnly ? '#sysCardsSub' : '#cardsSub', presetOnly);
const sc = e.target.closest('[data-cards-scope]');
if (sc) { currentCardsScope = sc.dataset.cardsScope; saveCardsScope(); cardsSelectGroup(-1, ''); _clearCardsSearch(); cardsBatchSel.clear(); paint(); updateBatchBar(); return; }
const tab = e.target.closest('[data-cards-tab]');
if (tab) { if (presetOnly) currentSysCardsTab = tab.dataset.cardsTab; else currentCardsTab = tab.dataset.cardsTab; cardsSelectGroup(-1, ''); _clearCardsSearch(); cardsBatchSel.clear(); paint(); updateBatchBar(); return; }
if (e.target.closest('[data-cards-group-all]')) { _openGroupPick(); return; }
if (e.target.closest('[data-cards-tidy]')) { showView('cardtidy'); return; }
const chip = e.target.closest('[data-group-chip]');
if (chip) { cardsSelectGroup(chip.dataset.groupGi === undefined ? -1 : Number(chip.dataset.groupGi), chip.dataset.groupChip); paint(); return; }
const who = e.target.closest('[data-cards-who]');
if (who) { saveCardsWho(who.dataset.cardsWho); cardsSelectGroup(-1, ''); _clearCardsSearch(); cardsBatchSel.clear(); paint(); updateBatchBar(); return; }
if (e.target.closest('[data-cards-who-open]')) { _cardsWhoOpen = !_cardsWhoOpen; paint(); return; }
const so = e.target.closest('[data-cards-sort]');
if (so) { cardsSort = so.dataset.cardsSort || 'default'; saveCardsSort(); paint(); return; }
const gr = e.target.closest('[data-group-rename]');
if (gr) {
if (cardsBatchMode) return;
const rgi = Number(gr.dataset.groupRename);
const rg = data.groups[rgi];
if (!rg || rg.system || rg.preset) return;
_askGroupName({
title: '重命名分组',
okText: '确定',
hint: '名字会显示在分组列表里',
value: rg.name || '',
onOk: async name => {
if (rg.name === name) return;
if ((data.groups || []).some((x, xi) => xi !== rgi && x && x.name === name)) { showToast('已经有同名分组了'); return; }
const oldName = rg.name;
rg.name = name;
if (selectedGroupGi === rgi || selectedGroupName === oldName) cardsSelectGroup(rgi, name);
await save();
paint();
showToast('已改名');
}
});
return;
}
const gb = e.target.closest('[data-group-bind]');
if (gb) { openCardsBindSheet(Number(gb.dataset.groupBind)); return; }
const gs = e.target.closest('[data-group-scope]');
if (gs) {
const sgi = Number(gs.dataset.groupScope);
const sg = data.groups[sgi];
if (!sg || sg.system || sg.preset) return;
if (cardScope(sg) !== 'own') return;
currentCardsScope = 'public';
saveCardsScope();
sg.scope = 'public';
sg.contactId = '';
await save();
paint();
showToast('已改成公用 · 所有会话都用得到');
return;
}
const ve = e.target.closest('[data-card-voice-export]');
if (ve) {
const row = _voiceRowAt(ve.dataset.group + ':' + ve.dataset.card);
if (row) _exportVoiceOne(row); else showToast('这张卡的录音不在库里了');
return;
}
if (presetOnly) return;
const gai = e.target.closest('[data-group-add-img]');
if (gai) { if (_ownAddBlocked()) { _ownAddBlockTip(); return; } _imgTargetGi = Number(gai.dataset.groupAddImg); _pickCardImages(gai); return; }
const gaf = e.target.closest('[data-add-img-flow]');
if (gaf) { _addCardImagesFlow(gaf); return; }
const gva = e.target.closest('[data-group-voice-add]');
if (gva) { _addVoiceFlow(gva, Number(gva.dataset.groupVoiceAdd)); return; }
const gvf = e.target.closest('[data-add-voice-flow]');
if (gvf) { _addVoiceFlow(gvf); return; }
const gtf = e.target.closest('[data-add-text-flow]');
if (gtf) { _addTextFlow(gtf); return; }
if (cardsBatchMode && !presetOnly) {
const item = e.target.closest('[data-sel-key]');
if (item) {
const k = item.dataset.selKey;
if (cardsBatchSel.has(k)) { cardsBatchSel.delete(k); item.removeAttribute('data-sel'); }
else { cardsBatchSel.add(k); item.setAttribute('data-sel', '1'); }
updateBatchBar();
}
return;
}
const gd = e.target.closest('[data-group-delete]');
const cd = e.target.closest('[data-card-delete]');
const ce = e.target.closest('[data-card-edit]');
const ga = e.target.closest('[data-group-idx]');
const ca = e.target.closest('[data-category]');
const go = e.target.closest('[data-group-off]');
if (go) {
const ogi = Number(go.dataset.groupOff);
const og = data.groups[ogi];
if (!og) return;
og.off = !og.off;
await save();
paint();
showToast(og.off ? `已停用分组「${og.name || '未命名'}」：TA 用不到这组字卡（组内单卡开关原样保留）`
: `已启用分组「${og.name || '未命名'}」：恢复使用`);
return;
}
const csSrc = e.target.closest('[data-cards-src]');
if (csSrc) {
const ow = (data.contacts || []).find(c => c && c.id === currentCardsWho && c.kind !== 'group');
if (!ow) return;
const k = csSrc.dataset.cardsSrc === 'public' ? 'noPubCards' : 'noOwnCards';
if (ow[k]) delete ow[k]; else ow[k] = 1;
await save();
paint();
showToast(ow[k]
? (k === 'noPubCards' ? '已关闭：TA 的自动取卡不再用公用字卡' : '已关闭：TA 名下的专属字卡全部停用')
: (k === 'noPubCards' ? '已恢复：TA 重新使用公用字卡' : '已恢复：TA 重新使用专属字卡'));
return;
}
const co = e.target.closest('[data-card-off]');
if (co) {
const cgi = Number(co.dataset.group), cci = Number(co.dataset.card);
const cg = data.groups[cgi];
const card = cg && cg.cards ? cg.cards[cci] : null;
if (card == null) return;
const nowOff = !cardIsOff(cg, card);
cardSetOff(cg, card, nowOff);
await save();
paint();
const lab = cardText(card) || (cardImage(card) ? '这张图' : (voiceCardParts(card) || {}).name || '这张卡');
showToast((nowOff ? '已停用：' : '已恢复：') + (lab.length > 18 ? lab.slice(0, 18) + '…' : lab));
return;
}
if (gd) {
const dgi = Number(gd.dataset.groupDelete);
const dg = data.groups[dgi];
if (!dg) return;
data.groups.splice(dgi, 1);
if (selectedGroupGi === dgi) cardsSelectGroup(-1, '');
else if (selectedGroupGi > dgi) selectedGroupGi--;
await save();
paint();
_cardsUndoShow(`已删除分组「${dg.name || '未命名'}」`, { groups: [{ gi: dgi, g: dg }] }, paint);
return;
}
if (cd) {
const gi = Number(cd.dataset.group);
const ci = Number(cd.dataset.card);
const g = data.groups[gi];
const card = g && g.cards ? g.cards[ci] : null;
if (card == null) return;
const wasOff = cardIsOff(g, card);
const v = voiceCardParts(card);
const show = String(v ? v.name : card);
cardOffPrune(g, card);
g.cards.splice(ci, 1);
await save();
paint();
_cardsUndoShow(`已删除「${show.length > 18 ? show.slice(0, 18) + '…' : show}」`, { items: [{ gi: gi, ci: ci, card: card, off: wasOff }] }, paint);
return;
}
if (ce) { openCardEdit(Number(ce.dataset.group), Number(ce.dataset.card), paint); return; }
if (ga) { if (_ownAddBlocked()) { _ownAddBlockTip(); return; } _clOpen(Number(ga.dataset.groupIdx)); return; }
if (ca) {
const cat = ca.dataset.category;
_askGroupName({
value: '新字卡组',
onOk: async name => {
const ng2 = _newGroup(name, cat); ng2.contactId = _newGroupOwnerOf();
data.groups.push(ng2);
await save();
paint();
}
});
return;
}
const pv = e.target.closest('[data-sel-key]');
if (pv && pv.classList.contains('card-img-item')) { _openCardPreview(pv.dataset.selKey, presetOnly, paint); return; }
await save();
paint();
}
$('#groupList') && $('#groupList').addEventListener('click', _cardsListClick);
$('#sysCardList') && $('#sysCardList').addEventListener('click', _cardsListClick);
var _pvKey = null, _pvPreset = false, _pvAudio = null, _pvPaint = null, _pvObjUrl = '', _pvPending = false;
function _pvStopAudio() {
if (_pvAudio) { try { _pvAudio.pause(); } catch (e) {} _pvAudio = null; }
if (_pvObjUrl) { try { URL.revokeObjectURL(_pvObjUrl); } catch (e) {} _pvObjUrl = ''; }
_pvPending = false;
}
function _closeCardPreview() {
_pvStopAudio();
const m = $('#cardsPvMask');
if (m) m.hidden = true;
_pvKey = null; _pvPaint = null;
}
var _pvZ = { z: 1, x: 0, y: 0, ox: 50, oy: 50, pts: new Map(), d0: 0, z0: 1, tapT: 0, moved: false };
function _pvZApply(img) {
img.style.transformOrigin = _pvZ.z > 1 ? _pvZ.ox + '% ' + _pvZ.oy + '%' : '50% 50%';
img.style.transform = _pvZ.z > 1 ? 'translate(' + _pvZ.x + 'px,' + _pvZ.y + 'px) scale(' + _pvZ.z + ')' : '';
img.classList.toggle('zoomed', _pvZ.z > 1);
}
function _pvZClamp(img) {
const mx = img.offsetWidth * (_pvZ.z - 1) / 2, my = img.offsetHeight * (_pvZ.z - 1) / 2;
_pvZ.x = Math.max(-mx, Math.min(mx, _pvZ.x));
_pvZ.y = Math.max(-my, Math.min(my, _pvZ.y));
}
function _pvZReset(img) { _pvZ.z = 1; _pvZ.x = 0; _pvZ.y = 0; _pvZ.ox = 50; _pvZ.oy = 50; _pvZApply(img); }
function _pvZWire(img) {
if (!img) return;
_pvZReset(img);
img.addEventListener('pointerdown', e => {
try { img.setPointerCapture(e.pointerId); } catch (err) {}
_pvZ.pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
_pvZ.moved = false;
if (_pvZ.pts.size === 2) {
const ps = [..._pvZ.pts.values()];
_pvZ.d0 = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y);
_pvZ.z0 = _pvZ.z;
}
});
img.addEventListener('pointermove', e => {
const p = _pvZ.pts.get(e.pointerId);
if (!p) return;
if (_pvZ.pts.size === 2) {
p.x = e.clientX; p.y = e.clientY;
const ps = [..._pvZ.pts.values()];
const d = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y);
if (_pvZ.d0 > 0) {
_pvZ.z = Math.min(6, Math.max(1, _pvZ.z0 * d / _pvZ.d0));
if (_pvZ.z <= 1.02) { _pvZReset(img); } else { _pvZClamp(img); _pvZApply(img); }
}
return;
}
if (_pvZ.z > 1) {
const dx = e.clientX - p.x, dy = e.clientY - p.y;
if (Math.abs(dx) + Math.abs(dy) > 2) _pvZ.moved = true;
_pvZ.x += dx; _pvZ.y += dy;
p.x = e.clientX; p.y = e.clientY;
_pvZClamp(img); _pvZApply(img);
}
});
const up = e => {
_pvZ.pts.delete(e.pointerId);
if (_pvZ.pts.size < 2) _pvZ.d0 = 0;
if (_pvZ.moved) { _pvZ.tapT = 0; return; }
const now = Date.now();
if (now - _pvZ.tapT < 300) {
_pvZ.tapT = 0;
if (_pvZ.z > 1) { _pvZReset(img); }
else {
const r = img.getBoundingClientRect();
_pvZ.ox = Math.round(((e.clientX - r.left) / Math.max(1, r.width)) * 100);
_pvZ.oy = Math.round(((e.clientY - r.top) / Math.max(1, r.height)) * 100);
_pvZ.z = 2.5; _pvZ.x = 0; _pvZ.y = 0;
_pvZApply(img);
}
} else _pvZ.tapT = now;
};
img.addEventListener('pointerup', up);
img.addEventListener('pointercancel', e => { _pvZ.pts.delete(e.pointerId); _pvZ.d0 = 0; });
}
function _openCardPreview(key, presetOnly, paint) {
const p = String(key).split(':');
const g = data.groups[+p[0]];
const card = g && g.cards ? g.cards[+p[1]] : null;
if (card == null) return;
_pvStopAudio();
_pvKey = String(key); _pvPreset = !!presetOnly; _pvPaint = paint || null;
const img = cardImage(card), v = img ? null : voiceCardParts(card), txt = v ? '' : cardText(card);
const body = $('#cardsPvBody');
if (img) {
body.innerHTML = `<img class="cards-pv-img" src="${escapeHTML(img)}" alt="字卡图片">`;
_pvZWire(body.querySelector('.cards-pv-img'));
} else if (v) {
body.innerHTML = `<button type="button" class="cards-pv-play" data-pv-play>▶ 试听</button>`
+ `<div class="cards-pv-name">${escapeHTML(screenSafeText(v.name))}</div>`
+ (v.text && v.text !== v.name ? `<div class="cards-pv-text">${escapeHTML(screenSafeText(v.text))}</div>` : '');
} else {
body.innerHTML = `<div class="cards-pv-text">${escapeHTML(screenSafeText(txt || String(card)))}</div>`;
}
const eb = $('#cardsPvEdit');
if (eb) eb.hidden = _pvPreset || (img != null) || (!v && !txt);
const meta = $('#cardsPvMeta');
if (meta) {
const bits = [g.name || '未命名', g.category || '主字卡', _pvPreset ? '系统预设' : (cardScope(g) === 'own' ? '专属' : '公用')];
if (g.off || cardIsOff(g, card)) bits.push('已停用');
meta.textContent = bits.join(' · ');
}
$('#cardsPvMask').hidden = false;
}
(function _wireCardPreview() {
const mask = $('#cardsPvMask');
if (!mask) return;
mask.addEventListener('click', e => { if (e.target === mask) _closeCardPreview(); });
$('#cardsPvClose').onclick = _closeCardPreview;
$('#cardsPvCancel').onclick = _closeCardPreview;
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mask.hidden) _closeCardPreview(); });
$('#cardsPvEdit').onclick = () => {
const k = _pvKey, paint = _pvPaint;
_closeCardPreview();
if (!k) return;
const p = k.split(':');
openCardEdit(+p[0], +p[1], paint || (() => renderGroups()));
};
$('#cardsPvBody').addEventListener('click', e => {
const btn = e.target.closest('[data-pv-play]');
if (!btn) return;
const p = String(_pvKey || '').split(':');
const g = data.groups[+p[0]];
const card = g && g.cards ? g.cards[+p[1]] : null;
const v = card != null ? voiceCardParts(card) : null;
if (!v || !v.data) { showToast('这张卡上没有音频数据（可能导入或存储时没带上）'); return; }
if (_pvAudio) { _pvStopAudio(); btn.textContent = '▶ 试听'; return; }
if (_pvPending) return;
_pvPending = true;
btn.textContent = '⏸ 暂停';
const fail = msg => { _pvStopAudio(); btn.textContent = '▶ 试听'; if (msg) showToast(msg); };
const start = src => {
_pvPending = false;
try { _pvAudio = new Audio(src); } catch (err) { fail('这段录音放不出来'); return; }
_pvAudio.onended = () => { _pvStopAudio(); btn.textContent = '▶ 试听'; };
_pvAudio.onerror = () => fail('这段录音的数据读不出来（可能没存全），试试「设置→数据」导出一份备份核对');
const playing = _pvAudio.play();
if (playing && playing.catch) playing.catch(() => fail('浏览器没让播这一下，稍停半秒再点一次试试'));
};
if (v.data.indexOf('mmref:') === 0) {
(async () => {
let real = null;
try { real = (typeof mmVoiceURL === 'function') ? await mmVoiceURL(v.data) : null; } catch (err) { real = null; }
if (_pvPending === false) return;
if (!real) { fail('这段录音不在这台设备上了（语音不进备份，换设备后不跟过去）'); return; }
start(real);
})();
return;
}
if (v.data.indexOf('data:') === 0 && typeof URL !== 'undefined' && URL.createObjectURL && window.fetch) {
window.fetch(v.data).then(r => r.blob()).then(b => {
if (_pvPending === false) return;
_pvObjUrl = URL.createObjectURL(b);
start(_pvObjUrl);
}).catch(() => start(v.data));
} else start(v.data);
});
})();
function _cardsAbsorbLines(g, lines) {
const out = { added: 0, dup: 0, skip: 0 };
const imgCat = isImageCat(g.category || '主字卡');
(lines || []).forEach(raw => {
const s = String(raw == null ? '' : raw).trim();
if (!s) return;
const src = imageSrcOf(s);
if (src) {
if (!imgCat) { out.skip++; return; }
if (g.cards.some(x => cardImage(x) === src)) { out.dup++; return; }
g.cards.push({ img: src }); out.added++; return;
}
if (!textCardOK(s)) { out.skip++; return; }
if (g.cards.includes(s)) { out.dup++; return; }
g.cards.push(s); out.added++;
});
return out;
}
function _cardsSkipTail(skip) {
return skip ? `，${skip} 行没收（图请走「添加图片」，文字卡不收图也不收读不懂的字节）` : '';
}
var _clGi = -1, _clDone = null;
function _clGroup(gi) { const g = (data.groups || [])[gi]; return g && !g.system && !g.preset ? g : null; }
function _clPickList(extraGi) {
const cat = currentCardsTab;
const ok = g => g && !g.preset && !g.system && (g.category || '主字卡') === cat && cardScope(g) === currentCardsScope;
const out = [], seen = {};
const add = gi => { const g = data.groups[gi]; if (!ok(g) || seen[gi]) return; seen[gi] = 1; out.push({ gi, g }); };
const rows = (typeof cardsPickGroups !== 'undefined' && cardsPickGroups) ? cardsPickGroups : [];
rows.forEach(x => add(x.gi));
if (Number.isInteger(extraGi) && extraGi >= 0 && !seen[extraGi]) add(extraGi);
return out;
}
function _clPaintGroups() {
const row = $('#clGrpRow');
if (!row) return;
const list = _clPickList(_clGi);
row.innerHTML = list.length
? list.map(({ gi, g }) => `<button type="button" class="fchip${gi === _clGi ? ' on' : ''}" data-cl-grp="${gi}">${escapeHTML(g.name || '未命名')}<span class="n">${(g.cards || []).length}</span></button>`).join('')
: '<span class="cl-grp-empty">这一类还没有分组，点右上「＋ 新建分组」起一个</span>';
const cur = _clGroup(_clGi);
const ti = $('#cardLinesTi');
if (ti) ti.textContent = cur ? '往「' + cur.name + '」加字卡' : '添加字卡';
}
function _clOpen(gi, onDone) {
const given = _clGroup(gi) ? gi : -1;
const first = _clPickList(given)[0];
_clGi = given >= 0 ? given : (first ? first.gi : -1);
_clDone = typeof onDone === 'function' ? onDone : null;
const inp = $('#cardLinesInput');
if (inp) inp.value = '';
const nr = $('#clGrpNewRow'); if (nr) nr.hidden = true;
_clPaintGroups();
const mask = $('#cardLinesMask'); if (mask) mask.hidden = false;
if (inp) setTimeout(() => { try { inp.focus(); } catch (e) {} }, 60);
}
function _clClose() {
const m = $('#cardLinesMask'); if (m) m.hidden = true;
const nr = $('#clGrpNewRow'); if (nr) nr.hidden = true;
_clGi = -1; _clDone = null;
}
function _clSubmit() {
const g = _clGroup(_clGi), done = _clDone;
if (!g) { _clPaintGroups(); showToast('先选一组，或点右上「＋ 新建分组」起一个'); return; }
const inp = $('#cardLinesInput');
const raw = inp ? inp.value : '';
if (!String(raw).trim()) { showToast('先写一张'); return; }
const lines = String(raw).split(/\r\n|\r|\n|\u2028|\u2029/).map(s => s.trim()).filter(Boolean);
const r = _cardsAbsorbLines(g, lines);
save();
renderGroups();
showToast((r.added ? `加了 ${r.added} 张${r.dup ? `，${r.dup} 张这组里已有` : ''}` : (r.dup ? '这些这组里已有' : '没加进一张')) + _cardsSkipTail(r.skip));
_clClose();
if (done) done();
}
var _clYes = $('#cardLinesYes'); if (_clYes) _clYes.onclick = _clSubmit;
var _clNo = $('#cardLinesNo'); if (_clNo) _clNo.onclick = _clClose;
var _clX = $('#cardLinesClose'); if (_clX) _clX.onclick = _clClose;
var _clMask = $('#cardLinesMask');
if (_clMask) _clMask.addEventListener('click', e => { if (e.target === _clMask) _clClose(); });
var _clGrpRowBox = $('#clGrpRow');
if (_clGrpRowBox) _clGrpRowBox.addEventListener('click', e => {
const b = e.target.closest('[data-cl-grp]');
if (!b) return;
const gi = Number(b.dataset.clGrp);
if (!_clGroup(gi)) return;
_clGi = gi;
_clPaintGroups();
});
var _clNewRow = $('#clGrpNewRow'), _clNewInput = $('#clGrpNewInput'), _clNewOk = $('#clGrpNewOk');
var _clNewBtn = $('#clGrpNew');
if (_clNewBtn) _clNewBtn.onclick = () => {
if (!_clNewRow) return;
_clNewRow.hidden = false;
if (_clNewInput) {
_clNewInput.value = '';
setTimeout(() => { try { _clNewInput.focus(); } catch (e) {} }, 30);
}
};
var _clNewNo = $('#clGrpNewNo');
if (_clNewNo) _clNewNo.onclick = () => { if (_clNewRow) _clNewRow.hidden = true; };
if (_clNewOk) _clNewOk.onclick = async () => {
if (_ownAddBlocked()) { _ownAddBlockTip(); return; }
const name = String(_clNewInput ? _clNewInput.value : '').trim();
if (!name) { showToast('先起个分组名'); return; }
const cat = currentCardsTab;
const owner = _newGroupOwnerOf();
const same = data.groups.findIndex(g => g && !g.preset && !g.system && (g.category || '主字卡') === cat && cardScope(g) === currentCardsScope && (g.name || '') === name
&& (currentCardsScope !== 'own' || (g.contactId || '') === owner));
let gi = same;
if (gi < 0) { const ng = _newGroup(name, cat); ng.contactId = owner; data.groups.push(ng); gi = data.groups.length - 1; }
cardsSelectGroup(gi, name); groupSearch = '';
await save();
renderGroups();
_clGi = gi;
if (_clNewRow) _clNewRow.hidden = true;
_clPaintGroups();
showToast(same >= 0 ? '已有同名分组，就加进这一组' : '已新建「' + name + '」');
};
if (_clNewInput) _clNewInput.addEventListener('keydown', e => {
if (e.key === 'Enter') { e.preventDefault(); if (_clNewOk) _clNewOk.click(); }
});
function visibleCardKeys() {
const q = groupSearch.trim().toLowerCase();
const searching = !!q;
const keys = [];
for (let gi = 0; gi < data.groups.length; gi++) {
const g = data.groups[gi];
if (g.preset) continue;
if (cardScope(g) !== currentCardsScope) continue;
if (searching) {
if (PRESET_ONLY_CATEGORIES.includes(g.category || '主字卡')) continue;
} else {
if ((g.category || '主字卡') !== currentCardsTab) continue;
if (!cardsBatchMode && (selectedGroupGi >= 0 ? gi !== selectedGroupGi : (selectedGroupName && g.name !== selectedGroupName))) continue;
}
for (let ci = 0; ci < g.cards.length; ci++) {
if (q && !cardSearchHit(g.cards[ci], q)) continue;
keys.push(`${gi}:${ci}`);
}
}
return keys;
}
function _batchBtnLabel(btn, text) {
const lab = btn.querySelector('.menu-label');
if (lab) lab.textContent = text; else btn.textContent = text;
}
function updateBatchBar() {
const el = $('#batchSelCount');
if (el) el.textContent = `已选 ${cardsBatchSel.size} 项`;
const ex = $('#batchExportVoice');
if (ex) ex.hidden = currentCardsTab !== '语音' && !String(groupSearch || '').trim();
}
function exitCardsBatch() {
cardsBatchMode = false;
cardsBatchSel.clear();
const bar = $('#cardsBatchBar');
if (bar) bar.hidden = true;
const btn = $('#toggleBatchCards');
if (btn) { _batchBtnLabel(btn, '批量管理'); btn.classList.remove('active'); }
renderGroups();
}
if ($('#toggleBatchCards')) $('#toggleBatchCards').onclick = () => {
if (cardsBatchMode) { exitCardsBatch(); return; }
enterCardsBatch('');
};
if ($('#batchSelectAll')) $('#batchSelectAll').onclick = () => {
const all = visibleCardKeys();
if (cardsBatchSel.size === all.length && all.length) cardsBatchSel.clear();
else { cardsBatchSel.clear(); all.forEach(k => cardsBatchSel.add(k)); }
renderGroups();
updateBatchBar();
};
if ($('#batchMove')) $('#batchMove').onclick = () => {
if (!cardsBatchSel.size) { showToast('先勾选要移动的字卡'); return; }
$('#cardsMoveList').innerHTML = data.groups.map((g, i) => ({ g, i })).filter(x => x.g && !x.g.preset && !x.g.system).map(({ g, i }) => {
const c = g.contactId ? (data.contacts || []).find(x => x.id === g.contactId) : null;
return `<button type="button" class="cards-pick-row" data-move-gi="${i}">${escapeHTML(g.name)}<small>（${g.category || '主字卡'}·${cardScope(g) === 'public' ? '公用' : '专属'}${c ? '·@' + escapeHTML(fixedNameOf(c) || '未命名') : ''}）</small></button>`;
}).join('');
$('#cardsMoveMask').hidden = false;
scrollMemRestore($('#cardsMoveList'), 'cardsmove');
};
scrollMemWatch($('#cardsMoveList'), 'cardsmove');
if ($('#cardsMoveClose')) $('#cardsMoveClose').onclick = () => { $('#cardsMoveMask').hidden = true; };
if ($('#cardsMoveCancel')) $('#cardsMoveCancel').onclick = () => { $('#cardsMoveMask').hidden = true; };
$('#cardsMoveMask') && $('#cardsMoveMask').addEventListener('click', e => { if (e.target === $('#cardsMoveMask')) $('#cardsMoveMask').hidden = true; });
$('#cardsMoveList') && $('#cardsMoveList').addEventListener('click', async e => {
const r = e.target.closest('[data-move-gi]');
if (!r) return;
const ti = Number(r.dataset.moveGi);
$('#cardsMoveMask').hidden = true;
if (!(ti >= 0) || ti >= data.groups.length) return;
if (data.groups[ti].preset || data.groups[ti].system) return;
const byGroup = {};
for (const k of cardsBatchSel) { const p = k.split(':'); const gi = +p[0], ci = +p[1]; byGroup[gi] = byGroup[gi] || []; byGroup[gi].push(ci); }
const moved = [];
for (const gi of Object.keys(byGroup).map(Number)) {
const cis = byGroup[gi].sort((a, b) => b - a);
for (const ci of cis) { const txt = data.groups[gi].cards.splice(ci, 1)[0]; if (txt != null) moved.push(txt); }
}
let added = 0;
for (const t of moved) if (!data.groups[ti].cards.includes(t)) { data.groups[ti].cards.push(t); added++; }
cardsBatchSel.clear();
await save();
renderGroups();
updateBatchBar();
showToast(`已把 ${added} 张字卡放进「${data.groups[ti].name || '未命名'}」` + (moved.length !== added ? `（${moved.length - added} 张组里已有，跳过重复）` : ''));
});
if ($('#batchDelete')) $('#batchDelete').onclick = async () => {
if (!cardsBatchSel.size) return;
const stash = [];
const byGroup = {};
for (const k of cardsBatchSel) { const p = k.split(':'); const gi = +p[0], ci = +p[1]; byGroup[gi] = byGroup[gi] || []; byGroup[gi].push(ci); }
for (const gi of Object.keys(byGroup).map(Number)) {
const cis = byGroup[gi].sort((a, b) => b - a);
for (const ci of cis) { const g = data.groups[gi]; const c = g && g.cards ? g.cards[ci] : null; if (c == null) continue; stash.push({ gi: gi, ci: ci, card: c, off: cardIsOff(g, c) }); cardOffPrune(g, c); g.cards.splice(ci, 1); }
}
stash.sort((a, b) => (a.gi - b.gi) || (a.ci - b.ci));
const n = stash.length;
cardsBatchSel.clear();
await save();
renderGroups();
updateBatchBar();
_cardsUndoShow(`已删除 ${n} 张字卡`, { items: stash }, () => { renderGroups(); updateBatchBar(); });
};
if ($('#batchCancel')) $('#batchCancel').onclick = exitCardsBatch;
function openCardEdit(gi, ci, paint) {
const g = data.groups[gi];
const card = g && g.cards ? g.cards[ci] : null;
if (card == null) return;
if (typeof card !== 'string') { showToast('图片字卡没有文字可改'); return; }
if (voiceCardParts(card)) { openVoiceCardEdit(gi, ci, paint); return; }
const ask = cur => openModal('编辑字卡', cur, async val => {
const t = String(val || '').trim();
if (!t) { showToast('先写点什么'); ask(''); return; }
const next = t;
if (next === card) return;
if (g.cards.includes(next)) { showToast('这组里已有这句'); ask(t); return; }
cardOffPrune(g, card);
g.cards[ci] = next;
await save();
if (typeof paint === 'function') paint(); else renderGroups();
showToast('已保存');
});
ask(card);
}
var _veKey = '', _vePaint = null;
function openVoiceCardEdit(gi, ci, paint) {
const mask = $('#cardsVoiceMask'), nameEl = $('#cardsVoiceName'), textEl = $('#cardsVoiceText');
if (!mask || !nameEl || !textEl) return;
const g = data.groups[gi];
const card = g && g.cards ? g.cards[ci] : null;
const v = voiceCardParts(card);
if (!v) return;
_veKey = gi + ':' + ci;
_vePaint = typeof paint === 'function' ? paint : (() => renderGroups());
nameEl.value = v.name || '';
textEl.value = (v.text && v.text !== v.name) ? v.text : '';
mask.hidden = false;
}
function _closeVoiceEdit() { const m = $('#cardsVoiceMask'); if (m) m.hidden = true; }
function _voiceEditClean(s, oneLine) {
const t = String(s || '').replace(/\|+/g, ' ');
return oneLine ? t.replace(/\s+/g, ' ').trim() : t.trim();
}
async function _voiceEditSave() {
const p = String(_veKey || '').split(':');
const g = data.groups[+p[0]];
const ci = +p[1];
const card = g && g.cards ? g.cards[ci] : null;
const v = voiceCardParts(card);
if (!v) { _closeVoiceEdit(); showToast('这张卡已经不在了'); return; }
const name = _voiceEditClean($('#cardsVoiceName').value, true);
const text = _voiceEditClean($('#cardsVoiceText').value, false);
if (!name) { showToast('先给这条语音起个名字'); return; }
const next = [name, v.tts || '', text || name, v.data].join('|||');
_closeVoiceEdit();
if (next === card) return;
cardOffPrune(g, card);
g.cards[ci] = next;
await save();
if (_vePaint) _vePaint();
showToast('已保存');
}
if ($('#cardsVoiceClose')) $('#cardsVoiceClose').onclick = _closeVoiceEdit;
if ($('#cardsVoiceCancel')) $('#cardsVoiceCancel').onclick = _closeVoiceEdit;
if ($('#cardsVoiceOk')) $('#cardsVoiceOk').onclick = () => { _voiceEditSave(); };
$('#cardsVoiceMask') && $('#cardsVoiceMask').addEventListener('click', e => { if (e.target === $('#cardsVoiceMask')) _closeVoiceEdit(); });
var _lpTimer = null, _lpFired = false, _lpX = 0, _lpY = 0;
function _lpCancel() { if (_lpTimer) { clearTimeout(_lpTimer); _lpTimer = null; } }
function enterCardsBatch(firstKey) {
cardsBatchMode = true;
cardsBatchSel.clear();
if (firstKey) cardsBatchSel.add(firstKey);
$('#cardsBatchBar').hidden = false;
const btn = $('#toggleBatchCards');
if (btn) { _batchBtnLabel(btn, '退出管理'); btn.classList.add('active'); }
renderGroups();
updateBatchBar();
showToast('已进入批量管理 · 点字卡勾选');
}
var _gl = $('#groupList');
_gl.addEventListener('pointerdown', e => {
if (cardsBatchMode || (e.pointerType === 'mouse' && e.button !== 0)) return;
const item = e.target.closest('.card-item');
if (!item || !item.dataset.selKey || e.target.closest('button')) return;
_lpCancel();
_lpX = e.clientX; _lpY = e.clientY;
_lpTimer = setTimeout(() => { _lpTimer = null; _lpFired = true; enterCardsBatch(item.dataset.selKey); }, 500);
});
['pointerup', 'pointercancel', 'pointerleave'].forEach(t => _gl.addEventListener(t, _lpCancel));
_gl.addEventListener('pointermove', e => { if (_lpTimer && (Math.abs(e.clientX - _lpX) > 8 || Math.abs(e.clientY - _lpY) > 8)) _lpCancel(); });
_gl.addEventListener('contextmenu', e => { if (e.target.closest('.card-item')) e.preventDefault(); });
var _MOCHI_CAT = { text: '主字卡', kaomoji: '颜文字', emoji: 'emoji', sticker: '表情包', image: '图片', poke: '拍一拍', voice: '语音' };
function _mochiCatOf(t) { return _MOCHI_CAT[t] || null; }
function _mergeMochiLibs(a, b) {
const out = {};
Object.keys(a || {}).forEach(k => { out[k] = Array.isArray(a[k]) ? a[k].slice() : []; });
Object.keys(b || {}).forEach(k => { out[k] = (out[k] || []).concat(Array.isArray(b[k]) ? b[k] : []); });
return out;
}
function _parseMochiCards(parsed, fname) {
if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
if (parsed.app === 'mochi-ccfull' && parsed.data && typeof parsed.data === 'object') {
const d = parsed.data;
const pick = (main, fun) => !main && !fun ? null : (main && fun ? _mergeMochiLibs(main, fun) : (main || fun));
return { public: pick(d.ccPub, d.ccPubFun), own: pick(d.ccOwn, d.ccOwnFun) };
}
const keys = Object.keys(parsed);
const isRawLib = keys.length > 0 && keys.every(k => parsed[k] == null || Array.isArray(parsed[k])) &&
keys.some(k => Array.isArray(parsed[k]) && parsed[k].length && Array.isArray(parsed[k][0]) && typeof parsed[k][0][0] === 'string');
if (!isRawLib) return null;
return { raw: parsed };
}
function _askMochiScope(fname) {
return new Promise(resolve => {
openModal('mochi 字卡导入', '', () => resolve('public'), {
noInput: true,
staticText: '检测到 mochi 字卡库数据（' + (fname || '未命名文件') + '）。导入到哪一边？',
okText: '导入到公用',
midBtn: { label: '导入到专属', onPick: () => resolve('own') },
onCancel: () => resolve(null)
});
});
}
function _ownContactOk(id) {
if (!id || typeof id !== 'string') return false;
return (data.contacts || []).some(c => c && c.kind !== 'group' && c.id === id);
}
function _ordContactsMapOf(parsed) {
const m = parsed && parsed.ordContacts;
if (!m || typeof m !== 'object' || Array.isArray(m) || !Object.keys(m).length) return null;
return m;
}
function _ordOwnersOf(parsed) {
if (!parsed || parsed.app !== 'mochi-ccfull') return null;
const d = parsed.data;
if (!d || !d.ccOwn || d.ccOwnFun) return null;
const src = parsed.ordOwners;
if (!src || typeof src !== 'object' || Array.isArray(src)) return null;
return (catKey, pi) => {
const arr = src[catKey];
if (!Array.isArray(arr) || pi < 0 || pi >= arr.length) return '';
return typeof arr[pi] === 'string' ? arr[pi] : '';
};
}
async function _importMochiLib(lib, scope, stat, jobs, created, owner, ownerAt) {
const batch = owner || '';
const perPair = (scope === 'own' && typeof ownerAt === 'function') ? ownerAt : null;
Object.keys(lib || {}).forEach(t => {
const cat = _mochiCatOf(t);
const pairs = lib[t];
if (!cat || !Array.isArray(pairs)) return;
pairs.forEach((pair, pi) => {
if (!Array.isArray(pair) || typeof pair[0] !== 'string' || !Array.isArray(pair[1])) return;
const one = perPair ? perPair(t, pi) : '';
const own = _ownContactOk(one) ? one : batch;
let target = data.groups.find(x => !x.system && cardScope(x) === scope && (x.category || '主字卡') === cat && x.name === pair[0]
&& (scope !== 'own' || (x.contactId || '') === own));
if (!target) { target = { name: pair[0], category: cat, scope, cards: [] }; if (scope === 'own') target.contactId = own; data.groups.push(target); if (created) created.push(target); }
pair[1].forEach(c => {
if (typeof c !== 'string' || !c) return;
if (voiceCardParts(c)) { if (!target.cards.includes(c)) { target.cards.push(c); stat[scope]++; } return; }
const bar = c.indexOf('|||');
const media = bar > 0 ? c.slice(bar + 3) : c;
if ((cat === '表情包' || cat === '图片') && media.indexOf('data:image/') === 0) { jobs.push({ target, src: media }); return; }
if (!textCardOK(c)) return;
if (!target.cards.includes(c)) { target.cards.push(c); stat[scope]++; }
});
});
});
markPresetGroups(data.groups);
await new Promise(r => setTimeout(r, 0));
}
async function _importFlushMedia(jobs, prog, stat) {
for (let i = 0; i < jobs.length; i++) {
const j = jobs[i];
let img = j.src;
if (img.length > 384 * 1024) {
try { const c2 = await compressImageDataURL(img, 512); if (c2 && c2.length && c2.length < img.length) img = c2; } catch {}
}
if (!j.target.cards.some(x => cardImage(x) === img)) { j.target.cards.push({ img }); if (stat) stat[cardScope(j.target)]++; }
if ((i % 10 === 9 || i === jobs.length - 1)) {
if (prog) prog(Math.round(((i + 1) / jobs.length) * 100), '图片 ' + (i + 1) + '/' + jobs.length);
await new Promise(r => setTimeout(r, 0));
}
}
}
async function _importOrdinalGroups(groups, created, owner) {
const batch = owner || '';
groups.forEach(g => {
if (!g || typeof g.name !== 'string' || !Array.isArray(g.cards)) return;
if (g.system) return;
const own = _ownContactOk(g.contactId) ? g.contactId : batch;
const cat = (CARD_CATEGORIES.includes(g.category) && !PRESET_ONLY_CATEGORIES.includes(g.category)) ? g.category : '主字卡';
const scope = (g.scope === 'public' || g.scope === 'own') ? g.scope : currentCardsScope;
let target = data.groups.find(x => !x.system && x.name === g.name && (x.category || '主字卡') === cat && cardScope(x) === scope
&& (scope !== 'own' || (x.contactId || '') === own));
if (!target) { target = { name: g.name, category: cat, scope, cards: [] }; if (scope === 'own') target.contactId = own; data.groups.push(target); if (created) created.push(target); }
g.cards.forEach(c => {
const img = cardImage(c);
if (img) { if (!target.cards.some(x => cardImage(x) === img)) target.cards.push({ img }); }
else if (typeof c === 'string' && !target.cards.includes(c)) target.cards.push(c);
});
});
markPresetGroups(data.groups);
await save();
renderGroups();
}
function _readTextFile(f) {
if (typeof f.text === 'function') {
return Promise.resolve(f.text()).catch(() => null);
}
return null;
}
async function _fileToText(f) {
const direct = await _readTextFile(f);
if (typeof direct === 'string') return direct;
return await new Promise((res, rej) => {
const r = new FileReader();
r.onload = () => res(String(r.result || ''));
r.onerror = () => rej(r.error || new Error('文件读取失败'));
r.readAsText(f);
});
}
function _closeCardsPaste() { $('#cardsPasteMask').hidden = true; }
var _cardsPasteMode = 'json';
var _CARDS_PASTE_PH = { json: '把整份 JSON 内容贴进来：既认 言字卡 导出的字卡包，也认 mochi 导出的字卡库', txt: '把整份 TXT 内容贴进来：【】里是分组名，一行一张' };
var _CARDS_PASTE_TAIL = { json: '这一条不用挑文件：先把整份 JSON 复制下来，贴进上面的框里再点导入。', txt: '这一条不用挑文件：先把那份 TXT 整份复制进来，【】里是分组名、一行一张，后面的分组与查重和「挑文件」完全一样。' };
function _openCardsPaste(why, mode) {
_cardsPasteMode = mode === 'txt' ? 'txt' : 'json';
const hint = $('#cardsPasteHint');
if (hint && (why || _cardsPasteMode === 'txt')) hint.textContent = (why || '') + _CARDS_PASTE_TAIL[_cardsPasteMode];
const box = $('#cardsPasteInput');
if (box) { box.value = ''; box.placeholder = _CARDS_PASTE_PH[_cardsPasteMode]; }
$('#cardsPasteMask').hidden = false;
}
if ($('#cardsPasteClose')) $('#cardsPasteClose').onclick = _closeCardsPaste;
if ($('#cardsPasteCancel')) $('#cardsPasteCancel').onclick = _closeCardsPaste;
$('#cardsPasteMask') && $('#cardsPasteMask').addEventListener('click', e => { if (e.target === $('#cardsPasteMask')) _closeCardsPaste(); });
if ($('#cardsPasteOk')) $('#cardsPasteOk').onclick = async () => {
const text = ($('#cardsPasteInput').value || '').trim();
if (!text) { showToast('先把字卡文件的内容贴进上面的框里'); return; }
_closeCardsPaste();
if (_cardsPasteMode === 'txt') {
_closeCardsImp();
showProgress('正在导入字卡…');
await progressYield();
await _importTxtText(text, '粘贴的内容');
return;
}
await _runCardsImport(() => Promise.resolve(text), '粘贴的 JSON', text.length);
};
var _cdPickWatch = null;
function _pickCardsFile() {
const inp = $('#cardsInput');
if (!inp) return;
_clearPickWatch();
let picked = false, left = false;
const stop = () => { picked = true; _clearPickWatch(); };
const away = () => { left = true; };
const onHidden = () => { if (document.hidden) left = true; };
inp.addEventListener('change', stop, { once: true });
window.addEventListener('blur', away);
document.addEventListener('visibilitychange', onHidden);
_cdPickWatch = { inp, stop, away, onHidden };
_cdPickWatch.timer = setTimeout(() => {
_clearPickWatch();
if (picked || left) return;
_openCardsPaste('这边的文件选择器没能弹出来。');
}, 1400);
try { inp.click(); } catch (e) { _clearPickWatch(); _openCardsPaste('文件选择器起不来。'); }
}
function _clearPickWatch() {
const w = _cdPickWatch;
if (!w) return;
_cdPickWatch = null;
clearTimeout(w.timer);
if (w.inp) w.inp.removeEventListener('change', w.stop);
window.removeEventListener('blur', w.away);
document.removeEventListener('visibilitychange', w.onHidden);
}
if ($('#importCards')) $('#importCards').onclick = _pickCardsFile;
if ($('#cardsInput')) $('#cardsInput').onchange = async e => {
const f = e.target.files && e.target.files[0];
e.target.value = '';
if (f && $('#cardsPasteMask') && !$('#cardsPasteMask').hidden) _closeCardsPaste();
if (!f) return;
await _runCardsImport(() => _fileToText(f), f.name, f.size || 0);
};
var _ownBatch = null, _ownWait = null;
var _ownerPickWait = null;
function _closeCardsOwn() {
$('#cardsOwnMask').hidden = true;
_ownBatch = null;
const pick = _ownerPickWait; _ownerPickWait = null;
const r = _ownWait; _ownWait = null;
if (pick) pick(null);
if (r) r(null);
}
async function _resumeProgress(msg) {
showProgress(msg);
await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
}
async function _askOwnerBeforeImport(o) {
if (!o || !o.hasOwn || o.hasMap || currentCardsScope !== 'own') return { asked: false, owner: '' };
if (!(data.contacts || []).some(c => c && c.kind !== 'group')) return { asked: false, owner: '' };
hideProgress();
const owner = await _askCardsOwner({
title: '这批专属字卡给谁',
hint: (o.groupsN ? `这次进来 ${o.groupsN} 组` : '这批') + '专属字卡：点一位就整批挂到 TA 名下；同名分组也只会并进这位名下的那一组。「暂不绑定」＝先放库里，卡面随时能改。'
});
return owner === null ? null : { asked: true, owner };
}
function _ownResOf(id, created) {
const list = (created || []).filter(g => g && cardScope(g) === 'own');
const nm = (data.contacts || []).find(c => c && c.id === id);
return { name: id ? (fixedNameOf(nm) || '未命名') : '', groups: list.length, cards: list.reduce((s, g) => s + (g.cards || []).length, 0) };
}
function _askCardsOwner(o) {
const contacts = (data.contacts || []).filter(c => c && c.kind !== 'group');
if (!contacts.length) return Promise.resolve('');
const cur = currentCardsWho;
const row = (id, av, label) => `<button class="bind-row" data-own-id="${escapeHTML(id)}"><span class="bind-av${id ? '' : ' free'}">${av}</span>${escapeHTML(label)}${cur === id ? '<span class="bind-check">✓</span>' : ''}</button>`;
const head = $('#cardsOwnTitle');
if (head) head.textContent = (o && o.title) || '这批专属字卡给谁';
const hint = $('#cardsOwnHint');
if (hint) hint.textContent = (o && o.hint) || '点一位就整批挂到 TA 名下；同名分组也只会并进这位名下的那一组。';
$('#cardsOwnList').innerHTML = '<button class="bind-row" data-own-id=""><span class="bind-av free">∅</span>暂不绑定（以后在卡面「未绑定」那里给）</button>'
+ contacts.map(c => row(c.id, contactAvatarHTML(c), fixedNameOf(c) || '未命名')).join('');
$('#cardsOwnMask').hidden = false;
return new Promise(resolve => { _ownerPickWait = resolve; });
}
function _askImportOwner(created) {
const list = (created || []).filter(g => g && !g.preset && !g.system && cardScope(g) === 'own' && !g.contactId);
if (!list.length) return Promise.resolve('skip');
const contacts = (data.contacts || []).filter(c => c && c.kind !== 'group');
if (!contacts.length) return Promise.resolve({ name: '', groups: list.length, cards: list.reduce((s, g) => s + (g.cards || []).length, 0), noContact: true });
const groupsN = list.length, cardsN = list.reduce((s, g) => s + (g.cards || []).length, 0);
const head = $('#cardsOwnTitle');
if (head) head.textContent = '这批专属字卡给谁';
const hint = $('#cardsOwnHint');
if (hint) hint.textContent = `这次进来 ${groupsN} 组 · ${cardsN} 张专属字卡：点一位就整批挂到 TA 名下。想分开给不同人按人各导一次（每次导完挑一位）。`;
const cur = currentCardsWho;
const row = (id, av, label) => `<button class="bind-row" data-own-id="${escapeHTML(id)}"><span class="bind-av${id ? '' : ' free'}">${av}</span>${escapeHTML(label)}${cur === id ? '<span class="bind-check">✓</span>' : ''}</button>`;
$('#cardsOwnList').innerHTML = '<button class="bind-row" data-own-id=""><span class="bind-av free">∅</span>暂不绑定（以后在卡面「未绑定」那里给）</button>' +
contacts.map(c => row(c.id, contactAvatarHTML(c), fixedNameOf(c) || '未命名')).join('');
_ownBatch = list;
$('#cardsOwnMask').hidden = false;
return new Promise(resolve => { _ownWait = resolve; });
}
if ($('#cardsOwnClose')) $('#cardsOwnClose').onclick = () => _closeCardsOwn();
function _ownTail(res) {
if (!res || res === 'skip') return '';
if (res.noContact) return ' · 这批专属字卡还没主人：先到聊天页右上加一位 TA';
return res.name ? ` · 全给 ${res.name}（${res.groups} 组 · ${res.cards} 张）` : ' · 还没绑给谁，卡面「未绑定」随时能改';
}
function _ownSpread(created) {
const list = (created || []).filter(g => g && !g.preset && !g.system && cardScope(g) === 'own' && g.contactId);
if (!list.length) return '';
const by = {};
list.forEach(g => { by[g.contactId] = (by[g.contactId] || 0) + 1; });
const ids = Object.keys(by);
const nameOf = id => fixedNameOf((data.contacts || []).find(c => c && c.id === id)) || '未命名';
if (ids.length === 1) {
saveCardsWho(ids[0]);
return ` · 按文件里的归属：全给 ${nameOf(ids[0])}（${list.length} 组 · ${list.reduce((s, g) => s + (g.cards || []).length, 0)} 张）`;
}
saveCardsWho('all');
const seg = ids.slice(0, 4).map(id => nameOf(id) + ' ' + by[id] + ' 组');
return ' · 按文件里的归属分开给 ' + ids.length + ' 位：' + seg.join('、') + (ids.length > 4 ? '…' : '');
}
$('#cardsOwnMask') && $('#cardsOwnMask').addEventListener('click', e => {
if (e.target === $('#cardsOwnMask')) { _closeCardsOwn(); return; }
const r = e.target.closest('[data-own-id]');
if (!r) return;
const id = r.dataset.ownId;
if (_ownerPickWait) {
const done = _ownerPickWait; _ownerPickWait = null;
$('#cardsOwnMask').hidden = true;
done(id);
return;
}
if (!_ownBatch || !_ownWait) return;
const list = _ownBatch, done = _ownWait;
_ownBatch = null; _ownWait = null;
$('#cardsOwnMask').hidden = true;
list.forEach(g => { g.contactId = id; });
const nm = (data.contacts || []).find(c => c.id === id);
saveCardsWho(id || '_none');
save();
renderGroups();
done({
name: id ? (fixedNameOf(nm) || '未命名') : '',
groups: list.length,
cards: list.reduce((s, g) => s + (g.cards || []).length, 0)
});
});
async function _runCardsImport(readText, label, size) {
showProgress('正在读取字卡…' + (size >= IMP_WARN ? '·' + _impSizeText(size) + ' 比较大，导的过程别切走' : ''));
await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
try {
if (size > IMP_HARD) {
if (!(await _impGoAhead(size))) return;
showProgress('正在读取字卡…');
}
let text;
try {
text = await readText();
} catch (err) {
hideProgress();
showToast('读不到这个文件的内容：' + ((err && err.message) || '请在手机自带的「文件管理」里挑，别从预览界面分享进来'));
return;
}
updateProgress(12, '正在解析…');
await progressYield();
let parsed;
try {
parsed = JSON.parse(text || '');
} catch (err) {
hideProgress();
showToast('这个文件不是字卡文件：' + ((err && err.message) || '内容解析失败'));
return;
}
updateProgress(20, '已读完 · 正在辨认格式…');
const created = [];
if (Array.isArray(parsed) || Array.isArray(parsed && parsed.groups)) {
const list = Array.isArray(parsed) ? parsed : parsed.groups;
const hasMap = !!_ordContactsMapOf(parsed) || (list || []).some(g => g && _ownContactOk(g.contactId));
const hasOwn = (list || []).some(g => g && (g.scope === 'own' || (g.scope !== 'public' && currentCardsScope === 'own')));
const pre = await _askOwnerBeforeImport({ hasOwn, hasMap, groupsN: (list || []).filter(g => g && g.scope !== 'public').length });
if (pre === null) { hideProgress(); showToast('已取消导入'); return; }
if (pre.asked) await _resumeProgress('正在导入字卡…');
await _importOrdinalGroups(list, created, pre.owner);
_applyOrdContacts(parsed && parsed.ordContacts);
updateProgress(70, '正在保存…');
await flushSave();
hideProgress();
const own1 = pre.asked ? _ownResOf(pre.owner, created) : await _askImportOwner(created);
if (pre.asked && pre.owner) saveCardsWho(pre.owner);
const tail1 = _ownTail(own1) || _ownSpread(created);
cardsSelectGroup(-1, ''); _groupsKey = '';
renderGroups();
showToast(`已导入字卡（${label || '文件'}）· 新建 ${created.length} 组` + tail1);
return;
}
const pm = _parseMochiCards(parsed, label);
if (!pm) { hideProgress(); showToast('字卡文件格式不正确，请选择 言字卡 或 mochi 导出的 JSON 文件'); return; }
let mochi = pm;
if (pm.raw) {
hideProgress();
const scope = await _askMochiScope(label);
if (!scope) return;
mochi = { public: null, own: null };
mochi[scope] = pm.raw;
showProgress('正在导入字卡…');
await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
}
const ownersAt = _ordOwnersOf(parsed);
const preM = await _askOwnerBeforeImport({ hasOwn: !!mochi.own, hasMap: !!ownersAt || !!_ordContactsMapOf(parsed), groupsN: 0 });
if (preM === null) { hideProgress(); showToast('已取消导入'); return; }
if (preM.asked) await _resumeProgress('正在导入字卡…');
const stat = { public: 0, own: 0 }, jobs = [];
for (const scope of ['public', 'own']) {
if (mochi[scope]) await _importMochiLib(mochi[scope], scope, stat, jobs, created, preM.owner, scope === 'own' ? ownersAt : null);
}
await _importFlushMedia(jobs, (p, t) => updateProgress(20 + Math.round(p * 0.7), t), stat);
if (!ownersAt) _applyOrdContacts(parsed && parsed.ordContacts);
updateProgress(94, '正在保存…');
await flushSave();
hideProgress();
const own = preM.asked ? _ownResOf(preM.owner, created) : await _askImportOwner(created);
if (preM.asked && preM.owner) saveCardsWho(preM.owner);
const tailM = _ownTail(own) || _ownSpread(created);
if (stat.public || stat.own) {
if (stat.public && !stat.own) currentCardsScope = 'public';
else if (!stat.public && stat.own) currentCardsScope = 'own';
cardsSelectGroup(-1, '');
_groupsKey = '';
await flushSave();
renderGroups();
showToast(`已导入 mochi 字卡：公用 ${stat.public} 张 · 专属 ${stat.own} 张` + tailM);
} else {
showToast('没有导入新字卡（可能全部重复）');
}
} catch (err) {
hideProgress();
showToast('导入失败：' + ((err && err.message) || '文件读取异常'));
}
}
function _pickTxtCards(btn) { pickFile(btn, $('#txtCardsInput'), _importTxtFile, { wait: '正在打开…', busy: '正在导入…', hold: 0, onTimeout: _impNoPicker }); }
function _closeCardsImp() { const m = $('#cardsImpMask'); if (m) m.hidden = true; }
function _impNoPicker() {
const w = $('#cardsImpWarn');
if (!w) return;
w.textContent = '这台设备的文件选择器没能弹出来（不是这一页坏了）：改用下面那枚「粘贴内容」，把那份 TXT 整份复制进来就行。';
w.hidden = false;
}
function _openCardsImp() {
const scopeLabel = currentCardsScope === 'public' ? '公用' : '专属';
$('#cardsImpHint').textContent = '只导入到当前「' + scopeLabel + '」字卡的「' + currentCardsTab + '」这一列 · 【】里是分组名，一行一张';
const w = $('#cardsImpWarn'); if (w) w.hidden = true;
$('#cardsImpMask').hidden = false;
}
if ($('#cardsImpClose')) $('#cardsImpClose').onclick = _closeCardsImp;
$('#cardsImpMask') && $('#cardsImpMask').addEventListener('click', e => { if (e.target === $('#cardsImpMask')) _closeCardsImp(); });
if ($('#cardsImpPick')) $('#cardsImpPick').onclick = () => _pickTxtCards($('#cardsImpPick'));
if ($('#cardsImpPaste')) $('#cardsImpPaste').onclick = () => _openCardsPaste('', 'txt');
async function _importTxtFile(f) {
_closeCardsImp();
showProgress('正在读取字卡…');
await progressYield();
try {
await _importTxtText(await _fileToText(f), (f && f.name) || '未命名');
} catch { hideProgress(); showToast('TXT 文件格式不正确'); }
}
async function _importTxtText(text, srcName) {
try {
if (binaryJunkText(text)) { showToast('这个文件读出来不是文本（' + (srcName || '未命名') + '）：字卡只收一行一句，图片请用「添加图片」'); hideProgress(); return; }
const groups = {};
let currentGroup = '未分组';
String(text == null ? '' : text).split('\n').forEach(line => {
const trimmed = line.trim();
if (!trimmed) return;
if (/【.+】/.test(trimmed)) { currentGroup = trimmed.replace(/【/, '').replace(/】/, ''); groups[currentGroup] = []; }
else {
if (!groups[currentGroup]) groups[currentGroup] = [];
if (!groups[currentGroup].includes(trimmed)) groups[currentGroup].push(trimmed);
}
});
updateProgress(45, '正在整理分组…');
await progressYield();
const pre = await _askOwnerBeforeImport({ hasOwn: currentCardsScope === 'own', hasMap: false, groupsN: Object.keys(groups).length });
if (pre === null) { hideProgress(); showToast('已取消导入'); return; }
if (pre.asked) await _resumeProgress('正在导入字卡…');
const owner = pre.owner || '';
let added = 0, skipped = 0, made = 0;
for (const [name, cards] of Object.entries(groups)) {
if (!cards.length) continue;
let target = data.groups.find(x => x.name === name && !x.preset && !x.system && cardScope(x) === currentCardsScope
&& (currentCardsScope !== 'own' || (x.contactId || '') === owner));
if (!target) { target = _newGroup(name, currentCardsTab); if (currentCardsScope === 'own') target.contactId = owner; data.groups.push(target); made++; }
const r = _cardsAbsorbLines(target, cards);
added += r.added; skipped += r.skip;
}
updateProgress(80, '正在保存…');
await progressYield();
await save();
hideProgress();
if (owner) saveCardsWho(owner);
cardsSelectGroup(-1, '');
renderGroups();
showToast(`已导入 ${Object.keys(groups).length} 个分组 · 收进 ${added} 张`
+ (currentCardsScope === 'own' && !owner ? ' · 还没绑给谁，卡面「未绑定」随时能改' : (owner ? ' · 给了「' + (fixedNameOf((data.contacts || []).find(c => c.id === owner)) || '未命名') + '」（新建 ' + made + ' 组）' : ''))
+ _cardsSkipTail(skipped));
} catch { hideProgress(); showToast('TXT 文件格式不正确'); }
}
if ($('#importTxtCards')) $('#importTxtCards').onclick = _openCardsImp;
var _ORD_TO_MOCHI = { '主字卡': 'text', '颜文字': 'kaomoji', 'emoji': 'emoji', '表情包': 'sticker', '图片': 'image', '拍一拍': 'poke', '语音': 'voice', '帮写字卡': 'text' };
function _outCardStr(c, t) {
const v = voiceCardParts(c);
if (t === 'sticker' || t === 'image') return v ? '' : (cardImage(c) || '');
if (t === 'voice') return v ? (v.name || '语音') + '|||' + v.data : '';
if (v || cardImage(c)) return '';
if (typeof c === 'string') return c;
return cardText(c);
}
function _buildScopeLib(scope) {
const lib = { text: [], kaomoji: [], emoji: [], sticker: [], image: [], poke: [], voice: [] };
const owners = {};
data.groups.forEach(g => {
if (cardScope(g) !== scope) return;
const t = _ORD_TO_MOCHI[g.category || '主字卡'];
if (!t) return;
const cards = [];
(g.cards || []).forEach(c => {
const s = _outCardStr(c, t);
if (s) cards.push(s);
});
lib[t].push([g.name, cards]);
if (!owners[t]) owners[t] = [];
owners[t].push(scope === 'own' ? (g.contactId || '') : '');
});
return { lib, owners };
}
function _buildMochiExport() {
const pub = _buildScopeLib('public'), ownLib = _buildScopeLib('own');
const out = { app: 'mochi-ccfull', v: 1, scope: 'all', time: Date.now(), data: { ccPub: pub.lib, ccOwn: ownLib.lib } };
const ownPairs = Object.keys(ownLib.lib).reduce((s, k) => s + ownLib.lib[k].length, 0);
if (ownPairs && Object.keys(ownLib.owners).some(k => ownLib.owners[k].some(id => id))) out.ordOwners = ownLib.owners;
const contacts = {}, seen = {};
data.groups.forEach(g => {
if (g.system || cardScope(g) !== 'own') return;
const k = g.name + '\u0001' + (g.category || '主字卡'), id = g.contactId || '';
if (k in seen) { if (seen[k] !== id) seen[k] = null; } else seen[k] = id;
});
Object.keys(seen).forEach(k => { if (seen[k]) contacts[k] = seen[k]; });
if (Object.keys(contacts).length) out.ordContacts = contacts;
return out;
}
function _applyOrdContacts(map) {
if (!map || typeof map !== 'object') return;
const ids = new Set((data.contacts || []).filter(c => c && c.kind !== 'group').map(c => c.id));
data.groups.forEach(g => {
if (g.system || cardScope(g) !== 'own' || g.contactId) return;
const id = map[g.name + '\u0001' + (g.category || '主字卡')];
if (id && ids.has(id)) g.contactId = id;
});
}
function _expScopeStat(scope) {
let gn = 0, cn = 0, voiceN = 0, dropN = 0;
(data.groups || []).forEach(g => {
const t = _ORD_TO_MOCHI[g.category || '主字卡'];
if (cardScope(g) !== scope || !t) return;
let n = 0;
(g.cards || []).forEach(c => {
if (!_outCardStr(c, t)) { if (c && (typeof c === 'string' ? c : true)) dropN++; return; }
n++;
if (voiceCardParts(c)) voiceN++;
});
if (n) { gn++; cn += n; }
});
return { gn, cn, voiceN, dropN };
}
function _expLossNote(voiceN, dropN) {
const bits = [];
if (voiceN) bits.push('这 ' + voiceN + ' 条语音只带名称与音频：mochi 没有「同句同音色不花额度」那一格，'
+ '这批再导回 言字卡 时第一次点播会重新合成一次，之后四段式自己长回来');
if (dropN) bits.push('另有 ' + dropN + ' 条文字卡混在表情包∶图片组里，那边认不出是图，没带走');
return bits.length ? (bits.join('；') + '。') : '';
}
async function _expSaveJson(obj, name, title, note) {
const p = showProgress('正在导出字卡');
p(2, '正在整理这一本…');
try { _saveUrlReleaseStale(); } catch (e) {}
await progressYield();
let blob = null;
try {
blob = await buildJsonBlob(obj, n => {
try { p(60, '已写出 ' + (typeof _impSizeText === 'function' ? _impSizeText(n) : n + ' 字节')); } catch (e2) {}
});
}
catch (e) {
hideProgress();
showToast('这一份没能在这一刻写成文件：这台设备当下腾不出这么多内存。先在字卡库里清掉用不上的大图与语音，再导一次', 9000);
return;
}
hideProgress();
offerSaveBlob(blob, name, { title, note });
}
function _mochiExportRun(scope) {
const label = scope === 'public' ? '公用' : scope === 'own' ? '专属' : '全部';
const stats = scope === 'all' ? [_expScopeStat('public'), _expScopeStat('own')] : [_expScopeStat(scope)];
const voiceN = stats.reduce((n, s) => n + s.voiceN, 0), dropN = stats.reduce((n, s) => n + s.dropN, 0);
const obj = scope === 'all' ? _buildMochiExport() : _buildScopeLib(scope).lib;
const fname = scope === 'all' ? '言字卡-字卡.json' : '言字卡-字卡-' + label + '.json';
_expSaveJson(obj, fname, fname + ' 已生成',
(scope === 'all' ? '这一件带两本，走 mochi 的「全量导入」。' : '这一件是裸库，进 mochi 对应那一页的「导入数据」。')
+ _expLossNote(voiceN, dropN));
}
var _MILK_PALETTE = ['#F783AC', '#51CF66', '#4DABF7', '#FFD43B', '#FF922B', '#B197FC', '#66D9E8',
'#FF8787', '#69DB7C', '#74C0FC', '#FCC2D7', '#D0BFFF', '#96F2D7', '#FFEC99', '#FFC078'];
var _MILK_FILE_MAX = 48 * 1024 * 1024;
function _milkTextCards(g) {
const out = [];
(g.cards || []).forEach(c => {
if (voiceCardParts(c) || cardImage(c)) return;
const t = cardText(c);
if (t) out.push(t);
});
return out;
}
function _buildMilkMain(scopes) {
const inScope = g => scopes.indexOf(cardScope(g)) >= 0;
const groups = [];
(data.groups || []).forEach(g => {
if (!inScope(g) || (g.category || '主字卡') !== '主字卡') return;
const gseen = new Set(), items = [];
_milkTextCards(g).forEach(t => { if (!gseen.has(t)) { gseen.add(t); items.push(t); } });
if (items.length) groups.push({ name: String(g.name || '未分组'), items, disabled: !!g.off });
});
const flat = [];
groups.forEach(g => g.items.forEach(t => { if (!flat.includes(t)) flat.push(t); }));
const pokes = [], emojis = [], pseen = new Set(), eseen = new Set();
(data.groups || []).forEach(g => {
if (!inScope(g)) return;
const cat = g.category || '主字卡';
if (cat !== '拍一拍' && cat !== 'emoji') return;
const into = cat === '拍一拍' ? pokes : emojis, seen = cat === '拍一拍' ? pseen : eseen;
_milkTextCards(g).forEach(t => { if (t && !seen.has(t)) { seen.add(t); into.push(t); } });
});
const mods = [];
if (flat.length) mods.push('replies');
if (pokes.length) mods.push('pokes');
if (emojis.length) mods.push('emojis');
if (groups.length) mods.push('groups');
const obj = { exportDate: new Date().toISOString(), modules: mods };
if (flat.length) obj.customReplies = flat;
if (pokes.length) obj.customPokes = pokes;
if (emojis.length) obj.customEmojis = emojis;
if (groups.length) {
const base = Date.now();
obj.customReplyGroups = groups.map((g, i) => ({
id: base + i * 1000, name: g.name, color: _MILK_PALETTE[i % _MILK_PALETTE.length],
disabled: g.disabled, items: g.items
}));
obj._groupExport = true;
}
let kaomojiN = 0, voiceN = 0;
(data.groups || []).forEach(g => {
if (!inScope(g)) return;
const cat = g.category || '主字卡';
if (cat === '颜文字') kaomojiN += _milkTextCards(g).length;
else if (cat === '语音') voiceN += (g.cards || []).filter(c => voiceCardParts(c)).length;
});
return { obj, count: flat.length + pokes.length + emojis.length, stat: { groups: groups.length, flat: flat.length, pokes: pokes.length, emojis: emojis.length, kaomojiN, voiceN } };
}
function _milkStickerName(cat, gname, used, partNo) {
const base = '言字卡-milk-' + cat + '-' + _voiceFileName(gname, '未命名') + (partNo ? '-第' + partNo + '部分' : '');
let name = base + '.json', n = 2;
while (used.has(name)) { name = base + '（' + n + '）.json'; n++; }
used.add(name);
return name;
}
function _milkStickerParts(scopes) {
const files = [];
const used = new Set();
let bad = 0;
(data.groups || []).forEach(g => {
if (scopes.indexOf(cardScope(g)) < 0) return;
const cat = g.category || '主字卡';
if (!isImageCat(cat)) return;
const urls = [];
(g.cards || []).forEach(c => {
const img = cardImage(c);
if (img && (img.indexOf('data:image/') === 0 || /^https?:\/\//i.test(img))) urls.push(img);
else bad++;
});
if (!urls.length) return;
const parts = [];
let cur = [], bytes = 0;
urls.forEach(u => {
if (cur.length && bytes + u.length + 4 > _MILK_FILE_MAX) { parts.push(cur); cur = []; bytes = 0; }
cur.push(u);
bytes += u.length + 4;
});
if (cur.length) parts.push(cur);
parts.forEach((p, i) => {
files.push({ urls: p, name: _milkStickerName(cat, g.name, used, parts.length > 1 ? i + 1 : 0), gname: g.name || '未命名', cat });
});
});
return { files, bad };
}
function _milkSaveStep(queue, i, stat, note) {
if (i >= queue.length) {
const skip = [];
if (stat.kaomojiN) skip.push('颜文字 ' + stat.kaomojiN + ' 条');
if (stat.voiceN) skip.push('语音 ' + stat.voiceN + ' 条');
setTimeout(() => {
showToast('已导出 ' + queue.length + ' 件 milk 字卡'
+ (skip.length ? '：' + skip.join(' · ') + ' milk 没有对应分类，没放进件里' : ''), 8000);
}, 400);
return;
}
const item = queue[i];
const p = showProgress('正在写第 ' + (i + 1) + ' / ' + queue.length + ' 件');
p(2, item.tag);
try { _saveUrlReleaseStale(); } catch (e) {}
setTimeout(async () => {
let blob = null;
try {
blob = await buildJsonBlob(item.obj, n => {
try { p(60, '已写出 ' + (typeof _impSizeText === 'function' ? _impSizeText(n) : n + ' 字节')); } catch (e2) {}
});
}
catch (e) {
hideProgress();
showToast('这一件（' + item.name + '）太大，这台设备当下腾不出内存写成文件：把那一组表情包拆小一点再导', 9000);
return;
}
item.obj = null;
hideProgress();
offerSaveBlob(blob, item.name, {
title: '第 ' + (i + 1) + ' / ' + queue.length + ' 件 · ' + item.tag,
note: (i + 1 < queue.length ? '存好这一件会自动接着下一件。' : '这是最后一件。') + note,
onSaved: () => _milkSaveStep(queue, i + 1, stat, note)
});
}, 80);
}
function _milkExportRun(which) {
const scopes = which === 'both' ? ['public', 'own'] : [which];
const label = which === 'public' ? '公用' : which === 'own' ? '专属' : '两本合一起';
const main = _buildMilkMain(scopes);
const stk = _milkStickerParts(scopes);
const queue = [];
if (main.count) {
queue.push({
obj: main.obj, name: '言字卡-milk-字卡-' + label + '.json',
tag: '文字主件 · 回复 ' + main.stat.flat + ' 条'
+ (main.stat.pokes ? ' · 拍一拍 ' + main.stat.pokes : '') + (main.stat.emojis ? ' · emoji ' + main.stat.emojis : '')
});
}
stk.files.forEach(f => {
queue.push({
obj: { exportDate: new Date().toISOString(), disabledDefaultReplies: [], stickerLibrary: f.urls },
name: f.name, tag: f.cat + '「' + f.gname + '」· ' + f.urls.length + ' 张'
});
});
if (!queue.length) { showToast('这一本里没有 milk 收得下的字卡（主字卡 ∶ 拍一拍 ∶ emoji ∶ 表情包 ∶ 图片）'); return; }
const note = 'milk 那一侧的入口＝字卡库 →「导入数据」，选文件后按「追加」并入最稳。'
+ (stk.bad ? '另有 ' + stk.bad + ' 条不是图片的卡装不进 milk 的平铺表情库，没放进件里。' : '');
_milkSaveStep(queue, 0, main.stat, note);
}
var _expKind = 'mochi';
function _expClose() { const m = $('#cardsExpMask'); if (m) m.hidden = true; }
function _expRow(scope, label, tip) {
return '<button class="cards-menu-item" type="button" data-exp-scope="' + scope + '">'
+ '<span class="menu-label">' + escapeHTML(label) + '</span>'
+ (tip ? '<small class="menu-tip">' + escapeHTML(tip) + '</small>' : '') + '</button>';
}
function _expOpen(kind) {
_expKind = kind;
const pub = _expScopeStat('public'), own = _expScopeStat('own');
const rows = [], hints = [];
if (kind === 'mochi') {
$('#cardsExpTitle').textContent = '导出字卡（JSON）· 导哪一本';
rows.push(_expRow('public', '公用字卡', (pub.gn ? pub.gn + ' 组 · ' + pub.cn + ' 张' : '这一本是空的') + ' · 给 mochi「公用字卡」那一页'));
rows.push(_expRow('own', '专属字卡', (own.gn ? own.gn + ' 组 · ' + own.cn + ' 张' : '这一本是空的') + ' · 给 mochi「专属字卡」那一页'));
rows.push(_expRow('all', '两本一起', (pub.cn + own.cn) + ' 张 · 走 mochi 的「全量导入」，也是 言字卡 自己往回导的那件'));
hints.push('mochi 的公用∶专属两本各在自己那一页里「导入数据」，那一处只认单本裸库；全量包只走它的「全量导入」。');
} else {
$('#cardsExpTitle').textContent = '导出字卡（milk 格式）· 导哪一本';
[['public', '只导公用字卡'], ['own', '只导专属字卡'], ['both', '两本合一起']].forEach(pair => {
const list = pair[0] === 'both' ? ['public', 'own'] : [pair[0]];
const m = _buildMilkMain(list), k = _milkStickerParts(list);
const none = !m.count && !k.files.length;
const skip = m.stat.kaomojiN + m.stat.voiceN;
rows.push(_expRow(pair[0], pair[1], none ? '这一本里没有 milk 收得下的字卡'
: (m.count ? '文字 ' + m.count + ' 条' : '无文字卡') + ' · 表情 ' + k.files.length + ' 件'
+ (skip ? ' · 颜文字与语音 ' + skip + ' 条不进件' : '')));
});
hints.push('milk 只认文字回复∶拍一拍∶emoji 与一张平铺表情库——表情包∶图片按分组各出一件，'
+ '手机问「允许下载多个文件」时点允许。');
}
$('#cardsExpHint').textContent = hints.join('');
$('#cardsExpRows').innerHTML = rows.join('');
$('#cardsExpMask').hidden = false;
}
if ($('#exportCards')) $('#exportCards').onclick = () => _expOpen('mochi');
if ($('#exportMilkCards')) $('#exportMilkCards').onclick = () => _expOpen('milk');
if ($('#cardsExpClose')) $('#cardsExpClose').onclick = _expClose;
if ($('#cardsExpCancel')) $('#cardsExpCancel').onclick = _expClose;
$('#cardsExpMask') && $('#cardsExpMask').addEventListener('click', e => { if (e.target === $('#cardsExpMask')) _expClose(); });
if ($('#cardsExpRows')) $('#cardsExpRows').onclick = e => {
const b = e.target.closest('[data-exp-scope]');
if (!b) return;
const scope = b.dataset.expScope;
_expClose();
if (_expKind === 'mochi') _mochiExportRun(scope); else _milkExportRun(scope);
};
var _TXT_EXP_CATS = ['主字卡', '颜文字', 'emoji', '拍一拍', '帮写字卡'];
function _txtExpCount(cat) {
let gn = 0, cn = 0;
data.groups.forEach(g => {
if (cardScope(g) !== currentCardsScope || (g.category || '主字卡') !== cat) return;
const n = (g.cards || []).filter(c => !cardImage(c) && cardText(c)).length;
if (n) { gn++; cn += n; }
});
return { gn, cn };
}
function _closeCardsTxt() { $('#cardsTxtMask').hidden = true; }
if ($('#exportTxtCards')) $('#exportTxtCards').onclick = () => {
const scopeLabel = currentCardsScope === 'public' ? '公用' : '专属';
$('#cardsTxtHint').textContent = '勾选要导出的分类 · 只导当前' + scopeLabel + '字卡，【】里是分组名，一行一张';
$('#cardsTxtCats').innerHTML = _TXT_EXP_CATS.map(cat => {
const c = _txtExpCount(cat);
return `<label class="txt-cat-row"><input type="checkbox" data-txt-cat="${escapeHTML(cat)}" checked><span>${escapeHTML(cat)}</span><small>${c.gn ? c.gn + ' 组 · ' + c.cn + ' 张' : '暂无'}</small></label>`;
}).join('');
$('#cardsTxtMask').hidden = false;
};
if ($('#cardsTxtClose')) $('#cardsTxtClose').onclick = _closeCardsTxt;
if ($('#cardsTxtCancel')) $('#cardsTxtCancel').onclick = _closeCardsTxt;
$('#cardsTxtMask') && $('#cardsTxtMask').addEventListener('click', e => { if (e.target === $('#cardsTxtMask')) _closeCardsTxt(); });
if ($('#cardsTxtOk')) $('#cardsTxtOk').onclick = () => {
const picked = Array.from(document.querySelectorAll('#cardsTxtCats input[data-txt-cat]:checked')).map(i => i.dataset.txtCat);
if (!picked.length) { showToast('先勾选至少一个分类'); return; }
const lines = [];
let groupsN = 0, cardsN = 0, skipped = 0;
_TXT_EXP_CATS.forEach(cat => {
if (!picked.includes(cat)) return;
data.groups.forEach(g => {
if (cardScope(g) !== currentCardsScope || (g.category || '主字卡') !== cat) return;
const cards = [];
(g.cards || []).forEach(c => {
if (cardImage(c)) { skipped++; return; }
const t = cardText(c);
if (!t) { skipped++; return; }
cards.push(t);
});
if (!cards.length) return;
lines.push('【' + g.name + '】');
cards.forEach(c => { lines.push(c); cardsN++; });
groupsN++;
});
});
if (!groupsN) { showToast('选中的分类里没有可导出的字卡'); return; }
_closeCardsTxt();
const scopeLabel = currentCardsScope === 'public' ? '公用' : '专属';
downloadBlob(lines.join('\n'), '言字卡-字卡-TXT-' + scopeLabel + '.txt', 'text/plain;charset=utf-8');
showToast('已导出 ' + groupsN + ' 个分组 · ' + cardsN + ' 张字卡（' + scopeLabel + '）' + (skipped ? '，另有 ' + skipped + ' 张图片卡进不了 TXT' : ''));
};
var _VOICE_EXT = { 'audio/mpeg': 'mp3', 'audio/mp3': 'mp3', 'audio/wav': 'wav', 'audio/x-wav': 'wav', 'audio/ogg': 'ogg', 'audio/mp4': 'm4a', 'audio/aac': 'm4a', 'audio/x-m4a': 'm4a' };
function _voiceMimeOf(url) {
const m = /^data:([^;,]+)/.exec(String(url));
return ((m && m[1]) || '').toLowerCase() || 'audio/mpeg';
}
function _voiceExtOf(url) { return _VOICE_EXT[_voiceMimeOf(url)] || 'mp3'; }
function _dataUrlBytes(url) {
const s = String(url || '');
if (s.slice(0, 5) !== 'data:') return null;
const i = s.indexOf(',');
if (i < 0) return null;
let bin;
try { bin = atob(s.slice(i + 1)); } catch (e) { return null; }
if (!bin.length) return null;
const out = new Uint8Array(bin.length);
for (let k = 0; k < bin.length; k++) out[k] = bin.charCodeAt(k);
return out;
}
var _VOICE_BAD_CH = new RegExp('[' + String.fromCharCode(92) + '/:*?"<>|' + String.fromCharCode(0) + '-' + String.fromCharCode(31) + ']', 'g');
function _voiceFileName(name, fallback) {
const clean = String(name || '').replace(_VOICE_BAD_CH, ' ').replace(/\s+/g, ' ').trim();
return (clean || fallback || '语音').slice(0, 60);
}
function _voiceRowAt(key) {
const p = String(key).split(':');
const g = data.groups[+p[0]];
const v = g ? voiceCardParts(g.cards && g.cards[+p[1]]) : null;
return (v && v.data) ? { group: g.name || '语音', v } : null;
}
function _allVoiceKeys() {
const keys = [];
(data.groups || []).forEach((g, gi) => {
if (g.preset) return;
(g.cards || []).forEach((c, ci) => { if (voiceCardParts(c)) keys.push(gi + ':' + ci); });
});
return keys;
}
var _ZIP_CRC_T = (() => {
const t = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
let c = i;
for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
t[i] = c >>> 0;
}
return t;
})();
function _crc32(bytes) {
let c = 0xFFFFFFFF;
for (let i = 0; i < bytes.length; i++) c = _ZIP_CRC_T[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
return (c ^ 0xFFFFFFFF) >>> 0;
}
function _dosStamp(d) {
const y = Math.max(1980, d.getFullYear());
return [((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xFFFF,
(((y - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xFFFF];
}
function _zipStore(files) {
const enc = new TextEncoder();
const parts = [];
const central = [];
let offset = 0;
files.forEach(f => {
const nb = enc.encode(f.name);
const crc = _crc32(f.bytes);
const size = f.bytes.length;
const lh = new Uint8Array(30 + nb.length);
const lv = new DataView(lh.buffer);
lv.setUint32(0, 0x04034b50, true);
lv.setUint16(4, 20, true);
lv.setUint16(6, 0x0800, true);
lv.setUint16(8, 0, true);
lv.setUint16(10, f.time | 0, true);
lv.setUint16(12, f.date | 0, true);
lv.setUint32(14, crc, true);
lv.setUint32(18, size, true);
lv.setUint32(22, size, true);
lv.setUint16(26, nb.length, true);
lh.set(nb, 30);
parts.push(lh, f.bytes);
const ch = new Uint8Array(46 + nb.length);
const cv = new DataView(ch.buffer);
cv.setUint32(0, 0x02014b50, true);
cv.setUint16(4, 20, true);
cv.setUint16(6, 20, true);
cv.setUint16(8, 0x0800, true);
cv.setUint16(10, 0, true);
cv.setUint16(12, f.time | 0, true);
cv.setUint16(14, f.date | 0, true);
cv.setUint32(16, crc, true);
cv.setUint32(20, size, true);
cv.setUint32(24, size, true);
cv.setUint16(28, nb.length, true);
cv.setUint32(42, offset, true);
ch.set(nb, 46);
central.push(ch);
offset += lh.length + size;
});
const cdSize = central.reduce((n, b) => n + b.length, 0);
const end = new Uint8Array(22);
const ev = new DataView(end.buffer);
ev.setUint32(0, 0x06054b50, true);
ev.setUint16(8, files.length, true);
ev.setUint16(10, files.length, true);
ev.setUint32(12, cdSize, true);
ev.setUint32(16, offset, true);
const out = new Uint8Array(offset + cdSize + 22);
let pos = 0;
parts.concat(central).concat([end]).forEach(b => { out.set(b, pos); pos += b.length; });
return out;
}
function _zipPath(row, used) {
const folder = _voiceFileName(row.group, '语音');
const base = _voiceFileName(row.v.name || row.v.text, '语音');
const ext = _voiceExtOf(row.v.data);
let path = folder + '/' + base + '.' + ext;
if (used[path]) { used[path] += 1; path = folder + '/' + base + '（' + used[path] + '）.' + ext; } else used[path] = 1;
return path;
}
async function _exportVoiceZip(rows, zipName, note) {
const many = rows.length > 24;
const tick = many ? showProgress('正在打包语音') : null;
const used = {};
const files = [];
let broken = 0;
for (let i = 0; i < rows.length; i++) {
const bytes = _dataUrlBytes(rows[i].v.data);
if (bytes) files.push({ name: _zipPath(rows[i], used), bytes });
else broken++;
if (tick && i % 24 === 0) {
tick(Math.round(i / rows.length * 90), '已读 ' + (i + 1) + ' / ' + rows.length);
await new Promise(r => setTimeout(r, 0));
}
}
if (!files.length) {
if (tick) hideProgress();
showToast('这些语音卡的录音都不在库里了，导不出音频');
return;
}
const st = _dosStamp(new Date());
files.forEach(f => { f.time = st[0]; f.date = st[1]; });
let out;
try { out = _zipStore(files); } catch (e) {
if (tick) hideProgress();
showToast('打包失败：' + ((e && e.message) || e));
return;
}
if (tick) { tick(100, files.length + ' 句'); setTimeout(hideProgress, 400); }
downloadBlob(out, zipName, 'application/zip');
showToast('已导出 ' + files.length + ' 句' + (broken ? '，另有 ' + broken + ' 句的录音取不出来' : '') + (note || '') + ' · ' + zipName);
}
function _exportVoiceOne(row) {
const bytes = _dataUrlBytes(row.v.data);
if (!bytes) { showToast('这张卡的录音是空的，导不出音频'); return; }
downloadBlob(bytes, _voiceFileName(row.v.name || row.v.text, '语音') + '.' + _voiceExtOf(row.v.data), _voiceMimeOf(row.v.data));
showToast('已导出这句音频');
}
if ($('#exportVoiceAll')) $('#exportVoiceAll').onclick = () => {
const rows = _allVoiceKeys().map(_voiceRowAt).filter(Boolean);
if (!rows.length) { showToast('字卡库里还没有语音卡'); return; }
_exportVoiceZip(rows, '言字卡-语音.zip');
};
if ($('#batchExportVoice')) $('#batchExportVoice').onclick = () => {
const picked = Array.from(cardsBatchSel);
const rows = picked.map(_voiceRowAt).filter(Boolean);
if (!rows.length) { showToast('选中的 ' + picked.length + ' 张里没有语音卡'); return; }
const rest = picked.length - rows.length;
_exportVoiceZip(rows, '言字卡-语音-选中.zip', rest ? '（选中的另外 ' + rest + ' 张不是语音卡）' : '');
};
if ($('#clearAllCards')) $('#clearAllCards').onclick = async () => {
const mine = data.groups.filter(g => !g.preset && !g.system);
const total = mine.reduce((n, g) => n + (g.cards?.length || 0), 0);
if (!mine.length) { showToast('字卡库已经是空的'); return; }
openModal('清空全部字卡', '', () => {
openModal('最后确认', '', async () => {
data.groups = data.groups.filter(g => g.preset || g.system);
cardsBatchSel.clear();
cardsSelectGroup(-1, '');
await save();
renderGroups();
showToast(total ? `已删除 ${mine.length} 个分组、${total} 张字卡` : `已删除 ${mine.length} 个空分组`);
}, { noInput: true, staticText: '此操作不可恢复，建议先「导出字卡」备份。仍要继续？', okText: '仍要清空', danger: true });
}, { noInput: true, staticText: total ? `将删除全部 ${mine.length} 个分组、共 ${total} 张字卡（分组一并删掉）。` : `将删除全部 ${mine.length} 个空分组。`, okText: '下一步', danger: true });
};
var _addBatchOwner = '';
function _paintAddBatchOwn() {
const row = $('#cardsAddOwnRow'), box = $('#cardsAddOwn');
if (!row || !box) return;
const contacts = (data.contacts || []).filter(c => c && c.kind !== 'group');
const own = currentCardsScope === 'own';
row.hidden = !own || !contacts.length;
box.innerHTML = '';
if (row.hidden) { _addBatchOwner = ''; return; }
_addBatchOwner = _newGroupOwnerOf();
const chip = (id, label) => `<button type="button" class="fchip${_addBatchOwner === id ? ' on' : ''}" data-add-own="${escapeHTML(id)}">${escapeHTML(label)}</button>`;
box.innerHTML = chip('', '暂不绑定') + contacts.map(c => chip(c.id, fixedNameOf(c) || '未命名')).join('');
}
$('#cardsAddOwn') && $('#cardsAddOwn').addEventListener('click', e => {
const b = e.target.closest('[data-add-own]');
if (!b) return;
_addBatchOwner = b.dataset.addOwn || '';
[].slice.call($('#cardsAddOwn').querySelectorAll('[data-add-own]')).forEach(x => x.classList.toggle('on', (x.dataset.addOwn || '') === _addBatchOwner));
});
function _openAddCardsBatch() {
$('#cardsAddInput').value = '';
_paintAddBatchOwn();
$('#cardsAddMask').hidden = false;
$('#cardsAddInput').focus();
}
if ($('#addCardsBatch')) $('#addCardsBatch').onclick = _openAddCardsBatch;
if ($('#cardsAddClose')) $('#cardsAddClose').onclick = () => { $('#cardsAddMask').hidden = true; };
if ($('#cardsAddCancel')) $('#cardsAddCancel').onclick = () => { $('#cardsAddMask').hidden = true; };
$('#cardsAddMask') && $('#cardsAddMask').addEventListener('click', e => { if (e.target === $('#cardsAddMask')) $('#cardsAddMask').hidden = true; });
if ($('#cardsAddSubmit')) $('#cardsAddSubmit').onclick = async () => {
if (_ownAddBlocked()) { _ownAddBlockTip(); return; }
const owner = currentCardsScope === 'own' ? (_addBatchOwner || '') : '';
const groups = {};
let currentGroup = '未分组';
$('#cardsAddInput').value.split('\n').forEach(line => {
const trimmed = line.trim();
if (!trimmed) return;
if (/【.+】/.test(trimmed)) { currentGroup = trimmed.replace(/【/, '').replace(/】/, ''); groups[currentGroup] = []; }
else {
if (!groups[currentGroup]) groups[currentGroup] = [];
if (!groups[currentGroup].includes(trimmed)) groups[currentGroup].push(trimmed);
}
});
$('#cardsAddMask').hidden = true;
let added = 0, createdGroups = 0, skipped = 0;
for (const [name, cards] of Object.entries(groups)) {
if (!cards.length) continue;
let target = data.groups.find(x => x.name === name && !x.preset && !x.system && cardScope(x) === currentCardsScope
&& (currentCardsScope !== 'own' || (x.contactId || '') === owner));
if (!target) { target = _newGroup(name, currentCardsTab); if (currentCardsScope === 'own') target.contactId = owner; data.groups.push(target); createdGroups++; cardsSelectGroup(data.groups.length - 1, name); }
const r = _cardsAbsorbLines(target, cards);
added += r.added; skipped += r.skip;
}
if (added || createdGroups) {
if (createdGroups) groupSearch = '';
if (owner) saveCardsWho(owner);
await save();
renderGroups();
const tail = owner ? ' · 给了「' + (fixedNameOf((data.contacts || []).find(c => c.id === owner)) || '未命名') + '」' : (currentCardsScope === 'own' ? ' · 还没绑给谁，卡面「未绑定」随时能改' : '');
showToast(`已添加 ${added} 张字卡${createdGroups ? `，新建 ${createdGroups} 个分组` : ''}` + tail + _cardsSkipTail(skipped));
} else showToast(skipped ? '这些行都没收：图请走「添加图片」，文字卡不收图也不收读不懂的字节' : '这些这组里已有');
};
function _ownAddBlocked() {
if (currentCardsScope !== 'own') return false;
return !((data.contacts || []).some(c => c && c.kind !== 'group'));
}
function _ownAddBlockTip() { showToast('专属字卡要绑给联系人才用得上：先到聊天页右上加一位联系人，再回来添加'); }
var _imgTargetGi = -1;
function _imgCatNow() { return currentCardsTab === '图片' ? '图片' : (currentCardsTab === '表情包' ? '表情包' : ''); }
function _pickCardImages(btn) {
const input = $('#cardsImgInput');
if (!input) return;
const anchor = (btn && btn.isConnected) ? btn : $('#newCardGroup');
pickFile(anchor, input, (f, list) => _addCardImagesFrom((list && list.length) ? list : (f ? [f] : [])));
}
function _addCardImagesFlow(btn) {
if (_ownAddBlocked()) { _ownAddBlockTip(); return; }
if (!_imgCatNow()) {
currentCardsTab = '表情包'; cardsSelectGroup(-1, ''); groupSearch = '';
if (typeof updateBatchBar === 'function') updateBatchBar();
renderGroups();
}
const cat = _imgCatNow() || '表情包';
const gi = _addTargetGi(cat);
if (gi < 0) {
_askGroupName({
title: cat === '图片' ? '新图片分组' : '新表情包分组',
value: cat === '图片' ? '新图片组' : '新表情组',
onOk: name => {
const ng2 = _newGroup(name, cat); ng2.contactId = _newGroupOwnerOf();
data.groups.push(ng2);
cardsSelectGroup(data.groups.length - 1, name);
_imgTargetGi = data.groups.length - 1;
_pickCardImages(btn);
}
});
return;
}
_imgTargetGi = gi;
_pickCardImages(btn);
}
if ($('#addCardImages')) $('#addCardImages').onclick = () => _addCardImagesFlow($('#addCardImages'));
if ($('#plusAddImg')) $('#plusAddImg').onclick = () => _addCardImagesFlow($('#plusAddImg'));
async function _addCardImagesFrom(files) {
const g = _imgTargetGi >= 0 ? data.groups[_imgTargetGi] : null;
if (!g || !files.length) return;
let added = 0, dup = 0, bad = 0;
for (const f of files) {
const src = await fileData(f, 512);
if (!src) { bad++; continue; }
if (!g.cards.some(c => cardImage(c) === src)) { g.cards.push({ img: src }); added++; }
else dup++;
}
if (added) {
cardsSelectGroup(_imgTargetGi, g.name);
await save();
renderGroups();
showToast(`已添加 ${added} 张${g.category === '图片' ? '图片' : '表情包'}` + (bad ? `；${bad} 张没能读出来` : '') + (currentCardsScope === 'own' && g.contactId ? '' : (currentCardsScope === 'own' ? '（这一组还没绑给谁，TA 用不到）' : '')));
}
else if (bad) showToast(`有 ${bad} 张没能读出来` + (dup ? `，另有 ${dup} 张已经在这组里` : ''));
else showToast('这几张都已经在这一组里了');
}
function _cardsOwnerMatch(g) {
if (!g || cardScope(g) !== 'own') return true;
const w = currentCardsWho || 'all';
if (w === 'all') return true;
if (w === '_none') return !g.contactId;
return (g.contactId || '') === w;
}
function _addTargetGi(cat) {
const ok = g => g && !g.preset && !g.system && (g.category || '主字卡') === cat && cardScope(g) === currentCardsScope && _cardsOwnerMatch(g);
if (selectedGroupGi >= 0) { const g = data.groups[selectedGroupGi]; if (ok(g)) return selectedGroupGi; }
if (selectedGroupName) {
const gi = data.groups.findIndex(g => ok(g) && g.name === selectedGroupName);
if (gi >= 0) return gi;
}
const rows = (typeof cardsPickGroups !== 'undefined' && cardsPickGroups) ? cardsPickGroups : [];
const row = rows.find(x => ok(data.groups[x.gi]));
return row ? row.gi : -1;
}
function _newGroupForAdd(cat, done) {
_askGroupName({
title: '新' + cat + '分组',
value: '新' + cat + '组',
hint: '先起个分组名，加进去的卡都落这一组',
onOk: async name => {
const ng = _newGroup(name, cat); ng.contactId = _newGroupOwnerOf();
data.groups.push(ng);
cardsSelectGroup(data.groups.length - 1, name);
groupSearch = '';
await save();
renderGroups();
if (done) done(data.groups.length - 1);
}
});
}
function _addTextFlow(btn) {
if (_ownAddBlocked()) { _ownAddBlockTip(); return; }
const cat = currentCardsTab;
if (isImageCat(cat) || cat === '语音') return;
_clOpen(_addTargetGi(cat));
}
var CARD_AUDIO_MAX = 2 * 1024 * 1024;
var _voiceTargetGi = -1;
function _pickCardAudio(btn) {
const input = $('#cardsAudioInput');
if (!input) return;
const anchor = (btn && btn.isConnected) ? btn : $('#newCardGroup');
pickFile(anchor, input, (f, list) => _addCardsFromAudio((list && list.length) ? list : (f ? [f] : [])));
}
function _addVoiceFlow(btn, gi) {
if (_ownAddBlocked()) { _ownAddBlockTip(); return; }
if (currentCardsTab !== '语音') {
currentCardsTab = '语音'; cardsSelectGroup(-1, ''); groupSearch = '';
if (typeof updateBatchBar === 'function') updateBatchBar();
renderGroups();
}
const target = (Number.isInteger(gi) && gi >= 0) ? gi : _addTargetGi('语音');
if (target < 0) { _newGroupForAdd('语音', ngi => { _voiceTargetGi = ngi; _pickCardAudio(btn); }); return; }
_voiceTargetGi = target;
_pickCardAudio(btn);
}
function _voiceIsAudioFile(f) {
if (!f) return false;
if (/^audio\//i.test(f.type || '')) return true;
return /\.(mp3|wav|ogg|oga|m4a|aac|webm|flac|opus)$/i.test(f.name || '');
}
async function _addCardsFromAudio(files) {
const g = _voiceTargetGi >= 0 ? data.groups[_voiceTargetGi] : null;
if (!g || !files || !files.length) return;
let added = 0, big = 0, bad = 0, dup = 0;
for (const f of files) {
if (!_voiceIsAudioFile(f)) { bad++; continue; }
if (f.size > CARD_AUDIO_MAX) { big++; continue; }
const url = await new Promise(res => {
const r = new FileReader();
r.onload = () => res(r.result);
r.onerror = () => res('');
r.readAsDataURL(f);
});
if (!url || url.indexOf('data:audio') !== 0) { bad++; continue; }
if (g.cards.some(c => { const v = voiceCardParts(c); return v && v.data === url; })) { dup++; continue; }
const name = String(f.name || '').replace(/\.[^.]+$/, '').replace(/\|+/g, ' ').trim().slice(0, 60) || '语音';
g.cards.push(name + '|||' + url); added++;
}
const tail = (dup ? `，${dup} 段这组里已有` : '') + (big ? `，${big} 个超过 2MB 没收` : '') + (bad ? `，${bad} 个不是音频没收` : '');
if (added) {
cardsSelectGroup(_voiceTargetGi, g.name);
await save();
renderGroups();
const unbound = currentCardsScope === 'own' && !g.contactId ? '（这一组还没绑给谁，TA 用不到：点组名旁那枚徽标绑一下）' : '';
showToast(`已添加 ${added} 段语音到「${g.name || '未命名'}」` + tail + unbound);
} else showToast(files.length > 1 ? `这几段都没进库${tail}` : `这一段没进库${tail}`);
}
if ($('#plusAddVoice')) $('#plusAddVoice').onclick = () => _addVoiceFlow($('#plusAddVoice'));

var DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
var DOCX_W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
var DOCX_PKG = 'xmlns="http://schemas.openxmlformats.org/package/2006/relationships"';
var DOCX_XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
function _docxEsc(s) {
return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function _docxClean(s) {
return String(s == null ? '' : s)
.replace(/\r\n?/g, '\n')
.replace(/\t/g, '    ')
.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\uFFFE\uFFFF]/g, '');
}
function _docxPara(line) {
const b = /^(===|---)/.test(line) ? '<w:rPr><w:b/></w:rPr>' : '';
return '<w:p><w:r>' + b + '<w:t xml:space="preserve">' + _docxEsc(line) + '</w:t></w:r></w:p>';
}
function docxBytesFromText(text) {
const body = _docxClean(text).split('\n').map(_docxPara).join('');
const doc = DOCX_XML + '<w:document ' + DOCX_W + '><w:body>' + body
+ '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="851" w:right="851" w:bottom="851" w:left="851" w:header="425" w:footer="425" w:gutter="0"/></w:sectPr>'
+ '</w:body></w:document>';
const styles = DOCX_XML + '<w:styles ' + DOCX_W + '><w:docDefaults><w:rPrDefault><w:rPr>'
+ '<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas" w:cs="Consolas"/><w:sz w:val="18"/><w:szCs w:val="18"/>'
+ '</w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/></w:pPr></w:pPrDefault>'
+ '</w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style></w:styles>';
const parts = [
['[Content_Types].xml', DOCX_XML + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
+ '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
+ '<Default Extension="xml" ContentType="application/xml"/>'
+ '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
+ '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>'],
['_rels/.rels', DOCX_XML + '<Relationships ' + DOCX_PKG + '><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
['word/_rels/document.xml.rels', DOCX_XML + '<Relationships ' + DOCX_PKG + '><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'],
['word/styles.xml', styles],
['word/document.xml', doc],
];
const enc = new TextEncoder();
const st = _dosStamp(new Date());
return _zipStore(parts.map(p => ({ name: p[0], bytes: enc.encode(p[1]), time: st[0], date: st[1] })));
}
function docxBlobFromText(text) {
try { return new Blob([docxBytesFromText(text)], { type: DOCX_MIME }); } catch (e) { return null; }
}
(window.__CHUNK_OK__ = window.__CHUNK_OK__ || {})['cards'] = true;
