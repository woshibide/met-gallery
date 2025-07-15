<template>
    <div class="gallery-separator">
        <span class="separator-line"></span>
        <div class="separator-content">
            <span class="separator-text">{{ query }}</span>
            <span v-if="isLoading" class="separator-subtext">loading...</span>
            <span
                v-else-if="resultCount !== null"
                class="separator-subtext"
                title="But you will only see here publicly available results that have images"
            >
                {{ formattedCount }} {{ resultText }}
            </span>
        </div>
        <span class="separator-line"></span>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { gsap } from 'gsap';

const props = defineProps({
    query: {
        type: String,
        required: true
    },
    departments: {
        type: Array as () => number[],
        default: () => []
    }
});

const resultCount = ref<number | null>(null);
const isLoading = ref(true);
const metApiBase = 'https://collectionapi.metmuseum.org/public/collection/v1';

const tweenedCount = ref(0);
const formattedCount = computed(() => Math.round(tweenedCount.value).toLocaleString());

const resultText = computed(() => {
    return resultCount.value === 1 ? 'result' : 'results';
});

watch(resultCount, (newValue) => {
    if (newValue !== null) {
        gsap.to(tweenedCount, { duration: 1, value: newValue, ease: 'power1.out' });
    }
});

async function fetchResultCount() {
    isLoading.value = true;
    let queryString = `hasImages=true&q=${encodeURIComponent(props.query)}`;
    if (props.departments && props.departments.length > 0) {
        queryString = `departmentIds=${props.departments.join('|')}&${queryString}`;
    }
    
    try {
        const response = await fetch(`${metApiBase}/search?${queryString}`);
        if (!response.ok) {
            throw new Error(`http error! status: ${response.status}`);
        }
        const data = await response.json();
        resultCount.value = data.total || 0;
    } catch (error) {
        console.error(`error fetching result count:`, error);
        resultCount.value = null;
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    fetchResultCount();
});
</script>

<style scoped>
.gallery-separator {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    margin-block: var(--space-xl);
    color: var(--text-secondary);
}

.gallery-separator .separator-line {
    flex-grow: 1;
    height: 1px;
    background-color: var(--border-color);
}

.separator-content {
    text-align: center;
    padding-inline: var(--space-md);
}

.gallery-separator .separator-text {
    text-transform: capitalize;
    font-family: var(--director-regular);
    font-size: 1rem;
}

.separator-subtext {
    display: block;
    font-family: var(--necto);
    font-size: 0.8rem;
    margin-top: var(--space-xs);
    color: var(--text-tertiary);
}
</style>
