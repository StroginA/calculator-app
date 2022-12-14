import {digits, Digit} from "./digits";
import {operators, Operator} from "./operators";
import {unaryOperators, UnaryOperator} from "./unaryOperators";


class Expression  {
    first: string | Expression;
    second?: string | Expression;
    _operator?: Operator | UnaryOperator;

    set operator(operator: Operator | UnaryOperator | undefined) {
        this._dropDanglingDecimal();
        this._operator = operator;
    }

    get operator(): Operator | UnaryOperator | undefined {
        return this._operator
    }

    constructor(first: string | Expression, operator?: Operator | UnaryOperator, 
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

    appendDigit(digit: Digit) {
        if (this.operator instanceof Operator && typeof this.second === 'string') {
            // do not add a second decimal
            this.second = digit.value === "," && this.second.includes(",") ?
                          this.second :
                          this.second + digit.value;
        } else if (this.operator instanceof Operator) {
            // If there is an Expression second operand (such as square root of a number), replace it
            // Preappend 0 if there is no number before ","
            this.second = this._preappendZero(undefined, digit.value);
        } else {
            // do not add a decimal if there is one or first member is expression
            if (this.operator instanceof Operator) {
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
        if (this.operator instanceof Operator && this.second) {
            return this.operator.apply(toFloat(this.first), toFloat(this.second))
        } else if (this.operator instanceof UnaryOperator) {
            return this.operator.apply(toFloat(this.first))
        } else return toFloat(this.first);
    }

    toString(): string {
        if (this.operator instanceof Operator && this.second) {
            return this.operator.appendToString(this.first.toString(), this.second.toString())
        } else if (this.operator instanceof Operator) {
            return this.operator.appendToString(this.first.toString())
        } else if (this.operator instanceof UnaryOperator) {
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
    
    stack: (Digit | Operator | UnaryOperator)[]
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
        } else if (input === "clear") {
            this.clearAll();
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
                    !(this.currentExpression.operator instanceof UnaryOperator) && 
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
                if (token instanceof Digit) {
                    this.currentExpression = new Expression(token.value);
                    this.parsedStack = this.currentExpression;
                } else {
                    this.currentExpression = new Expression("0", token);
                    this.parsedStack = this.currentExpression;
                }
            } else if (!this.currentExpression) {
                throw Error("Missing reference to current expression");
            } else {
                if (token instanceof Digit) {
                    // Digit
                    if (this.currentExpression.second instanceof Expression) {
                        this.currentExpression.second.appendDigit(token);
                    } else {
                        this.currentExpression.appendDigit(token);
                    }
                } else {
                    if (this.currentExpression.second && !this.currentExpression.operator) {
                        throw Error("Current expression has two operands but no operator")
                    }
                    if (token instanceof UnaryOperator) {
                        const applyUnary = (expr: Expression, token: UnaryOperator) => {
                            // Applies unary to rightmost element of passed expression
                            if (typeof expr.second === "string") {
                                expr.second = new Expression(expr.second, token);
                            } else if (!expr.second) {
                                expr.first = new Expression(expr.first, token);
                            } else {
                                applyUnary(expr.second, token);
                            }
                        }
                        // strip non-unary dangling operators
                        if (!(this.currentExpression.operator instanceof UnaryOperator) && !this.currentExpression.second) {
                            this.currentExpression.operator = undefined;
                        }
                        if (!this.currentExpression.second) {
                            applyUnary(this.currentExpression, token)
                        } else {
                            applyUnary(this.currentExpression, token)
                        }
                    } else if (!this.currentExpression.operator) {
                        this.currentExpression.operator = token;
                    } else if (this.currentExpression.second && 
                               token.priority > this.currentExpression.operator.priority
                               ) 
                    {
                        this.currentExpression.second = new Expression(
                            this.currentExpression.second, token
                        )
                        this.parsedStack = this.currentExpression;
                    } else if (this.currentExpression.second && 
                               token.priority <= this.currentExpression.operator.priority
                               ) 
                    {
                        
                        this.currentExpression = new Expression(
                            this.currentExpression,
                            token
                        );
                        this.parsedStack = this.currentExpression
                    } else {
                        this.currentExpression.operator = token
                    }
                }
            }
        }
        this.stack = [];
    }

    getCurrentResult(): string {
        /* 
        This would be displayed in the main display of the calculator.
        0 by default.
        0 if current expression is lacking a second operand.
        Current expression's first operand if no operator.
        Else second operand's rightmost operand
        */
        const getRightmostOperand = (expr: string | Expression): string => {
            if (typeof expr === "string") {
                return expr;
            } else if ((expr.operator instanceof UnaryOperator)) {
                return expr.toString()
            } else if (!expr.operator || !expr.second) {
                return getRightmostOperand(expr.first)
            } else if (typeof expr.second === 'string') {
                return expr.second
            } else {
                return getRightmostOperand(expr.second)
            }
        }
        if (!this.done && this.currentExpression) {
            return getRightmostOperand(this.currentExpression)
        } else {
            // To match calculator using commas for decimals.
            return this.calculate().toString().replace(".", ",")
        }
    }
}