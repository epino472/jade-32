// Contenido de las 10 misiones. Los puzles marcados "borrador" son de prueba
// y se reemplazan por los definitivos (con fotos de ustedes) más adelante.
export const MISSIONS = [
  {
    id: 1,
    type: 'I',
    title: 'El Despertar',
    date: '2026-11-01',
    story:
      'Un viento de jade recorre el reino. Una heroína dormida abre los ojos: es Piyi, y hoy comienza su camino hacia el Nivel 32. Antes de entrenar el cuerpo, hay que despertar la mente.',
    objective: 'Supera las pruebas del tutorial.',
    puzzles: [
      {
        type: 'quiz',
        title: 'Calentamiento (borrador)',
        questions: [
          { q: '¿Cuántos kilómetros tiene una carrera de 10K?', options: ['5', '10', '21', '42'], answer: 1 },
          { q: '¿Qué plato español lleva arroz, azafrán y mariscos?', options: ['Paella', 'Gazpacho', 'Tortilla', 'Fabada'], answer: 0 },
        ],
      },
    ],
  },
  {
    id: 2,
    type: 'F',
    title: 'Prueba de Fuerza',
    date: '2026-11-02',
    story: 'El Guardián de Hierro custodia la primera puerta. Solo quien levanta su propio límite puede cruzarla.',
    objective: 'Sesión de pesas o Speediance exigente (borrador: Esteban define el reto exacto).',
  },
  {
    id: 3,
    type: 'I',
    title: 'La Trivia del Reino',
    date: '2026-11-04',
    story: 'En la Biblioteca de Jade, los sabios hacen preguntas que solo una mente ágil responde.',
    objective: 'Responde todo correctamente.',
    puzzles: [
      {
        type: 'quiz',
        title: 'Trivia (borrador)',
        questions: [
          { q: '¿De qué país es originario el sushi?', options: ['China', 'Corea', 'Japón', 'Tailandia'], answer: 2 },
          { q: '¿Cuál es la capital de España?', options: ['Barcelona', 'Madrid', 'Sevilla', 'Valencia'], answer: 1 },
        ],
      },
    ],
  },
  {
    id: 4,
    type: 'F',
    title: 'Velocista Renacida',
    date: '2026-11-06',
    story: 'La pista antigua vuelve a encenderse. Los espíritus de las velocistas esperan a que Piyi recuerde cómo vuela.',
    objective: 'Sprints o HIIT (borrador: Esteban define el reto exacto). Última sesión intensa antes de la carrera.',
  },
  {
    id: 5,
    type: 'I',
    title: 'El Pergamino en Chino',
    date: '2026-11-08',
    story: 'Un pergamino sellado habla en la lengua de los ancestros. Hay que escucharlo con atención.',
    objective: 'Escucha y descifra.',
    puzzles: [
      {
        type: 'listen',
        title: 'Escucha (borrador)',
        q: '¿Qué significa lo que escuchas?',
        speak: '你好',
        pinyin: 'nǐ hǎo',
        options: ['Gracias', 'Hola', 'Adiós', 'Delicioso'],
        answer: 1,
      },
    ],
  },
  {
    id: 6,
    type: 'I',
    title: 'El Festín Oculto',
    date: '2026-11-10',
    story: 'El banquete del reino está escondido entre las letras. Solo quien encuentra cada plato puede sentarse a la mesa.',
    objective: 'Encuentra todos los platos.',
    puzzles: [
      {
        type: 'wordsearch',
        title: 'Sopa de letras (borrador)',
        seed: 32,
        size: 11,
        words: ['Paella', 'Ramen', 'Sushi', 'Tortilla', 'Dim sum', 'Gambas', 'Jamón', 'Wonton'],
      },
    ],
  },
  {
    id: 7,
    type: 'F',
    title: 'Ritual de Afinamiento',
    date: '2026-11-12',
    story: 'Antes de la gran batalla, la heroína afina cuerpo y espíritu. Hoy no se fuerza: se prepara.',
    objective: 'Movilidad y activación suave de ~20 min, sin carga (3 días antes de la carrera).',
  },
  {
    id: 8,
    type: 'I',
    title: 'Los Objetos Faltantes',
    date: '2026-11-14',
    story: 'Alguien se llevó objetos del santuario. La heroína debe descubrir qué falta antes de la gran carrera.',
    objective: 'Encuentra lo que falta (borrador: se reemplaza con fotos reales).',
    puzzles: [
      {
        type: 'riddle',
        title: 'Acertijo (borrador)',
        prompt: 'Tengo agujas pero no pincho, tengo números pero no cuento. ¿Qué soy?',
        answers: ['reloj', 'un reloj'],
        hint: 'Marca la hora.',
      },
    ],
  },
  {
    id: 9,
    type: 'F',
    title: 'La Gran Carrera',
    date: '2026-11-15',
    story: 'Llegó el día. Diez kilómetros separan a la Velocista de Jade de la gloria. El reino entero la espera en la meta.',
    objective: 'Correr el 10K. Foto en la meta o con la medalla.',
  },
  {
    id: 10,
    type: 'F',
    title: 'El Jefe Final',
    date: '2026-11-17',
    story: 'El último guardián custodia el tesoro del Nivel 32. Solo una heroína completa puede vencerlo.',
    objective: 'Crucigrama final y desafío ligero (borrador).',
    puzzles: [
      {
        type: 'riddle',
        title: 'Acertijo final (borrador)',
        prompt: '¿Qué número tiene Piyi este año? (en cifras)',
        answers: ['32', 'treinta y dos'],
      },
    ],
  },
];

export const TYPE_LABEL = { F: 'FÍSICA', I: 'INTELECTUAL' };
