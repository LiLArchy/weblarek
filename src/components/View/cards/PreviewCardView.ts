import { AbstractCardView } from "./AbstractCardView";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";

export class PreviewCardView extends AbstractCardView<IProduct> {
  protected descriptionEl: HTMLElement;
  protected actionButton: HTMLButtonElement;

  constructor(container: HTMLElement, onAction?: (id: string) => void) {
    super(container);
    this.descriptionEl = ensureElement<HTMLElement>(".card__text", container);
    this.actionButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      container
    );
    if (onAction) {
      this.actionButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        onAction(this["id"]);
      });
    }
  }

  setDescription(text: string): void {
    this.descriptionEl.textContent = text;
  }
}
