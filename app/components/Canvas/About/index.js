import map from "lodash/map";
import { Plane, Transform } from "ogl";
import GSAP from "gsap";
import Gallery from "./Gallery";

export default class {
    constructor({ gl, scene, sizes }) {
        this.gl = gl;
        this.scene = scene; // scene is a Transform() object
        this.sizes = sizes;
        // this.scene = new Transform(); // test line
        this.group = new Transform();

        this.createGeometry();
        this.createGalleries();

        // this.galleries = document.querySelectorAll(".about_gallery");

        this.group.setParent(scene);
        // this.scene.setParent(scene);

        this.show();

    }

    createGeometry() {
        this.geometry = new Plane(this.gl);
    }

    createGalleries() {
        this.galleriesElements = document.querySelectorAll(".about_gallery");


        this.galleries = map(this.galleriesElements, (element, index) => {
            return new Gallery({
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
        map(this.galleries, (gallery) => gallery.show());
    }

    hide() {
        map(this.galleries, (gallery) => gallery.hide());
    }

    /**
     * Events.
     */

    onResize(event) {
        map(this.galleries, (gallery) => gallery.onResize(event));
    }

    onTouchDown(event) {
        map(this.galleries, (gallery) => gallery.onTouchDown(event));
    }

    onTouchMove(event) {
        map(this.galleries, (gallery) => gallery.onTouchMove(event));
    }

    onTouchUp(event) {
        map(this.galleries, (gallery) => gallery.onTouchUp(event));
    }

    onWheel({ pixelX, pixelY }) { }


    /**
     * Update.
     */

    update() {
        map(this.galleries, (gallery) => gallery.update());
    }

    /**
     * Destroy.
     */
    destroy() {
        map(this.galleries, (gallery) => gallery.destroy());
    }

}
