export abstract class Component<T = any> {
  public el: HTMLElement;
  protected props: T;

  constructor(selector: string | HTMLElement, props?: T) {
    const element =
      typeof selector === "string"
        ? document.querySelector(selector)
        : selector;

    if (!element)
      throw new Error(
        `mapachito.Component: no se encontró el elemento "${selector}".`
      );

    this.el = element as HTMLElement;
    this.props = props ?? ({} as T);
  }

  abstract render(): void;

  protected setHTML(html: string) {
    this.el.innerHTML = this.safeHTML(html);
  }

  protected setText(text: string) {
    this.el.textContent = text;
  }

  private safeHTML(input: string): string {
    const div = document.createElement("div");
    div.innerHTML = input;

    div.querySelectorAll("script, iframe, object, embed").forEach((el) =>
      el.remove()
    );

    div.querySelectorAll("*").forEach((el) => {
      for (const attr of Array.from(el.attributes)) {
        if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
        if (attr.name === "srcdoc") el.removeAttribute(attr.name);
        if (attr.name === "href" && attr.value.startsWith("javascript:"))
          el.removeAttribute(attr.name);
      }
    });

    return div.innerHTML;
  }

  mount() {
    this.render();
    this.onMount?.();
  }

  unmount?(): void;
  onEnter?(path?: string): void;
  onMount?(): void;
  onLeave?(): void;
  onDestroy?(): void;
}
