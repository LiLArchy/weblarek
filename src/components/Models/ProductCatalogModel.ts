import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductCatalogModel {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;
  constructor(private events?: IEvents) {}

  public setProducts(products: IProduct[]): void {
    this.products = Array.isArray(products) ? [...products] : [];
    this.events?.emit("catalog:changed", { total: this.products.length });
  }

  public getProducts(): IProduct[] {
    return [...this.products];
  }

  public getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  public setSelectedProduct(product: IProduct | null): void {
    this.selectedProduct = product;
    this.events?.emit("product:selected:changed", { id: product?.id ?? null });
  }

  public getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
