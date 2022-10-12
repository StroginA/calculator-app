import { isDigit, isOperator, isUnaryOperator, type IDigit, type IOperator, type IUnaryOperator } from "./types";
import digits from "./digits";
import operators from "./operators";
import unaryOperators from "./unaryOperators";


class Expression  {
    first: string | Expression;
    second?: string | Expression;
    _operator?: IOperator | IUnaryOperator;

    set operator(operator: IOperator | IUnaryOperator | undefined) {
        this._dropDanglingDecimal();
        this._operator = operator;
    }

    get operator(): IOperator | IUnaryOperator | undefined {
        return this._operator
    }

    constructor(first: string | Expression, operator?: IOperator | IUnaryOperator, 
                second?: string | Expression) {
        // Preappend 0 if there is no number before ","
        this.first = first === "," ? 
                     "0" + first : 
                     first;
        if (operator) {
            // explicit if to avoid triggering premature decimal dropping
            this.operator = operator;
        }
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

    
    
    _dropDanglingDecimal() {
        // Traverse the expression and remove any decimals without following digits
        if (typeof this.first === 'string') {
            if (this.first.endsWith(",")) {
                this.first = this.first.replace(",","");
            }
        } else this.first._dropDanglingDecimal();
        if (typeof this.second === 'string') {
            if (this.second.endsWith(",")) {
                this.second = this.second.replace(",","");
            }
        } else if (this.second) {
            this.second._dropDanglingDecimal();
        }
    }

    resolve() {
        /*
        If insufficient operands, treat expression as its first member
        */
        const toFloat = (expression: string | Expression): number => {
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

    toString(): string {
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
    parsedStack: null | Expression  // Token stack reduced to expressions with 1-2 operands
    currentExpression: null | Expression  // Expression to append next operator/operand to
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
                    this.currentExpression = new Expression(token.value);
                    this.parsedStack = this.currentExpression;
                } else {
                    this.currentExpression = new Expression("0", token);
                    this.parsedStack = this.currentExpression;
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
                    const expr = new Expression(
                        this.currentExpression.second,
                        token
                    );
                    this.parsedStack!.second = expr;
                    this.currentExpression = isUnaryOperator(token) ? this.parsedStack : expr;
                } else {
                    // Bundle previous expression as an operand in the new one
                    this.currentExpression = new Expression(
                        this.parsedStack!,
                        token
                    );
                    this.parsedStack = this.currentExpression;
                }
            }
        }
        this.stack = [];
    }
}