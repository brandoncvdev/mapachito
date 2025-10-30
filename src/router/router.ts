import type { RouteConfig } from "../types";

export interface RouterOptions {
  routes: RouteConfig[];
  root: string | HTMLElement;
}

export class Router {
  private routes: RouteConfig[];
  private root: HTMLElement;
  private current?: InstanceType<RouteConfig["component"]>;

  constructor(options: RouterOptions) {
    this.routes = options.routes;
    this.root =
      typeof options.root === "string"
        ? document.querySelector(options.root)!
        : options.root;

    if (!this.root) throw new Error("mapachito.Router: root no encontrado.");

    window.addEventListener("hashchange", () => this.handleRoute());
    this.handleRoute();
  }

  private handleRoute() {
    const hash = location.hash.replace(/^#\/?/, "") || "home";
    const route = this.routes.find((r) => r.path === hash);
    if (!route) return;

    // desmontar anterior
    this.current?.unmount?.();

    // limpiar contenedor
    this.root.innerHTML = "";

    // crear nuevo componente
    const ComponentClass = route.component;
    const instance = new ComponentClass(this.root);
    instance.mount();

    this.current = instance;
  }
}
