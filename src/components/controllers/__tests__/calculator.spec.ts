/*
input: array of tokens

example: ["2", "3", "+", "2", "x", "2", "5", "sqrt", "="]

outputs: string with expression, result

example:
23 + 2 x √(25) =
33

inputted number is assembled in the result view
on entering an operator, number is appended to expression
on entering an unary operator, modified number is appended to expression
on entering a digit, it is appended to result
pressing = outputs result to result view

token array is fed to parser
1. first token must be a digit, if not, inserts 0 before it
2. if next token is a digit, append to current number
3. if last item is not a number, create new number
4. otherwise append operator
5. if number is followed by unary operator:
    - wrap number and operator into an Expression object that returns a number
6. if number is followed by "=" :
    - wrap last_number, operator and the number before into an Expression
7. if number is followed by a lower or equal priority operator (+ after + or after x):
    - wrap number-operator-number into an Expression
8. if number is followed by a higher priority operator:
    - continue parsing
9. if operator is followed by "=" :
    - ignore operator
*/

import { beforeEach, describe, expect, it } from "vitest";
import Calculator from "../calculator"

describe('Calculator', function () {
    const calculator = new Calculator();
    beforeEach(function () {
        calculator.clearAll();
    })
    it("preinserts 0", function () {
        calculator.pushToken(",");
        expect(calculator.stack[0].value).toBe("0");
        expect(calculator.stack[1].value).toBe(",");
    });

});