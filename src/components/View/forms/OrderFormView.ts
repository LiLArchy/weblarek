import { BaseFormView } from "./BaseFormView";
import { ensureElement } from "../../../utils/utils";
import { TPayment } from "../../../types";

type OrderFormData = {
  payment: TPayment;
  address: string;
};

export class OrderFormView extends BaseFormView<OrderFormData> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(
    container: HTMLElement,
    onSubmit?: () => void,
    onChange?: (data: Partial<OrderFormData>) => void
  ) {
    super(container, onSubmit, onChange);
    const buttonsContainer = ensureElement<HTMLElement>(
      ".order__buttons",
      container
    );
    this.paymentButtons = Array.from(
      buttonsContainer.querySelectorAll("button")
    ) as HTMLButtonElement[];
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container
    );

    this.paymentButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.selectPayment(btn.name as TPayment);
        onChange && onChange(this.readForm());
      });
    });
  }

  setPayment(value: TPayment): void {
    this.selectPayment(value);
  }

  setAddress(value: string): void {
    this.addressInput.value = value;
  }

  protected readForm(): Partial<OrderFormData> {
    const selected = this.paymentButtons.find((b) =>
      b.classList.contains("button_alt-active")
    );
    const payment = (selected?.getAttribute("name") ?? "online") as TPayment;
    return {
      payment,
      address: this.addressInput.value,
    };
  }

  protected selectPayment(value: TPayment) {
    this.paymentButtons.forEach((b) =>
      b.classList.toggle("button_alt-active", b.name === value)
    );
  }
}
