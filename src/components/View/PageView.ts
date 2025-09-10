import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class PageView extends Component<void> {
  protected content: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.content = ensureElement<HTMLElement>(
      ".gallery",
      document.body as unknown as HTMLElement
    );
  }

  setLocked(state: boolean): void {
    const body = ensureElement<HTMLElement>("body");
    body.classList.toggle("page__body_locked", state);
  }
}
