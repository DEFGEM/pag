# Contribuir

Gracias por interesarte en contribuir a este proyecto. A continuación se resumen los pasos básicos:

1. Abre un issue proponiendo el cambio o arreglando un bug.
2. Crea una rama con un nombre claro: `feature/descripcion` o `fix/descripcion`.
3. Escribe código con tipos y pruebas cuando aplique.
4. Ejecuta el linter y el typecheck localmente:
   - cd app
   - npm install
   - npm run lint
   - npx tsc -p tsconfig.app.json --noEmit
5. Abre un Pull Request describiendo los cambios y la motivación.

Normas de estilo
- Sigue las reglas de ESLint y TypeScript establecidas en el repo.
- Evita commitear credenciales o secrets.

Gracias por tu ayuda.