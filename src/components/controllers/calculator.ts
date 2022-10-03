interface CalculatorToken {
    value: string  // passed to pushStack and checked for in the operator list
    type: "digit" | "operator"
    concatToString: (prevString: string) => string  // defines the representation of the item in the operation string
    apply: null | 
    ((a: number, b: number) => number) | 
    ((operand: number) => number)  // defined
}

interface ICalculator {
    stack: CalculatorToken[]
    clearStack: () => void
    pushToken: (item: string) => void
    calculate: () => number
    stringify: () => string
}

export default class Calculator {
    static operators: CalculatorToken[] = [
        {
            value: "+",
            type: "operator",
            concatToString(prevString) {
                return prevString + "+"
            },
            apply(a, b) {
                return a + b
            },
        }
    ]
    
    stack: CalculatorToken[]
    constructor() {
        this.stack = []
    }

    clearStack() {
        this.stack = []
    }

    pushToken(token: string) {
        this.stack.push({
            value: token,
            type: "digit",
            concatToString(prevString) {
                return prevString + token
            },
            apply: null
        });
    }
}