// 10 cofres (misiones) x 3 pruebas = 30 pruebas, una por día desde START_DATE.
// Cada cofre: 2 pruebas de lógica (I) + 1 física (F). Al completar las 3 se abre
// con el código secreto de Esteban y se revela el regalo.
// El contenido marcado "(borrador)" es de relleno y se reemplaza por el definitivo.

export const START_DATE = '2026-10-19';
export const TYPE_LABEL = { F: 'FÍSICA', I: 'LÓGICA' };

const GIFT_PENDING = { name: null };

const DRAFT_PUZZLES = [
  {
    type: 'quiz',
    title: 'Trivia (borrador)',
    questions: [
      { q: '¿Cuántos kilómetros tiene una carrera de 10K?', options: ['5', '10', '21', '42'], answer: 1 },
      { q: '¿Qué plato español lleva arroz, azafrán y mariscos?', options: ['Paella', 'Gazpacho', 'Tortilla', 'Fabada'], answer: 0 },
    ],
  },
  {
    type: 'riddle',
    title: 'Acertijo (borrador)',
    prompt: 'Tengo agujas pero no pincho, tengo números pero no cuento. ¿Qué soy?',
    answers: ['reloj', 'un reloj'],
    hint: 'Marca la hora.',
  },
  {
    type: 'wordsearch',
    title: 'Sopa de letras (borrador)',
    size: 11,
    words: ['Paella', 'Ramen', 'Sushi', 'Tortilla', 'Dim sum', 'Gambas', 'Jamón', 'Wonton'],
  },
  {
    type: 'listen',
    title: 'Escucha (borrador)',
    q: '¿Qué significa lo que escuchas?',
    speak: '你好',
    pinyin: 'nǐ hǎo',
    options: ['Gracias', 'Hola', 'Adiós', 'Delicioso'],
    answer: 1,
  },
];

let draftCounter = 0;
const logic = (title) => {
  const base = DRAFT_PUZZLES[draftCounter % DRAFT_PUZZLES.length];
  draftCounter += 1;
  return {
    type: 'I',
    title,
    story: 'Una prueba de ingenio te espera.',
    objective: 'Resuelve el desafío. (borrador)',
    puzzles: [{ ...base, seed: draftCounter * 7 + 1 }],
  };
};
const physical = (title, objective = 'Esteban define el reto exacto. (borrador)') => ({
  type: 'F',
  title,
  story: 'Ahora le toca el turno al cuerpo.',
  objective,
});

export const CHESTS = [
  {
    id: 1,
    title: 'El Despertar',
    story: 'Un viento de jade recorre el reino. Una heroína dormida abre los ojos: es Piyi, y hoy comienza su camino hacia el Nivel 32.',
    gift: { name: 'Calcetines de running ON' },
    tasks: [logic('El primer acertijo'), physical('Reto físico 1'), logic('El segundo acertijo')],
  },
  {
    id: 2,
    title: 'Prueba de Fuerza',
    story: 'El Guardián de Hierro custodia la primera puerta. Solo quien levanta su propio límite puede cruzarla.',
    gift: GIFT_PENDING,
    tasks: [logic('Lógica 2A'), physical('Fuerza en la Speediance'), logic('Lógica 2B')],
  },
  {
    id: 3,
    title: 'La Biblioteca de Jade',
    story: 'Los sabios del reino hacen preguntas que solo una mente ágil responde.',
    gift: GIFT_PENDING,
    tasks: [logic('Lógica 3A'), physical('Reto físico 3'), logic('Lógica 3B')],
  },
  {
    id: 4,
    title: 'Velocista Renacida',
    story: 'La pista antigua vuelve a encenderse. Los espíritus de las velocistas esperan a que Piyi recuerde cómo vuela.',
    gift: GIFT_PENDING,
    tasks: [logic('Lógica 4A'), physical('Sprints'), logic('Lógica 4B')],
  },
  {
    id: 5,
    title: 'El Pergamino en Chino',
    story: 'Un pergamino sellado habla en la lengua de los ancestros. Hay que escucharlo con atención.',
    gift: { name: 'Zapatillas Cloud 6 ON' },
    tasks: [logic('Escucha y descifra'), physical('Reto físico 5'), logic('Lógica 5B')],
  },
  {
    id: 6,
    title: 'El Festín Oculto',
    story: 'El banquete del reino está escondido entre las letras. Solo quien encuentra cada plato puede sentarse a la mesa.',
    gift: GIFT_PENDING,
    tasks: [logic('Lógica 6A'), physical('Reto físico 6'), logic('Lógica 6B')],
  },
  {
    id: 7,
    title: 'Los Objetos Faltantes',
    story: 'Alguien se llevó objetos del santuario. La heroína debe descubrir qué falta.',
    gift: GIFT_PENDING,
    tasks: [logic('Lógica 7A'), physical('Reto físico 7'), logic('Lógica 7B')],
  },
  {
    id: 8,
    title: 'El Camino Silencioso',
    story: 'Antes de la gran batalla, la heroína afina cuerpo y espíritu. Hoy no se fuerza: se prepara.',
    gift: GIFT_PENDING,
    tasks: [logic('Lógica 8A'), physical('Activación suave', 'Movilidad y activación suave, sin carga. (borrador)'), logic('Lógica 8B')],
  },
  {
    id: 9,
    title: 'La Víspera',
    story: 'Mañana es la gran carrera. Esta noche, el reino entero se prepara contigo.',
    gift: { name: 'Polera Train-T Running ON' },
    tasks: [logic('Lógica 9A'), physical('Ritual de afinamiento', 'Movilidad suave de ~20 min, sin carga. (borrador)'), logic('Lógica 9B')],
  },
  {
    id: 10,
    title: 'El Jefe Final',
    story: 'Llegó el día. Diez kilómetros separan a la Velocista de Jade de la gloria, y al final espera el último guardián del Nivel 32.',
    gift: { name: 'Zapatillas Cloudswift 3 ON' },
    tasks: [
      physical('La Gran Carrera', 'Correr el 10K. Foto en la meta o con la medalla.'),
      logic('El descanso del héroe'),
      logic('El Jefe Final'),
    ],
  },
];

export const TASKS = CHESTS.flatMap((chest) =>
  chest.tasks.map((task, idx) => ({ ...task, n: (chest.id - 1) * 3 + idx + 1, chestId: chest.id, idx })),
);
