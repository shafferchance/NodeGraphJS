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
            let canvas = document.querySelector("canvas");
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.store.dispatch("changeRenderLayerDimm", canvas.getBoundingClientRect());
            this.resizeRes();
        });

        
    }

    resizeRes () {
        // const canvas = document.querySelector("canvas");
        // canvas.width = this.width;
        // canvas.height = this.height;
        const svg = document.querySelector("svg");
        svg.width = this.width;
        svg.height = this.height;
    }

    render () {
        // const canvas = document.createElement("canvas");

        // if (this.classList !== undefined) {
        //     canvas.classList.add(this.classList);
        // } else {
        //     canvas.className = this.className;
        // }

        // this.store.dispatch("change2DContext", canvas.getContext('2d'));
        // this.store.dispatch("changeRenderLayerDimm", canvas.getBoundingClientRect());
        // canvas.width=this.width;
        // canvas.height=this.height;
        // this.element.appendChild(canvas);
        const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");

        if (this.classList !== undefined) {
            svg.setAttribute("class", this.classList.join());
        } else {
            svg.setAttribute("class", this.className);
        }

        this.store.dispatch("changeRenderLayerDimm", svg.getBoundingClientRect());

        svg.setAttribute("width", this.width);
        svg.setAttribute("height", this.height);
        this.element.appendChild(svg);
    }
}