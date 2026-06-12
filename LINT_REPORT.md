Informe de lint y tipo (resumen)

Fecha: 2026-06-12

Resumen rápido
--------------
Se instalaron dependencias de ESLint (@typescript-eslint/parser, @typescript-eslint/eslint-plugin, eslint-plugin-react), se ejecutó eslint y tsc. TypeScript no reportó errores. ESLint encontró 18 errores que requieren corrección en el código.

Errores detectados (archivos clave)
----------------------------------
- app/src/components/ui/badge.tsx
- app/src/components/ui/button-group.tsx
- app/src/components/ui/button.tsx
- app/src/components/ui/form.tsx
- app/src/components/ui/navigation-menu.tsx
- app/src/components/ui/sidebar.tsx
- app/src/components/ui/toggle.tsx
- app/src/hooks/useStore.tsx
  Problema: regla react-refresh/only-export-components — hay exports (const/func) además de componentes en los mismos archivos. Solución: mover utilitarios/constantes a archivos separados.

- app/src/components/ui/sidebar.tsx
  Problema: uso de Math.random() dentro del cuerpo del componente → marcado como "impure function during render". Solución: generar valor aleatorio fuera del render (en useEffect, useRef inicializado en mount, o en servidor cuando corresponda).

- app/src/sections/ImportContent.tsx
  Problema: isValidFile se usa antes de su declaración (hoisting); uso de Date.now() y Math.random() en el cuerpo del componente (marcado como impuro); usos de any. Solución: mover la declaración de isValidFile arriba o declarar como function, generar IDs en el handler (ya se hace) o evitar Date.now en el cuerpo del componente, tipar any.

- app/src/sections/AdminModules.tsx, app/src/sections/Quiz.tsx
  Problema: usos de `any` y violaciones de reglas de Hooks (hooks llamados condicionalmente). Solución: reordenar hooks para que se llamen incondicionalmente, reemplazar any por tipos concretos.

Resultado del lint
------------------
Total: 18 errores (0 warnings). TypeScript: sin errores (tsc OK).

Siguientes pasos recomendados (priorizados)
-------------------------------------------
1. Corregir problemas de "only-export-components": mover constantes/funciones utilitarias a archivos separados (baja complejidad por archivo).
2. Reemplazar impure functions en render:
   - sidebar: usar useEffect + useState o useRef para establecer ancho aleatorio una vez al montar.
   - ImportContent: crear IDs dentro del handler (ya lo hace) y/o evitar Date.now en lugares que ESLint detecte; mover generación de IDs a funciones auxiliares fuera del componente.
3. Corregir hooks condicionales en Quiz (reordenar retornos y hooks).
4. Tipar variables con any y añadir tests para los flujos críticos.
5. Ejecutar lint nuevamente y arreglar errores restantes.

Acciones ya realizadas
----------------------
- Añadido en la raíz: .gitignore, LICENSE (MIT), .eslintrc.cjs, .github/workflows/ci.yml, .github/dependabot.yml, CONTRIBUTING.md
- Install devDependencies de ESLint en app (con --legacy-peer-deps)
- Ejecutado eslint y tsc

Opciones para proceder (elige una)
---------------------------------
- Option A: Aplicar correcciones automáticas y de bajo riesgo (mover hoisted funcs, cambiar Date.now en handlers, crear archivos de utilidades). — Puedo hacerlo ahora y commitear en una rama.
- Option B: Crear PRs separadas por categoría (configuración, fixes de lint, refactor de hooks) para revisión manual.
- Option C: Solo reportar (actual) — no modificar código.

Si quieres, procedo con Option A (aplicar correcciones automáticas y seguras). Si prefieres Option B, crearé ramas/PRs por cambio.

