import { CHESTS, TASKS, PRACTICE, START_DATE, TYPE_LABEL } from './missions.js';
import { CODE_HASHES } from './codes.js';
import { hashCode } from './hash.js';
import { store, savePhoto, getPhoto, resizeImage } from './store.js';
import { portrait, medalSVG } from './emblem.js';
import { renderPuzzles } from './puzzles.js';

const app = document.getElementById('app');
const params = new URLSearchParams(location.search);
const DEV = params.has('dev');
const TOTAL_TASKS = TASKS.length;
const TOTAL_CHESTS = CHESTS.length;

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

/* ---------- Fechas ---------- */
const pad = (n) => String(n).padStart(2, '0');
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (iso, n) => {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + n);
  return toISO(d);
};
const todayISO = () => params.get('today') ?? toISO(new Date());
const taskDate = (n) => addDays(START_DATE, n - 1);
const formatDate = (iso) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' });

/* ---------- Estado de pruebas y cofres ---------- */
function taskState(n) {
  if (store.isDone(n)) return 'done';
  if (isPractice(n)) return 'available';
  if (DEV) return 'available';
  if (n > 1 && !store.isDone(n - 1)) return 'locked';
  if (todayISO() < taskDate(n)) return 'waitDate';
  return 'available';
}
const practiceOf = (id) => PRACTICE.find((p) => String(p.n) === String(id));
const isPractice = (id) => Boolean(practiceOf(id));
const isStandalone = () => window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
const chestOf = (id) => CHESTS.find((c) => c.id === id);
const chestTasks = (c) => TASKS.filter((t) => t.chestId === c.id);
const chestDoneCount = (c) => chestTasks(c).filter((t) => store.isDone(t.n)).length;
const chestReady = (c) => chestDoneCount(c) === 3 && !store.isOpened(c.id);
const chestKnown = (c) => DEV || chestTasks(c).some((t) => ['done', 'available'].includes(taskState(t.n)));

const setScene = (name) => {
  document.body.dataset.scene = name;
};
const divider = () => h('div', { class: 'divider', 'aria-hidden': 'true' }, h('span', {}));

function mount(...nodes) {
  app.replaceChildren(...nodes);
  window.scrollTo(0, 0);
}

function overlay(...content) {
  const node = h('div', { class: 'overlay' }, h('div', { class: 'levelup' }, ...content));
  document.body.append(node);
  return node;
}

/* ---------- Pantallas ---------- */
function intro() {
  setScene('home');
  mount(
    h(
      'section',
      { class: 'screen intro' },
      portrait('rect'),
      h('p', { class: 'eyebrow center' }, 'Un regalo en treinta días'),
      h('h1', {}, 'Piyi, la Velocista de Jade'),
      divider(),
      h(
        'p',
        { class: 'lead' },
        'Treinta pruebas, una por día, del 19 de octubre al 17 de noviembre. Cada tres pruebas abren un cofre con un regalo.',
      ),
      h('p', { class: 'lead soft' }, 'Dos de lógica y una física en cada cofre. Se avanza en orden, un día a la vez.'),
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

function todayCards() {
  const cards = [];
  const pendingPractice = PRACTICE.find((p) => !store.isDone(p.n));
  if (pendingPractice && (DEV || todayISO() < START_DATE)) {
    cards.push(
      h(
        'a',
        { class: 'today', href: `#/task/${pendingPractice.n}` },
        h('p', { class: 'eyebrow' }, pendingPractice.label),
        h('strong', {}, pendingPractice.title.replace('Prueba 0: ', '')),
        h('small', {}, pendingPractice.blurb),
      ),
    );
  }
  if (!DEV && !isStandalone() && !store.noticeHidden()) {
    cards.push(
      h(
        'div',
        { class: 'today install' },
        h('p', { class: 'eyebrow' }, 'Instala la app'),
        h('strong', {}, 'Agrégala a tu pantalla de inicio'),
        h(
          'small',
          {},
          '1. En Safari, toca el botón Compartir (el cuadrado con la flecha). 2. Elige «Agregar a inicio». 3. Ábrela siempre desde ese ícono nuevo: tu progreso queda guardado ahí.',
        ),
        h(
          'button',
          {
            class: 'btn small-btn',
            type: 'button',
            onclick: () => {
              store.hideNotice();
              render();
            },
          },
          'Ya la instalé',
        ),
      ),
    );
  }
  const ready = CHESTS.find(chestReady);
  if (ready) {
    cards.push(
      h(
        'a',
        { class: 'today ready', href: `#/chest/${ready.id}` },
        h('p', { class: 'eyebrow' }, 'Cofre listo'),
        h('strong', {}, `Misión ${pad(ready.id)} · ${ready.title}`),
        h('small', {}, 'Pídele a Esteban el código para abrirlo.'),
      ),
    );
  }
  const next = TASKS.find((t) => !store.isDone(t.n));
  if (next) {
    const state = taskState(next.n);
    if (state === 'available') {
      cards.push(
        h(
          'a',
          { class: 'today', href: `#/task/${next.n}` },
          h('p', { class: 'eyebrow' }, 'Prueba de hoy'),
          h('strong', {}, next.title),
          h('small', {}, `Misión ${pad(next.chestId)} · Prueba ${next.idx + 1} de 3 · ${TYPE_LABEL[next.type]}`),
        ),
      );
    } else {
      const started = todayISO() >= START_DATE;
      cards.push(
        h(
          'div',
          { class: 'today wait' },
          h('p', { class: 'eyebrow' }, started ? 'Hasta mañana' : 'El juego comienza pronto'),
          h('strong', {}, `Tu próxima prueba se abre el ${formatDate(taskDate(next.n))}`),
        ),
      );
    }
  }
  return cards;
}

function home() {
  const done = store.doneCount();
  const opened = store.openedCount();
  const list = h('ol', { class: 'path' });
  for (const c of CHESTS) {
    const tasks = chestTasks(c);
    const known = chestKnown(c);
    const isOpen = store.isOpened(c.id);
    const ready = chestReady(c);
    const pips = h(
      'span',
      { class: 'pips', 'aria-hidden': 'true' },
      tasks.map((t) => h('i', { class: store.isDone(t.n) ? 'on' : '' })),
    );
    const row = h(
      known ? 'a' : 'div',
      {
        class: `row ${isOpen ? 'done' : ready ? 'current' : known ? 'active' : 'locked'}`,
        ...(known ? { href: `#/chest/${c.id}` } : {}),
      },
      h('span', { class: 'num' }, pad(c.id)),
      h(
        'span',
        { class: 'row-body' },
        h('strong', {}, known ? c.title : 'Misión secreta'),
        known ? pips : h('small', {}, 'Se revelará a su tiempo'),
      ),
      h('span', { class: 'state', 'aria-hidden': 'true' }, isOpen ? '✓' : ready ? '◆' : known ? '→' : '·'),
    );
    list.append(h('li', {}, row));
  }

  const segments = h(
    'div',
    { class: 'segments', 'aria-hidden': 'true' },
    CHESTS.map((c) => h('span', { class: store.isOpened(c.id) ? 'on' : '' })),
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
          h('p', { class: 'level' }, opened >= TOTAL_CHESTS ? 'Nivel 32' : 'Nivel 31'),
          segments,
          h('small', {}, `${done} de ${TOTAL_TASKS} pruebas · ${opened} de ${TOTAL_CHESTS} regalos`),
        ),
        h('span', { class: 'seal', 'aria-hidden': 'true' }, '玉'),
      ),
      ...todayCards(),
      list,
      opened >= TOTAL_CHESTS ? h('a', { class: 'btn primary block', href: '#/chronicle' }, 'Ver la Crónica') : null,
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

function giftReveal(chest) {
  const hasGift = Boolean(chest.gift?.name);
  const last = store.openedCount() >= TOTAL_CHESTS;
  const gift = h('div', { class: 'gift' });
  const photo = new Image();
  photo.alt = '';
  photo.src = `assets/gifts/${chest.id}.jpg`;
  photo.onload = () => gift.prepend(photo);
  gift.append(h('p', { class: 'gift-name' }, hasGift ? chest.gift.name : 'Un regalo sorpresa'));
  if (!hasGift) gift.append(h('small', {}, 'Esteban te lo entrega en persona.'));
  const node = overlay(
    h('p', { class: 'eyebrow' }, '¡Cofre abierto!'),
    h('div', { class: 'medal-wrap', html: medalSVG(pad(chest.id)) }),
    h('h2', {}, '¡Te has ganado!'),
    gift,
    h(
      'button',
      {
        class: 'btn primary block',
        onclick: () => {
          node.remove();
          location.hash = last ? '#/chronicle' : '#/';
          render();
        },
      },
      last ? 'Ver la Crónica' : 'Continuar',
    ),
  );
}

function chestPanel(chest) {
  if (store.isOpened(chest.id)) {
    return h(
      'div',
      { class: 'panel' },
      h('h3', {}, 'Tu regalo'),
      h('p', { class: 'gift-name' }, chest.gift?.name ?? 'Un regalo sorpresa'),
    );
  }
  if (chestDoneCount(chest) < 3) {
    return h(
      'div',
      { class: 'panel muted-panel' },
      h('h3', {}, 'Cofre cerrado'),
      h('p', { class: 'lead soft left' }, 'Se abre al completar las 3 pruebas de esta misión.'),
    );
  }
  const code = h('input', {
    class: 'text-input code',
    type: 'text',
    placeholder: 'Código secreto',
    autocomplete: 'off',
    autocapitalize: 'characters',
    spellcheck: 'false',
  });
  const message = h('p', { class: 'feedback' });
  const open = h('button', { class: 'btn primary block', type: 'button' }, 'Abrir cofre');
  open.addEventListener('click', async () => {
    message.className = 'feedback bad';
    const valid = DEV || (await hashCode(chest.id, code.value)) === CODE_HASHES[chest.id];
    if (!valid) {
      message.textContent = 'Ese código no es válido.';
      open.classList.add('shake');
      setTimeout(() => open.classList.remove('shake'), 500);
      return;
    }
    open.disabled = true;
    store.markOpened(chest.id);
    giftReveal(chest);
  });
  return h(
    'div',
    { class: 'panel' },
    h('h3', {}, '¡Cofre listo!'),
    h('p', { class: 'lead soft left' }, 'Pídele a Esteban el código secreto para abrirlo.'),
    code,
    message,
    open,
  );
}

function chestView(id) {
  const chest = chestOf(id);
  if (!chest || !chestKnown(chest)) {
    location.hash = '#/';
    return;
  }
  const tasks = chestTasks(chest);
  const list = h('ol', { class: 'path' });
  for (const t of tasks) {
    const state = taskState(t.n);
    const open = state === 'done' || state === 'available';
    list.append(
      h(
        'li',
        {},
        h(
          open ? 'a' : 'div',
          { class: `row ${state === 'done' ? 'done' : state === 'available' ? 'current' : 'locked'}`, ...(open ? { href: `#/task/${t.n}` } : {}) },
          h('span', { class: 'num' }, String(t.idx + 1)),
          h(
            'span',
            { class: 'row-body' },
            h('strong', {}, open ? t.title : 'Prueba secreta'),
            h('small', {}, `${TYPE_LABEL[t.type]} · ${formatDate(taskDate(t.n))}`),
          ),
          h('span', { class: 'state', 'aria-hidden': 'true' }, state === 'done' ? '✓' : state === 'available' ? '→' : '·'),
        ),
      ),
    );
  }
  setScene('home');
  mount(
    h(
      'section',
      { class: 'screen' },
      h(
        'header',
        { class: 'mission-head' },
        h('a', { class: 'back', href: '#/' }, '← Misiones'),
        h('p', { class: 'eyebrow' }, `Misión ${pad(chest.id)}`),
        h('h2', {}, chest.title),
        h('small', {}, `${formatDate(taskDate(tasks[0].n))} – ${formatDate(taskDate(tasks[2].n))}`),
      ),
      h('p', { class: 'story' }, chest.story),
      list,
      chestPanel(chest),
    ),
  );
}

function taskDone(t) {
  if (isPractice(t.n)) {
    const node = overlay(
      h('p', { class: 'eyebrow' }, 'Práctica completada'),
      h('div', { class: 'medal-wrap', html: medalSVG('00') }),
      h('h2', {}, t.doneTitle),
      h('p', { class: 'lead' }, t.doneNote),
      h(
        'button',
        {
          class: 'btn primary block',
          onclick: () => {
            node.remove();
            location.hash = '#/';
            render();
          },
        },
        'Continuar',
      ),
    );
    return;
  }
  const chest = chestOf(t.chestId);
  const ready = chestDoneCount(chest) === 3;
  const nextTask = TASKS.find((x) => x.n === t.n + 1);
  let note = 'Completaste todas las pruebas. ¡Lo lograste!';
  if (ready) note = '¡Cofre listo! Pídele a Esteban el código para abrirlo.';
  else if (nextTask) {
    note = taskDate(nextTask.n) <= todayISO() ? 'Ya puedes seguir con la siguiente prueba.' : `Tu próxima prueba se abre el ${formatDate(taskDate(nextTask.n))}.`;
  }
  const node = overlay(
    h('p', { class: 'eyebrow' }, 'Prueba completada'),
    h('div', { class: 'medal-wrap', html: medalSVG(pad(t.n)) }),
    h('h2', {}, `Prueba ${t.n} de ${TOTAL_TASKS}`),
    h('p', { class: 'lead' }, note),
    h(
      'button',
      {
        class: 'btn primary block',
        onclick: () => {
          node.remove();
          location.hash = ready ? `#/chest/${chest.id}` : '#/';
          render();
        },
      },
      ready ? 'Ir al cofre' : 'Continuar',
    ),
  );
}

async function completeTask(t, photoData) {
  if (photoData) await savePhoto(`t${t.n}`, photoData);
  store.markDone(t.n);
  taskDone(t);
}

function physicalPanel(t) {
  let photoData = null;
  const preview = h('img', { class: 'preview', alt: '' });
  preview.hidden = true;
  const honor = h('input', { type: 'checkbox', id: 'honor' });
  const message = h('p', { class: 'feedback' });
  const done = h('button', { class: 'btn primary block', type: 'button' }, 'Marcar como hecha');
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
  done.addEventListener('click', async () => {
    message.className = 'feedback bad';
    if (!honor.checked) return void (message.textContent = 'Falta tu palabra de honor.');
    if (!photoData && !DEV) return void (message.textContent = 'Falta la foto de la prueba.');
    done.disabled = true;
    await completeTask(t, photoData);
  });
  return h(
    'div',
    { class: 'panel' },
    h('h3', {}, 'Registra tu prueba'),
    h('label', { class: 'check', for: 'honor' }, honor, ' Doy mi palabra de que la cumplí.'),
    h('label', { class: 'field' }, h('span', {}, 'Foto de la prueba'), file, preview),
    message,
    done,
  );
}

async function taskView(n) {
  const t = practiceOf(n) ?? TASKS.find((x) => x.n === n);
  const state = t ? taskState(n) : 'locked';
  if (!t || (state !== 'available' && state !== 'done')) {
    location.hash = '#/';
    return;
  }
  const body = h('div', { class: 'mission-body' });
  if (state === 'done') {
    body.append(h('p', { class: 'feedback good' }, 'Prueba completada ✓'));
    const photo = await getPhoto(`t${n}`).catch(() => null);
    if (photo) body.append(h('img', { class: 'preview', src: photo, alt: 'Foto de la prueba' }));
  } else if (t.puzzles?.length) {
    const stage = h('div', { class: 'stage' });
    body.append(stage);
    renderPuzzles(stage, t.puzzles, () => {
      stage.replaceChildren(h('p', { class: 'feedback good' }, 'Prueba superada ✓'));
      completeTask(t, null);
    });
  } else {
    body.append(physicalPanel(t));
  }
  setScene(t.type);
  mount(
    h(
      'section',
      { class: 'screen' },
      h(
        'header',
        { class: 'mission-head' },
        isPractice(n)
          ? h('a', { class: 'back', href: '#/' }, '← Misiones')
          : h('a', { class: 'back', href: `#/chest/${t.chestId}` }, `← Misión ${pad(t.chestId)}`),
        h('p', { class: 'eyebrow' }, isPractice(n) ? `Práctica · ${TYPE_LABEL[t.type]}` : `Prueba ${t.idx + 1} de 3 · ${TYPE_LABEL[t.type]}`),
        h('h2', {}, t.title),
        h('small', {}, isPractice(n) ? 'Disponible ahora' : formatDate(taskDate(n))),
      ),
      h('p', { class: 'story' }, t.story),
      h(
        'div',
        { class: 'objective' },
        h('p', {}, h('strong', {}, 'Objetivo  '), t.objective),
        t.checklist?.length ? h('ul', { class: 'checklist' }, t.checklist.map((item) => h('li', {}, item))) : null,
      ),
      body,
    ),
  );
}

async function chronicle() {
  if (store.openedCount() < TOTAL_CHESTS && !DEV) {
    location.hash = '#/';
    return;
  }
  setScene('final');
  const grid = h('div', { class: 'gallery' });
  const gifts = h('ol', { class: 'gift-list' }, CHESTS.map((c) => h('li', {}, c.gift?.name ?? 'Regalo sorpresa')));
  mount(
    h(
      'section',
      { class: 'screen' },
      h('a', { class: 'back', href: '#/' }, '← Misiones'),
      portrait('rect'),
      h('p', { class: 'eyebrow center' }, 'Crónica'),
      h('h1', {}, 'Piyi, la Velocista de Jade'),
      divider(),
      h('p', { class: 'lead' }, 'Nivel 32. Treinta pruebas de cuerpo y mente, y este es su registro.'),
      h('h3', {}, 'Tus regalos'),
      gifts,
      h('h3', {}, 'Tus retos físicos'),
      grid,
    ),
  );
  for (const t of TASKS.filter((x) => x.type === 'F')) {
    const photo = await getPhoto(`t${t.n}`).catch(() => null);
    grid.append(
      h(
        'figure',
        { class: 'shot' },
        photo ? h('img', { src: photo, alt: t.title }) : h('div', { class: 'noshot' }, '—'),
        h('figcaption', {}, h('b', {}, pad(t.n)), ` ${t.title}`),
      ),
    );
  }
}

function render() {
  document.querySelector('.overlay')?.remove();
  setScene('home');
  if (!store.introSeen() && !DEV) return intro();
  const hash = location.hash || '#/';
  let match = hash.match(/^#\/task\/(\w+)$/);
  if (match) return void taskView(/^\d+$/.test(match[1]) ? Number(match[1]) : match[1]);
  match = hash.match(/^#\/chest\/(\d+)$/);
  if (match) return void chestView(Number(match[1]));
  if (hash === '#/chronicle') return void chronicle();
  home();
}

window.addEventListener('hashchange', render);
render();
