import map from "lodash/map";
import { Plane, Transform } from "ogl";
import Media from "./Media";

export default class {
  constructor({ gl, scene }) {
    this.gl = gl;
    this.scene = scene; // scene is a Transform() object
    this.group = new Transform();

    this.medias = document.querySelectorAll(".home_gallery_media_image");

    this.createGeometry();
    this.createGallery();

    this.group.setParent(scene);
  }

  createGeometry() {
    this.geometry = new Plane(this.gl);
  }

  createGallery() {
    map(this.medias, (element, index) => {
      return new Media({
        element,
        geometry: this.geometry,
        index,
        gl: this.gl,
        scene: this.scene,
      });
    });
  }
}
