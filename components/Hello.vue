<style>
    #hero {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: var(--bg-primary);
        z-index: 2000;
        opacity: 0; /* initially hidden for gsap */
    }

    .hello-container{
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: var(--space-md);
        width: 80vw;
        max-width: 1200px;
        text-align: left;
    }

    .stroka {
        grid-row: 2;
        grid-column: 1 / 8;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .title {
        grid-column: 1 / span 8;
        font-size: 3rem;
        line-height: 1.2;
        font-weight: normal;
    }

    .subtitle {
        grid-column: 1 / span 8;
        font-size: 1rem;
        margin-right: var(--space-lg);
        color: var(--text-primary);
    }

    .explore-button {
        height: fit-content;
        padding: var(--space-sm) var(--space-md);
        background-color: var(--accent-color);
        color: var(--bg-primary);
        border: none;
        border-radius: var(--radius-md);
        font-size: 1rem;
        white-space: nowrap;
        cursor: pointer;
        transition: var(--transition-normal);
        box-shadow: var(--shadow-md);
    }

    .explore-button:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
    }
</style>
<template>
    <div id="hero">
        <div class="hello-container">
            <h1 class="title" key="title">This is a <i>better</i> interface for Met gallery.</h1>
            <div class="stroka" key="stroka">
                <p class="subtitle">This website is for creatives seeking striking images on plain backgrounds. All content is courtesy of The <NuxtLink to="https://www.metmuseum.org" target="_blank" rel="noopener" id="api-link">Met</NuxtLink>.</p>
                <button class="explore-button" @click="startHiding">Explore Gallery</button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { onMounted } from 'vue';
    import { gsap } from 'gsap';

    const emit = defineEmits(['startExploring']);

    onMounted(() => {
        const tl = gsap.timeline();
        tl.to("#hero", { opacity: 1, duration: 0.1 });
        tl.from(".title", { opacity: 0, y: 20, duration: 0.8, ease: "cubic-bezier(0.16, 1, 0.3, 1)" });
        tl.from(".stroka", { opacity: 0, y: 20, duration: 0.8, ease: "cubic-bezier(0.16, 1, 0.3, 1)" }, "-=0.65");
    });

    function startHiding() {
        gsap.to("#hero", {
            opacity: 0,
            duration: 0.5,
            ease: "cubic-bezier(0.16, 1, 0.3, 1)",
            onComplete: () => {
                emit('startExploring');
            }
        });
    }
</script>