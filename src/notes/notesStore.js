// Per-user notes persisted in localStorage. Each entry has:
//   { id, title, body, createdAt, updatedAt }

const keyFor = (userId) => `demo-notes-${userId || 'anon'}`;

export const readNotes = (userId) => {
  try {
    return JSON.parse(localStorage.getItem(keyFor(userId)) || '[]');
  } catch {
    return [];
  }
};

export const writeNotes = (userId, notes) => {
  localStorage.setItem(keyFor(userId), JSON.stringify(notes));
};

export const newNote = () => ({
  id:
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now() + Math.random()),
  title: '',
  body: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export const upsertNote = (notes, note) => {
  const next = { ...note, updatedAt: new Date().toISOString() };
  const idx = notes.findIndex((n) => n.id === next.id);
  if (idx === -1) return [next, ...notes];
  const out = notes.slice();
  out[idx] = next;
  return out;
};

export const removeNote = (notes, id) => notes.filter((n) => n.id !== id);
