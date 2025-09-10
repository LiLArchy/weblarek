import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class CatalogView extends Component<void> {
  protected list: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.list = ensureElement<HTMLElement>(".gallery");
  }

  setItems(nodes: HTMLElement[]): void {
    this.list.replaceChildren(...nodes);
  }

  clear(): void {
    this.list.replaceChildren();
  }
}
