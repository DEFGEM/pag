import type { Module, Achievement, AdminStats } from '@/types';

export const modules: Module[] = [
  {
    id: 'js-fundamentals',
    title: 'JavaScript Moderno (ES6+)',
    description: 'Domina las características modernas de JavaScript que son fundamentales para trabajar con React Native. Variables, arrow functions, destructuring, async/await y más.',
    difficulty: 'basico',
    thumbnail: '/images/module-js.jpg',
    estimatedHours: 6,
    order: 1,
    category: 'Fundamentos',
    lessons: [
      {
        id: 'js-1',
        moduleId: 'js-fundamentals',
        title: 'let, const y Template Literals',
        description: 'Aprende a usar las nuevas formas de declarar variables y crear strings dinámicos.',
        duration: 20,
        order: 1,
        content: [
          { type: 'text', content: 'Antes de ES6, JavaScript solo tenía una forma de declarar variables: `var`. Esto causaba problemas de scope y hoisting que confundían a muchos desarrolladores. Con ES6 llegaron `let` y `const`, que proporcionan un scope de bloque mucho más predecible.' },
          { type: 'code', language: 'javascript', content: '// Antes con var\nfunction ejemploVar() {\n  var x = 1;\n  if (true) {\n    var x = 2; // ¡La misma variable!\n    console.log(x); // 2\n  }\n  console.log(x); // 2\n}\n\n// Ahora con let y const\nfunction ejemploModerno() {\n  let y = 1;\n  const PI = 3.14159;\n  \n  if (true) {\n    let y = 2; // Variable diferente (block scope)\n    console.log(y); // 2\n  }\n  console.log(y); // 1\n  // PI = 3.14; // Error: no se puede reasignar\n}' },
          { type: 'text', content: '**Reglas prácticas:** Usa `const` por defecto. Solo usa `let` cuando necesites reasignar la variable. Evita `var` completamente en código moderno.' },
          { type: 'code', language: 'javascript', content: '// Template Literals\nconst nombre = "React Native";\nconst version = "0.73";\n\n// Antes: concatenación\nconst mensajeOld = "Estamos aprendiendo " + nombre + " v" + version;\n\n// Ahora: template literals\nconst mensaje = `Estamos aprendiendo ${nombre} v${version}`;\n\n// Multilínea fácil\nconst html = `\n  \u003cView\u003e\n    \u003cText\u003eHola Mundo\u003c/Text\u003e\n  \u003c/View\u003e\n`;\n\nconsole.log(mensaje); // Estamos aprendiendo React Native v0.73' },
          { type: 'tip', content: 'Los Template Literals usan backticks (``) en lugar de comillas. Puedes interpolar cualquier expresión JavaScript válida dentro de `${}`. ' },
          { type: 'summary', content: '- `let`: Variables reasignables con scope de bloque. Usar cuando el valor cambiará.\n- `const`: Variables constantes con scope de bloque. Usar por defecto.\n- Template Literals: Strings con backticks que permiten interpolación `${expr}` y multilínea.\n- Nunca uses `var` en código moderno.' }
        ]
      },
      {
        id: 'js-2',
        moduleId: 'js-fundamentals',
        title: 'Arrow Functions y Destructuring',
        description: 'Simplifica tu código con funciones flecha y desestructuración de objetos y arrays.',
        duration: 25,
        order: 2,
        content: [
          { type: 'text', content: 'Las Arrow Functions son una sintaxis más concisa para escribir funciones en JavaScript. Además, manejan el `this` léxico de forma diferente a las funciones tradicionales, lo cual es crucial en React.' },
          { type: 'code', language: 'javascript', content: '// Función tradicional\nfunction sumar(a, b) {\n  return a + b;\n}\n\n// Arrow function básica\nconst sumar = (a, b) =\u003e {\n  return a + b;\n};\n\n// Arrow function con return implícito\nconst sumar = (a, b) =\u003e a + b;\n\n// Un solo parámetro (sin paréntesis)\nconst cuadrado = x =\u003e x * x;\n\n// Útil en métodos de array\nconst numeros = [1, 2, 3, 4, 5];\nconst dobles = numeros.map(n =\u003e n * 2);\nconst pares = numeros.filter(n =\u003e n % 2 === 0);\nconst total = numeros.reduce((acc, n) =\u003e acc + n, 0);\n\nconsole.log(dobles); // [2, 4, 6, 8, 10]\nconsole.log(pares);  // [2, 4]' },
          { type: 'text', content: 'El destructuring te permite extraer valores de objetos y arrays de forma elegante. Es especialmente útil cuando trabajas con props en React.' },
          { type: 'code', language: 'javascript', content: '// Destructuring de objetos\nconst usuario = {\n  nombre: "Ana",\n  edad: 28,\n  ciudad: "Madrid",\n  email: "ana@ejemplo.com"\n};\n\n// Antes\nconst nombre = usuario.nombre;\nconst edad = usuario.edad;\n\n// Ahora\nconst { nombre, edad, ciudad } = usuario;\n\n// Con alias\nconst { nombre: nombreUsuario } = usuario;\n\n// Con valor por defecto\nconst { pais = "España" } = usuario;\n\n// Destructuring anidado\nconst config = {\n  api: {\n    url: "https://api.ejemplo.com",\n    key: "abc123"\n  }\n};\nconst { api: { url, key } } = config;\n\n// Destructuring de arrays\nconst colores = ["rojo", "verde", "azul"];\nconst [primero, segundo] = colores;\nconst [, , tercero] = colores; // ignorar los primeros\nconst [head, ...rest] = colores; // rest operator\n\n// En parámetros de función (muy común en React)\nfunction Saludar({ nombre, idioma = "es" }) {\n  const saludo = idioma === "es" ? "Hola" : "Hello";\n  return `${saludo}, ${nombre}!`;\n}' },
          { type: 'summary', content: '- Arrow functions: Sintaxis concisa `=\u003e`, `this` léxico, return implícito.\n- Destructuring objects: `const { a, b } = objeto`.\n- Destructuring arrays: `const [x, y] = array`.\n- Valores por defecto: `const { x = "default" } = obj`.\n- Rest operator: `const [a, ...rest] = arr`.\n- Muy usado para props en React components.' }
        ]
      },
      {
        id: 'js-3',
        moduleId: 'js-fundamentals',
        title: 'Promesas y Async/Await',
        description: 'Maneja operaciones asíncronas de forma elegante con promesas y async/await.',
        duration: 30,
        order: 3,
        content: [
          { type: 'text', content: 'Las operaciones asíncronas son fundamentales en desarrollo móvil: llamadas a APIs, lectura de archivos, autenticación. JavaScript moderno nos da herramientas elegantes para manejarlas.' },
          { type: 'code', language: 'javascript', content: '// Promesa básica\nfunction obtenerDatos() {\n  return new Promise((resolve, reject) =\u003e {\n    setTimeout(() =\u003e {\n      const exito = true;\n      if (exito) {\n        resolve({ id: 1, nombre: "Producto A" });\n      } else {\n        reject(new Error("No se pudieron obtener los datos"));\n      }\n    }, 1000);\n  });\n}\n\n// Consumir con .then()/.catch()\nobtenerDatos()\n  .then(datos =\u003e console.log(datos))\n  .catch(error =\u003e console.error(error));\n\n// Async/Await - mucho más limpio\nasync function cargarProductos() {\n  try {\n    const datos = await obtenerDatos();\n    console.log("Datos cargados:", datos);\n  } catch (error) {\n    console.error("Error:", error.message);\n  }\n}\n\n// Múltiples promesas en paralelo\nasync function cargarTodo() {\n  try {\n    const [usuarios, productos, pedidos] = await Promise.all([\n      fetch("/api/usuarios"),\n      fetch("/api/productos"),\n      fetch("/api/pedidos")\n    ]);\n    return { usuarios, productos, pedidos };\n  } catch (error) {\n    console.error("Error cargando datos:", error);\n  }\n}' },
          { type: 'tip', content: 'En React Native, siempre usa `try/catch` con `async/await`. Las promesas no manejadas pueden causar crashes silenciosos en producción.' },
          { type: 'summary', content: '- Promesa: Objeto que representa una operación futura.\n- Async/Await: Sintaxis más limpia para manejar promesas.\n- Promise.all(): Ejecuta promesas en paralelo.\n- Siempre usa try/catch para manejar errores.\n- Fundamental para llamadas a APIs en React Native.' }
        ]
      }
    ],
    quiz: {
      id: 'quiz-js',
      moduleId: 'js-fundamentals',
      title: 'Evaluación: JavaScript Moderno',
      passingScore: 70,
      questions: [
        {
          id: 'q-js-1',
          question: '¿Cuál es la diferencia principal entre `let` y `const`?',
          options: [
            '`let` tiene scope de función, `const` tiene scope de bloque',
            '`const` no puede ser reasignado, `let` sí',
            '`let` es más rápido que `const`',
            'No hay diferencia, son sinónimos'
          ],
          correctAnswer: 1,
          explanation: '`const` declara una variable constante que no puede ser reasignada, mientras que `let` permite reasignación. Ambos tienen scope de bloque.'
        },
        {
          id: 'q-js-2',
          question: '¿Qué hace el siguiente código? `const dobles = numeros.map(n =\u003e n * 2);`',
          options: [
            'Filtra los números pares del array',
            'Crea un nuevo array con cada número multiplicado por 2',
            'Ordena el array de menor a mayor',
            'Suma todos los números del array'
          ],
          correctAnswer: 1,
          explanation: '`map()` crea un nuevo array aplicando una función a cada elemento del array original. En este caso, multiplica cada número por 2.'
        },
        {
          id: 'q-js-3',
          question: '¿Qué resultado produce `const { a, b } = { a: 1, b: 2, c: 3 };`?',
          options: [
            'Error: c no está definida',
            '`a` = 1, `b` = 2',
            '`a` = undefined, `b` = undefined',
            'El objeto completo se asigna a `a`'
          ],
          correctAnswer: 1,
          explanation: 'El destructuring extrae solo las propiedades `a` y `b` del objeto. La propiedad `c` simplemente se ignora.'
        },
        {
          id: 'q-js-4',
          question: '¿Para qué sirve `Promise.all()`?',
          options: [
            'Para encadenar promesas secuencialmente',
            'Para ejecutar múltiples promesas en paralelo y esperar a que todas terminen',
            'Para cancelar una promesa en ejecución',
            'Para convertir una callback en promesa'
          ],
          correctAnswer: 1,
          explanation: '`Promise.all()` toma un array de promesas y devuelve una nueva promesa que se resuelve cuando todas las promesas del array se han resuelto.'
        },
        {
          id: 'q-js-5',
          question: 'En una arrow function, ¿cómo se comporta `this`?',
          options: [
            'Se vincula al objeto que llama la función',
            'Se vincula léxicamente al scope donde se definió',
            'Siempre apunta a `window`',
            '`this` no existe en arrow functions'
          ],
          correctAnswer: 1,
          explanation: 'Las arrow functions no tienen su propio `this`. Heredan `this` del contexto léxico donde fueron definidas, lo cual es muy útil en React para evitar problemas con los handlers.'
        }
      ]
    }
  },
  {
    id: 'react-basics',
    title: 'Fundamentos de React',
    description: 'Aprende los conceptos fundamentales de React: JSX, componentes, props y el flujo de datos unidireccional.',
    difficulty: 'basico',
    thumbnail: '/images/module-react.jpg',
    estimatedHours: 8,
    order: 2,
    category: 'Fundamentos',
    lessons: [
      {
        id: 'react-1',
        moduleId: 'react-basics',
        title: 'JSX y Componentes',
        description: 'Entiende la sintaxis JSX y cómo crear componentes reutilizables.',
        duration: 30,
        order: 1,
        content: [
          { type: 'text', content: 'JSX es una extensión de sintaxis para JavaScript que permite escribir código similar a HTML dentro de JavaScript. Aunque parece HTML, JSX es JavaScript puro que se compila a llamadas de función.' },
          { type: 'code', language: 'jsx', content: '// JSX se parece a HTML pero es JavaScript\nfunction Saludo() {\n  return (\n    \u003cView style={styles.container}\u003e\n      \u003cText style={styles.titulo}\u003e\n        ¡Hola, React Native!\n      \u003c/Text\u003e\n      \u003cText style={styles.subtitulo}\u003e\n        Tu primera app móvil\n      \u003c/Text\u003e\n    \u003c/View\u003e\n  );\n}\n\n// Estilos con StyleSheet\nconst styles = StyleSheet.create({\n  container: {\n    flex: 1,\n    justifyContent: "center",\n    alignItems: "center",\n    backgroundColor: "#f5f5f5",\n  },\n  titulo: {\n    fontSize: 24,\n    fontWeight: "bold",\n    color: "#333",\n  },\n  subtitulo: {\n    fontSize: 16,\n    color: "#666",\n    marginTop: 8,\n  },\n});' },
          { type: 'tip', content: 'En JSX, usa `className` en web y `style` en React Native. Los estilos en RN no son CSS, son objetos JavaScript.' },
          { type: 'summary', content: '- JSX: Sintaxis que mezcla HTML y JavaScript.\n- Componentes: Funciones que retornan JSX.\n- StyleSheet.create(): Define estilos como objetos JS.\n- Las etiquetas deben cerrarse siempre: `\u003cImage /\u003e`.\n- `class` se convierte en `className` (web) o `style` (RN).' }
        ]
      },
      {
        id: 'react-2',
        moduleId: 'react-basics',
        title: 'Props: Comunicación entre Componentes',
        description: 'Aprende cómo pasar datos entre componentes usando props.',
        duration: 25,
        order: 2,
        content: [
          { type: 'text', content: 'Las props (propiedades) son el mecanismo principal para pasar datos de un componente padre a un componente hijo en React. Las props son de solo lectura: un componente nunca debe modificar sus propias props.' },
          { type: 'code', language: 'jsx', content: '// Componente hijo que recibe props\nfunction TarjetaUsuario({ nombre, edad, email, esPremium = false }) {\n  return (\n    \u003cView style={styles.tarjeta}\u003e\n      \u003cText style={styles.nombre}\u003e{nombre}\u003c/Text\u003e\n      \u003cText\u003eEdad: {edad} años\u003c/Text\u003e\n      \u003cText\u003e{email}\u003c/Text\u003e\n      {esPremium \u0026\u0026 (\n        \u003cView style={styles.badge}\u003e\n          \u003cText style={styles.badgeText}\u003ePREMIUM ⭐\u003c/Text\u003e\n        \u003c/View\u003e\n      )}\n    \u003c/View\u003e\n  );\n}\n\n// Componente padre que pasa props\nfunction ListaUsuarios() {\n  const usuarios = [\n    { nombre: "Ana", edad: 28, email: "ana@ej.com", esPremium: true },\n    { nombre: "Luis", edad: 32, email: "luis@ej.com" },\n  ];\n\n  return (\n    \u003cView\u003e\n      \u003cText style={styles.titulo}\u003eUsuarios\u003c/Text\u003e\n      {usuarios.map((user, index) =\u003e (\n        \u003cTarjetaUsuario\n          key={index}\n          nombre={user.nombre}\n          edad={user.edad}\n          email={user.email}\n          esPremium={user.esPremium}\n        /\u003e\n      ))}\n    \u003c/View\u003e\n  );\n}\n\n// También puedes pasar todo el objeto con spread\n\u003cTarjetaUsuario key={index} {...user} /\u003e' },
          { type: 'summary', content: '- Props pasan datos de padre a hijo.\n- Son inmutables (solo lectura).\n- Usa destructuring para extraer props.\n- Valores por defecto: `({ nombre = "Invitado" })`.\n- Spread operator: `{...objeto}` pasa todas las propiedades.' }
        ]
      },
      {
        id: 'react-3',
        moduleId: 'react-basics',
        title: 'Renderizado Condicional y Listas',
        description: 'Muestra u oculta elementos según condiciones y renderiza listas de datos.',
        duration: 25,
        order: 3,
        content: [
          { type: 'text', content: 'El renderizado condicional te permite mostrar diferentes UI según el estado de la aplicación. Es fundamental para crear interfaces dinámicas.' },
          { type: 'code', language: 'jsx', content: '// Renderizado condicional\nfunction EstadoCarga({ cargando, error, datos }) {\n  // Early returns para estados especiales\n  if (cargando) {\n    return (\n      \u003cView style={styles.centro}\u003e\n        \u003cActivityIndicator size="large" color="#6366f1" /\u003e\n        \u003cText\u003eCargando...\u003c/Text\u003e\n      \u003c/View\u003e\n    );\n  }\n\n  if (error) {\n    return (\n      \u003cView style={styles.centro}\u003e\n        \u003cText style={styles.error}\u003e❌ {error}\u003c/Text\u003e\n        \u003cButton title="Reintentar" onPress={recargar} /\u003e\n      \u003c/View\u003e\n    );\n  }\n\n  // Operador ternario inline\n  return (\n    \u003cView\u003e\n      \u003cText\u003e\n        {datos.length \u003e 0\n          ? `${datos.length} resultados encontrados`\n          : "No hay resultados"}\n      \u003c/Text\u003e\n      \n      {/* Operador \u0026\u0026 para renderizado condicional */}\n      {datos.length \u003e 0 \u0026\u0026 (\n        \u003cFlatList\n          data={datos}\n          renderItem={({ item }) =\u003e (\n            \u003cText\u003e{item.nombre}\u003c/Text\u003e\n          )}\n          keyExtractor={item =\u003e item.id}\n        /\u003e\n      )}\n    \u003c/View\u003e\n  );\n}' },
          { type: 'summary', content: '- Early returns: Maneja estados de carga/error primero.\n- Ternario: `{cond ? A : B}` para dos opciones.\n- `\u0026\u0026`: `{cond \u0026\u0026 \u003cComponent/\u003e}` para mostrar/ocultar.\n- `FlatList` renderiza listas largas eficientemente.\n- Siempre usa `key` o `keyExtractor` en listas.' }
        ]
      }
    ],
    quiz: {
      id: 'quiz-react',
      moduleId: 'react-basics',
      title: 'Evaluación: Fundamentos de React',
      passingScore: 70,
      questions: [
        {
          id: 'q-react-1',
          question: '¿Qué es JSX?',
          options: [
            'Un lenguaje de programación separado de JavaScript',
            'Una extensión de sintaxis que permite HTML en JavaScript',
            'Un framework de CSS',
            'Un tipo de base de datos'
          ],
          correctAnswer: 1,
          explanation: 'JSX es una extensión de sintaxis para JavaScript que permite escribir código similar a HTML dentro de JavaScript. Se compila a llamadas de función de React.'
        },
        {
          id: 'q-react-2',
          question: '¿Las props en React son...?',
          options: [
            'Mutables y pueden ser modificadas por el componente hijo',
            'De solo lectura y solo el padre puede cambiarlas',
            'Variables globales accesibles desde cualquier componente',
            'Funciones internas de React'
          ],
          correctAnswer: 1,
          explanation: 'Las props son de solo lectura. Un componente hijo nunca debe modificar sus propias props. Si necesita cambiar datos, usa state en su lugar.'
        },
        {
          id: 'q-react-3',
          question: '¿Qué hace `{cargando \u0026\u0026 \u003cSpinner/\u003e}`?',
          options: [
            'Siempre renderiza el Spinner',
            'Renderiza el Spinner solo si `cargando` es true',
            'Compara los valores con \u0026\u0026',
            'Es un error de sintaxis'
          ],
          correctAnswer: 1,
          explanation: 'El operador \u0026\u0026 evalúa la izquierda primero. Si `cargando` es truthy, evalúa y renderiza la derecha. Si es falsy, la expresión completa es falsy y no renderiza nada.'
        }
      ]
    }
  },
  {
    id: 'rn-intro',
    title: 'Introducción a React Native',
    description: 'Configura tu entorno de desarrollo y crea tu primera aplicación móvil cross-platform.',
    difficulty: 'basico',
    thumbnail: '/images/module-native.jpg',
    estimatedHours: 5,
    order: 3,
    category: 'React Native',
    lessons: [
      {
        id: 'rn-1',
        moduleId: 'rn-intro',
        title: 'Configuración del Entorno',
        description: 'Instala todas las herramientas necesarias para desarrollar con React Native.',
        duration: 35,
        order: 1,
        content: [
          { type: 'text', content: 'Para empezar con React Native necesitas Node.js, un emulador o dispositivo físico, y las herramientas de desarrollo específicas para cada plataforma.' },
          { type: 'code', language: 'bash', content: '# Requisitos previos\nnode -v  # v18 o superior\nnpm -v\n\n# Instalar React Native CLI\nnpm install -g @react-native-community/cli\n\n# Crear un nuevo proyecto\nnpx react-native@latest init MiPrimeraApp\ncd MiPrimeraApp\n\n# Para iniciar con Expo (más sencillo)\nnpx create-expo-app MiPrimeraApp\ncd MiPrimeraApp\nnpx expo start' },
          { type: 'summary', content: '- Node.js v18+ requerido.\n- Opción 1: React Native CLI (más control).\n- Opción 2: Expo (más sencillo, recomendado para principiantes).\n- Emulador Android o simulador iOS necesario.\n- También puedes usar tu dispositivo físico.' }
        ]
      },
      {
        id: 'rn-2',
        moduleId: 'rn-intro',
        title: 'Estructura de un Proyecto',
        description: 'Conoce la estructura de archivos y carpetas de un proyecto React Native.',
        duration: 20,
        order: 2,
        content: [
          { type: 'text', content: 'Un proyecto React Native tiene una estructura específica que organiza el código, recursos y configuración de cada plataforma.' },
          { type: 'code', language: 'text', content: 'MiPrimeraApp/\n├── android/          # Código nativo Android\n├── ios/              # Código nativo iOS\n├── src/\n│   ├── components/   # Componentes reutilizables\n│   ├── screens/      # Pantallas de la app\n│   ├── navigation/   # Configuración de navegación\n│   ├── hooks/        # Custom hooks\n│   ├── context/      # Context API\n│   ├── services/     # Llamadas a APIs\n│   ├── utils/        # Utilidades\n│   └── assets/       # Imágenes, fuentes, etc.\n├── App.js            # Punto de entrada\n├── app.json          # Configuración Expo\n├── package.json\n└── babel.config.js' },
          { type: 'summary', content: '- `android/` y `ios/`: Código nativo específico.\n- `src/components/`: Componentes reutilizables.\n- `src/screens/`: Pantallas completas.\n- `src/navigation/`: Configuración de rutas.\n- `App.js`: Punto de entrada principal.' }
        ]
      }
    ],
    quiz: {
      id: 'quiz-rn',
      moduleId: 'rn-intro',
      title: 'Evaluación: Introducción a React Native',
      passingScore: 70,
      questions: [
        {
          id: 'q-rn-1',
          question: '¿Qué es Expo?',
          options: [
            'Un framework que simplifica el desarrollo con React Native',
            'Una tienda de aplicaciones',
            'Un lenguaje de programación',
            'Una base de datos NoSQL'
          ],
          correctAnswer: 0,
          explanation: 'Expo es un framework y plataforma que simplifica el desarrollo con React Native, proporcionando herramientas, servicios y una capa de abstracción sobre el código nativo.'
        },
        {
          id: 'q-rn-2',
          question: '¿Qué versión de Node.js se recomienda para React Native?',
          options: [
            'Node.js v12 o superior',
            'Node.js v18 o superior',
            'Node.js v14 exactamente',
            'No importa la versión'
          ],
          correctAnswer: 1,
          explanation: 'Se recomienda Node.js v18 o superior para React Native, ya que versiones anteriores pueden no ser compatibles con las dependencias más recientes.'
        }
      ]
    }
  },
  {
    id: 'rn-components',
    title: 'Componentes Básicos',
    description: 'Aprende View, Text, Image, ScrollView, TextInput, TouchableOpacity y otros componentes esenciales.',
    difficulty: 'basico',
    thumbnail: '/images/module-native.jpg',
    estimatedHours: 6,
    order: 4,
    category: 'React Native',
    lessons: [
      {
        id: 'comp-1',
        moduleId: 'rn-components',
        title: 'View, Text y Estilos',
        description: 'Los componentes fundamentales para construir cualquier interfaz en React Native.',
        duration: 25,
        order: 1,
        content: [
          { type: 'text', content: '`View` es el contenedor más básico en React Native, similar al `div` de HTML. `Text` se usa para mostrar cualquier texto. A diferencia de la web, en React Native TODO el texto debe estar dentro de un componente `Text`.' },
          { type: 'code', language: 'jsx', content: 'import { View, Text, StyleSheet } from "react-native";\n\nfunction PerfilScreen() {\n  return (\n    \u003cView style={styles.container}\u003e\n      {/* View como contenedor principal */}\n      \u003cView style={styles.header}\u003e\n        \u003cText style={styles.titulo}\u003eMi Perfil\u003c/Text\u003e\n        \u003cText style={styles.subtitulo}\u003eDesarrollador Mobile\u003c/Text\u003e\n      \u003c/View\u003e\n\n      {/* Flexbox para layout */}\n      \u003cView style={styles.stats}\u003e\n        \u003cView style={styles.statItem}\u003e\n          \u003cText style={statNumber}\u003e24\u003c/Text\u003e\n          \u003cText style={statLabel}\u003eProyectos\u003c/Text\u003e\n        \u003c/View\u003e\n        \u003cView style={styles.statItem}\u003e\n          \u003cText style={statNumber}\u003e1.2k\u003c/Text\u003e\n          \u003cText style={statLabel}\u003eSeguidores\u003c/Text\u003e\n        \u003c/View\u003e\n      \u003c/View\u003e\n    \u003c/View\u003e\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: { flex: 1, padding: 20 },\n  header: { alignItems: "center", marginBottom: 24 },\n  titulo: { fontSize: 28, fontWeight: "bold" },\n  subtitulo: { fontSize: 16, color: "#666" },\n  stats: { flexDirection: "row", justifyContent: "space-around" },\n  statItem: { alignItems: "center" },\n  statNumber: { fontSize: 24, fontWeight: "bold", color: "#6366f1" },\n  statLabel: { fontSize: 14, color: "#888" },\n});' },
          { type: 'summary', content: '- `View`: Contenedor base (similar a div).\n- `Text`: Muestra texto (obligatorio para cualquier texto).\n- `StyleSheet.create()`: Define estilos como objetos.\n- Flexbox es el sistema de layout principal.\n- `flexDirection: "row"` para horizontal, `"column"` para vertical.' }
        ]
      },
      {
        id: 'comp-2',
        moduleId: 'rn-components',
        title: 'ScrollView, TextInput y Buttons',
        description: 'Componentes interactivos esenciales para cualquier aplicación móvil.',
        duration: 30,
        order: 2,
        content: [
          { type: 'text', content: '`ScrollView` permite que el contenido sea desplazable cuando excede el tamaño de la pantalla. `TextInput` captura entrada del usuario. `TouchableOpacity` y `Pressable` son los componentes táctiles principales.' },
          { type: 'code', language: 'jsx', content: 'import { useState } from "react";\nimport {\n  View, Text, TextInput, ScrollView,\n  TouchableOpacity, Pressable, StyleSheet\n} from "react-native";\n\nfunction FormularioScreen() {\n  const [nombre, setNombre] = useState("");\n  const [email, setEmail] = useState("");\n\n  const handleSubmit = () =\u003e {\n    console.log({ nombre, email });\n  };\n\n  return (\n    \u003cScrollView style={styles.container}\u003e\n      \u003cText style={styles.label}\u003eNombre\u003c/Text\u003e\n      \u003cTextInput\n        style={styles.input}\n        placeholder="Escribe tu nombre"\n        value={nombre}\n        onChangeText={setNombre}\n        autoCapitalize="words"\n      /\u003e\n\n      \u003cText style={styles.label}\u003eEmail\u003c/Text\u003e\n      \u003cTextInput\n        style={styles.input}\n        placeholder="tu@email.com"\n        value={email}\n        onChangeText={setEmail}\n        keyboardType="email-address"\n        autoCapitalize="none"\n      /\u003e\n\n      {/* TouchableOpacity: reduce opacidad al presionar */}\n      \u003cTouchableOpacity\n        style={styles.boton}\n        onPress={handleSubmit}\n        activeOpacity={0.7}\n      \u003e\n        \u003cText style={styles.botonText}\u003eEnviar\u003c/Text\u003e\n      \u003c/TouchableOpacity\u003e\n\n      {/* Pressable: más control y flexible */}\n      \u003cPressable\n        style={({ pressed }) =\u003e [\n          styles.botonSecundario,\n          pressed \u0026\u0026 styles.botonPressed\n        ]}\n        onPress={() =\u003e console.log("Cancelar")}\n      \u003e\n        \u003cText\u003eCancelar\u003c/Text\u003e\n      \u003c/Pressable\u003e\n    \u003c/ScrollView\u003e\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: { flex: 1, padding: 20 },\n  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },\n  input: {\n    borderWidth: 1,\n    borderColor: "#ddd",\n    borderRadius: 8,\n    padding: 12,\n    fontSize: 16,\n    marginBottom: 16,\n  },\n  boton: {\n    backgroundColor: "#6366f1",\n    padding: 16,\n    borderRadius: 8,\n    alignItems: "center",\n  },\n  botonText: { color: "#fff", fontSize: 16, fontWeight: "600" },\n  botonSecundario: { padding: 16, alignItems: "center" },\n  botonPressed: { backgroundColor: "#e0e7ff", borderRadius: 8 },\n});' },
          { type: 'summary', content: '- `ScrollView`: Contenido desplazable. Usar cuando el contenido excede la pantalla.\n- `TextInput`: Captura de texto del usuario. `onChangeText` para actualizar estado.\n- `TouchableOpacity`: Botón con feedback de opacidad.\n- `Pressable`: Botón con más control sobre estados de presión.\n- Keyboard types: `default`, `email-address`, `numeric`, `phone-pad`.' }
        ]
      }
    ],
    quiz: {
      id: 'quiz-comp',
      moduleId: 'rn-components',
      title: 'Evaluación: Componentes Básicos',
      passingScore: 70,
      questions: [
        {
          id: 'q-comp-1',
          question: 'En React Native, ¿qué componente se usa como contenedor base?',
          options: ['div', 'View', 'Container', 'Box'],
          correctAnswer: 1,
          explanation: '`View` es el contenedor más básico en React Native, equivalente al `div` de la web.'
        },
        {
          id: 'q-comp-2',
          question: '¿Cuál es la diferencia entre ScrollView y FlatList?',
          options: [
            'ScrollView es más rápido siempre',
            'FlatList renderiza elementos lazy (bajo demanda), ScrollView renderiza todo',
            'No hay diferencia',
            'ScrollView solo funciona en iOS'
          ],
          correctAnswer: 1,
          explanation: '`FlatList` solo renderiza los elementos visibles en pantalla y un buffer, lo cual es mucho más eficiente para listas largas. `ScrollView` renderiza todos los hijos de una vez.'
        }
      ]
    }
  },
  {
    id: 'rn-state',
    title: 'Props y State',
    description: 'Entiende la diferencia entre props y state, y cómo manejar datos dinámicos en tus componentes.',
    difficulty: 'basico',
    thumbnail: '/images/module-state.jpg',
    estimatedHours: 5,
    order: 5,
    category: 'React Native',
    lessons: [
      {
        id: 'state-1',
        moduleId: 'rn-state',
        title: 'useState: Estado en Componentes',
        description: 'Aprende a usar el hook useState para manejar datos dinámicos.',
        duration: 30,
        order: 1,
        content: [
          { type: 'text', content: 'El estado (state) es datos que pueden cambiar durante la vida de un componente. Cuando el estado cambia, React re-renderiza el componente automáticamente. `useState` es el hook fundamental para manejar estado.' },
          { type: 'code', language: 'jsx', content: 'import { useState } from "react";\nimport { View, Text, Button, StyleSheet } from "react-native";\n\nfunction Contador() {\n  // useState devuelve: [valorActual, funcionParaActualizar]\n  const [contador, setContador] = useState(0);\n  const [nombre, setNombre] = useState("");\n  const [activo, setActivo] = useState(false);\n  const [usuario, setUsuario] = useState({ nombre: "", edad: 0 });\n\n  const incrementar = () =\u003e setContador(contador + 1);\n  const decrementar = () =\u003e setContador(contador - 1);\n  \n  // Actualizar objeto: ¡Siempre preserva las propiedades existentes!\n  const actualizarNombre = (nuevoNombre) =\u003e {\n    setUsuario({ ...usuario, nombre: nuevoNombre });\n  };\n\n  return (\n    \u003cView style={styles.container}\u003e\n      \u003cText style={styles.numero}\u003e{contador}\u003c/Text\u003e\n      \u003cView style={styles.botones}\u003e\n        \u003cButton title="-" onPress={decrementar} /\u003e\n        \u003cButton title="+" onPress={incrementar} /\u003e\n      \u003c/View\u003e\n      \u003cText\u003eEstado: {activo ? "Activo ✅" : "Inactivo ❌"}\u003c/Text\u003e\n      \u003cButton\n        title={activo ? "Desactivar" : "Activar"}\n        onPress={() =\u003e setActivo(!activo)}\n      /\u003e\n    \u003c/View\u003e\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: { flex: 1, justifyContent: "center", alignItems: "center" },\n  numero: { fontSize: 72, fontWeight: "bold", color: "#6366f1" },\n  botones: { flexDirection: "row", gap: 20, marginTop: 20 },\n});' },
          { type: 'tip', content: 'Nunca modifiques el estado directamente: `contador++` NO funciona. Siempre usa la función setter: `setContador(contador + 1)`.' },
          { type: 'summary', content: '- `useState(initialValue)`: Crea estado local.\n- Devuelve `[valor, setter]`.\n- El setter reemplaza el valor (no lo mergea).\n- Para objetos: usa spread `{ ...obj, prop: newVal }`.\n- Los cambios de estado son asíncronos.' }
        ]
      }
    ],
    quiz: {
      id: 'quiz-state',
      moduleId: 'rn-state',
      title: 'Evaluación: Props y State',
      passingScore: 70,
      questions: [
        {
          id: 'q-state-1',
          question: '¿Qué devuelve useState()?',
          options: [
            'Solo el valor del estado',
            'Un array con [valor, funcionSetter]',
            'Un objeto con propiedades',
            'Una promesa'
          ],
          correctAnswer: 1,
          explanation: '`useState()` devuelve un array con dos elementos: el valor actual del estado y una función para actualizarlo. Usamos destructuring para acceder a ambos.'
        }
      ]
    }
  },
  {
    id: 'rn-hooks',
    title: 'Hooks en React Native',
    description: 'Domina useState, useEffect, useContext, useMemo y useCallback para crear apps eficientes.',
    difficulty: 'intermedio',
    thumbnail: '/images/module-hooks.jpg',
    estimatedHours: 8,
    order: 6,
    category: 'React Native',
    lessons: [
      {
        id: 'hooks-1',
        moduleId: 'rn-hooks',
        title: 'useEffect: Efectos Secundarios',
        description: 'Maneja efectos secundarios como llamadas a APIs, suscripciones y timers.',
        duration: 35,
        order: 1,
        content: [
          { type: 'text', content: '`useEffect` te permite ejecutar código en respuesta a cambios en el componente: cargar datos, suscribirse a eventos, o actualizar el DOM. Se ejecuta después de cada render.' },
          { type: 'code', language: 'jsx', content: 'import { useState, useEffect } from "react";\nimport { View, Text, FlatList } from "react-native";\n\nfunction ListaProductos() {\n  const [productos, setProductos] = useState([]);\n  const [cargando, setCargando] = useState(true);\n\n  // useEffect con array de dependencias vacío = solo al montar\n  useEffect(() =\u003e {\n    cargarProductos();\n  }, []); // ← dependencias vacías\n\n  async function cargarProductos() {\n    try {\n      const response = await fetch("https://api.ejemplo.com/productos");\n      const data = await response.json();\n      setProductos(data);\n    } catch (error) {\n      console.error("Error:", error);\n    } finally {\n      setCargando(false);\n    }\n  }\n\n  // useEffect con cleanup (suscripción)\n  useEffect(() =\u003e {\n    const interval = setInterval(() =\u003e {\n      console.log("Actualizando...");\n    }, 5000);\n\n    // Cleanup: se ejecuta al desmontar\n    return () =\u003e {\n      clearInterval(interval);\n      console.log("Limpieza del interval");\n    };\n  }, []);\n\n  // useEffect con dependencias\n  useEffect(() =\u003e {\n    if (productos.length \u003e 0) {\n      console.log(`Cargados ${productos.length} productos`);\n    }\n  }, [productos]); // ← se ejecuta cuando productos cambia\n\n  if (cargando) return \u003cText\u003eCargando...\u003c/Text\u003e;\n\n  return (\n    \u003cFlatList\n      data={productos}\n      renderItem={({ item }) =\u003e (\n        \u003cText\u003e{item.nombre}\u003c/Text\u003e\n      )}\n      keyExtractor={item =\u003e item.id}\n    /\u003e\n  );\n}' },
          { type: 'summary', content: '- `useEffect(fn, [])`: Ejecuta solo al montar.\n- `useEffect(fn, [dep])`: Ejecuta cuando `dep` cambia.\n- `useEffect(fn)`: Ejecuta después de CADA render.\n- Cleanup: return una función para limpiar.\n- Esencial para: APIs, timers, suscripciones.' }
        ]
      },
      {
        id: 'hooks-2',
        moduleId: 'rn-hooks',
        title: 'useContext: Estado Global',
        description: 'Comparte estado entre componentes sin prop drilling.',
        duration: 30,
        order: 2,
        content: [
          { type: 'text', content: 'Cuando necesitas compartir estado entre muchos componentes, `useContext` evita tener que pasar props a través de múltiples niveles (prop drilling).' },
          { type: 'code', language: 'jsx', content: '// 1. Crear el contexto\nimport { createContext, useContext, useState } from "react";\n\nconst AuthContext = createContext(null);\n\n// 2. Provider que envuelve la app\nexport function AuthProvider({ children }) {\n  const [usuario, setUsuario] = useState(null);\n  const [cargando, setCargando] = useState(true);\n\n  const login = async (email, password) =\u003e {\n    // Llamada a API...\n    setUsuario({ id: 1, email, nombre: "Ana" });\n  };\n\n  const logout = () =\u003e setUsuario(null);\n\n  return (\n    \u003cAuthContext.Provider value={{ usuario, login, logout, cargando }}\u003e\n      {children}\n    \u003c/AuthContext.Provider\u003e\n  );\n}\n\n// 3. Hook personalizado para usar el contexto\nexport function useAuth() {\n  return useContext(AuthContext);\n}\n\n// 4. Uso en cualquier componente\nfunction PerfilScreen() {\n  const { usuario, logout } = useAuth();\n\n  if (!usuario) return \u003cText\u003eNo autenticado\u003c/Text\u003e;\n\n  return (\n    \u003cView\u003e\n      \u003cText\u003eBienvenido, {usuario.nombre}\u003c/Text\u003e\n      \u003cButton title="Cerrar sesión" onPress={logout} /\u003e\n    \u003c/View\u003e\n  );\n}' },
          { type: 'summary', content: '- `createContext()`: Crea el contexto.\n- `Provider`: Envuelve componentes que necesitan acceso.\n- `useContext()`: Accede al valor del contexto.\n- Custom hooks: Simplifican el uso del contexto.\n- Ideal para: autenticación, tema, idioma.' }
        ]
      }
    ],
    quiz: {
      id: 'quiz-hooks',
      moduleId: 'rn-hooks',
      title: 'Evaluación: Hooks',
      passingScore: 70,
      questions: [
        {
          id: 'q-hooks-1',
          question: '¿Cuándo se ejecuta useEffect(() => {}, [])?',
          options: [
            'Después de cada render',
            'Solo cuando el componente se monta',
            'Nunca se ejecuta',
            'Antes de cada render'
          ],
          correctAnswer: 1,
          explanation: 'Con un array de dependencias vacío `[]`, `useEffect` solo se ejecuta una vez, cuando el componente se monta por primera vez.'
        },
        {
          id: 'q-hooks-2',
          question: '¿Para qué sirve la función de cleanup en useEffect?',
          options: [
            'Para limpiar el estado del componente',
            'Para cancelar suscripciones, timers o efectos antes de que el componente se desmonte',
            'Para renderizar el componente',
            'Para actualizar las props'
          ],
          correctAnswer: 1,
          explanation: 'La función de cleanup se ejecuta antes de que el componente se desmonte o antes de que el efecto se vuelva a ejecutar. Es esencial para evitar memory leaks.'
        }
      ]
    }
  },
  {
    id: 'rn-navigation',
    title: 'Navegación',
    description: 'Implementa navegación con React Navigation: stack, tabs y drawer navigation.',
    difficulty: 'intermedio',
    thumbnail: '/images/module-navigation.jpg',
    estimatedHours: 6,
    order: 7,
    category: 'React Native',
    lessons: [
      {
        id: 'nav-1',
        moduleId: 'rn-navigation',
        title: 'React Navigation: Stack Navigator',
        description: 'Configura la navegación entre pantallas con stack transitions.',
        duration: 30,
        order: 1,
        content: [
          { type: 'text', content: 'React Navigation es la librería estándar para manejar navegación en React Native. Stack Navigator maneja una pila de pantallas con transiciones de tipo "push/pop".' },
          { type: 'code', language: 'jsx', content: '// npm install @react-navigation/native @react-navigation/native-stack\n// npm install react-native-screens react-native-safe-area-context\n\nimport { NavigationContainer } from "@react-navigation/native";\nimport { createNativeStackNavigator } from "@react-navigation/native-stack";\n\nconst Stack = createNativeStackNavigator();\n\nfunction App() {\n  return (\n    \u003cNavigationContainer\u003e\n      \u003cStack.Navigator\n        initialRouteName="Home"\n        screenOptions={{\n          headerStyle: { backgroundColor: "#6366f1" },\n          headerTintColor: "#fff",\n          headerTitleStyle: { fontWeight: "bold" },\n        }}\n      \u003e\n        \u003cStack.Screen\n          name="Home"\n          component={HomeScreen}\n          options={{ title: "Inicio" }}\n        /\u003e\n        \u003cStack.Screen\n          name="Detalle"\n          component={DetalleScreen}\n          options={{ title: "Detalle" }}\n        /\u003e\n        \u003cStack.Screen\n          name="Perfil"\n          component={PerfilScreen}\n          options={{ headerShown: false }}\n        /\u003e\n      \u003c/Stack.Navigator\u003e\n    \u003c/NavigationContainer\u003e\n  );\n}\n\n// Navegar entre pantallas\nfunction HomeScreen({ navigation }) {\n  return (\n    \u003cView\u003e\n      \u003cButton\n        title="Ver detalle"\n        onPress={() =\u003e navigation.navigate("Detalle", { id: 123 })}\n      /\u003e\n      \u003cButton\n        title="Mi perfil"\n        onPress={() =\u003e navigation.push("Perfil")}\n      /\u003e\n    \u003c/View\u003e\n  );\n}\n\n// Recibir parámetros\nfunction DetalleScreen({ route, navigation }) {\n  const { id } = route.params;\n\n  return (\n    \u003cView\u003e\n      \u003cText\u003eID del item: {id}\u003c/Text\u003e\n      \u003cButton\n        title="Volver"\n        onPress={() =\u003e navigation.goBack()}\n      /\u003e\n    \u003c/View\u003e\n  );\n}' },
          { type: 'summary', content: '- `NavigationContainer`: Envuelve toda la navegación.\n- `createNativeStackNavigator()`: Crea el stack.\n- `navigation.navigate("Screen")`: Navega a una pantalla.\n- `navigation.push("Screen")`: Empila una nueva instancia.\n- `route.params`: Accede a parámetros pasados.\n- `navigation.goBack()`: Vuelve a la pantalla anterior.' }
        ]
      }
    ],
    quiz: {
      id: 'quiz-nav',
      moduleId: 'rn-navigation',
      title: 'Evaluación: Navegación',
      passingScore: 70,
      questions: [
        {
          id: 'q-nav-1',
          question: '¿Qué componente debe envolver toda la navegación en React Navigation?',
          options: [
            'Stack.Navigator',
            'NavigationContainer',
            'Router',
            'Navigator'
          ],
          correctAnswer: 1,
          explanation: '`NavigationContainer` es el componente raíz que debe envolver toda la estructura de navegación. Gestiona el estado de navegación y vincula el contenedor nativo.'
        }
      ]
    }
  },
  {
    id: 'rn-api',
    title: 'Consumo de APIs',
    description: 'Conecta tu app con servicios backend usando fetch, axios y manejo de errores.',
    difficulty: 'intermedio',
    thumbnail: '/images/module-api.jpg',
    estimatedHours: 7,
    order: 8,
    category: 'React Native',
    lessons: [
      {
        id: 'api-1',
        moduleId: 'rn-api',
        title: 'Fetch y Axios',
        description: 'Realiza peticiones HTTP a APIs REST desde React Native.',
        duration: 35,
        order: 1,
        content: [
          { type: 'text', content: 'React Native incluye la API `fetch` de forma nativa. Para proyectos más complejos, `axios` es una alternativa popular con mejor manejo de errores e interceptores.' },
          { type: 'code', language: 'jsx', content: '// Usando fetch (incluido en React Native)\nasync function obtenerUsuarios() {\n  try {\n    const response = await fetch("https://jsonplaceholder.typicode.com/users");\n    \n    if (!response.ok) {\n      throw new Error(`HTTP ${response.status}: ${response.statusText}`);\n    }\n    \n    const usuarios = await response.json();\n    return usuarios;\n  } catch (error) {\n    console.error("Error fetching:", error.message);\n    throw error;\n  }\n}\n\n// Usando Axios (npm install axios)\nimport axios from "axios";\n\nconst api = axios.create({\n  baseURL: "https://api.ejemplo.com",\n  timeout: 10000,\n  headers: {\n    "Content-Type": "application/json",\n  },\n});\n\n// Interceptor para añadir token\napi.interceptors.request.use((config) =\u003e {\n  const token = obtenerToken();\n  if (token) {\n    config.headers.Authorization = `Bearer ${token}`;\n  }\n  return config;\n});\n\n// Interceptor para manejar errores\napi.interceptors.response.use(\n  (response) =\u003e response,\n  (error) =\u003e {\n    if (error.response?.status === 401) {\n      // Token expirado, redirigir a login\n      logout();\n    }\n    return Promise.reject(error);\n  }\n);\n\n// Uso simplificado\nasync function login(email, password) {\n  const { data } = await api.post("/auth/login", { email, password });\n  return data;\n}' },
          { type: 'summary', content: '- `fetch`: API nativa, sin instalar nada.\n- `axios`: Más features, mejor manejo de errores.\n- Interceptores: Modifican requests/responses globalmente.\n- Siempre maneja errores con try/catch.\n- Valida respuestas con `response.ok` o `response.status`.' }
        ]
      }
    ],
    quiz: {
      id: 'quiz-api',
      moduleId: 'rn-api',
      title: 'Evaluación: Consumo de APIs',
      passingScore: 70,
      questions: [
        {
          id: 'q-api-1',
          question: '¿Qué ventaja tiene axios sobre fetch?',
          options: [
            'Axios es más rápido',
            'Axios tiene interceptores, timeout automático y mejor manejo de errores',
            'Fetch no funciona en React Native',
            'No hay diferencias'
          ],
          correctAnswer: 1,
          explanation: 'Axios proporciona características como interceptores de request/response, timeout automático, transformación automática de JSON, y mejor manejo de errores HTTP.'
        }
      ]
    }
  },
  {
    id: 'rn-forms',
    title: 'Manejo de Formularios',
    description: 'Validación de inputs, formularios controlados y librerías como React Hook Form.',
    difficulty: 'intermedio',
    thumbnail: '/images/module-native.jpg',
    estimatedHours: 5,
    order: 9,
    category: 'React Native',
    lessons: [
      {
        id: 'forms-1',
        moduleId: 'rn-forms',
        title: 'Formularios Controlados y Validación',
        description: 'Crea formularios robustos con validación en tiempo real.',
        duration: 30,
        order: 1,
        content: [
          { type: 'text', content: 'Los formularios controlados en React Native usan el estado para manejar los valores de los inputs. Esto permite validación en tiempo real y feedback inmediato al usuario.' },
          { type: 'code', language: 'jsx', content: 'import { useState } from "react";\nimport { View, Text, TextInput, TouchableOpacity } from "react-native";\n\nfunction FormularioRegistro() {\n  const [form, setForm] = useState({ nombre: "", email: "", password: "" });\n  const [errores, setErrores] = useState({});\n\n  const validar = () =\u003e {\n    const nuevosErrores = {};\n    \n    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";\n    if (!form.email.includes("@")) nuevosErrores.email = "Email inválido";\n    if (form.password.length \u003c 6) nuevosErrores.password = "Mínimo 6 caracteres";\n    \n    setErrores(nuevosErrores);\n    return Object.keys(nuevosErrores).length === 0;\n  };\n\n  const handleSubmit = () =\u003e {\n    if (validar()) {\n      console.log("Formulario válido:", form);\n    }\n  };\n\n  const updateField = (field, value) =\u003e {\n    setForm(prev =\u003e ({ ...prev, [field]: value }));\n    // Limpiar error al escribir\n    if (errores[field]) {\n      setErrores(prev =\u003e ({ ...prev, [field]: undefined }));\n    }\n  };\n\n  return (\n    \u003cView\u003e\n      \u003cTextInput\n        placeholder="Nombre"\n        value={form.nombre}\n        onChangeText={(text) =\u003e updateField("nombre", text)}\n        style={[styles.input, errores.nombre \u0026\u0026 styles.inputError]}\n      /\u003e\n      {errores.nombre \u0026\u0026 \u003cText style={styles.error}\u003e{errores.nombre}\u003c/Text\u003e}\n\n      \u003cTextInput\n        placeholder="Email"\n        value={form.email}\n        onChangeText={(text) =\u003e updateField("email", text)}\n        keyboardType="email-address"\n        style={[styles.input, errores.email \u0026\u0026 styles.inputError]}\n      /\u003e\n      {errores.email \u0026\u0026 \u003cText style={styles.error}\u003e{errores.email}\u003c/Text\u003e}\n\n      \u003cTextInput\n        placeholder="Contraseña"\n        value={form.password}\n        onChangeText={(text) =\u003e updateField("password", text)}\n        secureTextEntry\n        style={[styles.input, errores.password \u0026\u0026 styles.inputError]}\n      /\u003e\n      {errores.password \u0026\u0026 \u003cText style={styles.error}\u003e{errores.password}\u003c/Text\u003e}\n\n      \u003cTouchableOpacity onPress={handleSubmit} style={styles.boton}\u003e\n        \u003cText style={styles.botonText}\u003eRegistrarse\u003c/Text\u003e\n      \u003c/TouchableOpacity\u003e\n    \u003c/View\u003e\n  );\n}' },
          { type: 'summary', content: '- Estado controla los valores de los inputs.\n- Valida en tiempo real para mejor UX.\n- Muestra errores cerca del campo afectado.\n- `secureTextEntry` para contraseñas.\n- `keyboardType` para el teclado adecuado.' }
        ]
      }
    ],
    quiz: {
      id: 'quiz-forms',
      moduleId: 'rn-forms',
      title: 'Evaluación: Formularios',
      passingScore: 70,
      questions: [
        {
          id: 'q-forms-1',
          question: '¿Qué prop se usa para ocultar el texto de una contraseña?',
          options: ['hidden', 'secureTextEntry', 'password', 'obscure'],
          correctAnswer: 1,
          explanation: '`secureTextEntry` es la prop de React Native que oculta el texto ingresado, mostrando puntos en su lugar. Es el equivalente a `type="password"` en HTML.'
        }
      ]
    }
  },
  {
    id: 'rn-storage',
    title: 'Almacenamiento Local',
    description: 'Persistencia de datos con AsyncStorage, SQLite y manejo de estado offline.',
    difficulty: 'intermedio',
    thumbnail: '/images/module-state.jpg',
    estimatedHours: 5,
    order: 10,
    category: 'React Native',
    lessons: [
      {
        id: 'storage-1',
        moduleId: 'rn-storage',
        title: 'AsyncStorage',
        description: 'Guarda datos localmente en el dispositivo del usuario.',
        duration: 25,
        order: 1,
        content: [
          { type: 'text', content: 'AsyncStorage es un sistema de almacenamiento clave-valor simple y asíncrono. Es ideal para guardar preferencias, tokens de autenticación y datos de caché.' },
          { type: 'code', language: 'jsx', content: '// npm install @react-native-async-storage/async-storage\nimport AsyncStorage from "@react-native-async-storage/async-storage";\n\n// Guardar datos\nasync function guardarDatos() {\n  try {\n    await AsyncStorage.setItem("@usuario", JSON.stringify({\n      id: 1,\n      nombre: "Ana",\n      email: "ana@ejemplo.com"\n    }));\n    await AsyncStorage.setItem("@tema", "oscuro");\n  } catch (error) {\n    console.error("Error guardando:", error);\n  }\n}\n\n// Leer datos\nasync function cargarDatos() {\n  try {\n    const usuarioJSON = await AsyncStorage.getItem("@usuario");\n    const tema = await AsyncStorage.getItem("@tema");\n    \n    const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;\n    return { usuario, tema };\n  } catch (error) {\n    console.error("Error leyendo:", error);\n    return null;\n  }\n}\n\n// Eliminar datos\nasync function eliminarDatos() {\n  try {\n    await AsyncStorage.removeItem("@usuario");\n    // O eliminar todo:\n    // await AsyncStorage.clear();\n  } catch (error) {\n    console.error("Error eliminando:", error);\n  }\n}\n\n// Hook personalizado para AsyncStorage\nfunction useStorage(key, valorInicial) {\n  const [valor, setValor] = useState(valorInicial);\n\n  useEffect(() =\u003e {\n    AsyncStorage.getItem(key).then((item) =\u003e {\n      if (item) setValor(JSON.parse(item));\n    });\n  }, [key]);\n\n  const guardar = async (nuevoValor) =\u003e {\n    setValor(nuevoValor);\n    await AsyncStorage.setItem(key, JSON.stringify(nuevoValor));\n  };\n\n  return [valor, guardar];\n}' },
          { type: 'summary', content: '- `setItem(key, value)`: Guarda un string.\n- `getItem(key)`: Recupera un string.\n- `removeItem(key)`: Elimina una clave.\n- Usa `JSON.stringify/parse` para objetos.\n- Todas las operaciones son asíncronas.' }
        ]
      }
    ],
    quiz: {
      id: 'quiz-storage',
      moduleId: 'rn-storage',
      title: 'Evaluación: Almacenamiento Local',
      passingScore: 70,
      questions: [
        {
          id: 'q-storage-1',
          question: '¿Qué tipo de almacenamiento es AsyncStorage?',
          options: [
            'Base de datos SQL',
            'Almacenamiento clave-valor',
            'Sistema de archivos',
            'Base de datos NoSQL completa'
          ],
          correctAnswer: 1,
          explanation: 'AsyncStorage es un sistema de almacenamiento clave-valor simple y persistente. Solo almacena strings, por lo que para objetos necesitas JSON.stringify/parse.'
        }
      ]
    }
  },
  {
    id: 'rn-performance',
    title: 'Optimización y Rendimiento',
    description: 'Técnicas para mejorar la velocidad y fluidez de tu aplicación React Native.',
    difficulty: 'avanzado',
    thumbnail: '/images/module-performance.jpg',
    estimatedHours: 6,
    order: 11,
    category: 'React Native',
    lessons: [
      {
        id: 'perf-1',
        moduleId: 'rn-performance',
        title: 'Memoización y useMemo/useCallback',
        description: 'Evita renders innecesarios con técnicas de optimización.',
        duration: 30,
        order: 1,
        content: [
          { type: 'text', content: 'React re-renderiza componentes cuando cambia el estado o las props. Para componentes pesados o listas largas, usar `React.memo`, `useMemo` y `useCallback` puede mejorar significativamente el rendimiento.' },
          { type: 'code', language: 'jsx', content: 'import { memo, useMemo, useCallback } from "react";\n\n// React.memo evita re-renders si las props no cambian\nconst TarjetaProducto = memo(function TarjetaProducto({ producto, onPress }) {\n  console.log("Render:", producto.nombre);\n  return (\n    \u003cTouchableOpacity onPress={onPress}\u003e\n      \u003cText\u003e{producto.nombre}\u003c/Text\u003e\n      \u003cText\u003e${producto.precio}\u003c/Text\u003e\n    \u003c/TouchableOpacity\u003e\n  );\n});\n\nfunction ListaProductos({ productos, categoria }) {\n  // useMemo: cachea el resultado de cálculos costosos\n  const productosFiltrados = useMemo(() =\u003e {\n    console.log("Filtrando...");\n    return productos.filter(p =\u003e p.categoria === categoria);\n  }, [productos, categoria]);\n\n  // useCallback: cachea funciones para evitar recreación\n  const handlePress = useCallback((id) =\u003e {\n    console.log("Producto seleccionado:", id);\n  }, []);\n\n  return (\n    \u003cFlatList\n      data={productosFiltrados}\n      renderItem={({ item }) =\u003e (\n        \u003cTarjetaProducto\n          producto={item}\n          onPress={() =\u003e handlePress(item.id)}\n        /\u003e\n      )}\n      keyExtractor={item =\u003e item.id}\n    /\u003e\n  );\n}\n\n// UseMemo para valores computados\nconst estadisticas = useMemo(() =\u003e {\n  return {\n    total: productos.reduce((s, p) =\u003e s + p.precio, 0),\n    promedio: productos.reduce((s, p) =\u003e s + p.precio, 0) / productos.length,\n    count: productos.length\n  };\n}, [productos]);' },
          { type: 'summary', content: '- `React.memo`: Evita re-render si props iguales.\n- `useMemo`: Cachea valores computados.\n- `useCallback`: Cachea funciones.\n- Solo optimiza cuando hay problemas de rendimiento.\n- FlatList ya optimiza listas internamente.' }
        ]
      }
    ],
    quiz: {
      id: 'quiz-perf',
      moduleId: 'rn-performance',
      title: 'Evaluación: Optimización',
      passingScore: 70,
      questions: [
        {
          id: 'q-perf-1',
          question: '¿Cuándo debe usarse useMemo?',
          options: [
            'Siempre, en todos los valores',
            'Solo para cálculos costosos que dependen de valores que raramente cambian',
            'Nunca, es una mala práctica',
            'Solo en componentes de clase'
          ],
          correctAnswer: 1,
          explanation: '`useMemo` tiene un costo de memoria. Solo debe usarse cuando el cálculo es realmente costoso y las dependencias cambian con poca frecuencia. No uses memoización prematuramente.'
        }
      ]
    }
  },
  {
    id: 'rn-testing',
    title: 'Testing',
    description: 'Escribe tests unitarios y de integración con Jest y React Native Testing Library.',
    difficulty: 'avanzado',
    thumbnail: '/images/module-testing.jpg',
    estimatedHours: 7,
    order: 12,
    category: 'React Native',
    lessons: [
      {
        id: 'test-1',
        moduleId: 'rn-testing',
        title: 'Jest y React Native Testing Library',
        description: 'Configura y escribe tests para tus componentes.',
        duration: 30,
        order: 1,
        content: [
          { type: 'text', content: 'Jest viene preconfigurado en React Native. React Native Testing Library (RNTL) proporciona utilidades para probar componentes de forma que simula la interacción del usuario.' },
          { type: 'code', language: 'javascript', content: '// Componente a testear\nfunction Contador() {\n  const [count, setCount] = useState(0);\n  return (\n    \u003cView\u003e\n      \u003cText testID="contador"\u003e{count}\u003c/Text\u003e\n      \u003cButton title="Incrementar" onPress={() =\u003e setCount(c =\u003e c + 1)} /\u003e\n    \u003c/View\u003e\n  );\n}\n\n// Test\nimport { render, fireEvent, screen } from "@testing-library/react-native";\n\ndescribe("Contador", () =\u003e {\n  it("muestra el valor inicial 0", () =\u003e {\n    render(\u003cContador /\u003e);\n    expect(screen.getByText("0")).toBeTruthy();\n  });\n\n  it("incrementa al presionar el botón", () =\u003e {\n    render(\u003cContador /\u003e);\n    \n    fireEvent.press(screen.getByText("Incrementar"));\n    \n    expect(screen.getByText("1")).toBeTruthy();\n  });\n\n  it("incrementa múltiples veces", () =\u003e {\n    render(\u003cContador /\u003e);\n    \n    const boton = screen.getByText("Incrementar");\n    fireEvent.press(boton);\n    fireEvent.press(boton);\n    fireEvent.press(boton);\n    \n    expect(screen.getByText("3")).toBeTruthy();\n  });\n});\n\n// Test con async\nimport { waitFor } from "@testing-library/react-native";\n\nit("carga datos de la API", async () =\u003e {\n  render(\u003cListaProductos /\u003e);\n  \n  await waitFor(() =\u003e {\n    expect(screen.getByText("Producto A")).toBeTruthy();\n  });\n});' },
          { type: 'summary', content: '- `render()`: Renderiza el componente.\n- `screen.getByText()`: Encuentra elementos por texto.\n- `fireEvent.press()`: Simula un toque.\n- `waitFor()`: Espera por elementos asíncronos.\n- `testID`: Atributo para encontrar elementos.\n- Jest ya viene configurado en React Native.' }
        ]
      }
    ],
    quiz: {
      id: 'quiz-test',
      moduleId: 'rn-testing',
      title: 'Evaluación: Testing',
      passingScore: 70,
      questions: [
        {
          id: 'q-test-1',
          question: '¿Qué hace fireEvent.press()?',
          options: [
            'Envía un evento al servidor',
            'Simula un toque/tap en un elemento',
            'Toma una captura de pantalla',
            'Cierra la aplicación'
          ],
          correctAnswer: 1,
          explanation: '`fireEvent.press()` simula un evento de toque (tap) en un elemento, como si el usuario hubiera presionado ese elemento en la pantalla.'
        }
      ]
    }
  },
  {
    id: 'rn-publish',
    title: 'Publicación de Apps',
    description: 'Prepara, compila y publica tu app en App Store y Google Play Store.',
    difficulty: 'avanzado',
    thumbnail: '/images/module-publish.jpg',
    estimatedHours: 5,
    order: 13,
    category: 'React Native',
    lessons: [
      {
        id: 'pub-1',
        moduleId: 'rn-publish',
        title: 'Build y Publicación',
        description: 'El proceso completo para llevar tu app a producción.',
        duration: 35,
        order: 1,
        content: [
          { type: 'text', content: 'Publicar una app en las tiendas oficiales requiere seguir un proceso específico para cada plataforma. Aquí cubrimos los pasos esenciales.' },
          { type: 'code', language: 'bash', content: '# Generar build de release Android\ncd android\n./gradlew assembleRelease\n\n# El APK se genera en:\n# android/app/build/outputs/apk/release/app-release.apk\n\n# Generar AAB (Android App Bundle) para Play Store\n./gradlew bundleRelease\n\n# Para iOS (requiere Mac + Xcode)\ncd ios\n# Abrir en Xcode, seleccionar "Any iOS Device"\n# Product \u003e Archive\n# Distribute App \u003e App Store Connect' },
          { type: 'text', content: '**Checklist antes de publicar:**\n\n1. ✅ Probar en dispositivos reales (no solo emulador)\n2. ✅ Manejar todos los errores y estados de carga\n3. ✅ Optimizar imágenes y assets\n4. ✅ Configurar splash screen e iconos\n5. ✅ Agregar analytics y crash reporting\n6. ✅ Política de privacidad (obligatoria)\n7. ✅ Screenshots de la app para la tienda\n8. ✅ Descripción y keywords optimizados\n9. ✅ Versionado semántico (1.0.0)\n10. ✅ Licencias de librerías de terceros' },
          { type: 'summary', content: '- Android: Genera APK o AAB con Gradle.\n- iOS: Usa Xcode para archivar y distribuir.\n- Expo: `expo build:android` o `expo build:ios`.\n- EAS Build: El nuevo sistema de builds de Expo.\n- Sigue el checklist antes de publicar.' }
        ]
      }
    ],
    quiz: {
      id: 'quiz-pub',
      moduleId: 'rn-publish',
      title: 'Evaluación: Publicación',
      passingScore: 70,
      questions: [
        {
          id: 'q-pub-1',
          question: '¿Qué formato se recomienda para publicar en Google Play Store?',
          options: ['APK', 'AAB (Android App Bundle)', 'ZIP', 'EXE'],
          correctAnswer: 1,
          explanation: 'Google Play Store recomienda el formato AAB (Android App Bundle) ya que permite entregar solo los recursos necesarios para cada dispositivo, reduciendo el tamaño de descarga.'
        }
      ]
    }
  },
  {
    id: 'rn-advanced',
    title: 'Arquitecturas Avanzadas',
    description: 'Patrones de diseño, clean architecture, y mejores prácticas para apps enterprise.',
    difficulty: 'avanzado',
    thumbnail: '/images/module-advanced.jpg',
    estimatedHours: 10,
    order: 14,
    category: 'React Native',
    lessons: [
      {
        id: 'adv-1',
        moduleId: 'rn-advanced',
        title: 'Clean Architecture en React Native',
        description: 'Estructura tu proyecto con principios SOLID y clean architecture.',
        duration: 40,
        order: 1,
        content: [
          { type: 'text', content: 'Clean Architecture separa el código en capas independientes, haciendo el proyecto más mantenible, testeable y escalable. En React Native, aplicamos estos principios adaptados al ecosistema móvil.' },
          { type: 'code', language: 'jsx', content: 'src/\n├── domain/              # Capa de dominio (reglas de negocio)\n│   ├── entities/        # Modelos de datos\n│   │   ├── User.ts\n│   │   └── Product.ts\n│   ├── repositories/    # Interfaces (contratos)\n│   │   ├── IUserRepository.ts\n│   │   └── IProductRepository.ts\n│   └── usecases/        # Casos de uso\n│       ├── auth/\n│       │   ├── LoginUseCase.ts\n│       │   └── RegisterUseCase.ts\n│       └── products/\n│           ├── GetProductsUseCase.ts\n│           └── CreateProductUseCase.ts\n│\n├── data/                # Capa de datos (implementaciones)\n│   ├── repositories/    # Implementaciones de repositorios\n│   │   ├── UserRepository.ts\n│   │   └── ProductRepository.ts\n│   ├── datasources/     # Fuentes de datos\n│   │   ├── local/       # AsyncStorage, SQLite\n│   │   └── remote/      # APIs, Firebase\n│   └── models/          # DTOs y mappers\n│\n├── presentation/        # Capa de presentación\n│   ├── screens/         # Pantallas\n│   ├── components/      # Componentes reutilizables\n│   ├── hooks/           # Custom hooks\n│   └── navigation/      # Configuración de rutas\n│\n└── core/                # Utilidades compartidas\n    ├── utils/\n    ├── constants/\n    └── services/        # Servicios transversales' },
          { type: 'text', content: '**Principios clave:**\n\n1. **Independencia de frameworks**: El dominio no depende de React Native.\n2. **Testabilidad**: Las reglas de negocio se testean sin UI.\n3. **Independencia de UI**: Se puede cambiar la UI sin tocar la lógica.\n4. **Independencia de base de datos**: Se puede cambiar AsyncStorage por SQLite.\n5. **Independencia de servicios externos**: Se puede cambiar la API.' },
          { type: 'code', language: 'typescript', content: '// Ejemplo: Caso de uso (Capa de Dominio)\n// domain/usecases/auth/LoginUseCase.ts\nexport class LoginUseCase {\n  constructor(private userRepository: IUserRepository) {}\n\n  async execute(email: string, password: string): Promise\u003cResult\u003cUser\u003e\u003e {\n    // Validaciones de dominio\n    if (!email.includes("@")) {\n      return Result.failure("Email inválido");\n    }\n    if (password.length \u003c 6) {\n      return Result.failure("Contraseña muy corta");\n    }\n\n    // Delegar a la capa de datos\n    return this.userRepository.login(email, password);\n  }\n}\n\n// En el componente (Capa de Presentación)\nfunction useLogin() {\n  const [cargando, setCargando] = useState(false);\n  const loginUseCase = useMemo(() =\u003e {\n    const repo = new UserRepository();\n    return new LoginUseCase(repo);\n  }, []);\n\n  const login = async (email: string, password: string) =\u003e {\n    setCargando(true);\n    const result = await loginUseCase.execute(email, password);\n    setCargando(false);\n    return result;\n  };\n\n  return { login, cargando };\n}' },
          { type: 'summary', content: '- Capas: Domain → Data → Presentation.\n- Domain: No depende de nada externo.\n- Use Cases: Encapsulan lógica de negocio.\n- Repositories: Abstraen el origen de datos.\n- Inversión de dependencias: Domain define interfaces.' }
        ]
      }
    ],
    quiz: {
      id: 'quiz-adv',
      moduleId: 'rn-advanced',
      title: 'Evaluación: Arquitecturas Avanzadas',
      passingScore: 70,
      questions: [
        {
          id: 'q-adv-1',
          question: 'En Clean Architecture, ¿qué capa NO debe depender de frameworks externos?',
          options: [
            'Capa de datos (Data)',
            'Capa de presentación (Presentation)',
            'Capa de dominio (Domain)',
            'Todas dependen de frameworks'
          ],
          correctAnswer: 2,
          explanation: 'La capa de dominio es la más interna y no debe depender de ningún framework externo. Contiene las reglas de negocio puras y es independiente de React Native, la base de datos o la API.'
        }
      ]
    }
  }
];

export const achievements: Achievement[] = [
  {
    id: 'ach-first-module',
    title: 'Primeros Pasos',
    description: 'Completa tu primer módulo de aprendizaje.',
    icon: '/images/achievement-first.png',
    unlockedAt: '2026-06-01T10:00:00Z',
    condition: { type: 'complete_module', moduleId: 'js-fundamentals' }
  },
  {
    id: 'ach-perfect-score',
    title: 'Puntuación Perfecta',
    description: 'Obtén 100% en una evaluación.',
    icon: '/images/achievement-perfect.png',
    unlockedAt: '2026-06-05T14:30:00Z',
    condition: { type: 'complete_quiz', score: 100 }
  },
  {
    id: 'ach-streak-7',
    title: 'Racha de 7 Días',
    description: 'Estudia durante 7 días consecutivos.',
    icon: '/images/achievement-streak.png',
    unlockedAt: '2026-06-10T08:00:00Z',
    condition: { type: 'streak', days: 7 }
  },
  {
    id: 'ach-halfway',
    title: 'A Medio Camino',
    description: 'Completa la mitad de todos los módulos.',
    icon: '/images/achievement-first.png',
    unlockedAt: null,
    condition: { type: 'complete_all_modules' }
  },
  {
    id: 'ach-master',
    title: 'React Native Master',
    description: 'Completa todos los módulos del curso.',
    icon: '/images/achievement-perfect.png',
    unlockedAt: null,
    condition: { type: 'complete_all_modules' }
  },
  {
    id: 'ach-dedication',
    title: 'Dedicación',
    description: 'Acumula 50 horas de estudio.',
    icon: '/images/achievement-streak.png',
    unlockedAt: null,
    condition: { type: 'study_time', minutes: 3000 }
  }
];

export const adminStats: AdminStats = {
  totalStudents: 1248,
  activeModules: 14,
  completedEvaluations: 8734,
  passRate: 78,
  studentProgress: [
    { date: '2026-05-15', completed: 45 },
    { date: '2026-05-16', completed: 52 },
    { date: '2026-05-17', completed: 38 },
    { date: '2026-05-18', completed: 61 },
    { date: '2026-05-19', completed: 55 },
    { date: '2026-05-20', completed: 72 },
    { date: '2026-05-21', completed: 68 },
    { date: '2026-05-22', completed: 80 },
    { date: '2026-05-23', completed: 65 },
    { date: '2026-05-24', completed: 90 },
    { date: '2026-05-25', completed: 85 },
    { date: '2026-05-26', completed: 95 },
    { date: '2026-05-27', completed: 78 },
    { date: '2026-05-28', completed: 88 },
    { date: '2026-05-29', completed: 102 },
    { date: '2026-05-30', completed: 96 },
    { date: '2026-05-31', completed: 110 },
    { date: '2026-06-01', completed: 105 },
    { date: '2026-06-02', completed: 115 },
    { date: '2026-06-03', completed: 98 },
    { date: '2026-06-04', completed: 120 },
    { date: '2026-06-05', completed: 108 },
    { date: '2026-06-06', completed: 125 },
    { date: '2026-06-07', completed: 112 },
    { date: '2026-06-08', completed: 130 },
    { date: '2026-06-09', completed: 118 },
    { date: '2026-06-10', completed: 135 },
    { date: '2026-06-11', completed: 128 },
    { date: '2026-06-12', completed: 142 },
  ],
  modulePopularity: [
    { moduleId: 'js-fundamentals', count: 892 },
    { moduleId: 'react-basics', count: 756 },
    { moduleId: 'rn-intro', count: 678 },
    { moduleId: 'rn-components', count: 612 },
    { moduleId: 'rn-hooks', count: 534 },
    { moduleId: 'rn-navigation', count: 489 },
    { moduleId: 'rn-api', count: 445 },
    { moduleId: 'rn-forms', count: 398 },
    { moduleId: 'rn-state', count: 367 },
    { moduleId: 'rn-storage', count: 312 },
    { moduleId: 'rn-performance', count: 289 },
    { moduleId: 'rn-testing', count: 245 },
    { moduleId: 'rn-publish', count: 198 },
    { moduleId: 'rn-advanced', count: 156 },
  ],
  levelDistribution: [
    { level: 'basico', count: 720 },
    { level: 'intermedio', count: 380 },
    { level: 'avanzado', count: 148 },
  ],
};
