import { IProduct } from '../../types';

export class ProductCatalogModel {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    public setProducts(products: IProduct[]): void {
        this.products = Array.isArray(products) ? [...products] : [];
    }

    public getProducts(): IProduct[] {
        return [...this.products];
    }

    public getProductById(id: string): IProduct | undefined {
        return this.products.find((product) => product.id === id);
    }

    public setSelectedProduct(product: IProduct | null): void {
        this.selectedProduct = product;
    }

    public getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}


