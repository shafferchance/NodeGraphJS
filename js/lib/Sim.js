import EventManager from '../lib/EventManager.js';

/**
 * Normalizes a value within the provided range to a value between [0,1]
 * where 0 represents the smallest number and 1 represents the largest
 * 
 * @param {Number} x Value to nomalize
 * @param {Number} min Min in normalization range
 * @param {Number} max Max in nomrmalization range
 */
function normalize (x, min, max) {
    return (x - min)/(max - min);
}

/**
 * Inverse normalize a value within the provided range to vaule between [0,1]
 * where 0 represents the largest number and 1 represents the smallest
 * 
 * @param {Number} x Value to nomalize
 * @param {Number} min Min in normalization range
 * @param {Number} max Max in nomrmalization range
 */
function normalizeI (x, min, max) {
    return (max - x)/(max - min);
}

/**
 * Conducts operation on data based on operand passed
 * 
 * @param {Object} expressions Object where the key is the operand and value is 
 * an array where 0 is for the left side and 1 is for the right. 
 */
function operators (expressions) {
    res = 0;
    const ops = {
        '+': (a,b) => {
            return a + b;  
        },
        '-': (a,b) => {
            return a - b;
        },
        '*': (a,b) => {
            return a * b;
        },
        '/': (a,b) => {
            return a / b;
        },
        '%': (a,b) => {
            return  a % b;
        },
        ['^']: (a,b) => {
            return Math.pow(a,b)
        }
    }
    for (let exp in expressions) {
        if (Array.isArray(expressions[exp]) === false 
                && typeof expressions[exp] === 'string') {
            // Recursive call in-case of nested operands
            res += operators(expressions[exp]);
        }
        res += ops[exp](expressions[exp][0], expressions[exp][1]);
    }
    return res;
}

/**
 * 
 * Follows simpson's rule to approximate the definite integral. Passing the 
 * function to be integrated with the lower and upper bound. With n subdvisions
 * should result in a low variance answer.
 * 
 * Some formatting of the function will be requied for the Math to be done
 * in the accepted and expected way. This will be added inside of the UI
 * 
 * @param {Function} f Base function inside the integrand
 * @param {Number} a Lower bound of the definite integral
 * @param {Number} b Upper bound of the definite integral
 * @param {Number} n Number of subdivisions
 */
function simpsons (f, a, b, n) {
    return new Promise((res, rej) => {
        const h = (b - a) / n;
        let res = f(a) + 4 * f(a + (b - 1) * h) + f(b);
        for (let i = 1; i < n; i++) {
            console.log(`i: ${i} and Xsubi: ${a + (i * h)} and f: ${f(a + (i*h))}`)
            res += i % 2 === 0 ? 2 * f(a + (i * h)) :
                        4 * f(a + (i * h));
        }
        res *= h/3;
        return res;
    })
}

/**
 * 
 * Summation functions the same as sigma notation inside of mathematics
 * 
 * @param  {...any} args Any elements that are of type `Number` to be summed up 
 */
function summation (...args) {
    sum = 0;
    console.log(args);
    for (let i of args) {
        sum += i;
    }
    return sum;
}

class SDSim {
    constructor() {
        this.observer = EventManager;
        this.startPoint = this.observer.state.startPoint;
    }

    init() {
        return new Promise((res, rej) => {
            // Ensure that ids have been loaded into PubSub
        });
    }

    async run() {
        // Start execution from set start point
    }
}