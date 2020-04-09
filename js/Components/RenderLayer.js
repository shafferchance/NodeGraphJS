import ComponentE from "../lib/Component-Event.js";

export default class RenderLayer extends ComponentE {
    constructor(dest, props={}) {
        super({
            element: dest,
        });
        this.id = this.idGen();
        if (props.hasOwnProperty('styles')) {
            if (Array.isArray(props['styles'])) {
                this.classList = props['styles'];
            } else {
                this.className = props['styles'];
            }
        }

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        dest.addEventListener("resize", () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.store.dispatch("changeRenderLayerDimm", canvas.getBoundingClientRect());
            this.resizeRes();
        });
    }

    resizeRes () {
        const canvas = document.querySelector("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
    }

    render () {
        const canvas = document.createElement("canvas");

        if (this.classList !== undefined) {
            canvas.classList.add(this.classList);
        } else {
            canvas.className = this.className;
        }

        this.store.dispatch("change2DContext", canvas.getContext('2d'));
        this.store.dispatch("changeRenderLayerDimm", canvas.getBoundingClientRect());
        canvas.width=this.width;
        canvas.height=this.height;
        this.element.appendChild(canvas);
    }
}