import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class HeaderView extends Component<void> {
  protected basketButton: HTMLButtonElement;
  protected basketCounter: HTMLElement;

  constructor(container: HTMLElement, onCartClick?: () => void) {
    super(container);
    const root = ensureElement<HTMLElement>(".header");
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      root
    );
    this.basketCounter = ensureElement<HTMLElement>(
      ".header__basket-counter",
      root
    );

    if (onCartClick) {
      this.basketButton.addEventListener("click", onCartClick);
    }
  }

  setCartCount(count: number): void {
    this.basketCounter.textContent = String(count);
  }
}
