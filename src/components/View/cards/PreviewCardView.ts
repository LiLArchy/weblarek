import { AbstractCardView } from "./AbstractCardView";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";

export class PreviewCardView extends AbstractCardView<IProduct> {
  protected descriptionEl: HTMLElement;
  protected actionButton: HTMLButtonElement;
  protected inCart: boolean = false;
  protected onActionInternal?: (id: string) => void;

  constructor(container: HTMLElement, onAction?: (id: string) => void) {
    super(container);
    this.descriptionEl = ensureElement<HTMLElement>(".card__text", container);
    this.actionButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      container
    );
    this.onActionInternal = onAction;
    this.actionButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.onActionInternal) {
        this.onActionInternal(this["id"]);
      }
    });
  }

  setDescription(text: string): void {
    this.descriptionEl.textContent = text;
  }

  setInCart(inCart: boolean): void {
    this.inCart = inCart;
    this.actionButton.textContent = inCart ? "Удалить" : "В корзину";
    this.actionButton.classList.toggle("button_alt", inCart);
  }

  setPriceless(state: boolean): void {
    // disable if priceless
    this.actionButton.disabled = state;
  }
}
