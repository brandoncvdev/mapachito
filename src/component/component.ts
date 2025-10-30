export abstract class Component<T = any> {
  protected el: HTMLElement;
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

  /** Método abstracto que cada componente debe implementar */
  abstract render(): void;

  /** Renderiza HTML controlado (con sanitización básica) */
  protected setHTML(html: string) {
    this.el.innerHTML = this.safeHTML(html);
  }

  /** Renderiza texto literal (sin HTML) */
  protected setText(text: string) {
    this.el.textContent = text;
  }

  /** Sanea etiquetas peligrosas y atributos tipo onClick */
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

  /** Monta el componente */
  mount() {
    this.render();
    this.onMount?.();
  }

  /** Desmonta el componente (opcional) */
  unmount?(): void;

  /** Callback posterior al montaje (opcional) */
  onMount?(): void;
}
