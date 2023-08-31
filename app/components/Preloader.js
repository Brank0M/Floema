import GSAP from "gsap";
import Component from "classes/Component";
import each from "lodash/each";
import { Texture } from "ogl";
import { split } from "utils/text";

export default class Preloader extends Component {
  constructor({ canvas }) {
    super({
      element: ".preloader",
      elements: {
        title: ".preloader_text",
        number: ".preloader_number",
        numberText: ".preloader_number_text",
        // images: document.querySelectorAll("img"),
      },
    });

    this.canvas = canvas;

    window.TEXTURES = {};

    split({
      element: this.elements.title,
      expression: "<br>",
    });

    split({
      element: this.elements.title,
      expression: "<br>",
    });

    this.elements.titleSpans =
      this.elements.title.querySelectorAll("span span");

    this.length = 0;

    // console.log(this.element, this.elements);

    this.createLoader();

  }

  createLoader() {
    // window.ASSETS.forEach(image => {
    //   const texture = new Texture(this.canvas.gl, {
    //     generateMipmaps: false,
    //   });

    each(window.ASSETS, (image) => {
      const texture = new Texture(this.canvas.gl, {
        generateMipmaps: false,
      });

      const media = new window.Image();

      media.crossOrigin = "anonymous";
      media.src = image;
      media.onload = (_) => {
        texture.image = media;

        this.onAssetLoaded(image);
      };

      window.TEXTURES[image] = texture;
    });
    // each(this.elements.images, (element) => {
    //   element.onload = (_) => this.onAssetLoaded(element);
    //   element.src = element.getAttribute("data-src");
    // });
  }

  onAssetLoaded(image) {
    this.length += 1;

    // const percent = this.length / this.elements.images.length;
    const percent = this.length / window.ASSETS.length;
    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`;

    if (percent === 1) {
      this.onLoaded();
    }
  }

  onLoaded() {
    return new Promise((resolve) => {
      // this.animateOut.call((_) => {
      this.emit("completed");
      // });

      this.animateOut = GSAP.timeline({
        delay: 1,
      });

      this.animateOut.to(this.elements.titleSpans, {
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.1,
        y: "100%",
      });

      this.animateOut.to(
        this.elements.numberText,
        {
          duration: 1.5,
          ease: "expo.out",
          stagger: 0.1,
          y: "100%",
        },
        "-=1.4"
      );

      this.animateOut.to(
        this.element,
        {
          autoAlpha: 0,
          duration: 1,
          // ease: "expo.out",
          // scaleY: 0,
          // transformOrigin: "100% 100%",
        },
        // "-=1"
      );

      this.animateOut.call((_) => {
        this.destroy();
        resolve();
      });
    });
  }

  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}
