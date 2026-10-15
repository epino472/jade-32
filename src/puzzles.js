import { SCENES } from './scenes.js';

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
    block.append(item.big ? el('p', 'q-text q-big', item.q) : el('p', 'q-text', `${qi + 1}. ${item.q}`));
    if (item.big) block.append(el('small', 'q-count', `${qi + 1} de ${puzzle.questions.length}`));
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

function seededShuffle(list, rand) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function flags(root, puzzle, onSolved) {
  const rand = mulberry32(puzzle.seed ?? 5);
  const questions = puzzle.countries.map((country) => {
    const others = seededShuffle(
      puzzle.countries.filter((c) => c !== country),
      rand,
    )
      .slice(0, 3)
      .map((c) => c.name);
    const options = seededShuffle([country.name, ...others], rand);
    return { q: country.flag, big: true, options, answer: options.indexOf(country.name) };
  });
  quiz(root, { questions }, onSolved);
}

const SUDOKU_CONFIGS = {
  6: { n: 6, br: 2, bc: 3 },
  9: { n: 9, br: 3, bc: 3 },
};

function sudokuCandidates(grid, r, c, cfg) {
  const used = new Set();
  for (let i = 0; i < cfg.n; i++) {
    used.add(grid[r][i]);
    used.add(grid[i][c]);
  }
  const br = r - (r % cfg.br);
  const bc = c - (c % cfg.bc);
  for (let i = 0; i < cfg.br; i++) for (let j = 0; j < cfg.bc; j++) used.add(grid[br + i][bc + j]);
  const out = [];
  for (let v = 1; v <= cfg.n; v++) if (!used.has(v)) out.push(v);
  return out;
}

function countSudokuSolutions(grid, cfg, limit = 2) {
  let found = 0;
  const solve = () => {
    if (found >= limit) return;
    let best = null;
    let bestCands = null;
    search: for (let r = 0; r < cfg.n; r++) {
      for (let c = 0; c < cfg.n; c++) {
        if (grid[r][c]) continue;
        const cands = sudokuCandidates(grid, r, c, cfg);
        if (!bestCands || cands.length < bestCands.length) {
          best = [r, c];
          bestCands = cands;
          if (cands.length <= 1) break search;
        }
      }
    }
    if (!best) {
      found += 1;
      return;
    }
    for (const v of bestCands) {
      grid[best[0]][best[1]] = v;
      solve();
      grid[best[0]][best[1]] = 0;
      if (found >= limit) return;
    }
  };
  solve();
  return found;
}

function makeSudoku(seed, blanks, cfg) {
  const rand = mulberry32(seed);
  const solution = Array.from({ length: cfg.n }, () => Array(cfg.n).fill(0));
  const digits = Array.from({ length: cfg.n }, (_, i) => i + 1);
  const fill = (pos) => {
    if (pos === cfg.n * cfg.n) return true;
    const r = Math.floor(pos / cfg.n);
    const c = pos % cfg.n;
    const cands = sudokuCandidates(solution, r, c, cfg);
    for (const v of seededShuffle(digits.filter((d) => cands.includes(d)), rand)) {
      solution[r][c] = v;
      if (fill(pos + 1)) return true;
      solution[r][c] = 0;
    }
    return false;
  };
  fill(0);

  const given = solution.map((row) => [...row]);
  let removed = 0;
  for (const idx of seededShuffle([...Array(cfg.n * cfg.n).keys()], rand)) {
    if (removed >= blanks) break;
    const r = Math.floor(idx / cfg.n);
    const c = idx % cfg.n;
    const keep = given[r][c];
    given[r][c] = 0;
    if (countSudokuSolutions(given.map((row) => [...row]), cfg) === 1) removed += 1;
    else given[r][c] = keep;
  }
  return { given, solution };
}

function sudoku(root, puzzle, onSolved) {
  const cfg = SUDOKU_CONFIGS[puzzle.size ?? 6];
  const { given, solution } = makeSudoku(puzzle.seed ?? 3, puzzle.blanks ?? 20, cfg);
  const state = given.map((row) => [...row]);
  let selected = null;
  let finished = false;

  const board = el('div', `sd-grid n${cfg.n}`);
  board.style.setProperty('--n', cfg.n);
  const cells = state.map((row, r) =>
    row.map((_, c) => {
      const cell = el('button', 'sd-cell');
      cell.type = 'button';
      if (c % cfg.bc === cfg.bc - 1 && c < cfg.n - 1) cell.classList.add('box-r');
      if (r % cfg.br === cfg.br - 1 && r < cfg.n - 1) cell.classList.add('box-b');
      if (given[r][c]) cell.classList.add('given');
      cell.addEventListener('click', () => {
        if (finished) return;
        selected = { r, c };
        paint();
      });
      board.append(cell);
      return cell;
    }),
  );

  const conflicts = () => {
    const bad = new Set();
    for (let r = 0; r < cfg.n; r++)
      for (let c = 0; c < cfg.n; c++) {
        const v = state[r][c];
        if (!v) continue;
        for (let r2 = 0; r2 < cfg.n; r2++)
          for (let c2 = 0; c2 < cfg.n; c2++) {
            if (r2 === r && c2 === c) continue;
            const sameBox =
              Math.floor(r / cfg.br) === Math.floor(r2 / cfg.br) && Math.floor(c / cfg.bc) === Math.floor(c2 / cfg.bc);
            if (state[r2][c2] === v && (r2 === r || c2 === c || sameBox)) bad.add(`${r},${c}`);
          }
      }
    return bad;
  };

  const paint = () => {
    const bad = conflicts();
    cells.forEach((row, r) =>
      row.forEach((cell, c) => {
        cell.textContent = state[r][c] || '';
        cell.classList.toggle('sel', Boolean(selected) && selected.r === r && selected.c === c);
        cell.classList.toggle('bad', bad.has(`${r},${c}`));
      }),
    );
    const complete = state.every((row, r) => row.every((v, c) => v === solution[r][c]));
    if (complete && !finished) {
      finished = true;
      onSolved();
    }
  };

  const pad = el('div', 'sd-pad');
  pad.style.setProperty('--keys', cfg.n === 9 ? 5 : 7);
  for (let v = 1; v <= cfg.n; v++) {
    const key = el('button', 'btn small', String(v));
    key.type = 'button';
    key.addEventListener('click', () => setValue(v));
    pad.append(key);
  }
  const erase = el('button', 'btn small', '⌫');
  erase.type = 'button';
  erase.addEventListener('click', () => setValue(0));
  pad.append(erase);

  function setValue(v) {
    if (finished || !selected || given[selected.r][selected.c]) return;
    state[selected.r][selected.c] = v;
    paint();
  }

  const boxLabel = `${cfg.br}×${cfg.bc}`;
  root.append(
    el(
      'p',
      'q-text',
      puzzle.prompt ??
        `Completa la cuadrícula: cada fila, columna y recuadro de ${boxLabel} lleva los números del 1 al ${cfg.n}, sin repetir.`,
    ),
    board,
    pad,
  );
  paint();
}

const MAZE_CELL = 30;

function makeMaze(cols, rows, seed) {
  const rand = mulberry32(seed);
  const cells = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ n: true, e: true, s: true, w: true, seen: false })),
  );
  const dirs = [
    ['n', 0, -1, 's'],
    ['e', 1, 0, 'w'],
    ['s', 0, 1, 'n'],
    ['w', -1, 0, 'e'],
  ];
  const stack = [[0, 0]];
  cells[0][0].seen = true;
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const options = dirs.filter(([, dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      return nx >= 0 && ny >= 0 && nx < cols && ny < rows && !cells[ny][nx].seen;
    });
    if (!options.length) {
      stack.pop();
      continue;
    }
    const [dir, dx, dy, opposite] = options[Math.floor(rand() * options.length)];
    cells[y][x][dir] = false;
    cells[y + dy][x + dx][opposite] = false;
    cells[y + dy][x + dx].seen = true;
    stack.push([x + dx, y + dy]);
  }
  return cells;
}

function maze(root, puzzle, onSolved) {
  const cols = puzzle.cols ?? 9;
  const rows = puzzle.rows ?? 12;
  const grid = makeMaze(cols, rows, puzzle.seed ?? 9);
  const trail = [[0, 0]];
  let finished = false;
  const NS = 'http://www.w3.org/2000/svg';
  const pad = 4;
  const width = cols * MAZE_CELL + pad * 2;
  const height = rows * MAZE_CELL + pad * 2;

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('class', 'maze-svg');

  const line = (x1, y1, x2, y2) => {
    const l = document.createElementNS(NS, 'line');
    for (const [k, v] of Object.entries({ x1, y1, x2, y2 })) l.setAttribute(k, v);
    l.setAttribute('class', 'maze-wall');
    svg.append(l);
  };
  grid.forEach((row, y) =>
    row.forEach((cell, x) => {
      const px = pad + x * MAZE_CELL;
      const py = pad + y * MAZE_CELL;
      if (cell.n) line(px, py, px + MAZE_CELL, py);
      if (cell.w) line(px, py, px, py + MAZE_CELL);
      if (y === rows - 1 && cell.s) line(px, py + MAZE_CELL, px + MAZE_CELL, py + MAZE_CELL);
      if (x === cols - 1 && cell.e) line(px + MAZE_CELL, py, px + MAZE_CELL, py + MAZE_CELL);
    }),
  );

  const center = ([x, y]) => [pad + x * MAZE_CELL + MAZE_CELL / 2, pad + y * MAZE_CELL + MAZE_CELL / 2];
  const path = document.createElementNS(NS, 'polyline');
  path.setAttribute('class', 'maze-trail');
  const goal = document.createElementNS(NS, 'circle');
  const [gx, gy] = center([cols - 1, rows - 1]);
  goal.setAttribute('cx', gx);
  goal.setAttribute('cy', gy);
  goal.setAttribute('r', MAZE_CELL * 0.3);
  goal.setAttribute('class', 'maze-goal');
  const player = document.createElementNS(NS, 'circle');
  player.setAttribute('r', MAZE_CELL * 0.28);
  player.setAttribute('class', 'maze-player');
  svg.append(path, goal, player);

  const draw = () => {
    path.setAttribute('points', trail.map((p) => center(p).join(',')).join(' '));
    const [px, py] = center(trail[trail.length - 1]);
    player.setAttribute('cx', px);
    player.setAttribute('cy', py);
  };

  const opposite = { n: 's', s: 'n', e: 'w', w: 'e' };
  const stepFrom = (x, y, dir) => ({ n: [x, y - 1], e: [x + 1, y], s: [x, y + 1], w: [x - 1, y] })[dir];
  const openDirs = (x, y) => ['n', 'e', 's', 'w'].filter((d) => !grid[y][x][d]);

  // Avanza por el pasillo hasta llegar a una bifurcación, un callejón sin salida o la meta.
  const move = (dir) => {
    if (finished) return;
    let [x, y] = trail[trail.length - 1];
    if (grid[y][x][dir]) return;
    let current = dir;
    for (let guard = 0; guard < 500; guard++) {
      const next = stepFrom(x, y, current);
      const back = trail[trail.length - 2];
      if (back && back[0] === next[0] && back[1] === next[1]) trail.pop();
      else trail.push(next);
      [x, y] = next;
      if (x === cols - 1 && y === rows - 1) {
        finished = true;
        break;
      }
      const options = openDirs(x, y).filter((d) => d !== opposite[current]);
      if (options.length !== 1) break;
      current = options[0];
    }
    draw();
    if (finished) onSolved();
  };

  const dpad = el('div', 'dpad');
  for (const [dir, label] of [
    ['n', '↑'],
    ['w', '←'],
    ['s', '↓'],
    ['e', '→'],
  ]) {
    const btn = el('button', `btn small dp-${dir}`, label);
    btn.type = 'button';
    btn.addEventListener('click', () => move(dir));
    dpad.append(btn);
  }
  const keys = { ArrowUp: 'n', ArrowDown: 's', ArrowLeft: 'w', ArrowRight: 'e' };
  const onKey = (e) => {
    if (!root.isConnected) return document.removeEventListener('keydown', onKey);
    if (keys[e.key]) {
      e.preventDefault();
      move(keys[e.key]);
    }
  };
  document.addEventListener('keydown', onKey);

  let touchStart = null;
  svg.addEventListener('touchstart', (e) => {
    touchStart = [e.touches[0].clientX, e.touches[0].clientY];
  });
  svg.addEventListener('touchend', (e) => {
    if (!touchStart) return;
    const dx = e.changedTouches[0].clientX - touchStart[0];
    const dy = e.changedTouches[0].clientY - touchStart[1];
    touchStart = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'e' : 'w') : dy > 0 ? 's' : 'n');
  });

  root.append(
    el('p', 'q-text', puzzle.prompt ?? 'Lleva la bolita de jade hasta el farol rojo. Usa las flechas o desliza el dedo: avanzas hasta la próxima bifurcación.'),
    svg,
    dpad,
  );
  draw();
}

/* ---------- Crucigrama (distribución automática) ---------- */
function crosswordLayout(entries, seed) {
  const words = entries.map((e) => ({ ...e, word: strip(e.answer).toUpperCase() }));
  const byLength = [...words].sort((a, b) => b.word.length - a.word.length);
  let best = null;
  for (let attempt = 0; attempt < 600; attempt++) {
    const rand = mulberry32(seed + attempt * 101);
    const [first, ...others] = byLength;
    const order = [first, ...seededShuffle(others, rand)];
    const cells = new Map();
    const placed = [];
    const get = (r, c) => cells.get(`${r},${c}`);
    const fits = (word, r, c, dir) => {
      const dr = dir === 'down' ? 1 : 0;
      const dc = dir === 'across' ? 1 : 0;
      if (get(r - dr, c - dc) || get(r + dr * word.length, c + dc * word.length)) return -1;
      let crosses = 0;
      for (let i = 0; i < word.length; i++) {
        const rr = r + dr * i;
        const cc = c + dc * i;
        const cur = get(rr, cc);
        if (cur) {
          if (cur.ch !== word[i] || cur[dir]) return -1;
          crosses += 1;
        } else if (get(rr + dc, cc + dr) || get(rr - dc, cc - dr)) return -1;
      }
      return crosses;
    };
    const put = (entry, r, c, dir) => {
      const dr = dir === 'down' ? 1 : 0;
      const dc = dir === 'across' ? 1 : 0;
      for (let i = 0; i < entry.word.length; i++) {
        const key = `${r + dr * i},${c + dc * i}`;
        const cell = cells.get(key) ?? { ch: entry.word[i] };
        cell[dir] = true;
        cells.set(key, cell);
      }
      placed.push({ ...entry, r, c, dir });
    };
    put(order[0], 0, 0, 'across');
    let ok = true;
    for (const entry of order.slice(1)) {
      const options = [];
      for (const p of placed) {
        const dir = p.dir === 'across' ? 'down' : 'across';
        for (let i = 0; i < p.word.length; i++) {
          const pr = p.dir === 'across' ? p.r : p.r + i;
          const pc = p.dir === 'across' ? p.c + i : p.c;
          for (let j = 0; j < entry.word.length; j++) {
            if (entry.word[j] !== p.word[i]) continue;
            const r = dir === 'down' ? pr - j : pr;
            const c = dir === 'across' ? pc - j : pc;
            const crosses = fits(entry.word, r, c, dir);
            if (crosses >= 1) options.push({ r, c, dir, crosses });
          }
        }
      }
      if (!options.length) {
        ok = false;
        break;
      }
      const top = Math.max(...options.map((o) => o.crosses));
      const best = options.filter((o) => o.crosses === top);
      const pick = best[Math.floor(rand() * best.length)];
      put(entry, pick.r, pick.c, pick.dir);
    }
    if (!ok) continue;

    const minR = Math.min(...placed.map((p) => p.r));
    const minC = Math.min(...placed.map((p) => p.c));
    const shifted = placed.map((p) => ({ ...p, r: p.r - minR, c: p.c - minC }));
    const maxR = Math.max(...shifted.map((p) => (p.dir === 'down' ? p.r + p.word.length - 1 : p.r)));
    const maxC = Math.max(...shifted.map((p) => (p.dir === 'across' ? p.c + p.word.length - 1 : p.c)));
    const starts = [...new Set(shifted.map((p) => `${p.r},${p.c}`))]
      .map((k) => k.split(',').map(Number))
      .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const numberAt = new Map(starts.map(([r, c], i) => [`${r},${c}`, i + 1]));
    const candidate = {
      entries: shifted.map((p) => ({ ...p, num: numberAt.get(`${p.r},${p.c}`) })),
      width: maxC + 1,
      height: maxR + 1,
      numberAt,
    };
    const score = (l) => Math.max(l.width, l.height) * 1000 + l.width * l.height;
    if (!best || score(candidate) < score(best)) best = candidate;
  }
  return best;
}

function crossword(root, puzzle, onSolved) {
  const layout = crosswordLayout(puzzle.entries, puzzle.seed ?? 1);
  if (!layout) {
    root.append(el('p', 'feedback bad', 'No se pudo armar el crucigrama.'));
    return;
  }
  const letterAt = new Map();
  for (const e of layout.entries) {
    for (let i = 0; i < e.word.length; i++) {
      const r = e.dir === 'down' ? e.r + i : e.r;
      const c = e.dir === 'across' ? e.c + i : e.c;
      letterAt.set(`${r},${c}`, { ch: e.word[i], node: null });
    }
  }
  const grid = el('div', 'cw-grid');
  grid.style.setProperty('--cols', layout.width);
  for (let r = 0; r < layout.height; r++) {
    for (let c = 0; c < layout.width; c++) {
      const key = `${r},${c}`;
      const slot = letterAt.get(key);
      if (!slot) {
        grid.append(el('div', 'cw-void'));
        continue;
      }
      const cell = el('div', 'cw-cell');
      const num = layout.numberAt.get(key);
      if (num) cell.append(el('span', 'cw-num', String(num)));
      slot.node = el('span', 'cw-ch');
      cell.append(slot.node);
      grid.append(cell);
    }
  }

  let remaining = layout.entries.length;
  const makeList = (dir, title) => {
    const list = el('div', 'cw-clues');
    list.append(el('h4', '', title));
    for (const e of layout.entries.filter((x) => x.dir === dir).sort((a, b) => a.num - b.num)) {
      const row = el('label', 'cw-clue');
      row.append(el('span', 'cw-clue-text', `${e.num}. ${e.clue} (${e.word.length})`));
      const input = el('input', 'text-input');
      input.type = 'text';
      input.maxLength = e.word.length;
      input.autocomplete = 'off';
      input.autocapitalize = 'none';
      input.spellcheck = false;
      input.placeholder = '·'.repeat(e.word.length);
      input.addEventListener('input', () => {
        if (strip(input.value).toUpperCase() !== e.word) return;
        input.disabled = true;
        row.classList.add('solved');
        for (let i = 0; i < e.word.length; i++) {
          const r = e.dir === 'down' ? e.r + i : e.r;
          const c = e.dir === 'across' ? e.c + i : e.c;
          letterAt.get(`${r},${c}`).node.textContent = e.word[i];
        }
        remaining -= 1;
        if (remaining === 0) onSolved();
      });
      row.append(input);
      list.append(row);
    }
    return list;
  };
  root.append(
    el('p', 'q-text', puzzle.prompt ?? 'Escribe cada respuesta junto a su pista. Las letras que aciertes se completan en la cuadrícula.'),
    grid,
    makeList('across', 'Horizontales'),
    makeList('down', 'Verticales'),
  );
}

/* ---------- Memoria ---------- */
function memory(root, puzzle, onSolved) {
  const rand = mulberry32(puzzle.seed ?? 3);
  const deck = seededShuffle([...puzzle.pairs, ...puzzle.pairs], rand);
  const info = el('p', 'diff-count', 'Movimientos: 0');
  const board = el('div', 'mem-grid');
  board.style.setProperty('--cols', puzzle.cols ?? 4);
  let first = null;
  let lock = false;
  let matched = 0;
  let moves = 0;
  const cards = deck.map((symbol, i) => {
    const card = el('button', 'mem-card');
    card.type = 'button';
    card.append(el('span', 'mem-face', symbol));
    card.addEventListener('click', () => {
      if (lock || card.classList.contains('up') || card.classList.contains('ok')) return;
      card.classList.add('up');
      if (first === null) {
        first = i;
        return;
      }
      moves += 1;
      info.textContent = `Movimientos: ${moves}`;
      if (deck[first] === symbol) {
        cards[first].classList.add('ok');
        card.classList.add('ok');
        first = null;
        matched += 1;
        if (matched === puzzle.pairs.length) onSolved();
      } else {
        lock = true;
        const previous = first;
        first = null;
        setTimeout(() => {
          cards[previous].classList.remove('up');
          card.classList.remove('up');
          lock = false;
        }, 750);
      }
    });
    board.append(card);
    return card;
  });
  root.append(el('p', 'q-text', puzzle.prompt ?? 'Encuentra todas las parejas.'), info, board);
}

/* ---------- Encuentra las diferencias ---------- */
function diffs(root, puzzle, onSolved) {
  const scene = SCENES[puzzle.scene];
  const found = new Set();
  const NS = 'http://www.w3.org/2000/svg';
  const makeSvg = (inner) => {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', scene.viewBox);
    svg.setAttribute('class', 'diff-svg');
    svg.innerHTML = `${inner}<g class="marks"></g>`;
    return svg;
  };
  const left = makeSvg(scene.shapes.map((s) => s.svg).join(''));
  const right = makeSvg(
    scene.shapes
      .map((s) => {
        const d = scene.diffs.find((x) => x.id === s.id);
        return d ? d.alt : s.svg;
      })
      .join('') +
      scene.diffs
        .filter((d) => d.add)
        .map((d) => d.add)
        .join(''),
  );
  const counter = el('p', 'diff-count');
  const update = () => {
    counter.textContent = `Diferencias encontradas: ${found.size} de ${scene.diffs.length}`;
  };
  const mark = (index) => {
    const [x, y, r] = scene.diffs[index].hit;
    for (const svg of [left, right]) {
      const circle = document.createElementNS(NS, 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', Math.max(r, 14));
      circle.setAttribute('class', 'diff-mark');
      svg.querySelector('.marks').append(circle);
    }
  };
  const onTap = (svg) => (e) => {
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const p = point.matrixTransform(svg.getScreenCTM().inverse());
    const index = scene.diffs.findIndex(
      (d, i) => !found.has(i) && Math.hypot(p.x - d.hit[0], p.y - d.hit[1]) <= d.hit[2],
    );
    if (index >= 0) {
      found.add(index);
      mark(index);
      update();
      if (found.size === scene.diffs.length) onSolved();
    } else {
      svg.classList.add('miss');
      setTimeout(() => svg.classList.remove('miss'), 350);
    }
  };
  left.addEventListener('click', onTap(left));
  right.addEventListener('click', onTap(right));
  root.append(el('p', 'q-text', puzzle.prompt ?? 'Hay diferencias entre las dos imágenes. Tócalas en cualquiera de las dos.'), counter, left, right);
  update();
}

/* ---------- Objetos faltantes ---------- */
function missing(root, puzzle, onSolved) {
  const rand = mulberry32(puzzle.seed ?? 4);
  const objects = puzzle.objects;
  const gone = new Set(seededShuffle(objects, rand).slice(0, puzzle.count ?? 3));
  const shelf = el('div', 'shelf');
  const draw = (hide) =>
    shelf.replaceChildren(...objects.map((o) => el('span', 'slot', hide && gone.has(o) ? '' : o)));
  const body = el('div', 'stage-body');
  root.append(el('p', 'q-text', puzzle.prompt ?? 'Memoriza los objetos. Después desaparecerán algunos: dime cuáles.'), shelf, body);

  const showMemorize = () => {
    draw(false);
    const go = el('button', 'btn primary', 'Ya los memoricé');
    go.addEventListener('click', showGuess);
    body.replaceChildren(go);
  };

  let peeks = puzzle.peeks ?? 2;
  function showGuess() {
    draw(true);
    const chosen = new Set();
    const palette = el('div', 'palette');
    for (const o of objects) {
      const chip = el('button', 'chip', o);
      chip.type = 'button';
      chip.addEventListener('click', () => {
        if (chosen.has(o)) chosen.delete(o);
        else chosen.add(o);
        chip.classList.toggle('sel', chosen.has(o));
      });
      palette.append(chip);
    }
    const msg = el('p', 'feedback');
    const check = el('button', 'btn primary', 'Comprobar');
    check.addEventListener('click', () => {
      const ok = chosen.size === gone.size && [...chosen].every((o) => gone.has(o));
      if (ok) {
        msg.textContent = '¡Exacto!';
        msg.className = 'feedback good';
        check.disabled = true;
        draw(true);
        onSolved();
      } else {
        msg.textContent = `Todavía no. Faltan ${gone.size} objetos: revisa tu elección.`;
        msg.className = 'feedback bad';
      }
    });
    const peek = el('button', 'btn ghost', `Ver de nuevo (${peeks})`);
    peek.addEventListener('click', () => {
      if (peeks <= 0) return;
      peeks -= 1;
      peek.textContent = `Ver de nuevo (${peeks})`;
      draw(false);
      setTimeout(() => draw(true), 3000);
    });
    body.replaceChildren(el('p', 'q-text', '¿Cuáles desaparecieron?'), palette, msg, check, peek);
  }
  showMemorize();
}

/* ---------- Anagramas ---------- */
function anagram(root, puzzle, onSolved) {
  const rand = mulberry32(puzzle.seed ?? 2);
  let remaining = puzzle.words.length;
  root.append(el('p', 'q-text', puzzle.prompt ?? 'Ordena las letras para formar la palabra de la pista.'));
  for (const item of puzzle.words) {
    const word = strip(item.answer).toUpperCase();
    let letters = word.split('');
    let tries = 0;
    do {
      letters = seededShuffle(letters, rand);
      tries += 1;
    } while (letters.join('') === word && tries < 20);
    const row = el('label', 'cw-clue');
    row.append(el('span', 'anagram-letters', letters.join(' ')), el('span', 'cw-clue-text', item.clue));
    const input = el('input', 'text-input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.autocapitalize = 'none';
    input.spellcheck = false;
    input.placeholder = 'Tu respuesta';
    input.addEventListener('input', () => {
      if (strip(input.value).toUpperCase() !== word) return;
      input.disabled = true;
      row.classList.add('solved');
      remaining -= 1;
      if (remaining === 0) onSolved();
    });
    row.append(input);
    root.append(row);
  }
}

/* ---------- Chino básico: varias frases con audio y pinyin ---------- */
function listenSet(root, puzzle, onSolved) {
  let remaining = puzzle.items.length;
  root.append(el('p', 'q-text', puzzle.prompt ?? 'Toca el altavoz, escucha y elige qué significa. Si lo necesitas, abre el pinyin.'));
  puzzle.items.forEach((item, i) => {
    const block = el('div', 'q-block');
    const head = el('div', 'listen-row');
    const play = el('button', 'btn small', '🔊');
    play.type = 'button';
    play.addEventListener('click', () => {
      if (!speak(item.speak)) root.querySelectorAll('details.pinyin').forEach((d) => (d.open = true));
    });
    head.append(play, el('span', 'q-text', item.q ?? `Frase ${i + 1}: ¿qué significa?`));
    const pinyin = el('details', 'hint pinyin');
    pinyin.append(el('summary', '', 'Ver pinyin'), el('p', '', item.pinyin));
    const opts = el('div', 'q-options');
    let done = false;
    item.options.forEach((label, oi) => {
      const btn = el('button', 'opt', label);
      btn.type = 'button';
      btn.addEventListener('click', () => {
        if (done) return;
        if (oi === item.answer) {
          done = true;
          btn.classList.add('ok');
          remaining -= 1;
          if (remaining === 0) onSolved();
        } else {
          btn.classList.add('bad');
          setTimeout(() => btn.classList.remove('bad'), 700);
        }
      });
      opts.append(btn);
    });
    block.append(head, pinyin, opts);
    root.append(block);
  });
}

/* ---------- Rompecabezas deslizante con la ilustración de Piyi ---------- */
function slide(root, puzzle, onSolved) {
  const n = puzzle.size ?? 3;
  const rand = mulberry32(puzzle.seed ?? 6);
  const blank = n * n - 1;
  const tiles = [...Array(n * n).keys()];
  let empty = blank;
  const neighbors = (i) => {
    const r = Math.floor(i / n);
    const c = i % n;
    return [r > 0 && i - n, r < n - 1 && i + n, c > 0 && i - 1, c < n - 1 && i + 1].filter((x) => x !== false);
  };
  let last = -1;
  for (let k = 0; k < n * n * 25; k++) {
    const options = neighbors(empty).filter((x) => x !== last);
    const pick = options[Math.floor(rand() * options.length)];
    [tiles[empty], tiles[pick]] = [tiles[pick], tiles[empty]];
    last = empty;
    empty = pick;
  }
  let moves = 0;
  let finished = false;
  const info = el('p', 'diff-count', 'Movimientos: 0');
  const board = el('div', 'slide-grid');
  board.style.setProperty('--n', n);
  const preview = el('img', 'slide-preview');
  preview.src = puzzle.image;
  preview.alt = 'Imagen de referencia';

  const paint = () => {
    board.replaceChildren(
      ...tiles.map((v, i) => {
        const tile = el('button', 'slide-tile');
        tile.type = 'button';
        if (v === blank) {
          tile.classList.add('blank');
        } else {
          tile.style.backgroundImage = `url(${puzzle.image})`;
          tile.style.backgroundSize = `${n * 100}% ${n * 100}%`;
          tile.style.backgroundPosition = `${((v % n) / (n - 1)) * 100}% ${(Math.floor(v / n) / (n - 1)) * 100}%`;
          tile.append(el('span', 'slide-num', String(v + 1)));
        }
        tile.addEventListener('click', () => {
          if (finished || v === blank || !neighbors(i).includes(empty)) return;
          [tiles[i], tiles[empty]] = [tiles[empty], tiles[i]];
          empty = i;
          moves += 1;
          info.textContent = `Movimientos: ${moves}`;
          paint();
          if (tiles.every((x, idx) => x === idx)) {
            finished = true;
            onSolved();
          }
        });
        return tile;
      }),
    );
  };
  paint();
  root.append(el('p', 'q-text', puzzle.prompt ?? 'Desliza las piezas hasta armar la imagen. Toca una pieza al lado del espacio vacío.'), preview, info, board);
}

const TYPES = {
  quiz,
  riddle,
  listen,
  wordsearch,
  flags,
  sudoku,
  maze,
  crossword,
  memory,
  diffs,
  missing,
  anagram,
  listenSet,
  slide,
};

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
