import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerModel {
  private payment: TPayment = "online";
  private address: string = "";
  private phone: string = "";
  private email: string = "";
  constructor(private events?: IEvents) {}

  public setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.email !== undefined) this.email = data.email;
    this.events?.emit("buyer:changed", this.getData());
  }

  public getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  public clear(): void {
    this.payment = "online";
    this.address = "";
    this.phone = "";
    this.email = "";
    this.events?.emit("buyer:changed", this.getData());
  }

  public validate(): {
    valid: boolean;
    errors: Partial<Record<keyof IBuyer, string>>;
  } {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.address.trim()) {
      errors.address = "Адрес обязателен";
    }

    if (!this.phone.trim()) {
      errors.phone = "Телефон обязателен";
    } else if (!/^\+?\d{10,15}$/.test(this.phone.trim())) {
      errors.phone = "Некорректный телефон";
    }

    if (!this.email.trim()) {
      errors.email = "Email обязателен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())) {
      errors.email = "Некорректный email";
    }

    const valid = Object.keys(errors).length === 0;
    return { valid, errors };
  }

  // Валидация только для шага заказа (оплата и адрес)
  public validateOrder(): {
    valid: boolean;
    errors: Partial<Record<keyof IBuyer, string>>;
  } {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.address.trim()) {
      errors.address = "Адрес обязателен";
    }

    if (!this.payment) {
      // на случай если поле отсутствует
      errors.payment = "Способ оплаты обязателен" as any;
    }

    const valid = Object.keys(errors).length === 0;
    return { valid, errors };
  }

  // Валидация только для шага контактов (email и телефон)
  public validateContacts(): {
    valid: boolean;
    errors: Partial<Record<keyof IBuyer, string>>;
  } {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.phone.trim()) {
      errors.phone = "Телефон обязателен";
    } else if (!/^\+?\d{10,15}$/.test(this.phone.trim())) {
      errors.phone = "Некорректный телефон";
    }

    if (!this.email.trim()) {
      errors.email = "Email обязателен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())) {
      errors.email = "Некорректный email";
    }

    const valid = Object.keys(errors).length === 0;
    return { valid, errors };
  }
}
