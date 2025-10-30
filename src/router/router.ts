import { Component } from '../component/component';
import { RouteConfig } from '../types';

export interface RouterOptions {
  root: HTMLElement;
  routes: RouteConfig[];
  defaultRoute?: string;
  onRouteChange?: (path: string) => void;
}

/**
 * Router base de Mapachito
 * Gestiona navegación por hash (#/ruta) y render dinámico de componentes.
 */
export class Router {
  private root: HTMLElement;
  private routes: RouteConfig[];
  private defaultRoute: string;
  private currentComponent?: Component;
  private onRouteChange?: (path: string) => void;

  constructor(options: RouterOptions) {
    this.root = options.root;
    this.routes = options.routes;
    this.defaultRoute = options.defaultRoute ?? this.routes[0]?.path ?? '';
    this.onRouteChange = options.onRouteChange;
  }

  /**
   * Inicia el router, escuchando cambios de hash.
   */
  start() {
    window.addEventListener('hashchange', () => this.resolveRoute());
    this.resolveRoute();
  }

  private resolveRoute() {
    const hash = location.hash.replace(/^#\/?/, '');
    const path = hash || this.defaultRoute;
    const route = this.routes.find((r) => r.path === path);

    if (!route) {
      console.warn(`[Mapachito Router] Ruta no encontrada: "${path}"`);
      return;
    }

    if (this.currentComponent && typeof (this.currentComponent as any).onDestroy === 'function') {
      (this.currentComponent as any).onDestroy();
    }

    this.root.innerHTML = '';

    try {
      const instance = new route.component(this.root);
      instance.mount();
      this.currentComponent = instance;

      // 🔄 Emitir evento reactivo
      this.onRouteChange?.(path);
    } catch (err) {
      console.error(`[Mapachito Router] Error al montar la ruta "${path}"`, err);
    }
  }
}
