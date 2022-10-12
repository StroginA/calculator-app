import { isDigit, isOperator, isUnaryOperator, type IDigit, type IExpression, type IOperator, type IUnaryOperator } from "./types";
import digits from "./digits";
import operators from "./operators";
import unaryOperators from "./unaryOperators";

class Digit implements IDigit {
    value: string;
    type: 'digit';
    constructor(value: string) {
        this.value = value
        this.type = 'digit';
    }
}

class Operator implements IOperator {
    value: string;
    type: 'operator';
    priority: number;
    apply: (a: number, b: number) => number;
    appendToString: (a: string, b?: string) => string;
    constructor(operator: IOperator) {
        this.value = operator.value;
        this.type = 'operator';
        this.priority = operator.priority;
        this.apply = operator.apply;
        this.appendToString = operator.appendToString;
    }
}

class UnaryOperator implements IUnaryOperator {
    value: string;
    type: 'unaryOperator';
    priority: number;
    apply: (operand: number) => number;
    appendToString: (operand: string) => string;
    constructor(operator: IUnaryOperator) {
        this.value = operator.value;
        this.type = 'unaryOperator';
        this.priority = operator.priority;
        this.apply = operator.apply;
        this.appendToString = operator.appendToString;
    }
}

class Expression implements IExpression {
    first: string | IExpression;
    second?: string | IExpression;
    operator?: IOperator | IUnaryOperator;
    constructor(first: string | IExpression, operator?: IOperator | IUnaryOperator, 
                second?: string | IExpression) {
        // Preappend 0 if there is no number before ","
        this.first = first === "," ? 
                     "0" + first : 
                     first;
        this.operator = operator;
        this.second = second;
    }

    appendDigit(digit: IDigit) {
        if (isOperator(this.operator) && typeof this.second === 'string') {
            this.second = this.second + digit.value;
        } else if (isOperator(this.operator)) {
            // If there is an Expression second operand (such as square root of a number), replace it
            // Preappend 0 if there is no number before ","
            this.second = digit.value === "," ? 
                          "0" + digit.value : 
                          digit.value;
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
        if (isOperator(this.operator) && this.second) {
            return this.operator.apply(toFloat(this.first), toFloat(this.second))
        } else if (isUnaryOperator(this.operator)) {
            return this.operator.apply(toFloat(this.first))
        } else return toFloat(this.first);
    }

    toString() {
        if (isOperator(this.operator) && this.second) {
            return this.operator.appendToString(this.first.toString(), this.second.toString())
        } else if (isOperator(this.operator)) {
            return this.operator.appendToString(this.first.toString())
        } else if (isUnaryOperator(this.operator)) {
            return this.operator.appendToString(this.first.toString())
        } else return this.first.toString();
    }
}




export default class Calculator {
    
    stack: (IDigit | IOperator | IUnaryOperator)[]
    parsedStack: null | IExpression  // Token stack reduced to expressions with 1-2 operands
    currentExpression: null | IExpression  // Expression to append next operator/operand to
    constructor() {
        this.stack = [];
        this.parsedStack = null;
        this.currentExpression = null;
    }

    clearAll() {
        this.stack = [];
        this.parsedStack = null;
        this.currentExpression = null;
    }

    pushToken(input: string) {
        const found = [...digits, ...operators, ...unaryOperators].filter(token => token.value === input)[0];
        if (found) {
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
        If next token is a digit, append to current expression or create one if not exists
        If it is an operator:
            ...and current expression has a regular operator and no second operand...
                insert operator into current expression
                current(2) -> current(2+)
                current(2-) -> current(2+)
            ...of higher priority than current expression (such as "x" after "+")...
                create new expression from current expression's second and this operator,
                and insert into the current expression's second operand.
                Then make it the current one if the operator is not unary.
                parsed(2+3), current(parsed) -> parsed(2+expr_a(3*)), current(expr_a)
            ...of lower or equal priority...
                create new expression using current one as first operand and this operator.
                Then make it the current one.
                parsed(2+3), current(parsed) -> parsed(expr(2+3)+), current(parsed)
        */
        for (let token of this.stack) {
            // Initialise expression if missing
            if (!this.currentExpression && !this.parsedStack) {
                if (isDigit(token)) {
                    this.parsedStack = new Expression(token.value);
                    this.currentExpression = this.parsedStack;
                } else {
                    throw Error("First token failed to return a digit");
                }
            } else if (!this.currentExpression) {
                throw Error("Missing reference to current expression");
            } else {
                if (isDigit(token)) {
                    // Digit
                    this.currentExpression.appendDigit(token);
                } else if (!this.currentExpression.second) {
                    // Replace dangling operator
                    this.currentExpression.operator = token;
                } else if (!this.currentExpression.operator) {
                    throw Error("Current expression has two operands but no operator")
                } else if (token.priority > this.currentExpression.operator.priority) {
                    // Higher priority (such as multiplication after addition)
                    this.currentExpression.second = new Expression(
                        this.currentExpression.second,
                        token
                    );
                    if (!isUnaryOperator(token)) {
                        this.currentExpression = this.currentExpression.second;
                    }
                } else {
                    // Bundle previous expression as an operand in the new one
                    this.currentExpression = new Expression(
                        this.currentExpression,
                        token
                    );
                }
            }
        }

        this.stack = [];
    }
}