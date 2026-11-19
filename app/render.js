// Renders the trophy checklist: filter chips, progress, trophy cards with
// guides and sources, the spoiler mask, and the empty states.
import { FILTER_KINDS, kindLabel, trophyMatchesKind, trophyMatchesQuery, formatCount } from './tracker.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

export function renderKindChips(container, activeKind, onPick) {
  container.replaceChildren();
  for (const kind of FILTER_KINDS) {
    const chip = el('button', 'chip' + (kind === activeKind ? ' active' : ''), kindLabel(kind));
    chip.type = 'button';
    chip.setAttribute('aria-pressed', kind === activeKind ? 'true' : 'false');
    chip.addEventListener('click', () => onPick(kind));
    container.append(chip);
  }
}

export function renderProgress(trophies, earned) {
  const total = trophies.length;
  const done = trophies.filter((t) => earned.has(t.name)).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  document.getElementById('progressText').textContent = `${done} of ${total} earned`;
  document.getElementById('progressPct').textContent = `${pct}%`;
  document.getElementById('progressFill').style.width = `${pct}%`;
  const byGrade = {};
  for (const t of trophies) {
    const key = t.grade;
    byGrade[key] = byGrade[key] || { done: 0, total: 0 };
    byGrade[key].total += 1;
    if (earned.has(t.name)) byGrade[key].done += 1;
  }
  const order = ['platinum', 'gold', 'silver', 'bronze'];
  document.getElementById('gradeCounts').textContent = order
    .filter((g) => byGrade[g])
    .map((g) => `${g}: ${byGrade[g].done}/${byGrade[g].total}`)
    .join(' · ');
}

function badgeFor(trophy) {
  const badge = el('span', `badge ${trophy.grade}`, trophy.grade);
  return badge;
}

function buildGuideBody(trophy, sourceIndex) {
  const body = el('div', 'guide-body');
  body.append(el('h3', null, 'How to earn it'));
  body.append(el('p', null, trophy.guide));
  const sources = el('div', 'guide-sources');
  sources.append(el('strong', null, 'Sources: '));
  const list = document.createElement('ul');
  for (const key of trophy.sources || []) {
    const entry = sourceIndex[key];
    const item = document.createElement('li');
    if (entry) {
      const link = document.createElement('a');
      link.href = entry.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = entry.label;
      item.append(link);
    } else {
      item.textContent = key;
    }
    list.append(item);
  }
  sources.append(list);
  body.append(sources);
  return body;
}

export function buildTrophyCard(trophy, state) {
  const { earned, spoilersHidden, expanded, sourceIndex, onToggleEarned, onToggleGuide } = state;
  const isEarned = earned.has(trophy.name);
  const masked = spoilersHidden && trophy.hidden && !isEarned;

  const card = el('article', 'trophy-card' + (isEarned ? ' earned' : '') + (trophy.missable ? ' missable-flag' : ''));
  card.dataset.trophyId = String(trophy.id);

  const top = el('div', 'trophy-top');
  const boxWrap = el('label', 'earn-box');
  boxWrap.title = isEarned ? 'Mark as not earned' : 'Mark as earned';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = isEarned;
  box.setAttribute('aria-label', `Earned: ${masked ? 'Hidden trophy' : trophy.name}`);
  box.addEventListener('change', () => onToggleEarned(trophy.name));
  boxWrap.append(box);
  top.append(boxWrap);

  const main = el('div', 'trophy-main');
  const nameRow = el('h2', 'trophy-name');
  const nameBtn = document.createElement('button');
  nameBtn.type = 'button';
  nameBtn.textContent = masked ? 'Hidden trophy' : trophy.name;
  nameBtn.addEventListener('click', () => onToggleGuide(trophy.id));
  nameRow.append(nameBtn);
  main.append(nameRow);

  if (masked) {
    main.append(el('p', 'spoiler-note', 'Hidden on PlayStation until earned. Tick the box once you have earned it to reveal its name, description and guide.'));
  } else {
    main.append(el('p', 'trophy-desc', trophy.description));
  }

  const badges = el('div', 'trophy-badges');
  badges.append(badgeFor(trophy));
  if (trophy.hidden) badges.append(el('span', 'badge hidden-badge', 'Hidden'));
  if (trophy.missable) badges.append(el('span', 'badge missable-badge', 'Possibly missable'));
  const count = formatCount(trophy);
  if (count) badges.append(el('span', 'badge count-badge', `Target: ${count}`));
  for (const kind of trophy.kinds || []) {
    badges.append(el('span', 'badge kind-badge', kindLabel(kind)));
  }
  main.append(badges);

  if (!masked) {
    const toggle = el('button', 'guide-toggle', expanded.has(trophy.id) ? 'Hide guide' : 'Show guide');
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', expanded.has(trophy.id) ? 'true' : 'false');
    toggle.addEventListener('click', () => onToggleGuide(trophy.id));
    main.append(toggle);
    if (expanded.has(trophy.id)) main.append(buildGuideBody(trophy, sourceIndex));
  }
  top.append(main);
  card.append(top);
  return card;
}

export function visibleTrophies(trophies, filters) {
  return trophies.filter((t) => {
    if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
    if (!trophyMatchesKind(t, filters.kind)) return false;
    if (!trophyMatchesQuery(t, filters.query)) return false;
    return true;
  });
}

export function renderList(listEl, metaEl, emptyEl, trophies, filters, state) {
  const shown = visibleTrophies(trophies, filters);
  metaEl.setAttribute('aria-live', 'polite');
  listEl.replaceChildren();
  for (const trophy of shown) {
    listEl.append(buildTrophyCard(trophy, state));
  }
  const earnedCount = trophies.filter((t) => state.earned.has(t.name)).length;
  metaEl.textContent = `Showing ${shown.length} of ${trophies.length} trophies · ${earnedCount} earned` +
    (filters.kind !== 'all' ? ` · kind: ${kindLabel(filters.kind)}` : '') +
    (filters.grade !== 'all' ? ` · grade: ${filters.grade}` : '') +
    (filters.query ? ` · matching “${filters.query}”` : '');
  if (shown.length === 0) {
    emptyEl.hidden = false;
    emptyEl.replaceChildren();
    if (filters.kind === 'online') {
      emptyEl.append(el('h2', null, 'No online trophies'));
      emptyEl.append(el('p', null, 'All 55 trophies unlock in single player — there are no online trophies in GTA VI at launch, so this filter is empty by design. (Sources: KeenGamer, Output Lag, eGamers.)'));
    } else {
      emptyEl.append(el('h2', null, 'Nothing matches'));
      emptyEl.append(el('p', null, 'Try a different search, grade or kind — or clear the filters to see the full list of 55.'));
    }
  } else {
    emptyEl.hidden = true;
    emptyEl.replaceChildren();
  }
}
