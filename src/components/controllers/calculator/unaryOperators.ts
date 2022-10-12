import type { IUnaryOperator } from "./types";

class UnaryOperator implements IUnaryOperator {
    value: string;
    type: 'unaryOperator';
    priority: number;
    apply: (operand: number) => number;
    appendToString: (operand: string) => string;
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
] as IUnaryOperator[];


export default unaryOperators;