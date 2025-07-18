<style>
nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: none;
    padding: 1rem;
    /* box-shadow: var(--shadow-sm); */

    /* 12-column grid */
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: var(--space-md);
    max-width: 100vw;
    padding-left: var(--space-xl);
    padding-right: var(--space-xl);
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
}

nav.fade-long {
    opacity: 0.1;
    transition: opacity 30s linear;
}

nav.fade-short {
    opacity: 0.1;
    transition: opacity 10s linear;
}

nav.visible {
    opacity: 0.95;
    transition: opacity 0.3s ease-in;
}

.nav-content {
    grid-column: 4 / 10;
    display: flex;
    align-items: center;
    gap: var(--space-md);
    border-radius: var(--radius-md);
}

#search-input-container {
    position: relative;
    flex: 1;
    display: flex;
    background: var(--bg-transparent);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    /* border: 1px solid var(--border-color); */
}

#search-icon {
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

nav input {
    min-height: 44px;
    background: transparent;
    color: var(--text-primary);
    border: none;
    padding: 0.5rem 1rem 0.35rem 1rem;
    border-radius: var(--radius-md) 0 0 var(--radius-md);
    flex: 1;
    transition: var(--transition-normal);
    font-size: 0.9rem;
}

nav input::placeholder {
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    transition: color 0.3s ease;
}

nav input:focus::placeholder {
    color: transparent;
}

nav input:focus {
    outline: none;
    background: var(--hover-bg);
}

#search-input-container:focus-within {
    box-shadow: var(--shadow-focus), var(--shadow-md);
}

nav button {
    background: transparent;
    color: var(--text-primary);
    border: none;
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition-normal);
    font-size: 0.9rem;
    font-weight: 500;
    min-width: 44px;
    /* accessibility - minimum touch target */
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
}

nav button:hover {
    background: var(--hover-bg);
}

nav button:active {
    transform: translateY(0);
    transition: var(--transition-fast);
}

.menu-button,
.filter-button {
    background: var(--bg-transparent);
    color: var(--text-primary);
    /* border: 1px solid var(--border-color); */
    padding: var(--space-sm);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition-normal);
    font-size: 0.9rem;
    font-weight: 500;
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    box-shadow: var(--shadow-sm);
    min-width: 44px;
    /* accessibility - minimum touch target */
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.menu-button:hover,
.filter-button:hover {
    background: var(--hover-bg);
    box-shadow: var(--shadow-md);
}


/* responsive design adjustments using spacing tokens */
@media (max-width: 768px) {
    nav {
        padding-left: var(--space-md);
        padding-right: var(--space-md);
    }

    .nav-content {
        grid-column: 2 / 12;
        gap: var(--space-sm);
    }

    nav input {
        font-size: 0.8rem;
        padding: var(--space-xs) var(--space-sm);
    }

    nav button {
        padding: var(--space-xs) var(--space-sm);
        font-size: 0.8rem;
    }
}

@media (max-width: 480px) {
    .nav-content {
        grid-column: 1 / 13;
    }
}

/* dynamic spacing for body content using design tokens */
:global(body) {
    padding-top: calc(var(--space-4xl) + var(--space-md));
    /* dynamic based on spacing tokens */
}

/* enhanced accessibility */
nav input:focus-visible,
nav button:focus-visible {
    outline: none;
    /* outline-offset: 2px; */
}

.shake {
    animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
}

@keyframes shake {

    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
        transform: translate3d(4px, 0, 0);
    }

    30%,
    50%,
    70% {
        transform: translate3d(-8px, 0, 0);
    }

    40%,
    60% {
        transform: translate3d(8px, 0, 0);
    }
}

.menu-button.loading-indicator {
    animation: pulse-shadow 0.2s infinite;
}

@keyframes pulse-shadow {
    0% {
        box-shadow: 0 0 0 0 rgba(var(--accent-color-rgb), 1);
    }
    70% {
        box-shadow: 0 0 0 4px rgba(var(--accent-color-rgb), 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(var(--accent-color-rgb), 0);
    }
}

.department-selector-container {
    grid-column: 10 / -1;
    position: absolute;
    margin-top: var(--space-md);
}

/* respect motion preferences */
@media (prefers-reduced-motion: reduce) {

    nav,
    nav input,
    nav button {
        transition: none;
    }

    nav input:focus,
    nav button:hover,
    nav button:active {
        transform: none;
    }
}
</style>

<template>
    <nav 
        :class="[navStateClass, { shake: noResults }]"
        @mouseenter="onNavEnter"
        @mouseleave="onNavLeave"
    >
        <div class="nav-content">
            <!-- menu button with terminal icon -->
            <button class="menu-button" :class="{ 'loading-indicator': isLoading }" @click="isMenuOpen = true">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="4 17 10 11 4 5"></polyline>
                    <line x1="12" y1="19" x2="20" y2="19"></line>
                </svg>
            </button>
            <div id="search-input-container">
                <input type="text" v-model="searchQuery" @keydown.enter="performSearch"
                    :placeholder="placeholder" @focus="onFocus" @blur="onBlur" ref="searchInput" />
                <button id="search-icon" @click="performSearch">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
            </div>
            <button class="filter-button" @click="toggleDepartmentSelector">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="4" x2="4" y1="21" y2="14"></line>
                    <line x1="4" x2="4" y1="10" y2="3"></line>
                    <line x1="12" x2="12" y1="21" y2="12"></line>
                    <line x1="12" x2="12" y1="8" y2="3"></line>
                    <line x1="20" x2="20" y1="21" y2="16"></line>
                    <line x1="20" x2="20" y1="12" y2="3"></line>
                    <line x1="1" y1="14" x2="7" y2="14"></line>
                    <line x1="9" y1="8" x2="15" y2="8"></line>
                    <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
            </button>
        </div>
        <div class="department-selector-container">
            <DepartmentSelector :is-open="isDepartmentSelectorOpen" @selection-change="handleDepartmentSelection" />
        </div>
    </nav>
    <Terminal :is-open="isMenuOpen" @close="isMenuOpen = false" />
</template>

<script setup lang="ts">
import { ref, defineEmits, onMounted, watch } from 'vue';
import { useSearchStore } from '~/stores/search';
import { gsap } from 'gsap';

const props = defineProps({
    noResults: {
        type: Boolean,
        default: false
    },
    isLoading: {
        type: Boolean,
        default: false
    },
    startFadeOut: {
        type: Boolean,
        default: false
    }
});

const isMenuOpen = ref(false);
const searchQuery = ref('');
const placeholder = ref('search across met collection...');
const originalPlaceholder = ref('');
const isDepartmentSelectorOpen = ref(false);
const selectedDepartments = ref<number[]>([]);
const emit = defineEmits(['search', 'initial-query-set']);
const searchInput = ref<HTMLInputElement | null>(null);


const navStateClass = ref(''); // can be 'visible', 'fade-long', 'fade-short'
const isInitialFadeTriggered = ref(false);
const isInitialFadeCompleted = ref(false);

watch(() => props.startFadeOut, (shouldStart) => {
    if (shouldStart && !isInitialFadeTriggered.value) {
        isInitialFadeTriggered.value = true;
        navStateClass.value = 'fade-long';
        setTimeout(() => {
            isInitialFadeCompleted.value = true;
            // if user is not hovering, the class should now be short
            if (navStateClass.value === 'fade-long') {
                navStateClass.value = 'fade-short';
            }
        }, 30000); // 30 seconds
    }
});

function onNavEnter() {
    if (isInitialFadeTriggered.value) {
        navStateClass.value = 'visible';
    }
}

function onNavLeave() {
    if (isInitialFadeTriggered.value) {
        if (isInitialFadeCompleted.value) {
            navStateClass.value = 'fade-short';
        } else {
            navStateClass.value = 'fade-long';
        }
    }
}

const searchTerms = [
    'andiron',
    'chair',
    'katana',
    'mask',
    'cat',
    'armor',
    'gun',
];

onMounted(() => {
    const randomQuery = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    placeholder.value = `i.e. ${randomQuery}`;
    originalPlaceholder.value = placeholder.value;
    emit('initial-query-set', { query: randomQuery, departments: [] });
});

function onFocus() {
    const tl = gsap.timeline();
    tl.to(searchInput.value, {
        duration: 0.2,
        onComplete: () => {
            placeholder.value = 'try a keyword you desire to see';
        }
    });
}

function onBlur() {
    if (!searchQuery.value) {
        const tl = gsap.timeline();
        tl.to(searchInput.value, {
            duration: 0.2,
            onComplete: () => {
                placeholder.value = originalPlaceholder.value;
            }
        });
    }
}

function toggleDepartmentSelector() {
    isDepartmentSelectorOpen.value = !isDepartmentSelectorOpen.value;
    console.log(`department selector toggled. open: ${isDepartmentSelectorOpen.value}`);
}

function handleDepartmentSelection(departments: number[]) {
    console.log(`received department selection:`, departments);
    selectedDepartments.value = departments;
    // only perform search if there's also a query, or let the user press search
}

const performSearch = () => {
    const query = searchQuery.value.trim();
    const depts = selectedDepartments.value;

    // only emit search if there is a query or at least one department is selected.
    if (query.length > 0 || depts.length > 0) {
        console.log(`emitting search event for query: "${query}" with departments:`, depts);
        emit('search', { query: query, departments: depts });
    } else {
        console.log('search query and department selection are empty, not emitting search.');
        // here you could potentially trigger the shake animation directly if you want to indicate an invalid search attempt
    }
};

// TODO: no need to search in departments straight away
// [met-gallery]$ no object ids found for query "" index.vue:145:17
// [met-gallery]$ current index reset to 0 index.vue:179:13
// [met-gallery]$ no artworks found for "", stopping fetch.
</script>
