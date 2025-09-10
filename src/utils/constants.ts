/* Константа для получения полного пути для сервера. Для выполнения запроса 
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`;
/* Константа для формирования полного пути к изображениям карточек. 
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

export const settings = {};

// Соответствие названия категории модификатору класса для card__category
export const categoryMap: Record<string, string> = {
  "софт-скил": "soft",
  "хард-скил": "hard",
  другое: "other",
  дополнительное: "additional",
};
