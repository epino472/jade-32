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

const SUDOKU_N = 6;
const SUDOKU_BOX_ROWS = 2;
const SUDOKU_BOX_COLS = 3;

function sudokuFits(grid, r, c, v) {
  for (let i = 0; i < SUDOKU_N; i++) if (grid[r][i] === v || grid[i][c] === v) return false;
  const br = r - (r % SUDOKU_BOX_ROWS);
  const bc = c - (c % SUDOKU_BOX_COLS);
  for (let i = 0; i < SUDOKU_BOX_ROWS; i++)
    for (let j = 0; j < SUDOKU_BOX_COLS; j++) if (grid[br + i][bc + j] === v) return false;
  return true;
}

function countSudokuSolutions(grid, limit = 2) {
  let found = 0;
  const solve = (pos) => {
    if (found >= limit) return;
    if (pos === SUDOKU_N * SUDOKU_N) {
      found += 1;
      return;
    }
    const r = Math.floor(pos / SUDOKU_N);
    const c = pos % SUDOKU_N;
    if (grid[r][c]) return solve(pos + 1);
    for (let v = 1; v <= SUDOKU_N && found < limit; v++) {
      if (sudokuFits(grid, r, c, v)) {
        grid[r][c] = v;
        solve(pos + 1);
        grid[r][c] = 0;
      }
    }
  };
  solve(0);
  return found;
}

function makeSudoku(seed, blanks) {
  const rand = mulberry32(seed);
  const solution = Array.from({ length: SUDOKU_N }, () => Array(SUDOKU_N).fill(0));
  const digits = [1, 2, 3, 4, 5, 6];
  const fill = (pos) => {
    if (pos === SUDOKU_N * SUDOKU_N) return true;
    const r = Math.floor(pos / SUDOKU_N);
    const c = pos % SUDOKU_N;
    for (const v of seededShuffle(digits, rand)) {
      if (sudokuFits(solution, r, c, v)) {
        solution[r][c] = v;
        if (fill(pos + 1)) return true;
        solution[r][c] = 0;
      }
    }
    return false;
  };
  fill(0);

  const given = solution.map((row) => [...row]);
  let removed = 0;
  for (const idx of seededShuffle([...Array(SUDOKU_N * SUDOKU_N).keys()], rand)) {
    if (removed >= blanks) break;
    const r = Math.floor(idx / SUDOKU_N);
    const c = idx % SUDOKU_N;
    const keep = given[r][c];
    given[r][c] = 0;
    if (countSudokuSolutions(given.map((row) => [...row])) === 1) removed += 1;
    else given[r][c] = keep;
  }
  return { given, solution };
}

function sudoku(root, puzzle, onSolved) {
  const { given, solution } = makeSudoku(puzzle.seed ?? 3, puzzle.blanks ?? 20);
  const state = given.map((row) => [...row]);
  let selected = null;
  let finished = false;

  const board = el('div', 'sd-grid');
  const cells = state.map((row, r) =>
    row.map((_, c) => {
      const cell = el('button', 'sd-cell');
      cell.type = 'button';
      if (c % SUDOKU_BOX_COLS === SUDOKU_BOX_COLS - 1 && c < SUDOKU_N - 1) cell.classList.add('box-r');
      if (r % SUDOKU_BOX_ROWS === SUDOKU_BOX_ROWS - 1 && r < SUDOKU_N - 1) cell.classList.add('box-b');
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
    for (let r = 0; r < SUDOKU_N; r++)
      for (let c = 0; c < SUDOKU_N; c++) {
        const v = state[r][c];
        if (!v) continue;
        for (let r2 = 0; r2 < SUDOKU_N; r2++)
          for (let c2 = 0; c2 < SUDOKU_N; c2++) {
            if (r2 === r && c2 === c) continue;
            const sameBox =
              Math.floor(r / SUDOKU_BOX_ROWS) === Math.floor(r2 / SUDOKU_BOX_ROWS) &&
              Math.floor(c / SUDOKU_BOX_COLS) === Math.floor(c2 / SUDOKU_BOX_COLS);
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
  for (let v = 1; v <= SUDOKU_N; v++) {
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

  root.append(
    el('p', 'q-text', puzzle.prompt ?? 'Completa la cuadrícula: cada fila, columna y recuadro de 2×3 lleva los números del 1 al 6, sin repetir.'),
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

  const move = (dir) => {
    if (finished) return;
    const [x, y] = trail[trail.length - 1];
    if (grid[y][x][dir]) return;
    const next = { n: [x, y - 1], e: [x + 1, y], s: [x, y + 1], w: [x - 1, y] }[dir];
    const back = trail[trail.length - 2];
    if (back && back[0] === next[0] && back[1] === next[1]) trail.pop();
    else trail.push(next);
    draw();
    if (next[0] === cols - 1 && next[1] === rows - 1) {
      finished = true;
      onSolved();
    }
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
    el('p', 'q-text', puzzle.prompt ?? 'Lleva la bolita de jade hasta el farol rojo. Usa las flechas o desliza el dedo.'),
    svg,
    dpad,
  );
  draw();
}

const TYPES = { quiz, riddle, listen, wordsearch, flags, sudoku, maze };

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
