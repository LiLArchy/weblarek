export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}


export type TPayment = 'online' | 'cash';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}


// Ответ на получение каталога с сервера
export interface IProductListResponse {
    total: number;
    items: IProduct[];
}

// Данные для отправки заказа на сервер
// Используем уже существующий интерфейс IBuyer и дополняем его списком товаров и суммой
export interface IOrderRequest extends IBuyer {
    items: string[]; // массив id выбранных продуктов
    total: number; // итоговая сумма заказа
}

// Ответ сервера при оформлении заказа
export interface IOrderResponse {
    id: string; // идентификатор созданного заказа
    total: number; // подтвержденная сумма заказа
}

