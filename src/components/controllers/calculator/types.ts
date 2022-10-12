export interface IDigit {
    value: string
}

export interface IOperator extends IDigit {
    // value represented by shortened verb (add, sub, mul, div, sqrt)
    priority: number  // 0 for "+ -" , 1 for "x /"
    apply: (a: number, b: number) => number
    appendToString: (a: string, b?: string) => string  // String representation of operator and its operands
}

export interface IUnaryOperator extends IDigit {
    apply: (operand: number) => number
    appendToString: (operand: string) => string  // String representation of operator and its operands
}

export interface IExpression {
    first: string | IExpression
    operator?: IOperator | IUnaryOperator
    second?: string | IExpression
    appendDigit: (digit: IDigit) => void  // Append digit to first/second operand
    resolve: () => number
}

export interface ICalculator {
    stack: (IDigit | IOperator | IUnaryOperator)[]
    clearAll: () => void
    pushToken: (input: string) => void
    calculate: () => number
    stringify: () => string
}
