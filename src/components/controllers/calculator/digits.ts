class Digit {
    value: string;
    type: 'digit';
    constructor(value: string) {
        this.value = value
        this.type = 'digit';
    }
}
const digits = [
    new Digit("0"),
    new Digit("1"),
    new Digit("2"),
    new Digit("3"),
    new Digit("4"),
    new Digit("5"),
    new Digit("6"),
    new Digit("7"),
    new Digit("8"),
    new Digit("9"),
    new Digit(","),
] as Digit[];

export {digits, Digit};