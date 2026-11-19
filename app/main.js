// Boot for the Leonida Trophy Guide: loads the trophy data, wires the
// toolbar (search, grade, kind chips, spoiler switch, export/import), the
// two views, and the hash routes the screenshots use. No network request
// beyond the app's own files; the guide works with the network off.
import { loadEarned, saveEarned, toggleEarned, buildExportPayload, parseImportText, filterKnownNames } from './tracker.js';
import { renderKindChips, renderProgress, renderList } from './render.js';
import { renderRoadmap } from './roadmap.js';

const listEl = document.getElementById('trophyList');
const metaEl = document.getElementById('listMeta');
const emptyEl = document.getElementById('emptyState');
const chipsEl = document.getElementById('kindChips');
const searchInput = document.getElementById('searchInput');
const gradeSelect = document.getElementById('gradeSelect');
const spoilerToggle = document.getElementById('spoilerToggle');
const viewList = document.getElementById('viewList');
const viewRoadmap = document.getElementById('viewRoadmap');
const tabGuide = document.getElementById('tabGuide');
const tabRoadmap = document.getElementById('tabRoadmap');

const state = {
  trophies: [],
  sourceIndex: {},
  earned: loadEarned(),
  filters: { kind: 'all', grade: 'all', query: '' },
  spoilersHidden: true,
  expanded: new Set(),
  view: 'list',
};

function paint() {
  renderKindChips(chipsEl, state.filters.kind, (kind) => {
    state.filters.kind = kind;
    paint();
  });
  renderProgress(state.trophies, state.earned);
  renderList(listEl, metaEl, emptyEl, state.trophies, state.filters, {
    earned: state.earned,
    spoilersHidden: state.spoilersHidden,
    expanded: state.expanded,
    sourceIndex: state.sourceIndex,
    onToggleEarned: (name) => {
      toggleEarned(state.earned, name);
      paint();
    },
    onToggleGuide: (id) => {
      if (state.expanded.has(id)) state.expanded.delete(id);
      else state.expanded.add(id);
      paint();
    },
  });
  document.title = `Leonida Trophy Guide — ${state.earned.size} of ${state.trophies.length} earned`;
}

function showView(view) {
  state.view = view;
  const roadmap = view === 'roadmap';
  viewRoadmap.hidden = !roadmap;
  viewList.hidden = roadmap;
  tabGuide.classList.toggle('active', !roadmap);
  tabRoadmap.classList.toggle('active', roadmap);
  if (roadmap) renderRoadmap(document.getElementById('roadmapBody'));
  window.scrollTo(0, 0);
}

// Hash routes: #view=roadmap, #kind=story, #spoilers=off, #expand=28,
// #q=meditate — used by the screenshot runs and shareable links.
function applyHash() {
  const params = new URLSearchParams(location.hash.slice(1));
  const view = params.get('view');
  showView(view === 'roadmap' ? 'roadmap' : 'list');
  const kind = params.get('kind');
  if (kind) state.filters.kind = kind;
  const spoilers = params.get('spoilers');
  if (spoilers === 'off' || spoilers === 'on') {
    state.spoilersHidden = spoilers === 'on';
    spoilerToggle.checked = state.spoilersHidden;
  }
  const expand = params.get('expand');
  if (expand) {
    for (const raw of expand.split(',')) {
      const id = Number(raw);
      if (Number.isInteger(id)) state.expanded.add(id);
    }
  }
  const query = params.get('q');
  if (query) {
    state.filters.query = query;
    searchInput.value = query;
  }
}

function downloadFile(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

searchInput.addEventListener('input', () => {
  state.filters.query = searchInput.value.trim();
  paint();
});
gradeSelect.addEventListener('change', () => {
  state.filters.grade = gradeSelect.value;
  paint();
});
spoilerToggle.addEventListener('change', () => {
  state.spoilersHidden = spoilerToggle.checked;
  paint();
});
tabGuide.addEventListener('click', () => showView('list'));
tabRoadmap.addEventListener('click', () => showView('roadmap'));
document.getElementById('exportBtn').addEventListener('click', () => {
  downloadFile('gta6-trophy-progress.json', JSON.stringify(buildExportPayload(state.earned), null, 2));
});
document.getElementById('importInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = parseImportText(await file.text());
    state.earned = filterKnownNames(imported, state.trophies);
    saveEarned(state.earned);
    paint();
  } catch (error) {
    alert(`Could not import that file: ${error.message}`);
  }
  event.target.value = '';
});
document.getElementById('resetBtn').addEventListener('click', () => {
  if (state.earned.size === 0) return;
  if (confirm('Clear all earned ticks? You can import them back from an exported file.')) {
    state.earned = new Set();
    saveEarned(state.earned);
    paint();
  }
});
window.addEventListener('hashchange', () => {
  applyHash();
  paint();
});

const data = await (await fetch('data/trophies.json')).json();
state.trophies = data.trophies || [];
state.sourceIndex = data.sourceIndex || {};
applyHash();
paint();
window.__shotReady = true;
