# React Native Academy — Plataforma de Aprendizaje Interactiva

## Descripción

Plataforma web educativa para aprender React Native desde cero hasta nivel avanzado. Incluye módulos de aprendizaje, evaluaciones interactivas, playground de código, sistema de logros, importación de contenido con IA, y un panel de administración completo.

---

## Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 19 | Framework UI |
| TypeScript | 5.9 | Tipado estático |
| Vite | 7 | Bundler y dev server |
| Tailwind CSS | — | Estilos utility-first |
| Zustand/Reducer | — | Gestión de estado |
| Lucide React | — | Iconografía |
| GSAP | — | Animaciones |
| PDF.js | — | Extracción de texto de PDFs |
| Mammoth | — | Extracción de texto de DOCX |
| React Router | — | Enrutamiento SPA |

---

## Características Principales

### Módulos de Aprendizaje
- 10 módulos predefinidos (JS, Componentes, Navigation, Forms, APIs, State, Testing, etc.)
- Lecciones con contenido de texto, código y resúmenes
- Progreso por módulo y general con barra visual
- Bloqueo secuencial de lecciones

### Evaluaciones
- Quizzes interactivos por módulo
- Puntuación con circulo visual
- Revisión detallada con explicaciones
- Opción de reintentar

### Playground de Código
- Editor interactivo con números de línea
- Snippets predefinidos (Componente Básico, useState, FlatList)
- Análisis de código (imports, componentes, hooks)
- Copiar código al portapapeles

### Sistema de Notas y Favoritos
- Crear, editar y eliminar notas por lección
- Guardar lecciones en favoritos
- Pestaña dedicada para ver notas y bookmarks

### Historial de Evaluaciones
- Estadísticas: intentos, aprobados, promedio, tasa de aprobación
- Lista de exámenes con resultado y estado
- Barra de progreso visual por intento

### Logros y Gamificación
- Sistema de logros con condiciones desbloqueables
- Racha diaria de estudio
- Panel de logros recientes en dashboard

### Perfil de Usuario
- Edición de nombre y correo
- Estadísticas personales detalladas
- Exportar progreso como JSON

### Certificado de Finalización
- Certificado visual al completar todos los módulos
- Opción de imprimir y descargar

### Búsqueda
- Búsqueda en tiempo real de módulos y lecciones
- Dropdown con resultados y navegación directa

---

## Panel de Administración

Solo accesible para usuarios con `isAdmin: true`.

- **Gestión de Módulos**: Ver, editar y eliminar módulos personalizados
- **Gestión de Exámenes**: Administrar evaluaciones
- **Importar Contenido**: Generar módulos desde archivos PDF, DOCX o TXT
- **Estadísticas**: Métricas de aprendizaje y progreso de estudiantes

### Cuenta Admin
| Campo | Valor |
|-------|-------|
| Nombre | DEFGEM |
| Email | defgem@app.com |
| Contraseña | yanhyu190 |

---

## Estructura del Proyecto

```
pag/
├── app/                    # Aplicación principal
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   │   ├── LessonEditor.tsx
│   │   │   ├── NotesBookmarks.tsx
│   │   │   ├── Playground.tsx
│   │   │   ├── QuizEditor.tsx
│   │   │   ├── QuizHistory.tsx
│   │   │   └── ToastNotifications.tsx
│   │   ├── sections/       # Páginas/vistas
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Modules.tsx
│   │   │   ├── ModuleDetail.tsx
│   │   │   ├── Lesson.tsx
│   │   │   ├── Quiz.tsx
│   │   │   ├── Evaluations.tsx
│   │   │   ├── Achievements.tsx
│   │   │   ├── PlaygroundPage.tsx
│   │   │   ├── UserProfile.tsx
│   │   │   ├── Certificate.tsx
│   │   │   ├── ImportContent.tsx
│   │   │   ├── AdminModules.tsx
│   │   │   ├── AdminExams.tsx
│   │   │   ├── AdminStats.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── UserLogin.tsx
│   │   ├── hooks/          # Custom hooks y store
│   │   │   └── useStore.tsx
│   │   ├── types/          # Definiciones TypeScript
│   │   │   └── index.ts
│   │   ├── data/           # Datos de módulos y logros
│   │   └── lib/            # Utilidades
│   └── public/
├── rn-academy/             # Proyecto React Native (completado)
└── README.md
```

---

## Inicio Rápido

```bash
cd app
npm install
npm run dev
```

La app se ejecuta en `http://localhost:3000`

---

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Construir para producción |
| `npm run lint` | Ejecutar linter |

---

## Responsive

La app está optimizada para:
- Desktop (sidebar colapsable)
- Tablet
- Móvil (touch targets 44px, safe area insets, sidebar overlay)

---

## Almacenamiento

Datos persistidos en `localStorage`:
- `pag_users` — Usuarios registrados y progreso
- `pag_current_user` — Sesión actual
- `pag_settings` — Configuración (dark mode, sidebar)
- `pag_imported_modules` — Módulos personalizados

---

## Licencia

Proyecto educativo — React Native Academy
