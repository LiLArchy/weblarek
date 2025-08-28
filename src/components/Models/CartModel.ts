import { IProduct } from '../../types';

export class CartModel {
    private items: IProduct[] = [];

    public getItems(): IProduct[] {
        return [...this.items];
    }

    public addItem(product: IProduct): void {
        if (!this.hasItem(product.id)) {
            this.items = [...this.items, product];
        }
    }

    public removeItem(productId: string): void {
        this.items = this.items.filter((item) => item.id !== productId);
    }

    public clear(): void {
        this.items = [];
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


