import SimPiece from '../Components/SimPiece-Event.js';

window.addEventListener('load',async () => {
    const elements = await init();
    console.log(elements);
    await test(elements);
});

function createElements() {
    let eles = [];
    for (let i = 0;i <= 8; i++) {
        let props = {};
        switch(i) {
            case 0:
                props['type'] = 'sinkI';
                break;
            case 1:
                props['type'] = 'flowI';
                break;
            case 2:
                props['type'] = 'stock';
                break;
            case 3:
                props['type'] = 'flowO';
                break;
            case 4:
                props['type'] = 'sinkO';
                break;
            case 5:
            case 6:
                props['type'] = 'aux';
                props['funct'] = ''; // TODO: Add function and possbile handling...
                break;
            case 7:
                props['type'] = 'auxI';
                props['val'] = 0.5;
                break;
            case 8:
                props['type'] = 'auxI';
                props['val'] = 0.5;
                break;
        }
        eles.push(new SimPiece(document.body, props));
    }
    return eles;
}

// Conducting function of pubsub at init to make test automatic!
const createConnections = eles => {
    return new Promise((res, rej) => {
        for (let i = 0; i < eles.length; i++) {
            switch(eles[i].props.type) {
                case 'sinkI':
                    // Connection between sink and flowI
                    eles[i].conns.push(`${eles[i+1].id}-${eles[i+1].props.type}-0`);
                    eles[i+1].conns.push(`${eles[i].id}-${eles[i].props.type}-1`);
                    break;
                case 'flowI':
                    // Connection between flowI and stock
                    eles[i].conns.push(`${eles[i+1].id}-${eles[i+1].props.type}-0`);
                    eles[i+1].conns.push(`${eles[i].id}-${eles[i].props.type}-1`);
                    // Connection between flowI and aux1
                    eles[i].conns.push(`${eles[i+4].id}-${eles[i+4].props.type}-1`);
                    eles[i+4].conns.push(`${eles[i].id}-${eles[i].props.type}-0`);
                    break;
                case 'stock':
                    // Connection between stock and flowO
                    eles[i].conns.push(`${eles[i+1].id}-${eles[i+1].props.type}-0`);
                    eles[i+1].conns.push(`${eles[i].id}-${eles[i].props.type}-1`);
                    // Connection between stock and aux1
                    eles[i].conns.push(`${eles[i+2].id}-${eles[i+2].props.type}-1`);
                    eles[i+2].conns.push(`${eles[i].id}-${eles[i].props.type}-0`);
                    // Connection between stock and aux2
                    eles[i].conns.push(`${eles[i+3].id}-${eles[i+3].props.type}-0`);
                    eles[i+3].conns.push(`${eles[i].id}-${eles[i].props.type}-1`);
                    break;
                case 'flowO':
                    // Connection between flowO and sinkO
                    eles[i].conns.push(`${eles[i+1].id}-${eles[i+1].props.type}-0`);
                    eles[i+1].conns.push(`${eles[i].id}-${eles[i].props.type}-0`);
                    // Connection between flowO and aux2
                    eles[i].conns.push(`${eles[i+3].id}-${eles[i+3].props.type}-0`);
                    eles[i+3].conns.push(`${eles[i].id}-${eles[i].props.type}-1`);
                    break;
                case 'sinkO':
                    /*
                     Nothing should need to happen here as the this does not output to
                     another node! The connection between the flowO and the sinkO is
                     established by flowO hence no need to add another!
                    */
                    break;
                case 'aux':
                    /*if (i === 5) {
                        eles[i].conns.push(`${eles[i+2].id}-${eles[i+2].props.type}-1`);
                        eles[i+2].conns.push(`${eles[i].id}-${eles[i].props.type}-0`);
                    } else if (i === 6) {
                        eles[i].conns.push(`${eles[i+3].id}-${eles[i+3].props.type}-1`);
                        eles[i+3].conns.push(`${eles[i].id}-${eles[i].props.type}-0`);
                    }*/
                    // Connection cannot be established yet the parameter objs have 
                    // not been created
                    break;
                case 'auxI':
                    if (i === 7) {
                        eles[i].conns.push(`${eles[i-2].id}-${eles[i-2].props.type}-0`);
                        eles[i-2].conns.push(`${eles[i].id}-${eles[i].props.type}-1`);
                    } else if (i === 8) {
                        eles[i].conns.push(`${eles[i-2].id}-${eles[i-2].props.type}-0`);
                        eles[i-2].conns.push(`${eles[i].id}-${eles[i].props.type}-1`);
                    }
                    break;
                default:
                    rej("Invalid element detected");
                    break;
            }   
        }
        res("Completed connections!");
    });
}

async function init() {
    let eles = createElements();
    console.log(await createConnections(eles));
    return eles;
}

async function test(eles) {
    const test1 = await testRecursive(eles[1]);
    console.log(test1);
    //const test2 = await testRecursive(eles[3]);
    //console.log(test2);
}

function testRecursive(ele) {
    return ele.requestOutput()
}