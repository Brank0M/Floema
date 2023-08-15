import Comment from "classes/Component.js";
import GSAP from "gsap";
import { COLOR_BRIGHT_GRAY, COLOR_QUARTER_SPANISH_WHITE } from "utils/colors";

export default class Navigation extends Comment {
  constructor({ template }) {
    super({
      element: ".navigation",
      elements: {
        items: ".navigation_list_item",
        links: ".navigation_list_item_link",
      },
    });
    this.onChange(template);
  }
  onChange(template) {
    if (template === "about") {
      GSAP.to(this.element, {
        color: COLOR_BRIGHT_GRAY,
        duration: 1.5,
      });
      GSAP.to(this.elements.items[0], {
        // Show the first item in the navigation list
        autoAlpha: 1,
        delay: 0.75,
        duration: 0.75,
      });
      GSAP.to(this.elements.items[1], {
        // Hide the second item in the navigation list
        autoAlpha: 0,
        duration: 0.75,
      });
    } else {
      GSAP.to(this.element, {
        color: COLOR_QUARTER_SPANISH_WHITE,
        duration: 1.5,
      });
      GSAP.to(this.elements.items[0], {
        // Hide the first item in the navigation list
        autoAlpha: 0,
        duration: 0.75,
      });
      GSAP.to(this.elements.items[1], {
        // Show the second item in the navigation list
        autoAlpha: 1,
        delay: 0.75,
        duration: 0.75,
      });
    }
  }
}
