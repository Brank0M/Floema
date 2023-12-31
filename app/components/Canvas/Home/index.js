import map from "lodash/map";
import { Plane, Transform } from "ogl";
import GSAP from "gsap";
import Media from "./Media";

export default class {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;
    this.scene = new Transform();
    // this.group = new Transform();

    this.galleryElement = document.querySelector(".home_gallery");
    this.mediasElements = document.querySelectorAll(".home_gallery_media_image");

    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.scrollCurrent = {
      x: 0,
      y: 0,
    };

    this.scroll = {
      x: 0,
      y: 0,
    };

    this.speed = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.createGeometry();
    this.createGallery();

    this.onResize({
      sizes: this.sizes,
    });

    // this.group.setParent(scene); // group it doesn't work
    this.scene.setParent(scene); // scene setParent works 

    this.show();
  }

  createGeometry() {
    this.geometry = new Plane(this.gl, {
      widthSegments: 20,
      heightSegments: 20,
    });
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
   * Animations.
   */

  show() {
    map(this.medias, (media) => media.show());
  }

  hide() {
    map(this.medias, (media) => media.hide());
  }

  /**
   * Events.
   */

  onResize(event) {
    this.galleryBounds = this.galleryElement.getBoundingClientRect();

    this.sizes = event.sizes;

    this.gallerySizes = {
      width: this.galleryBounds.width / window.innerWidth * this.sizes.width,
      height: this.galleryBounds.height / window.innerHeight * this.sizes.height,
    }

    this.scroll.x = this.x.target = 0;
    this.scroll.y = this.y.target = 0;

    map(this.medias, (media) => { media.onResize(event, this.scroll) });
  }

  onTouchDown({ x, y }) {
    this.speed.target = 0.3;
    this.scrollCurrent.x = this.scroll.x;
    this.scrollCurrent.y = this.scroll.y;
  }

  onTouchMove({ x, y }) {
    const distanceX = x.start - x.end;
    const distanceY = y.start - y.end;

    this.x.target = this.scrollCurrent.x - distanceX;
    this.y.target = this.scrollCurrent.y - distanceY;
  }

  onTouchUp({ x, y }) {
    this.speed.target = 0;
  }

  onWheel({ pixelX, pixelY }) {
    this.x.target += pixelX;
    this.y.target += pixelY;
  }

  /**
   * Update.
   */

  update() {
    this.speed.current = GSAP.utils.interpolate(this.speed.current, this.speed.target, this.speed.lerp);

    this.x.current = GSAP.utils.interpolate(this.x.current, this.x.target, this.x.lerp);
    this.y.current = GSAP.utils.interpolate(this.y.current, this.y.target, this.y.lerp);

    if (this.scroll.x < this.x.current) {
      this.x.direction = "right";
    } else if (this.scroll.x > this.x.current) {
      this.x.direction = "left";
    }

    // this.galleryHeight = this.galleryBounds.height / window.innerHeight * this.sizes.height;

    if (this.scroll.y < this.y.current) {
      this.y.direction = "top";
    } else if (this.scroll.y > this.y.current) {
      this.y.direction = "bottom";
    }

    this.scroll.x = this.x.current;
    this.scroll.y = this.y.current;

    map(this.medias, (media, index) => {
      const offsetX = this.sizes.width * 0.6;
      const scaleX = media.mesh.scale.x / 2;

      if (this.x.direction === "left") {
        const x = media.mesh.position.x + scaleX;

        if (x < -offsetX) {
          media.extra.x += this.gallerySizes.width;
          media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03);
        }
      } else if (this.x.direction === "right") {
        const x = media.mesh.position.x - scaleX;

        if (x > offsetX) {
          media.extra.x -= this.gallerySizes.width;
          media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03);
        }
      }

      const offsetY = this.sizes.height * 0.6;
      const scaleY = media.mesh.scale.y / 2;

      if (this.y.direction === "top") {
        const y = media.mesh.position.y + scaleY;

        if (y < -offsetY) {
          media.extra.y += this.gallerySizes.height;
          media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03);
        }
      } else if (this.y.direction === "bottom") {
        const y = media.mesh.position.y - scaleY;

        if (y > offsetY) {
          media.extra.y -= this.gallerySizes.height;
          media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03);
        }
      }

      media.update(this.scroll, this.speed.current);
    });
  }

  /**
   * Destroy.
   */
  destroy() {
    // this.scene.removeChild(this.group);
    this.scene.removeChild(this.scene);
  }
}
