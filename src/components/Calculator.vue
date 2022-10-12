<script setup lang="ts">
import { computed, reactive, readonly, ref } from 'vue';
import Calculator from './controllers/calculator/calculator';

// Maps visual representation of buttons to tokens, as well as order of buttons
const digitTokens = [
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
]
const operatorTokens = [
    { ui: "√", token: "sqrt" },
    { ui: "%", token: "mod" },
    { ui: "/", token: "div" },
    { ui: "×", token: "mul" },
    { ui: "-", token: "sub" },
    { ui: "+", token: "add" },
]

const calculator = reactive(new Calculator());

const handleClear = () => {
    calculator.clearAll();
}

const handlePushToken = (token: string) => {
    // special cases go first
    if (token === "double-zero") {
        calculator.pushToken("0");
        calculator.pushToken("0");
    } else {
        calculator.pushToken(token);
    }
}

const expressionString = ref(calculator.stringify());
const resultString = ref(calculator.getCurrentResult());

</script>

<template>
    <div class="calculator">
        <div class="calculator__expression">{{expressionString}}</div>
        <div class="calculator__result">{{resultString}}</div>
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
}

.calculator__expression {
    text-align: end;
    font-size: 1.4rem;
    min-height: 1.4rem;
    font-weight: 400;
    margin-bottom: 0.5rem;
}

.calculator__result {
    text-align: end;
    font-size: 2rem;
    min-height: 2rem;
    font-weight: 700;
    border-bottom: 1px solid #7696c4;
    margin-bottom: 0.5rem;
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