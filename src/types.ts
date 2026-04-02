export type Topic = 'algebra' | 'geometry' | 'calculus' | 'arithmetic' | 'statistics' | 'trigonometry' | 'numbers';
export type CourseLevel = 
  | '1º Primaria' | '2º Primaria' | '3º Primaria' | '4º Primaria' | '5º Primaria' | '6º Primaria'
  | '1º ESO' | '2º ESO' | '3º ESO' | '4º ESO'
  | '1º Bachillerato' | '2º Bachillerato';

export interface Exercise {
  id: string;
  question: string; // LaTeX or mixed
  options?: string[]; // LaTeX
  correctAnswer: string;
  explanation: string; // LaTeX or mixed
  type: 'multiple-choice' | 'numeric';
}

export interface TopicData {
  id: string;
  courseLevel: CourseLevel;
  title: string;
  description: string;
  icon: string;
  exercises: Exercise[];
}

export const MATH_DATA: TopicData[] = [
  // 1º Primaria
  {
    id: 'pri-1-sumas',
    courseLevel: '1º Primaria',
    title: 'Sumas Sencillas',
    description: 'Aprende a sumar números del 1 al 10.',
    icon: 'Calculator',
    exercises: [
      {
        id: 'p1-1',
        question: '¿Cuánto es $2 + 3$?',
        correctAnswer: '5',
        explanation: 'Si tienes 2 manzanas y te dan 3 más, ahora tienes 5.',
        type: 'numeric'
      },
      {
        id: 'p1-2',
        question: '¿Cuánto es $4 + 4$?',
        correctAnswer: '8',
        explanation: 'Cuatro más cuatro es igual a ocho.',
        type: 'numeric'
      },
      {
        id: 'p1-3',
        question: '¿Cuánto es $7 + 2$?',
        correctAnswer: '9',
        explanation: 'Siete más dos es igual a nueve.',
        type: 'numeric'
      }
    ]
  },
  {
    id: 'pri-1-restas',
    courseLevel: '1º Primaria',
    title: 'Restas Sencillas',
    description: 'Aprende a restar números del 1 al 10.',
    icon: 'Calculator',
    exercises: [
      {
        id: 'p1-r1',
        question: '¿Cuánto es $5 - 2$?',
        correctAnswer: '3',
        explanation: 'Si tienes 5 caramelos y te comes 2, te quedan 3.',
        type: 'numeric'
      },
      {
        id: 'p1-r2',
        question: '¿Cuánto es $8 - 4$?',
        correctAnswer: '4',
        explanation: 'Ocho menos cuatro es igual a cuatro.',
        type: 'numeric'
      },
      {
        id: 'p1-r3',
        question: '¿Cuánto es $10 - 1$?',
        correctAnswer: '9',
        explanation: 'Diez menos uno es igual a nueve.',
        type: 'numeric'
      }
    ]
  },

  // 2º Primaria
  {
    id: 'pri-2-restas',
    courseLevel: '2º Primaria',
    title: 'Restas con Llevada',
    description: 'Practica restas un poco más difíciles.',
    icon: 'Calculator',
    exercises: [
      {
        id: 'p2-1',
        question: '¿Cuánto es $15 - 7$?',
        correctAnswer: '8',
        explanation: 'A 15 le quitamos 7 y nos quedan 8.',
        type: 'numeric'
      },
      {
        id: 'p2-2',
        question: '¿Cuánto es $23 - 8$?',
        correctAnswer: '15',
        explanation: 'A 23 le quitamos 8 y nos quedan 15.',
        type: 'numeric'
      },
      {
        id: 'p2-3',
        question: '¿Cuánto es $31 - 14$?',
        correctAnswer: '17',
        explanation: 'A 31 le quitamos 14 y nos quedan 17.',
        type: 'numeric'
      }
    ]
  },
  {
    id: 'pri-2-mult',
    courseLevel: '2º Primaria',
    title: 'Introducción a la Multiplicación',
    description: 'Sumas repetidas y concepto de multiplicar.',
    icon: 'Calculator',
    exercises: [
      {
        id: 'p2-m1',
        question: '¿Cuánto es $2 \\times 3$?',
        options: ['4', '5', '6', '7'],
        correctAnswer: '6',
        explanation: 'Dos veces tres es igual a seis: $3 + 3 = 6$.',
        type: 'multiple-choice'
      },
      {
        id: 'p2-m2',
        question: '¿Cuánto es $4 \\times 2$?',
        correctAnswer: '8',
        explanation: 'Cuatro veces dos es igual a ocho: $2 + 2 + 2 + 2 = 8$.',
        type: 'numeric'
      },
      {
        id: 'p2-m3',
        question: '¿Cuánto es $5 \\times 1$?',
        correctAnswer: '5',
        explanation: 'Cualquier número multiplicado por uno es el mismo número.',
        type: 'numeric'
      }
    ]
  },

  // 3º Primaria
  {
    id: 'pri-3-mult',
    courseLevel: '3º Primaria',
    title: 'Tablas de Multiplicar',
    description: 'Domina las tablas del 2 al 9.',
    icon: 'Calculator',
    exercises: [
      {
        id: 'p3-1',
        question: '¿Cuánto es $3 \\times 4$?',
        options: ['7', '10', '12', '15'],
        correctAnswer: '12',
        explanation: 'Tres veces cuatro es doce: $3 + 3 + 3 + 3 = 12$.',
        type: 'multiple-choice'
      },
      {
        id: 'p3-2',
        question: '¿Cuánto es $6 \\times 7$?',
        correctAnswer: '42',
        explanation: 'Seis veces siete es cuarenta y dos.',
        type: 'numeric'
      },
      {
        id: 'p3-3',
        question: '¿Cuánto es $8 \\times 9$?',
        options: ['72', '81', '64', '56'],
        correctAnswer: '72',
        explanation: 'Ocho veces nueve es setenta y dos.',
        type: 'multiple-choice'
      }
    ]
  },
  {
    id: 'pri-3-div',
    courseLevel: '3º Primaria',
    title: 'Divisiones Exactas',
    description: 'Aprende a repartir en partes iguales sin que sobre nada.',
    icon: 'Calculator',
    exercises: [
      {
        id: 'p3-d1',
        question: 'Divide $15$ entre $3$.',
        correctAnswer: '5',
        explanation: '$15 / 3 = 5$, porque $5 \\times 3 = 15$.',
        type: 'numeric'
      },
      {
        id: 'p3-d2',
        question: 'Divide $24$ entre $6$.',
        correctAnswer: '4',
        explanation: '$24 / 6 = 4$, porque $4 \\times 6 = 24$.',
        type: 'numeric'
      },
      {
        id: 'p3-d3',
        question: 'Divide $45$ entre $9$.',
        correctAnswer: '5',
        explanation: '$45 / 9 = 5$, porque $5 \\times 9 = 45$.',
        type: 'numeric'
      }
    ]
  },

  // 4º Primaria
  {
    id: 'pri-4-div',
    courseLevel: '4º Primaria',
    title: 'Divisiones con Resto',
    description: 'Aprende a dividir cuando no es exacto.',
    icon: 'Calculator',
    exercises: [
      {
        id: 'p4-1',
        question: 'Si divides $14$ entre $3$, ¿cuál es el cociente?',
        correctAnswer: '4',
        explanation: '$14 / 3 = 4$ y sobran $2$. El cociente es 4.',
        type: 'numeric'
      },
      {
        id: 'p4-2',
        question: 'Si divides $20$ entre $6$, ¿cuál es el resto?',
        correctAnswer: '2',
        explanation: '$20 / 6 = 3$ y sobran $2$. El resto es 2.',
        type: 'numeric'
      },
      {
        id: 'p4-3',
        question: 'Si divides $35$ entre $8$, ¿cuál es el cociente?',
        correctAnswer: '4',
        explanation: '$35 / 8 = 4$ y sobran $3$. El cociente es 4.',
        type: 'numeric'
      }
    ]
  },
  {
    id: 'pri-4-frac',
    courseLevel: '4º Primaria',
    title: 'Fracciones Básicas',
    description: 'Introducción a las fracciones y sus partes.',
    icon: 'Variable',
    exercises: [
      {
        id: 'p4-f1',
        question: '¿Cuál es el numerador en la fracción $\\frac{3}{5}$?',
        correctAnswer: '3',
        explanation: 'El numerador es el número de arriba de la fracción.',
        type: 'numeric'
      },
      {
        id: 'p4-f2',
        question: '¿Cuál es el denominador en la fracción $\\frac{4}{7}$?',
        correctAnswer: '7',
        explanation: 'El denominador es el número de abajo de la fracción.',
        type: 'numeric'
      },
      {
        id: 'p4-f3',
        question: '¿Qué fracción representa la mitad?',
        options: ['$\\frac{1}{3}$', '$\\frac{1}{2}$', '$\\frac{2}{3}$', '$\\frac{1}{4}$'],
        correctAnswer: '$\\frac{1}{2}$',
        explanation: 'La mitad se representa dividiendo la unidad en dos partes iguales.',
        type: 'multiple-choice'
      }
    ]
  },

  // 5º Primaria
  {
    id: 'pri-5-dec',
    courseLevel: '5º Primaria',
    title: 'Números Decimales',
    description: 'Trabaja con décimas y centésimas.',
    icon: 'Calculator',
    exercises: [
      {
        id: 'p5-1',
        question: '¿Cuánto es $0.5 + 0.2$?',
        correctAnswer: '0.7',
        explanation: 'Sumamos las décimas: $5 + 2 = 7$.',
        type: 'numeric'
      },
      {
        id: 'p5-2',
        question: '¿Cuánto es $1.4 - 0.3$?',
        correctAnswer: '1.1',
        explanation: 'Restamos las décimas: $4 - 3 = 1$. El resultado es $1.1$.',
        type: 'numeric'
      },
      {
        id: 'p5-3',
        question: '¿Cuánto es $0.25 + 0.50$?',
        correctAnswer: '0.75',
        explanation: 'Sumamos las centésimas: $25 + 50 = 75$.',
        type: 'numeric'
      }
    ]
  },
  {
    id: 'pri-5-geom',
    courseLevel: '5º Primaria',
    title: 'Áreas y Perímetros',
    description: 'Calcula el contorno y la superficie de figuras simples.',
    icon: 'Triangle',
    exercises: [
      {
        id: 'p5-g1',
        question: '¿Cuál es el perímetro de un cuadrado de lado $4$ cm?',
        correctAnswer: '16',
        explanation: 'El perímetro es la suma de los lados: $4 + 4 + 4 + 4 = 16$.',
        type: 'numeric'
      },
      {
        id: 'p5-g2',
        question: '¿Cuál es el área de un rectángulo de base $5$ y altura $3$?',
        correctAnswer: '15',
        explanation: 'El área es base por altura: $5 \\times 3 = 15$.',
        type: 'numeric'
      },
      {
        id: 'p5-g3',
        question: '¿Cuál es el perímetro de un triángulo equilátero de lado $6$?',
        correctAnswer: '18',
        explanation: 'Un triángulo equilátero tiene 3 lados iguales: $6 \\times 3 = 18$.',
        type: 'numeric'
      }
    ]
  },

  // 6º Primaria
  {
    id: 'pri-6-frac',
    courseLevel: '6º Primaria',
    title: 'Operaciones con Fracciones',
    description: 'Suma, resta y simplificación de fracciones.',
    icon: 'Variable',
    exercises: [
      {
        id: 'p6-1',
        question: '¿Qué fracción es mayor: $\\frac{1}{2}$ o $\\frac{1}{4}$?',
        options: ['$\\frac{1}{2}$', '$\\frac{1}{4}$', 'Son iguales'],
        correctAnswer: '$\\frac{1}{2}$',
        explanation: 'Dividir algo en 2 partes da trozos más grandes que dividirlo en 4.',
        type: 'multiple-choice'
      },
      {
        id: 'p6-2',
        question: 'Suma $\\frac{1}{4} + \\frac{2}{4}$.',
        options: ['$\\frac{3}{8}$', '$\\frac{3}{4}$', '$\\frac{2}{16}$', '$\\frac{1}{2}$'],
        correctAnswer: '$\\frac{3}{4}$',
        explanation: 'Como tienen el mismo denominador, sumamos los numeradores: $1 + 2 = 3$.',
        type: 'multiple-choice'
      },
      {
        id: 'p6-3',
        question: 'Simplifica la fracción $\\frac{4}{8}$.',
        options: ['$\\frac{1}{4}$', '$\\frac{2}{3}$', '$\\frac{1}{2}$', '$\\frac{4}{4}$'],
        correctAnswer: '$\\frac{1}{2}$',
        explanation: 'Dividimos numerador y denominador entre 4.',
        type: 'multiple-choice'
      }
    ]
  },
  {
    id: 'pri-6-porc',
    courseLevel: '6º Primaria',
    title: 'Porcentajes',
    description: 'Entiende y calcula porcentajes básicos.',
    icon: 'Activity',
    exercises: [
      {
        id: 'p6-p1',
        question: '¿Cuánto es el $50\\%$ de $80$?',
        correctAnswer: '40',
        explanation: 'El $50\\%$ es la mitad. La mitad de $80$ es $40$.',
        type: 'numeric'
      },
      {
        id: 'p6-p2',
        question: '¿Cuánto es el $25\\%$ de $100$?',
        correctAnswer: '25',
        explanation: 'El $25\\%$ es la cuarta parte. $100 / 4 = 25$.',
        type: 'numeric'
      },
      {
        id: 'p6-p3',
        question: 'Si un juguete cuesta $20$ y tiene un $10\\%$ de descuento, ¿cuánto es el descuento?',
        correctAnswer: '2',
        explanation: 'El $10\\%$ de $20$ es $20 / 10 = 2$.',
        type: 'numeric'
      }
    ]
  },

  // 1º ESO
  {
    id: 'alg-eso-1',
    courseLevel: '1º ESO',
    title: 'Ecuaciones de Primer Grado',
    description: 'Fundamentos de álgebra y despeje de incógnitas.',
    icon: 'Variable',
    exercises: [
      {
        id: 'alg-1',
        question: 'Resuelve para $x$: $2x + 5 = 13$',
        correctAnswer: '4',
        explanation: 'Restamos 5 de ambos lados: $2x = 8$. Luego dividimos por 2: $x = 4$.',
        type: 'numeric'
      },
      {
        id: 'alg-2',
        question: 'Resuelve para $x$: $3x - 4 = 11$',
        correctAnswer: '5',
        explanation: 'Sumamos 4 a ambos lados: $3x = 15$. Dividimos por 3: $x = 5$.',
        type: 'numeric'
      },
      {
        id: 'alg-3',
        question: 'Resuelve para $x$: $5x = 2x + 12$',
        correctAnswer: '4',
        explanation: 'Restamos $2x$ a ambos lados: $3x = 12$. Dividimos por 3: $x = 4$.',
        type: 'numeric'
      }
    ]
  },
  {
    id: 'num-eso-1',
    courseLevel: '1º ESO',
    title: 'Números Enteros',
    description: 'Operaciones con números positivos y negativos.',
    icon: 'Calculator',
    exercises: [
      {
        id: 'num-1',
        question: '¿Cuánto es $-5 + 8$?',
        correctAnswer: '3',
        explanation: 'Avanzamos 8 posiciones desde el -5 en la recta numérica.',
        type: 'numeric'
      },
      {
        id: 'num-2',
        question: '¿Cuánto es $-3 - 4$?',
        correctAnswer: '-7',
        explanation: 'Retrocedemos 4 posiciones desde el -3.',
        type: 'numeric'
      },
      {
        id: 'num-3',
        question: '¿Cuánto es $(-2) \\times (-5)$?',
        correctAnswer: '10',
        explanation: 'Menos por menos es más. $2 \\times 5 = 10$.',
        type: 'numeric'
      }
    ]
  },

  // 2º ESO
  {
    id: 'geo-eso-2',
    courseLevel: '2º ESO',
    title: 'Teorema de Pitágoras',
    description: 'Relación entre los lados de un triángulo rectángulo.',
    icon: 'Triangle',
    exercises: [
      {
        id: 'pit-1',
        question: 'En un triángulo rectángulo con catetos $3$ y $4$, ¿cuánto mide la hipotenusa?',
        correctAnswer: '5',
        explanation: '$a^2 + b^2 = c^2 \\implies 3^2 + 4^2 = 9 + 16 = 25$. La raíz de 25 es 5.',
        type: 'numeric'
      },
      {
        id: 'pit-2',
        question: 'Si la hipotenusa mide $10$ y un cateto mide $6$, ¿cuánto mide el otro cateto?',
        correctAnswer: '8',
        explanation: '$c^2 - a^2 = b^2 \\implies 100 - 36 = 64$. La raíz de 64 es 8.',
        type: 'numeric'
      },
      {
        id: 'pit-3',
        question: 'En un triángulo rectángulo con catetos $5$ y $12$, ¿cuánto mide la hipotenusa?',
        correctAnswer: '13',
        explanation: '$25 + 144 = 169$. La raíz de 169 es 13.',
        type: 'numeric'
      }
    ]
  },
  {
    id: 'alg-eso-2',
    courseLevel: '2º ESO',
    title: 'Sistemas de Ecuaciones',
    description: 'Resolución de sistemas de dos ecuaciones lineales.',
    icon: 'Variable',
    exercises: [
      {
        id: 'sis-1',
        question: 'Si $x + y = 10$ y $x - y = 2$, ¿cuánto vale $x$?',
        correctAnswer: '6',
        explanation: 'Sumando ambas ecuaciones: $2x = 12 \\implies x = 6$.',
        type: 'numeric'
      },
      {
        id: 'sis-2',
        question: 'Si $x + y = 10$ y $x - y = 2$, ¿cuánto vale $y$?',
        correctAnswer: '4',
        explanation: 'Si $x = 6$, entonces $6 + y = 10 \\implies y = 4$.',
        type: 'numeric'
      },
      {
        id: 'sis-3',
        question: 'Si $2x + y = 7$ y $y = 3$, ¿cuánto vale $x$?',
        correctAnswer: '2',
        explanation: 'Sustituyendo $y$: $2x + 3 = 7 \\implies 2x = 4 \\implies x = 2$.',
        type: 'numeric'
      }
    ]
  },

  // 3º ESO
  {
    id: 'stat-eso-3',
    courseLevel: '3º ESO',
    title: 'Estadística',
    description: 'Media, mediana y moda.',
    icon: 'Activity',
    exercises: [
      {
        id: 'stat-1',
        question: '¿Cuál es la media de $2$, $4$ y $6$?',
        correctAnswer: '4',
        explanation: '$(2 + 4 + 6) / 3 = 12 / 3 = 4$.',
        type: 'numeric'
      },
      {
        id: 'stat-2',
        question: '¿Cuál es la moda de los datos: $1, 2, 2, 3, 4$?',
        correctAnswer: '2',
        explanation: 'La moda es el valor que más se repite, que es el 2.',
        type: 'numeric'
      },
      {
        id: 'stat-3',
        question: '¿Cuál es la mediana de los datos ordenados: $3, 5, 7, 9, 11$?',
        correctAnswer: '7',
        explanation: 'La mediana es el valor central en un conjunto ordenado.',
        type: 'numeric'
      }
    ]
  },
  {
    id: 'prog-eso-3',
    courseLevel: '3º ESO',
    title: 'Progresiones',
    description: 'Sucesiones aritméticas y geométricas.',
    icon: 'Activity',
    exercises: [
      {
        id: 'prog-1',
        question: 'En la progresión aritmética $2, 5, 8, 11...$, ¿cuál es la diferencia?',
        correctAnswer: '3',
        explanation: 'Cada término se obtiene sumando 3 al anterior.',
        type: 'numeric'
      },
      {
        id: 'prog-2',
        question: 'En la progresión geométrica $3, 6, 12, 24...$, ¿cuál es la razón?',
        correctAnswer: '2',
        explanation: 'Cada término se obtiene multiplicando por 2 el anterior.',
        type: 'numeric'
      },
      {
        id: 'prog-3',
        question: '¿Cuál es el siguiente término de la sucesión $1, 4, 9, 16...$?',
        correctAnswer: '25',
        explanation: 'Son los cuadrados perfectos: $1^2, 2^2, 3^2, 4^2$. El siguiente es $5^2 = 25$.',
        type: 'numeric'
      }
    ]
  },

  // 4º ESO
  {
    id: 'func-eso-4',
    courseLevel: '4º ESO',
    title: 'Funciones',
    description: 'Representación y análisis de funciones.',
    icon: 'Activity',
    exercises: [
      {
        id: 'func-1',
        question: '¿Cuál es la pendiente de $y = 2x + 1$?',
        correctAnswer: '2',
        explanation: 'En $y = mx + n$, $m$ es la pendiente.',
        type: 'numeric'
      },
      {
        id: 'func-2',
        question: '¿En qué punto corta al eje Y la función $y = 3x - 4$?',
        correctAnswer: '-4',
        explanation: 'El corte con el eje Y es el valor de $n$ (ordenada en el origen).',
        type: 'numeric'
      },
      {
        id: 'func-3',
        question: '¿Cuál es el vértice de la parábola $y = x^2$?',
        options: ['(0,0)', '(1,1)', '(0,1)', '(-1,1)'],
        correctAnswer: '(0,0)',
        explanation: 'La parábola básica $y = x^2$ tiene su vértice en el origen de coordenadas.',
        type: 'multiple-choice'
      }
    ]
  },
  {
    id: 'trig-eso-4',
    courseLevel: '4º ESO',
    title: 'Trigonometría Básica',
    description: 'Seno, coseno y tangente en triángulos rectángulos.',
    icon: 'Triangle',
    exercises: [
      {
        id: 'trig-b1',
        question: 'En un triángulo rectángulo, ¿qué es el seno de un ángulo?',
        options: ['Cateto opuesto / Hipotenusa', 'Cateto contiguo / Hipotenusa', 'Cateto opuesto / Cateto contiguo'],
        correctAnswer: 'Cateto opuesto / Hipotenusa',
        explanation: 'El seno se define como la razón entre el cateto opuesto y la hipotenusa.',
        type: 'multiple-choice'
      },
      {
        id: 'trig-b2',
        question: '¿Cuál es la tangente de un ángulo de $45^\\circ$?',
        correctAnswer: '1',
        explanation: 'En un triángulo rectángulo isósceles, los catetos son iguales, por lo que su cociente es 1.',
        type: 'numeric'
      },
      {
        id: 'trig-b3',
        question: 'Si $\\sin(x) = 0.5$ y el ángulo es agudo, ¿cuántos grados mide $x$?',
        options: ['30', '45', '60', '90'],
        correctAnswer: '30',
        explanation: 'El seno de $30^\\circ$ es $0.5$.',
        type: 'multiple-choice'
      }
    ]
  },

  // 1º Bachillerato
  {
    id: 'trig-bach-1',
    courseLevel: '1º Bachillerato',
    title: 'Trigonometría I',
    description: 'Identidades y funciones trigonométricas.',
    icon: 'Activity',
    exercises: [
      {
        id: 'trig-1',
        question: '¿Cuál es el valor de $\\sin^2(x) + \\cos^2(x)$?',
        options: ['0', '1', '2', '\\tan(x)'],
        correctAnswer: '1',
        explanation: 'Esta es la identidad fundamental de la trigonometría: $\\sin^2(x) + \\cos^2(x) = 1$.',
        type: 'multiple-choice'
      },
      {
        id: 'trig-2',
        question: '¿A qué es igual $\\tan(x)$?',
        options: ['$\\sin(x) / \\cos(x)$', '$\\cos(x) / \\sin(x)$', '$1 / \\sin(x)$', '$1 / \\cos(x)$'],
        correctAnswer: '$\\sin(x) / \\cos(x)$',
        explanation: 'La tangente es el cociente entre el seno y el coseno.',
        type: 'multiple-choice'
      },
      {
        id: 'trig-3',
        question: '¿Cuál es el periodo de la función $y = \\sin(x)$?',
        options: ['$\\pi$', '$2\\pi$', '$\\pi/2$', '$4\\pi$'],
        correctAnswer: '$2\\pi$',
        explanation: 'La función seno se repite cada $2\\pi$ radianes.',
        type: 'multiple-choice'
      }
    ]
  },
  {
    id: 'lim-bach-1',
    courseLevel: '1º Bachillerato',
    title: 'Límites y Continuidad',
    description: 'Concepto de límite y cálculo básico.',
    icon: 'Activity',
    exercises: [
      {
        id: 'lim-1',
        question: '¿Cuál es el límite de $x^2$ cuando $x$ tiende a $3$?',
        correctAnswer: '9',
        explanation: 'Sustituimos $x$ por $3$: $3^2 = 9$.',
        type: 'numeric'
      },
      {
        id: 'lim-2',
        question: '¿Cuál es el límite de $1/x$ cuando $x$ tiende a infinito?',
        correctAnswer: '0',
        explanation: 'Al dividir 1 entre un número cada vez más grande, el resultado se acerca a 0.',
        type: 'numeric'
      },
      {
        id: 'lim-3',
        question: 'Calcula el límite de $(2x^2 + 1) / (x^2 - 3)$ cuando $x$ tiende a infinito.',
        options: ['0', '1', '2', 'Infinito'],
        correctAnswer: '2',
        explanation: 'Al tener el mismo grado, el límite es el cociente de los coeficientes principales: $2 / 1 = 2$.',
        type: 'multiple-choice'
      }
    ]
  },

  // 2º Bachillerato
  {
    id: 'calc-bach-2',
    courseLevel: '2º Bachillerato',
    title: 'Derivadas e Integrales',
    description: 'Cálculo diferencial e integral avanzado.',
    icon: 'Activity',
    exercises: [
      {
        id: 'calc-1',
        question: 'Deriva la función $f(x) = x^3 + 2x$.',
        options: ['$3x^2 + 2$', '$x^2 + 2$', '$3x^2$', '$3x + 2$'],
        correctAnswer: '$3x^2 + 2$',
        explanation: 'Usando la regla de la potencia: $\\frac{d}{dx}(x^n) = nx^{n-1}$. Por tanto, $(x^3)\' = 3x^2$ y $(2x)\' = 2$.',
        type: 'multiple-choice'
      },
      {
        id: 'calc-2',
        question: '¿Cuál es la derivada de $e^x$?',
        options: ['$e^x$', '$x e^{x-1}$', '$e^{x+1}$', '$1/x$'],
        correctAnswer: '$e^x$',
        explanation: 'La función exponencial $e^x$ es su propia derivada.',
        type: 'multiple-choice'
      },
      {
        id: 'calc-3',
        question: '¿Cuál es la integral indefinida de $2x$?',
        options: ['$x^2 + C$', '$2x^2 + C$', '$x + C$', '$2 + C$'],
        correctAnswer: '$x^2 + C$',
        explanation: 'La integral de $x^n$ es $\\frac{x^{n+1}}{n+1}$. Así, $\\int 2x dx = 2 \\frac{x^2}{2} + C = x^2 + C$.',
        type: 'multiple-choice'
      }
    ]
  },
  {
    id: 'mat-bach-2',
    courseLevel: '2º Bachillerato',
    title: 'Matrices y Determinantes',
    description: 'Álgebra lineal y resolución de sistemas.',
    icon: 'LayoutGrid',
    exercises: [
      {
        id: 'mat-1',
        question: '¿Cuál es el determinante de la matriz identidad $I$ de orden 3?',
        correctAnswer: '1',
        explanation: 'El determinante de cualquier matriz identidad es siempre 1.',
        type: 'numeric'
      },
      {
        id: 'mat-2',
        question: 'Si multiplicas una matriz $A$ de $2 \\times 3$ por una matriz $B$ de $3 \\times 4$, ¿cuál es la dimensión de la matriz resultante?',
        options: ['$2 \\times 4$', '$3 \\times 3$', '$4 \\times 2$', 'No se pueden multiplicar'],
        correctAnswer: '$2 \\times 4$',
        explanation: 'El número de filas de la resultante es el de $A$ y el de columnas es el de $B$.',
        type: 'multiple-choice'
      },
      {
        id: 'mat-3',
        question: '¿Cómo se llama una matriz cuadrada cuyo determinante es cero?',
        options: ['Singular', 'Regular', 'Inversa', 'Traspuesta'],
        correctAnswer: 'Singular',
        explanation: 'Una matriz con determinante cero no tiene inversa y se llama singular.',
        type: 'multiple-choice'
      }
    ]
  },
  // --- NUEVO CONTENIDO AÑADIDO ---
  // 1º Primaria
  {
    id: 'pri-1-geom',
    courseLevel: '1º Primaria',
    title: 'Formas Geométricas',
    description: 'Aprende a reconocer círculos, cuadrados y triángulos.',
    icon: 'Triangle',
    exercises: [
      {
        id: 'p1-g1',
        question: '¿Cuántos lados tiene un triángulo?',
        correctAnswer: '3',
        explanation: 'Un triángulo tiene tres lados.',
        type: 'numeric'
      },
      {
        id: 'p1-g2',
        question: '¿Cuántos lados tiene un cuadrado?',
        correctAnswer: '4',
        explanation: 'Un cuadrado tiene cuatro lados iguales.',
        type: 'numeric'
      },
      {
        id: 'p1-g3',
        question: '¿Qué forma tiene una rueda?',
        options: ['Cuadrado', 'Triángulo', 'Círculo', 'Rectángulo'],
        correctAnswer: 'Círculo',
        explanation: 'Las ruedas son redondas, tienen forma de círculo.',
        type: 'multiple-choice'
      }
    ]
  },
  // 2º Primaria
  {
    id: 'pri-2-medidas',
    courseLevel: '2º Primaria',
    title: 'Medidas de Longitud',
    description: 'Aprende a medir en centímetros y metros.',
    icon: 'Activity',
    exercises: [
      {
        id: 'p2-md1',
        question: '¿Cuántos centímetros hay en 1 metro?',
        correctAnswer: '100',
        explanation: 'Un metro está formado por 100 centímetros.',
        type: 'numeric'
      },
      {
        id: 'p2-md2',
        question: 'Si una cuerda mide 2 metros, ¿cuántos centímetros son?',
        correctAnswer: '200',
        explanation: 'Como 1 metro son 100 cm, 2 metros son $2 \\times 100 = 200$ cm.',
        type: 'numeric'
      },
      {
        id: 'p2-md3',
        question: '¿Qué usarías para medir un lápiz?',
        options: ['Metros', 'Centímetros', 'Kilómetros'],
        correctAnswer: 'Centímetros',
        explanation: 'Un lápiz es pequeño, por lo que usamos centímetros.',
        type: 'multiple-choice'
      }
    ]
  },
  // 3º Primaria
  {
    id: 'pri-3-tiempo',
    courseLevel: '3º Primaria',
    title: 'El Reloj y el Tiempo',
    description: 'Aprende a leer la hora y calcular tiempos.',
    icon: 'Activity',
    exercises: [
      {
        id: 'p3-t1',
        question: '¿Cuántos minutos tiene una hora?',
        correctAnswer: '60',
        explanation: 'Una hora se divide en 60 minutos.',
        type: 'numeric'
      },
      {
        id: 'p3-t2',
        question: '¿Cuántos días tiene una semana?',
        correctAnswer: '7',
        explanation: 'Una semana tiene 7 días: lunes, martes, miércoles, jueves, viernes, sábado y domingo.',
        type: 'numeric'
      },
      {
        id: 'p3-t3',
        question: 'Si son las 3:00 y pasan 2 horas, ¿qué hora es?',
        options: ['4:00', '5:00', '6:00', '2:00'],
        correctAnswer: '5:00',
        explanation: 'Sumamos 2 horas a las 3: $3 + 2 = 5$.',
        type: 'multiple-choice'
      }
    ]
  },
  // 4º Primaria
  {
    id: 'pri-4-angulos',
    courseLevel: '4º Primaria',
    title: 'Ángulos',
    description: 'Tipos de ángulos y sus medidas.',
    icon: 'Triangle',
    exercises: [
      {
        id: 'p4-a1',
        question: '¿Cuántos grados mide un ángulo recto?',
        correctAnswer: '90',
        explanation: 'Un ángulo recto forma una esquina perfecta y mide 90 grados.',
        type: 'numeric'
      },
      {
        id: 'p4-a2',
        question: '¿Cuántos grados mide un ángulo llano?',
        correctAnswer: '180',
        explanation: 'Un ángulo llano es como una línea recta y mide 180 grados.',
        type: 'numeric'
      },
      {
        id: 'p4-a3',
        question: '¿Cómo se llama un ángulo que mide menos de 90 grados?',
        options: ['Agudo', 'Obtuso', 'Recto', 'Llano'],
        correctAnswer: 'Agudo',
        explanation: 'Los ángulos más cerrados que un ángulo recto se llaman agudos.',
        type: 'multiple-choice'
      }
    ]
  },
  // 5º Primaria
  {
    id: 'pri-5-frac-eq',
    courseLevel: '5º Primaria',
    title: 'Fracciones Equivalentes',
    description: 'Fracciones que valen lo mismo.',
    icon: 'Variable',
    exercises: [
      {
        id: 'p5-fe1',
        question: '¿Qué fracción es equivalente a $\\frac{1}{2}$?',
        options: ['$\\frac{2}{4}$', '$\\frac{1}{3}$', '$\\frac{3}{5}$', '$\\frac{2}{3}$'],
        correctAnswer: '$\\frac{2}{4}$',
        explanation: 'Si multiplicas el numerador y el denominador de $\\frac{1}{2}$ por 2, obtienes $\\frac{2}{4}$.',
        type: 'multiple-choice'
      },
      {
        id: 'p5-fe2',
        question: 'Simplifica la fracción $\\frac{6}{8}$.',
        options: ['$\\frac{3}{4}$', '$\\frac{1}{2}$', '$\\frac{2}{3}$', '$\\frac{1}{4}$'],
        correctAnswer: '$\\frac{3}{4}$',
        explanation: 'Dividimos numerador y denominador entre 2: $6/2 = 3$ y $8/2 = 4$.',
        type: 'multiple-choice'
      },
      {
        id: 'p5-fe3',
        question: 'Calcula $\\frac{1}{3}$ de 15.',
        correctAnswer: '5',
        explanation: 'Dividimos 15 entre 3: $15 / 3 = 5$.',
        type: 'numeric'
      }
    ]
  },
  // 6º Primaria
  {
    id: 'pri-6-regla3',
    courseLevel: '6º Primaria',
    title: 'Regla de Tres',
    description: 'Proporcionalidad directa.',
    icon: 'Calculator',
    exercises: [
      {
        id: 'p6-r1',
        question: 'Si 2 kilos de manzanas cuestan 4€, ¿cuánto cuestan 5 kilos?',
        correctAnswer: '10',
        explanation: 'Si 2 kilos son 4€, 1 kilo cuesta 2€. Por tanto, 5 kilos cuestan $5 \\times 2 = 10€$.',
        type: 'numeric'
      },
      {
        id: 'p6-r2',
        question: 'Si 3 coches tienen 12 ruedas, ¿cuántas ruedas tienen 5 coches?',
        correctAnswer: '20',
        explanation: 'Cada coche tiene $12 / 3 = 4$ ruedas. 5 coches tendrán $5 \\times 4 = 20$ ruedas.',
        type: 'numeric'
      },
      {
        id: 'p6-r3',
        question: 'Un tren recorre 100 km en 1 hora. ¿Cuántos km recorrerá en 3 horas a la misma velocidad?',
        correctAnswer: '300',
        explanation: 'Multiplicamos la distancia de una hora por 3: $100 \\times 3 = 300$ km.',
        type: 'numeric'
      }
    ]
  },
  // 1º ESO
  {
    id: 'eso-1-potencias',
    courseLevel: '1º ESO',
    title: 'Potencias y Raíces',
    description: 'Operaciones con exponentes y raíces cuadradas.',
    icon: 'Variable',
    exercises: [
      {
        id: 'e1-p1',
        question: '¿Cuánto es $2^3$?',
        correctAnswer: '8',
        explanation: 'Es 2 multiplicado por sí mismo 3 veces: $2 \\times 2 \\times 2 = 8$.',
        type: 'numeric'
      },
      {
        id: 'e1-p2',
        question: '¿Cuál es la raíz cuadrada de 81?',
        correctAnswer: '9',
        explanation: 'Buscamos un número que multiplicado por sí mismo dé 81. $9 \\times 9 = 81$.',
        type: 'numeric'
      },
      {
        id: 'e1-p3',
        question: '¿Cuánto es $5^0$?',
        correctAnswer: '1',
        explanation: 'Cualquier número (distinto de cero) elevado a cero es igual a 1.',
        type: 'numeric'
      }
    ]
  },
  // 2º ESO
  {
    id: 'eso-2-polinomios',
    courseLevel: '2º ESO',
    title: 'Polinomios',
    description: 'Operaciones con expresiones algebraicas.',
    icon: 'Variable',
    exercises: [
      {
        id: 'e2-p1',
        question: '¿Cuál es el grado del polinomio $P(x) = 3x^2 + 5x - 1$?',
        correctAnswer: '2',
        explanation: 'El grado es el mayor exponente de la variable $x$, que en este caso es 2.',
        type: 'numeric'
      },
      {
        id: 'e2-p2',
        question: 'Suma los polinomios: $(x^2 + 2x) + (3x^2 - x)$',
        options: ['$4x^2 + x$', '$4x^2 + 3x$', '$3x^2 + x$', '$4x^4 + x^2$'],
        correctAnswer: '$4x^2 + x$',
        explanation: 'Sumamos los términos semejantes: $(1+3)x^2 + (2-1)x = 4x^2 + x$.',
        type: 'multiple-choice'
      },
      {
        id: 'e2-p3',
        question: 'Calcula el valor numérico de $P(x) = 2x + 1$ para $x = 3$.',
        correctAnswer: '7',
        explanation: 'Sustituimos la $x$ por 3: $2(3) + 1 = 6 + 1 = 7$.',
        type: 'numeric'
      }
    ]
  },
  // 3º ESO
  {
    id: 'eso-3-ec2g',
    courseLevel: '3º ESO',
    title: 'Ecuaciones de 2º Grado',
    description: 'Resolución de ecuaciones cuadráticas.',
    icon: 'Variable',
    exercises: [
      {
        id: 'e3-e1',
        question: '¿Cuáles son las soluciones de $x^2 - 4 = 0$?',
        options: ['$x=2, x=-2$', '$x=4, x=-4$', '$x=2$', '$x=0, x=4$'],
        correctAnswer: '$x=2, x=-2$',
        explanation: 'Despejamos $x^2 = 4$. Las raíces cuadradas de 4 son 2 y -2.',
        type: 'multiple-choice'
      },
      {
        id: 'e3-e2',
        question: '¿Cuál es la solución positiva de $x^2 - 9 = 0$?',
        correctAnswer: '3',
        explanation: '$x^2 = 9 \\implies x = \\pm 3$. La positiva es 3.',
        type: 'numeric'
      },
      {
        id: 'e3-e3',
        question: 'Calcula el discriminante ($\\Delta = b^2 - 4ac$) de $x^2 - 5x + 6 = 0$.',
        correctAnswer: '1',
        explanation: 'Aquí $a=1, b=-5, c=6$. $\\Delta = (-5)^2 - 4(1)(6) = 25 - 24 = 1$.',
        type: 'numeric'
      }
    ]
  },
  // 4º ESO
  {
    id: 'eso-4-logaritmos',
    courseLevel: '4º ESO',
    title: 'Logaritmos',
    description: 'Concepto y propiedades de los logaritmos.',
    icon: 'Activity',
    exercises: [
      {
        id: 'e4-l1',
        question: '¿Cuánto es $\\log_2(8)$?',
        correctAnswer: '3',
        explanation: 'Buscamos a qué exponente hay que elevar 2 para que dé 8: $2^3 = 8$.',
        type: 'numeric'
      },
      {
        id: 'e4-l2',
        question: '¿Cuánto es $\\log_{10}(100)$?',
        correctAnswer: '2',
        explanation: 'Buscamos a qué exponente hay que elevar 10 para que dé 100: $10^2 = 100$.',
        type: 'numeric'
      },
      {
        id: 'e4-l3',
        question: '¿Cuánto es $\\ln(e)$?',
        correctAnswer: '1',
        explanation: 'El logaritmo neperiano (base $e$) de $e$ es 1, ya que $e^1 = e$.',
        type: 'numeric'
      }
    ]
  },
  // 1º Bachillerato
  {
    id: 'bach-1-vectores',
    courseLevel: '1º Bachillerato',
    title: 'Geometría Analítica',
    description: 'Vectores y rectas en el plano.',
    icon: 'Triangle',
    exercises: [
      {
        id: 'b1-v1',
        question: '¿Cuál es el módulo del vector $\\vec{v} = (3, 4)$?',
        correctAnswer: '5',
        explanation: 'El módulo es $\\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$.',
        type: 'numeric'
      },
      {
        id: 'b1-v2',
        question: 'Calcula el producto escalar de $\\vec{u}=(1, 2)$ y $\\vec{v}=(3, 4)$.',
        correctAnswer: '11',
        explanation: 'Se multiplican coordenadas a coordenadas y se suman: $1\\times3 + 2\\times4 = 3 + 8 = 11$.',
        type: 'numeric'
      },
      {
        id: 'b1-v3',
        question: '¿Cuál es la pendiente de la recta que pasa por $(0,0)$ y $(2,4)$?',
        correctAnswer: '2',
        explanation: 'La pendiente es $m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{4 - 0}{2 - 0} = \\frac{4}{2} = 2$.',
        type: 'numeric'
      }
    ]
  },
  // 2º Bachillerato
  {
    id: 'bach-2-probabilidad',
    courseLevel: '2º Bachillerato',
    title: 'Probabilidad',
    description: 'Cálculo de probabilidades y estadística.',
    icon: 'Activity',
    exercises: [
      {
        id: 'b2-p1',
        question: '¿Cuál es la probabilidad de sacar cara al lanzar una moneda justa?',
        options: ['0.5', '1', '0.25', '0'],
        correctAnswer: '0.5',
        explanation: 'Hay 1 caso favorable (cara) entre 2 casos posibles (cara o cruz): $1/2 = 0.5$.',
        type: 'multiple-choice'
      },
      {
        id: 'b2-p2',
        question: '¿Cuál es la probabilidad de sacar un 6 al lanzar un dado de 6 caras?',
        options: ['$\\frac{1}{6}$', '$\\frac{1}{2}$', '$\\frac{1}{3}$', '$1$'],
        correctAnswer: '$\\frac{1}{6}$',
        explanation: 'Hay 1 caso favorable (el número 6) entre 6 casos posibles.',
        type: 'multiple-choice'
      },
      {
        id: 'b2-p3',
        question: '¿Cuál es la probabilidad de un suceso seguro?',
        correctAnswer: '1',
        explanation: 'Un suceso seguro siempre ocurre, por lo que su probabilidad es del 100%, es decir, 1.',
        type: 'numeric'
      }
    ]
  }
];

