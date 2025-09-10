import { Component } from "../../../components/base/Component";
import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { categoryMap } from "../../../utils/constants";

export abstract class AbstractCardView<
  T extends IProduct
> extends Component<T> {
  protected id!: string;
  protected titleEl: HTMLElement;
  protected imageEl?: HTMLImageElement | null;
  protected categoryEl?: HTMLElement | null;
  protected priceEl: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleEl = ensureElement<HTMLElement>(".card__title", container);
    this.imageEl = container.querySelector<HTMLImageElement>(".card__image");
    this.categoryEl = container.querySelector<HTMLElement>(".card__category");
    this.priceEl = ensureElement<HTMLElement>(".card__price", container);
  }

  setId(id: string): void {
    this.id = id;
    this.container.dataset.id = id;
  }

  setTitle(title: string): void {
    this.titleEl.textContent = title;
  }

  setImageSrc(src: string, alt?: string): void {
    if (this.imageEl) {
      super.setImage(this.imageEl, src, alt ?? "");
    }
  }

  setCategory(category: string): void {
    if (this.categoryEl) {
      this.categoryEl.textContent = category;
      this.categoryEl.className = "card__category";
      const modifier = categoryMap[category] ?? "other";
      this.categoryEl.classList.add(`card__category_${modifier}`);
    }
  }

  setPrice(price: number | null): void {
    this.priceEl.textContent =
      price === null ? "Бесценно" : `${price} синапсов`;
  }

  onClick(handler: (id: string) => void): void {
    this.container.addEventListener("click", () => handler(this.id));
  }
}
