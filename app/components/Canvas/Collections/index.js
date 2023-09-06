import map from "lodash/map";
import { Plane, Transform } from "ogl";
import GSAP from "gsap";
import Prefix from "prefix";
import Media from "./Media";

export default class {
    constructor({ gl, scene, sizes, transition }) {
        this.id = "collections";
        this.gl = gl;
        this.scene = scene;
        this.sizes = sizes;
        this.transition = transition;

        this.transformPrefix = Prefix("transform");

        this.group = new Transform();

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

        this.group.setParent(this.scene);

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
                scene: this.group,
                sizes: this.sizes,
            });
        });
    }

    /**
     * Animations.
     */

    async show() {
        if (this.transition) {
            const { src } = this.transition.mesh.program.uniforms.tMap.value.image;
            const texture = window.TEXTURES[src];
            const media = this.medias.find((media) => media.texture === texture);
            const scroll = -media.bounds.left - media.bounds.width / 2 + window.innerWidth / 2;

            this.update();

            this.transition.animate({
                position: { x: 0, y: media.mesh.position.y, z: 0 },
                rotation: media.mesh.rotation,
                scale: media.mesh.scale,
            }, _ => {
                media.opacity.multiplier = 1;

                map(this.medias, (item) => {
                    if (media !== item) {
                        item.show()
                    }
                });

                this.scroll.current = this.scroll.target = this.scroll.start = this.scroll.last = scroll;
            })

        } else {
            map(this.medias, (media) => media.show());
        }
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

        this.scroll.last = this.scroll.target = 0;

        map(this.medias, (media) => { media.onResize(event, this.scroll) });

        this.scroll.limit = this.bounds.width - this.medias[0].element.clientWidth;
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

        this.titlesElements.style[this.transformPrefix] = `translateY(${25 * selectedCollection
            }%) translate(-50%,-50%) rotate(-90deg)`

        // this.media = this.medias[this.index]; // new line
    }

    /**
     * Update.
     */

    update() {
        this.scroll.target = GSAP.utils.clamp(-this.scroll.limit, 0, this.scroll.target);

        this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.lerp);

        this.galleryElement.style[this.transformPrefix] = `translateX(${this.scroll.current}px)`;

        if (this.scroll.last < this.scroll.current) {
            this.scroll.direction = "right";
        } else if (this.scroll.last > this.scroll.current) {
            this.scroll.direction = "left";
        }

        this.scroll.last = this.scroll.current

        // const index = Math.floor(Math.abs(this.scroll.current / this.scroll.limit) * this.medias.length);
        const index = Math.floor(Math.abs((this.scroll.current - (this.medias[0].bounds.width / 2)) / this.scroll.limit) * (this.medias.length - 1));

        if (this.index !== index) {
            this.onChange(index);
        }

        map(this.medias, (media, index) => {
            media.update(this.scroll.current, this.index);

            media.mesh.rotation.z = Math.abs(GSAP.utils.mapRange(0, 1, -0.2, 0.2, index / (this.medias.length - 1))) - 0.1;

            media.mesh.position.y += Math.cos((media.mesh.position.x / this.sizes.width) * Math.PI * 0.1) * 40 - 40;


        });
    }

    /**
     * Destroy.
     */
    destroy() {
        this.scene.removeChild(this.group);
        // this.scene.removeChild(this.scene);
    }
}
