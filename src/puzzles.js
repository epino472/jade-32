import { SCENES } from './scenes.js?v=20261019m';

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
  input.setAttribute('autocorrect', 'off');
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
    input.setAttribute('autocorrect', 'off');
      input.setAttribute('autocorrect', 'off');
  input.setAttribute('autocorrect', 'off');
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
    const accepted = new Set([word, ...(item.alts ?? []).map((a) => strip(a).toUpperCase())]);
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
    input.setAttribute('autocorrect', 'off');
  input.setAttribute('autocorrect', 'off');
    input.spellcheck = false;
    input.placeholder = 'Tu respuesta';
    input.addEventListener('input', () => {
      if (!accepted.has(strip(input.value).toUpperCase())) return;
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

/* ---------- Torre de Hanoi ---------- */
function hanoi(root, puzzle, onSolved) {
  const n = puzzle.discs ?? 5;
  const pegs = [Array.from({ length: n }, (_, i) => n - i), [], []];
  let selected = null;
  let moves = 0;
  let finished = false;
  const info = el('p', 'diff-count');
  const msg = el('p', 'feedback');
  const board = el('div', 'hn-board');

  const render = () => {
    info.textContent = `Movimientos: ${moves} · Mínimo posible: ${2 ** n - 1}`;
    board.replaceChildren(
      ...pegs.map((stack, i) => {
        const peg = el('button', `hn-peg${selected === i ? ' sel' : ''}`);
        peg.type = 'button';
        stack.forEach((d) => {
          const disc = el('span', 'hn-disc');
          disc.style.width = `${24 + (d / n) * 70}%`;
          disc.style.setProperty('--hue', String(150 + d * 18));
          disc.dataset.d = String(d);
          peg.append(disc);
        });
        peg.addEventListener('click', () => tap(i));
        return peg;
      }),
    );
  };

  const tap = (i) => {
    if (finished) return;
    msg.textContent = '';
    if (selected === null) {
      if (pegs[i].length) selected = i;
    } else if (selected === i) {
      selected = null;
    } else {
      const from = pegs[selected];
      const to = pegs[i];
      const disc = from[from.length - 1];
      if (to.length && to[to.length - 1] < disc) {
        msg.textContent = 'Un disco grande no puede ir sobre uno más pequeño.';
        msg.className = 'feedback bad';
        selected = null;
      } else {
        to.push(from.pop());
        moves += 1;
        selected = null;
        if (pegs[2].length === n) {
          finished = true;
          msg.textContent = '¡Torre completa!';
          msg.className = 'feedback good';
          render();
          onSolved();
          return;
        }
      }
    }
    render();
  };

  root.append(
    el('p', 'q-text', puzzle.prompt ?? `Mueve toda la torre de ${n} discos a la tercera columna. Solo puedes mover un disco a la vez y nunca uno grande sobre uno más pequeño.`),
    info,
    board,
    msg,
  );
  render();
}

/* ---------- Lights Out ---------- */
function lightsout(root, puzzle, onSolved) {
  const n = puzzle.size ?? 5;
  const rand = mulberry32(puzzle.seed ?? 4);
  const grid = Array.from({ length: n }, () => Array(n).fill(false));
  const toggle = (r, c) => {
    for (const [dr, dc] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const rr = r + dr;
      const cc = c + dc;
      if (rr >= 0 && rr < n && cc >= 0 && cc < n) grid[rr][cc] = !grid[rr][cc];
    }
  };
  for (let k = 0; k < (puzzle.scramble ?? 14); k++) toggle(Math.floor(rand() * n), Math.floor(rand() * n));
  if (grid.flat().every((v) => !v)) toggle(1, 1);
  let moves = 0;
  let finished = false;
  const info = el('p', 'diff-count', 'Movimientos: 0');
  const board = el('div', 'lo-grid');
  board.style.setProperty('--n', n);
  const cells = grid.map((row, r) =>
    row.map((_, c) => {
      const cell = el('button', 'lo-cell');
      cell.type = 'button';
      cell.addEventListener('click', () => {
        if (finished) return;
        toggle(r, c);
        moves += 1;
        info.textContent = `Movimientos: ${moves}`;
        paint();
        if (grid.flat().every((v) => !v)) {
          finished = true;
          onSolved();
        }
      });
      board.append(cell);
      return cell;
    }),
  );
  const paint = () => cells.forEach((row, r) => row.forEach((cell, c) => cell.classList.toggle('on', grid[r][c])));
  root.append(
    el('p', 'q-text', puzzle.prompt ?? 'Apaga todas las luces. Al tocar una casilla se cambian ella y sus cuatro vecinas (arriba, abajo, izquierda y derecha).'),
    info,
    board,
  );
  paint();
}

/* ---------- Adivina la palabra ---------- */
function wordle(root, puzzle, onSolved) {
  const answers = puzzle.words.map((w) => strip(w).toUpperCase());
  const LEN = 5;
  const TRIES = 6;
  let wordIndex = 0;
  let row = 0;
  let current = '';
  let finished = false;
  const status = el('p', 'feedback');
  const progress = el('p', 'diff-count');
  const board = el('div', 'wd-board');
  const used = el('div', 'wd-used');
  const keyState = new Map();
  const rank = { absent: 1, present: 2, correct: 3 };

  const input = el('input', 'text-input wd-input');
  input.type = 'text';
  input.maxLength = LEN;
  input.autocomplete = 'off';
  input.autocapitalize = 'characters';
  input.spellcheck = false;
  input.setAttribute('autocorrect', 'off');
  input.setAttribute('enterkeyhint', 'go');
  input.placeholder = 'Escribe tu palabra';
  const tryBtn = el('button', 'btn primary', 'Probar');
  tryBtn.type = 'button';
  const form = el('div', 'wd-form');
  form.append(input, tryBtn);

  const evaluate = (guess, answer) => {
    const result = Array(LEN).fill('absent');
    const left = answer.split('');
    for (let i = 0; i < LEN; i++) {
      if (guess[i] === answer[i]) {
        result[i] = 'correct';
        left[i] = null;
      }
    }
    for (let i = 0; i < LEN; i++) {
      if (result[i] === 'correct') continue;
      const at = left.indexOf(guess[i]);
      if (at >= 0) {
        result[i] = 'present';
        left[at] = null;
      }
    }
    return result;
  };

  const rows = Array.from({ length: TRIES }, () => {
    const r = el('div', 'wd-row');
    const cells = Array.from({ length: LEN }, () => el('span', 'wd-cell'));
    r.append(...cells);
    board.append(r);
    return cells;
  });

  const paintRow = () => {
    if (row < TRIES) rows[row].forEach((cell, i) => (cell.textContent = current[i] ?? ''));
  };

  const paintUsed = () => {
    used.replaceChildren(
      ...[...keyState.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([letter, state]) => el('span', `wd-letter ${state}`, letter)),
    );
  };

  const resetBoard = () => {
    row = 0;
    current = '';
    input.value = '';
    keyState.clear();
    rows.flat().forEach((cell) => {
      cell.textContent = '';
      cell.className = 'wd-cell';
    });
    paintUsed();
    progress.textContent = `Palabra ${wordIndex + 1} de ${answers.length}`;
  };

  const submit = () => {
    if (finished || row >= TRIES) return;
    if (current.length < LEN) {
      status.textContent = 'Faltan letras.';
      status.className = 'feedback bad';
      return;
    }
    const answer = answers[wordIndex];
    const result = evaluate(current, answer);
    result.forEach((state, i) => {
      rows[row][i].classList.add(state);
      const letter = current[i];
      if (!keyState.has(letter) || rank[state] > rank[keyState.get(letter)]) keyState.set(letter, state);
    });
    paintUsed();
    if (current === answer) {
      status.textContent = '¡Correcto!';
      status.className = 'feedback good';
      wordIndex += 1;
      if (wordIndex === answers.length) {
        finished = true;
        input.disabled = true;
        tryBtn.disabled = true;
        onSolved();
        return;
      }
      input.disabled = true;
      setTimeout(() => {
        status.textContent = '';
        input.disabled = false;
        resetBoard();
        input.focus();
      }, 900);
      return;
    }
    row += 1;
    current = '';
    input.value = '';
    if (row === TRIES) {
      status.textContent = 'Se acabaron los intentos. Empieza otra vez con la misma palabra.';
      status.className = 'feedback bad';
      setTimeout(resetBoard, 1300);
    } else {
      status.textContent = '';
    }
  };

  input.addEventListener('input', () => {
    const clean = strip(input.value).toUpperCase().slice(0, LEN);
    input.value = clean;
    current = clean;
    paintRow();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  });
  tryBtn.addEventListener('click', submit);
  board.addEventListener('click', () => input.focus());

  root.append(
    el('p', 'q-text', puzzle.prompt ?? 'Adivina la palabra secreta de 5 letras en 6 intentos. Verde: letra bien ubicada. Amarillo: está, pero en otro lugar. Gris: no está.'),
    progress,
    board,
    status,
    used,
    form,
  );
  resetBoard();
}

/* ---------- Nonograma ---------- */
function runsOf(line) {
  const out = [];
  let count = 0;
  for (const filled of line) {
    if (filled) count += 1;
    else if (count) {
      out.push(count);
      count = 0;
    }
  }
  if (count) out.push(count);
  return out.length ? out : [0];
}

function nonogram(root, puzzle, onSolved) {
  const solution = puzzle.art.map((r) => [...r].map((ch) => ch === 'X'));
  const rows = solution.length;
  const cols = solution[0].length;
  const rowClues = solution.map(runsOf);
  const colClues = Array.from({ length: cols }, (_, c) => runsOf(solution.map((r) => r[c])));
  const state = solution.map((r) => r.map(() => 0));
  let finished = false;

  const grid = el('div', 'ng-grid');
  grid.style.setProperty('--cols', cols);
  grid.append(el('div', 'ng-corner'));
  colClues.forEach((clue) => {
    const box = el('div', 'ng-clue col');
    clue.forEach((n) => box.append(el('span', '', String(n))));
    grid.append(box);
  });
  const cells = [];
  rowClues.forEach((clue, r) => {
    const box = el('div', 'ng-clue row');
    clue.forEach((n) => box.append(el('span', '', String(n))));
    grid.append(box);
    cells[r] = [];
    for (let c = 0; c < cols; c++) {
      const cell = el('button', 'ng-cell');
      cell.type = 'button';
      cell.addEventListener('click', () => {
        if (finished) return;
        state[r][c] = (state[r][c] + 1) % 3;
        cell.classList.toggle('fill', state[r][c] === 1);
        cell.classList.toggle('cross', state[r][c] === 2);
        check();
      });
      cells[r][c] = cell;
      grid.append(cell);
    }
  });

  const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
  const check = () => {
    const filled = state.map((r) => r.map((v) => v === 1));
    const okRows = filled.every((r, i) => same(runsOf(r), rowClues[i]));
    const okCols = colClues.every((clue, c) => same(runsOf(filled.map((r) => r[c])), clue));
    if (okRows && okCols) {
      finished = true;
      onSolved();
    }
  };

  root.append(
    el('p', 'q-text', puzzle.prompt ?? 'Cada número dice cuántas casillas seguidas van rellenas en esa fila o columna. Si hay dos números juntos, por ejemplo [2] [2], son dos grupos separados por al menos una casilla vacía: no es el número 22. Toca una casilla para rellenarla, otra vez para marcarla con una cruz, y otra para borrarla. Al terminar aparece un dibujo.'),
    grid,
  );
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
  hanoi,
  lightsout,
  wordle,
  nonogram,
};

/* ---------- Pistas (2 niveles por juego) ---------- */
const refund = (text) => ({ text, refund: true });

function dimWrong(root, correctOf) {
  let dimmed = 0;
  root.querySelectorAll('.q-block').forEach((block, i) => {
    if (block.querySelector('.opt.ok')) return;
    const correct = correctOf(block, i);
    const wrong = [...block.querySelectorAll('.opt')].filter((o) => o.textContent !== correct && !o.classList.contains('dim'));
    if (wrong.length) {
      wrong[0].classList.add('dim');
      wrong[0].disabled = true;
      dimmed += 1;
    }
  });
  return dimmed ? 'Taché una opción incorrecta en cada pregunta que aún no respondes.' : refund('Ya no quedan opciones que descartar.');
}

const HINTERS = {
  quiz: (root, p) => dimWrong(root, (_, i) => p.questions[i].options[p.questions[i].answer]),
  flags: (root, p) => {
    const names = Object.fromEntries(p.countries.map((c) => [c.flag, c.name]));
    return dimWrong(root, (block) => names[block.querySelector('.q-big').textContent.trim()]);
  },
  listenSet: (root, p) => dimWrong(root, (_, i) => p.items[i].options[p.items[i].answer]),

  riddle: (root, p, level) => {
    const answer = p.answers[0];
    if (level === 1) return p.hint ?? `La respuesta tiene ${strip(answer).length} letras.`;
    const words = answer.split(' ');
    return words.length > 1
      ? `La respuesta empieza con «${words[0].toUpperCase()}».`
      : `La respuesta empieza con «${answer[0].toUpperCase()}» y tiene ${strip(answer).length} letras.`;
  },

  wordsearch: (root, p, level) => {
    root.querySelectorAll('.ws-cell.hint').forEach((c) => c.classList.remove('hint'));
    const cells = [...root.querySelectorAll('.ws-cell')];
    const n = Math.round(Math.sqrt(cells.length));
    const item = [...root.querySelectorAll('.ws-words li')].find((li) => !li.classList.contains('done'));
    if (!item) return refund('Ya encontraste todas las palabras.');
    const word = strip(item.textContent).toUpperCase();
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++)
        for (const [dr, dc] of DIRS) {
          const path = [];
          for (let i = 0; i < word.length; i++) {
            const rr = r + dr * i;
            const cc = c + dc * i;
            if (rr < 0 || rr >= n || cc < 0 || cc >= n || cells[rr * n + cc].textContent !== word[i]) break;
            path.push(cells[rr * n + cc]);
          }
          if (path.length === word.length) {
            if (level === 1) {
              path[0].classList.add('hint');
              return `Busca «${item.textContent}»: empieza en la fila ${r + 1}, columna ${c + 1}.`;
            }
            path.forEach((cell) => cell.classList.add('hint'));
            return `«${item.textContent}» quedó resaltada.`;
          }
        }
    return refund('No pude ubicar la palabra.');
  },

  sudoku: (root, p, level) => {
    const cfg = SUDOKU_CONFIGS[p.size ?? 6];
    const { solution } = makeSudoku(p.seed ?? 3, p.blanks ?? 20, cfg);
    const cells = [...root.querySelectorAll('.sd-cell')];
    cells.forEach((c) => c.classList.remove('hint'));
    const grid = Array.from({ length: cfg.n }, (_, r) => Array.from({ length: cfg.n }, (_, c) => Number(cells[r * cfg.n + c].textContent) || 0));
    let best = null;
    let bestCount = 99;
    for (let r = 0; r < cfg.n; r++)
      for (let c = 0; c < cfg.n; c++) {
        if (grid[r][c]) continue;
        const count = sudokuCandidates(grid, r, c, cfg).length;
        if (count < bestCount) {
          best = [r, c];
          bestCount = count;
        }
      }
    if (!best) return refund('No quedan casillas vacías.');
    const cell = cells[best[0] * cfg.n + best[1]];
    if (level === 1) {
      cell.classList.add('hint');
      return `Mira la casilla de la fila ${best[0] + 1}, columna ${best[1] + 1}: es la que tiene menos opciones posibles.`;
    }
    cell.click();
    root.querySelectorAll('.sd-pad .btn')[solution[best[0]][best[1]] - 1].click();
    return `Completé la casilla de la fila ${best[0] + 1}, columna ${best[1] + 1} por ti.`;
  },

  maze: (root, p, level) => {
    const cols = p.cols ?? 9;
    const rows = p.rows ?? 12;
    const grid = makeMaze(cols, rows, p.seed ?? 9);
    const player = root.querySelector('.maze-player');
    const x0 = Math.round((Number(player.getAttribute('cx')) - 4 - MAZE_CELL / 2) / MAZE_CELL);
    const y0 = Math.round((Number(player.getAttribute('cy')) - 4 - MAZE_CELL / 2) / MAZE_CELL);
    const steps = { n: [0, -1], e: [1, 0], s: [0, 1], w: [-1, 0] };
    const prev = new Map([[`${x0},${y0}`, null]]);
    const queue = [[x0, y0]];
    while (queue.length) {
      const [x, y] = queue.shift();
      if (x === cols - 1 && y === rows - 1) break;
      for (const d of ['n', 'e', 's', 'w']) {
        if (grid[y][x][d]) continue;
        const nx = x + steps[d][0];
        const ny = y + steps[d][1];
        if (!prev.has(`${nx},${ny}`)) {
          prev.set(`${nx},${ny}`, { from: [x, y], d });
          queue.push([nx, ny]);
        }
      }
    }
    const path = [[cols - 1, rows - 1]];
    let key = `${cols - 1},${rows - 1}`;
    const dirs = [];
    while (prev.get(key)) {
      const link = prev.get(key);
      dirs.unshift(link.d);
      path.unshift(link.from);
      key = link.from.join(',');
    }
    if (!dirs.length) return refund('Ya estás en la meta.');
    const words = { n: 'arriba ↑', e: 'la derecha →', s: 'abajo ↓', w: 'la izquierda ←' };
    if (level === 1) return `Desde donde estás, el camino sigue hacia ${words[dirs[0]]}.`;
    const svg = root.querySelector('.maze-svg');
    svg.querySelector('.maze-hint')?.remove();
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    line.setAttribute('class', 'maze-hint');
    line.setAttribute('points', path.slice(0, 14).map(([x, y]) => `${4 + x * MAZE_CELL + MAZE_CELL / 2},${4 + y * MAZE_CELL + MAZE_CELL / 2}`).join(' '));
    svg.append(line);
    setTimeout(() => line.remove(), 6000);
    return 'Te marqué con una línea punteada los próximos pasos (desaparece en unos segundos).';
  },

  crossword: (root, p, level) => {
    const row = [...root.querySelectorAll('.cw-clue')].find((r) => !r.classList.contains('solved'));
    if (!row) return refund('Ya resolviste todas las pistas.');
    const text = row.querySelector('.cw-clue-text').textContent.replace(/^\d+\.\s*/, '').replace(/\s*\(\d+\)$/, '');
    const entry = p.entries.find((e) => e.clue === text);
    const word = strip(entry.answer).toUpperCase();
    const input = row.querySelector('input');
    if (level === 1) {
      input.value = word[0];
      return `«${text}» tiene ${word.length} letras y empieza con «${word[0]}».`;
    }
    input.value = word;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return `Resolví «${text}» por ti.`;
  },

  anagram: (root, p, level) => {
    const row = [...root.querySelectorAll('.cw-clue')].find((r) => !r.classList.contains('solved'));
    if (!row) return refund('Ya ordenaste todas las palabras.');
    const clue = row.querySelector('.cw-clue-text').textContent;
    const item = p.words.find((w) => w.clue === clue);
    const word = strip(item.answer).toUpperCase();
    const input = row.querySelector('input');
    if (level === 1) {
      input.value = word[0];
      return `La palabra de «${clue}» empieza con «${word[0]}».`;
    }
    input.value = word;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return `Ordené por ti la palabra de «${clue}».`;
  },

  memory: (root, p, level) => {
    const cards = [...root.querySelectorAll('.mem-card')];
    const free = cards.filter((c) => !c.classList.contains('ok'));
    const alreadyUp = new Set(free.filter((c) => c.classList.contains('up') && !c.dataset.flash));
    const flash = (list, ms) => {
      list.forEach((c) => {
        c.classList.add('up');
        c.dataset.flash = '1';
      });
      setTimeout(
        () =>
          list.forEach((c) => {
            delete c.dataset.flash;
            if (!alreadyUp.has(c) && !c.classList.contains('ok')) c.classList.remove('up');
          }),
        ms,
      );
    };
    if (level === 1) {
      flash(free, 1500);
      return 'Mira bien: las cartas se muestran un instante.';
    }
    const byFace = new Map();
    free.forEach((c) => {
      const face = c.querySelector('.mem-face').textContent;
      byFace.set(face, [...(byFace.get(face) ?? []), c]);
    });
    const pair = [...byFace.values()].find((list) => list.length === 2 && list.every((c) => !alreadyUp.has(c)));
    if (!pair) return refund('No pude elegir una pareja ahora. Prueba de nuevo.');
    flash(pair, 1800);
    return 'Te mostré una pareja por un instante.';
  },

  diffs: (root, p, level) => {
    const scene = SCENES[p.scene];
    const svgs = [...root.querySelectorAll('.diff-svg')];
    const found = new Set([...svgs[0].querySelectorAll('.diff-mark')].map((c) => `${c.getAttribute('cx')},${c.getAttribute('cy')}`));
    const index = scene.diffs.findIndex((d) => !found.has(`${d.hit[0]},${d.hit[1]}`));
    if (index < 0) return refund('Ya encontraste todas las diferencias.');
    const [x, y, r] = scene.diffs[index].hit;
    const ring = (radius, ox, oy) =>
      svgs.forEach((svg) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x + ox);
        circle.setAttribute('cy', y + oy);
        circle.setAttribute('r', radius);
        circle.setAttribute('class', 'diff-hint');
        svg.querySelector('.marks').append(circle);
        setTimeout(() => circle.remove(), 2800);
      });
    if (level === 1) {
      ring(48, 12, -10);
      return 'Hay una diferencia dentro del círculo que apareció (en ambas imágenes).';
    }
    ring(Math.max(r, 16), 0, 0);
    return 'Te marqué la posición exacta de una diferencia.';
  },

  missing: (root, p, level) => {
    const palette = root.querySelector('.palette');
    if (!palette) return refund('Primero memoriza los objetos y toca «Ya los memoricé».');
    const gone = new Set(seededShuffle(p.objects, mulberry32(p.seed ?? 4)).slice(0, p.count ?? 3));
    const chips = [...palette.querySelectorAll('.chip')].filter((c) => gone.has(c.textContent));
    chips.forEach((c) => c.classList.remove('hintchip'));
    chips.slice(0, level === 1 ? 1 : 2).forEach((c) => c.classList.add('hintchip'));
    return level === 1 ? 'Uno de los objetos que desaparecieron quedó resaltado.' : 'Dos de los objetos que desaparecieron quedaron resaltados.';
  },

  hanoi: (root, p, level) => {
    const n = p.discs ?? 5;
    const pos = {};
    const pegs = [...root.querySelectorAll('.hn-peg')];
    pegs.forEach((peg, i) => peg.querySelectorAll('.hn-disc').forEach((d) => (pos[Number(d.dataset.d)] = i)));
    const next = (k, target) => {
      if (k === 0) return null;
      if (pos[k] === target) return next(k - 1, target);
      const sub = next(k - 1, 3 - pos[k] - target);
      return sub ?? [pos[k], target];
    };
    const move = next(n, 2);
    if (!move) return refund('La torre ya está completa.');
    const text = `Mueve el disco de arriba de la columna ${move[0] + 1} a la columna ${move[1] + 1}.`;
    if (level === 2) {
      [move[0], move[1]].forEach((i) => pegs[i].classList.add('hint'));
      setTimeout(() => pegs.forEach((peg) => peg.classList.remove('hint')), 2600);
    }
    return text;
  },

  lightsout: (root, p, level) => {
    const n = p.size ?? 5;
    const cells = [...root.querySelectorAll('.lo-cell')];
    cells.forEach((c) => c.classList.remove('hint'));
    const start = cells.map((c) => (c.classList.contains('on') ? 1 : 0));
    let solution = null;
    for (let mask = 0; mask < 1 << n && !solution; mask++) {
      const g = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => start[r * n + c]));
      const presses = [];
      const press = (r, c) => {
        presses.push([r, c]);
        for (const [dr, dc] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const rr = r + dr;
          const cc = c + dc;
          if (rr >= 0 && rr < n && cc >= 0 && cc < n) g[rr][cc] ^= 1;
        }
      };
      for (let c = 0; c < n; c++) if ((mask >> c) & 1) press(0, c);
      for (let r = 1; r < n; r++) for (let c = 0; c < n; c++) if (g[r - 1][c]) press(r, c);
      if (g[n - 1].every((v) => v === 0)) solution = presses;
    }
    if (!solution) return refund('No encuentro una solución desde aquí. Usa «Reiniciar».');
    if (!solution.length) return refund('Ya están todas apagadas.');
    const marked = level === 1 ? solution.slice(0, 1) : solution;
    marked.forEach(([r, c]) => {
      const cell = cells[r * n + c];
      cell.classList.add('hint');
      cell.addEventListener('click', () => cell.classList.remove('hint'), { once: true });
    });
    return level === 1
      ? 'Truco: apaga las luces fila por fila, de arriba hacia abajo. Si una luz de una fila sigue encendida, toca la casilla que está justo debajo de ella. Ahora toca la casilla resaltada: es parte de la solución.'
      : `Resalté las ${marked.length} casillas que tienes que tocar, una vez cada una (el orden no importa). El resaltado desaparece al tocar cada una.`;
  },

  wordle: (root, p, level) => {
    const match = root.querySelector('.diff-count')?.textContent.match(/Palabra (\d+)/);
    const word = strip(p.words[Number(match?.[1] ?? 1) - 1]).toUpperCase();
    return level === 1
      ? `La palabra empieza con «${word[0]}».`
      : `La palabra termina con «${word[word.length - 1]}» y tiene una «${word[2]}» en el centro.`;
  },

  nonogram: (root, p, level) => {
    const cols = p.art[0].length;
    const cells = [...root.querySelectorAll('.ng-cell')];
    const fill = (cell) => {
      for (let guard = 0; guard < 3 && !cell.classList.contains('fill'); guard++) cell.click();
    };
    const missingCells = [];
    p.art.forEach((row, r) =>
      [...row].forEach((ch, c) => {
        if (ch === 'X' && !cells[r * cols + c].classList.contains('fill')) missingCells.push([r, c]);
      }),
    );
    if (!missingCells.length) return refund('Todas las casillas del dibujo ya están rellenas. Revisa si te sobra alguna.');
    if (level === 1) {
      const [r, c] = missingCells[0];
      fill(cells[r * cols + c]);
      return `Rellené una casilla en la fila ${r + 1}, columna ${c + 1}.`;
    }
    const row = missingCells[0][0];
    missingCells.filter(([r]) => r === row).forEach(([r, c]) => fill(cells[r * cols + c]));
    return `Completé las casillas rellenas de la fila ${row + 1}.`;
  },

  slide: (root, p, level) => {
    const tiles = [...root.querySelectorAll('.slide-tile')];
    const n = Math.round(Math.sqrt(tiles.length));
    if (level === 1) return `Ordena las piezas del 1 al ${n * n - 1}, de izquierda a derecha y de arriba abajo. El hueco queda abajo, a la derecha.`;
    const values = tiles.map((t) => (t.classList.contains('blank') ? 0 : Number(t.querySelector('.slide-num').textContent)));
    const empty = values.indexOf(0);
    const dist = (i, v) => (v ? Math.abs(Math.floor(i / n) - Math.floor((v - 1) / n)) + Math.abs((i % n) - ((v - 1) % n)) : 0);
    const er = Math.floor(empty / n);
    const ec = empty % n;
    const around = [er > 0 && empty - n, er < n - 1 && empty + n, ec > 0 && empty - 1, ec < n - 1 && empty + 1].filter((x) => x !== false);
    const best = around.reduce((a, b) => (dist(b, values[b]) - dist(empty, values[b]) < dist(a, values[a]) - dist(empty, values[a]) ? b : a));
    tiles[best].classList.add('hint');
    setTimeout(() => tiles[best]?.classList.remove('hint'), 2600);
    return `Prueba moviendo la pieza ${values[best]} (resaltada).`;
  },
};

/* ---------- Etapas de juego con Pista y Reiniciar ---------- */
const MAX_HINTS = 2;

export function renderPuzzles(root, puzzles, onAllSolved, { start = 0, onProgress } = {}) {
  root.replaceChildren();
  let index = Math.min(Math.max(start, 0), puzzles.length - 1);

  const showStage = () => {
    root.replaceChildren();
    const puzzle = puzzles[index];
    const head = el('div', 'stage-head');
    head.append(el('span', 'stage-count', `Prueba ${index + 1} de ${puzzles.length}`), el('h3', '', puzzle.title));

    let used = 0;
    const hintMsg = el('p', 'hint-msg');
    hintMsg.hidden = true;
    const hintBtn = el('button', 'btn small-btn hint-btn');
    hintBtn.type = 'button';
    const resetBtn = el('button', 'btn small-btn reset-btn', '↺ Reiniciar');
    resetBtn.type = 'button';
    const tools = el('div', 'stage-tools');
    tools.append(hintBtn, resetBtn);

    let body = el('div', 'stage-body');
    const updateHintBtn = () => {
      hintBtn.textContent = used >= MAX_HINTS ? '💡 Sin más pistas' : `💡 Pista (${MAX_HINTS - used})`;
      hintBtn.disabled = used >= MAX_HINTS;
    };

    const solved = () => {
      tools.hidden = true;
      hintMsg.hidden = true;
      const next = el('button', 'btn primary', index + 1 < puzzles.length ? 'Siguiente prueba →' : 'Completar pruebas ✓');
      next.addEventListener('click', () => {
        index += 1;
        if (index < puzzles.length) {
          onProgress?.(index);
          showStage();
        } else onAllSolved();
      });
      root.append(next);
    };

    const mount = () => {
      const fresh = el('div', 'stage-body');
      body.replaceWith(fresh);
      body = fresh;
      hintMsg.hidden = true;
      TYPES[puzzle.type](body, puzzle, solved);
    };

    hintBtn.addEventListener('click', () => {
      if (used >= MAX_HINTS) return;
      let result;
      try {
        result = HINTERS[puzzle.type]?.(body, puzzle, used + 1);
      } catch {
        result = refund('No pude calcular una pista ahora. Intenta de nuevo.');
      }
      if (result === undefined) result = refund('Este juego no tiene pistas.');
      const text = typeof result === 'string' ? result : result.text;
      if (typeof result === 'string') used += 1;
      hintMsg.textContent = text;
      hintMsg.hidden = false;
      updateHintBtn();
    });
    resetBtn.addEventListener('click', mount);

    root.append(head, tools, hintMsg, body);
    updateHintBtn();
    TYPES[puzzle.type](body, puzzle, solved);
  };

  showStage();
}
