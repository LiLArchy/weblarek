import { AbstractCardView } from "./AbstractCardView";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";

export class CartItemView extends AbstractCardView<IProduct> {
  protected removeButtonEl: HTMLButtonElement;
  protected indexEl?: HTMLElement | null;

  constructor(container: HTMLElement, onRemove?: (id: string) => void) {
    super(container);
    this.indexEl = container.querySelector<HTMLElement>(".basket__item-index");
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

  setIndex(index: number): void {
    if (this.indexEl) {
      this.indexEl.textContent = String(index);
    }
  }
}
