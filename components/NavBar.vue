<style>
    nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        /* refined frosted glass effect using design tokens */
        background: none;
        padding: 1rem;
        transition: var(--transition-normal);
        /* box-shadow: var(--shadow-sm); */
        
        /* 12-column grid */
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: var(--space-md);
        max-width: 100vw;
        padding-left: var(--space-xl);
        padding-right: var(--space-xl);
    }

    .nav-content {
        /* center 6 columns (4-9) */
        grid-column: 4 / 10;
        display: flex;
        align-items: center;
        gap: var(--space-md);
        border-radius: var(--radius-md);
    }

    nav input {
        background: var(--bg-secondary);
        color: var(--text-primary);
        border: 2px solid transparent;
        padding: 0.5rem 1rem 0.35rem 1rem;
        border-radius: var(--radius-md);
        flex: 1;
        transition: var(--transition-normal);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        font-family: var(--abordage);
        font-size: 0.9rem;
        box-shadow: var(--shadow-sm);
    }

    nav input::placeholder {
        border-radius: var(--radius-md);
        color: var(--text-secondary);
    }

    nav input:focus {
        outline: none;
        background: var(--hover-bg);
        box-shadow: var(--shadow-focus), var(--shadow-md);
        transform: translateY(-1px);
    }

    nav button {
        background: var(--bg-secondary);
        color: var(--text-primary);
        border: var(--gradient-navbar-border);
        padding: var(--space-sm) var(--space-md);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: var(--transition-normal);
        font-family: var(--abordage);
        font-size: 0.9rem;
        font-weight: 500;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: var(--shadow-sm);
        min-width: 44px; /* accessibility - minimum touch target */
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    nav button:hover {
        background: var(--hover-bg);
        border-image: var(--gradient-button-hover) 1;
        box-shadow: var(--shadow-md);
        transform: translateY(-1px);
    }

    nav button:active {
        transform: translateY(0);
        box-shadow: var(--shadow-sm);
        transition: var(--transition-fast);
    }

    .menu-button {
        background: var(--bg-secondary);
        color: var(--text-primary);
        border: var(--gradient-navbar-border);
        padding: var(--space-sm);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: var(--transition-normal);
        font-family: var(--abordage);
        font-size: 0.9rem;
        font-weight: 500;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: var(--shadow-sm);
        min-width: 44px; /* accessibility - minimum touch target */
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .menu-button:hover {
        background: var(--hover-bg);
        border-image: var(--gradient-button-hover) 1;
        box-shadow: var(--shadow-md);
        transform: translateY(-1px);
    }

    nav .theme-toggle {
        background: var(--bg-secondary) !important;
        color: var(--text-primary) !important;
        padding: var(--space-xs) !important;
        border: var(--gradient-navbar-border);
        border-radius: var(--radius-sm) !important;
        box-shadow: var(--shadow-inner) !important;
    }

    nav .theme-toggle:hover {
        box-shadow: var(--shadow-colored) !important;
        background: var(--hover-bg) !important;
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
        padding-top: calc(var(--space-4xl) + var(--space-md)); /* dynamic based on spacing tokens */
    }

    /* enhanced accessibility */
    nav input:focus-visible,
    nav button:focus-visible {
        outline: 2px solid var(--accent-color);
        outline-offset: 2px;
    }

    .shake {
        animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        perspective: 1000px;
    }

    @keyframes shake {
        10%, 90% {
            transform: translate3d(-1px, 0, 0);
        }
        20%, 80% {
            transform: translate3d(2px, 0, 0);
        }
        30%, 50%, 70% {
            transform: translate3d(-4px, 0, 0);
        }
        40%, 60% {
            transform: translate3d(4px, 0, 0);
        }
    }

    .loading-bar {
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--accent-color-translucent, rgba(var(--accent-color-rgb), 0.3));
        overflow: hidden;
    }

    .loading-bar::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--accent-color);
        animation: loading-shimmer 0.3s infinite linear;
    }

    @keyframes loading-shimmer {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }

    .department-selector-container {
        grid-column: 1 / -1;
        position: relative;
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
    <nav :class="{ shake: noResults }">
        <div class="nav-content">
            <button class="menu-button" @click="isMenuOpen = true">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div style="position: relative; flex: 1;">
                <input type="text" v-model="searchQuery" @keydown.enter="performSearch" placeholder="search across met collection..." />
                <div v-if="isLoading" class="loading-bar"></div>
            </div>
            <button @click="performSearch">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            <button @click="toggleDepartmentSelector">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="4" y1="21" y2="14"></line><line x1="4" x2="4" y1="10" y2="3"></line><line x1="12" x2="12" y1="21" y2="12"></line><line x1="12" x2="12" y1="8" y2="3"></line><line x1="20" x2="20" y1="21" y2="16"></line><line x1="20" x2="20" y1="12" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
            </button>
        </div>
        <div class="department-selector-container">
            <DepartmentSelector :is-open="isDepartmentSelectorOpen" @selection-change="handleDepartmentSelection" />
        </div>
    </nav>
    <SideMenu :is-open="isMenuOpen" @close="isMenuOpen = false" />
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { useSearchStore } from '~/stores/search';

const props = defineProps({
    noResults: {
        type: Boolean,
        default: false
    },
    isLoading: {
        type: Boolean,
        default: false
    }
});

const isMenuOpen = ref(false);
const searchQuery = ref('');
const isDepartmentSelectorOpen = ref(false);
const selectedDepartments = ref<number[]>([]);
const emit = defineEmits(['search']);

const searchStore = useSearchStore();

function toggleDepartmentSelector() {
    isDepartmentSelectorOpen.value = !isDepartmentSelectorOpen.value;
    console.log(`[met-gallery-nav]$ department selector toggled. open: ${isDepartmentSelectorOpen.value}`);
}

function handleDepartmentSelection(departments: number[]) {
    console.log(`[met-gallery-nav]$ received department selection:`, departments);
    selectedDepartments.value = departments;
    // only perform search if there's also a query, or let the user press search
}

const performSearch = () => {
    const query = searchQuery.value.trim();
    const depts = selectedDepartments.value;

    // only emit search if there is a query or at least one department is selected.
    if (query.length > 0 || depts.length > 0) {
        console.log(`[met-gallery]$ emitting search event for query: "${query}" with departments:`, depts);
        emit('search', { query: query, departments: depts });
    } else {
        console.log('[met-gallery]$ search query and department selection are empty, not emitting search.');
        // here you could potentially trigger the shake animation directly if you want to indicate an invalid search attempt
    }
};

// TODO: no need to search in departments straight away
// [met-gallery]$ no object ids found for query "" index.vue:145:17
// [met-gallery]$ current index reset to 0 index.vue:179:13
// [met-gallery]$ no artworks found for "", stopping fetch.
</script>



