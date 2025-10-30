import type { Component } from "./component";

export interface RouteConfig {
  path: string;
  title?: string;
  component: new (selector: HTMLElement | string) => Component;
}
export type ComponentProps = Record<string, any>;

export interface Unmountable {
  unmount(): void;
}