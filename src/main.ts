import "./scss/styles.scss";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { CatalogView } from "./components/View/CatalogView";
import { CatalogCardView } from "./components/View/cards/CatalogCardView";
import { PreviewCardView } from "./components/View/cards/PreviewCardView";
import { CartItemView } from "./components/View/cards/CartItemView";
import { CartView } from "./components/View/CartView";
import { OrderFormView } from "./components/View/forms/OrderFormView";
import { ContactsFormView } from "./components/View/forms/ContactsFormView";
import { ModalView } from "./components/View/ModalView";
import { EventEmitter } from "./components/base/Events";
import { ProductCatalogModel } from "./components/Models/ProductCatalogModel";
import { CartModel } from "./components/Models/CartModel";
import { BuyerModel } from "./components/Models/BuyerModel";
import { Api, WebLarekApi } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { CDN_URL } from "./utils/constants";

// Брокер событий
const events = new EventEmitter();

// DOM ссылки и шаблоны
const gallery = ensureElement<HTMLElement>(".gallery");
const modalContainer = ensureElement<HTMLElement>("#modal-container");
const tplCatalog = ensureElement<HTMLTemplateElement>("#card-catalog");
const tplPreview = ensureElement<HTMLTemplateElement>("#card-preview");
const tplBasket = ensureElement<HTMLTemplateElement>("#basket");
const tplBasketItem = ensureElement<HTMLTemplateElement>("#card-basket");
const tplOrder = ensureElement<HTMLTemplateElement>("#order");
const tplContacts = ensureElement<HTMLTemplateElement>("#contacts");

// Модели данных
const productsModel = new ProductCatalogModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// Представления
const catalogView = new CatalogView(gallery);
const modalView = new ModalView(modalContainer, () =>
  events.emit("modal:closed")
);

// Рендер каталога
events.on("catalog:changed", () => {
  const items = productsModel.getProducts();
  const nodes = items.map((p) => {
    const node = cloneTemplate<HTMLElement>(tplCatalog);
    const card = new CatalogCardView(node, (id) =>
      events.emit("view:product:selected", { id })
    );
    card["setId"](p.id);
    card["setTitle"](p.title);
    card["setCategory"](p.category);
    card["setImageSrc"](`${CDN_URL}${p.image}`, p.title);
    card["setPrice"](p.price);
    return card.render();
  });
  catalogView.setItems(nodes);
});

// Открытие предпросмотра
events.on<{ id: string }>("view:product:selected", ({ id }) => {
  const p = productsModel.getProductById(id);
  if (!p) return;
  const node = cloneTemplate<HTMLElement>(tplPreview);
  const preview = new PreviewCardView(node, () =>
    events.emit("view:product:addToCart", { id })
  );
  preview["setId"](p.id);
  preview["setTitle"](p.title);
  preview["setCategory"](p.category);
  preview["setImageSrc"](`${CDN_URL}${p.image}`, p.title);
  preview["setPrice"](p.price);
  preview["setDescription"](p.description);
  modalView.open(preview.render());
});

// Добавление в корзину
events.on<{ id: string }>("view:product:addToCart", ({ id }) => {
  const product = productsModel.getProductById(id);
  if (!product) return;
  cartModel.addItem(product);
  modalView.close();
});

// Открытие корзины по кнопке в шапке
const headerBasketBtn = ensureElement<HTMLButtonElement>(".header__basket");
const headerBasketCounter = ensureElement<HTMLElement>(
  ".header__basket-counter"
);
headerBasketBtn.addEventListener("click", () => events.emit("view:cart:open"));

// Обновление счётчика корзины
events.on("cart:changed", () => {
  headerBasketCounter.textContent = String(cartModel.getCount());
  // Debug: log cart state
  console.log("[cart:changed]", {
    count: cartModel.getCount(),
    total: cartModel.getTotal(),
    items: cartModel.getItems().map((i) => i.id),
  });
  // If cart modal is open, re-render its contents so delete buttons update UI immediately
  const isModalOpen = modalContainer.classList.contains("modal_active");
  const isBasketVisible = Boolean(
    modalContainer.querySelector(".basket")
  );
  if (isModalOpen && isBasketVisible) {
    events.emit("view:cart:open");
  }
});

// Рендер корзины
events.on("view:cart:open", () => {
  const basketNode = cloneTemplate<HTMLElement>(tplBasket);
  const cartView = new CartView(basketNode, () =>
    events.emit("view:order:open")
  );

  const items = cartModel.getItems().map((p, index) => {
    const node = cloneTemplate<HTMLElement>(tplBasketItem);
    node.querySelector(".basket__item-index")!.textContent = String(index + 1);
    const item = new CartItemView(node, (rid) => {
      console.log("[cart:item:remove]", rid);
      cartModel.removeItem(rid);
    });
    item["setId"](p.id);
    item["setTitle"](p.title);
    item["setPrice"](p.price);
    // log each item rendering in cart
    console.log("[cart:item]", { id: p.id, title: p.title, price: p.price });
    return item.render();
  });

  const total = cartModel.getTotal();
  console.log("[cart:view:open]", { items: cartModel.getItems(), total });

  cartView.setItems(items);
  cartView.setTotal(total);
  modalView.open(cartView.render());
});

// Последовательность оформления заказа: Order -> Contacts
events.on("view:order:open", () => {
  const node = cloneTemplate<HTMLElement>(tplOrder);
  const orderForm = new OrderFormView(
    node,
    () => events.emit("view:contacts:open"),
    (data) => {
      const valid = Boolean(data.address) && Boolean(data.payment);
      orderForm.setDisabled(!valid);
      buyerModel.setData({ address: data.address!, payment: data.payment! });
      console.log("[buyer:update:order]", buyerModel.getData());
    }
  );
  modalView.open(orderForm.render());
});

events.on("view:contacts:open", () => {
  const node = cloneTemplate<HTMLElement>(tplContacts);
  const contactsForm = new ContactsFormView(
    node,
    () => events.emit("view:order:success"),
    (data) => {
      const emailOk = Boolean(data.email && /@/.test(data.email));
      const phoneOk = Boolean(data.phone && data.phone.length >= 6);
      contactsForm.setDisabled(!(emailOk && phoneOk));
      buyerModel.setData({ email: data.email!, phone: data.phone! });
      console.log("[buyer:update:contacts]", buyerModel.getData());
    }
  );
  modalView.open(contactsForm.render());
});

events.on("view:order:success", () => {
  const successTpl = ensureElement<HTMLTemplateElement>("#success");
  const orderData = buyerModel.getData();
  const items = cartModel.getItems().map((p) => p.id);
  const total = cartModel.getTotal();

  const payload = {
    ...orderData,
    items,
    total,
  };

  console.log("[order:create:request]", payload);

  weblarekApi
    .createOrder(payload)
    .then((response) => {
      console.log("[order:create:success]", response);
      const node = cloneTemplate<HTMLElement>(successTpl);
      const desc = node.querySelector<HTMLElement>(
        ".order-success__description"
      );
      if (desc) desc.textContent = `Списано ${response.total} синапсов`;
      node
        .querySelector(".order-success__close")!
        .addEventListener("click", () => {
          modalView.close();
        });
      modalView.open(node);
      cartModel.clear();
      buyerModel.clear();
    })
    .catch((err) => {
      console.error("[order:create:error]", err);
      const node = cloneTemplate<HTMLElement>(successTpl);
      const title = node.querySelector<HTMLElement>(".order-success__title");
      const desc = node.querySelector<HTMLElement>(
        ".order-success__description"
      );
      if (title) title.textContent = "Ошибка оформления заказа";
      if (desc) desc.textContent = String(err ?? "Неизвестная ошибка");
      node
        .querySelector(".order-success__close")!
        .addEventListener("click", () => {
          modalView.close();
        });
      modalView.open(node);
    });
});

// Загрузка каталога с сервера
const baseApi = new Api(API_URL);
const weblarekApi = new WebLarekApi(baseApi);

weblarekApi
  .getProducts()
  .then((products) => {
    productsModel.setProducts(products);
    console.log("[catalog:loaded]", { count: products.length });
  })
  .catch((err) => {
    console.error("Ошибка загрузки каталога с сервера", err);
  });
