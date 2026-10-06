import { MISSIONS, TYPE_LABEL } from './missions.js';
import { CODE_HASHES } from './codes.js';
import { hashCode } from './hash.js';
import { store, savePhoto, getPhoto, resizeImage } from './store.js';
import { portrait, medalSVG } from './emblem.js';
import { renderPuzzles } from './puzzles.js';

const app = document.getElementById('app');
const DEV = new URLSearchParams(location.search).has('dev');
const TOTAL = MISSIONS.length;

const MILESTONES = {
  5: 'Has recorrido la mitad del camino.',
  9: 'La Gran Carrera, completada.',
  10: 'Nivel 32 alcanzado.',
};

function h(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'class') node.className = value;
    else if (key === 'html') node.innerHTML = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value);
  }
  node.append(...children.flat().filter((c) => c !== null && c !== undefined && c !== false));
  return node;
}

const setScene = (name) => {
  document.body.dataset.scene = name;
};
const pad = (n) => String(n).padStart(2, '0');
const formatDate = (iso) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' });
const isUnlocked = (id) => DEV || id === 1 || store.isDone(id - 1);
const divider = () => h('div', { class: 'divider', 'aria-hidden': 'true' }, h('span', {}));

function mount(...nodes) {
  app.replaceChildren(...nodes);
  window.scrollTo(0, 0);
}

function intro() {
  setScene('home');
  mount(
    h(
      'section',
      { class: 'screen intro' },
      portrait('rect'),
      h('p', { class: 'eyebrow center' }, 'Un regalo en diez etapas'),
      h('h1', {}, 'Piyi, la Velocista de Jade'),
      divider(),
      h(
        'p',
        { class: 'lead' },
        'Diez pruebas de cuerpo y mente, del 1 al 17 de noviembre. Al superarlas todas, alcanzas el Nivel 32 y reclamas tus premios.',
      ),
      h('p', { class: 'lead soft' }, 'Cada misión se sella con tu palabra, una foto y un código secreto. Se avanza en orden.'),
      h(
        'button',
        {
          class: 'btn primary block',
          onclick: () => {
            store.setIntroSeen();
            location.hash = '#/';
            render();
          },
        },
        'Comenzar',
      ),
    ),
  );
}

function home() {
  const done = store.doneCount();
  const list = h('ol', { class: 'path' });
  for (const m of MISSIONS) {
    const finished = store.isDone(m.id);
    const open = isUnlocked(m.id);
    const current = open && !finished && (m.id === 1 || store.isDone(m.id - 1));
    const known = finished || current || DEV;
    const row = h(
      open ? 'a' : 'div',
      {
        class: `row ${finished ? 'done' : current ? 'current' : 'locked'}`,
        ...(open ? { href: `#/mission/${m.id}` } : {}),
      },
      h('span', { class: 'num' }, pad(m.id)),
      h(
        'span',
        { class: 'row-body' },
        h('strong', {}, known ? m.title : 'Misión secreta'),
        h('small', {}, known ? `${TYPE_LABEL[m.type]} · ${formatDate(m.date)}` : 'Se revelará a su tiempo'),
      ),
      h('span', { class: 'state', 'aria-hidden': 'true' }, finished ? '✓' : open ? '→' : '·'),
    );
    list.append(h('li', {}, row));
  }

  const segments = h(
    'div',
    { class: 'segments', 'aria-hidden': 'true' },
    MISSIONS.map((m) => h('span', { class: store.isDone(m.id) ? 'on' : '' })),
  );

  mount(
    h(
      'section',
      { class: 'screen' },
      h(
        'header',
        { class: 'banner' },
        portrait('banner'),
        h(
          'div',
          { class: 'banner-info' },
          h('p', { class: 'eyebrow' }, 'Piyi, la Velocista de Jade'),
          h('p', { class: 'level' }, done >= TOTAL ? 'Nivel 32' : 'Nivel 31'),
          segments,
          h('small', {}, `${done} de ${TOTAL} misiones completadas`),
        ),
        h('span', { class: 'seal', 'aria-hidden': 'true' }, '玉'),
      ),
      list,
      done >= TOTAL ? h('a', { class: 'btn primary block', href: '#/chronicle' }, 'Ver la Crónica') : null,
      DEV
        ? h(
            'button',
            {
              class: 'btn ghost',
              onclick: async () => {
                if (confirm('¿Reiniciar todo el progreso?')) {
                  await store.reset();
                  render();
                }
              },
            },
            'Dev: reiniciar progreso',
          )
        : null,
    ),
  );
}

function levelUp(done, id) {
  const note = MILESTONES[id];
  const overlay = h(
    'div',
    { class: 'overlay' },
    h(
      'div',
      { class: 'levelup' },
      h('p', { class: 'eyebrow' }, 'Misión sellada'),
      h('div', { class: 'medal-wrap', html: medalSVG(pad(id)) }),
      h('h2', {}, done >= TOTAL ? 'Nivel 32' : `Misión ${pad(id)} completada`),
      note ? h('p', { class: 'lead' }, note) : null,
      h(
        'button',
        {
          class: 'btn primary block',
          onclick: () => {
            overlay.remove();
            location.hash = done >= TOTAL ? '#/chronicle' : '#/';
          },
        },
        done >= TOTAL ? 'Ver la Crónica' : 'Continuar',
      ),
    ),
  );
  document.body.append(overlay);
}

function completionPanel(mission) {
  let photoData = null;
  const preview = h('img', { class: 'preview', alt: '' });
  preview.hidden = true;
  const honor = h('input', { type: 'checkbox', id: 'honor' });
  const code = h('input', {
    class: 'text-input code',
    type: 'text',
    placeholder: 'Código secreto',
    autocomplete: 'off',
    autocapitalize: 'characters',
    spellcheck: 'false',
  });
  const message = h('p', { class: 'feedback' });
  const seal = h('button', { class: 'btn primary block', type: 'button' }, 'Sellar misión');

  const file = h('input', {
    type: 'file',
    accept: 'image/*',
    class: 'file',
    onchange: async (e) => {
      const chosen = e.target.files?.[0];
      if (!chosen) return;
      try {
        photoData = await resizeImage(chosen);
        preview.src = photoData;
        preview.hidden = false;
      } catch {
        message.textContent = 'No pude leer esa foto. Prueba con otra.';
        message.className = 'feedback bad';
      }
    },
  });

  seal.addEventListener('click', async () => {
    message.className = 'feedback bad';
    if (!honor.checked) return void (message.textContent = 'Falta tu palabra de honor.');
    if (!photoData && !DEV) return void (message.textContent = 'Falta la foto de la misión.');
    const valid = DEV || (await hashCode(mission.id, code.value)) === CODE_HASHES[mission.id];
    if (!valid) {
      message.textContent = 'Ese código no es válido.';
      seal.classList.add('shake');
      setTimeout(() => seal.classList.remove('shake'), 500);
      return;
    }
    seal.disabled = true;
    if (photoData) await savePhoto(mission.id, photoData);
    store.markDone(mission.id);
    levelUp(store.doneCount(), mission.id);
  });

  return h(
    'div',
    { class: 'panel' },
    h('h3', {}, 'Sella tu misión'),
    h('label', { class: 'check', for: 'honor' }, honor, ' Doy mi palabra de que la cumplí.'),
    h('label', { class: 'field' }, h('span', {}, 'Foto de la misión'), file, preview),
    h('label', { class: 'field' }, h('span', {}, 'Código secreto (te lo da Esteban)'), code),
    message,
    seal,
  );
}

async function mission(id) {
  const m = MISSIONS.find((x) => x.id === id);
  if (!m || !isUnlocked(id)) {
    location.hash = '#/';
    return;
  }
  const finished = store.isDone(id);
  const body = h('div', { class: 'mission-body' });
  const header = h(
    'header',
    { class: 'mission-head' },
    h('a', { class: 'back', href: '#/' }, '← Misiones'),
    h('p', { class: 'eyebrow' }, `Misión ${pad(m.id)} · ${TYPE_LABEL[m.type]}`),
    h('h2', {}, m.title),
    h('small', {}, `Fecha sugerida: ${formatDate(m.date)}`),
  );

  const content = [
    header,
    h('p', { class: 'story' }, m.story),
    h('p', { class: 'objective' }, h('strong', {}, 'Objetivo  '), m.objective),
    body,
  ];

  if (finished) {
    body.append(h('p', { class: 'feedback good' }, 'Misión completada ✓'));
    const photo = await getPhoto(id).catch(() => null);
    if (photo) body.append(h('img', { class: 'preview', src: photo, alt: 'Foto de la misión' }));
  } else if (m.puzzles?.length) {
    const stage = h('div', { class: 'stage' });
    body.append(stage);
    renderPuzzles(stage, m.puzzles, () => {
      stage.replaceChildren(h('p', { class: 'feedback good' }, 'Pruebas superadas ✓'));
      body.append(completionPanel(m));
    });
  } else {
    body.append(completionPanel(m));
  }

  setScene(m.type);
  mount(h('section', { class: 'screen' }, ...content));
}

async function chronicle() {
  if (store.doneCount() < TOTAL && !DEV) {
    location.hash = '#/';
    return;
  }
  setScene('final');
  const grid = h('div', { class: 'gallery' });
  mount(
    h(
      'section',
      { class: 'screen' },
      h('a', { class: 'back', href: '#/' }, '← Misiones'),
      portrait('rect'),
      h('p', { class: 'eyebrow center' }, 'Crónica'),
      h('h1', {}, 'Piyi, la Velocista de Jade'),
      divider(),
      h('p', { class: 'lead' }, 'Nivel 32. Diez pruebas de cuerpo y mente, y este es su registro.'),
      grid,
    ),
  );
  for (const m of MISSIONS) {
    const photo = await getPhoto(m.id).catch(() => null);
    grid.append(
      h(
        'figure',
        { class: 'shot' },
        photo ? h('img', { src: photo, alt: m.title }) : h('div', { class: 'noshot' }, '—'),
        h('figcaption', {}, h('b', {}, pad(m.id)), ` ${m.title}`),
      ),
    );
  }
}

function render() {
  document.querySelector('.overlay')?.remove();
  setScene('home');
  const hash = location.hash || '#/';
  if (!store.introSeen() && !DEV) return intro();
  const match = hash.match(/^#\/mission\/(\d+)$/);
  if (match) return void mission(Number(match[1]));
  if (hash === '#/chronicle') return void chronicle();
  home();
}

window.addEventListener('hashchange', render);
render();
