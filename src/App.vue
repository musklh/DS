<script lang="ts">
import { defineComponent } from 'vue';
import '@/access';
export default defineComponent({
  name: 'App',
});
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
/* Ensure the root application container takes up the full viewport.
   Other global styles (reset, body, fonts, colors) are now primarily handled in src/style.scss */
#app {
  width: 100%;
  height: 100vh;
  margin: 0; /* Explicitly ensure no margin */
  padding: 0; /* Explicitly ensure no padding */
  /* background-color will be inherited from body or set by layout components */
  /* color will be inherited from body */
}
</style>
