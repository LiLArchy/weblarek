import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CartModel {
  private items: IProduct[] = [];
  constructor(private events?: IEvents) {}

  public getItems(): IProduct[] {
    return [...this.items];
  }

  public addItem(product: IProduct): void {
    // Бесценный товар (price === null) нельзя добавить
    if (product.price === null) {
      return;
    }
    if (!this.hasItem(product.id)) {
      this.items = [...this.items, product];
      this.events?.emit("cart:changed", {
        count: this.getCount(),
        total: this.getTotal(),
      });
    }
  }

  public removeItem(productId: string): void {
    this.items = this.items.filter((item) => item.id !== productId);
    this.events?.emit("cart:changed", {
      count: this.getCount(),
      total: this.getTotal(),
    });
  }

  public clear(): void {
    this.items = [];
    this.events?.emit("cart:changed", { count: 0, total: 0 });
  }

  public getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  public getCount(): number {
    return this.items.length;
  }

  public hasItem(productId: string): boolean {
    return this.items.some((item) => item.id === productId);
  }
}
