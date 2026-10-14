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
const physical = (title, objective, story = 'Ahora le toca el turno al cuerpo.') => ({
  type: 'F',
  title,
  story,
  objective,
});

export const CHESTS = [
  {
    id: 1,
    title: 'El Despertar',
    story: 'Un viento de jade recorre el reino. Una heroína dormida abre los ojos: es Piyi, y hoy comienza su camino hacia el Nivel 32.',
    gift: { name: 'Calcetines de running ON' },
    tasks: [logic('El primer acertijo'), physical(
        'Calentando motores',
        'Trote suave de 20 a 30 minutos y, al final, 4 aceleraciones cortas de unos 15 segundos. Sin cansarte: hoy solo se despiertan las piernas.',
        'La heroína sale al camino por primera vez. Hoy no se trata de ganar, sino de encender el motor.',
      ), logic('El segundo acertijo')],
  },
  {
    id: 2,
    title: 'Prueba de Fuerza',
    story: 'El Guardián de Hierro custodia la primera puerta. Solo quien levanta su propio límite puede cruzarla.',
    gift: { name: 'Zapatillas Cloudswift 3 ON' },
    tasks: [logic('Lógica 2A'), physical(
        'Prueba de Fuerza',
        'Sesión de fuerza de cuerpo completo en la Speediance, de 30 a 40 minutos, con una carga exigente y buena técnica.',
        'El Guardián de Hierro custodia la puerta. Solo quien levanta su propio límite puede cruzarla.',
      ), logic('Lógica 2B')],
  },
  {
    id: 3,
    title: 'La Biblioteca de Jade',
    story: 'Los sabios del reino hacen preguntas que solo una mente ágil responde.',
    gift: GIFT_PENDING,
    tasks: [logic('Lógica 3A'), physical(
        'El Ritmo de Jade',
        '10 minutos de trote suave, 20 minutos sostenidos a un ritmo cómodamente duro (puedes hablar, pero con dificultad) y 10 minutos de vuelta a la calma.',
        'Los sabios enseñan que el verdadero ritmo no es el más rápido, sino el que puedes sostener.',
      ), logic('Lógica 3B')],
  },
  {
    id: 4,
    title: 'Velocista Renacida',
    story: 'La pista antigua vuelve a encenderse. Los espíritus de las velocistas esperan a que Piyi recuerde cómo vuela.',
    gift: GIFT_PENDING,
    tasks: [logic('Lógica 4A'), physical(
        'Velocista Renacida',
        'Calienta 10 minutos y haz de 6 a 8 sprints de 100 metros al 90%, caminando de vuelta para recuperarte por completo. Cierra con 5 minutos de trote suave.',
        'La pista antigua vuelve a encenderse. Los espíritus de las velocistas esperan a que Piyi recuerde cómo vuela.',
      ), logic('Lógica 4B')],
  },
  {
    id: 5,
    title: 'El Pergamino en Chino',
    story: 'Un pergamino sellado habla en la lengua de los ancestros. Hay que escucharlo con atención.',
    gift: { name: 'Zapatillas Cloud 6 ON' },
    tasks: [logic('Escucha y descifra'), physical(
        'La Ruta de los Faroles',
        'Tu salida larga de la semana, a ritmo conversacional. La distancia o el tiempo los define tu plan de entrenamiento.',
        'Un camino de farolillos rojos se pierde en el horizonte. Hoy se recorre sin prisa, pero sin parar.',
      ), logic('Lógica 5B')],
  },
  {
    id: 6,
    title: 'El Festín Oculto',
    story: 'El banquete del reino está escondido entre las letras. Solo quien encuentra cada plato puede sentarse a la mesa.',
    gift: GIFT_PENDING,
    tasks: [logic('Lógica 6A'), physical(
        'Fuerza de Piernas',
        'Sesión en la Speediance enfocada en piernas y core, de 30 a 40 minutos. Es la última sesión pesada antes de la carrera.',
        'El Guardián de Hierro vuelve a la puerta. Esta vez las piernas son su armadura.',
      ), logic('Lógica 6B')],
  },
  {
    id: 7,
    title: 'Los Objetos Faltantes',
    story: 'Alguien se llevó objetos del santuario. La heroína debe descubrir qué falta.',
    gift: GIFT_PENDING,
    tasks: [logic('Lógica 7A'), physical(
        'Ensayo General',
        '10 minutos de calentamiento, 3 repeticiones de 1 km al ritmo objetivo de tu carrera con 2 minutos de trote entre cada una, y 5 minutos de vuelta a la calma.',
        'Falta una semana para la gran carrera. El reino ensaya contigo, kilómetro a kilómetro.',
      ), logic('Lógica 7B')],
  },
  {
    id: 8,
    title: 'El Camino Silencioso',
    story: 'Antes de la gran batalla, la heroína afina cuerpo y espíritu. Hoy no se fuerza: se prepara.',
    gift: GIFT_PENDING,
    tasks: [logic('Lógica 8A'), physical(
        'Afinando la Máquina',
        'Trote suave de 20 minutos y de 4 a 6 aceleraciones relajadas de 60 a 80 metros. Que las piernas se sientan ligeras, nunca cansadas.',
        'Antes de la gran batalla, la heroína afina cuerpo y espíritu. Hoy no se fuerza: se prepara.',
      ), logic('Lógica 8B')],
  },
  {
    id: 9,
    title: 'La Víspera',
    story: 'Mañana es la gran carrera. Esta noche, el reino entero se prepara contigo.',
    gift: { name: 'Polera Train-T Running ON' },
    tasks: [logic('Lógica 9A'), physical(
        'El Ritual de la Víspera',
        '15 minutos de trote muy suave, 10 minutos de movilidad y, si te sientes bien, 3 aceleraciones cortas. Descansa y prepara tu equipo para mañana.',
        'Mañana es la gran carrera. Esta noche, el reino entero se prepara contigo.',
      ), logic('Lógica 9B')],
  },
  {
    id: 10,
    title: 'El Jefe Final',
    story: 'Llegó el día. Diez kilómetros separan a la Velocista de Jade de la gloria, y al final espera el último guardián del Nivel 32.',
    gift: GIFT_PENDING,
    tasks: [
      physical(
        'La Gran Carrera',
        'Correr el 10K. Foto en la meta o con la medalla.',
        'Llegó el día. Diez kilómetros separan a la Velocista de Jade de la gloria, y el reino entero la espera en la meta.',
      ),
      logic('El descanso del héroe'),
      logic('El Jefe Final'),
    ],
  },
];

export const TASKS = CHESTS.flatMap((chest) =>
  chest.tasks.map((task, idx) => ({ ...task, n: (chest.id - 1) * 3 + idx + 1, chestId: chest.id, idx })),
);
