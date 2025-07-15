<style>

footer{
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: var(--space-md);
    max-width: 100vw;
    padding: var(--space-xl);
}

footer p {
    grid-column: 1 / 6;
}

</style>

<template>
    <footer>
        <p>If you see this, chances are you made too many requests to <NuxtLink to="https://metmuseum.github.io/" target="_blank" rel="noopener" id="api-link">public API of MET</NuxtLink> Museum. But cooldown tends to be quick. Take a deep breath, check terminal for status, write <NuxtLink to="https://www.metmuseum.org/" target="_blank" rel="noopener" id="api-link">MET</NuxtLink> a message how awesome that their collection is publicly open, also to <NuxtLink to="https://wshbd.com/about" target="_blank" rel="noopener"> Pyotr Goloub </NuxtLink> for making this fantastic website, then try fetching some artworks again.</p>
    </footer>
</template>