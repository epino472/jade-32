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
const physical = (title, objective, story = 'Ahora le toca el turno al cuerpo.', checklist = []) => ({
  type: 'F',
  title,
  story,
  objective,
  checklist,
});

export const CHESTS = [
  {
    id: 1,
    title: 'El Despertar',
    story: 'Un viento de jade recorre el reino. Una heroína dormida abre los ojos: es Piyi, y hoy comienza su camino hacia el Nivel 32.',
    gift: { name: 'Calcetines de running ON' },
    tasks: [logic('El primer acertijo'), physical(
        'Calentando motores',
        'Hoy solo se despiertan las piernas: sin cansarte.',
        'La heroína sale al camino por primera vez. Hoy no se trata de ganar, sino de encender el motor.',
        ['3 km de trote suave', '4 aceleraciones de 60 m (progresivas, sin llegar al máximo)', '10 sentadillas con tu peso corporal'],
      ), logic('El segundo acertijo')],
  },
  {
    id: 2,
    title: 'Prueba de Fuerza',
    story: 'El Guardián de Hierro custodia la primera puerta. Solo quien levanta su propio límite puede cruzarla.',
    gift: { name: 'Zapatillas Cloudswift 3 ON' },
    tasks: [logic('Lógica 2A'), physical(
        'Prueba de Fuerza',
        'En la Speediance, 3 rondas de este circuito, con 90 segundos de descanso entre rondas y buena técnica.',
        'El Guardián de Hierro custodia la puerta. Solo quien levanta su propio límite puede cruzarla.',
        ['10 hip thrust con 70 kg', '10 press de banca con 25 kg', '10 peso muerto con 50 kg', '10 remo sentada con 20 kg', 'Plancha de 45 segundos'],
      ), logic('Lógica 2B')],
  },
  {
    id: 3,
    title: 'La Biblioteca de Jade',
    story: 'Los sabios del reino hacen preguntas que solo una mente ágil responde.',
    gift: GIFT_PENDING,
    tasks: [logic('Lógica 3A'), physical(
        'El Ritmo de Jade',
        'Un esfuerzo continuo y parejo: se cuenta el tiempo del reloj.',
        'Los sabios enseñan que el verdadero ritmo no es el más rápido, sino el que puedes sostener.',
        ['10 minutos de trote suave de calentamiento', '5 km en 27 minutos o menos', '5 minutos de trote suave para volver a la calma'],
      ), logic('Lógica 3B')],
  },
  {
    id: 4,
    title: 'Velocista Renacida',
    story: 'La pista antigua vuelve a encenderse. Los espíritus de las velocistas esperan a que Piyi recuerde cómo vuela.',
    gift: GIFT_PENDING,
    tasks: [logic('Lógica 4A'), physical(
        'Velocista Renacida',
        'Sprints al 90%, volviendo caminando para recuperarte por completo entre cada uno.',
        'La pista antigua vuelve a encenderse. Los espíritus de las velocistas esperan a que Piyi recuerde cómo vuela.',
        ['10 minutos de trote y movilidad de calentamiento', '3 salidas de 30 m, como en una largada', '6 sprints de 100 m', '5 minutos de trote suave para volver a la calma'],
      ), logic('Lógica 4B')],
  },
  {
    id: 5,
    title: 'El Pergamino en Chino',
    story: 'Un pergamino sellado habla en la lengua de los ancestros. Hay que escucharlo con atención.',
    gift: { name: 'Zapatillas Cloud 6 ON' },
    tasks: [logic('Escucha y descifra'), physical(
        'La Ruta de los Faroles',
        'Tu salida larga de la semana, a ritmo conversacional: tienes que poder hablar mientras corres.',
        'Un camino de farolillos rojos se pierde en el horizonte. Hoy se recorre sin prisa, pero sin parar.',
        ['12 km a ritmo suave, sin mirar el reloj más de lo necesario'],
      ), logic('Lógica 5B')],
  },
  {
    id: 6,
    title: 'El Festín Oculto',
    story: 'El banquete del reino está escondido entre las letras. Solo quien encuentra cada plato puede sentarse a la mesa.',
    gift: GIFT_PENDING,
    tasks: [logic('Lógica 6A'), physical(
        'Fuerza de Piernas',
        'La última sesión pesada antes de la carrera. En la Speediance, 3 rondas con 90 segundos de descanso entre rondas.',
        'El Guardián de Hierro vuelve a la puerta. Esta vez las piernas son su armadura.',
        ['10 sentadillas con 30 kg', '10 hip thrust con 70 kg', '12 zancadas, 6 por pierna, con 10 kg', '10 peso muerto rumano con 40 kg', 'Plancha lateral de 30 segundos por lado'],
      ), logic('Lógica 6B')],
  },
  {
    id: 7,
    title: 'Los Objetos Faltantes',
    story: 'Alguien se llevó objetos del santuario. La heroína debe descubrir qué falta.',
    gift: GIFT_PENDING,
    tasks: [logic('Lógica 7A'), physical(
        'Ensayo General',
        'Controla el ritmo: que los tres kilómetros salgan casi iguales.',
        'Falta una semana para la gran carrera. El reino ensaya contigo, kilómetro a kilómetro.',
        ['10 minutos de trote suave de calentamiento', '3 repeticiones de 1 km a 5:30 por km, con 2 minutos de trote entre cada una', '5 minutos de trote suave para volver a la calma'],
      ), logic('Lógica 7B')],
  },
  {
    id: 8,
    title: 'El Camino Silencioso',
    story: 'Antes de la gran batalla, la heroína afina cuerpo y espíritu. Hoy no se fuerza: se prepara.',
    gift: GIFT_PENDING,
    tasks: [logic('Lógica 8A'), physical(
        'Afinando la Máquina',
        'Que las piernas se sientan ligeras, nunca cansadas.',
        'Antes de la gran batalla, la heroína afina cuerpo y espíritu. Hoy no se fuerza: se prepara.',
        ['4 km de trote suave', '6 aceleraciones relajadas de 80 m, caminando de vuelta'],
      ), logic('Lógica 8B')],
  },
  {
    id: 9,
    title: 'La Víspera',
    story: 'Mañana es la gran carrera. Esta noche, el reino entero se prepara contigo.',
    gift: { name: 'Polera Train-T Running ON' },
    tasks: [logic('Lógica 9A'), physical(
        'El Ritual de la Víspera',
        'Hoy se descansa casi todo: tu misión es llegar fresca a mañana.',
        'Mañana es la gran carrera. Esta noche, el reino entero se prepara contigo.',
        ['2 km de trote muy suave', '10 minutos de movilidad', 'Deja lista tu ropa, tu número y tu desayuno para mañana'],
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
        ['10 km de carrera', 'Foto en la meta o con tu medalla'],
      ),
      logic('El descanso del héroe'),
      logic('El Jefe Final'),
    ],
  },
];

export const TASKS = CHESTS.flatMap((chest) =>
  chest.tasks.map((task, idx) => ({ ...task, n: (chest.id - 1) * 3 + idx + 1, chestId: chest.id, idx })),
);
