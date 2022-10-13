class UnaryOperator {
    value: string;
    type: 'unaryOperator';
    priority: number; // 2 for unary operators
    apply: (operand: number) => number;
    appendToString: (operand: string) => string; // String representation of operator and its operands
    constructor(
        value: string, 
        priority: number, 
        apply: (operand: number) => number, 
        appendToString: (a: string, b?: string) => string) {
        this.value = value;
        this.type = 'unaryOperator';
        this.priority = priority;
        this.apply = apply;
        this.appendToString = appendToString;
    }
}

const unaryOperators = [
    new UnaryOperator(
        "sqrt",
        2,
        (operand) => {
            return Math.sqrt(operand)
        },
        (operand) => {
            return "√(" + operand + ")"
        }
    )
] as UnaryOperator[];


export {unaryOperators, UnaryOperator};