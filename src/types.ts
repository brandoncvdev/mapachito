import type { Component } from "./component";

export interface RouteConfig {
  path: string;
  component: new (...args: any[]) => Component;
}

/**
 * Props genéricos para cualquier componente.
 * Se puede extender según el caso.
 */
export type ComponentProps = Record<string, any>;

/**
 * Interfaz opcional para componentes que implementan `unmount`.
 */
export interface Unmountable {
  unmount(): void;
}