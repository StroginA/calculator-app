interface IDigit {
    value: string
}

class Digit implements IDigit {
    value: string
    constructor(value: string) {
        this.value = value
    }
}


interface IOperator extends IDigit {
    // value represented by shortened verb (add, sub, mul, div, sqrt)
    priority: number  // 0 for "+ -" , 1 for "x /"
    apply: (a: number, b: number) => number
}

interface IUnaryOperator extends IDigit {
    apply: (operand: number) => number
}

interface IExpression {
    first: number | IExpression
    operator: IOperator | IUnaryOperator
    second: null | number | IExpression
    resolve: () => number
    stringify: () => string
}

interface ICalculator {
    stack: (IDigit | IOperator | IUnaryOperator)[]
    clearAll: () => void
    pushToken: (input: string) => void
    calculate: () => number
    stringify: () => string
}


const operators = [
    {
        value: "add",
        priority: 0,
        apply: (a, b) => {
            return a + b
        }
    },
    {
        value: "sub",
        priority: 0,
        apply: (a, b) => {
            return a - b
        }
    },
    {
        value: "mul",
        priority: 1,
        apply: (a, b) => {
            return a * b
        }
    },
    {
        value: "div",
        priority: 1,
        apply: (a, b) => {
            return a / b
        }
    },
] as IOperator[];


const unaryOperators = [
    {
        value: "sqrt",
        apply: (operand) => {
            return Math.sqrt(operand)
        }
    },
] as IUnaryOperator[];


const digits = [
    {
        value: "0"
    },
    {
        value: "1"
    },
    {
        value: "2"
    },
    {
        value: "3"
    },
    {
        value: "4"
    },
    {
        value: "5"
    },
    {
        value: "6"
    },
    {
        value: "7"
    },
    {
        value: "8"
    },
    {
        value: "9"
    },
    {
        value: ","
    },
] as IDigit[]

export default class Calculator implements ICalculator {
    
    stack: (IDigit | IOperator | IUnaryOperator)[]
    parsedStack: null | IExpression
    constructor() {
        this.stack = [];
        this.parsedStack = null;
    }

    clearAll() {
        this.stack = [];
        this.parsedStack = null;
    }

    pushToken(input: string) {
        const found = [...digits, ...operators, ...unaryOperators].filter(token => token.value === input)[0];
        if (found) {
            // if the first token inserted is not 0-9, insert 0 before the inputted token
            if (this.stack.length === 0 && !found.value.match(/[0-9]/)) {
                this.stack.push(new Digit("0"));
            }
            this.stack.push(found);
        }
    }

    calculate() {
        if (this.parsedStack) {
            return this.parsedStack.resolve()
        } else {
            return 0
        }
    }

    stringify() {
        if (this.parsedStack) {
            return this.parsedStack.stringify()
        } else {
            return "0"
        }
    }

    parse() {
        /*

        */
    }
}