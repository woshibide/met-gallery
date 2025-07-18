<style>
.department-selector {
    background: var(--bg-transparent);
    padding: var(--space-md);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    margin-top: var(--space-sm);
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
}

.department-chip {
    font-family: 'Necto', monospace;
    background: var(--bg-primary);
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    padding: calc(var(--space-xs) * 1.4) var(--space-md) var(--space-xs) var(--space-md); 
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: 0.75rem;
}

.department-chip:hover {
    background: var(--hover-bg);
    transform: translateY(-1px);
}

.department-chip.selected {
    background: var(--accent-color);
    color: var(--bg-primary);
    border-color: var(--accent-color);
    font-weight: 500;
}
</style>

<template>
    <div v-if="isOpen" class="department-selector">
        <span>Department list</span>
        <div 
            v-for="dept in departments" 
            :key="dept.departmentId" 
            class="department-chip"
            :class="{ 'selected': isSelected(dept.departmentId) }"
            @click="toggleDepartment(dept.departmentId)">
            {{ dept.displayName }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';

const props = defineProps({
    isOpen: Boolean,
});

const emit = defineEmits(['selection-change']);

const departments = ref([]);
const selectedDepartments = ref([]);

async function fetchDepartments() {
    console.log(`fetching departments...`);
    try {
        const response = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments');
        if (!response.ok) {
            throw new Error(`http error! status: ${response.status}`);
        }
        const data = await response.json();
        departments.value = data.departments || [];
        console.log(`fetched ${departments.value.length} departments.`);
    } catch (error) {
        console.error(`failed to fetch departments:`, error);
    }
}

function toggleDepartment(departmentId) {
    console.log(`toggling department id: ${departmentId}`);
    const index = selectedDepartments.value.indexOf(departmentId);
    if (index > -1) {
        selectedDepartments.value.splice(index, 1);
    } else {
        selectedDepartments.value.push(departmentId);
    }
    console.log(`selected departments:`, selectedDepartments.value);
    emit('selection-change', selectedDepartments.value);
}

function isSelected(departmentId) {
    return selectedDepartments.value.includes(departmentId);
}

onMounted(fetchDepartments);
</script>
