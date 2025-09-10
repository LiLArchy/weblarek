import { AbstractCardView } from "./AbstractCardView";
import { IProduct } from "../../../types";

export class CatalogCardView extends AbstractCardView<IProduct> {
  constructor(container: HTMLElement, onSelect?: (id: string) => void) {
    super(container);
    if (onSelect) {
      this.container.addEventListener("click", (e) => {
        e.preventDefault();
        onSelect(this["id"]);
      });
    }
  }

  // Для каталога отдельной кнопки нет, вся карточка кликабельна
  setInCart(_inCart: boolean): void {
    // Ничего не делаем для текущего шаблона каталога
  }
}
