const strip = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function quiz(root, puzzle, onSolved) {
  let remaining = puzzle.questions.length;
  puzzle.questions.forEach((item, qi) => {
    const block = el('div', 'q-block');
    block.append(el('p', 'q-text', `${qi + 1}. ${item.q}`));
    const opts = el('div', 'q-options');
    item.options.forEach((label, oi) => {
      const btn = el('button', 'opt', label);
      btn.type = 'button';
      btn.addEventListener('click', () => {
        if (block.dataset.solved) return;
        if (oi === item.answer) {
          btn.classList.add('ok');
          block.dataset.solved = '1';
          if (--remaining === 0) onSolved();
        } else {
          btn.classList.add('bad');
          setTimeout(() => btn.classList.remove('bad'), 700);
        }
      });
      opts.append(btn);
    });
    block.append(opts);
    root.append(block);
  });
}

function riddle(root, puzzle, onSolved) {
  root.append(el('p', 'q-text', puzzle.prompt));
  const input = el('input', 'text-input');
  input.type = 'text';
  input.autocomplete = 'off';
  input.autocapitalize = 'none';
  input.placeholder = 'Tu respuesta';
  const btn = el('button', 'btn', 'Responder');
  const msg = el('p', 'feedback');
  const check = () => {
    const guess = strip(input.value);
    if (puzzle.answers.some((a) => strip(a) === guess)) {
      msg.textContent = '¡Correcto!';
      msg.className = 'feedback good';
      input.disabled = btn.disabled = true;
      onSolved();
    } else {
      msg.textContent = 'Todavía no. Piénsalo otra vez.';
      msg.className = 'feedback bad';
    }
  };
  btn.addEventListener('click', check);
  input.addEventListener('keydown', (e) => e.key === 'Enter' && check());
  root.append(input, btn, msg);
  if (puzzle.hint) {
    const hint = el('details', 'hint');
    hint.append(el('summary', '', 'Pista'), el('p', '', puzzle.hint));
    root.append(hint);
  }
}

function speak(text) {
  if (!('speechSynthesis' in window)) return false;
  const voices = speechSynthesis.getVoices();
  const voice = voices.find((v) => v.lang.toLowerCase().startsWith('zh'));
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = voice?.lang ?? 'zh-CN';
  if (voice) utter.voice = voice;
  utter.rate = 0.8;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
  return Boolean(voice);
}

function listen(root, puzzle, onSolved) {
  root.append(el('p', 'q-text', puzzle.q));
  const play = el('button', 'btn', '🔊 Escuchar');
  const note = el('p', 'feedback');
  play.addEventListener('click', () => {
    const ok = speak(puzzle.speak);
    if (!ok && puzzle.pinyin) {
      note.textContent = `Si no oyes nada, tu teléfono no tiene voz en chino. Se dice: ${puzzle.pinyin}`;
    }
  });
  root.append(play, note);
  let solved = false;
  const opts = el('div', 'q-options');
  puzzle.options.forEach((label, oi) => {
    const btn = el('button', 'opt', label);
    btn.type = 'button';
    btn.addEventListener('click', () => {
      if (solved) return;
      if (oi === puzzle.answer) {
        solved = true;
        btn.classList.add('ok');
        onSolved();
      } else {
        btn.classList.add('bad');
        setTimeout(() => btn.classList.remove('bad'), 700);
      }
    });
    opts.append(btn);
  });
  root.append(opts);
}

const DIRS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [-1, 1],
  [0, -1],
  [-1, 0],
  [-1, -1],
  [1, -1],
];

function buildGrid(words, size, seed) {
  for (let attempt = 0; attempt < 60; attempt++) {
    const rand = mulberry32(seed + attempt * 7919);
    const grid = Array.from({ length: size }, () => Array(size).fill(''));
    let ok = true;
    for (const word of [...words].sort((a, b) => b.length - a.length)) {
      let placed = false;
      for (let t = 0; t < 300 && !placed; t++) {
        const [dr, dc] = DIRS[Math.floor(rand() * DIRS.length)];
        const r = Math.floor(rand() * size);
        const c = Math.floor(rand() * size);
        const er = r + dr * (word.length - 1);
        const ec = c + dc * (word.length - 1);
        if (er < 0 || er >= size || ec < 0 || ec >= size) continue;
        let fits = true;
        for (let i = 0; i < word.length; i++) {
          const cell = grid[r + dr * i][c + dc * i];
          if (cell && cell !== word[i]) {
            fits = false;
            break;
          }
        }
        if (!fits) continue;
        for (let i = 0; i < word.length; i++) grid[r + dr * i][c + dc * i] = word[i];
        placed = true;
      }
      if (!placed) {
        ok = false;
        break;
      }
    }
    if (ok) {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (let r = 0; r < size; r++)
        for (let c = 0; c < size; c++)
          if (!grid[r][c]) grid[r][c] = letters[Math.floor(rand() * 26)];
      return grid;
    }
  }
  throw new Error('No se pudo generar la sopa de letras');
}

function wordsearch(root, puzzle, onSolved) {
  const words = puzzle.words.map((w) => strip(w).toUpperCase());
  const size = puzzle.size ?? 11;
  const grid = buildGrid(words, size, puzzle.seed ?? 1);
  const found = new Set();
  let start = null;

  const board = el('div', 'ws-grid');
  board.style.setProperty('--n', size);
  const cells = grid.map((row, r) =>
    row.map((letter, c) => {
      const cell = el('button', 'ws-cell', letter);
      cell.type = 'button';
      cell.dataset.r = r;
      cell.dataset.c = c;
      board.append(cell);
      return cell;
    }),
  );
  const list = el('ul', 'ws-words');
  const items = new Map(
    puzzle.words.map((label, i) => {
      const li = el('li', '', label);
      list.append(li);
      return [words[i], li];
    }),
  );

  const clearStart = () => {
    if (start) cells[start.r][start.c].classList.remove('sel');
    start = null;
  };

  board.addEventListener('click', (e) => {
    const cell = e.target.closest('.ws-cell');
    if (!cell) return;
    const r = Number(cell.dataset.r);
    const c = Number(cell.dataset.c);
    if (!start) {
      start = { r, c };
      cell.classList.add('sel');
      return;
    }
    const prev = start;
    const dr = r - prev.r;
    const dc = c - prev.c;
    const len = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
    const straight = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
    if (straight && len > 1) {
      const sr = Math.sign(dr);
      const sc = Math.sign(dc);
      const path = Array.from({ length: len }, (_, i) => [prev.r + sr * i, prev.c + sc * i]);
      const text = path.map(([pr, pc]) => grid[pr][pc]).join('');
      const word = words.find((w) => w === text || w === [...text].reverse().join(''));
      if (word && !found.has(word)) {
        found.add(word);
        path.forEach(([pr, pc]) => cells[pr][pc].classList.add('found'));
        items.get(word).classList.add('done');
        clearStart();
        if (found.size === words.length) onSolved();
        return;
      }
    }
    clearStart();
    if (prev.r !== r || prev.c !== c) {
      start = { r, c };
      cell.classList.add('sel');
    }
  });

  root.append(el('p', 'q-text', puzzle.prompt ?? 'Toca la primera y la última letra de cada palabra.'), board, list);
}

const TYPES = { quiz, riddle, listen, wordsearch };

export function renderPuzzles(root, puzzles, onAllSolved) {
  root.replaceChildren();
  let index = 0;

  const showStage = () => {
    root.replaceChildren();
    const puzzle = puzzles[index];
    const head = el('div', 'stage-head');
    head.append(
      el('span', 'stage-count', `Prueba ${index + 1} de ${puzzles.length}`),
      el('h3', '', puzzle.title),
    );
    const body = el('div', 'stage-body');
    root.append(head, body);
    TYPES[puzzle.type](body, puzzle, () => {
      const next = el('button', 'btn primary', index + 1 < puzzles.length ? 'Siguiente prueba →' : 'Completar pruebas ✓');
      next.addEventListener('click', () => {
        index += 1;
        if (index < puzzles.length) showStage();
        else onAllSolved();
      });
      root.append(next);
    });
  };

  showStage();
}
