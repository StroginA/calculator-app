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
        expect(calculator.stringify()).toBe("0,");
        calculator.clearAll();
        calculator.pushToken('add');
        expect(calculator.stringify()).toBe("0+");
    });
    it("correctly appends and stringifies expressions", function () {
        calculator.pushToken("1");
        calculator.pushToken("add");
        calculator.pushToken("2");
        calculator.pushToken("sqrt");
        calculator.pushToken("add");
        calculator.pushToken("3");
        expect(calculator.parsedStack?.toString()).toBe("1+√(2)+3");
    })
    it("strips dangling decimals", function () {
        calculator.pushToken("1");
        calculator.pushToken(",");
        calculator.pushToken("add");
        calculator.pushToken("2");
        calculator.pushToken(",");
        calculator.pushToken("1");
        calculator.pushToken("add");
        calculator.pushToken(",");
        expect(calculator.stringify()).toBe("1+2,1+0,");
    })
    it("calculates simple expressions", function () {
        // 5 + 5 - 4 = 6
        calculator.pushToken("5");
        calculator.pushToken("add");
        calculator.pushToken("5");
        calculator.pushToken("sub");
        calculator.pushToken("4");
        expect(calculator.calculate()).toBe(6);
    })
    it("stringifies simple expressions", function () {
        // 5 + 5 - 4 = 6
        calculator.pushToken("5");
        calculator.pushToken("add");
        calculator.pushToken("5");
        calculator.pushToken("sub");
        calculator.pushToken("4");
        expect(calculator.stringify()).toBe("5+5-4");
    })
    it("calculates expressions with 2 tiers of priority", function () {
        // 1 + 5 * 4 - 4 / 2 = 19
        calculator.pushToken("1");
        calculator.pushToken("add");
        calculator.pushToken("5");
        calculator.pushToken("mul");
        calculator.pushToken("4");
        calculator.pushToken("sub");
        calculator.pushToken("4");
        calculator.pushToken("div");
        calculator.pushToken("2");
        expect(calculator.calculate()).toBe(19);
    })
    it("stringifies expressions with 2 tiers of priority", function () {
        // 1 + 5 * 4 - 4 / 2 = 19
        calculator.pushToken("1");
        calculator.pushToken("add");
        calculator.pushToken("5");
        calculator.pushToken("mul");
        calculator.pushToken("4");
        calculator.pushToken("sub");
        calculator.pushToken("4");
        calculator.pushToken("div");
        calculator.pushToken("2");
        expect(calculator.stringify()).toBe("1+5×4-4/2");
    })
    it("calculates expressions with 3 tiers of priority", function () {
        // 1 + sqrt(25) * 4 - 4 / 2 = 19
        calculator.pushToken("1");
        calculator.pushToken("add");
        calculator.pushToken("1");
        calculator.pushToken("add");
        calculator.pushToken("2");
        calculator.pushToken("5");
        calculator.pushToken("sqrt");
        calculator.pushToken("mul");
        calculator.pushToken("4");
        calculator.pushToken("sub");
        calculator.pushToken("4");
        calculator.pushToken("div");
        calculator.pushToken("2");
        expect(calculator.calculate()).toBe(20);
    })
    it("stringifies expressions with 3 tiers of priority", function () {
        // 1 + sqrt(25) * 4 - 4 / 2 = 19
        calculator.pushToken("1");
        calculator.pushToken("add");
        calculator.pushToken("1");
        calculator.pushToken("add");
        calculator.pushToken("2");
        calculator.pushToken("5");
        calculator.pushToken("sqrt");
        calculator.pushToken("mul");
        calculator.pushToken("4");
        calculator.pushToken("sub");
        calculator.pushToken("4");
        calculator.pushToken("div");
        calculator.pushToken("2");
        expect(calculator.stringify()).toBe("1+1+√(25)×4-4/2");
    })
    it("calculates and stringifies nested unaries correctly", function () {
        calculator.pushToken("6");
        calculator.pushToken("5");
        calculator.pushToken("6");
        calculator.pushToken("1");
        calculator.pushToken("sqrt");
        calculator.pushToken("sqrt");
        calculator.pushToken("sqrt");
        expect(calculator.stringify()).toBe("√(√(√(6561)))");
        expect(calculator.calculate()).toBe(3);
    })
    it("replaces dangling operators", function () {
        calculator.pushToken("1");
        calculator.pushToken("add");
        calculator.pushToken("sub");
        expect(calculator.stringify()).toBe("1-");
    })
    it("returns correct main display string", function () {
        expect(calculator.getCurrentResult()).toBe("0");
        calculator.pushToken("1");
        expect(calculator.getCurrentResult()).toBe("1");
        calculator.pushToken("add");
        expect(calculator.getCurrentResult()).toBe("0");
        calculator.pushToken("1");
        calculator.pushToken(",");
        calculator.pushToken("5");
        calculator.pushToken("return");
        expect(calculator.getCurrentResult()).toBe("2,5");
    })
    it("returns correct calculation string when done", function () {
        calculator.pushToken("1");
        calculator.pushToken("add");
        calculator.pushToken("1");
        calculator.pushToken("return");
        expect(calculator.stringify()).toBe("1+1=");
    })
    it("replaces result with new input when done", function () {
        calculator.pushToken("1");
        calculator.pushToken("add");
        calculator.pushToken("1");
        calculator.pushToken("return");
        calculator.pushToken("5");
        expect(calculator.getCurrentResult()).toBe("5");
    })
    

});