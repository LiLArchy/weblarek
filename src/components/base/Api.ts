type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    get<T extends object>(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse<T>);
    }

    post<T extends object>(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse<T>);
    }
}


import type { IApi, IOrderRequest, IOrderResponse, IProduct, IProductListResponse } from '../../types';

export class WebLarekApi {
    protected api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    // Получить каталог товаров: GET /product/
    public async getProducts(): Promise<IProduct[]> {
        const response = await this.api.get<IProductListResponse>('/product/');
        return response.items ?? [];
    }

    // Отправить заказ: POST /order/
    public createOrder(data: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', data);
    }
}
