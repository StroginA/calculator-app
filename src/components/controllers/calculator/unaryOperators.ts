import type { IUnaryOperator } from "./types";

export default [
    {
        value: "sqrt",
        priority: 2,
        apply: (operand) => {
            return Math.sqrt(operand)
        }
    },
] as IUnaryOperator[];