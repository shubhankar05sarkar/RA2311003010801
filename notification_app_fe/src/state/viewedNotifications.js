const STORAGE_KEY = 'viewed_notifications';

function load() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function save(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

export function markViewed(id) {
  const viewed = load();
  viewed.add(id);
  save(viewed);
}

export function markAllViewed(ids) {
  const viewed = load();
  ids.forEach(id => viewed.add(id));
  save(viewed);
}

export function isViewed(id) {
  return load().has(id);
}

export function getViewedSet() {
  return load();
}
