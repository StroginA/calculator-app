<script setup lang="ts">
import Calculator from './controllers/calculator';

// Defines visual representation of buttons
const digitTokens = [
    "7",
    "8",
    "9",
    "4",
    "5",
    "6",
    "1",
    "2",
    "3",
    "00",
    "0",
    ",",
]
const operatorTokens = [
    "√",
    "%",
    "/",
    "×",
    "-",
    "+"
]

const calculator = new Calculator();

const handleClear = () => {
    calculator.clearStack();
}

const handlePushToken = (token: string) => {
    calculator.pushToken(token);
}
</script>

<template>
    <div class="calculator">
        <div class="calculator__expression">20*45*80</div>
        <div class="calculator__result">356</div>
        <div class="calculator__buttons">
            <!--
                Buttons that do not modify the expression but instead
                are utility (clear, calculate, change mode) are declared
                out of the for loop
            -->
            <button class="calculator__button" @click="handleClear">C</button>
            <button class="calculator__button calculator__button_highlighted calculator__equals">=</button>
            <div class="calculator__digits">
                <button 
                v-for="token in digitTokens" 
                class="calculator__button calculator__button_digit" 
                :key="token"
                @click="handlePushToken(token)">
                    {{token}}
                </button>
            </div>
            <button 
            v-for="token in operatorTokens" 
            class="calculator__button" 
            :key="token"
            @click="handlePushToken(token)">
                {{token}}
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
.calculator__button_highlighted {
    background-color: #f2f2f2;
    color: #28528f;
}
.calculator__button_highlighted:hover {
    background-color: #d2d2d2;
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