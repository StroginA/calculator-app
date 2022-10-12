export interface IDigit {
    value: string
    type: 'digit'
}

export function isDigit(object: any): object is IDigit {
    return (object) && ('type' in object) && (object.type === 'digit')
}

export interface IOperator {
    // value represented by shortened verb (add, sub, mul, div, sqrt)
    value: string
    type: 'operator'
    priority: number  // 0 for "+ -" , 1 for "x /"
    apply: (a: number, b: number) => number
    appendToString: (a: string, b?: string) => string  // String representation of operator and its operands
}

export function isOperator(object: any): object is IOperator {
    return (object) && ('type' in object) && (object.type === 'operator')
}

export interface IUnaryOperator {
    value: string
    type: 'unaryOperator'
    priority: number  // 2 for unary operators
    apply: (operand: number) => number
    appendToString: (operand: string) => string  // String representation of operator and its operands
}

export function isUnaryOperator(object: any): object is IUnaryOperator {
    return (object) && ('type' in object) && (object.type === 'unaryOperator')
}

