import Button from "classes/Button";
import Page from "classes/Page";

export default class Detail extends Page {
  constructor() {
    super({
      id: "detail",
      element: ".detail",
      elements: {
        button: ".detail_button",
      },
    });
  }

  create() {
    super.create();

    this.link = new Button({
      element: this.elements.button,
    });
  }

  destroy() {
    super.destroy(); // Extending function from Page class to destroy the page

    this.link.removeEventListeners();
  }
}
