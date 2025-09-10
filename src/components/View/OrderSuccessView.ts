import { Component } from "../../components/base/Component";
import { cloneTemplate, ensureElement } from "../../utils/utils";

export class OrderSuccessView extends Component<{ total: number }> {
  protected titleEl: HTMLElement;
  protected descriptionEl: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, onClose?: () => void) {
    const node = cloneTemplate<HTMLElement>(template);
    super(node);
    this.titleEl = ensureElement<HTMLElement>(".order-success__title", node);
    this.descriptionEl = ensureElement<HTMLElement>(
      ".order-success__description",
      node
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      node
    );
    if (onClose) {
      this.closeButton.addEventListener("click", (e) => {
        e.preventDefault();
        onClose();
      });
    }
  }

  setTotal(total: number): void {
    this.descriptionEl.textContent = `Списано ${total} синапсов`;
  }
}
