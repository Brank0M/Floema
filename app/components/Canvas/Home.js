import map from "lodash/map";
import { Plane, Transform } from "ogl";
import GSAP from "gsap";
import Media from "./Media";

export default class {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.scene = scene; // scene is a Transform() object
    this.sizes = sizes;
    // this.scene = new Transform(); // test line
    this.group = new Transform();

    this.mediasElements = document.querySelectorAll(
      ".home_gallery_media_image"
    );

    this.createGeometry();
    this.createGallery();

    this.group.setParent(scene);
    // this.scene.setParent(scene);

    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1,
      multiplier: 0.5,
    };

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1,
      multiplier: 0.5,
    };

    this.scrollCurrent = {
      x: 0,
      y: 0,
    };

    this.scroll = {
      x: 0,
      y: 0,
    };
  }

  createGeometry() {
    this.geometry = new Plane(this.gl);
  }

  createGallery() {
    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
        element,
        geometry: this.geometry,
        index,
        gl: this.gl,
        scene: this.scene,
        sizes: this.sizes,
      });
    });
  }

  /**
   * Events.
   */

  onResize(event) {
    map(this.medias, (media) => {
      media.onResize(event);
    });
  }

  onTouchDown({ x, y }) {
    this.scrollCurrent.x = this.scroll.x;
    this.scrollCurrent.y = this.scroll.y;
  }

  onTouchMove({ x, y }) {
    const distanceX = x.start - x.end;
    const distanceY = y.start - y.end;

    this.x.target = this.scrollCurrent.x - distanceX;
    this.y.target = this.scrollCurrent.y - distanceY;
  }

  onTouchUp({ x, y }) {}

  /**
   * Update.
   */

  update() {
    this.x.current = GSAP.utils.interpolate(
      this.x.current,
      this.x.target,
      this.x.lerp
    );
    this.y.current = GSAP.utils.interpolate(
      this.y.current,
      this.y.target,
      this.y.lerp
    );

    this.scroll.x = this.x.current;
    this.scroll.y = this.y.current;

    map(this.medias, (media) => {
      media.update(this.scroll);
    });
  }
}
