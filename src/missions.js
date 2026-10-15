import { T7, T9, T10, T12, T13, T15, T16, T18, T19, T21, T22, T24, T25, T27, T29, T30 } from './bank.js';

// 10 cofres (misiones) x 3 pruebas = 30 pruebas, una por día desde START_DATE.
// Cada cofre: 2 pruebas de lógica (I) + 1 física (F). Al completar las 3 se abre
// con el código secreto de Esteban y se revela el regalo.

export const START_DATE = '2026-10-19';
export const TYPE_LABEL = { F: 'FÍSICA', I: 'LÓGICA' };

const GIFT_PENDING = { name: null };

const game = (title, story, objective, puzzles) => ({ type: 'I', title, story, objective, puzzles });

const TRIVIA_GENERAL = {
  type: 'quiz',
  title: 'Trivia de cultura general',
  questions: [
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
  ],
};

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
  ],
};

const CAPITALES = {
  type: 'wordsearch',
  title: 'Sopa de capitales',
  seed: 21,
  size: 11,
  prompt: 'Encuentra las capitales. Toca la primera y la última letra de cada palabra.',
  words: ['Tokio', 'Pekín', 'Madrid', 'Santiago', 'Brasilia', 'Seúl', 'Roma', 'Ottawa'],
};

const physical = (title, objective, story ='Ahora le toca el turno al cuerpo.', checklist = []) => ({
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
    tasks: [
      game(
        'La Gran Trivia',
        'Antes de entrenar el cuerpo, hay que despertar la mente. Diez preguntas custodian la primera puerta.',
        'Responde las 10 preguntas. Los errores no te frenan: puedes volver a intentarlo.',
        [TRIVIA_GENERAL],
      ),
      physical(
        'Calentando motores',
        'Hoy solo se despiertan las piernas: sin cansarte.',
        'La heroína sale al camino por primera vez. Hoy no se trata de ganar, sino de encender el motor.',
        ['3 km de trote suave', '4 aceleraciones de 60 m (progresivas, sin llegar al máximo)', '10 sentadillas con tu peso corporal'],
      ), game(
        'La Vuelta al Mundo',
        'Un mapa antiguo se despliega ante la heroína: banderas, países y capitales de todos los rincones.',
        'Reconoce las 10 banderas y encuentra las capitales escondidas.',
        [BANDERAS, CAPITALES],
      ),
    ],
  },
  {
    id: 2,
    title: 'Prueba de Fuerza',
    story: 'El Guardián de Hierro custodia la primera puerta. Solo quien levanta su propio límite puede cruzarla.',
    gift: { name: 'Zapatillas Cloudswift 3 ON' },
    tasks: [
      game(
        'El Cuadro de Jade',
        'Seis piedras de jade, seis lugares, ninguna repetida. Los artesanos del reino te desafían.',
        'Completa los dos sudokus: cada fila, columna y recuadro lleva los números del 1 al 6.',
        [
          { type: 'sudoku', title: 'Sudoku aprendiz', seed: 7, blanks: 16 },
          { type: 'sudoku', title: 'Sudoku maestro', seed: 19, blanks: 22 },
        ],
      ),
      physical(
        'Prueba de Fuerza',
        'En la Speediance, 3 rondas de este circuito, con 90 segundos de descanso entre rondas y buena técnica.',
        'El Guardián de Hierro custodia la puerta. Solo quien levanta su propio límite puede cruzarla.',
        ['10 hip thrust con 70 kg', '10 press de banca con 25 kg', '10 peso muerto con 50 kg', '10 remo sentada con 20 kg', 'Plancha de 45 segundos'],
      ), game(
        'El Laberinto de los Faroles',
        'Un laberinto de piedra guarda el último farol de la noche. Solo quien no se pierde llega a la luz.',
        'Atraviesa los dos laberintos hasta el farol rojo.',
        [
          { type: 'maze', title: 'Laberinto pequeño', cols: 7, rows: 9, seed: 5 },
          { type: 'maze', title: 'Laberinto grande', cols: 10, rows: 14, seed: 12 },
        ],
      ),
    ],
  },
  {
    id: 3,
    title: 'La Biblioteca de Jade',
    story: 'Los sabios del reino hacen preguntas que solo una mente ágil responde.',
    gift: GIFT_PENDING,
    tasks: [T7, physical(
        'El Ritmo de Jade',
        'Un esfuerzo continuo y parejo: se cuenta el tiempo del reloj.',
        'Los sabios enseñan que el verdadero ritmo no es el más rápido, sino el que puedes sostener.',
        ['10 minutos de trote suave de calentamiento', '5 km en 27 minutos o menos', '5 minutos de trote suave para volver a la calma'],
      ), T9],
  },
  {
    id: 4,
    title: 'Velocista Renacida',
    story: 'La pista antigua vuelve a encenderse. Los espíritus de las velocistas esperan a que Piyi recuerde cómo vuela.',
    gift: GIFT_PENDING,
    tasks: [T10, physical(
        'Velocista Renacida',
        'Sprints al 90%, volviendo caminando para recuperarte por completo entre cada uno.',
        'La pista antigua vuelve a encenderse. Los espíritus de las velocistas esperan a que Piyi recuerde cómo vuela.',
        ['10 minutos de trote y movilidad de calentamiento', '3 salidas de 30 m, como en una largada', '6 sprints de 100 m', '5 minutos de trote suave para volver a la calma'],
      ), T12],
  },
  {
    id: 5,
    title: 'El Pergamino en Chino',
    story: 'Un pergamino sellado habla en la lengua de los ancestros. Hay que escucharlo con atención.',
    gift: { name: 'Zapatillas Cloud 6 ON' },
    tasks: [T13, physical(
        'La Ruta de los Faroles',
        'Tu salida larga de la semana, a ritmo conversacional: tienes que poder hablar mientras corres.',
        'Un camino de farolillos rojos se pierde en el horizonte. Hoy se recorre sin prisa, pero sin parar.',
        ['12 km a ritmo suave, sin mirar el reloj más de lo necesario'],
      ), T15],
  },
  {
    id: 6,
    title: 'El Festín Oculto',
    story: 'El banquete del reino está escondido entre las letras. Solo quien encuentra cada plato puede sentarse a la mesa.',
    gift: GIFT_PENDING,
    tasks: [T16, physical(
        'Fuerza de Piernas',
        'La última sesión pesada antes de la carrera. En la Speediance, 3 rondas con 90 segundos de descanso entre rondas.',
        'El Guardián de Hierro vuelve a la puerta. Esta vez las piernas son su armadura.',
        ['10 sentadillas con 30 kg', '10 hip thrust con 70 kg', '12 zancadas, 6 por pierna, con 10 kg', '10 peso muerto rumano con 40 kg', 'Plancha lateral de 30 segundos por lado'],
      ), T18],
  },
  {
    id: 7,
    title: 'Los Objetos Faltantes',
    story: 'Alguien se llevó objetos del santuario. La heroína debe descubrir qué falta.',
    gift: GIFT_PENDING,
    tasks: [T19, physical(
        'Ensayo General',
        'Controla el ritmo: que los tres kilómetros salgan casi iguales.',
        'Falta una semana para la gran carrera. El reino ensaya contigo, kilómetro a kilómetro.',
        ['10 minutos de trote suave de calentamiento', '3 repeticiones de 1 km a 5:25 por km (tu ritmo de carrera), con 2 minutos de trote entre cada una', '5 minutos de trote suave para volver a la calma'],
      ), T21],
  },
  {
    id: 8,
    title: 'El Camino Silencioso',
    story: 'Antes de la gran batalla, la heroína afina cuerpo y espíritu. Hoy no se fuerza: se prepara.',
    gift: GIFT_PENDING,
    tasks: [T22, physical(
        'Afinando la Máquina',
        'Que las piernas se sientan ligeras, nunca cansadas.',
        'Antes de la gran batalla, la heroína afina cuerpo y espíritu. Hoy no se fuerza: se prepara.',
        ['4 km de trote suave', '6 aceleraciones relajadas de 80 m, caminando de vuelta'],
      ), T24],
  },
  {
    id: 9,
    title: 'La Víspera',
    story: 'Mañana es la gran carrera. Esta noche, el reino entero se prepara contigo.',
    gift: { name: 'Polera Train-T Running ON' },
    tasks: [T25, physical(
        'El Ritual de la Víspera',
        'Hoy se descansa casi todo: tu misión es llegar fresca a mañana.',
        'Mañana es la gran carrera. Esta noche, el reino entero se prepara contigo.',
        ['2 km de trote muy suave', '10 minutos de movilidad', 'Deja lista tu ropa, tu número y tu desayuno para mañana'],
      ), T27],
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
      T29,
      T30,
    ],
  },
];

export const TASKS = CHESTS.flatMap((chest) =>
  chest.tasks.map((task, idx) => ({ ...task, n: (chest.id - 1) * 3 + idx + 1, chestId: chest.id, idx })),
);
