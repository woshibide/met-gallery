<template>
    <div>
        <h1>page not found</h1>
        <p>the page you're looking for doesn't exist.</p>
        <NuxtLink to="/">go back to home</NuxtLink>
    </div>
</template>

<script setup lang="ts">

useHead({
    title: '404 - page not found'
})

</script>

<style scoped>
div {
    text-align: center;
    padding: 2rem;
}

h1 {
    color: var(--text-primary);
    margin-bottom: 1rem;
}

p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
}
</style>
