<script setup>
import Podval from '~/components/Podval.vue';
</script>

<style>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex-grow: 1;
}
</style>

<template>
  <div class="page-wrapper">
    <main>
      <NuxtPage />
    </main>
    <Podval />
  </div>
</template>
