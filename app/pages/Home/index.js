import Button from "classes/Button";
import Page from "classes/Page";

export default class Home extends Page {
  constructor() {
    super({
      id: "home",
      element: ".home",
      elements: {
        navigation: document.querySelector(".navigation"),
        link: ".home_link",
      },
    });
  }

  create() {
    super.create();

    this.link = new Button({
      element: this.elements.link,
    });
  }

  destroy() {
    super.destroy(); // Extending function from Page class to destroy the page

    this.link.removeEventListeners();
  }
}
