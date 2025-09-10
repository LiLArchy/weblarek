import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class CartView extends Component<void> {
  protected list: HTMLElement;
  protected totalEl: HTMLElement;
  protected orderButtonEl: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    onSubmit?: () => void,
    onClear?: () => void
  ) {
    super(container);
    this.list = ensureElement<HTMLElement>(".basket__list", container);
    this.totalEl = ensureElement<HTMLElement>(".basket__price", container);
    this.orderButtonEl = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container
    );
    if (onSubmit) {
      this.orderButtonEl.addEventListener("click", (e) => {
        e.preventDefault();
        onSubmit();
      });
    }
    if (onClear) {
      const clearBtn =
        container.querySelector<HTMLButtonElement>(".basket__clear");
      clearBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        onClear();
      });
    }
  }

  setItems(items: HTMLElement[]): void {
    this.list.replaceChildren(...items);
  }

  setTotal(total: number): void {
    this.totalEl.textContent = `${total} синапсов`;
  }
}
