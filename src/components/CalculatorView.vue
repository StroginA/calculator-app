<script lang="ts">
import Vue from 'vue';
import Calculator from './controllers/calculator/calculator';

export default Vue.extend({
    data() {
        return {
            digitTokens: [
                { ui: "7", token: "7" },
                { ui: "8", token: "8" },
                { ui: "9", token: "9" },
                { ui: "4", token: "4" },
                { ui: "5", token: "5" },
                { ui: "6", token: "6" },
                { ui: "1", token: "1" },
                { ui: "2", token: "2" },
                { ui: "3", token: "3" },
                { ui: "00", token: "double-zero" },
                { ui: "0", token: "0" },
                { ui: ",", token: "," },
            ],
                operatorTokens: [
                { ui: "√", token: "sqrt" },
                { ui: "%", token: "mod" },
                { ui: "/", token: "div" },
                { ui: "×", token: "mul" },
                { ui: "-", token: "sub" },
                { ui: "+", token: "add" },
            ],
            calculator: new Calculator(),
        }
    },
    methods: {
        handleClear() {
            this.calculator.clearAll();
        },
        handlePushToken(token: string) {
            // special cases go first
            if (token === "double-zero") {
                this.calculator.pushToken("0");
                this.calculator.pushToken("0");
            } else {
                this.calculator.pushToken(token);
            }
        },
        handleKeypress(e: KeyboardEvent) {
            e.preventDefault();  // To avoid Enter inputting the number
            switch (e.key) {
                case "Enter":
                    this.handlePushToken("return");
                    break;
                case "=":
                    this.handlePushToken("return");
                    break;
                case "Escape":
                    this.calculator.clearAll();
                    break;
                case "Clear":
                    this.calculator.clearAll();
                    break;
                case "Add":
                    this.handlePushToken("add");
                    break;
                case "Subtract":
                    this.handlePushToken("sub");
                    break;
                case "Multiply":
                    this.handlePushToken("mul");
                    break;
                case "Divide":
                    this.handlePushToken("div");
                    break;
                case "Decimal":
                    this.handlePushToken(",");
                    break;
                case "%":
                    this.handlePushToken("mod");
                    break;
                default:
                    this.handlePushToken(e.key);
            }
        }
    }
});
</script>

<template>
    <div class="calculator"
    v-on:keydown="handleKeypress">
        <div class="calculator__expression">{{calculator.stringify()}}</div>
        <div class="calculator__result">{{calculator.getCurrentResult()}}</div>
        <div class="calculator__buttons">
            <!--
                Buttons that do not modify the expression but instead
                are utility (clear, calculate, change mode) are declared
                out of the for loop
            -->
            <button class="calculator__button" @click="handleClear">C</button>
            <button class="calculator__button calculator__button_highlighted calculator__equals"
            @click="handlePushToken('return')">=</button>
            <div class="calculator__digits">
                <button 
                v-for="token in digitTokens" 
                class="calculator__button calculator__button_digit" 
                :key="token.token"
                @click="handlePushToken(token.token)">
                    {{token.ui}}
                </button>
            </div>
            <button 
            v-for="token in operatorTokens" 
            class="calculator__button" 
            :key="token.token"
            @click="handlePushToken(token.token)">
                {{token.ui}}
            </button>
        </div>
    </div>
</template>

<style scoped>
.calculator {
    background: linear-gradient(#28528f, #3976cf);
    padding: 1rem;
    color: #f2f2f2;
    display: flex;
    flex-direction: column;
}

.calculator__expression {
    margin-top: auto;
    text-align: end;
    font-size: 1.4rem;
    min-height: 1.4rem;
    font-weight: 400;
    margin-bottom: 0.5rem;
    word-break: break-all;
}

.calculator__result {
    text-align: end;
    font-size: 2rem;
    min-height: 2rem;
    font-weight: 700;
    border-bottom: 1px solid #7696c4;
    margin-bottom: 0.5rem;
    word-break: break-all;
}


.calculator__button {
    background-color: transparent;
    color: inherit;
    font-size: 1.6rem;
    height: 3rem;
    width: 3rem;
    text-align: center;
    vertical-align: middle;
    border: 0;
    padding: 0;
    border-radius: 9999px;
}
.calculator__button:hover {
    background-color: #4b79be;
    cursor: pointer;
}
.calculator__button:active {
    background-color: #6b99de;
    cursor: pointer;
}
.calculator__button_highlighted {
    background-color: #f2f2f2;
    color: #28528f;
}
.calculator__button_highlighted:hover {
    background-color: #d2d2d2;
}
.calculator__button_highlighted:active {
    background-color: #b2b2b2;
}

.calculator__buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 1rem;
}

.calculator__digits {
    grid-area: -5 / 1 / -1 / 4;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 1rem;
    
}

.calculator__equals {
    grid-area: auto / auto / -1 / -1;
}
</style>