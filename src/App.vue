<template>
  <div id="app">
    <trading-view></trading-view>
  </div>
</template>

<script>
import TradingView from '@/views/TradingView.vue';

export default {
  name: 'App',
  components: {
    TradingView,
  },
};
</script>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
