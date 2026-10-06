const KEY = 'piyiquest.v1';
const DB_NAME = 'piyiquest-photos';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? { done: {} };
  } catch {
    return { done: {} };
  }
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* sin almacenamiento disponible */
  }
}

let state = load();

export const store = {
  isDone: (id) => Boolean(state.done[id]),
  doneCount: () => Object.keys(state.done).length,
  doneAt: (id) => state.done[id]?.at ?? null,
  markDone(id) {
    state.done[id] = { at: new Date().toISOString() };
    save(state);
  },
  introSeen: () => Boolean(state.introSeen),
  setIntroSeen() {
    state.introSeen = true;
    save(state);
  },
  reset() {
    state = { done: {} };
    save(state);
    return clearPhotos();
  },
};

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore('photos');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx(mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction('photos', mode);
    const result = fn(t.objectStore('photos'));
    t.oncomplete = () => resolve(result.result);
    t.onerror = () => reject(t.error);
  });
}

export const savePhoto = (id, dataUrl) => tx('readwrite', (s) => s.put(dataUrl, id));
export const getPhoto = (id) => tx('readonly', (s) => s.get(id));
export const clearPhotos = () => tx('readwrite', (s) => s.clear());

export function resizeImage(file, maxSide = 1100, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo leer la imagen'));
    };
    img.src = url;
  });
}
