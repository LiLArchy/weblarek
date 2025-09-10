import { Component } from "../../../components/base/Component";
import { ensureElement } from "../../../utils/utils";

export abstract class BaseFormView<T> extends Component<void> {
  protected formEl: HTMLFormElement;
  protected submitButtonEl: HTMLButtonElement;
  protected errorsEl: HTMLElement;

  constructor(
    container: HTMLElement,
    onSubmit?: () => void,
    onChange?: (data: Partial<T>) => void
  ) {
    super(container);
    // container может уже быть формой (когда шаблон начинается с <form>)
    this.formEl = container instanceof HTMLFormElement
      ? container
      : ensureElement<HTMLFormElement>("form", container);
    this.submitButtonEl = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container
    );
    this.errorsEl = ensureElement<HTMLElement>(".form__errors", container);

    if (onSubmit) {
      this.formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        onSubmit();
      });
    }
    if (onChange) {
      this.formEl.addEventListener("input", () => onChange(this.readForm()));
    }
  }

  setDisabled(state: boolean): void {
    this.submitButtonEl.disabled = state;
  }

  setErrors(errors: Partial<Record<keyof T, string>>): void {
    const list = Object.values(errors).filter(Boolean);
    this.errorsEl.textContent = list.join("\n");
  }

  protected abstract readForm(): Partial<T>;
}
