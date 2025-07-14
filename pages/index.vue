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
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-sm);
        max-width: 100vw;
        padding-left: var(--space-xl);
        padding-right: var(--space-xl);
        min-height: 100vh;
    }

    #gallery-wall > div {
        overflow: hidden;
        position: relative;
    }

    .gallery-spacer, .gallery-artwork {
        margin-block: var(--space-xl);
    }

    #gallery-wall img {
        width: 100%;
        height: auto;
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
        <NavBar @search="handleSearch" :no-results="noResults" :is-loading="isLoading" />
        <div id="hero">
            <h1>this is a better interface for met museum gallery</h1>
            <p>this website exists for creatives who are looking for cool images against plain background</p>
        </div>
    </section>
    <transition-group name="gallery-item" tag="section" id="gallery-wall">
        <div 
            v-for="artwork in artworks" 
            :key="artwork.objectID" 
            :style="{ 'grid-column': artwork.gridColumn }"
            :class="artwork.isSpacer ? 'gallery-spacer' : 'gallery-artwork'"
        >
            <!-- show image and title only for artworks, not spacers -->
            <a v-if="!artwork.isSpacer" :href="artwork.highResUrl" target="_blank">
                <img :src="artwork.primaryImageSmall" :alt="artwork.title">
            </a>
            <!-- TODO: sanitize displayed text i.e. Sword Stand (<i>Katana Kake</i>) -->
            <p v-if="!artwork.isSpacer" class="artwork-title">{{ artwork.title }}</p>
        </div>
    </transition-group>
    <div class="controls">
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const objectIDs = ref<number[]>([]);
const artworks = ref<any[]>([]);
const currentIndex = ref(0);
const isLoading = ref(false);
const currentQuery = ref('cat'); // default query
const selectedDepartments = ref<number[]>([]);
const noResults = ref(false);

const logPrefix = '[met-gallery]$';

const metApiBase = 'https://collectionapi.metmuseum.org/public/collection/v1';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getObjectIDs(retries = 3) {
    let queryString = `hasImages=true&q=${encodeURIComponent(currentQuery.value)}`;
    if (selectedDepartments.value.length > 0) {
        queryString = `departmentIds=${selectedDepartments.value.join('|')}&${queryString}`;
    }
    console.log(`${logPrefix} fetching object ids for query: "${currentQuery.value}" with departments: ${selectedDepartments.value.join(', ')}...`);
    
    try {
        const response = await fetch(`${metApiBase}/search?${queryString}`);
        console.log(`${logPrefix} GET ${response.url} ${response.status}`);
        if (!response.ok) {
            throw new Error(`http error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.objectIDs && data.objectIDs.length > 0) {
            objectIDs.value = data.objectIDs;
            console.log(`${logPrefix} received ${data.objectIDs.length} object ids for query "${currentQuery.value}"`);
        } else {
            objectIDs.value = []; // clear previous results
            noResults.value = true;
            setTimeout(() => noResults.value = false, 500); // remove class after animation
            console.log(`${logPrefix} no object ids found for query "${currentQuery.value}"`);
        }
    } catch (error) {
        console.error(`${logPrefix} error fetching object ids:`, error);
        if (retries > 0) {
            console.log(`${logPrefix} retrying... (${retries - 1} left)`);
            await sleep(1000); // wait 1s before retry
            return getObjectIDs(retries - 1);
        }
        objectIDs.value = []; // clear previous results
        noResults.value = true;
        setTimeout(() => noResults.value = false, 500); // remove class after animation
    }
}

async function handleSearch(searchParams: { query: string, departments: number[] }) {
    console.log(`${logPrefix} handling search for query: "${searchParams.query}" and departments:`, searchParams.departments);
    noResults.value = false; // reset on new search
    
    const queryChanged = searchParams.query !== currentQuery.value;
    const departmentsChanged = JSON.stringify(searchParams.departments) !== JSON.stringify(selectedDepartments.value);

    if (!queryChanged && !departmentsChanged) {
        console.log(`${logPrefix} search query and departments are the same as current, ignoring`);
        return;
    }
    
    artworks.value = [];
    currentIndex.value = 0;
    currentQuery.value = searchParams.query;
    selectedDepartments.value = searchParams.departments;
    objectIDs.value = []; // clear old object ids for new search
    
    await fetchArtworks(5);
}

async function fetchArtworks(count: number) {
  console.log(`${logPrefix} fetchartworks called with count: ${count}`);
  isLoading.value = true;
  console.log(`${logPrefix} loading state set to true`);
  
  // if objectids is empty, it's a new search or initial load
  if (objectIDs.value.length === 0) {
    console.log(`${logPrefix} objectid cache empty, filling for query "${currentQuery.value}"...`);
    await getObjectIDs();
    currentIndex.value = 0; // reset index for new query results
    console.log(`${logPrefix} current index reset to 0`);
  } else if (currentIndex.value + count > objectIDs.value.length) {
    console.log(`${logPrefix} not enough objectids in cache, no more pages to load for this query.`);
    isLoading.value = false;
    return; // no more items to fetch
  }

  if (objectIDs.value.length === 0) {
      console.log(`${logPrefix} no artworks found for "${currentQuery.value}", stopping fetch.`);
      isLoading.value = false;
      return;
  }

  const idsToFetch = objectIDs.value.slice(currentIndex.value, currentIndex.value + count);
  currentIndex.value += count;
  console.log(`${logPrefix} fetching details for ${idsToFetch.length} artworks`);

  const newArtworksPromises = idsToFetch.map(async (id, index) => {
    await sleep(index * 100); // respectful delay
    console.log(`${logPrefix} fetching artwork with id: ${id}`);
    try {
        const response = await fetch(`${metApiBase}/objects/${id}`);
        console.log(`${logPrefix} GET ${response.url} ${response.status}`);
        if (!response.ok) {
            throw new Error(`http error! status: ${response.status}`);
        }
        const artworkData = await response.json();
        if (artworkData.primaryImageSmall) {
          const span = Math.floor(Math.random() * 3) + 1;
          const highResUrl = artworkData.primaryImage || artworkData.primaryImageSmall;
          console.log(`${logPrefix} artwork ${id} processed, assigning grid span: ${span}, high-res: ${!!artworkData.primaryImage}`);
          return { ...artworkData, gridColumn: `span ${span}`, highResUrl };
        }
        console.log(`${logPrefix} artwork ${id} has no primary image, skipping`);
        return null;
    } catch (error) {
        console.error(`${logPrefix} failed to fetch artwork ${id}:`, error);
        return null;
    }
  });

  const newArtworks = (await Promise.all(newArtworksPromises)).filter(Boolean);
  console.log(`${logPrefix} successfully fetched and processed ${newArtworks.length} new artworks`);
  const itemsToAdd = [];
  for (const artwork of newArtworks) {
    itemsToAdd.push(artwork);
    const spacerSpan = Math.floor(Math.random() * 5);
    if (spacerSpan > 0) {
      console.log(`${logPrefix} adding spacer with span: ${spacerSpan}`);
      itemsToAdd.push({
        objectID: `spacer-${artwork.objectID}-${Math.random()}`,
        isSpacer: true,
        gridColumn: `span ${spacerSpan}`,
      });
    }
  }
  artworks.value.push(...itemsToAdd);
  console.log(`${logPrefix} added ${itemsToAdd.length} items to gallery wall`);
  isLoading.value = false;
  console.log(`${logPrefix} loading state set to false`);
}

const handleScroll = () => {
  if (isLoading.value) return;

  // fetch when user is 1000px from the bottom of the page
  const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000;

  if (nearBottom) {
    console.log(`${logPrefix} scrolled near bottom, fetching more artworks`);
    fetchArtworks(3);
  }
};

onMounted(async () => {
  console.log(`${logPrefix} component mounted, starting initial fetch`);
  await fetchArtworks(5);
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
