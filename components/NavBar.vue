<style>
    nav {
        background-color: var(--bg-secondary);
        border-bottom: 1px solid var(--border-color);
        padding: 1rem 2rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    nav input {
        background-color: var(--bg-primary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        padding: 0.5rem 1rem;
        border-radius: 4px;
        flex: 1;
        transition: all 0.3s ease;
    }

    nav input::placeholder {
        color: var(--text-secondary);
    }

    nav input:focus {
        outline: none;
        border-color: var(--accent-color);
        box-shadow: 0 0 0 2px rgba(var(--accent-color), 0.1);
    }

    nav button {
        background-color: var(--accent-color);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: var(--abordage);
    }

    nav button:hover {
        opacity: 0.9;
    }

    nav .theme-toggle {
        background: none !important;
        color: var(--text-primary) !important;
        padding: 0.5rem !important;
    }
</style>

<template>
    <nav>
        <input type="text" placeholder="search across MET collection..." />

        <ClientOnly>
            <ColorScheme />
        </ClientOnly>
    </nav>
</template>

<script setup>
// removed debug console.log for cleaner code
</script>
