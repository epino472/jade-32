// Banco de juegos de lógica: pruebas 1, 3, 4, 6, 7, 9, 10, 12, 13, ... 30.
// Cada prueba apunta a ~10 minutos de juego.
const game = (title, story, objective, puzzles) => ({ type: 'I', title, story, objective, puzzles });
const riddle = (prompt, answers, hint) => ({ type: 'riddle', title: 'Acertijo', prompt, answers, hint });
const seq = (q, options, answer) => ({ q, options, answer });
const trivia = (title, questions) => ({ type: 'quiz', title, questions });
const eq = (title, questions) => ({ type: 'quiz', title, questions });

/* ---------- Acertijos ---------- */
const R_MAPA = riddle('Tengo ciudades pero no casas, ríos pero no agua y montañas pero no árboles. ¿Qué soy?', ['mapa', 'un mapa'], 'Te ayuda a no perderte.');
const R_TOALLA = riddle('Cuanto más seca, más se moja. ¿Qué es?', ['toalla', 'una toalla'], 'Está en el baño.');
const R_SILENCIO = riddle('Si me nombras, desaparezco. ¿Qué soy?', ['silencio', 'el silencio'], 'Es lo contrario del ruido.');
const R_AGUJERO = riddle('Cuanto más me quitas, más grande me hago. ¿Qué soy?', ['agujero', 'un agujero', 'hoyo', 'un hoyo'], 'Se cava.');
const R_COCO = riddle('Tengo ojos y no veo, tengo agua y no la bebo. ¿Qué soy?', ['coco', 'un coco'], 'Es una fruta tropical.');
const R_RIO = riddle('Corro sin piernas, tengo boca y no hablo, tengo cama y no duermo. ¿Qué soy?', ['rio', 'un rio'], 'Desemboca en el mar.');
const R_FUTURO = riddle('Siempre estoy delante de ti, pero nunca me ves. ¿Qué soy?', ['futuro', 'el futuro'], 'Todavía no llega.');
const R_FINAL = riddle('Para abrir el último cofre piensa en el número del nivel que alcanzas hoy. ¿Cuál es? (en cifras)', ['32', 'treinta y dos']);

const L_OVEJAS = riddle('Un pastor tiene 17 ovejas. Todas menos 9 se mueren. ¿Cuántas ovejas le quedan? (en cifras)', ['9', 'nueve'], 'Lee con calma: «todas menos 9».');
const L_MESES = riddle('¿Cuántos meses del año tienen 28 días? (en cifras)', ['12', 'doce'], 'Piensa en qué significa «tener 28 días».');
const L_PASTILLAS = riddle('Un médico te da 3 pastillas y te dice que tomes una cada media hora. ¿Cuántos minutos pasan desde que tomas la primera hasta que tomas la última? (en cifras)', ['60', 'sesenta'], 'Cuenta los intervalos, no las pastillas.');
const L_HIJOS = riddle('María tiene 4 hijas y cada una de ellas tiene un hermano. ¿Cuántos hijos tiene María en total? (en cifras)', ['5', 'cinco'], 'El hermano es el mismo para todas.');
const L_PESO = riddle('¿Qué pesa más: un kilo de plumas o un kilo de hierro?', ['igual', 'pesan igual', 'lo mismo', 'pesan lo mismo', 'ninguno', 'ninguno pesa mas'], 'Fíjate en la unidad.');
const L_LETRA = riddle('J, F, M, A, M, J, J, A, S, O, N, … ¿Qué letra sigue?', ['d'], 'Son las iniciales de algo que conoces.');
const L_CARRERA = riddle('Vas corriendo una carrera y adelantas al que va segundo. ¿En qué lugar vas ahora? (en cifras)', ['2', 'segundo', 'segunda', 'dos'], 'Ocupas el lugar del que adelantas.');
const L_VELAS = riddle('Tengo 10 velas encendidas y apago 3 de un soplido. Más tarde se consumen todas las demás. ¿Cuántas velas quedan al final? (en cifras)', ['3', 'tres'], 'Las que se consumen desaparecen.');
const L_HUEVO = riddle('Un gallo pone un huevo en la cima de un tejado a dos aguas. ¿Hacia qué lado cae el huevo?', ['ninguno', 'ninguna', 'no cae', 'no pone huevos', 'el gallo no pone huevos', 'los gallos no ponen huevos'], 'Piensa en quién pone huevos.');

/* ---------- Cifrados ---------- */
const cipher = (text, shift, plain) => ({
  type: 'riddle',
  title: 'Mensaje secreto',
  prompt: `Un mensaje cifrado: «${text}». Cada letra está corrida ${shift} posiciones hacia adelante en el alfabeto. Descífralo y escríbelo completo.`,
  answers: [plain],
  hint: `Retrocede ${shift} letras: por ejemplo, con 3, la D es en realidad una A.`,
});
const CIPHER_1 = cipher('OD SHUVHYHUDQFLD HV OD OODYH GH OD PHWD', 3, 'la perseverancia es la llave de la meta');
const CIPHER_2 = cipher('RUY MXGTJKY IGSHOUY KSVOKFGT IUT VKWAKTUY VGYUY', 6, 'los grandes cambios empiezan con pequenos pasos');
const CIPHER_3 = cipher('IVIW QEW JYIVXI UYI IP LMIVVS C QEW VETMHE UYI IP ZMIRXS', 4, 'eres mas fuerte que el hierro y mas rapida que el viento');
const CIPHER_FINAL = cipher('KJQNE HZRUQJFSTX UNDN JWJX QF RJOTW', 5, 'feliz cumpleanos piyi eres la mejor');

/* ---------- Secuencias y ecuaciones ---------- */
const SEQ_A = {
  type: 'quiz',
  title: 'Secuencias',
  questions: [
    seq('¿Qué número sigue? 2, 4, 8, 16, …', ['24', '30', '32', '64'], 2),
    seq('¿Qué número sigue? 1, 1, 2, 3, 5, 8, …', ['11', '13', '15', '21'], 1),
    seq('¿Qué número sigue? 3, 6, 9, 12, …', ['14', '15', '16', '18'], 1),
    seq('¿Qué número sigue? 100, 90, 80, 70, …', ['50', '55', '60', '65'], 2),
    seq('¿Qué número sigue? 1, 4, 9, 16, 25, …', ['30', '36', '42', '49'], 1),
    seq('¿Qué número sigue? 2, 6, 12, 20, 30, …', ['36', '40', '42', '48'], 2),
    seq('¿Qué número sigue? 1, 2, 4, 7, 11, …', ['14', '15', '16', '18'], 2),
    seq('¿Qué número sigue? 81, 27, 9, 3, …', ['0', '1', '2', '6'], 1),
    seq('¿Qué número sigue? 5, 7, 11, 17, …', ['23', '24', '25', '27'], 2),
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
    seq('¿Qué número sigue? 1, 8, 27, 64, …', ['100', '121', '125', '216'], 2),
    seq('¿Qué número sigue? 3, 5, 9, 17, 33, …', ['49', '57', '65', '66'], 2),
    seq('¿Qué letra sigue? Z, X, V, T, …', ['Q', 'R', 'S', 'P'], 1),
    seq('¿Qué número sigue? 0, 1, 3, 7, 15, …', ['23', '30', '31', '32'], 2),
  ],
};

const EQ1 = eq('Ecuaciones con emojis I', [
  seq('🍎 + 🍎 + 🍎 = 30 y 🍎 + 🍌 = 15. ¿Cuánto vale 🍌?', ['3', '5', '10', '15'], 1),
  seq('🍓 + 🍓 = 12 y 🍓 + 🍇 = 10. ¿Cuánto vale 🍇?', ['2', '4', '6', '8'], 1),
  seq('⚽ + ⚽ + 🏀 = 22 y ⚽ + 🏀 + 🏀 = 20. ¿Cuánto vale ⚽ + 🏀?', ['12', '13', '14', '16'], 2),
  seq('🐶 × 🐶 = 49 y 🐶 + 🐱 = 12. ¿Cuánto vale 🐱?', ['4', '5', '6', '7'], 1),
]);
const EQ2 = eq('Ecuaciones con emojis II', [
  seq('🥟 + 🥟 + 🥟 = 24 y 🍜 − 🥟 = 5. ¿Cuánto vale 🍜?', ['11', '12', '13', '15'], 2),
  seq('🍵 + 🍵 = 16 y 🍵 × 🍙 = 40. ¿Cuánto vale 🍙?', ['4', '5', '6', '8'], 1),
  seq('⏱️ + ⏱️ = 18, ⏱️ + 👟 = 14 y 👟 + 💧 = 7. ¿Cuánto vale 💧?', ['1', '2', '3', '4'], 1),
  seq('🏃 + 🏃 + 🏃 + 🏃 = 24 y 🏆 = 🏃 + 🏃 + 4. ¿Cuánto vale 🏆?', ['12', '14', '16', '18'], 2),
]);
const EQ3 = eq('Ecuaciones con emojis III', [
  seq('🌸 + 🌿 = 11, 🌿 + 🌊 = 9 y 🌸 + 🌊 = 10. ¿Cuánto vale 🌸?', ['4', '5', '6', '7'], 2),
  seq('🔺 = 3 × 🔵 y 🔺 + 🔵 = 20. ¿Cuánto vale 🔵?', ['4', '5', '6', '10'], 1),
  seq('🍕 + 🍕 + 🍕 + 🍕 = 36 y 🍕 + 🥤 = 12. ¿Cuánto vale 🥤?', ['2', '3', '4', '5'], 1),
  seq('(🍰 + 3) × 2 = 20. ¿Cuánto vale 🍰?', ['5', '6', '7', '8'], 2),
]);
const EQ4 = eq('Ecuaciones con emojis IV', [
  seq('🥇 = 🥈 + 3, 🥈 = 🥉 + 3 y 🥇 + 🥈 + 🥉 = 33. ¿Cuánto vale 🥉?', ['6', '7', '8', '9'], 2),
  seq('🚴 + 🚴 = 🏊 + 4 y 🏊 = 6. ¿Cuánto vale 🚴?', ['4', '5', '6', '10'], 1),
  seq('(🍎 × 3) + 4 = 19. ¿Cuánto vale 🍎?', ['4', '5', '6', '7'], 1),
  seq('🍒 + 🍒 + 🍒 = 🍋 + 🍋 y 🍋 = 9. ¿Cuánto vale 🍒?', ['3', '4', '6', '9'], 2),
]);

/* ---------- Trivias (15 preguntas) ---------- */
const TRIVIA_GENERAL = trivia('Trivia de cultura general', [
  { q: '¿Cuál es el planeta más grande del sistema solar?', options: ['Saturno', 'Júpiter', 'Neptuno', 'Urano'], answer: 1 },
  { q: '¿En qué año llegó el ser humano por primera vez a la Luna?', options: ['1957', '1961', '1969', '1975'], answer: 2 },
  { q: '¿Cuál es la capital de Australia?', options: ['Sídney', 'Canberra', 'Melbourne', 'Perth'], answer: 1 },
  { q: '¿Qué elemento químico tiene el símbolo Au?', options: ['Plata', 'Aluminio', 'Argón', 'Oro'], answer: 3 },
  { q: '¿Cuántos huesos tiene aproximadamente el cuerpo de un adulto?', options: ['106', '156', '206', '306'], answer: 2 },
  { q: '¿Cuál es hoy el país más poblado del mundo?', options: ['China', 'Estados Unidos', 'Indonesia', 'India'], answer: 3 },
  { q: '¿En qué ciudad está el Museo del Prado?', options: ['Madrid', 'Barcelona', 'Sevilla', 'Valencia'], answer: 0 },
  { q: '¿Quién escribió «Don Quijote de la Mancha»?', options: ['Federico García Lorca', 'Miguel de Cervantes', 'Lope de Vega', 'Gabriel García Márquez'], answer: 1 },
  { q: '¿Cuál es el río más largo de Sudamérica?', options: ['Orinoco', 'Paraná', 'Amazonas', 'Magdalena'], answer: 2 },
  { q: '¿Cuál es el océano más grande de la Tierra?', options: ['Atlántico', 'Índico', 'Ártico', 'Pacífico'], answer: 3 },
  { q: '¿Qué gas es el más abundante en la atmósfera terrestre?', options: ['Oxígeno', 'Nitrógeno', 'Dióxido de carbono', 'Argón'], answer: 1 },
  { q: '¿Cuál es el país más grande del mundo por superficie?', options: ['China', 'Canadá', 'Rusia', 'Estados Unidos'], answer: 2 },
  { q: '¿Quién pintó «Las Meninas»?', options: ['Goya', 'Velázquez', 'Picasso', 'Dalí'], answer: 1 },
  { q: '¿Cuántas cuerdas tiene una guitarra clásica?', options: ['4', '5', '6', '7'], answer: 2 },
  { q: '¿Qué instrumento mide la presión atmosférica?', options: ['Termómetro', 'Barómetro', 'Higrómetro', 'Anemómetro'], answer: 1 },
]);
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
  { q: '¿Qué país ha dominado históricamente las carreras de fondo, con corredores como Kipchoge?', options: ['Kenia', 'Brasil', 'Japón', 'Chile'], answer: 0 },
  { q: '¿Qué deporte combina natación, ciclismo y carrera?', options: ['Biatlón', 'Triatlón', 'Decatlón', 'Pentatlón'], answer: 1 },
  { q: '¿Cuántas pruebas componen un decatlón?', options: ['7', '8', '10', '12'], answer: 2 },
  { q: '¿Qué músculos forman la pantorrilla?', options: ['Sóleo y gemelos', 'Cuádriceps', 'Glúteo medio', 'Dorsal ancho'], answer: 0 },
  { q: '¿Qué mide el VO₂ máx?', options: ['La fuerza máxima', 'El consumo máximo de oxígeno', 'La flexibilidad', 'La velocidad punta'], answer: 1 },
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
  { q: '¿Qué filósofo griego fue maestro de Alejandro Magno?', options: ['Sócrates', 'Platón', 'Aristóteles', 'Epicuro'], answer: 2 },
  { q: '¿Cuántos años duró la Guerra de los Cien Años?', options: ['100', '116', '99', '87'], answer: 1 },
  { q: '¿Qué país regaló la Estatua de la Libertad a Estados Unidos?', options: ['Reino Unido', 'Francia', 'España', 'Alemania'], answer: 1 },
  { q: '¿Cuál es la capital de Turquía?', options: ['Estambul', 'Ankara', 'Esmirna', 'Antalya'], answer: 1 },
  { q: '¿Qué elemento químico tiene número atómico 1?', options: ['Helio', 'Hidrógeno', 'Litio', 'Oxígeno'], answer: 1 },
]);

/* ---------- Banderas (15 cada una) ---------- */
const BANDERAS = {
  type: 'flags',
  title: '¿De qué país es esta bandera?',
  seed: 11,
  countries: [
    { flag: '🇯🇵', name: 'Japón' },
    { flag: '🇨🇳', name: 'China' },
    { flag: '🇪🇸', name: 'España' },
    { flag: '🇨🇱', name: 'Chile' },
    { flag: '🇧🇷', name: 'Brasil' },
    { flag: '🇰🇷', name: 'Corea del Sur' },
    { flag: '🇮🇹', name: 'Italia' },
    { flag: '🇨🇦', name: 'Canadá' },
    { flag: '🇦🇺', name: 'Australia' },
    { flag: '🇲🇽', name: 'México' },
    { flag: '🇳🇿', name: 'Nueva Zelanda' },
    { flag: '🇵🇹', name: 'Portugal' },
    { flag: '🇬🇷', name: 'Grecia' },
    { flag: '🇨🇴', name: 'Colombia' },
    { flag: '🇹🇷', name: 'Turquía' },
  ],
};
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
    { flag: '🇳🇴', name: 'Noruega' },
    { flag: '🇵🇱', name: 'Polonia' },
    { flag: '🇻🇳', name: 'Vietnam' },
    { flag: '🇲🇦', name: 'Marruecos' },
    { flag: '🇺🇾', name: 'Uruguay' },
  ],
};

/* ---------- Sopas de letras (13×13, 12 palabras) ---------- */
const CAPITALES = {
  type: 'wordsearch',
  title: 'Sopa de capitales',
  seed: 21,
  size: 13,
  prompt: 'Encuentra las 12 capitales. Toca la primera y la última letra de cada palabra.',
  words: ['Tokio', 'Pekín', 'Madrid', 'Santiago', 'Brasilia', 'Seúl', 'Roma', 'Ottawa', 'Lima', 'Bogotá', 'París', 'Berlín'],
};
const SOPA_COMIDA = {
  type: 'wordsearch',
  title: 'Sopa del banquete',
  seed: 52,
  size: 13,
  prompt: 'Encuentra los 12 platos del banquete. Toca la primera y la última letra de cada palabra.',
  words: ['Dim sum', 'Tofu', 'Gyoza', 'Paella', 'Gazpacho', 'Churros', 'Kimchi', 'Bao', 'Tempura', 'Sangría', 'Ramen', 'Sushi'],
};

/* ---------- Crucigramas (13 palabras) ---------- */
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
    { answer: 'GAZPACHO', clue: 'Sopa fría andaluza de tomate' },
    { answer: 'TEMPURA', clue: 'Fritura japonesa ligera y crujiente' },
    { answer: 'CHURROS', clue: 'Se mojan en chocolate caliente' },
    { answer: 'KIMCHI', clue: 'Col fermentada, plato coreano' },
    { answer: 'SANGRIA', clue: 'Bebida española de vino con fruta' },
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
    { answer: 'MARATON', clue: 'Carrera de 42,195 km' },
    { answer: 'PODIO', clue: 'Allí suben los tres primeros' },
    { answer: 'ZANCADA', clue: 'Paso largo al correr' },
    { answer: 'FARTLEK', clue: 'Entrenamiento sueco de cambios de ritmo' },
    { answer: 'TACOS', clue: 'Allí apoyan los pies los velocistas para salir' },
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
    { answer: 'MANDARIN', clue: 'Idioma más hablado de China' },
    { answer: 'YANGTSE', clue: 'Río más largo de Asia' },
    { answer: 'PAGODA', clue: 'Torre de varios pisos con techos curvos' },
    { answer: 'CALIGRAFIA', clue: 'Arte de escribir bellamente con pincel' },
    { answer: 'ZODIACO', clue: 'Doce animales que marcan los años' },
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
    { answer: 'DESEO', clue: 'Se pide al soplar las velas' },
    { answer: 'ABRAZO', clue: 'Cariño que se da con los brazos' },
    { answer: 'SORPRESA', clue: 'Lo que esconde este juego' },
    { answer: 'CANCION', clue: 'Se canta antes de soplar las velas' },
    { answer: 'JADE', clue: 'La piedra de este reino' },
  ],
};

/* ---------- Memoria (20 y 24 cartas) ---------- */
const MEM_ASIA = { type: 'memory', title: 'Memoria del banquete', seed: 3, cols: 5, pairs: ['🍜', '🥟', '🍣', '🍙', '🥢', '🍵', '🍡', '🥠', '🍚', '🥮'] };
const MEM_DEPORTE = { type: 'memory', title: 'Memoria del atleta', seed: 8, cols: 6, pairs: ['👟', '🏅', '⏱️', '🏃‍♀️', '🥇', '💪', '🧦', '🎽', '💧', '🍌', '🏆', '🧢'] };
const MEM_CHINA = { type: 'memory', title: 'Memoria del reino', seed: 14, cols: 6, pairs: ['🏮', '🐼', '🎋', '🧧', '🥮', '🐉', '🎎', '🍵', '🐯', '🌸', '🀄', '🥢'] };

/* ---------- Diferencias, objetos faltantes ---------- */
const DIFF_DIMSUM = { type: 'diffs', title: 'La mesa de dim sum', scene: 'dimsum' };
const DIFF_ESTADIO = { type: 'diffs', title: 'El estadio al amanecer', scene: 'estadio' };
const MISSING_1 = {
  type: 'missing',
  title: 'El estante del banquete',
  seed: 4,
  count: 5,
  peeks: 1,
  objects: ['🍜', '🥢', '🍵', '🧧', '🏮', '🎋', '🥟', '🍙', '🐼', '🍣', '🍡', '🥠', '🍚', '🥮', '🍤'],
};
const MISSING_2 = {
  type: 'missing',
  title: 'La bolsa del atleta',
  seed: 9,
  count: 5,
  peeks: 1,
  objects: ['👟', '🏅', '⏱️', '🧦', '🎽', '💧', '🍌', '🏃‍♀️', '🥇', '🎧', '🧢', '🩳', '🥤', '🧴', '🏆'],
};

/* ---------- Anagramas (10 palabras) ---------- */
const ANAGRAMAS_DEPORTE = {
  type: 'anagram',
  title: 'Palabras del atleta',
  seed: 2,
  words: [
    { answer: 'SPRINT', clue: 'Carrera corta a máxima velocidad' },
    { answer: 'META', clue: 'Allí termina la carrera' },
    { answer: 'PISTA', clue: 'Donde corren los velocistas' },
    { answer: 'RITMO', clue: 'Los minutos que tardas por cada kilómetro' },
    { answer: 'TROTE', clue: 'Correr suave, sin prisa' },
    { answer: 'PULSO', clue: 'Lo que mide tu reloj en el corazón' },
    { answer: 'FONDO', clue: 'Carreras largas de resistencia' },
    { answer: 'ARRANQUE', clue: 'Los primeros metros de la salida' },
    { answer: 'AGUJETAS', clue: 'Dolor muscular un día después de entrenar' },
    { answer: 'ZAPATILLAS', clue: 'No salgas a correr sin ellas' },
  ],
};
const ANAGRAMAS_COMIDA = {
  type: 'anagram',
  title: 'Platos desordenados',
  seed: 6,
  words: [
    { answer: 'EMPANADA', clue: 'Masa rellena y horneada, muy chilena' },
    { answer: 'CEVICHE', clue: 'Pescado crudo marinado en limón' },
    { answer: 'CAZUELA', clue: 'Sopa de pollo con papa y choclo' },
    { answer: 'GUACAMOLE', clue: 'Crema mexicana de palta' },
    { answer: 'PIZZA', clue: 'Masa, tomate y queso, de Italia' },
    { answer: 'BURRITO', clue: 'Tortilla enrollada y rellena' },
    { answer: 'FALAFEL', clue: 'Croquetas de garbanzo' },
    { answer: 'CROISSANT', clue: 'Media luna francesa de hojaldre' },
    { answer: 'MERMELADA', clue: 'Fruta cocida con azúcar, para el pan' },
    { answer: 'CHOCOLATE', clue: 'Del cacao, dulce y oscuro' },
  ],
};

/* ---------- Chino básico (8 frases cada uno) ---------- */
const CHINO_1 = {
  type: 'listenSet',
  title: 'Chino básico: saludos',
  items: [
    { speak: '你好', pinyin: 'nǐ hǎo', options: ['Gracias', 'Hola', 'Adiós', 'Perdón'], answer: 1 },
    { speak: '谢谢', pinyin: 'xièxie', options: ['Hola', 'Gracias', 'Delicioso', 'Adiós'], answer: 1 },
    { speak: '再见', pinyin: 'zàijiàn', options: ['Buenas noches', 'De nada', 'Adiós', 'Hola'], answer: 2 },
    { speak: '好吃', pinyin: 'hǎochī', options: ['Delicioso', 'Caliente', 'Barato', 'Grande'], answer: 0 },
    { speak: '我爱你', pinyin: 'wǒ ài nǐ', options: ['Tengo hambre', 'Te quiero', 'Buen viaje', 'Nos vemos'], answer: 1 },
    { speak: '早上好', pinyin: 'zǎoshang hǎo', options: ['Buenas noches', 'Buenos días', 'Buena suerte', 'Buen provecho'], answer: 1 },
    { speak: '晚安', pinyin: "wǎn'ān", options: ['Buenas noches', 'Hasta pronto', 'Bienvenida', 'Feliz año'], answer: 0 },
    { speak: '对不起', pinyin: 'duìbuqǐ', options: ['De nada', 'Perdón', 'Con permiso', 'Gracias'], answer: 1 },
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
    { speak: '肉', pinyin: 'ròu', q: '¿Qué palabra es?', options: ['Verdura', 'Carne', 'Postre', 'Fruta'], answer: 1 },
    { speak: '鱼', pinyin: 'yú', q: '¿Qué palabra es?', options: ['Pescado', 'Pollo', 'Huevo', 'Queso'], answer: 0 },
    { speak: '汤', pinyin: 'tāng', q: '¿Qué palabra es?', options: ['Ensalada', 'Pan', 'Sopa', 'Helado'], answer: 2 },
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

const SLIDE_PIYI = { type: 'slide', title: 'El espejo de jade', seed: 6, size: 4, image: 'assets/piyi-square.jpg' };

/* ---------- Pruebas ---------- */
const R_RELOJ = riddle('Tengo agujas pero no pincho, tengo números pero no cuento. ¿Qué soy?', ['reloj', 'un reloj'], 'Marca la hora. Y la cuenta regresiva ya empezó.');
const CIPHER_0 = {
  type: 'riddle',
  title: 'El mensaje del reino',
  prompt: 'Un mensaje cifrado: «HO UHLQR WH HVSHUD HO GLHFLQXHYH». Cada letra está corrida 3 posiciones hacia adelante en el alfabeto. Descífralo y escríbelo completo.',
  answers: ['el reino te espera el diecinueve'],
  hint: 'Retrocede 3 letras: la H es en realidad una E.',
};

export const T0 = game(
  'Prueba 0: La Llamada del Reino',
  'Antes de que comience la aventura, el reino te envía una prueba de práctica. Es un pequeño adelanto de lo que se viene.',
  'Resuelve el sudoku, el acertijo y descifra el mensaje. Esta prueba no cuenta dentro de las treinta.',
  [{ type: 'sudoku', title: 'Sudoku de práctica', seed: 2, blanks: 14 }, R_RELOJ, CIPHER_0],
);

export const T1 = game(
  'La Gran Trivia',
  'Antes de entrenar el cuerpo, hay que despertar la mente. Quince preguntas custodian la primera puerta.',
  'Responde la trivia, resuelve las ecuaciones y los acertijos.',
  [TRIVIA_GENERAL, EQ1, L_OVEJAS, L_MESES],
);
export const T3 = game(
  'La Vuelta al Mundo',
  'Un mapa antiguo se despliega ante la heroína: banderas, países y capitales de todos los rincones.',
  'Reconoce las 15 banderas, encuentra las capitales escondidas y resuelve el acertijo.',
  [BANDERAS, CAPITALES, L_PASTILLAS],
);
export const T4 = game(
  'El Cuadro de Jade',
  'Nueve piedras de jade, nueve lugares, ninguna repetida. Los artesanos del reino te desafían.',
  'Completa los dos sudokus: cada fila, columna y recuadro lleva cada número una sola vez.',
  [
    { type: 'sudoku', title: 'Sudoku del artesano (9×9)', size: 9, seed: 7, blanks: 40 },
    { type: 'sudoku', title: 'Sudoku maestro (6×6)', seed: 19, blanks: 24 },
  ],
);
export const T6 = game(
  'El Laberinto de los Faroles',
  'Dos laberintos de piedra guardan el último farol de la noche. Solo quien no se pierde llega a la luz.',
  'Atraviesa los laberintos, resuelve las ecuaciones y el acertijo.',
  [
    { type: 'maze', title: 'Laberinto mediano', cols: 10, rows: 14, seed: 5 },
    { type: 'maze', title: 'Laberinto grande', cols: 14, rows: 20, seed: 12 },
    EQ2,
    L_HIJOS,
  ],
);
export const T7 = game(
  'El Crucigrama del Festín',
  'La biblioteca guarda un pergamino cuadriculado: sus palabras huelen a especias y a mar.',
  'Completa el crucigrama de 13 palabras y encuentra todas las parejas.',
  [CRUCI_COMIDA, MEM_ASIA],
);
export const T9 = game(
  'Las Doce Diferencias',
  'Dos pergaminos casi idénticos esconden pequeños cambios. Los sabios también dejaron cuatro acertijos.',
  'Encuentra las doce diferencias y resuelve los acertijos.',
  [DIFF_DIMSUM, R_MAPA, R_TOALLA, R_SILENCIO, L_VELAS],
);
export const T10 = game(
  'Susurros en Chino',
  'Los ancestros hablan despacio y con cariño. Escúchalos, sigue la secuencia de los números y descifra su mensaje.',
  'Escucha las frases, completa las secuencias y descifra el mensaje.',
  [CHINO_1, SEQ_A, CIPHER_1],
);
export const T12 = game(
  'El Santuario Vacío',
  'Alguien se llevó objetos del santuario. La heroína debe descubrir qué falta, y resolver lo que quedó escrito.',
  'Memoriza, detecta lo que falta y resuelve las ecuaciones y los acertijos.',
  [MISSING_1, EQ3, R_AGUJERO, R_COCO],
);
export const T13 = game(
  'La Trivia del Atleta',
  'Las leyendas del estadio hacen quince preguntas a quien se atreve a entrar.',
  'Responde las 15 preguntas y ordena las 10 palabras.',
  [TRIVIA_DEPORTE, ANAGRAMAS_DEPORTE],
);
export const T15 = game(
  'El Crucigrama del Estadio',
  'Las gradas están llenas de palabras escondidas. Un sudoku cierra la puerta de salida.',
  'Completa el crucigrama de 13 palabras y el sudoku.',
  [CRUCI_ATLETISMO, { type: 'sudoku', title: 'Sudoku del estadio (6×6)', seed: 33, blanks: 26 }],
);
export const T16 = game(
  'La Vuelta al Mundo II',
  'El mapa antiguo se despliega otra vez, con más banderas y una memoria que entrenar.',
  'Reconoce las banderas, encuentra las parejas y resuelve los acertijos.',
  [BANDERAS_2, MEM_DEPORTE, L_CARRERA, L_PESO, L_LETRA],
);
export const T18 = game(
  'Del Estadio al Laberinto',
  'Dos amaneceres que no son iguales, un laberinto de piedra y unas cuentas que resolver.',
  'Encuentra las doce diferencias, llega al farol rojo y resuelve las ecuaciones.',
  [DIFF_ESTADIO, { type: 'maze', title: 'El laberinto del amanecer', cols: 12, rows: 16, seed: 44 }, EQ4],
);
export const T19 = game(
  'El Menú del Reino',
  'En el banquete del reino todo se pide en chino. Y la sopa de letras guarda los platos de dos continentes.',
  'Escucha el menú, encuentra los 12 platos y resuelve el acertijo.',
  [CHINO_2, SOPA_COMIDA, R_RIO],
);
export const T21 = game(
  'El Espejo de Jade',
  'Un espejo se hizo pedazos. Solo quien arma las dieciséis piezas puede ver quién es de verdad.',
  'Completa las secuencias y arma la imagen.',
  [SEQ_B, SLIDE_PIYI],
);
export const T22 = game(
  'Los Sabios del Reino',
  'Los sabios aceptan solo a quien responde quince preguntas y descifra su mensaje secreto.',
  'Responde las 15 preguntas, descifra el mensaje y resuelve el acertijo.',
  [TRIVIA_2, CIPHER_2, R_FUTURO],
);
export const T24 = game(
  'El Santuario de los Atletas',
  'El equipaje de una gran atleta desaparece por partes. Después, el reino de China te examina.',
  'Detecta lo que falta y completa el crucigrama de 13 palabras.',
  [MISSING_2, CRUCI_CHINA],
);
export const T25 = game(
  'Palabras Desordenadas',
  'El viento revolvió las palabras del banquete. Hay que ponerlas en su sitio, y hacer unas cuentas.',
  'Ordena las 10 palabras y resuelve las ecuaciones y el acertijo.',
  [ANAGRAMAS_COMIDA, EQ4, L_HUEVO],
);
export const T27 = game(
  'La Memoria del Reino',
  'Veinticuatro tesoros se esconden boca abajo. La víspera de la gran carrera, la memoria también se entrena.',
  'Encuentra las parejas, descifra el mensaje y completa el sudoku.',
  [MEM_CHINA, CIPHER_3, { type: 'sudoku', title: 'Sudoku de la víspera (6×6)', seed: 61, blanks: 26 }],
);
export const T29 = game(
  'El Descanso del Héroe',
  'Tras la gran carrera, la mente trabaja mientras el cuerpo descansa. Un sudoku difícil y un laberinto largo te esperan.',
  'Resuelve el sudoku de 9×9 y cruza el laberinto grande.',
  [
    { type: 'sudoku', title: 'Sudoku del descanso (9×9)', size: 9, seed: 55, blanks: 46 },
    { type: 'maze', title: 'El gran laberinto', cols: 16, rows: 22, seed: 31 },
  ],
);
export const T30 = game(
  'El Jefe Final',
  'El último guardián del Nivel 32 hace sus preguntas finales. Responde con todo lo aprendido.',
  'Completa el crucigrama, escucha el mensaje, descifra el código y contesta el acertijo.',
  [CRUCI_FINAL, CHINO_FINAL, CIPHER_FINAL, R_FINAL],
);
