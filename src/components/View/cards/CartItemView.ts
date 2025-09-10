import { AbstractCardView } from "./AbstractCardView";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";

export class CartItemView extends AbstractCardView<IProduct> {
  protected removeButtonEl: HTMLButtonElement;

  constructor(container: HTMLElement, onRemove?: (id: string) => void) {
    super(container);
    this.removeButtonEl = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container
    );
    if (onRemove) {
      this.removeButtonEl.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove(this["id"]);
      });
    }
  }
}
