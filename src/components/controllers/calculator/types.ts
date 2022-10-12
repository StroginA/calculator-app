export interface IDigit {
    value: string
}

export interface IOperator extends IDigit {
    // value represented by shortened verb (add, sub, mul, div, sqrt)
    priority: number  // 0 for "+ -" , 1 for "x /"
    apply: (a: number, b: number) => number
    stringify: (a: number, b?: number) => string  // String representation of operator and its operands
}

export interface IUnaryOperator extends IDigit {
    apply: (operand: number) => number
    stringify: (operand: number) => string  // String representation of operator and its operands
}

export interface IExpression {
    first: number | IExpression
    operator: undefined | IOperator | IUnaryOperator
    second: undefined | number | IExpression
    resolve: () => number
    stringify: () => string
}

export interface ICalculator {
    stack: (IDigit | IOperator | IUnaryOperator)[]
    clearAll: () => void
    pushToken: (input: string) => void
    calculate: () => number
    stringify: () => string
}
