import type { ICalculator, IDigit, IExpression, IOperator, IUnaryOperator } from "./types";
import digits from "./digits";
import operators from "./operators";
import unaryOperators from "./unaryOperators";

class Digit implements IDigit {
    value: string;
    constructor(value: string) {
        this.value = value
    }
}

class Operator implements IOperator {
    value: string;
    priority: number;
    apply: (a: number, b: number) => number;
    stringify: (a: number, b?: number) => string;
    constructor(operator: IOperator) {
        this.value = operator.value;
        this.priority = operator.priority;
        this.apply = operator.apply;
        this.stringify = operator.stringify;
    }
}

class UnaryOperator implements IUnaryOperator {
    value: string;
    apply: (operand: number) => number;
    stringify: (operand: number) => string;
    constructor(operator: IUnaryOperator) {
        this.value = operator.value;
        this.apply = operator.apply;
        this.stringify = operator.stringify;
    }
}

class Expression implements IExpression {
    first: number;
    second: undefined | number;
    operator: undefined | IOperator | IUnaryOperator;
    constructor(first: number, operator?: IOperator | IUnaryOperator, second?: number ) {
        this.first = first;
        this.operator = operator;
        this.second = second;
    }

    resolve() {
        /*
        If insufficient operands, treat expression as its first member
        */
        if (this.operator instanceof Operator && this.second) {
            return this.operator.apply(this.first, this.second)
        } else if (this.operator instanceof UnaryOperator) {
            return this.operator.apply(this.first)
        } else return this.first;
    }

    stringify() {
        if (this.operator instanceof Operator) {
            return this.operator.stringify(this.first, this.second)
        } else if (this.operator instanceof UnaryOperator) {
            return this.operator.stringify(this.first)
        } else return this.first.toString();
    }
}




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
            this.parse();
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
        Called when the stack is updated.
        */
        for (let token in this.stack) {

        }
    }
}