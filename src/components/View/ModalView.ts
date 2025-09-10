import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class ModalView extends Component<void> {
  protected contentEl: HTMLElement;
  protected closeButtonEl: HTMLButtonElement;
  protected isOpen = false;

  constructor(container: HTMLElement, onClose?: () => void) {
    super(container);
    this.contentEl = ensureElement<HTMLElement>(".modal__content", container);
    this.closeButtonEl = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container
    );
    this.closeButtonEl.addEventListener("click", (e) => {
      e.preventDefault();
      this.close();
      onClose && onClose();
    });
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) {
        this.close();
        onClose && onClose();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (this.isOpen && e.key === "Escape") {
        this.close();
        onClose && onClose();
      }
    });
  }

  open(node: HTMLElement): void {
    this.contentEl.replaceChildren(node);
    this.container.classList.add("modal_active");
    this.isOpen = true;
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.contentEl.replaceChildren();
    this.isOpen = false;
  }
}
