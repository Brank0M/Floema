import map from "lodash/map";
import { Plane, Transform } from "ogl";
import GSAP from "gsap";
import Prefix from "prefix";
import Media from "./Media";

export default class {
    constructor({ gl, scene, sizes, transition }) {
        this.id = "collections";
        this.gl = gl;
        this.scene = scene; // scene this.scene is a Transform() object
        this.sizes = sizes;
        this.transition = transition;

        this.transformPrefix = Prefix("transform");
        this.scene = new Transform();

        this.galleryElement = document.querySelector(".collections_gallery");
        this.galleryWrapperElement = document.querySelector(".collections_gallery_wrapper");

        this.collectionElements = document.querySelectorAll(".collections_article");
        this.collectionElementsActive = "collections_article--active";
        this.titlesElements = document.querySelector(".collections_titles");
        this.mediasElements = document.querySelectorAll(".collections_gallery_media");

        this.scroll = {
            current: 0,
            target: 0,
            start: 0,
            lerp: 0.1,
            velocity: 1,
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
     * Animations.
     */

    show() {
        if (this.transition) {
            this.transition.animate(this.medias[0].mesh, _ => {

            });
        }

        map(this.medias, (media) => media.show());
    }

    hide() {
        map(this.medias, (media) => media.hide());
    }

    /**
     * Events.
     */

    onResize(event) {
        this.sizes = event.sizes;

        this.bounds = this.galleryWrapperElement.getBoundingClientRect();
        // this.width = this.bounds.width / window.innerWidth * this.sizes.width;

        this.scroll.last = this.scroll.target = 0;
        this.scroll.limit = this.bounds.width - this.medias[0].element.clientWidth;

        map(this.medias, (media) => { media.onResize(event, this.scroll) });
    }

    onTouchDown({ x, y }) {
        this.scroll.last = this.scroll.current;
    }

    onTouchMove({ x, y }) {
        const distance = x.start - x.end;

        this.scroll.target = this.scroll.last - distance;
    }

    onTouchUp({ x, y }) { }

    onWheel({ pixelY }) {
        this.scroll.target += pixelY;
    }

    /**
     * Change.
     */

    onChange(index) {
        this.index = index;

        const selectedCollection = parseInt(this.mediasElements[this.index].getAttribute("data-index"));

        map(this.collectionElements, (element, elementIndex) => {
            if (elementIndex === selectedCollection) {
                element.classList.add(this.collectionElementsActive);
            } else {
                element.classList.remove(this.collectionElementsActive);
            }
        });

        this.titlesElements.style[this.transformPrefix] = `translateY(${150 * selectedCollection
            }%) translate(-50%,-270%) rotate(-90deg)`
    }

    /**
     * Update.
     */

    update() {
        this.scroll.target = GSAP.utils.clamp(-this.scroll.limit, 0, this.scroll.target);

        this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.lerp);

        this.galleryElement.style[this.transformPrefix] = `translateX(${this.scroll.current}px, 0, 0)`;
        if (this.scroll.last < this.scroll.current) {
            this.scroll.direction = "right";
        } else if (this.scroll.last > this.scroll.current) {
            this.scroll.direction = "left";
        }

        this.scroll.last = this.scroll.current

        const index = Math.floor(Math.abs(this.scroll.current / this.scroll.limit) * this.medias.length);

        if (this.index !== index) {
            this.onChange(index);
        }

        map(this.medias, (media, index) => {
            media.update(this.scroll.current, this.index);

            media.mesh.position.y += Math.cos((media.mesh.position.x / this.sizes.width) * Math.PI * 0.1) * 40 - 40;


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
