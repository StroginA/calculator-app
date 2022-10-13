class Operator {
    value: string;
    type: 'operator';
    priority: number; // 0 for "+ -" , 1 for "x /"
    apply: (a: number, b: number) => number;
    appendToString: (a: string, b?: string) => string; // String representation of operator and its operands
    constructor(
        value: string, 
        priority: number, 
        apply: (a: number, b: number) => number, 
        appendToString: (a: string, b?: string) => string) {
        this.value = value;
        this.type = 'operator';
        this.priority = priority;
        this.apply = apply;
        this.appendToString = appendToString;
    }
}
const operators = [
    new Operator(
        "add", 0,
        (a, b) => {
            return a + b
        },
        (a, b) => {
            return b ? 
            a + "+" + b :
            a + "+"
        }
    ),
    new Operator(
        "sub",
        0,
        (a, b) => {
            return a - b
        },
        (a, b) => {
            return b ? 
            a + "-" + b :
            a + "-"
        }
    ),
    new Operator(
        "mul",
        1,
        (a, b) => {
            return a * b
        },
        (a, b) => {
            return b ? 
            a + "×" + b :
            a + "×"
        }
    ),
    new Operator(
        "div",
        1,
        (a, b) => {
            return a / b
        },
        (a, b) => {
            return b ? 
            a + "/" + b :
            a + "/"
        }
    ),
    new Operator(
        "mod",
        1,
        (a, b) => {
            return a % b
        },
        (a, b) => {
            return b ? 
            a + "%" + b :
            a + "%"
        }
    ),
] as Operator[];

export {operators, Operator};