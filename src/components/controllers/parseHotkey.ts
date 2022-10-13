export default function parseHotkey(key: string): string {
    /*
    Accepts KeyboardEvent.key and returns the appropriate
    token to use for the calculator.
    */
    switch (key) {
        case "Enter":
            return "return"
        case "=":
            return "return"
        case "Escape":
            return "clear"
        case "Clear":
            return "clear"
        case "+":
            return "add"
        case "-":
            return "sub"
        case "*":
            return "mul"
        case "/":
            return "div"
        case "Decimal":
            return ","
        case ".":
            return ","
        case "%":
            return "mod"
        default:
            return key
    }
}