export default class Box {

    constructor() {

    }

    render() {
        // Creating elements
        const box = document.createElement("div")
        const attribs = document.createElement("div");
        const add = document.createElement("div");

        // Element properties
        box.id = generateId();
        box.className = "box";
        attribs.className = "attribs";
        add.className = "add";
        add.innerHTML = "&#8853;";

        // Assigning
        box.appendChild(attribs);
        box.appendChild(add);

        function moveAt(x, y) {
            box.style.left = x - box.offsetWidth / 2 + 'px';
            box.style.top = y - box.offsetHeight / 2 + 'px';
        }
        function onMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        box.addEventListener('mousedown', e => {
            switch(e.target.className) {
                case 'add':
                    e.preventDefault();
                    box.children[0].appendChild(getAttribEle());
                    break;
                case 'box':
                    e.preventDefault();
                    document.addEventListener('mousemove', onMove);
                    box.style.position = 'absolute';
                    // Ensure that the box moved will be on top
                    box.style.zIndex = 100;
                    box.onmouseup = () => {
                        document.removeEventListener('mousemove', onMove);
                    }
                    break;
                case 'nodeO':
                    console.log("node clicked")
                    e.preventDefault();
                    const line = document.createElement('div');
                    line.className = "line";
                    line.style.position = "absolute";
                    e.target.appendChild(line);
                    const drawLine = (draw, ele) => {
                        const ele1 = ele.getBoundingClientRect();
                        const srcX = ele1.left - ele1.width/2;
                        const srcY = ele1.top - ele1.height/2;

                        const length = Math.sqrt(
                            (draw.clientX-srcX)**2 +
                            (draw.clientY-srcY)**2);
                    
                        const angle = Math.atan2(
                                        (draw.clientY-srcY),
                                        (draw.clientX-srcX))*
                                        (180/Math.PI);

                        line.style.top = "9px";
                        line.style.left = `322px`;
                        line.style.width = `${length}px`;
                        line.style.transform =
                                            `rotate(${angle}deg)`;
                        line.style.webkitTransform = 
                                            `rotate(${angle}deg)`;
                        line.style.transformOrigin = 'top left';
                    }
                    const updateLine = event => {
                        event.preventDefault();
                        drawLine(event, e.target);
                    }
                    document.addEventListener('mousemove', updateLine);
                    // Destorying data
                    document.onmouseup = up => {
                        document.removeEventListener('mousemove', updateLine);
                        const coords = up.target.getBoundingClientRect();
                    }
                default:
                    // While not necessary this may change eventaully
                    break;
            }
        });
        box.addEventListener('dblclick', e => {
            e.preventDefault();
            console.log("attempting cancel...")
            box.removeEventListener('mousemove', onMove);
        });
        return box;
    }
}