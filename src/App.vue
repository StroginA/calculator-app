<script setup lang="ts">
import CalculatorView from "./components/CalculatorView.vue";
</script>

<template>
  <div id="app" class="app">
    <div class="app__wrapper">
      <CalculatorView class="app__calculator" />
    </div>
  </div>
</template>

<style scoped>
  .app {
    height: fit-content;
    min-height: 100vh;
    background-color: #fd9292;
    display: flex;
    justify-content: center;
  }
  .app__wrapper {
    display: flex;
    justify-content: center;
    background-color: #fca9a9;
    margin: 2rem auto;
    border-radius: 1rem;
    height: fit-content;
  }

  .app__calculator {
    margin: 2rem 1.5rem;
    border-radius: 1rem;
    height: fit-content;
    max-width: 20rem;
  }

  @media screen and (max-width: 768px) {
    .app__wrapper, .app__calculator {
      margin: 0;
      border-radius: 0;
      width: 100%;
    }
    .app__calculator {
      min-height: 100vh;
    }
  }
</style>
