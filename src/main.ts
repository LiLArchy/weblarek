import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { ProductCatalogModel } from './components/Models/ProductCatalogModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { Api, WebLarekApi } from './components/base/Api';
import { API_URL } from './utils/constants';

// Проверка работы моделей данных в консоли

// Каталог товаров
const productsModel = new ProductCatalogModel();
productsModel.setProducts(apiProducts.items);
console.log('Каталог: массив товаров', productsModel.getProducts());

const firstId = apiProducts.items[0]?.id;
const missingId = 'missing-id';
console.log('Каталог: товар по первому id', firstId, productsModel.getProductById(firstId));
console.log('Каталог: товар по несуществующему id', missingId, productsModel.getProductById(missingId));

productsModel.setSelectedProduct(apiProducts.items[1] ?? null);
console.log('Каталог: выбранный товар', productsModel.getSelectedProduct());
productsModel.setSelectedProduct(null);
console.log('Каталог: выбранный товар после сброса', productsModel.getSelectedProduct());

// Корзина
const cartModel = new CartModel();
console.log('Корзина: стартовые товары', cartModel.getItems());

const p1 = apiProducts.items[0];
const p2 = apiProducts.items[2];
cartModel.addItem(p1);
console.log('Корзина: после добавления первого товара', cartModel.getItems());
cartModel.addItem(p2);
console.log('Корзина: после добавления второго товара', cartModel.getItems());
cartModel.addItem(p1); // повторно — не должен дублировать
console.log('Корзина: после повторного добавления первого товара', cartModel.getItems());

console.log('Корзина: количество товаров', cartModel.getCount());
console.log('Корзина: содержит первый товар?', cartModel.hasItem(p1.id));

console.log('Корзина: общая стоимость', cartModel.getTotal());
cartModel.removeItem(p1.id);
console.log('Корзина: после удаления первого товара', cartModel.getItems());
console.log('Корзина: общая стоимость после удаления', cartModel.getTotal());
cartModel.clear();
console.log('Корзина: после очистки', cartModel.getItems(), 'count:', cartModel.getCount());

// Покупатель
const buyerModel = new BuyerModel();
console.log('Покупатель: начальные данные', buyerModel.getData());

buyerModel.setData({
    payment: 'online',
    address: 'г. Москва, ул. Пушкина, д. Колотушкина',
    phone: '+79990000000',
    email: 'user@example.com',
});
console.log('Покупатель: после setData', buyerModel.getData());
console.log('Покупатель: валидация (ожидаем valid=true)', buyerModel.validate());

buyerModel.setData({ email: 'wrong@format', phone: '123' });
console.log('Покупатель: валидация при некорректных email/phone', buyerModel.validate());

buyerModel.clear();
console.log('Покупатель: после очистки', buyerModel.getData());
console.log('Покупатель: валидация после очистки (ожидаем ошибки)', buyerModel.validate());

// --- Слой коммуникации: получение каталога с сервера ---
const baseApi = new Api(API_URL);
const weblarekApi = new WebLarekApi(baseApi);

weblarekApi
    .getProducts()
    .then((products) => {
        productsModel.setProducts(products);
        console.log('Каталог (с сервера): массив товаров', productsModel.getProducts());
    })
    .catch((err) => {
        console.error('Ошибка загрузки каталога с сервера', err);
    });