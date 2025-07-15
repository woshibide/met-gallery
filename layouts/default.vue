<script setup>
import Podval from '~/components/Podval.vue';
import Notification from '~/components/Notification.vue';
</script>

<style>
.page-wrapper {
  display: flex;
  flex-direction: column;
}

main {
  min-height: 100vh;
  flex-grow: 1;
}
</style>

<template>
  <div class="page-wrapper">
    <Notification />
    <main>
      <NuxtPage />
    </main>
    <Podval />
  </div>
</template>
