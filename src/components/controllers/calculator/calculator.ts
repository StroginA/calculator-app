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
    appendToString: (a: string, b?: string) => string;
    constructor(operator: IOperator) {
        this.value = operator.value;
        this.priority = operator.priority;
        this.apply = operator.apply;
        this.appendToString = operator.appendToString;
    }
}

class UnaryOperator implements IUnaryOperator {
    value: string;
    apply: (operand: number) => number;
    appendToString: (operand: string) => string;
    constructor(operator: IUnaryOperator) {
        this.value = operator.value;
        this.apply = operator.apply;
        this.appendToString = operator.appendToString;
    }
}

class Expression implements IExpression {
    first: string | IExpression;
    second?: string | IExpression;
    operator?: IOperator | IUnaryOperator;
    constructor(
        first: string | IExpression, 
        operator?: IOperator | IUnaryOperator, 
        second?: string | IExpression
        ) {
        this.first = first;
        this.operator = operator;
        this.second = second;
    }

    appendDigit(digit: IDigit) {
        if (this.operator instanceof Operator && typeof this.second === 'string') {
            this.second = this.second + digit.value;
        } else if (this.operator instanceof Operator && !this.second) {
            this.second = digit.value;
        } else if (this.operator) {
            throw Error("Tried to append digit to a finished expression");
        } else {
            this.first = this.first + digit.value
        }
    }

    resolve() {
        /*
        If insufficient operands, treat expression as its first member
        */
        const toFloat = (expression: string | IExpression) => {
            if (typeof expression === 'string') {
                // assuming passed string uses "," for decimals
                return parseFloat(expression.replace(",", "."));
            } else {
                return expression.resolve();
            }
        }
        if (this.operator instanceof Operator && this.second) {
            return this.operator.apply(toFloat(this.first), toFloat(this.second))
        } else if (this.operator instanceof UnaryOperator) {
            return this.operator.apply(toFloat(this.first))
        } else return toFloat(this.first);
    }

    toString() {
        if (this.operator instanceof Operator && this.second) {
            return this.operator.appendToString(this.first.toString(), this.second.toString())
        } else if (this.operator instanceof Operator) {
            return this.operator.appendToString(this.first.toString())
        } else if (this.operator instanceof UnaryOperator) {
            return this.operator.appendToString(this.first.toString())
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
            return this.parsedStack.toString()
        } else {
            return "0"
        }
    }

    parse() {
        /*
        Called when the stack is updated.
        */
        for (let token of this.stack) {
            
        }
    }
}