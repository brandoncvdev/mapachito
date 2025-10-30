# 🦝 mapachito

> Micro-framework **vanilla TypeScript** para construir interfaces modulares, seguras y sin dependencias.  
> Diseñado para demostrar buenas prácticas de arquitectura frontend con **DOM nativo**,  
> ciclo de vida explícito y un router hash-based minimalista.

---

## ✨ Características

✅ **100% Vanilla** — Sin frameworks externos ni dependencias de UI.  
✅ **Seguro por diseño** — Sanitización integrada en el render HTML.  
✅ **Componentes modulares** — Cada vista es una clase con ciclo de vida claro.  
✅ **Router SPA sencillo** — Basado en `location.hash`, sin configuración extra.  
✅ **TypeScript first** — API tipada, ideal para demostrar dominio técnico.  
✅ **Extensible** — Preparado para módulos futuros (`Store`, `Anim`, `UI`, etc.).

---

## 📁 Estructura del proyecto

2️⃣ Instalar dependencias
npm install

3️⃣ Compilar la librería
npm run build


Genera los archivos en dist/:

dist/
 ├─ mapachito.es.js     (para import ESM)
 ├─ mapachito.umd.js    (para <script> global)
 └─ index.d.ts          (tipados TypeScript)


 🧩 Ejemplo rápido
import { mapachito } from 'mapachito';

class Home extends mapachito.Component {
  render() {
    this.setHTML(`
      <h1>Hola, soy Brandon 👋</h1>
      <p>Desarrollo interfaces fluidas y modulares con TypeScript Vanilla.</p>
    `);
  }
}

const router = new mapachito.Router({
  root: "#app",
  routes: [
    { path: "home", component: Home },
    { path: "about", component: About },
  ],
});

🔐 Seguridad

mapachito.Component incluye un sistema de saneamiento básico para evitar inyecciones XSS:

this.setHTML(`<p>${userInput}</p>`); // limpia scripts y eventos inline


Elimina <script>, <iframe>, <object>, <embed>.

Quita atributos como onClick, onError, srcdoc.

Bloquea URLs javascript:.

Usa setText() para texto literal seguro.

🧠 API Reference
mapachito.Component
Método	Descripción
render()	Método abstracto: define el contenido del componente.
mount()	Llama render() y luego onMount().
onMount()	Callback opcional después del render.
unmount()	Callback opcional antes de desmontar el componente.
setHTML(html)	Inyecta HTML saneado dentro del elemento.
setText(text)	Inserta texto plano, sin HTML.
mapachito.Router
Método / Propiedad	Descripción
routes	Lista de rutas { path, component }.
root	Elemento raíz donde se montan los componentes.
handleRoute()	Interno: gestiona cambios de hash.
current	Último componente montado.
RouteConfig (type)
interface RouteConfig {
  path: string;
  component: new (...args: any[]) => Component;
}

🧩 Ejemplo completo
import { mapachito } from 'mapachito';

class Home extends mapachito.Component {
  render() {
    this.setHTML(`<h1>Inicio</h1><p>Bienvenido a mi portafolio 🦝</p>`);
  }
}

class About extends mapachito.Component {
  render() {
    this.setHTML(`<h1>Sobre mí</h1><p>Frontend Developer apasionado por UI/UX.</p>`);
  }
}

const router = new mapachito.Router({
  root: "#app",
  routes: [
    { path: "home", component: Home },
    { path: "about", component: About },
  ],
});

🧰 Scripts disponibles
Comando	Descripción
npm run dev	Modo desarrollo (preview con Vite).
npm run build	Compila la librería en dist/.
npm run test	Ejecuta pruebas (si usas Vitest).

🧱 Filosofía de diseño
Principio	Aplicación
Simplicidad ante todo	Cada módulo cumple una sola función.
Seguridad integrada	No se confía en HTML sin filtrar.
Composición por clases	Sin sintaxis propietaria, 100% ECMAScript.
Extensibilidad futura	Base lista para añadir Store, Anim, UI.
Vanilla elegancia	Demuestra dominio del DOM sin frameworks.

🦾 Roadmap
Versión	Objetivo
0.1.0	Component + Router básicos (actual).
0.2.0	Módulo Anim (transiciones entre rutas).
0.3.0	Módulo Store (estado reactivo).
0.4.0	Utilidades (utils, events, observer).
1.0.0	Publicación oficial en npm.

🧑‍💻 Autor
Brandon Castillo
Javscript Developer
📫 brandon@mapachedev.com

🌐 mapachedev.com

⚖️ Licencia
MIT License