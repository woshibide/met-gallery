<style>
    #hero {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #hero p{
        width: 65ch;
        font-size: 1rem;
    }

    #gallery-wall {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: var(--space-md);
        max-width: 100vw;
        padding-left: var(--space-xl);
        padding-right: var(--space-xl);
        min-height: 100vh;
    }

    #gallery-wall > div {
        overflow: hidden;
        position: relative;
    }

    #gallery-wall img {
        width: 100%;
        height: 80vh;
        object-fit: cover;
    }

    .artwork-title {
        position: relative;
        bottom: 0;
        left: 0;
        color: var(--text-primary);
        /* padding: var(--space-sm); */
        width: 100%;
        text-align: left;
        margin-bottom: 10vh;
    }

    .controls {
        padding: var(--space-xl);
        display: flex;
        justify-content: center;
        gap: var(--space-md);
        position: relative;
    }

    .loader {
        border: 4px solid transparent;
        border-left-color: var(--text-primary);
        border-radius: 50%;
        width: 60vh;
        height: 60vh;
        animation: spin 1s linear infinite;
        position: absolute;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .gallery-item-enter-active,
    .gallery-item-leave-active {
        transition: all 1s var(--transition-normal);
    }
    .gallery-item-enter-from,
    .gallery-item-leave-to {
        opacity: 0;
        transform: translateY(2rem);
    }

</style>

<template>
    <section>
        <NavBar />
        <div id="hero">
            <h1>this is a better interface for met museum gallery</h1>
            <p>this website exists for creatives who are looking for cool images against plain background</p>
        </div>
    </section>
    <transition-group name="gallery-item" tag="section" id="gallery-wall">
        <div v-for="artwork in artworks" :key="artwork.objectID" :style="{ 'grid-column': artwork.gridColumn }">
            <img v-if="!artwork.isSpacer" :src="artwork.primaryImageSmall" :alt="artwork.title">
            <p v-if="!artwork.isSpacer" class="artwork-title">{{ artwork.title }}</p>
        </div>
    </transition-group>
    <div class="controls">
        <div class="loader" v-if="isLoading"></div>
        <button @click="fetchArtworks(1)" :disabled="isLoading">Fetch 1 More</button>
        <button @click="fetchArtworks(20)" :disabled="isLoading">Fetch 20 More</button>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const objectIDs = ref<number[]>([]);
const artworks = ref<any[]>([]);
const currentIndex = ref(0);
const isLoading = ref(false);

const metApiBase = 'https://collectionapi.metmuseum.org/public/collection/v1';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getObjectIDs() {
    const response = await fetch(`${metApiBase}/search?departmentId=10&hasImages=true&q=cat`);
    const data = await response.json();
    if (data.objectIDs) {
        objectIDs.value = data.objectIDs;
    }
}

async function fetchArtworks(count: number) {
  isLoading.value = true;
  if (objectIDs.value.length === 0 || currentIndex.value + count > objectIDs.value.length) {
    await getObjectIDs();
    currentIndex.value = 0;
  }

  const idsToFetch = objectIDs.value.slice(currentIndex.value, currentIndex.value + count);
  currentIndex.value += count;

  const newArtworksPromises = idsToFetch.map(async (id, index) => {
    await sleep(index * 100); // respectful delay
    const response = await fetch(`${metApiBase}/objects/${id}`);
    const artworkData = await response.json();
    if (artworkData.primaryImageSmall) {
      const span = Math.floor(Math.random() * 4) + 2;
      return { ...artworkData, gridColumn: `span ${span}` };
    }
    return null;
  });

  const newArtworks = (await Promise.all(newArtworksPromises)).filter(Boolean);
  const itemsToAdd = [];
  for (const artwork of newArtworks) {
    itemsToAdd.push(artwork);
    const spacerSpan = Math.floor(Math.random() * 5);
    if (spacerSpan > 0) {
      itemsToAdd.push({
        objectID: `spacer-${artwork.objectID}-${Math.random()}`,
        isSpacer: true,
        gridColumn: `span ${spacerSpan}`,
      });
    }
  }
  artworks.value.push(...itemsToAdd);
  isLoading.value = false;
}

onMounted(async () => {
  await fetchArtworks(2);
});
</script>
