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
    <nav>
        <div class="nav-content">
            <button class="menu-button" @click="isMenuOpen = true">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <input type="text" placeholder="search across met collection..." />
        </div>
    </nav>
    <SideMenu :is-open="isMenuOpen" @close="isMenuOpen = false" />
</template>

<script setup>
import { ref } from 'vue';
import SideMenu from './SideMenu.vue';

const isMenuOpen = ref(false);
</script>
