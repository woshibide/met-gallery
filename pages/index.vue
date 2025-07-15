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
    }

    #hero p{
        width: 65ch;
        font-size: 1rem;
    }

    #gallery-wall {
        margin-top: 50vh;
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
        background-color: aqua;
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

    .explore-button {
        margin-top: var(--space-lg);
        padding: var(--space-md) var(--space-xl);
        background-color: var(--accent-color);
        color: var(--bg-primary);
        border: none;
        border-radius: var(--radius-md);
        font-family: var(--director-regular);
        font-size: 1rem;
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
    <section>
        <NavBar @search="handleSearch" @initial-query-set="setInitialQuery" :no-results="noResults" :is-loading="isLoading" :start-fade-out="firstFetchCompleted" />
        <div id="hero" v-if="showIntro">
            <h1>this is a better interface for met museum gallery</h1>
            <p>this website exists for creatives who are looking for cool images against plain background</p>
            <button class="explore-button" @click="startExploring">explore met collection</button>
        </div>
    </section>
    <transition-group v-if="!showIntro" name="gallery-item" tag="section" id="gallery-wall">
        <div 
            v-for="artwork in artworks" 
            :key="artwork.objectID" 
            :id="artwork.isSeparator ? artwork.objectID : undefined"
            :style="{ 'grid-column': artwork.gridColumn }"
            :class="artwork.isSeparator ? 'gallery-separator-container' : (artwork.isSpacer ? 'gallery-spacer' : 'gallery-artwork')"
        >
            <gallery-separator v-if="artwork.isSeparator" :query="artwork.query" :departments="artwork.departments" />
            
            <!-- show image and title only for artworks, not spacers -->
            <a v-if="!artwork.isSpacer && !artwork.isSeparator" :href="artwork.highResUrl" target="_blank">
                <img :src="artwork.primaryImageSmall" :alt="artwork.title">
            </a>
            <!-- TODO: sanitize displayed text i.e. Sword Stand (<i>Katana Kake</i>), sometimes '--' exist -->
            <p v-if="!artwork.isSpacer && !artwork.isSeparator" class="artwork-title">{{ artwork.title }}</p>
        </div>
    </transition-group>
    
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import GallerySeparator from '~/components/GallerySeparator.vue';
import { useSearchStore } from '~/stores/search';

const objectIDs = ref<number[]>([]);
const artworks = ref<any[]>([]);
const currentIndex = ref(0);
const isLoading = ref(false);
const currentQuery = ref(''); // default query
const selectedDepartments = ref<number[]>([]);
const noResults = ref(false);
const showIntro = ref(true);
const firstFetchCompleted = ref(false);
const lastScrollY = ref(0);

const searchStore = useSearchStore();

watch(() => searchStore.fetchParams, (params) => {
  if (params) {
    console.log('fetch params changed, handling command from terminal', params);
    if (params.query) {
        handleSearch({ query: params.query, departments: selectedDepartments.value });
    } else {
        fetchArtworks(params.count);
    }
    searchStore.clearFetchParams(); // reset after handling
  }
});

const metApiBase = 'https://collectionapi.metmuseum.org/public/collection/v1';

function smoothScrollTo(targetPosition: number, duration: number) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    function easeInOutCubic(t: number): number {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animation(currentTime: number) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * easedProgress);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

function setInitialQuery(searchParams: { query: string, departments: number[] }) {
    currentQuery.value = searchParams.query;
    selectedDepartments.value = searchParams.departments;
    console.log(`initial query set to "${searchParams.query}"`);
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getObjectIDs(retries = 3) {
    let queryString = `hasImages=true&q=${encodeURIComponent(currentQuery.value)}`;
    if (selectedDepartments.value.length > 0) {
        queryString = `departmentIds=${selectedDepartments.value.join('|')}&${queryString}`;
    }
    console.log(`fetching object ids for query: "${currentQuery.value}" with departments: ${selectedDepartments.value.join(', ')}...`);
    
    try {
        const response = await fetch(`${metApiBase}/search?${queryString}`);
        console.log(`GET ${response.url} ${response.status}`);
        if (!response.ok) {
            throw new Error(`http error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.objectIDs && data.objectIDs.length > 0) {
            objectIDs.value = data.objectIDs;
            console.log(`received ${data.objectIDs.length} object ids for query "${currentQuery.value}"`);
        } else {
            objectIDs.value = []; // clear previous results
            noResults.value = true;
            setTimeout(() => noResults.value = false, 500); // remove class after animation
            console.log(`no object ids found for query "${currentQuery.value}"`);
        }
    } catch (error) {
        console.error(`error fetching object ids:`, error);
        if (retries > 0) {
            console.log(`retrying... (${retries - 1} left)`);
            await sleep(1000); // wait 1s before retry
            return getObjectIDs(retries - 1);
        }
        objectIDs.value = []; // clear previous results
        noResults.value = true;
        setTimeout(() => noResults.value = false, 500); // remove class after animation
    }
}

async function startExploring() {
    showIntro.value = false;
    // now that we have the initial query, we can perform the search
    if (currentQuery.value && artworks.value.length === 0) {
        await handleSearch({ query: currentQuery.value, departments: selectedDepartments.value });
    } else {
        console.log('no initial query set yet, or artworks already loading/loaded.');
    }
}

async function handleSearch(searchParams: { query: string, departments: number[] }) {
    console.log(`handling search for query: "${searchParams.query}" and departments:`, searchParams.departments);
    noResults.value = false; // reset on new search
    
    if (searchParams.query) {
        showIntro.value = false;
    }
    
    const queryChanged = searchParams.query !== currentQuery.value;
    const departmentsChanged = JSON.stringify(searchParams.departments) !== JSON.stringify(selectedDepartments.value);

    // when called from startExploring, the query is the same, so we need to bypass this check
    if (!queryChanged && !departmentsChanged && artworks.value.length > 0) {
        console.log(`search query and departments are the same as current, ignoring`);
        return;
    }
    
    // if it's a new search (not the initial one)
    if (artworks.value.length > 0) {
        const separatorId = `separator-${Date.now()}`;
        artworks.value.push({
            objectID: separatorId,
            isSeparator: true,
            query: searchParams.query || 'new search',
            departments: searchParams.departments,
            gridColumn: '1 / -1'
        });

        await nextTick();

        const separatorElement = document.getElementById(separatorId);
        if (separatorElement) {
            const topPos = separatorElement.offsetTop - (window.innerHeight * 0.2);
            smoothScrollTo(topPos, 800); // scroll over 800ms
        }
    }
    
    currentIndex.value = 0;
    currentQuery.value = searchParams.query;
    selectedDepartments.value = searchParams.departments;
    objectIDs.value = []; // clear old object ids for new search
    
    await fetchArtworks(5);
}

async function fetchArtworks(count: number) {
  console.log(`fetchartworks called with count: ${count}`);
  isLoading.value = true;
  console.log(`loading state set to true`);
  
  // if objectids is empty, it's a new search or initial load
  if (objectIDs.value.length === 0) {
    console.log(`objectid cache empty, filling for query "${currentQuery.value}"...`);
    await getObjectIDs();
    // currentIndex.value = 0; // reset index for new query results
    console.log(`current index reset to 0`);
  } else if (currentIndex.value + count > objectIDs.value.length) {
    console.log(`not enough objectids in cache, no more pages to load for this query.`);
    isLoading.value = false;
    return; // no more items to fetch
  }

  if (objectIDs.value.length === 0) {
      console.log(`no artworks found for "${currentQuery.value}", stopping fetch.`);
      isLoading.value = false;
      return;
  }

  const idsToFetch = objectIDs.value.slice(currentIndex.value, currentIndex.value + count);
  currentIndex.value += count;
  console.log(`fetching details for ${idsToFetch.length} artworks`);

  const newArtworksPromises = idsToFetch.map(async (id, index) => {
    await sleep(index * 100); // respectful delay
    console.log(`fetching artwork with id: ${id}`);
    try {
        const response = await fetch(`${metApiBase}/objects/${id}`);
        console.log(`GET ${response.url} ${response.status}`);
        if (!response.ok) {
            throw new Error(`http error! status: ${response.status}`);
        }
        const artworkData = await response.json();
        if (artworkData.primaryImageSmall) {
          const span = Math.floor(Math.random() * 3) + 1;
          const highResUrl = artworkData.primaryImage || artworkData.primaryImageSmall;
          console.log(`artwork ${id} ready, GSC: ${span}, high-res? ${!!artworkData.primaryImage}`);
          return { ...artworkData, gridColumn: `span ${span}`, highResUrl };
        }
        console.log(`artwork ${id} has no primary image, skipping`);
        return null;
    } catch (error) {
        console.error(`failed to fetch artwork ${id}:`, error);
        return null;
    }
  });

  const newArtworks = (await Promise.all(newArtworksPromises)).filter(Boolean);
  console.log(`fetched and processed ${newArtworks.length} new artworks`);
  const itemsToAdd = [];
  for (const artwork of newArtworks) {
    itemsToAdd.push(artwork);
    const spacerSpan = Math.floor(Math.random() * 4); // can be 0, 1, 2, 3
    if (spacerSpan > 0) {
      console.log(`adding spacer: ${spacerSpan}`);
      itemsToAdd.push({
        objectID: `spacer-${artwork.objectID}-${Math.random()}`,
        isSpacer: true,
        gridColumn: `span ${spacerSpan}`,
      });
    }
  }
  artworks.value.push(...itemsToAdd);
  console.log(`added ${itemsToAdd.length} items to gallery wall`);
  isLoading.value = false;
  if (!firstFetchCompleted.value && newArtworks.length > 0) {
    firstFetchCompleted.value = true;
    console.log('first fetch completed, nav bar fade-out can be triggered.');
  }
  console.log(`loading state set to false`);
}

const handleScroll = () => {
  if (isLoading.value) return;

  const currentScrollY = window.scrollY;
  const isScrollingDown = currentScrollY > lastScrollY.value;
  lastScrollY.value = currentScrollY;

  if (!isScrollingDown) return;

  // fetch when user is 1000px from the bottom of the page
  const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000;

  if (nearBottom) {
    console.log(`scrolled near bottom, fetching more artworks`);
    fetchArtworks(3);
  }
};

onMounted(async () => {
  console.log(`component mounted, awaiting user action to start exploring`);
  lastScrollY.value = window.scrollY;
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
