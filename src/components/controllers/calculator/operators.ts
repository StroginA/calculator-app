import type { IOperator } from "./types";

export default [
    {
        value: "add",
        priority: 0,
        apply: (a, b) => {
            return a + b
        }
    },
    {
        value: "sub",
        priority: 0,
        apply: (a, b) => {
            return a - b
        }
    },
    {
        value: "mul",
        priority: 1,
        apply: (a, b) => {
            return a * b
        }
    },
    {
        value: "div",
        priority: 1,
        apply: (a, b) => {
            return a / b
        }
    },
] as IOperator[];