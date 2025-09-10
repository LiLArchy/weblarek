import { BaseFormView } from "./BaseFormView";
import { ensureElement } from "../../../utils/utils";

type ContactsFormData = {
  email: string;
  phone: string;
};

export class ContactsFormView extends BaseFormView<ContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(
    container: HTMLElement,
    onSubmit?: () => void,
    onChange?: (data: Partial<ContactsFormData>) => void
  ) {
    super(container, onSubmit, onChange);
    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container
    );
  }

  setEmail(value: string): void {
    this.emailInput.value = value;
  }

  setPhone(value: string): void {
    this.phoneInput.value = value;
  }

  protected readForm(): Partial<ContactsFormData> {
    return {
      email: this.emailInput.value,
      phone: this.phoneInput.value,
    };
  }
}
