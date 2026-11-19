// Earned-trophy state for the Leonida guide: load, save, toggle, export, import.
// Progress lives only in this browser (localStorage); nothing is sent anywhere.
export const STORAGE_KEY = 'gta6-trophy-guide-earned-v1';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    const names = Array.isArray(parsed) ? parsed : parsed.earned;
    if (!Array.isArray(names)) return new Set();
    return new Set(names.filter((name) => typeof name === 'string'));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort()));
}

export function toggleEarned(earned, name) {
  if (earned.has(name)) earned.delete(name);
  else earned.add(name);
  saveEarned(earned);
  return earned;
}

export function buildExportPayload(earned) {
  return {
    game: 'Grand Theft Auto VI',
    guide: 'Leonida Trophy Guide',
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort(),
  };
}

export function parseImportText(text) {
  const data = JSON.parse(text);
  const names = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(names)) {
    throw new Error('Import file must hold a list of trophy names, or an object with an "earned" list.');
  }
  return new Set(names.filter((name) => typeof name === 'string'));
}

// Keep only names this guide knows, so an import from another list or an
// old export can never tick a trophy that does not exist here.
export function filterKnownNames(names, trophies) {
  const known = new Set(trophies.map((t) => t.name));
  return new Set([...names].filter((name) => known.has(name)));
}

// Kinds the filter chips offer, in the order they appear.
export const FILTER_KINDS = ['all', 'story', 'missable', 'collectible', 'activity', 'robbery', 'character', 'money', 'online'];

export const KIND_LABELS = {
  all: 'All trophies',
  story: 'Story',
  missable: 'Missable',
  collectible: 'Collectibles',
  activity: 'Activities',
  robbery: 'Robberies',
  character: 'Characters',
  money: 'Money',
  online: 'Online',
  completion: '100% completion',
  misc: 'One-offs',
  platinum: 'Platinum',
};

export function kindLabel(kind) {
  return KIND_LABELS[kind] ?? kind;
}

// A trophy matches a filter kind when it carries that kind; missable and
// online are special cases because they are flags, not kinds.
export function trophyMatchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  if (kind === 'online') return (trophy.kinds || []).includes('online');
  return (trophy.kinds || []).includes(kind);
}

export function trophyMatchesQuery(trophy, query) {
  if (!query) return true;
  const haystack = [trophy.name, trophy.description, trophy.guide, (trophy.kinds || []).join(' ')]
    .join(' ')
    .toLowerCase();
  return query.toLowerCase().split(/\s+/).every((word) => haystack.includes(word));
}

export function formatCount(trophy) {
  if (typeof trophy.count !== 'number') return null;
  if (trophy.count >= 1000) return trophy.count.toLocaleString('en-US');
  return String(trophy.count);
}
