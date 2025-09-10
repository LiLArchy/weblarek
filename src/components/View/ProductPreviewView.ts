import { Component } from "../../components/base/Component";
import { cloneTemplate } from "../../utils/utils";
import { PreviewCardView } from "./cards/PreviewCardView";
import { IProduct } from "../../types";

export class ProductPreviewView extends Component<IProduct> {
  protected card: PreviewCardView;

  constructor(template: HTMLTemplateElement, onAction?: (id: string) => void) {
    const node = cloneTemplate<HTMLElement>(template);
    super(node);
    this.card = new PreviewCardView(node, onAction);
  }
}
