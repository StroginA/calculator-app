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
        this.first = this._preappendZero(undefined, first)
        if (operator) {
            // explicit 'if' to avoid triggering premature decimal dropping
            this.operator = operator;
        }
        this.second = second;
    }

    _preappendZero(oldString: string | undefined, addition: string | Expression): string | Expression {
        // Call when appending decimal
        return (
            !oldString && addition === "," ? 
            "0" + addition :
            !oldString ?
            addition :
            oldString + addition
        )
    }

    appendDigit(digit: IDigit) {
        if (isOperator(this.operator) && typeof this.second === 'string') {
            // do not add a second decimal
            this.second = digit.value === "," && this.second.includes(",") ?
                          this.second :
                          this.second + digit.value;
        } else if (isOperator(this.operator)) {
            // If there is an Expression second operand (such as square root of a number), replace it
            // Preappend 0 if there is no number before ","
            this.second = this._preappendZero(undefined, digit.value);
        } else {
            // do not add a decimal if there is one or first member is expression
            if (isUnaryOperator(this.operator)) {
                this.operator = undefined;
                this.first = this._preappendZero(undefined, digit.value)
            } else {
                this.first = digit.value === "," && (this.first instanceof Expression || this.first.includes(",")) ?
                              this.first :
                              this.first + digit.value;
            }
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
    /*
    Call pushToken() with digit, decimal comma or operator identifier.
    Call pushToken() with "return" to finalize calculation.
    getCurrentResult() is intended for fetching the string for UI.
    If you want the raw resulting number, use calculate().
    */
    
    stack: (IDigit | IOperator | IUnaryOperator)[]
    parsedStack: null | Expression  // Token stack reduced to expressions with 1-2 operands
    currentExpression: null | Expression  // Expression to append next operator/operand to
    done: boolean;
    constructor() {
        this.stack = [];
        this.parsedStack = null;
        this.currentExpression = null;
        this.done = false;
    }

    clearAll() {
        this.stack = [];
        this.parsedStack = null;
        this.currentExpression = null;
        this.done = false;
    }

    pushToken(input: string) {
        if (input === "return") {
            this.done = true;
        } else {
            const found = [...digits, ...operators, ...unaryOperators].filter(token => token.value === input)[0];
            if (found) {
                if (this.done) {
                    /* 
                    If "=" was pressed, replace result with new addition
                    */
                    this.clearAll()
                }
                this.stack.push(found);
                this.parse();
            }
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
            if (this.done) {
                this.parsedStack._dropDanglingDecimal()
                // strip dangling operator
                if (this.currentExpression && 
                    !isUnaryOperator(this.currentExpression.operator) && 
                    !this.currentExpression.second
                ) {
                    this.currentExpression.operator = undefined
                }
                return this.parsedStack.toString() + "="
            } else {
                return this.parsedStack.toString()
            }
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
        for (const token of this.stack) {
            // Initialise expression if missing
            if (!this.parsedStack) {
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
                } else {
                    if (this.currentExpression.second && !this.currentExpression.operator) {
                        throw Error("Current expression has two operands but no operator")
                    }
                    if (isUnaryOperator(token)) {
                        // strip non-unary dangling operators
                        if (!isUnaryOperator(this.currentExpression.operator) && !this.currentExpression.second) {
                            this.currentExpression.operator = undefined;
                        }
                        if (!this.currentExpression.second) {
                            this.currentExpression.first = new Expression(
                                new Expression(this.currentExpression.first, token)
                            );
                        } else {
                            this.currentExpression.second = new Expression(
                                new Expression(this.currentExpression.second, token)
                            );
                            this.parsedStack.second = this.currentExpression;
                        }
                    } else if (!this.currentExpression.operator) {
                        this.currentExpression.operator = token;
                    } else if (this.currentExpression.second && 
                               token.priority > this.currentExpression.operator.priority
                               ) 
                    {
                        this.currentExpression = new Expression(
                            this.currentExpression.second,
                            token
                        );
                        this.parsedStack.second = this.currentExpression;
                    } else if (this.currentExpression.second && 
                               token.priority <= this.currentExpression.operator.priority
                               ) 
                    {
                        this.currentExpression = new Expression(
                            this.parsedStack,
                            token
                        );
                        this.parsedStack = this.currentExpression;
                    } else {
                        this.currentExpression.operator = token
                    }
                }
            }
        }
        console.log(this.parsedStack?.toString())
        this.stack = [];
    }

    getCurrentResult(): string {
        /* 
        This would be displayed in the main display of the calculator.
        0 by default.
        0 if current expression is lacking a second operand.
        Current expression's first operand if no operator.
        Else second operand.
        */
        if (!this.done && this.currentExpression) {
            if (!this.currentExpression.operator) {
                return this.currentExpression.first.toString()
            } else if (this.currentExpression.second) {
                return this.currentExpression.second.toString()
            } else {
                return "0"
            }
        } else {
            // To match calculator using commas for decimals.
            return this.calculate().toString().replace(".", ",")
        }
    }
}