import type { IUnaryOperator } from "./types";

export default [
    {
        value: "sqrt",
        apply: (operand) => {
            return Math.sqrt(operand)
        }
    },
] as IUnaryOperator[];