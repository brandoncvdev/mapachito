import { Component } from '../component/component';
import { RouteConfig } from '../types';
import { animateElement } from '../utils/animate';

export interface RouterOptions {
  root: HTMLElement;
  routes: RouteConfig[];
  mode?: 'hash' | 'history';
  defaultRoute?: string;
  transitionDuration?: number;
  onRouteChange?: (path: string) => void;
}

export class Router {
  private root: HTMLElement;
  private routes: RouteConfig[];
  private defaultRoute: string;
  private currentComponent?: Component;
  private onRouteChange?: (path: string) => void;
  private transitionDuration: number;
  private currentPath = '';
  private mode: 'hash' | 'history';

  private beforeEachGuard?: (path: string) => boolean | Promise<boolean>;
  private afterEachHook?: (path: string) => void;

  constructor(options: RouterOptions) {
    this.root = options.root;
    this.routes = options.routes;
    this.defaultRoute = options.defaultRoute ?? this.routes[0]?.path ?? '';
    this.onRouteChange = options.onRouteChange;
    this.transitionDuration = options.transitionDuration ?? 350;
    this.mode = options.mode ?? 'history';
  }

  setBeforeEach(fn: (path: string) => boolean | Promise<boolean>) {
    this.beforeEachGuard = fn;
  }

  setAfterEach(fn: (path: string) => void) {
    this.afterEachHook = fn;
  }

  start() {
    window.addEventListener('hashchange', () => this.resolveRoute());
    this.resolveRoute();
  }

  private async resolveRoute(): Promise<void> {
    let path = '';

    if (this.mode === 'hash') {
      const hash = location.hash.replace(/^#\/?/, '');
      if (!hash) {
        location.hash = this.defaultRoute;
        path = this.defaultRoute;
      } else {
        path = hash;
      }
    } else {
      path = location.pathname.replace(/^\//, '') || this.defaultRoute;

      if (location.pathname === '/') {
        history.replaceState(null, '', '/' + this.defaultRoute);
      }
    }

    if (path === this.currentPath) return;

    const found = this.routes.find(
      (r) => path === r.path || path.startsWith(`${r.path}/`)
    );

    if (!found) {
      console.warn(`[Mapachito Router] Ruta no encontrada: "${path}"`);
      return;
    }

    if (this.beforeEachGuard) {
      const allowed = await this.beforeEachGuard(path);
      if (!allowed) return;
    }

    if (found.canActivate) {
      const allowed = await found.canActivate();
      if (!allowed) return;
    }

    this.currentPath = path;
    this.mountRoute(found, path);
  }

  private async mountRoute(route: RouteConfig, path: string): Promise<void> {
    try {
      if (this.currentComponent) {
        const el = this.currentComponent.el;
        await animateElement(
          el,
          [
            { opacity: 1, transform: 'translateY(0)' },
            { opacity: 0, transform: 'translateY(12px)' },
          ],
          { duration: this.transitionDuration, easing: 'ease' }
        );
        this.currentComponent.onLeave?.();
        el.remove();
        this.currentComponent.onDestroy?.();
      }

      const container = document.createElement('div');
        console.log('🔥 animación terminada', getComputedStyle(container).opacity);
      container.className = 'page-container';
      container.style.opacity = '0';
      this.root.appendChild(container);

      const instance = new route.component(container);
      instance.mount();
      this.currentComponent = instance;
      this.currentComponent.onEnter?.(path);

      await animateElement(
        container,
        [
          { opacity: 0, transform: 'translateY(12px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: this.transitionDuration, easing: 'ease' }
      );

      this.onRouteChange?.(path);
    } catch (err) {
      console.error(`[Mapachito Router] Error al montar la ruta "${path}"`, err);
    }
  }
}
