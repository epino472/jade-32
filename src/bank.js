// Banco de juegos de lógica para las pruebas 7 a 30.
const game = (title, story, objective, puzzles) => ({ type: 'I', title, story, objective, puzzles });

const riddle = (prompt, answers, hint) => ({ type: 'riddle', title: 'Acertijo', prompt, answers, hint });

const R_MAPA = riddle('Tengo ciudades pero no casas, ríos pero no agua y montañas pero no árboles. ¿Qué soy?', ['mapa', 'un mapa'], 'Te ayuda a no perderte.');
const R_TOALLA = riddle('Cuanto más seca, más se moja. ¿Qué es?', ['toalla', 'una toalla'], 'Está en el baño.');
const R_SILENCIO = riddle('Si me nombras, desaparezco. ¿Qué soy?', ['silencio', 'el silencio'], 'Es lo contrario del ruido.');
const R_AGUJERO = riddle('Cuanto más me quitas, más grande me hago. ¿Qué soy?', ['agujero', 'un agujero', 'hoyo', 'un hoyo'], 'Se cava.');
const R_COCO = riddle('Tengo ojos y no veo, tengo agua y no la bebo. ¿Qué soy?', ['coco', 'un coco'], 'Es una fruta tropical.');
const R_RIO = riddle('Corro sin piernas, tengo boca y no hablo, tengo cama y no duermo. ¿Qué soy?', ['rio', 'un rio'], 'Desemboca en el mar.');
const R_FUTURO = riddle('Siempre estoy delante de ti, pero nunca me ves. ¿Qué soy?', ['futuro', 'el futuro'], 'Todavía no llega.');
const R_FINAL = riddle('Para abrir el último cofre piensa en el número del nivel que alcanzas hoy. ¿Cuál es? (en cifras)', ['32', 'treinta y dos']);

const cipher = (text, shift, plain) => ({
  type: 'riddle',
  title: 'Mensaje secreto',
  prompt: `Un mensaje cifrado: «${text}». Cada letra está corrida ${shift} posiciones hacia adelante en el alfabeto. Descífralo y escríbelo.`,
  answers: [plain],
  hint: `Retrocede ${shift} letras: por ejemplo, con 3, la D es en realidad una A.`,
});
const CIPHER_1 = cipher('OD PHWD HVWD FHUFD', 3, 'la meta esta cerca');
const CIPHER_2 = cipher('IVIW QEW JYIVXI UYI IP LMIVVS', 4, 'eres mas fuerte que el hierro');
const CIPHER_FINAL = cipher('KJQNE HZRUQJFSTX UNDN', 5, 'feliz cumpleanos piyi');

const seq = (q, options, answer) => ({ q, options, answer });
const SEQ_A = {
  type: 'quiz',
  title: 'Secuencias',
  questions: [
    seq('¿Qué número sigue? 2, 4, 8, 16, …', ['24', '30', '32', '64'], 2),
    seq('¿Qué número sigue? 1, 1, 2, 3, 5, 8, …', ['11', '13', '15', '21'], 1),
    seq('¿Qué número sigue? 3, 6, 9, 12, …', ['14', '15', '16', '18'], 1),
    seq('¿Qué número sigue? 100, 90, 80, 70, …', ['50', '55', '60', '65'], 2),
    seq('¿Qué número sigue? 1, 4, 9, 16, 25, …', ['30', '36', '42', '49'], 1),
  ],
};
const SEQ_B = {
  type: 'quiz',
  title: 'Secuencias difíciles',
  questions: [
    seq('¿Qué número sigue? 2, 3, 5, 7, 11, …', ['12', '13', '15', '17'], 1),
    seq('¿Qué número sigue? 5, 10, 20, 40, …', ['60', '70', '80', '100'], 2),
    seq('¿Qué número sigue? 1, 3, 6, 10, 15, …', ['18', '20', '21', '25'], 2),
    seq('¿Qué número sigue? 64, 32, 16, 8, …', ['2', '4', '6', '0'], 1),
    seq('¿Qué letra sigue? A, C, E, G, …', ['H', 'I', 'J', 'K'], 1),
  ],
};

const trivia = (title, questions) => ({ type: 'quiz', title, questions });
const TRIVIA_DEPORTE = trivia('Trivia del atleta', [
  { q: '¿Cuántos metros tiene una vuelta a una pista de atletismo estándar?', options: ['200', '400', '800', '1.000'], answer: 1 },
  { q: '¿Cuántos kilómetros tiene un maratón?', options: ['21 km', '32 km', '42,195 km', '50 km'], answer: 2 },
  { q: '¿En qué ciudad se celebraron los Juegos Olímpicos de 2016?', options: ['Londres', 'Río de Janeiro', 'Tokio', 'Pekín'], answer: 1 },
  { q: '¿Quién posee el récord mundial de los 100 metros planos (9,58 s)?', options: ['Yohan Blake', 'Asafa Powell', 'Usain Bolt', 'Tyson Gay'], answer: 2 },
  { q: '¿Cuántos corredores forman un equipo de relevos 4×100 m?', options: ['3', '4', '5', '6'], answer: 1 },
  { q: '¿En qué prueba se usa una pértiga?', options: ['Salto con pértiga', 'Lanzamiento de jabalina', 'Salto largo', 'Vallas'], answer: 0 },
  { q: '¿Qué músculo trabaja principalmente el hip thrust?', options: ['Cuádriceps', 'Glúteo mayor', 'Bíceps', 'Pectoral'], answer: 1 },
  { q: '¿Qué significa la sigla HIIT?', options: ['Entrenamiento de intervalos de alta intensidad', 'Ejercicio ligero e intermitente total', 'Carrera de alta intensidad interna', 'Rutina aeróbica de resistencia'], answer: 0 },
  { q: '¿En qué año fueron los primeros Juegos Olímpicos de la era moderna?', options: ['1896', '1900', '1924', '1936'], answer: 0 },
  { q: '¿Cuál es la distancia oficial de una media maratón?', options: ['10 km', '15 km', '21,0975 km', '30 km'], answer: 2 },
]);
const TRIVIA_2 = trivia('Trivia de los sabios', [
  { q: '¿Qué civilización construyó Machu Picchu?', options: ['Maya', 'Inca', 'Azteca', 'Olmeca'], answer: 1 },
  { q: '¿Quién formuló la teoría de la relatividad?', options: ['Isaac Newton', 'Albert Einstein', 'Niels Bohr', 'Galileo Galilei'], answer: 1 },
  { q: '¿Qué dinastía china construyó la mayor parte de la Gran Muralla que se conserva hoy?', options: ['Ming', 'Tang', 'Han', 'Qing'], answer: 0 },
  { q: '¿Cuál es el hueso más largo del cuerpo humano?', options: ['Tibia', 'Fémur', 'Húmero', 'Peroné'], answer: 1 },
  { q: '¿Qué país tiene forma de bota?', options: ['España', 'Grecia', 'Italia', 'Portugal'], answer: 2 },
  { q: '¿En qué año cayó el Muro de Berlín?', options: ['1979', '1985', '1989', '1991'], answer: 2 },
  { q: '¿Cuál es el metal más abundante en la corteza terrestre?', options: ['Hierro', 'Aluminio', 'Cobre', 'Oro'], answer: 1 },
  { q: '¿Qué científica descubrió el radio y el polonio?', options: ['Rosalind Franklin', 'Marie Curie', 'Ada Lovelace', 'Jane Goodall'], answer: 1 },
  { q: '¿Cuál es el desierto no polar más grande del mundo?', options: ['Gobi', 'Sahara', 'Atacama', 'Kalahari'], answer: 1 },
  { q: '¿Cuántos corazones tiene un pulpo?', options: ['1', '2', '3', '4'], answer: 2 },
]);

const BANDERAS_2 = {
  type: 'flags',
  title: 'Banderas del mundo II',
  seed: 23,
  countries: [
    { flag: '🇩🇪', name: 'Alemania' },
    { flag: '🇫🇷', name: 'Francia' },
    { flag: '🇬🇧', name: 'Reino Unido' },
    { flag: '🇦🇷', name: 'Argentina' },
    { flag: '🇵🇪', name: 'Perú' },
    { flag: '🇹🇭', name: 'Tailandia' },
    { flag: '🇮🇳', name: 'India' },
    { flag: '🇿🇦', name: 'Sudáfrica' },
    { flag: '🇪🇬', name: 'Egipto' },
    { flag: '🇸🇪', name: 'Suecia' },
  ],
};

const SOPA_COMIDA = {
  type: 'wordsearch',
  title: 'Sopa del banquete',
  seed: 52,
  size: 11,
  prompt: 'Encuentra los platos del banquete. Toca la primera y la última letra de cada palabra.',
  words: ['Dim sum', 'Tofu', 'Gyoza', 'Paella', 'Gazpacho', 'Churros', 'Kimchi', 'Bao'],
};

const CRUCI_COMIDA = {
  type: 'crossword',
  title: 'Crucigrama del festín',
  seed: 3,
  entries: [
    { answer: 'PAELLA', clue: 'Arroz español con azafrán y mariscos' },
    { answer: 'SUSHI', clue: 'Bocado japonés de arroz y pescado' },
    { answer: 'RAMEN', clue: 'Sopa japonesa de fideos' },
    { answer: 'TORTILLA', clue: 'Española, de huevo y patata' },
    { answer: 'JAMON', clue: 'Se cura y se corta fino en España' },
    { answer: 'PALILLOS', clue: 'Cubiertos de madera para comer en China' },
    { answer: 'ARROZ', clue: 'Cereal base de la cocina asiática' },
    { answer: 'WONTON', clue: 'Empanadilla china que se sirve en sopa' },
  ],
};
const CRUCI_ATLETISMO = {
  type: 'crossword',
  title: 'Crucigrama del estadio',
  seed: 5,
  entries: [
    { answer: 'RELEVOS', clue: 'Prueba en la que se pasa un testigo' },
    { answer: 'SALTO', clue: 'Con garrocha o en largo' },
    { answer: 'MEDALLA', clue: 'Premio que cuelga del cuello' },
    { answer: 'VALLAS', clue: 'Obstáculos de una carrera' },
    { answer: 'CRONOMETRO', clue: 'Mide tu tiempo' },
    { answer: 'JABALINA', clue: 'Se lanza lo más lejos posible' },
    { answer: 'PESAS', clue: 'Las usas en el hip thrust y el peso muerto' },
    { answer: 'CARDIO', clue: 'Entrenamiento que acelera el corazón' },
  ],
};
const CRUCI_CHINA = {
  type: 'crossword',
  title: 'Crucigrama del reino de China',
  seed: 7,
  entries: [
    { answer: 'MURALLA', clue: 'Gran obra de piedra que cruza China' },
    { answer: 'PANDA', clue: 'Oso blanco y negro que come bambú' },
    { answer: 'JADE', clue: 'Piedra verde muy valorada' },
    { answer: 'SEDA', clue: 'Tela brillante, da nombre a una ruta' },
    { answer: 'PEKIN', clue: 'Capital de China' },
    { answer: 'BAMBU', clue: 'Planta que más come el panda' },
    { answer: 'FAROL', clue: 'Rojo y colgado, en Año Nuevo' },
    { answer: 'TIGRE', clue: 'Animal del zodiaco chino' },
  ],
};
const CRUCI_FINAL = {
  type: 'crossword',
  title: 'El crucigrama final',
  seed: 9,
  entries: [
    { answer: 'CUMPLEANOS', clue: 'Se celebra una vez al año' },
    { answer: 'TORTA', clue: 'Se corta y lleva velas' },
    { answer: 'VELAS', clue: 'Se apagan pidiendo un deseo' },
    { answer: 'REGALO', clue: 'Llega envuelto' },
    { answer: 'FIESTA', clue: 'Celebración con amigos' },
    { answer: 'BRINDIS', clue: 'Se hace levantando la copa' },
    { answer: 'PIYI', clue: 'La heroína de esta historia' },
    { answer: 'NIVEL', clue: 'Lo que subes hasta el 32' },
  ],
};

const MEM_ASIA = { type: 'memory', title: 'Memoria del banquete', seed: 3, cols: 4, pairs: ['🍜', '🥟', '🍣', '🍙', '🥢', '🍵'] };
const MEM_DEPORTE = { type: 'memory', title: 'Memoria del atleta', seed: 8, cols: 4, pairs: ['👟', '🏅', '⏱️', '🏃‍♀️', '🥇', '💪'] };
const MEM_CHINA = { type: 'memory', title: 'Memoria del reino', seed: 14, cols: 4, pairs: ['🏮', '🐼', '🎋', '🧧', '🥮', '🐉', '🎎', '🍵'] };

const DIFF_DIMSUM = { type: 'diffs', title: 'La mesa de dim sum', scene: 'dimsum' };
const DIFF_ESTADIO = { type: 'diffs', title: 'El estadio al amanecer', scene: 'estadio' };

const MISSING_1 = { type: 'missing', title: 'El estante del banquete', seed: 4, count: 3, objects: ['🍜', '🥢', '🍵', '🧧', '🏮', '🎋', '🥟', '🍙', '🐼', '🍣'] };
const MISSING_2 = { type: 'missing', title: 'La bolsa del atleta', seed: 9, count: 4, objects: ['👟', '🏅', '⏱️', '🧦', '🎽', '💧', '🍌', '🏃‍♀️', '🥇', '🎧'] };

const ANAGRAMAS_DEPORTE = {
  type: 'anagram',
  title: 'Palabras del atleta',
  seed: 2,
  words: [
    { answer: 'SPRINT', clue: 'Carrera corta a máxima velocidad' },
    { answer: 'MARATON', clue: '42 kilómetros de pura resistencia' },
    { answer: 'PISTA', clue: 'Donde corren los velocistas' },
    { answer: 'META', clue: 'Allí termina la carrera' },
    { answer: 'RITMO', clue: 'Los minutos que tardas por cada kilómetro' },
    { answer: 'PODIO', clue: 'Allí suben los tres primeros' },
  ],
};
const ANAGRAMAS_COMIDA = {
  type: 'anagram',
  title: 'Platos desordenados',
  seed: 6,
  words: [
    { answer: 'PAELLA', clue: 'Arroz español con azafrán' },
    { answer: 'SUSHI', clue: 'Arroz y pescado, de Japón' },
    { answer: 'RAMEN', clue: 'Sopa japonesa de fideos' },
    { answer: 'JAMON', clue: 'Cerdo curado, orgullo de España' },
    { answer: 'TORTILLA', clue: 'Huevo y patata, muy española' },
    { answer: 'GAMBAS', clue: 'Marisco al ajillo' },
  ],
};

const CHINO_1 = {
  type: 'listenSet',
  title: 'Chino básico: saludos',
  items: [
    { speak: '你好', pinyin: 'nǐ hǎo', options: ['Gracias', 'Hola', 'Adiós', 'Perdón'], answer: 1 },
    { speak: '谢谢', pinyin: 'xièxie', options: ['Hola', 'Gracias', 'Delicioso', 'Adiós'], answer: 1 },
    { speak: '再见', pinyin: 'zàijiàn', options: ['Buenas noches', 'De nada', 'Adiós', 'Hola'], answer: 2 },
    { speak: '好吃', pinyin: 'hǎochī', options: ['Delicioso', 'Caliente', 'Barato', 'Grande'], answer: 0 },
    { speak: '我爱你', pinyin: 'wǒ ài nǐ', options: ['Tengo hambre', 'Te quiero', 'Buen viaje', 'Nos vemos'], answer: 1 },
  ],
};
const CHINO_2 = {
  type: 'listenSet',
  title: 'Chino básico: el menú',
  items: [
    { speak: '水', pinyin: 'shuǐ', q: '¿Qué palabra es?', options: ['Agua', 'Fuego', 'Árbol', 'Montaña'], answer: 0 },
    { speak: '茶', pinyin: 'chá', q: '¿Qué palabra es?', options: ['Café', 'Té', 'Leche', 'Jugo'], answer: 1 },
    { speak: '米饭', pinyin: 'mǐfàn', q: '¿Qué palabra es?', options: ['Pan', 'Sopa', 'Arroz', 'Fideos'], answer: 2 },
    { speak: '面条', pinyin: 'miàntiáo', q: '¿Qué palabra es?', options: ['Fideos', 'Pescado', 'Carne', 'Verdura'], answer: 0 },
    { speak: '饺子', pinyin: 'jiǎozi', q: '¿Qué palabra es?', options: ['Helado', 'Pastel', 'Empanaditas al vapor', 'Ensalada'], answer: 2 },
  ],
};
const CHINO_FINAL = {
  type: 'listenSet',
  title: 'Un mensaje en chino',
  items: [
    { speak: '生日快乐', pinyin: 'shēngrì kuàilè', q: 'Escucha esta frase especial: ¿qué te dice?', options: ['Feliz cumpleaños', 'Buen viaje', 'Que descanses', 'Bienvenida'], answer: 0 },
    { speak: '三十二', pinyin: 'sānshí èr', q: '¿Qué número es?', options: ['23', '32', '12', '42'], answer: 1 },
  ],
};

const SLIDE_PIYI = { type: 'slide', title: 'El espejo de jade', seed: 6, size: 3, image: 'assets/piyi-square.jpg' };

export const T7 = game(
  'El Crucigrama del Festín',
  'La biblioteca guarda un pergamino cuadriculado: sus palabras huelen a especias y a mar.',
  'Completa el crucigrama y encuentra todas las parejas.',
  [CRUCI_COMIDA, MEM_ASIA],
);
export const T9 = game(
  'Las Ocho Diferencias',
  'Dos pergaminos casi idénticos esconden pequeños cambios. Los sabios también dejaron tres acertijos.',
  'Encuentra las ocho diferencias y resuelve los acertijos.',
  [DIFF_DIMSUM, R_MAPA, R_TOALLA, R_SILENCIO],
);
export const T10 = game(
  'Susurros en Chino',
  'Los ancestros hablan despacio y con cariño. Escúchalos con atención y no pierdas el hilo de los números.',
  'Escucha las frases y completa las secuencias.',
  [CHINO_1, SEQ_A],
);
export const T12 = game(
  'El Santuario Vacío',
  'Alguien se llevó objetos del santuario. La heroína debe descubrir qué falta.',
  'Memoriza, detecta lo que falta y resuelve los acertijos.',
  [MISSING_1, R_AGUJERO, R_COCO],
);
export const T13 = game(
  'La Trivia del Atleta',
  'Las leyendas del estadio hacen diez preguntas a quien se atreve a entrar.',
  'Responde las 10 preguntas y ordena las palabras.',
  [TRIVIA_DEPORTE, ANAGRAMAS_DEPORTE],
);
export const T15 = game(
  'El Crucigrama del Estadio',
  'Las gradas están llenas de palabras escondidas. Un sudoku cierra la puerta de salida.',
  'Completa el crucigrama y el sudoku.',
  [CRUCI_ATLETISMO, { type: 'sudoku', title: 'Sudoku del estadio', seed: 33, blanks: 22 }],
);
export const T16 = game(
  'La Vuelta al Mundo II',
  'El mapa antiguo se despliega otra vez, con más banderas y una memoria que entrenar.',
  'Reconoce las banderas y encuentra las parejas.',
  [BANDERAS_2, MEM_DEPORTE],
);
export const T18 = game(
  'Del Estadio al Laberinto',
  'Dos amaneceres que no son iguales, y un laberinto de piedra al final del camino.',
  'Encuentra las diferencias y llega al farol rojo.',
  [DIFF_ESTADIO, { type: 'maze', title: 'El laberinto del amanecer', cols: 9, rows: 12, seed: 44 }],
);
export const T19 = game(
  'El Menú del Reino',
  'En el banquete del reino todo se pide en chino. Y la sopa de letras guarda los platos de dos continentes.',
  'Escucha el menú y encuentra los platos.',
  [CHINO_2, SOPA_COMIDA],
);
export const T21 = game(
  'El Espejo de Jade',
  'Un espejo se hizo pedazos. Solo quien arma las piezas puede ver quién es de verdad.',
  'Completa las secuencias y arma la imagen.',
  [SEQ_B, SLIDE_PIYI],
);
export const T22 = game(
  'Los Sabios del Reino',
  'Los sabios aceptan solo a quien responde diez preguntas y descifra su mensaje secreto.',
  'Responde las 10 preguntas y descifra el mensaje.',
  [TRIVIA_2, CIPHER_1],
);
export const T24 = game(
  'El Santuario de los Atletas',
  'El equipaje de una gran atleta desaparece por partes. Después, el reino de China te examina.',
  'Detecta lo que falta y completa el crucigrama.',
  [MISSING_2, CRUCI_CHINA],
);
export const T25 = game(
  'Palabras Desordenadas',
  'El viento revolvió las palabras del banquete. Hay que ponerlas en su sitio.',
  'Ordena las palabras y resuelve los acertijos.',
  [ANAGRAMAS_COMIDA, R_RIO, R_FUTURO],
);
export const T27 = game(
  'La Memoria del Reino',
  'Dieciséis tesoros se esconden boca abajo. La víspera de la gran carrera, la memoria también se entrena.',
  'Encuentra las parejas y descifra el mensaje.',
  [MEM_CHINA, CIPHER_2],
);
export const T29 = game(
  'El Descanso del Héroe',
  'Tras la gran carrera, la mente trabaja mientras el cuerpo descansa. Un sudoku y un laberinto largo te esperan.',
  'Resuelve el sudoku y cruza el laberinto grande.',
  [
    { type: 'sudoku', title: 'Sudoku del descanso', seed: 55, blanks: 24 },
    { type: 'maze', title: 'El gran laberinto', cols: 12, rows: 16, seed: 31 },
  ],
);
export const T30 = game(
  'El Jefe Final',
  'El último guardián del Nivel 32 hace sus preguntas finales. Responde con todo lo aprendido.',
  'Completa el crucigrama, escucha el mensaje, descifra el código y contesta el acertijo.',
  [CRUCI_FINAL, CHINO_FINAL, CIPHER_FINAL, R_FINAL],
);
